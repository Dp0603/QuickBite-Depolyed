const express = require("express");
const router = express.Router();

const {
  register,
  login,
  verifyToken,
  verifyEmail,
} = require("../controllers/AuthController");

// @route   POST /api/auth/register
router.post("/register", register);

// @route   POST /api/auth/login
router.post("/login", login);

// ✅ REMOVE `protect` middleware here
router.post("/verify-token", verifyToken);

// @route   GET /api/auth/verify-email/:token
router.get("/verify-email/:token", verifyEmail);

module.exports = router;
