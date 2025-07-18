const express = require("express");
const {
  createOrder,
  updateOrderStatus,
  updateDeliveryStatus,
  getCustomerOrders,
  getRestaurantOrders,
  getOrderById,
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

module.exports = router;
