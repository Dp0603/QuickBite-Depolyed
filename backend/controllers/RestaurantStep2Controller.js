const Restaurant = require("../models/RestaurantStep2Model");

// ✅ Create restaurant profile
const createProfile = async (req, res) => {
  try {
    const ownerId = req.user._id; // from auth middleware
    const existing = await Restaurant.findOne({ owner: ownerId });
    if (existing) {
      return res.status(400).json({ message: "Profile already exists" });
    }

    const restaurant = await Restaurant.create({
      ...req.body,
      owner: ownerId,
    });

    res.status(201).json({
      message: "Restaurant profile created, waiting for approval",
      restaurant,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update restaurant profile
const updateProfile = async (req, res) => {
  try {
    const ownerId = req.user._id;
    const restaurant = await Restaurant.findOneAndUpdate(
      { owner: ownerId },
      req.body,
      { new: true }
    );

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.status(200).json({ message: "Profile updated", restaurant });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get my profile
const getMyProfile = async (req, res) => {
  try {
    const ownerId = req.user._id;
    const restaurant = await Restaurant.findOne({ owner: ownerId });

    if (!restaurant) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json({ restaurant });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Admin approve/reject
const changeStatus = async (req, res) => {
  try {
    const { id } = req.params; // restaurantId
    const { status } = req.body;

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const restaurant = await Restaurant.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.status(200).json({ message: `Restaurant ${status}`, restaurant });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProfile,
  updateProfile,
  getMyProfile,
  changeStatus,
};
