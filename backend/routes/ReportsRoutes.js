const express = require("express");
const router = express.Router();
const {
  getGlobalSalesReport,
  getRestaurantPerformance,
  getCustomerReport,
  getOrderTrends,
  exportSalesReportPDF,
  exportSalesReportCSV,
  getTopCategories,
} = require("../controllers/ReportsController");

// 📊 Global Platform Sales Report
router.get("/sales", getGlobalSalesReport);

// 🏪 Restaurant Performance Report
router.get("/restaurants", getRestaurantPerformance);

// 👥 Customer Report
router.get("/customers", getCustomerReport);

// 📦 Order Trends Report
router.get("/orders", getOrderTrends);

// 📤 Export Reports
router.get("/export/pdf", exportSalesReportPDF);
router.get("/export/csv", exportSalesReportCSV);

router.get("/top-categories", getTopCategories);

module.exports = router;
