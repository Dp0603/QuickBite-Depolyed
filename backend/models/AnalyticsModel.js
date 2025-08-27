const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema(
  {
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
    eventType: {
      type: String,
      enum: ["view", "click", "search", "favorite"],
    },
    metadata: { type: Object }, // extra details if needed
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    ipAddress: String,
    userAgent: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Analytics", analyticsSchema);
