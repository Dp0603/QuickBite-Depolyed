const express = require("express");
const { getTestMixedOffers } = require("../controllers/TestOfferController");

const router = express.Router();

// ✅ Test route for mixed offers
router.get("/offers/test-mixed", getTestMixedOffers);

module.exports = router;
