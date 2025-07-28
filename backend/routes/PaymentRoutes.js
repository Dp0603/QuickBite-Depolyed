const express = require("express");
const router = express.Router();
const {
  createRazorpayOrder,
  verifyRazorpaySignature,
  getInvoicePDF,
} = require("../controllers/PaymentController");

// 🧾 Razorpay Routes
router.post("/create-order", createRazorpayOrder);
router.post("/verify-signature", verifyRazorpaySignature);

// 📄 Generate Invoice PDF
router.get("/invoice/:orderId", getInvoicePDF); // ✅ New route

module.exports = router;
