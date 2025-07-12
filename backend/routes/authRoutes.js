// routes/authRoutes.js

const express = require("express");
const router = express.Router();

const { register, login, verifyToken } = require("../controllers/AuthController");
const authMiddleware = require("../middlewares/authMiddleware");

// @route   POST /api/auth/register
router.post("/register", register);

// @route   POST /api/auth/login
router.post("/login", login);

// @route   POST /api/auth/verify-token
router.post("/verify-token", authMiddleware, verifyToken);

module.exports = router;
