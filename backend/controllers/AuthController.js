const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
const Restaurant = require("../models/RestaurantModel"); // ✅ added
const generateToken = require("../utils/generateToken");
const sendEmail = require("../utils/sendEmail");
const generateOTP = require("../utils/generateOTP");

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// ✅ Register a new user
const register = async (req, res) => {
  try {
    console.log("📩 /api/auth/register called");
    console.log("Request body:", req.body);

    // ✅ Show all relevant environment variables
    console.log("Checking environment variables...");
    console.log({
      MONGO_URI: process.env.MONGO_URI ? "✅ Set" : "❌ Missing",
      JWT_SECRET: process.env.JWT_SECRET ? "✅ Set" : "❌ Missing",
      EMAIL_USER: process.env.EMAIL_USER ? "✅ Set" : "❌ Missing",
      EMAIL_PASS: process.env.EMAIL_PASS ? "✅ Set" : "❌ Missing",
      FRONTEND_URL,
    });

    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("❌ User already exists:", email);
      return res.status(400).json({ message: "User already exists" });
    }

    const emailToken = crypto.randomBytes(32).toString("hex");
    console.log("Generated email token:", emailToken);

    const user = await User.create({
      name,
      email,
      password,
      role: role || "customer",
      emailToken,
    });

    const verifyLink = `${FRONTEND_URL}/verify-email/${emailToken}`;
    console.log("Verification link:", verifyLink);

    console.log("📤 Sending verification email to:", user.email);
    await sendEmail({
      to: user.email,
      subject: "Verify your QuickBite email",
      name: user.name,
      body: `<p>Click below to verify your account:</p>
             <a href="${verifyLink}" target="_blank">Verify Email</a>`,
    });

    console.log("✅ Email sent successfully!");
    res.status(201).json({
      message: "Registered successfully. Check your email to verify account.",
    });
  } catch (error) {
    console.error("❌ Error in register controller:", error.message);
    res.status(500).json({ message: "Registration failed: " + error.message });
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
      token,
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

    const token = generateToken(user._id);

    // ✅ Attach restaurantId if user is a restaurant
    let restaurantId = null;
    if (user.role === "restaurant") {
      const restaurant = await Restaurant.findOne({ owner: user._id });
      if (restaurant) restaurantId = restaurant._id;
    }

    res.status(200).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        restaurantId,
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

    // ✅ Attach restaurantId if user is a restaurant
    let restaurantId = null;
    if (user.role === "restaurant") {
      const restaurant = await Restaurant.findOne({ owner: user._id });
      if (restaurant) restaurantId = restaurant._id;
    }

    res.status(200).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        restaurantId,
      },
    });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// 📲 Send OTP (Login via mobile/email)
const sendOTP = async (req, res) => {
  try {
    const { contact } = req.body;
    const user = await User.findOne({
      $or: [{ email: contact }, { phone: contact }],
    });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiresAt = Date.now() + 5 * 60 * 1000;
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

    const token = generateToken(user._id);

    // ✅ Attach restaurantId if user is a restaurant
    let restaurantId = null;
    if (user.role === "restaurant") {
      const restaurant = await Restaurant.findOne({ owner: user._id });
      if (restaurant) restaurantId = restaurant._id;
    }

    res.status(200).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        restaurantId,
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
    user.resetTokenExpires = Date.now() + 30 * 60 * 1000;
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

    if (!newPassword) {
      return res.status(400).json({ message: "New password is required" });
    }

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpires: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    user.resetToken = null;
    user.resetTokenExpires = null;

    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔁 Change password
// changePassword
const changePassword = async (req, res) => {
  try {
    const userId = req.user._id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Both passwords are required" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect current password" });
    }

    // ❌ remove manual bcrypt.hash
    user.password = newPassword;
    await user.save(); // pre-save hook will hash it

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /auth/check-verification
const checkVerification = async (req, res) => {
  try {
    const { email } = req.query;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const response = { isVerified: user.isVerified };

    if (user.isVerified) {
      const token = generateToken(user._id);

      // ✅ Attach restaurantId if user is a restaurant
      let restaurantId = null;
      if (user.role === "restaurant") {
        const restaurant = await Restaurant.findOne({ owner: user._id });
        if (restaurant) restaurantId = restaurant._id;
      }

      response.token = token;
      response.user = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        restaurantId,
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
