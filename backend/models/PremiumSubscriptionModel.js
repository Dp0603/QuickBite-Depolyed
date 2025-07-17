const mongoose = require("mongoose");

const premiumSubscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  plan: {
    type: String,
    enum: ["monthly", "yearly"],
    required: true,
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model(
  "PremiumSubscription",
  premiumSubscriptionSchema
);
