const express = require("express");
const router = express.Router();

const {
  createRestaurantProfile,
  getRestaurantProfile,
  updateRestaurantProfile,
  getRestaurantOrders,
  updateOrderStatus,
  getReviews,
} = require("../controllers/RestuarantController");

const { protect, authorize } = require("../middlewares/authMiddleware");

// 🔐 All routes require auth & restaurant role
router.use(protect);
router.use(authorize("restaurant"));

// 🆕 Create restaurant profile
router.post("/profile", createRestaurantProfile);

// 🧑‍🍳 Get and update profile
router.get("/profile", getRestaurantProfile);
router.put("/profile", updateRestaurantProfile);

// 📦 Orders
router.get("/orders", getRestaurantOrders);
router.put("/orders/:orderId", updateOrderStatus);

// 💬 Reviews
router.get("/reviews", getReviews);

module.exports = router;
