const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      default: null,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, maxlength: 300 },

    discountType: {
      type: String,
      enum: ["PERCENT", "FLAT", "UPTO"],
      default: "PERCENT",
    },
    discountValue: { type: Number, required: true, min: 1 },
    maxDiscountAmount: { type: Number, default: null },

    minOrderAmount: { type: Number, default: 0 },

    validFrom: { type: Date, required: true },
    validTill: { type: Date, required: true },

    promoCode: { type: String, trim: true, sparse: true }, // removed unique
    isAutoApply: { type: Boolean, default: true },

    usageLimit: { type: Number, default: null },
    perUserLimit: { type: Number, default: null },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// ✅ Validation logic
offerSchema.pre("save", function (next) {
  if (this.discountType === "PERCENT") {
    if (this.discountValue < 1 || this.discountValue > 100)
      return next(
        new Error("Percentage discountValue must be between 1 and 100.")
      );
  }

  if (this.discountType === "UPTO") {
    if (!this.maxDiscountAmount || this.maxDiscountAmount < 1)
      return next(
        new Error(
          "maxDiscountAmount is required and must be ≥ 1 for UPTO offers."
        )
      );
  }

  if (this.discountType === "FLAT") {
    if (this.discountValue < 1)
      return next(new Error("Flat discountValue must be at least ₹1."));
  }

  if (this.validFrom > this.validTill)
    return next(new Error("validFrom date cannot be after validTill date."));

  next();
});

// ✅ Compound index to allow same promo code across different restaurants
offerSchema.index(
  { restaurantId: 1, promoCode: 1 },
  { unique: true, sparse: true }
);

module.exports = mongoose.model("Offer", offerSchema);
