const mongoose = require("mongoose");

// ✅ Availability per day
const availabilitySchema = new mongoose.Schema({
  day: {
    type: String,
    enum: [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ],
    required: true,
  },
  isClosed: { type: Boolean, default: false },
  open: { type: String }, // e.g. "09:00"
  close: { type: String }, // e.g. "22:00"
  breaks: [
    {
      start: { type: String }, // e.g. "14:00"
      end: { type: String }, // e.g. "17:00"
    },
  ],
});

// ✅ Override schema (special days)
const overrideSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  open: { type: String },
  close: { type: String },
  isClosed: { type: Boolean, default: false },
});

// 🆕 Settings Schemas
const orderSettingsSchema = new mongoose.Schema({
  minOrderValue: { type: Number, default: 0 },
  maxOrdersPerSlot: { type: Number, default: 0 },
  prepTimeMinutes: { type: Number, default: 15 },
  cancelWindowMinutes: { type: Number, default: 15 },
});

const deliverySettingsSchema = new mongoose.Schema({
  deliveryRadiusKm: { type: Number, default: 5 },
  deliveryChargeFlat: { type: Number, default: 0 },
  chargePerKm: { type: Number, default: 0 },
  selfDelivery: { type: Boolean, default: false },
});

const payoutSettingsSchema = new mongoose.Schema({
  payoutFrequency: {
    type: String,
    enum: ["manual", "weekly", "biweekly"],
    default: "weekly",
  },
  preferredMethod: {
    type: String,
    enum: ["bank", "upi"],
    default: "bank",
  },
  bankAccount: { type: String, default: "" },
  ifsc: { type: String, default: "" },
  upiId: { type: String, default: "" },
  gstin: { type: String, default: "" },
});

const notificationSettingsSchema = new mongoose.Schema({
  emailAlerts: { type: Boolean, default: true },
  smsAlerts: { type: Boolean, default: true },
  pushNotifications: { type: Boolean, default: true },
});

const securitySettingsSchema = new mongoose.Schema({
  twoFactorEnabled: { type: Boolean, default: false },
});

// ✅ Main Restaurant Schema
const restaurantSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Basic Info
    name: { type: String, required: true, trim: true },
    phoneNumber: { type: String, required: true },
    address: { type: String, required: true },
    latitude: Number,
    longitude: Number,
    cuisines: [{ type: String }],

    // Hours (⚠️ old format for backward compatibility)
    openingHours: {
      monday: { open: String, close: String },
      tuesday: { open: String, close: String },
      wednesday: { open: String, close: String },
      thursday: { open: String, close: String },
      friday: { open: String, close: String },
      saturday: { open: String, close: String },
      sunday: { open: String, close: String },
    },

    // Media
    logo: { type: String },
    coverImage: { type: String },
    gallery: [{ type: String }],

    // Legal / Compliance
    licenseNumber: { type: String },
    gstNumber: { type: String },
    bankAccount: {
      accountNumber: String,
      ifsc: String,
      holderName: String,
    },

    // Status & Meta
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    rating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },

    // ------------------------
    // 🔥 Availability Fields
    // ------------------------
    isOnline: { type: Boolean, default: true },
    autoAvailabilityEnabled: { type: Boolean, default: false },
    autoAcceptOrders: { type: Boolean, default: true },
    weeklyAvailability: [availabilitySchema],
    holidays: [{ type: Date }],
    overrides: [overrideSchema],

    // ------------------------
    // 🆕 Extended Settings
    // ------------------------
    orderSettings: orderSettingsSchema,
    deliverySettings: deliverySettingsSchema,
    payoutSettings: payoutSettingsSchema,
    notificationSettings: notificationSettingsSchema,
    securitySettings: securitySettingsSchema,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Restaurant", restaurantSchema);

// OLD

// const mongoose = require("mongoose");

// const restaurantSchema = new mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true, // user with role = restaurant
//     },
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     logo: {
//       type: String, // Cloudinary URL
//       default: "",
//     },
//     cuisineType: {
//       type: [String], // e.g., ["Indian", "Chinese"]
//       required: true,
//     },
//     description: {
//       type: String,
//       maxlength: 1000,
//     },
//     addressId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Address",
//       required: true,
//     },
//     averageRating: {
//       type: Number,
//       default: 0,
//     },
//     totalReviews: {
//       type: Number,
//       default: 0,
//     },
//     isOpen: {
//       type: Boolean,
//       default: true,
//     },
//     isVerified: {
//       type: Boolean,
//       default: false,
//     },
//     deliveryTimeEstimate: {
//       type: String, // e.g., "30-40 mins"
//       default: "30-45 mins",
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Restaurant", restaurantSchema);
