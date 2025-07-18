const Analytics = require("../models/AnalyticsModel");

// 🎯 Record a new analytics event
const logAnalyticsEvent = async (req, res) => {
  try {
    const newEvent = await Analytics.create(req.body);
    res.status(201).json({ message: "Analytics event logged", data: newEvent });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📊 Get all analytics (admin/dev only - optional filters)
const getAllAnalytics = async (req, res) => {
  try {
    const { entityType, eventType } = req.query;

    const filters = {};
    if (entityType) filters.entityType = entityType;
    if (eventType) filters.eventType = eventType;

    const analytics = await Analytics.find(filters).sort({ createdAt: -1 });

    res.status(200).json({ message: "Analytics fetched", data: analytics });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📈 Get analytics for a specific entity (e.g. a restaurant/menu)
const getEntityAnalytics = async (req, res) => {
  try {
    const { entityId } = req.params;
    const analytics = await Analytics.find({ entityId }).sort({
      createdAt: -1,
    });
    res
      .status(200)
      .json({ message: "Entity analytics fetched", data: analytics });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  logAnalyticsEvent,
  getAllAnalytics,
  getEntityAnalytics,
};
