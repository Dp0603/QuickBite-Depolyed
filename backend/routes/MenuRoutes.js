const express = require("express");
const {
  createMenuItem,
  getMenuByRestaurant,
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem,
  toggleAvailability,
} = require("../controllers/MenuController");

const router = express.Router();

// 🍽️ Create a new menu item
router.post("/menu", createMenuItem);

// 📋 Get all menu items for a restaurant
router.get("/menu/restaurant/:restaurantId", getMenuByRestaurant);

// 📄 Get a specific menu item by ID
router.get("/menu/:id", getMenuItemById);

// 🔁 Update a menu item
router.put("/menu/:id", updateMenuItem);

// ❌ Delete a menu item
router.delete("/menu/:id", deleteMenuItem);

// 🚦 Toggle availability
router.patch("/menu/toggle/:id", toggleAvailability);

module.exports = router;
