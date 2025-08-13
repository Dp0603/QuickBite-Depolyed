const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema({
  category: { type: String, required: true },
  icon: { type: String, default: "FaQuestionCircle" },
  items: [
    {
      q: { type: String, required: true },
      a: { type: String, required: true },
    },
  ],
});

module.exports = mongoose.model("Faq", faqSchema, "faqs");
