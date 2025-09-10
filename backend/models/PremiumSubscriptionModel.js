const mongoose = require("mongoose");

const premiumSubscriptionSchema = new mongoose.Schema(
  {
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
    price: {
      type: Number,
      required: true,
    },
    durationInDays: {
      type: Number,
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
    isActive: {
      type: Boolean,
      default: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },
    paymentId: {
      type: String, // Razorpay/Stripe txn ID
    },

    // 🆕 Track how much value the subscriber got
    totalSavings: {
      type: Number,
      default: 0,
    },

    // 🆕 (Optional, for clarity) store perks applied by this plan
    perks: {
      freeDelivery: { type: Boolean, default: true },
      extraDiscount: { type: Number, default: 0 }, // % discount on subtotal
      cashback: { type: Number, default: 0 }, // flat ₹ cashback per order
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "PremiumSubscription",
  premiumSubscriptionSchema
);
