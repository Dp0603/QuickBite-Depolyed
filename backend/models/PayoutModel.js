const mongoose = require("mongoose");

const payoutSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["restaurant", "delivery"],
      required: true,
    },
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    commission: {
      type: Number,
      default: 0,
    },
    payoutAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Paid"],
      default: "Pending",
    },
    paidAt: Date,
    method: {
      type: String,
      enum: ["UPI", "Bank Transfer", "Cash", "Wallet"],
      default: "UPI",
    },
    notes: String,
    currency: {
      type: String,
      default: "INR",
    },
    invoiceUrl: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payout", payoutSchema);
