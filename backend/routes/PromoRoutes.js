// routes/promoRoutes.js

const express = require("express");
const router = express.Router();
const { applyPromoCode } = require("../controllers/PromoController");

// Public route for applying promo code
router.post("/apply", applyPromoCode);

module.exports = router;
