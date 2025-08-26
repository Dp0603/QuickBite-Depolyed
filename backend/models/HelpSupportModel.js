const mongoose = require("mongoose");

// ===== FAQ Schema =====
const faqSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    category: { type: String, default: "General" }, // e.g., Payments, Orders
    icon: { type: String, default: "FaQuestionCircle" }, // maps to frontend icons
    isActive: { type: Boolean, default: true },

    // Differentiate between customer & restaurant FAQs
    role: {
      type: String,
      enum: ["customer", "restaurant"],
      required: true,
    },
  },
  { timestamps: true }
);

// ===== Ticket Schema =====
const ticketSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true },
    email: { type: String, required: true },
    issue: { type: String, required: true }, // e.g., payment, account, offers
    message: { type: String, required: true },
    attachmentUrl: { type: String },
    ticketId: { type: String, unique: true },
    status: {
      type: String,
      enum: ["pending", "in-progress", "resolved", "closed"],
      default: "pending",
    },

    // Differentiate between customer & restaurant tickets
    role: {
      type: String,
      enum: ["customer", "restaurant"],
      required: true,
    },
  },
  { timestamps: true }
);

const FAQ = mongoose.model("FAQ", faqSchema, "faqs");
const HelpTicket = mongoose.model(
  "HelpTicket",
  ticketSchema,
  "helpsupporttickets"
);

module.exports = { FAQ, HelpTicket };
