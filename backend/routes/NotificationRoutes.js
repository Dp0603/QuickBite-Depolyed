const express = require("express");
const {
  sendNotification,
  getUserNotifications,
  markAsRead,
  deleteNotification,
} = require("../controllers/NotificationController");

const router = express.Router();

// ✅ Create/send a notification
router.post("/notifications", sendNotification);

// 📩 Get all notifications for a user
router.get("/notifications/:recipientId", getUserNotifications);

// ✅ Mark a notification as read
router.patch("/notifications/read/:notificationId", markAsRead);

// ❌ Delete a notification
router.delete("/notifications/:notificationId", deleteNotification);

module.exports = router;
