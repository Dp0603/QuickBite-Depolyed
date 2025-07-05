const RatingModel = require("../models/RatingModel");

// ➕ Create or Update Rating
const createOrUpdateRating = async (req, res) => {
  try {
    const { foodId, rating, feedback } = req.body;
    const userId = req.user._id; // 👤 Authenticated user

    if (!foodId || !rating) {
      return res
        .status(400)
        .json({ message: "Food ID and rating are required" });
    }

    // Check if user has already rated this food
    let existingRating = await RatingModel.findOne({ userId, foodId });

    if (existingRating) {
      // Update the existing rating
      existingRating.rating = rating;
      existingRating.feedback = feedback;
      await existingRating.save();

      return res.status(200).json({
        message: "Rating updated successfully",
        data: existingRating,
      });
    }

    // Create a new rating
    const newRating = await RatingModel.create({
      userId,
      foodId,
      rating,
      feedback,
    });

    res.status(201).json({
      message: "Rating submitted successfully",
      data: newRating,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📥 Get All Ratings for a Food Item
const getRatingsByFood = async (req, res) => {
  try {
    const { foodId } = req.params;
    const ratings = await RatingModel.find({ foodId }).populate(
      "userId",
      "name email"
    );

    res.status(200).json({
      message: "Ratings fetched successfully",
      data: ratings,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 👤 Get All Ratings by a User
const getRatingsByUser = async (req, res) => {
  try {
    const userId = req.user._id;

    const ratings = await RatingModel.find({ userId }).populate(
      "foodId",
      "title price image"
    );

    res.status(200).json({
      message: "User's ratings retrieved successfully",
      data: ratings,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createOrUpdateRating,
  getRatingsByFood,
  getRatingsByUser,
};
