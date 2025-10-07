const mongoose = require("mongoose");

const payoutSchema = new mongoose.Schema(
  {
    payeeId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "payeeType", // Dynamically references either Restaurant or Delivery model
    },
    payeeType: {
      type: String,
      enum: ["restaurant", "delivery"],
      required: true,
    },
    payoutAmount: {
      type: Number,
      required: true,
      min: 1,
    },
    status: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    bankDetails: {
      method: String, // e.g. "bank", "upi"
      bankAccount: String,
      ifsc: String,
      upiId: String,
    },
    referenceId: String, // transaction ID or reference
    note: String, // optional admin note
    processedAt: Date, // date when payout was processed
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payout", payoutSchema);
