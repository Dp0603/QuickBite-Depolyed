const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const {
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
} = require("../controllers/AuthController");

// Public Routes
router.post("/register", register);
router.get("/verify-email/:token", verifyEmail);
router.post("/resend-verification", resendEmailVerification);
router.post("/login", login);
router.get("/verify-token", verifyToken); // usually used in frontend auth context

// OTP-based login
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);

// Password reset
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// Authenticated user route (e.g., middleware to attach user ID required)
router.post("/change-password", protect, changePassword);

module.exports = router;
