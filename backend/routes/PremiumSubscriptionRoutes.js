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

// Create a new subscription
router.post("/subscriptions", createSubscription);

// Get subscriptions by subscriber type and ID (via query params)
router.get("/subscriptions", getSubscriptionsBySubscriber);

// Get a subscription by ID
router.get("/subscriptions/:id", getSubscriptionById);

// Update subscription by ID
router.put("/subscriptions/:id", updateSubscription);

// Delete subscription by ID
router.delete("/subscriptions/:id", deleteSubscription);

// Get all active subscriptions (admin/reporting)
router.get("/subscriptions/active/all", getAllActiveSubscriptions);

module.exports = router;
