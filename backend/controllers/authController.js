const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
const generateToken = require("../utils/generateToken");
const sendEmail = require("../utils/sendEmail");

// ✅ Register User
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const emailToken = crypto.randomBytes(32).toString("hex");

    const user = await User.create({
      name,
      email,
      password,
      role: role || "customer",
      isVerified: false,
      emailToken,
    });

    const verifyLink = `http://localhost:5173/verify-email/${emailToken}`; // update in prod

    await sendEmail({
      to: user.email,
      subject: "Verify your QuickBite email",
      name: user.name,
      body: `
        <p>Hi <strong>${user.name}</strong>,</p>
        <p>Thanks for signing up for <strong>QuickBite</strong>!</p>
        <p>Please verify your email address to activate your account:</p>
        <p>
          <a href="${verifyLink}" target="_blank" style="padding: 10px 20px; background-color: #FF5722; color: white; text-decoration: none; border-radius: 5px;">
            Verify Email
          </a>
        </p>
        <p>If you did not request this, please ignore this email.</p>
      `,
    });

    res.status(201).json({
      message:
        "Registered successfully. Check your email to verify your account.",
    });
  } catch (err) {
    console.error("❌ Register Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Verify Email
exports.verifyEmail = async (req, res) => {
  try {
    const token = req.params.token;

    const user = await User.findOne({ emailToken: token });
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.emailToken = null;
    user.isVerified = true;
    await user.save();

    res.status(200).json({ message: "Email verified successfully!" });
  } catch (err) {
    console.error("❌ Email Verification Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Login User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res
        .status(401)
        .json({ message: "Please verify your email before logging in." });
    }

    res.status(200).json({
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("❌ Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Token Verification (used by frontend AuthContext)
exports.verifyToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (err) {
    console.error("❌ Token Verification Error:", err);
    res.status(401).json({ message: "Invalid token" });
  }
};
