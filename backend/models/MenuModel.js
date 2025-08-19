const mongoose = require("mongoose");

const daySchema = new mongoose.Schema(
  {
    available: { type: Boolean, default: true },
    startTime: { type: String, default: "00:00" }, // 24h format
    endTime: { type: String, default: "23:59" },
  },
  { _id: false }
);

const menuSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { type: String },
    image: { type: String },
    isAvailable: { type: Boolean, default: true }, // master switch

    // ⏰ New schedule field
    schedule: {
      monday: { type: daySchema, default: () => ({}) },
      tuesday: { type: daySchema, default: () => ({}) },
      wednesday: { type: daySchema, default: () => ({}) },
      thursday: { type: daySchema, default: () => ({}) },
      friday: { type: daySchema, default: () => ({}) },
      saturday: { type: daySchema, default: () => ({}) },
      sunday: { type: daySchema, default: () => ({}) },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Menu", menuSchema);
