const express = require("express");
const router = express.Router();

const {
  sendMessage,
  getMessagesByOrder,
  getMessagesByUser,
  getRestaurantChatInbox,
} = require("../controllers/ChatController");

const { protect, authorize } = require("../middlewares/authMiddleware");

// 🔐 All routes are protected
router.use(protect);

// 📨 Restaurant Chat Inbox
router.get(
  "/restaurant/inbox",
  authorize("restaurant"),
  getRestaurantChatInbox
);

// 💬 Get All Messages for an Order (customer/rider/restaurant)
router.get("/order/:orderId", getMessagesByOrder);

// 👤 Get All Messages Sent by Current User
router.get("/user", getMessagesByUser);

// ➕ Send Message (Customer, Rider, or Restaurant)
router.post("/:orderId", sendMessage);

module.exports = router;
