const UserModel = require("../models/UserModel");
const OrderModel = require("../models/OrderModel");
const RestaurantModel = require("../models/RestaurantModel");

// 🆕 Create Restaurant Profile
const createRestaurantProfile = async (req, res) => {
  try {
    const existing = await RestaurantModel.findOne({ userId: req.user.id });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Restaurant profile already exists" });
    }

    const restaurant = await RestaurantModel.create({
      userId: req.user.id,
      restaurantName: req.body.restaurantName,
      description: req.body.description,
      address: req.body.address,
      phone: req.body.phone,
      cuisine: req.body.cuisine,
    });

    res.status(201).json({
      message: "Restaurant profile created",
      data: restaurant,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

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

// 📦 View Orders
const getRestaurantOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find({ restaurantId: req.user.id })
      .populate("customerId", "name")
      .populate("items.menuItemId", "name price");

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

    const updatedOrder = await OrderModel.findOneAndUpdate(
      { _id: orderId, restaurantId: req.user.id },
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      message: "Order status updated",
      data: updatedOrder,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 💬 View Reviews (Mocked for now)
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
  createRestaurantProfile,
  getRestaurantProfile,
  updateRestaurantProfile,
  getRestaurantOrders,
  updateOrderStatus,
  getReviews,
};
