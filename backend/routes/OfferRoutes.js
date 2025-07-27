const express = require("express");
const {
  createOffer,
  getOffersByRestaurant,
  getOfferById,
  updateOffer,
  deleteOffer,
  getValidOffersForCustomer,
  toggleOfferStatus,
  getOfferByPromoCode, // ✅ newly added
} = require("../controllers/OfferController");

const offerValidationRules = require("../utils/offerValidationRules");
const validateRequest = require("../utils/validateRequest");

const router = express.Router();

// 🎁 Create new offer
router.post("/offers", offerValidationRules(), validateRequest, createOffer);

// 🔁 Update offer
router.put("/offers/:id", offerValidationRules(), validateRequest, updateOffer);

// 📦 Get all offers for a restaurant
router.get("/offers/restaurant/:restaurantId", getOffersByRestaurant);

// 🔍 Get single offer by ID
router.get("/offers/:id", getOfferById);

// ❌ Delete offer
router.delete("/offers/:id", deleteOffer);

// 📅 Get active & valid offers for customer
router.get("/offers/valid/:restaurantId", getValidOffersForCustomer);

// 🔄 Toggle offer active status
router.patch("/offers/toggle/:id", toggleOfferStatus);

// 🎟️ Validate offer by promo code
router.get("/offers/promo", getOfferByPromoCode);

module.exports = router;
