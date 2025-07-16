const Review = require("../models/ReviewModel");
const User = require("../models/UserModel");

exports.getRestaurantReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ restaurantId: req.params.restaurantId })
      .populate("userId", "name") // for review.user?.name in frontend
      .sort({ createdAt: -1 });

    const formattedReviews = reviews.map((review) => ({
      _id: review._id,
      user: { name: review.userId?.name || "Anonymous" },
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
    }));

    res.status(200).json({ success: true, data: formattedReviews });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch reviews" });
  }
};

exports.addRestaurantReview = async (req, res) => {
  const { rating, comment } = req.body;
  const { restaurantId } = req.params;

  try {
    const newReview = new Review({
      restaurantId,
      userId: req.user._id,
      rating,
      comment,
    });

    const savedReview = await newReview.save();
    res.status(201).json({ success: true, data: savedReview });
  } catch (err) {
    res
      .status(400)
      .json({ success: false, message: "Review submission failed" });
  }
};

exports.getRestaurantRatingStats = async (req, res) => {
  const { restaurantId } = req.params;

  try {
    const stats = await Review.aggregate([
      {
        $match: {
          restaurantId: require("mongoose").Types.ObjectId(restaurantId),
        },
      },
      {
        $group: {
          _id: "$restaurantId",
          avgRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: stats[0] || { avgRating: 0, totalReviews: 0 },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to get stats" });
  }
};
exports.getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ userId: req.user._id })
      .populate("restaurantId", "restaurantName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch your reviews",
    });
  }
};

exports.deleteMyReview = async (req, res) => {
  try {
    const review = await Review.findOneAndDelete({
      _id: req.params.reviewId,
      userId: req.user._id,
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found or not authorized",
      });
    }

    res.status(200).json({ success: true, message: "Review deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to delete review" });
  }
};
exports.deleteMyReview = async (req, res) => {
  try {
    const review = await Review.findOneAndDelete({
      _id: req.params.reviewId,
      userId: req.user._id,
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found or not authorized",
      });
    }

    res.status(200).json({ success: true, message: "Review deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to delete review" });
  }
};
