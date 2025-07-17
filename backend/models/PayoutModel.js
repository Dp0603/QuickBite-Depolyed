const mongoose = require("mongoose");

const payoutSchema = new mongoose.Schema(
  {
    payeeId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    payeeType: {
      type: String,
      enum: ["restaurant", "delivery"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Processed", "Failed"],
      default: "Pending",
    },
    method: {
      type: String,
      enum: ["Bank", "UPI"],
      required: true,
    },
    referenceId: {
      type: String, // Razorpay/Stripe txn ID
    },
    note: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payout", payoutSchema);
