const DeliveryOrder = require("../models/DeliveryAgentModel");

// 📦 Get all orders assigned to a delivery agent
const getAssignedOrders = async (req, res) => {
  try {
    const agentId = req.params.agentId;

    const orders = await DeliveryOrder.find({
      deliveryAgent_id: agentId,
      status: { $in: ["Out for Delivery"] },
    })
      .populate("customer_id", "name email")
      .populate("restaurant_id", "name");

    res.status(200).json({
      message: "Assigned orders fetched successfully",
      data: orders,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Mark order as delivered
const markOrderDelivered = async (req, res) => {
  try {
    const orderId = req.params.id;

    const updatedOrder = await DeliveryOrder.findByIdAndUpdate(
      orderId,
      {
        status: "Delivered",
        deliveryTime: new Date(),
      },
      { new: true }
    );

    res.status(200).json({
      message: "Order marked as delivered successfully",
      data: updatedOrder,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📜 Get delivery history of a delivery agent
const getDeliveryHistory = async (req, res) => {
  try {
    const agentId = req.params.agentId;

    const deliveredOrders = await DeliveryOrder.find({
      deliveryAgent_id: agentId,
      status: "Delivered",
    })
      .populate("customer_id", "name email")
      .populate("restaurant_id", "name");

    res.status(200).json({
      message: "Delivery history fetched successfully",
      data: deliveredOrders,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAssignedOrders,
  markOrderDelivered,
  getDeliveryHistory,
};