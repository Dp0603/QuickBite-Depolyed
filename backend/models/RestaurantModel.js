// models/RestaurantModel.js
const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    restaurantName: {
      type: String,
      required: [true, "Restaurant name is required"],
      trim: true,
    },
    description: {
      type: String,
      maxlength: 500,
    },
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      zip: { type: String },
    },
    phone: {
      type: String,
      validate: {
        validator: (value) => /^\d{10}$/.test(value),
        message: "Please enter a valid 10-digit phone number",
      },
    },
    logoUrl: String,
    bannerUrl: String,
    cuisine: {
      type: String,
      enum: [
        "Indian",
        "Chinese",
        "Italian",
        "Mexican",
        "American",
        "Thai",
        "Other",
      ],
      default: "Other",
    },
    isOpen: {
      type: Boolean,
      default: true,
    },
    ratings: {
      type: Number,
      default: 0,
    },
    verified: {
      type: Boolean,
      default: false,
    },

    // ✅ Availability Settings
    availability: {
      isOnline: { type: Boolean, default: true },
      autoAvailabilityEnabled: { type: Boolean, default: false },
      openTime: { type: String, default: "09:00" },
      closeTime: { type: String, default: "22:00" },
      breaks: [
        {
          start: String,
          end: String,
        },
      ],
      holidays: [String], // e.g. ["2025-07-14"]
      autoAcceptOrders: { type: Boolean, default: true },
    },
    menuSchedule: [
      {
        name: String,
        start: String, // e.g., "08:00"
        end: String, // e.g., "11:00"
        enabled: { type: Boolean, default: true },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Restaurant", restaurantSchema);
