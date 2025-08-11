const Review = require("../models/ReviewModel");
const Order = require("../models/OrderModel");

// Create review
const createReview = async (req, res) => {
  try {
    const { restaurantId, rating, comment } = req.body;
    if (!restaurantId || !rating) {
      return res
        .status(400)
        .json({ message: "Restaurant ID and rating are required" });
    }

    // Check if user ordered from this restaurant (for verified badge)
    const hasOrdered = await Order.exists({
      userId: req.user._id,
      restaurantId,
      status: "Delivered",
    });

    const review = new Review({
      restaurantId,
      userId: req.user._id,
      rating,
      comment,
      verified: !!hasOrdered,
    });

    await review.save();
    res.status(201).json({ message: "Review submitted", review });
  } catch (err) {
    console.error("Error creating review:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get reviews for a restaurant
const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ restaurantId: req.params.id })
      .populate("userId", "name")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get current user's reviews
const getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ userId: req.user._id })
      .populate("restaurantId", "restaurantName")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createReview, getReviews, getMyReviews };
