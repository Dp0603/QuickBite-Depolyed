const express = require("express");
const router = express.Router();
const {
  createRazorpayOrder,
  verifyRazorpaySignature,
} = require("../controllers/PaymentController");

router.post("/create-order", createRazorpayOrder);
router.post("/verify-signature", verifyRazorpaySignature);
module.exports = router;
