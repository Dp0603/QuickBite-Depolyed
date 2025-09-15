const PremiumSubscription = require("../models/PremiumSubscriptionModel");

// ➕ Create new premium subscription
const createSubscription = async (req, res) => {
  try {
    const {
      subscriberId,
      subscriberType,
      planName,
      price,
      durationInDays,
      endDate,
      perks = {},
    } = req.body;

    if (
      !subscriberId ||
      !subscriberType ||
      !planName ||
      !price ||
      !durationInDays ||
      !endDate
    ) {
      return res
        .status(400)
        .json({ message: "Missing required subscription fields" });
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized: User ID missing" });
    }

    const newSubscriptionData = {
      userId: req.user._id, // Link to logged-in user
      subscriberId,
      subscriberType,
      planName,
      price,
      durationInDays,
      startDate: new Date(),
      endDate: new Date(endDate),
      isActive: true,
      paymentStatus: "Paid", // Set initial payment status
      perks: {
        freeDelivery: perks.freeDelivery ?? true,
        extraDiscount: perks.extraDiscount ?? 0,
        cashback: perks.cashback ?? 0,
      },
      totalSavings: 0, // ✅ initialize totalSavings
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const newSubscription = await PremiumSubscription.create(
      newSubscriptionData
    );

    res.status(201).json({
      message: "Subscription created successfully",
      subscription: newSubscription,
    });
  } catch (err) {
    console.error("Create Subscription Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// 📦 Get all subscriptions for a specific user or restaurant (via query params)
const getSubscriptionsBySubscriber = async (req, res) => {
  try {
    const { subscriberId, subscriberType } = req.query;

    if (!subscriberId || !subscriberType) {
      return res.status(400).json({
        message:
          "subscriberId and subscriberType query parameters are required",
      });
    }

    const subscriptions = await PremiumSubscription.find({
      subscriberId,
      subscriberType,
    });

    res.status(200).json({
      message: "Subscriptions fetched successfully",
      subscriptions,
    });
  } catch (err) {
    console.error("Get Subscriptions Error:", err);
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
    console.error("Get Subscription By ID Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ✏️ Update subscription (e.g. payment status, perks, totalSavings)
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
    console.error("Update Subscription Error:", err);
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
    console.error("Delete Subscription Error:", err);
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
    console.error("Get Active Subscriptions Error:", err);
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
