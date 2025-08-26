const express = require("express");
const {
  createPayout,
  updatePayoutStatus,
  getPayoutsByPayee,
  getAllPayouts,
  getPayoutInvoicePDF, // 👈 import
} = require("../controllers/PayoutController");

const router = express.Router();

// 💸 Create a new payout (Admin)
router.post("/payouts", createPayout);

// 🔁 Update payout status
router.put("/payouts/:payoutId", updatePayoutStatus);

// 👤 Get payouts for a specific payee
router.get("/payouts/payee/:payeeId", getPayoutsByPayee);

// 🧾 Get all payouts (Admin dashboard)
router.get("/payouts", getAllPayouts);

// 📄 Download payout invoice PDF
router.get("/payouts/invoice/:payoutId", getPayoutInvoicePDF);

module.exports = router;
