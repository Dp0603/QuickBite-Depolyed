const User = require("../models/UserModel");
const Restaurant = require("../models/RestaurantModel");
const Order = require("../models/OrderModel");
const Analytics = require("../models/AnalyticsModel");

// 👥 Get all users (admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json({ message: "All users fetched", data: users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🏬 Get all restaurants
const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find().sort({ createdAt: -1 });
    res
      .status(200)
      .json({ message: "All restaurants fetched", data: restaurants });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📦 Get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customerId", "name email")
      .populate("restaurantId", "name")
      .sort({ createdAt: -1 });
    res.status(200).json({ message: "All orders fetched", data: orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📊 Admin Dashboard Stats
const getDashboardStats = async (req, res) => {
  try {
    // ✅ Totals
    const totalUsers = await User.countDocuments();
    const totalRestaurants = await Restaurant.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalSales = await Order.aggregate([
      { $match: { paymentStatus: "Paid" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    // ✅ Orders by status (Pending, Preparing, Ready, Out for Delivery, Delivered, Cancelled)
    const orderStatus = await Order.aggregate([
      { $group: { _id: "$orderStatus", count: { $sum: 1 } } },
    ]);

    // ✅ Weekly orders trend (last 7 days)
    const weeklyOrders = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      },
      {
        $group: {
          _id: { $dayOfWeek: "$createdAt" }, // 1=Sunday
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // ✅ Top 5 restaurants by orders
    const topRestaurants = await Order.aggregate([
      { $group: { _id: "$restaurantId", orders: { $sum: 1 } } },
      { $sort: { orders: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "restaurants", // must match collection name
          localField: "_id",
          foreignField: "_id",
          as: "restaurant",
        },
      },
      { $unwind: "$restaurant" },
      {
        $project: {
          name: "$restaurant.name",
          rating: "$restaurant.rating",
          orders: 1,
        },
      },
    ]);

    // ✅ City distribution
    const cityDistribution = await Order.aggregate([
      {
        $group: {
          _id: "$deliveryAddress.city",
          value: { $sum: 1 },
        },
      },
      { $sort: { value: -1 } },
      { $limit: 5 }, // top 5 cities
    ]);

    res.status(200).json({
      message: "Dashboard stats fetched",
      data: {
        totals: {
          totalUsers,
          totalRestaurants,
          totalOrders,
          totalSales: totalSales[0]?.total || 0,
        },
        orderStatus,
        weeklyOrders,
        topRestaurants,
        cityDistribution,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔄 Update user role
const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User role updated", data: user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🚫 Block or Unblock user
const toggleUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.status(200).json({
      message: `User ${user.isBlocked ? "blocked" : "unblocked"}`,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ❌ Delete user/restaurant/order
const deleteEntity = async (req, res) => {
  try {
    const { type, id } = req.params;

    let model;
    switch (type) {
      case "user":
        model = User;
        break;
      case "restaurant":
        model = Restaurant;
        break;
      case "order":
        model = Order;
        break;
      default:
        return res.status(400).json({ message: "Invalid delete type" });
    }

    const deleted = await model.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: `${type} not found` });

    res.status(200).json({ message: `${type} deleted`, data: deleted });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📈 Analytics Summary (optional)
const getAnalyticsSummary = async (req, res) => {
  try {
    const summary = await Analytics.aggregate([
      { $group: { _id: "$eventType", count: { $sum: 1 } } },
    ]);

    res
      .status(200)
      .json({ message: "Analytics summary fetched", data: summary });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllUsers,
  getAllRestaurants,
  getAllOrders,
  getDashboardStats,
  updateUserRole,
  toggleUserStatus,
  deleteEntity,
  getAnalyticsSummary,
};
