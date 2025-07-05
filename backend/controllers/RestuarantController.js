const UserModel = require("../models/UserModel");

// 🍽️ Mock Data
let menus = {}; // restaurantId -> array of menu items
let restaurantOrders = {}; // restaurantId -> orders

// 📄 Get Restaurant Profile
const getRestaurantProfile = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id).select("-password");

    if (!user || user.role !== "restaurant") {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.status(200).json({
      message: "Restaurant profile fetched successfully",
      data: user,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✏️ Update Profile
const updateRestaurantProfile = async (req, res) => {
  try {
    const updates = {
      name: req.body.name,
      email: req.body.email,
    };

    const updatedUser = await UserModel.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json({
      message: "Restaurant profile updated",
      data: updatedUser,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 📋 View Menu
const getMenu = async (req, res) => {
  try {
    const menu = menus[req.user.id] || [];
    res.status(200).json({
      message: "Menu retrieved successfully",
      data: menu,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ➕ Add Menu Item
const addMenuItem = async (req, res) => {
  try {
    const { name, description, price, image } = req.body;

    if (!name || !price) {
      return res
        .status(400)
        .json({ message: "Name and price are required" });
    }

    const newItem = {
      id: Date.now().toString(),
      name,
      description,
      price,
      image,
    };

    menus[req.user.id] = menus[req.user.id] || [];
    menus[req.user.id].push(newItem);

    res.status(201).json({
      message: "Menu item added",
      data: newItem,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ❌ Delete Menu Item
const deleteMenuItem = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    menus[req.user.id] = (menus[req.user.id] || []).filter(
      (item) => item.id !== itemId
    );

    res.status(200).json({
      message: "Menu item deleted",
      data: menus[req.user.id],
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📦 View Orders
const getRestaurantOrders = async (req, res) => {
  try {
    const orders = restaurantOrders[req.user.id] || [];
    res.status(200).json({
      message: "Orders retrieved",
      data: orders,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔄 Update Order Status
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const orders = restaurantOrders[req.user.id] || [];
    const order = orders.find((o) => o.orderId === orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status || order.status;

    res.status(200).json({
      message: "Order status updated",
      data: order,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 💬 View Reviews (Mocked)
const getReviews = async (req, res) => {
  try {
    const reviews = [
      {
        id: "rev1",
        user: "Customer A",
        rating: 5,
        comment: "Amazing food!",
      },
      {
        id: "rev2",
        user: "Customer B",
        rating: 4,
        comment: "Great experience overall.",
      },
    ];

    res.status(200).json({
      message: "Reviews retrieved",
      data: reviews,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getRestaurantProfile,
  updateRestaurantProfile,
  getMenu,
  addMenuItem,
  deleteMenuItem,
  getRestaurantOrders,
  updateOrderStatus,
  getReviews,
};
