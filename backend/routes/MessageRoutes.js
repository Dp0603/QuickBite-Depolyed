const express = require("express");
const {
  sendMessage,
  getMessagesByOrder,
  markMessagesAsRead,
} = require("../controllers/MessageController");

const router = express.Router();

// 📩 Send a new message
router.post("/messages", sendMessage);

// 📥 Get all messages for a specific order
router.get("/messages/:orderId", getMessagesByOrder);

// ✅ Mark messages as read for a user in a specific order
router.patch("/messages/read/:orderId/:userId", markMessagesAsRead);

module.exports = router;
