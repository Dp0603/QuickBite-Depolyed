const PremiumSubscription = require("../models/PremiumSubscriptionModel");

// ➕ Create new premium subscription
const createSubscription = async (req, res) => {
  try {
    const newSubscription = await PremiumSubscription.create(req.body);

    res.status(201).json({
      message: "Subscription created successfully",
      subscription: newSubscription,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📦 Get all subscriptions for a specific user or restaurant
const getSubscriptionsBySubscriber = async (req, res) => {
  try {
    const { subscriberId, subscriberType } = req.params;

    const subscriptions = await PremiumSubscription.find({
      subscriberId,
      subscriberType,
    });

    res.status(200).json({
      message: "Subscriptions fetched successfully",
      subscriptions,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📄 Get single subscription by ID
const getSubscriptionById = async (req, res) => {
  try {
    const subscription = await PremiumSubscription.findById(req.params.id);
    if (!subscription)
      return res.status(404).json({ message: "Subscription not found" });

    res.status(200).json({
      message: "Subscription fetched successfully",
      subscription,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✏️ Update subscription (e.g. payment status)
const updateSubscription = async (req, res) => {
  try {
    const updated = await PremiumSubscription.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ message: "Subscription not found" });

    res.status(200).json({
      message: "Subscription updated successfully",
      subscription: updated,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🗑️ Delete subscription
const deleteSubscription = async (req, res) => {
  try {
    const deleted = await PremiumSubscription.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Subscription not found" });

    res.status(200).json({ message: "Subscription deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📊 Get all active subscriptions (Admin/report use)
const getAllActiveSubscriptions = async (req, res) => {
  try {
    const activeSubs = await PremiumSubscription.find({ isActive: true });

    res.status(200).json({
      message: "Active subscriptions fetched successfully",
      subscriptions: activeSubs,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createSubscription,
  getSubscriptionsBySubscriber,
  getSubscriptionById,
  updateSubscription,
  deleteSubscription,
  getAllActiveSubscriptions,
};
