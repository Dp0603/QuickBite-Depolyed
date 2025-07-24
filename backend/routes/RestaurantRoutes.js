const express = require("express");
const {
  createRestaurant,
  getRestaurantById,
  getAllRestaurants,
  getRestaurantsByOwner,
  verifyRestaurant,
  updateRestaurant,
  deleteRestaurant,
} = require("../controllers/RestaurantController");

const router = express.Router();

// 🍽️ Create a new restaurant
router.post("/restaurants", createRestaurant);

// 📄 Get a restaurant by ID
router.get("/restaurant/public/:id", getRestaurantById);

// 📦 Get all verified & open restaurants (public)
router.get("/restaurants", getAllRestaurants);

// 🔍 Get restaurants by owner (owner dashboard)
router.get("/restaurants/owner/:ownerId", getRestaurantsByOwner);

// ✅ Verify restaurant (admin only)
router.put("/restaurants/verify/:id", verifyRestaurant);

// 🔁 Update restaurant details
router.put("/restaurants/:id", updateRestaurant);

// ❌ Delete a restaurant
router.delete("/restaurants/:id", deleteRestaurant);

module.exports = router;
