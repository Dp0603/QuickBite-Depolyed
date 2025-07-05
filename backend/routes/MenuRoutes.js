const express = require("express");
const router = express.Router();
const {
  createMenuItem,
  getRestaurantMenu,
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem,
} = require("../controllers/MenuController");

// 📌 Create menu item
router.post("/", createMenuItem);

// 📌 Get all menu items for a restaurant
router.get("/restaurant/:restaurantId", getRestaurantMenu);

// 📌 Get single item
router.get("/:id", getMenuItemById);

// 📌 Update item
router.put("/:id", updateMenuItem);

// 📌 Delete item
router.delete("/:id", deleteMenuItem);

module.exports = router;
