const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getAllRestaurants,
  getAllOrders,
  getDashboardStats,
  updateUserRole,
  toggleUserStatus,
  deleteEntity,
  getAnalyticsSummary,
} = require("../controllers/AdminController");

// 👥 Get all users
router.get("/users", getAllUsers);

// 🏬 Get all restaurants
router.get("/restaurants", getAllRestaurants);

// 📦 Get all orders
router.get("/orders", getAllOrders);

// 📊 Dashboard stats
router.get("/dashboard-stats", getDashboardStats);

// 🔄 Update user role
router.put("/users/role/:userId", updateUserRole);

// 🚫 Block/unblock user
router.patch("/users/status/:userId", toggleUserStatus);

// ❌ Delete user/restaurant/order
router.delete("/delete/:type/:id", deleteEntity);

// 📈 Analytics summary (optional)
router.get("/analytics-summary", getAnalyticsSummary);

module.exports = router;
