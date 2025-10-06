const express = require("express");
const {
  createOffer,
  getOffersByRestaurant,
  getOfferById,
  updateOffer,
  deleteOffer,
  getValidOffersForCustomer,
  toggleOfferStatus,
  getOfferByPromoCode,
  getAllOffersForCustomer,
} = require("../controllers/OfferController");

const offerValidationRules = require("../utils/offerValidationRules");
const validateRequest = require("../utils/validateRequest");

const router = express.Router();

// ------------------------
// 🎁 Create & Update
// ------------------------
router.post("/offers", offerValidationRules(), validateRequest, createOffer);
router.put("/offers/:id", offerValidationRules(), validateRequest, updateOffer);

// ------------------------
// 📅 Customer & Global Fetch Routes
// ------------------------

// Get all offers (global + all restaurants)
router.get("/offers/all", getAllOffersForCustomer);

// Get all offers for a specific restaurant
router.get("/offers/restaurant/all/:restaurantId", getAllOffersForCustomer);

// Get active & valid offers for customer
router.get("/offers/valid/:restaurantId", getValidOffersForCustomer);

// Validate offer by promo code
router.get("/offers/promo", getOfferByPromoCode);

// ------------------------
// 📦 Restaurant / Offer Specific (Dynamic last)
// ------------------------

// Get all offers for a restaurant (admin/owner)
router.get("/offers/restaurant/:restaurantId", getOffersByRestaurant);

// Get single offer by ID
router.get("/offers/:id", getOfferById);

// Delete offer
router.delete("/offers/:id", deleteOffer);

// Toggle offer active status
router.patch("/offers/toggle/:id", toggleOfferStatus);

module.exports = router;
