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
      enum: ["Gold", "Platinum", "Business"], // You can customize plans
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
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "PremiumSubscription",
  premiumSubscriptionSchema
);
