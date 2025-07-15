const Message = require("../models/MessageModel");
const Order = require("../models/OrderModel");
const User = require("../models/UserModel");

// 💬 ➕ Send Message (Create)
const sendMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const { orderId } = req.params;
    const sender = req.user._id;

    if (!orderId || !text) {
      return res
        .status(400)
        .json({ message: "Order ID and text are required" });
    }

    const message = await Message.create({
      orderId,
      sender,
      text,
    });

    res.status(201).json({
      message: "Message sent successfully",
      data: message,
    });
  } catch (err) {
    console.error("Send message error:", err);
    res.status(500).json({ message: err.message });
  }
};

// 📥 Get All Messages for a Specific Order
const getMessagesByOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const messages = await Message.find({ orderId })
      .populate("sender", "name role")
      .sort({ createdAt: 1 });

    res.status(200).json({
      message: "Messages fetched successfully",
      data: messages,
    });
  } catch (err) {
    console.error("Get messages by order error:", err);
    res.status(500).json({ message: err.message });
  }
};

// 👤 Get All Messages Sent by Logged-in User
const getMessagesByUser = async (req, res) => {
  try {
    const userId = req.user._id;

    const messages = await Message.find({ sender: userId })
      .populate("orderId", "_id status createdAt")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "User messages retrieved successfully",
      data: messages,
    });
  } catch (err) {
    console.error("Get messages by user error:", err);
    res.status(500).json({ message: err.message });
  }
};

// 📦 GET Inbox for Restaurant
const getRestaurantChatInbox = async (req, res) => {
  try {
    const restaurantId = req.user._id;

    const orders = await Order.find({ restaurantId })
      .select("_id customerId")
      .lean();
    const orderIds = orders.map((o) => o._id);
    const customerMap = Object.fromEntries(
      orders.map((o) => [o._id, o.customerId])
    );

    const latestMessages = await Message.aggregate([
      { $match: { orderId: { $in: orderIds } } },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$orderId",
          message: { $first: "$text" },
          sender: { $first: "$sender" },
          time: { $first: "$createdAt" },
        },
      },
    ]);

    const customerIds = [...new Set(Object.values(customerMap))];
    const customers = await User.find({ _id: { $in: customerIds } })
      .select("_id name")
      .lean();

    const customerNameMap = Object.fromEntries(
      customers.map((c) => [c._id.toString(), c.name])
    );

    const inbox = latestMessages.map((msg) => {
      const orderId = msg._id;
      const customerId = customerMap[orderId];
      const customerName =
        customerNameMap[customerId?.toString()] || "Customer";

      return {
        id: orderId.toString(),
        customer: customerName,
        message: msg.message,
        time: msg.time,
        replied: String(msg.sender) !== String(customerId),
      };
    });

    res.json({ success: true, data: inbox });
  } catch (err) {
    console.error("Get restaurant inbox error:", err);
    res.status(500).json({ message: "Failed to fetch chat inbox" });
  }
};

module.exports = {
  sendMessage,
  getMessagesByOrder,
  getMessagesByUser,
  getRestaurantChatInbox,
};
