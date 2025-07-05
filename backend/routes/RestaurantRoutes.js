const express = require("express");
const router = express.Router();
const {
  getRestaurantProfile,
  updateRestaurantProfile,
  getMenu,
  addMenuItem,
  deleteMenuItem,
  getRestaurantOrders,
  updateOrderStatus,
  getReviews,
} = require("../controllers/RestaurantController");

const { protect, authorize } = require("../middleware/authMiddleware");

// All routes are protected and restricted to restaurant role
router.use(protect);
router.use(authorize("restaurant"));

// 🧑‍🍳 Get and Update Profile
router.get("/profile", getRestaurantProfile);
router.put("/profile", updateRestaurantProfile);

// 📋 Menu Routes
router.get("/menu", getMenu); // View menu
router.post("/menu", addMenuItem); // Add menu item
router.delete("/menu/:itemId", deleteMenuItem); // Delete menu item

// 📦 Orders
router.get("/orders", getRestaurantOrders); // View orders
router.put("/orders/:orderId", updateOrderStatus); // Update order status

// 💬 Reviews
router.get("/reviews", getReviews); // Get reviews

module.exports = router;
