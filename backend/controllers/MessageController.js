const Message = require("../models/MessageModel");

// 📩 Send a new message
const sendMessage = async (req, res) => {
  try {
    const message = await Message.create(req.body);
    res.status(201).json({ message: "Message sent", data: message });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📥 Get all messages for a specific order (chat thread)
const getMessagesByOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const messages = await Message.find({ orderId }).sort({ createdAt: 1 });
    res.status(200).json({ message: "Messages fetched", data: messages });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Mark messages as read for a specific user in an order thread
const markMessagesAsRead = async (req, res) => {
  try {
    const { orderId, userId } = req.params;

    const result = await Message.updateMany(
      { orderId, receiverId: userId, isRead: false },
      { $set: { isRead: true } }
    );

    res.status(200).json({
      message: "Messages marked as read",
      updatedCount: result.modifiedCount,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  sendMessage,
  getMessagesByOrder,
  markMessagesAsRead,
};
