const express = require("express");
const router = express.Router();
const {
  getOffers,
  createOffer,
  updateOffer,
  deleteOffer,
  getPublicOffers,
} = require("../controllers/OfferController");

const { protect, authorize } = require("../middlewares/authMiddleware");

// ✅ Public offers route for customers
router.get("/public", getPublicOffers);

// 🔐 Protected routes for restaurant
router.use(protect);
router.use(authorize("restaurant"));

router.get("/", getOffers);
router.post("/", createOffer);
router.put("/:id", updateOffer);
router.delete("/:id", deleteOffer);

module.exports = router;
