// routes/FavoriteRoutes.js
const express = require("express");
const router = express.Router();
const {
  addFavorite,
  removeFavorite,
  getMyFavorites,
} = require("../controllers/FavoriteController");
const { protect } = require("../middlewares/authMiddleware");

// 🔐 Protect all routes
router.use(protect);

// 📦 Get all
router.get("/", getMyFavorites);

// ➕ Add
router.post("/:restaurantId", addFavorite);

// ❌ Remove
router.delete("/:restaurantId", removeFavorite);

module.exports = router;
