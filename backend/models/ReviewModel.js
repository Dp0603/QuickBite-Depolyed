const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, required: true, trim: true },
    verified: { type: Boolean, default: false },

    // ✅ Admin Moderation
    status: {
      type: String,
      enum: ["pending", "approved", "flagged"],
      default: "pending",
    },

    // ✅ Reply from restaurant owner
    reply: {
      text: { type: String, trim: true },
      repliedAt: { type: Date },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
