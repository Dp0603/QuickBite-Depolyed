const express = require("express");
const {
  createOrder,
  updateOrderStatus,
  updateDeliveryStatus,
  getCustomerOrders,
  getRestaurantOrders,
  getOrderById,
  markOrderAsRated,
} = require("../controllers/OrderController");

const router = express.Router();

// 🧾 Create a new order
router.post("/orders", createOrder);

// 🔁 Update order status (Preparing, Ready, etc.)
router.put("/orders/status/:orderId", updateOrderStatus);

// 🚚 Update delivery details (agent assigned, picked, etc.)
router.put("/orders/delivery/:orderId", updateDeliveryStatus);

// 👤 Get all orders of a customer
router.get("/orders/customer/:customerId", getCustomerOrders);

// 🍽️ Get all orders of a restaurant
router.get("/orders/restaurant/:restaurantId", getRestaurantOrders);

// 🔍 Get single order by ID
router.get("/orders/:orderId", getOrderById);

// ⭐ Mark order as rated (after feedback)
router.patch("/orders/rated/:orderId", markOrderAsRated);

module.exports = router;
