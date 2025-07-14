const express = require("express");
const router = express.Router();

const {
  createRestaurantProfile,
  getRestaurantProfile,
  updateRestaurantProfile,
  getRestaurantOrders,
  updateOrderStatus,
  getReviews,
  toggleAvailability, // ✅ added toggle route
  getAvailabilitySettings,
  updateAvailabilitySettings,
} = require("../controllers/RestuarantController"); // ✅ fixed spelling

const { protect, authorize } = require("../middlewares/authMiddleware");

// 🔐 Protect all routes with auth and restaurant role
router.use(protect);
router.use(authorize("restaurant"));

// 👤 Profile
router.post("/profile", createRestaurantProfile);
router.get("/profile", getRestaurantProfile);
router.put("/profile", updateRestaurantProfile);

// 📦 Orders
router.get("/orders", getRestaurantOrders);
router.put("/orders/:orderId", updateOrderStatus);

// 💬 Reviews
router.get("/reviews", getReviews);

// 🔄 Availability
router.put("/toggle-availability", toggleAvailability); // ✅ toggle online/offline
router.get("/availability", getAvailabilitySettings);
router.put("/availability", updateAvailabilitySettings);

module.exports = router;
