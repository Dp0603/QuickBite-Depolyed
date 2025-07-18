const express = require("express");
const {
  createPayout,
  updatePayoutStatus,
  getPayoutsByPayee,
  getAllPayouts,
} = require("../controllers/PayoutController");

const router = express.Router();

// 💸 Create a new payout (Admin)
router.post("/payouts", createPayout);

// 🔁 Update payout status (Pending -> Processed/Failed)
router.put("/payouts/:payoutId", updatePayoutStatus);

// 👤 Get payouts for a specific payee (restaurant or delivery agent)
router.get("/payouts/payee/:payeeId", getPayoutsByPayee);

// 🧾 Get all payouts (Admin dashboard)
router.get("/payouts", getAllPayouts);

module.exports = router;
