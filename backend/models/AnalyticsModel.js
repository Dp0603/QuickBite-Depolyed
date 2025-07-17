const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema(
  {
    entityType: {
      type: String,
      enum: ["restaurant", "menu", "user", "order", "page"],
      required: true,
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false, // For general page views like "/home"
    },
    eventType: {
      type: String,
      enum: ["view", "click", "search", "order", "favorite"],
      required: true,
    },
    metadata: {
      type: Object, // optional details like device info, referral, etc.
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Analytics", analyticsSchema);
