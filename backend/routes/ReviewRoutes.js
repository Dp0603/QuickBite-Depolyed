const express = require("express");
const router = express.Router();
const {
  createReview,
  getReviews,
  getMyReviews,
  updateReview,
  deleteReview,
} = require("../controllers/ReviewController");
const { protect } = require("../middlewares/authMiddleware");

// ➕ Create a new review (requires login)
router.post("/review", protect, createReview);

// 👤 Get current user's reviews (requires login)
router.get("/me", protect, getMyReviews);

// ✏️ Update a review (requires login)
router.put("/review/edit/:id", protect, updateReview);

// 🗑 Delete a review (requires login)
router.delete("/review/delete/:id", protect, deleteReview);

// 🍽 Get all reviews for a specific restaurant (public)
router.get("/:id", getReviews);

module.exports = router;
