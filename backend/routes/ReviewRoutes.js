const express = require("express");
const router = express.Router();
const {
  createReview,
  getReviews,
  getMyReviews,
} = require("../controllers/ReviewController");
const { protect } = require("../middlewares/authMiddleware");

// ➕ Create a new review (requires login)
router.post("/", protect, createReview);

// 👤 Get current user's reviews (requires login)
router.get("/me", protect, getMyReviews);

// 🍽 Get all reviews for a specific restaurant (public)
router.get("/:id", getReviews);

module.exports = router;
