const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    items: [
      {
        menuItemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Menu",
          required: true,
        },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
        note: { type: String },
      },
    ],
    subtotal: { type: Number, required: true },
    tax: { type: Number, required: true },
    deliveryFee: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    offerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Offer",
      default: null,
    },
    deliveryAddress: {
      addressLine: { type: String, required: true },
      landmark: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      label: { type: String },
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },
    paymentMethod: {
      type: String,
      enum: ["COD", "Razorpay", "Stripe"],
      required: true,
    },
    orderStatus: {
      type: String,
      enum: [
        "Pending",
        "Preparing",
        "Ready",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
      ],
      default: "Pending",
    },
    deliveryDetails: {
      deliveryAgentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },
      deliveryTime: { type: Date },
      deliveryStatus: {
        type: String,
        enum: ["Pending", "Assigned", "Picked", "Delivered", "Failed"],
        default: "Pending",
      },
    },
    isRated: { type: Boolean, default: false },
    notes: { type: String },
    paymentDetails: {
      razorpay_order_id: String,
      razorpay_payment_id: String,
      razorpay_signature: String,
    },

    // Premium fields
    savings: { type: Number, default: 0 },
    premiumApplied: { type: Boolean, default: false },
    premiumBreakdown: {
      freeDelivery: { type: Number, default: 0 },
      extraDiscount: { type: Number, default: 0 },
      cashback: { type: Number, default: 0 },
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual for full address string
orderSchema.virtual("deliveryAddress.fullAddress").get(function () {
  const addr = this.deliveryAddress;
  if (!addr) return "";
  return `${
    addr.addressLine
  }${addr.landmark ? ", " + addr.landmark : ""}, ${addr.city}, ${addr.state} - ${addr.pincode}`;
});

module.exports = mongoose.model("Order", orderSchema);
