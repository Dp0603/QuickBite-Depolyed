const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // One restaurant per user
    },
    restaurantName: {
      type: String,
      required: [true, "Restaurant name is required"],
      trim: true,
      minlength: 3,
      maxlength: 100,
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
        validator: function (value) {
          return /^\d{10}$/.test(value); // basic 10-digit validation
        },
        message: "Please enter a valid 10-digit phone number",
      },
    },
    logoUrl: {
      type: String,
    },
    bannerUrl: {
      type: String,
    },
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Restaurant", restaurantSchema);
