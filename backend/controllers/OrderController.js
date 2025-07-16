const OrderModel = require("../models/OrderModel");

// ➕ Create order
const createOrder = async (req, res) => {
  try {
    const newOrder = await OrderModel.create(req.body);
    res.status(201).json({
      message: "Order placed successfully",
      data: newOrder,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📋 Get all orders (admin/restaurant)
const getAllOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find()
      .populate("customerId", "name email")
      .populate("restaurantId", "name email")
      .populate("items.menuItemId", "name price");
    res.status(200).json({ message: "Orders retrieved", data: orders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// 🔍 Get order by ID
const getOrderById = async (req, res) => {
  try {
    const order = await OrderModel.findById(req.params.id)
      .populate("restaurantId", "name")
      .populate("items.menuItemId", "name price")
      .populate("riderId", "name phone"); // optional

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json({ message: "Order retrieved", data: order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🙋‍♂️ Get customer-specific orders
const getCustomerOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find({ customerId: req.params.customerId })
      .populate("restaurantId", "name")
      .populate("items.menuItemId", "name price");
    res.status(200).json({ message: "Customer orders", data: orders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🍽️ Get restaurant-specific orders
const getRestaurantOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find({
      restaurantId: req.params.restaurantId,
    })
      .populate("customerId", "name")
      .populate("items.menuItemId", "name price");
    res.status(200).json({ message: "Restaurant orders", data: orders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✏️ Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const updated = await OrderModel.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.status(200).json({ message: "Order status updated", data: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// 🚚 Get orders for a delivery agent
const getOrdersByDeliveryAgent = async (req, res) => {
  try {
    const orders = await OrderModel.find({ riderId: req.params.riderId })
      .populate("customerId", "name")
      .populate("restaurantId", "name")
      .populate("items.menuItemId", "name price");
    res.status(200).json({ message: "Assigned orders", data: orders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const assignDeliveryAgent = async (req, res) => {
  try {
    const updated = await OrderModel.findByIdAndUpdate(
      req.params.id,
      { riderId: req.body.riderId },
      { new: true }
    );
    res.status(200).json({ message: "Delivery agent assigned", data: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  getCustomerOrders,
  getRestaurantOrders,
  updateOrderStatus,
  getOrdersByDeliveryAgent,
  assignDeliveryAgent,
};
