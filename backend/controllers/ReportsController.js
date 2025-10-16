const Order = require("../models/OrderModel");
const User = require("../models/UserModel");
const Restaurant = require("../models/RestaurantModel");
const PDFDocument = require("pdfkit");
const ExcelJS = require("exceljs");

// ===============================
// 📊 1. Global Sales Report
// ===============================
const getGlobalSalesReport = async (req, res) => {
  try {
    const totalSales = await Order.aggregate([
      { $match: { paymentStatus: "Paid" } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
          totalOrders: { $sum: 1 },
          avgOrderValue: { $avg: "$totalAmount" },
        },
      },
    ]);

    const dailyTrends = await Order.aggregate([
      {
        $match: { paymentStatus: "Paid" },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalRevenue: { $sum: "$totalAmount" },
          totalOrders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      message: "Global sales report fetched successfully",
      data: {
        summary: totalSales[0] || {
          totalRevenue: 0,
          totalOrders: 0,
          avgOrderValue: 0,
        },
        dailyTrends,
      },
    });
  } catch (error) {
    console.error("Error fetching global sales report:", error);
    res.status(500).json({ message: "Failed to fetch sales report" });
  }
};

// ===============================
// 🏪 2. Restaurant Performance
// ===============================
const getRestaurantPerformance = async (req, res) => {
  try {
    const topRestaurants = await Order.aggregate([
      { $match: { paymentStatus: "Paid" } },
      {
        $group: {
          _id: "$restaurantId",
          totalRevenue: { $sum: "$totalAmount" },
          totalOrders: { $sum: 1 },
        },
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "restaurants",
          localField: "_id",
          foreignField: "_id",
          as: "restaurant",
        },
      },
      { $unwind: "$restaurant" },
      {
        $project: {
          _id: 0,
          restaurantId: "$restaurant._id",
          name: "$restaurant.name",
          rating: "$restaurant.rating",
          totalRevenue: 1,
          totalOrders: 1,
        },
      },
    ]);

    res.status(200).json({
      message: "Restaurant performance fetched successfully",
      data: topRestaurants,
    });
  } catch (error) {
    console.error("Error fetching restaurant performance:", error);
    res.status(500).json({ message: "Failed to fetch restaurant report" });
  }
};

// ===============================
// 👥 3. Customer Report
// ===============================
const getCustomerReport = async (req, res) => {
  try {
    const totalCustomers = await User.countDocuments({ role: "customer" });

    const repeatCustomers = await Order.aggregate([
      {
        $group: {
          _id: "$customerId",
          orders: { $sum: 1 },
        },
      },
      { $match: { orders: { $gt: 1 } } },
      { $count: "repeatCustomers" },
    ]);

    const totalOrders = await Order.countDocuments();

    res.status(200).json({
      message: "Customer report fetched successfully",
      data: {
        totalCustomers,
        repeatCustomers: repeatCustomers[0]?.repeatCustomers || 0,
        avgOrdersPerCustomer:
          totalCustomers > 0 ? totalOrders / totalCustomers : 0,
      },
    });
  } catch (error) {
    console.error("Error fetching customer report:", error);
    res.status(500).json({ message: "Failed to fetch customer report" });
  }
};

// ===============================
// 📦 4. Order Trends
// ===============================
const getOrderTrends = async (req, res) => {
  try {
    const orderStatusStats = await Order.aggregate([
      {
        $group: {
          _id: "$orderStatus",
          count: { $sum: 1 },
        },
      },
    ]);

    const cityDistribution = await Order.aggregate([
      {
        $group: {
          _id: "$deliveryAddress.city",
          orders: { $sum: 1 },
        },
      },
      { $sort: { orders: -1 } },
      { $limit: 10 },
    ]);

    res.status(200).json({
      message: "Order trends fetched successfully",
      data: {
        orderStatusStats,
        cityDistribution,
      },
    });
  } catch (error) {
    console.error("Error fetching order trends:", error);
    res.status(500).json({ message: "Failed to fetch order trends" });
  }
};

// ===============================
// 📤 5. Export Reports
// ===============================
const exportSalesReportPDF = async (req, res) => {
  try {
    const salesData = await Order.aggregate([
      { $match: { paymentStatus: "Paid" } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
          totalOrders: { $sum: 1 },
        },
      },
    ]);

    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=sales-report.pdf"
    );

    doc.text("QuickBite - Global Sales Report", { align: "center" });
    doc.moveDown();
    doc.text(`Date: ${new Date().toLocaleDateString()}`);
    doc.moveDown();
    doc.text(`Total Revenue: ₹${salesData[0]?.totalRevenue || 0}`);
    doc.text(`Total Orders: ${salesData[0]?.totalOrders || 0}`);
    doc.end();
    doc.pipe(res);
  } catch (error) {
    res.status(500).json({ message: "Failed to export sales report PDF" });
  }
};

const exportSalesReportCSV = async (req, res) => {
  try {
    const orders = await Order.find({ paymentStatus: "Paid" })
      .populate("restaurantId", "name")
      .populate("customerId", "name email")
      .lean();

    const csvData = orders.map((o) => ({
      OrderID: o._id,
      Customer: o.customerId?.name || "N/A",
      Email: o.customerId?.email || "N/A",
      Restaurant: o.restaurantId?.name || "N/A",
      TotalAmount: o.totalAmount,
      Status: o.orderStatus,
      Date: new Date(o.createdAt).toLocaleDateString(),
    }));

    const csv =
      Object.keys(csvData[0]).join(",") +
      "\n" +
      csvData.map((r) => Object.values(r).join(",")).join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=sales-report.csv"
    );
    res.status(200).send(csv);
  } catch (error) {
    res.status(500).json({ message: "Failed to export sales report CSV" });
  }
};
// 📊 6. Top Categories Report
const getTopCategories = async (req, res) => {
  try {
    const month = parseInt(req.query.month); // optional month filter
    const match = { paymentStatus: "Paid" };

    if (month) {
      const start = new Date(new Date().getFullYear(), month - 1, 1);
      const end = new Date(new Date().getFullYear(), month, 0);
      match.createdAt = { $gte: start, $lte: end };
    }

    const topCategories = await Order.aggregate([
      { $match: match },
      { $unwind: "$items" }, // assuming Order.items contains dishes
      {
        $group: {
          _id: "$items.category",
          totalOrders: { $sum: "$items.quantity" },
        },
      },
      { $sort: { totalOrders: -1 } },
      { $limit: 5 },
    ]);

    res.status(200).json({ message: "Top categories fetched", data: topCategories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch top categories" });
  }
};


module.exports = {
  getGlobalSalesReport,
  getRestaurantPerformance,
  getCustomerReport,
  getOrderTrends,
  exportSalesReportPDF,
  exportSalesReportCSV,
  getTopCategories,
};
