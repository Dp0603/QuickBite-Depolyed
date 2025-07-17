const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // user with role = restaurant
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    logo: {
      type: String, // Cloudinary URL
      default: "",
    },
    cuisineType: {
      type: [String], // e.g., ["Indian", "Chinese"]
      required: true,
    },
    description: {
      type: String,
      maxlength: 1000,
    },
    addressId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    isOpen: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    deliveryTimeEstimate: {
      type: String, // e.g., "30-40 mins"
      default: "30-45 mins",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Restaurant", restaurantSchema);
