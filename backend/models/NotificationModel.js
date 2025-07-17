const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["order", "promo", "payout", "system"],
      default: "order",
    },
    role: {
      type: String,
      enum: ["customer", "restaurant", "deliveryAgent", "admin"],
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    redirectUrl: {
      type: String, // e.g. /order/summary/12345
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
