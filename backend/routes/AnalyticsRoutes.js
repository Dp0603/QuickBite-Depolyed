const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middlewares/authMiddleware");

const {
  getRestaurantOverview,
  getSalesTrends,
  getTopDishes,
  getCustomerInsights,
  getOrderHeatmap, // ✅ new controller
} = require("../controllers/AnalyticsController");

// 📊 Analytics Routes
router.get(
  "/restaurant/overview",
  protect,
  authorize("restaurant", "admin"),
  getRestaurantOverview
);

router.get(
  "/restaurant/sales-trends",
  protect,
  authorize("restaurant", "admin"),
  getSalesTrends
);

router.get(
  "/restaurant/top-dishes",
  protect,
  authorize("restaurant", "admin"),
  getTopDishes
);

router.get(
  "/restaurant/customers",
  protect,
  authorize("restaurant", "admin"),
  getCustomerInsights
);

// 🔥 Heatmap (Orders by Day & Hour)
router.get(
  "/restaurant/heatmap",
  protect,
  authorize("restaurant", "admin"),
  getOrderHeatmap
);

module.exports = router;
