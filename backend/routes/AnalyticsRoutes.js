const express = require("express");
const router = express.Router();

const {
  logAnalyticsEvent,
  getAllAnalytics,
  getEntityAnalytics,
} = require("../controllers/AnalyticsController");

// 🎯 Log a new analytics event
router.post("/", logAnalyticsEvent);

// 📊 Get all analytics (optional filters: entityType, eventType)
router.get("/", getAllAnalytics);

// 📈 Get analytics for a specific entity by ID
router.get("/entity/:entityId", getEntityAnalytics);

module.exports = router;
