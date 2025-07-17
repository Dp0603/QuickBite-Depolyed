const Premium = require("../models/PremiumSubscriptionModel");
const dayjs = require("dayjs");

exports.subscribeToPremium = async (req, res) => {
  try {
    const { plan } = req.body;
    const userId = req.user.id;

    const endDate =
      plan === "monthly"
        ? dayjs().add(30, "day").toDate()
        : dayjs().add(1, "year").toDate();

    const existing = await Premium.findOne({ userId });

    if (existing) {
      existing.plan = plan;
      existing.startDate = new Date();
      existing.endDate = endDate;
      await existing.save();
      return res
        .status(200)
        .json({ message: "Subscription updated", data: existing });
    }

    const subscription = await Premium.create({
      userId,
      plan,
      endDate,
    });

    res
      .status(201)
      .json({ message: "Subscribed to Premium", data: subscription });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyPremiumStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const subscription = await Premium.findOne({ userId });

    if (!subscription || new Date(subscription.endDate) < new Date()) {
      return res.status(200).json({ isPremium: false });
    }

    res.status(200).json({ isPremium: true, data: subscription });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
