const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      maxlength: 500,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String, // Cloudinary URL
      default: "",
    },
    category: {
      type: String,
      required: true, // e.g., "Starter", "Main Course", etc.
    },
    tags: {
      type: [String], // optional: e.g., ["Spicy", "Vegan"]
      default: [],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Menu", menuItemSchema);
