const express = require("express");
const {
  createPayout,
  updatePayoutStatus,
  getPayoutsByPayee,
  getAllPayouts,
  getPayoutInvoicePDF,
} = require("../controllers/PayoutController");

const router = express.Router();

// 💸 Create a new payout (Admin only)
router.post("/payouts", createPayout);

// 🔁 Update payout status (pending → paid / failed)
router.put("/payouts/:payoutId", updatePayoutStatus);

// 👤 Get payouts for a specific payee (restaurant / delivery)
router.get("/payouts/payee/:payeeId", getPayoutsByPayee);

// 🧾 Get all payouts (Admin dashboard)
router.get("/payouts", getAllPayouts);

// 📄 Download payout invoice PDF
router.get("/payouts/invoice/:payoutId", getPayoutInvoicePDF);

module.exports = router;
