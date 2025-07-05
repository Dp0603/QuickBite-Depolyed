// routes/UserRoutes.js
const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  verifyEmail,
} = require("../controllers/UserController");

// 👤 Register new user
router.post("/register", registerUser);

// 🔑 Login user
router.post("/login", loginUser);

// 🔐 Forgot Password (send reset link/token)
router.post("/forgot-password", forgotPassword);

// 🔁 Reset Password (with token)
router.post("/reset-password/:token", resetPassword);

// ✅ Verify Email (using token)
router.get("/verify-email/:token", verifyEmail);

module.exports = router;
