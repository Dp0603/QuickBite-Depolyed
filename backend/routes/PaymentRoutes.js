const express = require("express");
const router = express.Router();
const {
  createRazorpayOrder,
  verifyRazorpaySignature,
  getInvoicePDF,
  createPremiumRazorpayOrder,
  verifyPremiumPayment,
} = require("../controllers/PaymentController");

const { protect } = require("../middlewares/authMiddleware");

// 🛍 Normal Order Razorpay Routes
router.post("/create-order", createRazorpayOrder);
router.post("/verify-signature", verifyRazorpaySignature);

// 📄 Generate Invoice PDF
router.get("/invoice/:orderId", getInvoicePDF);

// 💎 Premium Razorpay Routes (with JWT protection)
router.post("/create-premium-order", protect, createPremiumRazorpayOrder);
router.post("/verify-premium-payment", protect, verifyPremiumPayment);

module.exports = router;
