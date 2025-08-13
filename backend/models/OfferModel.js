const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      // required: true,
      default: null,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      maxlength: 300,
    },

    // 🔢 Discount Information
    discountType: {
      type: String,
      enum: ["PERCENT", "FLAT", "UPTO"],
      default: "PERCENT",
    },
    discountValue: {
      type: Number,
      required: true,
      min: 1,
    },
    maxDiscountAmount: {
      type: Number,
      default: null, // Only for PERCENT/UPTO types
    },

    // 💰 Conditions
    minOrderAmount: {
      type: Number,
      default: 0,
    },

    // 📅 Validity
    validFrom: {
      type: Date,
      required: true,
    },
    validTill: {
      type: Date,
      required: true,
    },

    // 🎯 Promo logic
    promoCode: {
      type: String,
      trim: true,
      unique: true,
      sparse: true, // Allows null/undefined for auto apply
    },
    isAutoApply: {
      type: Boolean,
      default: true,
    },

    // 📊 Optional: Usage Controls
    usageLimit: {
      type: Number,
      default: null,
    },
    perUserLimit: {
      type: Number,
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Offer", offerSchema);
