const express = require("express");
const router = express.Router();
const {
  addRestaurantReview,
  getRestaurantReviews,
  getRestaurantRatingStats,
  getMyReviews,
  deleteMyReview,
} = require("../controllers/ReviewController");

const { protect } = require("../middlewares/authMiddleware");

router.post("/restaurant/:restaurantId", protect, addRestaurantReview);
router.get("/ratings/restaurant/:restaurantId", getRestaurantReviews);
router.get("/restaurant/:restaurantId/stats", getRestaurantRatingStats);
// 🧑‍💼 My reviews
router.get("/me", protect, getMyReviews);
router.delete("/:reviewId", protect, deleteMyReview);
module.exports = router;
