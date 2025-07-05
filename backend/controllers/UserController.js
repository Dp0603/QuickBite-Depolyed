const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
const sendEmail = require("../utils/mailUtils");

// 🔐 Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// 📧 Send Email Verification Token
const sendVerificationToken = async (user) => {
  const token = crypto.randomBytes(20).toString("hex");
  user.emailVerificationToken = token;
  await user.save();

  const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${token}`;
  await sendEmail({
    to: user.email,
    subject: "Verify Your QuickBite Account",
    html: `<p>Click <a href="${verifyUrl}">here</a> to verify your email address.</p>`,
  });
};

// ✅ Register User
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email, password, role });
    await sendVerificationToken(user);

    res.status(201).json({
      message: "User registered. Please verify your email.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ✅ Verify Email
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({ emailVerificationToken: token });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.isVerified = true;
    user.emailVerificationToken = undefined;
    await user.save();

    res.status(200).json({ message: "✅ Email verified successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Optional: Uncomment to block unverified users
    // if (!user.isVerified) {
    //   return res.status(403).json({ message: "Please verify your email first." });
    // }

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
      token: generateToken(user),
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Forgot Password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;

    await sendEmail({
      to: user.email,
      subject: "Reset Your QuickBite Password",
      html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. This link will expire in 1 hour.</p>`,
    });

    res.status(200).json({
      message: "Reset link sent to your email.",
      resetUrl,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Reset Password
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "✅ Password reset successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  verifyEmail,
};
