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
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        note: {
          type: String,
        },
      },
    ],
    subtotal: {
      type: Number,
      required: true,
    },
    tax: {
      type: Number,
      required: true,
    },
    deliveryFee: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    offerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Offer",
      default: null,
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
      deliveryTime: {
        type: Date,
      },
      deliveryStatus: {
        type: String,
        enum: ["Pending", "Assigned", "Picked", "Delivered", "Failed"],
        default: "Pending",
      },
    },
    isRated: {
      type: Boolean,
      default: false,
    },
    notes: {
      type: String,
    },
    paymentDetails: {
      razorpay_order_id: String,
      razorpay_payment_id: String,
      razorpay_signature: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
