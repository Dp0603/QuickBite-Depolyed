const Notification = require("../models/NotificationModel");

// ✅ Create/send a notification
const sendNotification = async (req, res) => {
  try {
    const notification = await Notification.create(req.body);
    res.status(201).json({ message: "Notification sent", data: notification });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📩 Get all notifications for a user
const getUserNotifications = async (req, res) => {
  try {
    const { recipientId } = req.params;
    const notifications = await Notification.find({ recipientId }).sort({
      createdAt: -1,
    });
    res
      .status(200)
      .json({ message: "Notifications fetched", data: notifications });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Mark a notification as read
const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );
    res.status(200).json({ message: "Marked as read", data: notification });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ❌ Delete a notification
const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    await Notification.findByIdAndDelete(notificationId);
    res.status(200).json({ message: "Notification deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  sendNotification,
  getUserNotifications,
  markAsRead,
  deleteNotification,
};
