const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
const generateToken = require("../utils/generateToken");
const sendEmail = require("../utils/sendEmail");
const generateOTP = require("../utils/generateOTP");

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// ✅ Register a new user
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const emailToken = crypto.randomBytes(32).toString("hex");

    const user = await User.create({
      name,
      email,
      password,
      role: role || "customer",
      emailToken,
    });

    const verifyLink = `${FRONTEND_URL}/verify-email/${emailToken}`;

    await sendEmail({
      to: user.email,
      subject: "Verify your QuickBite email",
      name: user.name,
      body: `<p>Click below to verify:</p><a href="${verifyLink}">Verify Email</a>`,
    });

    res.status(201).json({
      message: "Registered successfully. Check your email to verify account.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Email verification
const verifyEmail = async (req, res) => {
  try {
    const user = await User.findOne({ emailToken: req.params.token });

    if (!user) return res.status(400).json({ message: "Invalid token" });

    // Mark as verified
    user.emailToken = null;
    user.isVerified = true;
    await user.save();

    // Generate token so user can continue registration without login
    const token = generateToken(user._id);

    res.status(200).json({
      message: "Email verified successfully!",
      token, // JWT
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔁 Resend email verification
const resendEmailVerification = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.isVerified)
      return res.status(400).json({ message: "Email already verified" });

    user.emailToken = crypto.randomBytes(32).toString("hex");
    await user.save();

    const verifyLink = `${FRONTEND_URL}/verify-email/${user.emailToken}`;
    await sendEmail({
      to: user.email,
      subject: "Verify your QuickBite email",
      name: user.name,
      body: `<p>Click below to verify:</p><a href="${verifyLink}">Verify Email</a>`,
    });

    res.status(200).json({ message: "Verification email resent" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Login with email & password
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const match = await user.matchPassword(password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    if (!user.isVerified)
      return res.status(401).json({ message: "Verify your email first" });

    res.status(200).json({
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔐 Token verification (AuthContext)
const verifyToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ user });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// 📲 Send OTP (Login via mobile/email)
const sendOTP = async (req, res) => {
  try {
    const { contact } = req.body; // email or phone
    const user = await User.findOne({
      $or: [{ email: contact }, { phone: contact }],
    });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiresAt = Date.now() + 5 * 60 * 1000; // 5 mins
    await user.save();

    await sendEmail({
      to: user.email,
      subject: "Your QuickBite OTP",
      name: user.name,
      body: `<p>Your OTP is: <strong>${otp}</strong></p>`,
    });

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔑 Verify OTP login
const verifyOTP = async (req, res) => {
  try {
    const { contact, otp } = req.body;

    const user = await User.findOne({
      $or: [{ email: contact }, { phone: contact }],
      otp,
      otpExpiresAt: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired OTP" });

    user.otp = null;
    user.otpExpiresAt = null;

    if (!user.isVerified) user.isVerified = true;
    await user.save();

    res.status(200).json({
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ❓ Forgot password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpires = Date.now() + 30 * 60 * 1000; // 30 minutes
    await user.save();

    const resetLink = `${FRONTEND_URL}/reset-password/${resetToken}`;

    await sendEmail({
      to: user.email,
      subject: "Reset your QuickBite password",
      name: user.name,
      body: `<p>Click to reset your password: <a href="${resetLink}">Reset Password</a></p>`,
    });

    res.status(200).json({ message: "Reset link sent to email" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔄 Reset password
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpires: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    user.password = newPassword;
    user.resetToken = null;
    user.resetTokenExpires = null;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔁 Change password (authenticated user)
const changePassword = async (req, res) => {
  try {
    const userId = req.user._id;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match)
      return res.status(401).json({ message: "Incorrect current password" });

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /auth/check-verification?email=<email>
const checkVerification = async (req, res) => {
  try {
    const { email } = req.query;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const response = { isVerified: user.isVerified };

    if (user.isVerified) {
      const token = generateToken(user._id);

      response.token = token;
      response.user = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      };
    }

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  register,
  verifyEmail,
  resendEmailVerification,
  login,
  verifyToken,
  sendOTP,
  verifyOTP,
  forgotPassword,
  resetPassword,
  changePassword,
  checkVerification,
};
