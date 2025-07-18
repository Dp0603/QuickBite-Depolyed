const express = require("express");
const {
  createFeedback,
  getRestaurantFeedbacks,
  getMenuFeedbacks,
  verifyFeedback,
} = require("../controllers/FeedbackController");

const router = express.Router();

// ⭐ Submit feedback
router.post("/feedback", createFeedback);

// 📖 Get feedbacks for a restaurant
router.get("/feedback/restaurant/:restaurantId", getRestaurantFeedbacks);

// 📖 Get feedbacks for a menu item
router.get("/feedback/menu/:menuItemId", getMenuFeedbacks);

// ✅ Verify a feedback (admin/moderator only)
router.patch("/feedback/verify/:feedbackId", verifyFeedback);

module.exports = router;
