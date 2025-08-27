const Order = require("../models/OrderModel");
const Restaurant = require("../models/RestaurantModel");

// ========================
// 📊 1. Restaurant Overview
// ========================
const getRestaurantOverview = async (req, res) => {
  try {
    const restaurantId =
      req.user.role === "restaurant" ? req.user.id : req.query.restaurantId;
    if (!restaurantId) {
      return res.status(400).json({ message: "Restaurant ID required" });
    }

    const stats = await Order.aggregate([
      { $match: { restaurantId: restaurantId, orderStatus: "Delivered" } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
          totalOrders: { $sum: 1 },
          avgOrderValue: { $avg: "$totalAmount" },
        },
      },
    ]);

    const restaurant = await Restaurant.findById(restaurantId).select(
      "rating totalReviews isOnline isActive"
    );

    res.json({
      message: "Restaurant overview fetched",
      data: {
        totalRevenue: stats[0]?.totalRevenue || 0,
        totalOrders: stats[0]?.totalOrders || 0,
        avgOrderValue: stats[0]?.avgOrderValue || 0,
        rating: restaurant?.rating || 0,
        totalReviews: restaurant?.totalReviews || 0,
        isOnline: restaurant?.isOnline || false,
        isActive: restaurant?.isActive || false,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ========================
// 📈 2. Sales Trends (per day)
// ========================
const getSalesTrends = async (req, res) => {
  try {
    const restaurantId =
      req.user.role === "restaurant" ? req.user.id : req.query.restaurantId;

    const trends = await Order.aggregate([
      { $match: { restaurantId: restaurantId, orderStatus: "Delivered" } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          orders: { $sum: 1 },
          revenue: { $sum: "$totalAmount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({ message: "Sales trends fetched", data: trends });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ========================
// 🥘 3. Top Selling Dishes
// ========================
const getTopDishes = async (req, res) => {
  try {
    const restaurantId =
      req.user.role === "restaurant" ? req.user.id : req.query.restaurantId;

    const topDishes = await Order.aggregate([
      { $match: { restaurantId: restaurantId, orderStatus: "Delivered" } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.menuItemId",
          name: { $first: "$items.name" },
          totalQuantity: { $sum: "$items.quantity" },
          totalRevenue: {
            $sum: { $multiply: ["$items.quantity", "$items.price"] },
          },
        },
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 5 },
    ]);

    res.json({ message: "Top dishes fetched", data: topDishes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ========================
// 👥 4. Customer Insights
// ========================
const getCustomerInsights = async (req, res) => {
  try {
    const restaurantId =
      req.user.role === "restaurant" ? req.user.id : req.query.restaurantId;

    const customers = await Order.aggregate([
      { $match: { restaurantId: restaurantId, orderStatus: "Delivered" } },
      {
        $group: {
          _id: "$customerId",
          orders: { $sum: 1 },
          totalSpent: { $sum: "$totalAmount" },
        },
      },
      {
        $group: {
          _id: null,
          totalCustomers: { $sum: 1 },
          repeatCustomers: { $sum: { $cond: [{ $gt: ["$orders", 1] }, 1, 0] } },
          avgOrdersPerCustomer: { $avg: "$orders" },
        },
      },
    ]);

    res.json({
      message: "Customer insights fetched",
      data: customers[0] || {
        totalCustomers: 0,
        repeatCustomers: 0,
        avgOrdersPerCustomer: 0,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ========================
// 🔥 5. Order Heatmap (Day x Hour)
// ========================
const getOrderHeatmap = async (req, res) => {
  try {
    const restaurantId =
      req.user.role === "restaurant" ? req.user.id : req.query.restaurantId;

    const heatmap = await Order.aggregate([
      { $match: { restaurantId: restaurantId, orderStatus: "Delivered" } },
      {
        $group: {
          _id: {
            dayOfWeek: { $dayOfWeek: "$createdAt" }, // 1 = Sunday, 7 = Saturday
            hour: { $hour: "$createdAt" },
          },
          orders: { $sum: 1 },
        },
      },
      { $sort: { "_id.dayOfWeek": 1, "_id.hour": 1 } },
    ]);

    res.json({ message: "Order heatmap fetched", data: heatmap });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getRestaurantOverview,
  getSalesTrends,
  getTopDishes,
  getCustomerInsights,
  getOrderHeatmap, // ✅ export new controller
};
