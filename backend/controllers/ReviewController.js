const Review = require("../models/ReviewModel");
const Order = require("../models/OrderModel");
const mongoose = require("mongoose");

const createReview = async (req, res) => {
  try {
    let { restaurantId, rating, comment } = req.body;

    // Trim values if strings
    if (typeof comment === "string") comment = comment.trim();

    // Validate required fields
    if (!restaurantId) {
      return res.status(400).json({ message: "Restaurant ID is required" });
    }
    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      return res.status(400).json({ message: "Invalid restaurant ID format" });
    }
    if (!rating) {
      return res.status(400).json({ message: "Rating is required" });
    }
    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }
    if (comment && (comment.length < 5 || comment.length > 500)) {
      return res
        .status(400)
        .json({ message: "Comment must be 5-500 characters" });
    }

    // Check if the user has ordered from this restaurant (only mark verified if yes)
    const hasOrdered = await Order.exists({
      userId: req.user._id,
      restaurantId,
      status: "Delivered",
    });

    // Prevent duplicate reviews from same user for the same restaurant
    const existingReview = await Review.findOne({
      userId: req.user._id,
      restaurantId,
    });
    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this restaurant" });
    }

    const review = new Review({
      restaurantId,
      userId: req.user._id,
      rating,
      comment,
      verified: !!hasOrdered,
    });

    await review.save();
    res.status(201).json({ message: "Review submitted successfully", review });
  } catch (err) {
    console.error("Error creating review:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getReviews = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid restaurant ID format" });
    }

    const reviews = await Review.find({ restaurantId: req.params.id })
      .populate("userId", "name")
      .sort({ createdAt: -1 });

    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    res.json({ reviews, averageRating });
  } catch (err) {
    console.error("Error fetching reviews:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ userId: req.user._id })
      .populate("restaurantId", "name logo")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    console.error("Error fetching user reviews:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const updateReview = async (req, res) => {
  try {
    const review = await Review.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (req.body.rating && (req.body.rating < 1 || req.body.rating > 5)) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }
    if (
      req.body.comment &&
      (req.body.comment.trim().length < 5 ||
        req.body.comment.trim().length > 500)
    ) {
      return res
        .status(400)
        .json({ message: "Comment must be between 5 and 500 characters" });
    }

    review.rating = req.body.rating ?? review.rating;
    review.comment = req.body.comment?.trim() ?? review.comment;

    await review.save();
    res.json({ message: "Review updated", review });
  } catch (err) {
    console.error("Error updating review:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteReview = async (req, res) => {
  try {
    const review = await Review.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json({ message: "Review deleted successfully" });
  } catch (err) {
    console.error("Error deleting review:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const replyToReview = async (req, res) => {
  try {
    const { id } = req.params; // reviewId
    const { reply } = req.body;

    if (!reply || reply.trim().length < 2) {
      return res
        .status(400)
        .json({ message: "Reply must be at least 2 characters" });
    }

    const review = await Review.findById(id).populate(
      "restaurantId",
      "ownerId name"
    );

    if (!review) return res.status(404).json({ message: "Review not found" });

    // Check if current user is the restaurant owner
    if (review.restaurantId.ownerId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to reply to this review" });
    }

    // Save reply
    review.reply = { text: reply.trim(), repliedAt: new Date() };
    await review.save();

    res.json({ success: true, message: "Reply added successfully", review });
  } catch (err) {
    console.error("Error replying to review:", err);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = {
  createReview,
  getReviews,
  getMyReviews,
  updateReview,
  deleteReview,
  replyToReview,
};
