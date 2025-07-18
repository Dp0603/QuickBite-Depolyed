const express = require("express");
const {
  createOffer,
  getOffersByRestaurant,
  getOfferById,
  updateOffer,
  deleteOffer,
  getValidOffersForCustomer,
  toggleOfferStatus,
} = require("../controllers/OfferController");

const router = express.Router();

// 🎁 Create new offer
router.post("/offers", createOffer);

// 📦 Get all offers for a restaurant
router.get("/offers/restaurant/:restaurantId", getOffersByRestaurant);

// 🔍 Get single offer by ID
router.get("/offers/:id", getOfferById);

// 🔁 Update offer
router.put("/offers/:id", updateOffer);

// ❌ Delete offer
router.delete("/offers/:id", deleteOffer);

// 📅 Get active & valid offers for customer
router.get("/offers/valid/:restaurantId", getValidOffersForCustomer);

// 🔄 Toggle offer active status
router.patch("/offers/toggle/:id", toggleOfferStatus);

module.exports = router;
