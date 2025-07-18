const express = require("express");
const {
  createSubscription,
  getSubscriptionsBySubscriber,
  getSubscriptionById,
  updateSubscription,
  deleteSubscription,
  getAllActiveSubscriptions,
} = require("../controllers/PremiumSubscriptionController");

const router = express.Router();

// ➕ Create a new subscription
router.post("/subscriptions", createSubscription);

// 📦 Get all subscriptions for a specific user/restaurant
router.get(
  "/subscriptions/:subscriberType/:subscriberId",
  getSubscriptionsBySubscriber
);

// 📄 Get a single subscription by ID
router.get("/subscriptions/id/:id", getSubscriptionById);

// ✏️ Update a subscription
router.put("/subscriptions/:id", updateSubscription);

// 🗑️ Delete a subscription
router.delete("/subscriptions/:id", deleteSubscription);

// 📊 Get all active subscriptions (Admin/report use)
router.get("/subscriptions/active/all", getAllActiveSubscriptions);

module.exports = router;
