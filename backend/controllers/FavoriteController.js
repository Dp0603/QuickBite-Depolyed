const mongoose = require("mongoose");
const Favorite = require("../models/FavoriteModel");
const Restaurant = require("../models/RestaurantModel");
const MenuItem = require("../models/MenuModel");

// ❤️ Add restaurant to user's favorites
const addToFavorites = async (req, res) => {
  try {
    console.log("⭐ Incoming body:", req.body);
    const { userId, restaurantId } = req.body;

    // Validate IDs
    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(restaurantId)
    ) {
      return res
        .status(400)
        .json({ message: "Invalid userId or restaurantId" });
    }

    const userIdObj = new mongoose.Types.ObjectId(userId);
    const restIdObj = new mongoose.Types.ObjectId(restaurantId);

    // Add to favorites safely using $addToSet
    const favorite = await Favorite.findOneAndUpdate(
      { userId: userIdObj },
      { $addToSet: { restaurantIds: restIdObj } },
      { new: true, upsert: true }
    );

    res.status(200).json({
      message: "Restaurant added to favorites",
      favorites: favorite,
    });
  } catch (err) {
    console.error("❌ Error in addToFavorites:", err);
    res.status(500).json({ message: err.message });
  }
};

// ❌ Remove restaurant from user's favorites
const removeFromFavorites = async (req, res) => {
  try {
    const { userId, restaurantId } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(restaurantId)
    ) {
      return res
        .status(400)
        .json({ message: "Invalid userId or restaurantId" });
    }

    const userIdObj = new mongoose.Types.ObjectId(userId);
    const restIdObj = new mongoose.Types.ObjectId(restaurantId);

    const favorite = await Favorite.findOneAndUpdate(
      { userId: userIdObj },
      { $pull: { restaurantIds: restIdObj } },
      { new: true }
    );

    if (!favorite) {
      return res.status(404).json({ message: "Favorite list not found" });
    }

    res.status(200).json({
      message: "Restaurant removed from favorites",
      favorites: favorite,
    });
  } catch (err) {
    console.error("❌ Error in removeFromFavorites:", err);
    res.status(500).json({ message: err.message });
  }
};

// 📜 Get all favorite restaurants of a user
const getUserFavorites = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }
    const userIdObj = new mongoose.Types.ObjectId(req.params.userId);

    const favorite = await Favorite.findOne({ userId: userIdObj }).populate(
      "restaurantIds",
      "name logo cuisineType"
    );

    if (!favorite) {
      return res
        .status(200)
        .json({ message: "No favorites found", favorites: [] });
    }

    res.status(200).json({
      message: "Favorite restaurants fetched successfully",
      favorites: favorite.restaurantIds,
    });
  } catch (err) {
    console.error("❌ Error in getUserFavorites:", err);
    res.status(500).json({ message: err.message });
  }
};

// ❤️ Add menu item to favorites
const addMenuItemToFavorites = async (req, res) => {
  try {
    const { userId, menuItemId } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(menuItemId)
    ) {
      return res.status(400).json({ message: "Invalid userId or menuItemId" });
    }

    const userIdObj = new mongoose.Types.ObjectId(userId);
    const menuIdObj = new mongoose.Types.ObjectId(menuItemId);

    const favorite = await Favorite.findOneAndUpdate(
      { userId: userIdObj },
      { $addToSet: { menuItemIds: menuIdObj } },
      { new: true, upsert: true }
    );

    res.status(200).json({
      message: "Menu item added to favorites",
      favorites: favorite,
    });
  } catch (err) {
    console.error("❌ Error in addMenuItemToFavorites:", err);
    res.status(500).json({ message: err.message });
  }
};

// ❌ Remove menu item from favorites
const removeMenuItemFromFavorites = async (req, res) => {
  try {
    const { userId, menuItemId } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(menuItemId)
    ) {
      return res.status(400).json({ message: "Invalid userId or menuItemId" });
    }

    const userIdObj = new mongoose.Types.ObjectId(userId);
    const menuIdObj = new mongoose.Types.ObjectId(menuItemId);

    const favorite = await Favorite.findOneAndUpdate(
      { userId: userIdObj },
      { $pull: { menuItemIds: menuIdObj } },
      { new: true }
    );

    if (!favorite) {
      return res.status(404).json({ message: "Favorite list not found" });
    }

    res.status(200).json({
      message: "Menu item removed from favorites",
      favorites: favorite,
    });
  } catch (err) {
    console.error("❌ Error in removeMenuItemFromFavorites:", err);
    res.status(500).json({ message: err.message });
  }
};

// 📜 Get all favorite menu items of a user
const getUserMenuItemFavorites = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }
    const userIdObj = new mongoose.Types.ObjectId(req.params.userId);

    const favorite = await Favorite.findOne({ userId: userIdObj }).populate(
      "menuItemIds",
      "name image price description"
    );

    if (!favorite || !favorite.menuItemIds?.length) {
      return res
        .status(200)
        .json({ message: "No menu item favorites found", favorites: [] });
    }

    res.status(200).json({
      message: "Favorite menu items fetched successfully",
      favorites: favorite.menuItemIds,
    });
  } catch (err) {
    console.error("❌ Error in getUserMenuItemFavorites:", err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  addToFavorites,
  removeFromFavorites,
  getUserFavorites,
  addMenuItemToFavorites,
  removeMenuItemFromFavorites,
  getUserMenuItemFavorites,
};
