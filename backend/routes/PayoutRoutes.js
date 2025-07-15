const express = require("express");
const router = express.Router();
const {
  createPayout,
  getAllPayouts,
  getUserPayouts,
  markPayoutPaid,
} = require("../controllers/PayoutController");

// ➕ Create a payout (admin)
router.post("/", createPayout);

// 📦 Get all payouts (admin)
router.get("/", getAllPayouts);

// 👤 Get payouts for a specific user (restaurant or delivery)
router.get("/user/:userId", getUserPayouts);

// ✅ Mark payout as paid
router.put("/:id/mark-paid", markPayoutPaid);

module.exports = router;
