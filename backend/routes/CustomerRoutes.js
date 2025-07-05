const express = require("express");
const router = express.Router();
const {
  getCustomerProfile,
  updateCustomerProfile,
  viewCart,
  addToCart,
  removeFromCart,
  placeOrder,
  getOrders,
  browseRestaurants,
  submitReview,
} = require("../controllers/CustomerController");

const { protect, authorize } = require("../middleware/authMiddleware");

// All routes below are protected and only for "customer" role
router.use(protect);
router.use(authorize("customer"));

// 🧑‍💼 Profile
router.get("/profile", getCustomerProfile);
router.put("/profile", updateCustomerProfile);

// 🛒 Cart
router.get("/cart", viewCart);
router.post("/cart", addToCart);
router.delete("/cart/:itemId", removeFromCart);

// 🛍 Orders
router.post("/orders", placeOrder);
router.get("/orders", getOrders);

// 🍴 Restaurants
router.get("/restaurants", browseRestaurants);

// ⭐ Review
router.post("/review/:orderId", submitReview);

module.exports = router;
