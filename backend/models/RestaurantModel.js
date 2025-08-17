const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Basic Info
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    latitude: Number,
    longitude: Number,
    cuisines: [{ type: String }],

    // Hours
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
