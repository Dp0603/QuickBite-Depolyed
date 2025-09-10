const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
  {
    menuItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Menu",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    note: {
      type: String,
      maxlength: 200,
      trim: true,
    },
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
      index: true,
    },
    items: {
      type: [cartItemSchema],
      default: [],
    },
    premiumSummary: {
      freeDelivery: { type: Number, default: 0 },
      extraDiscount: { type: Number, default: 0 },
      cashback: { type: Number, default: 0 },
      totalSavings: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

// Ensure each user has only one cart per restaurant
cartSchema.index({ userId: 1, restaurantId: 1 }, { unique: true });

module.exports = mongoose.model("Cart", cartSchema);
