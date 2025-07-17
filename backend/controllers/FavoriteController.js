// controllers/FavoriteController.js
const Favorite = require("../models/FavoriteModel");
const Restaurant = require("../models/RestaurantModel");

// ⭐ Add to favorites
exports.addFavorite = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const userId = req.user._id;

    const alreadyExists = await Favorite.findOne({ userId, restaurantId });
    if (alreadyExists) {
      return res.status(400).json({ message: "Already in favorites" });
    }

    const newFav = await Favorite.create({ userId, restaurantId });
    res.status(201).json({ success: true, data: newFav });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to add favorite" });
  }
};

// ❌ Remove from favorites
exports.removeFavorite = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const userId = req.user._id;

    const fav = await Favorite.findOneAndDelete({ userId, restaurantId });

    if (!fav) {
      return res.status(404).json({ message: "Favorite not found" });
    }

    res.status(200).json({ success: true, message: "Removed from favorites" });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to remove favorite" });
  }
};

// 📦 Get all favorites
exports.getMyFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.user._id }).populate(
      "restaurantId"
    );

    const formatted = favorites.map((fav) => ({
      id: fav._id,
      restaurant: fav.restaurantId,
    }));

    res.status(200).json({ success: true, data: formatted });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to get favorites" });
  }
};
