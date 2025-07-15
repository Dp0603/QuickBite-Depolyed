const OrderModel = require("../models/OrderModel");
const MenuModel = require("../models/MenuModel");

// 📊 Revenue and Orders Over Past 7 Days
const getSalesStats = async (req, res) => {
  const restaurantId = req.user._id;

  // Generate past 7 dates in YYYY-MM-DD format
  const past7Days = [...Array(7)].map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split("T")[0];
  });

  try {
    const orders = await OrderModel.find({
      restaurantId,
      status: "Delivered",
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    });

    const stats = past7Days.reverse().map((day) => {
      const dailyOrders = orders.filter((o) =>
        new Date(o.createdAt).toISOString().startsWith(day)
      );

      const totalRevenue = dailyOrders.reduce(
        (sum, o) => sum + o.totalAmount,
        0
      );

      return { date: day, revenue: totalRevenue };
    });

    res.status(200).json({
      success: true,
      message: "Sales stats fetched",
      data: stats,
    });
  } catch (err) {
    console.error("📉 Error in getSalesStats:", err);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

// 🍽️ Top 5 Best-Selling Dishes
const getTopDishes = async (req, res) => {
  const restaurantId = req.user._id;

  try {
    const orders = await OrderModel.find({
      restaurantId,
      status: "Delivered",
    }).populate("items.menuItemId");

    const dishMap = {};

    orders.forEach((order) => {
      order.items.forEach(({ menuItemId, quantity }) => {
        if (!menuItemId || !menuItemId.name) return;
        const dishName = menuItemId.name;
        dishMap[dishName] = (dishMap[dishName] || 0) + quantity;
      });
    });

    const topDishes = Object.entries(dishMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    res.status(200).json({
      success: true,
      message: "Top dishes fetched",
      data: topDishes,
    });
  } catch (err) {
    console.error("🍛 Error in getTopDishes:", err);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

module.exports = {
  getSalesStats,
  getTopDishes,
};
