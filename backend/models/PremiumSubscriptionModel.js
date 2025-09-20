const mongoose = require("mongoose");

const premiumSubscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subscriberId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "subscriberType",
    },
    subscriberType: {
      type: String,
      required: true,
      enum: ["User", "Restaurant"],
    },
    planName: {
      type: String,
      required: true,
      enum: [
        "Gold",
        "Platinum",
        "Business",
        "Diamond",
        "Gold Monthly",
        "Gold Yearly",
      ],
    },
    price: { type: Number, required: true },
    durationInDays: { type: Number, required: true },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },
    paymentId: { type: String },
    totalSavings: { type: Number, default: 0 },
    perks: {
      freeDelivery: { type: Boolean, default: true },
      extraDiscount: {
        type: { type: String, enum: ["FLAT", "PERCENT"], default: "FLAT" },
        value: { type: Number, default: 0 },
      },
      cashback: {
        type: { type: String, enum: ["FLAT", "PERCENT"], default: "FLAT" },
        value: { type: Number, default: 0 },
      },
    },
    perkUsageHistory: [
      {
        orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
        appliedAt: { type: Date, default: Date.now },
        discountApplied: Number,
        cashbackApplied: Number,
        freeDeliveryApplied: Boolean,
      },
    ],
  },

  { timestamps: true }
);

module.exports = mongoose.model(
  "PremiumSubscription",
  premiumSubscriptionSchema
);
