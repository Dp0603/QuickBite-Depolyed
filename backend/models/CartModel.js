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
      default: 1, // 👈 ensures if frontend forgets, defaults to 1
    },
    note: {
      type: String,
      maxlength: 200,
      trim: true, // 👈 removes accidental whitespace
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
      index: true, // 👈 helps queries like findOne({ userId })
    },
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
      index: true, // 👈 helps when filtering by restaurant
    },
    items: {
      type: [cartItemSchema],
      default: [],
    },
  },
  { timestamps: true }
);

// Ensure each user has only one cart per restaurant
cartSchema.index({ userId: 1, restaurantId: 1 }, { unique: true });

module.exports = mongoose.model("Cart", cartSchema);
