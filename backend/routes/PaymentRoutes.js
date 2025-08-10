const express = require("express");
const router = express.Router();
const {
  createRazorpayOrder,
  verifyRazorpaySignature,
  getInvoicePDF,
  createPremiumRazorpayOrder,
  verifyPremiumPayment,
} = require("../controllers/PaymentController");

// 🛍 Normal Order Razorpay Routes
router.post("/create-order", createRazorpayOrder);
router.post("/verify-signature", verifyRazorpaySignature);

// 📄 Generate Invoice PDF
router.get("/invoice/:orderId", getInvoicePDF);

// 💎 Premium Razorpay Routes
router.post("/create-premium-order", createPremiumRazorpayOrder);
router.post("/verify-premium-payment", verifyPremiumPayment);

module.exports = router;
