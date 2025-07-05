const express = require("express");
const router = express.Router();
const {
  createOrder,
  getAllOrders,
  getCustomerOrders,
  getRestaurantOrders,
  updateOrderStatus,
} = require("../controllers/OrderController");

// ➕ Create a new order
router.post("/", createOrder);

// 📋 Get all orders
router.get("/", getAllOrders);

// 👤 Get orders by customer ID
router.get("/customer/:customerId", getCustomerOrders);

// 🍽️ Get orders by restaurant ID
router.get("/restaurant/:restaurantId", getRestaurantOrders);

// ✏️ Update order status
router.put("/:id/status", updateOrderStatus);

module.exports = router;
