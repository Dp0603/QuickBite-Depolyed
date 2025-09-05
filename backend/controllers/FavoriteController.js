const mongoose = require("mongoose");
const Favorite = require("../models/FavoriteModel");
const Restaurant = require("../models/RestaurantModel");
const MenuItem = require("../models/MenuModel");

// ❤️ Add restaurant to user's favorites
const addToFavorites = async (req, res) => {
  try {
    console.log("⭐ Incoming body:", req.body);
    const { userId, restaurantId } = req.body;

    let favorite = await Favorite.findOne({ userId });

    if (!favorite) {
      favorite = new Favorite({
        userId,
        restaurantIds: [new mongoose.Types.ObjectId(restaurantId)],
      });
    } else {
      if (favorite.restaurantIds.some((id) => id.equals(restaurantId))) {
        return res
          .status(400)
          .json({ message: "Restaurant already in favorites" });
      }
      favorite.restaurantIds.push(new mongoose.Types.ObjectId(restaurantId));
    }

    await favorite.save();

    res.status(200).json({
      message: "Restaurant added to favorites",
      favorites: favorite,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ❌ Remove restaurant from user's favorites
const removeFromFavorites = async (req, res) => {
  try {
    const { userId, restaurantId } = req.body;

    const favorite = await Favorite.findOne({ userId });

    if (!favorite) {
      return res.status(404).json({ message: "Favorite list not found" });
    }

    favorite.restaurantIds = favorite.restaurantIds.filter(
      (id) => !id.equals(restaurantId)
    );

    await favorite.save();

    res.status(200).json({
      message: "Restaurant removed from favorites",
      favorites: favorite,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📜 Get all favorite restaurants of a user
const getUserFavorites = async (req, res) => {
  try {
    const userId = req.params.userId;

    const favorite = await Favorite.findOne({ userId }).populate(
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
    res.status(500).json({ message: err.message });
  }
};

// ❤️ Add menu item to favorites
const addMenuItemToFavorites = async (req, res) => {
  try {
    const { userId, menuItemId } = req.body;

    let favorite = await Favorite.findOne({ userId });

    if (!favorite) {
      favorite = new Favorite({
        userId,
        menuItemIds: [new mongoose.Types.ObjectId(menuItemId)],
      });
    } else {
      if (favorite.menuItemIds?.some((id) => id.equals(menuItemId))) {
        return res
          .status(400)
          .json({ message: "Menu item already in favorites" });
      }
      favorite.menuItemIds = favorite.menuItemIds || [];
      favorite.menuItemIds.push(new mongoose.Types.ObjectId(menuItemId));
    }

    await favorite.save();

    res.status(200).json({
      message: "Menu item added to favorites",
      favorites: favorite,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ❌ Remove menu item from favorites
const removeMenuItemFromFavorites = async (req, res) => {
  try {
    const { userId, menuItemId } = req.body;

    const favorite = await Favorite.findOne({ userId });

    if (!favorite) {
      return res.status(404).json({ message: "Favorite list not found" });
    }

    favorite.menuItemIds = (favorite.menuItemIds || []).filter(
      (id) => !id.equals(menuItemId)
    );

    await favorite.save();

    res.status(200).json({
      message: "Menu item removed from favorites",
      favorites: favorite,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📜 Get all favorite menu items of a user
const getUserMenuItemFavorites = async (req, res) => {
  try {
    const userId = req.params.userId;

    const favorite = await Favorite.findOne({ userId }).populate(
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
