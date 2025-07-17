const Premium = require("../models/PremiumModel");

exports.subscribePremium = async (req, res) => {
  try {
    const { planType } = req.body;
    const userId = req.user.id;

    const duration = planType === "yearly" ? 365 : 30;
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + duration);

    const existing = await Premium.findOne({ userId });
    if (existing) {
      existing.planType = planType;
      existing.subscribedAt = new Date();
      existing.expiresAt = expiry;
      await existing.save();
      return res.json({ message: "Premium plan updated", data: existing });
    }

    const premium = await Premium.create({
      userId,
      planType,
      expiresAt: expiry,
    });

    res.status(201).json({ message: "Subscribed successfully", data: premium });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyPremium = async (req, res) => {
  try {
    const premium = await Premium.findOne({ userId: req.user.id });
    if (!premium) return res.status(404).json({ message: "No premium plan" });
    res.json({ data: premium });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
