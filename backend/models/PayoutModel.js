const mongoose = require("mongoose");

const payoutSchema = new mongoose.Schema(
  {
    payeeId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "payeeType",
    },
    payeeType: {
      type: String,
      enum: ["restaurant", "delivery"],
      required: true,
    },
    payoutAmount: {
      // ✅ renamed from amount → payoutAmount
      type: Number,
      required: true,
    },
    status: {
      // ✅ updated statuses
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    bankDetails: {
      // ✅ snapshot of bank/upi details
      method: String,
      bankAccount: String,
      ifsc: String,
      upiId: String,
    },
    referenceId: String, // Razorpay/Stripe txn ID
    note: String,
    processedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payout", payoutSchema);
