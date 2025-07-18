const Favorite = require("../models/FavoriteModel");
const Restaurant = require("../models/RestaurantModel");

// ❤️ Add restaurant to user's favorites
const addToFavorites = async (req, res) => {
  try {
    const { userId, restaurantId } = req.body;

    let favorite = await Favorite.findOne({ userId });

    if (!favorite) {
      favorite = new Favorite({
        userId,
        restaurantIds: [restaurantId],
      });
    } else {
      if (favorite.restaurantIds.includes(restaurantId)) {
        return res
          .status(400)
          .json({ message: "Restaurant already in favorites" });
      }
      favorite.restaurantIds.push(restaurantId);
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
      (id) => id.toString() !== restaurantId
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

module.exports = {
  addToFavorites,
  removeFromFavorites,
  getUserFavorites,
};
