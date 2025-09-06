const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const {
  registerUser,
  loginUser,
  getUserById,
  getMe, // ✅ New function
  updateUser,
  deleteUser,
  getAllUsers,
} = require("../controllers/UserController");

const router = express.Router();

// 🔐 Register a new user
router.post("/users/register", registerUser);

// 🔑 Login user
router.post("/users/login", loginUser);

// 👤 Get currently logged-in user
router.get("/users/me", protect, getMe); // ✅ New route

// 👤 Get user by ID
router.get("/users/:id", getUserById);

// ✏️ Update user profile
router.put("/users/:id", updateUser);

// 🗑️ Delete user
router.delete("/users/:id", deleteUser);

// 📋 Get all users (admin only)
router.get("/users", getAllUsers);

module.exports = router;
