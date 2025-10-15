const User = require("../models/UserModel");
const Restaurant = require("../models/RestaurantModel");
const Order = require("../models/OrderModel");
const Analytics = require("../models/AnalyticsModel");
const Review = require("../models/ReviewModel");
const Offer = require("../models/OfferModel");
const { HelpTicket } = require("../models/HelpSupportModel");
const PDFDocument = require("pdfkit");
const ExcelJS = require("exceljs");

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
    const totalUsers = await User.countDocuments();
    const totalRestaurants = await Restaurant.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalSales = await Order.aggregate([
      { $match: { paymentStatus: "Paid" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    const orderStatus = await Order.aggregate([
      { $group: { _id: "$orderStatus", count: { $sum: 1 } } },
    ]);

    const weeklyOrders = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
      },
      {
        $group: {
          _id: { $dayOfWeek: "$createdAt" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const topRestaurants = await Order.aggregate([
      { $group: { _id: "$restaurantId", orders: { $sum: 1 } } },
      { $sort: { orders: -1 } },
      { $limit: 5 },
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
          name: "$restaurant.name",
          rating: "$restaurant.rating",
          orders: 1,
        },
      },
    ]);

    const cityDistribution = await Order.aggregate([
      {
        $group: { _id: "$deliveryAddress.city", value: { $sum: 1 } },
      },
      { $sort: { value: -1 } },
      { $limit: 5 },
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

// 📈 Analytics Summary
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

//
// 📤 EXPORT CONTROLLERS
//

// 🧾 Export Orders CSV
const exportOrdersCSV = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customerId", "name email")
      .populate("restaurantId", "name")
      .lean();

    const csvData = orders.map((o) => ({
      OrderID: o._id,
      Customer: o.customerId?.name || "N/A",
      Restaurant: o.restaurantId?.name || "N/A",
      Total: o.totalAmount,
      Status: o.orderStatus,
      Date: new Date(o.createdAt).toLocaleString(),
    }));

    const csv =
      Object.keys(csvData[0]).join(",") +
      "\n" +
      csvData.map((r) => Object.values(r).join(",")).join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=orders.csv");
    res.status(200).send(csv);
  } catch (error) {
    res.status(500).json({ message: "Failed to export orders CSV" });
  }
};

// 💰 Export Revenue PDF
const exportRevenuePDF = async (req, res) => {
  try {
    const totalSales = await Order.aggregate([
      { $match: { paymentStatus: "Paid" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=revenue.pdf");

    doc.text("QuickBite Revenue Report", { align: "center" });
    doc.moveDown();
    doc.text(`Date: ${new Date().toLocaleDateString()}`);
    doc.moveDown();
    doc.text(`Total Revenue: ₹${totalSales[0]?.total || 0}`);
    doc.end();
    doc.pipe(res);
  } catch (error) {
    res.status(500).json({ message: "Failed to export revenue PDF" });
  }
};

// 👥 Export Users XLSX
const exportUsersXLSX = async (req, res) => {
  try {
    const users = await User.find().select("name email role createdAt");
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Users");
    sheet.columns = [
      { header: "Name", key: "name", width: 25 },
      { header: "Email", key: "email", width: 30 },
      { header: "Role", key: "role", width: 15 },
      { header: "Created At", key: "createdAt", width: 20 },
    ];
    users.forEach((u) => sheet.addRow(u));
    res.setHeader("Content-Disposition", "attachment; filename=users.xlsx");
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ message: "Failed to export users XLSX" });
  }
};

// 📋 Get all reviews
const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("userId", "name email")
      .populate("restaurantId", "name")
      .sort({ createdAt: -1 });
    res.status(200).json({ message: "Reviews fetched", data: reviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Approve or Flag review
const updateReviewStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["approved", "flagged", "pending"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const review = await Review.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!review) return res.status(404).json({ message: "Review not found" });

    res.status(200).json({ message: "Review status updated", data: review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ❌ Delete review
const deleteReviewByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findByIdAndDelete(id);
    if (!review) return res.status(404).json({ message: "Review not found" });
    res.status(200).json({ message: "Review deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🏷️ Get all offers (Admin)
const getAllOffersAdmin = async (req, res) => {
  try {
    const offers = await Offer.find()
      .populate("restaurantId", "name")
      .sort({ createdAt: -1 });
    res
      .status(200)
      .json({ message: "All offers fetched successfully", data: offers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔄 Toggle offer active/inactive
const toggleOfferStatusAdmin = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) return res.status(404).json({ message: "Offer not found" });

    offer.isActive = !offer.isActive;
    await offer.save();

    res.status(200).json({
      message: `Offer is now ${offer.isActive ? "active" : "inactive"}`,
      data: offer,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ❌ Delete offer (Admin)
const deleteOfferAdmin = async (req, res) => {
  try {
    const offer = await Offer.findByIdAndDelete(req.params.id);
    if (!offer) return res.status(404).json({ message: "Offer not found" });
    res.status(200).json({ message: "Offer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🧾 Get all complaints/tickets (admin)
const getAllComplaints = async (req, res) => {
  try {
    const tickets = await HelpTicket.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "All complaints fetched successfully",
      data: tickets,
    });
  } catch (error) {
    console.error("Error fetching complaints:", error);
    res.status(500).json({ message: "Failed to fetch complaints" });
  }
};

// 🔄 Update complaint/ticket status (admin)
const updateComplaintStatus = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { status } = req.body;

    // Validate status
    if (!["pending", "in-progress", "resolved", "closed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    // ✅ Update by ticketId instead of _id
    const updatedTicket = await HelpTicket.findOneAndUpdate(
      { ticketId },
      { status },
      { new: true }
    );

    if (!updatedTicket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.status(200).json({
      message: "Complaint status updated successfully",
      data: updatedTicket,
    });
  } catch (error) {
    console.error("Error updating complaint status:", error);
    res.status(500).json({ message: "Failed to update complaint status" });
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
  exportOrdersCSV,
  exportRevenuePDF,
  exportUsersXLSX,
  getAllReviews,
  updateReviewStatus,
  deleteReviewByAdmin,
  getAllOffersAdmin,
  toggleOfferStatusAdmin,
  deleteOfferAdmin,
  getAllComplaints,
  updateComplaintStatus,
};
