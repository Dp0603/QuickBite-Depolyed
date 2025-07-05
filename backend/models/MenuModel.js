const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: [true, "Item name is required"],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "Item price is required"],
  },
  image: {
    type: String, // e.g., URL or path
    default: "",
  },
  category: {
    type: String,
    enum: ["Appetizer", "Main Course", "Dessert", "Drink", "Other"],
    default: "Other",
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("Menu", menuItemSchema);
