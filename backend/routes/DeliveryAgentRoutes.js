const express = require("express");
const router = express.Router();
const {
  getAssignedOrders,
  markOrderDelivered,
  getDeliveryHistory,
} = require("../controllers/DeliveryAgentController");

// 📦 Assigned orders
router.get("/assigned/:agentId", getAssignedOrders);

// ✅ Mark order as delivered
router.put("/deliver/:id", markOrderDelivered);

// 📜 Delivery history
router.get("/history/:agentId", getDeliveryHistory);

module.exports = router;
