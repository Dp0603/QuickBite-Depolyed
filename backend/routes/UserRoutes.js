const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  verifyEmail,
  deleteMyAccount, // ✅ Add this import
} = require("../controllers/UserController");

const { protect } = require("../middlewares/authMiddleware"); // ✅ Add this for protected route

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

// 🗑️ Delete my account (requires token)
router.delete("/me", protect, deleteMyAccount); // ✅ Add this line

module.exports = router;
