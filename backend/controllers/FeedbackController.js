const Feedback = require("../models/FeedbackModel");

// ⭐ Submit feedback
const createFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.create(req.body);
    res.status(201).json({ message: "Feedback submitted", data: feedback });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📖 Get feedbacks for a specific restaurant
const getRestaurantFeedbacks = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const feedbacks = await Feedback.find({
      restaurantId,
      feedbackType: "restaurant",
    }).sort({ createdAt: -1 });
    res
      .status(200)
      .json({ message: "Restaurant feedbacks fetched", data: feedbacks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📖 Get feedbacks for a specific menu item
const getMenuFeedbacks = async (req, res) => {
  try {
    const { menuItemId } = req.params;
    const feedbacks = await Feedback.find({
      menuItemId,
      feedbackType: "menu",
    }).sort({ createdAt: -1 });
    res
      .status(200)
      .json({ message: "Menu item feedbacks fetched", data: feedbacks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Verify feedback (Admin moderation)
const verifyFeedback = async (req, res) => {
  try {
    const { feedbackId } = req.params;
    const feedback = await Feedback.findByIdAndUpdate(
      feedbackId,
      { isVerified: true },
      { new: true }
    );
    res.status(200).json({ message: "Feedback verified", data: feedback });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createFeedback,
  getRestaurantFeedbacks,
  getMenuFeedbacks,
  verifyFeedback,
};
