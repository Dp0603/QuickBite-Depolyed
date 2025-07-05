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
    const orders = await OrderModel.find({ restaurantId: req.params.restaurantId })
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

module.exports = {
  createOrder,
  getAllOrders,
  getCustomerOrders,
  getRestaurantOrders,
  updateOrderStatus,
};
