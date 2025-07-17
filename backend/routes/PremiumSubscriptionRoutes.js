const express = require("express");
const router = express.Router();
const {
  subscribeToPremium,
  getMyPremiumStatus,
} = require("../controllers/PremiumSubscriptionController");
const { protect } = require("../middlewares/authMiddleware");

router.post("/subscribe", protect, subscribeToPremium);
router.get("/status", protect, getMyPremiumStatus);

module.exports = router;
