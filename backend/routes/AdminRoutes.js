const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getAllRestaurants,
  getAllOrders,
  getDashboardStats,
  updateUserRole,
  toggleUserStatus,
  deleteEntity,
  getAnalyticsSummary,
  getAllReviews,
  updateReviewStatus,
  deleteReviewByAdmin,
  exportOrdersCSV,
  exportRevenuePDF,
  exportUsersXLSX,
  getAllOffersAdmin,
  toggleOfferStatusAdmin,
  deleteOfferAdmin,
  getAllComplaints,
  updateComplaintStatus,
  getSettings,
  updateSettings,
  getAdminProfile,
  updateAdminProfile,
  updateRestaurantApprovalStatus,
} = require("../controllers/AdminController");

// 👥 Get all users
router.get("/users", getAllUsers);

// 🏬 Get all restaurants
router.get("/restaurants", getAllRestaurants);

// 📦 Get all orders
router.get("/orders", getAllOrders);

// 📊 Dashboard stats
router.get("/dashboard-stats", getDashboardStats);

// 🔄 Update user role
router.put("/users/role/:userId", updateUserRole);

// 🚫 Block/unblock user
router.patch("/users/status/:userId", toggleUserStatus);

// ❌ Delete user/restaurant/order
router.delete("/delete/:type/:id", deleteEntity);

// 📈 Analytics summary (optional)
router.get("/analytics-summary", getAnalyticsSummary);

// 📝 Reviews management
router.get("/reviews", getAllReviews);
router.delete("/reviews/:id", deleteReviewByAdmin);
router.put("/reviews/:id/status", updateReviewStatus);

// 🏷️ Offer management (Admin only)
router.get("/offers", getAllOffersAdmin);
router.patch("/offers/toggle/:id", toggleOfferStatusAdmin);
router.delete("/offers/:id", deleteOfferAdmin);

// 📤 Export data
router.get("/export/orders-csv", exportOrdersCSV);
router.get("/export/revenue-pdf", exportRevenuePDF);
router.get("/export/users-xlsx", exportUsersXLSX);

// // 🆘 Complaints / Help Tickets
router.get("/complaints", getAllComplaints);
router.put("/complaints/:ticketId/status", updateComplaintStatus);

// ⚙️ Platform Settings (Admin)
router.get("/settings", getSettings);
router.put("/settings", updateSettings);

// 👤 Admin Profile
router.get("/profile/:adminId", getAdminProfile);
router.put("/profile/:adminId", updateAdminProfile);

// 🏬 Restaurant approval (Admin)
router.put("/restaurants/:id/approval", updateRestaurantApprovalStatus);

module.exports = router;
