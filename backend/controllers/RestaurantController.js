const Restaurant = require("../models/RestaurantModel");

// 🍽️ Create a new restaurant (By owner)
const createRestaurant = async (req, res) => {
  try {
    const newRestaurant = await Restaurant.create(req.body);

    res.status(201).json({
      message: "Restaurant created successfully",
      restaurant: newRestaurant,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📄 Get a restaurant by ID
const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id)
      .populate("userId", "name email")
      .populate("addressId");

    if (!restaurant)
      return res.status(404).json({ message: "Restaurant not found" });

    res.status(200).json({
      message: "Restaurant fetched successfully",
      restaurant,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📦 Get all restaurants (public)
const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({
      isVerified: true,
      isOpen: true,
    }).populate("addressId");

    res.status(200).json({
      message: "Restaurants fetched successfully",
      restaurants,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔍 Get restaurants by owner (owner dashboard)
const getRestaurantsByOwner = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ ownerId: req.params.ownerId });

    res.status(200).json({
      message: "Owner's restaurants fetched successfully",
      restaurants,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Verify a restaurant (admin use)
const verifyRestaurant = async (req, res) => {
  try {
    const updated = await Restaurant.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ message: "Restaurant not found" });

    res.status(200).json({
      message: "Restaurant verified successfully",
      restaurant: updated,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔁 Update restaurant details
const updateRestaurant = async (req, res) => {
  try {
    const updated = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    if (!updated)
      return res.status(404).json({ message: "Restaurant not found" });

    res.status(200).json({
      message: "Restaurant updated successfully",
      restaurant: updated,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ❌ Delete restaurant
const deleteRestaurant = async (req, res) => {
  try {
    const deleted = await Restaurant.findByIdAndDelete(req.params.id);

    if (!deleted)
      return res.status(404).json({ message: "Restaurant not found" });

    res.status(200).json({ message: "Restaurant deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createRestaurant,
  getRestaurantById,
  getAllRestaurants,
  getRestaurantsByOwner,
  verifyRestaurant,
  updateRestaurant,
  deleteRestaurant,
};
