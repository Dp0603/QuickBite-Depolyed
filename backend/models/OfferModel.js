const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    discount: {
      type: String, // e.g. "₹100" or "20%"
      required: true,
    },
    minOrder: {
      type: Number,
      required: true,
    },
    validity: {
      type: Date,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Offer", offerSchema);
