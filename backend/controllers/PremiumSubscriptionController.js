const PremiumSubscription = require("../models/PremiumSubscriptionModel");

// 🔹 Helper to normalize perks input
const normalizePerks = (perks = {}) => {
  const typeMap = {
    0: "FLAT",
    1: "PERCENT",
    FLAT: "FLAT",
    PERCENT: "PERCENT",
  };

  return {
    freeDelivery: perks.freeDelivery ?? true,
    extraDiscount: {
      type: typeMap[perks.extraDiscount?.type] || "FLAT",
      value: perks.extraDiscount?.value ?? 0,
    },
    cashback: {
      type: typeMap[perks.cashback?.type] || "FLAT",
      value: perks.cashback?.value ?? 0,
    },
  };
};

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
      perks,
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

    // ✅ Prevent multiple active subscriptions
    const activeSub = await PremiumSubscription.findOne({
      subscriberId,
      subscriberType,
      isActive: true,
      endDate: { $gte: new Date() },
    });
    if (activeSub) {
      return res
        .status(400)
        .json({ message: "Subscriber already has an active subscription" });
    }

    const newSubscriptionData = {
      userId: req.user?._id || null,
      subscriberId,
      subscriberType,
      planName,
      price,
      durationInDays,
      startDate: new Date(),
      endDate: new Date(endDate),
      isActive: true,
      paymentStatus: "Paid",
      perks: normalizePerks(perks),
      totalSavings: 0,
      perkUsageHistory: [],
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

// 📦 Get all subscriptions for a subscriber
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
    res
      .status(200)
      .json({ message: "Subscriptions fetched successfully", subscriptions });
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

    res
      .status(200)
      .json({ message: "Subscription fetched successfully", subscription });
  } catch (err) {
    console.error("Get Subscription By ID Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ✏️ Update subscription
const updateSubscription = async (req, res) => {
  try {
    if (req.body.perks) {
      req.body.perks = normalizePerks(req.body.perks);
    }

    const updated = await PremiumSubscription.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
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

// 📊 Get all active subscriptions
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

// 🔹 Helper: Fetch active premium subscription for a subscriber
const getActivePremiumPlan = async (subscriberId) => {
  return await PremiumSubscription.findOne({
    subscriberId,
    isActive: true,
    startDate: { $lte: new Date() },
    endDate: { $gte: new Date() },
  });
};

module.exports = {
  createSubscription,
  getSubscriptionsBySubscriber,
  getSubscriptionById,
  updateSubscription,
  deleteSubscription,
  getAllActiveSubscriptions,
  getActivePremiumPlan,
};
