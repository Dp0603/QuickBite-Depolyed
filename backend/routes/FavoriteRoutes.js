const express = require("express");
const {
  addToFavorites,
  removeFromFavorites,
  getUserFavorites,
} = require("../controllers/FavoriteController");

const router = express.Router();

// ❤️ Add restaurant to favorites
router.post("/favorites", addToFavorites);

// ❌ Remove restaurant from favorites
router.delete("/favorites", removeFromFavorites);

// 📜 Get all favorite restaurants for a user
router.get("/favorites/:userId", getUserFavorites);

module.exports = router;
