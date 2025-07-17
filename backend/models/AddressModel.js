const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "entityType", // Dynamic reference
    },
    entityType: {
      type: String,
      required: true,
      enum: ["User", "Restaurant"], // Can link to either
    },
    addressLine: {
      type: String,
      required: true,
    },
    landmark: {
      type: String,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    pincode: {
      type: String,
      required: true,
    },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
    type: {
      type: String,
      enum: ["home", "work", "restaurant", "other"],
      default: "home",
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Address", addressSchema);
