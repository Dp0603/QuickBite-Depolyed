const express = require("express");
const router = express.Router();
const {
  getOffers,
  createOffer,
  updateOffer,
  deleteOffer,
} = require("../controllers/OfferController");
const { protect, authorize } = require("../middlewares/authMiddleware");

// All routes protected to only restaurants
router.use(protect);
router.use(authorize("restaurant"));

router.get("/", getOffers);
router.post("/", createOffer);
router.put("/:id", updateOffer);
router.delete("/:id", deleteOffer);

module.exports = router;
