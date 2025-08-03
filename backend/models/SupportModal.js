const mongoose = require("mongoose");

const supportSchema = new mongoose.Schema(
  {
    orderId: { type: mongoose.Schema.Types.ObjectId, required: true },
    issue: { type: String, required: true },
    message: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Explicitly specify the collection name as "support"
const Support = mongoose.model("Support", supportSchema, "support");

module.exports = Support;
