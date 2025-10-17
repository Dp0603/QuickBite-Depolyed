const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    platformName: { type: String, default: "QuickBite" },
    contactEmail: { type: String, default: "support@quickbite.com" },
    supportNumber: { type: String, default: "+91-9876543210" },
    deliveryCharge: { type: Number, default: 30 },
    taxPercentage: { type: Number, default: 5 },
    payoutThreshold: { type: Number, default: 1000 },
    maintenanceMode: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Settings", settingsSchema);
