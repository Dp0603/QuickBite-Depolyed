const mongoose = require("mongoose");

const subscriptionHistorySchema = new mongoose.Schema(
  {
    subscriberId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "subscriberType",
    },
    subscriberType: {
      type: String,
      enum: ["User", "Restaurant"],
      required: true,
    },
    planName: {
      type: String,
      enum: [
        "Gold",
        "Platinum",
        "Business",
        "Diamond",
        "Gold Monthly",
        "Gold Yearly",
      ],
      required: true,
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
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    paymentId: {
      type: String,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Paid",
    },
  },
  { timestamps: true }
);

// optional index to speed up analytics queries
subscriptionHistorySchema.index({ subscriberId: 1 });

module.exports = mongoose.model(
  "SubscriptionHistory",
  subscriptionHistorySchema
);
