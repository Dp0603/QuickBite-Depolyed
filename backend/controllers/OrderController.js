const Order = require("../models/OrderModel");

// 🧾 Create a new order
const createOrder = async (req, res) => {
  try {
    const order = await Order.create(req.body);
    res.status(201).json({ message: "Order placed successfully", order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔁 Update order status (Preparing, Ready, etc.)
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { orderStatus },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    // ✅ Emit real-time update to customer via Socket.IO
    const io = req.app.get("io");
    io.to(orderId).emit("orderStatusUpdated", {
      orderId,
      orderStatus,
      updatedAt: new Date(),
    });

    res
      .status(200)
      .json({ message: "Order status updated", order: updatedOrder });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🚚 Update delivery info (agent assigned, picked, etc.)
const updateDeliveryStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { deliveryAgentId, deliveryTime, deliveryStatus } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        $set: {
          "deliveryDetails.deliveryAgentId": deliveryAgentId,
          "deliveryDetails.deliveryTime": deliveryTime,
          "deliveryDetails.deliveryStatus": deliveryStatus,
        },
      },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    // ✅ Emit delivery update via socket
    const io = req.app.get("io");
    io.to(orderId).emit("deliveryStatusUpdated", {
      orderId,
      deliveryStatus,
      deliveryAgentId,
      deliveryTime,
      updatedAt: new Date(),
    });

    res
      .status(200)
      .json({ message: "Delivery details updated", order: updatedOrder });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 👤 Get all orders of a customer
const getCustomerOrders = async (req, res) => {
  try {
    const { customerId } = req.params;

    const orders = await Order.find({ customerId })
      .populate("restaurantId", "name")
      .populate("items.menuItemId", "name price");

    res.status(200).json({ message: "Customer orders fetched", orders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🍽️ Get all orders of a restaurant
const getRestaurantOrders = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const orders = await Order.find({ restaurantId })
      .populate("customerId", "name")
      .populate("items.menuItemId", "name price");

    res.status(200).json({ message: "Restaurant orders fetched", orders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔍 Get single order by ID
const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate("restaurantId", "name")
      .populate("customerId", "name")
      .populate("items.menuItemId", "name price")
      .populate("deliveryDetails.deliveryAgentId", "name");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order fetched", order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// ⭐ Mark order as rated after feedback
const markOrderAsRated = async (req, res) => {
  try {
    const { orderId } = req.params;

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { isRated: true },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res
      .status(200)
      .json({ message: "Order marked as rated", order: updatedOrder });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createOrder,
  updateOrderStatus,
  updateDeliveryStatus,
  getCustomerOrders,
  getRestaurantOrders,
  getOrderById,
  markOrderAsRated,
};
