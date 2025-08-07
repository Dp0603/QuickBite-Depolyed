const express = require("express");
const {
  addToFavorites,
  removeFromFavorites,
  getUserFavorites,
  addMenuItemToFavorites,
  removeMenuItemFromFavorites,
  getUserMenuItemFavorites,
} = require("../controllers/FavoriteController");

const router = express.Router();

// ❤️ Add restaurant to favorites
router.post("/favorites", addToFavorites);

// ❌ Remove restaurant from favorites
router.delete("/favorites", removeFromFavorites);

// 📜 Get all favorite restaurants for a user
router.get("/favorites/:userId", getUserFavorites);

// ❤️ Add menu item to favorites
router.post("/favorites/menu", addMenuItemToFavorites);

// ❌ Remove menu item from favorites
router.delete("/favorites/menu", removeMenuItemFromFavorites);

// 📜 Get all favorite menu items for a user
router.get("/favorites/menu/:userId", getUserMenuItemFavorites);

module.exports = router;
