const express = require("express");
const router = express.Router();
const {
  createMenuItem,
  getRestaurantMenu,
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem,
} = require("../controllers/MenuController");
const { getMenuByRestaurantId } = require("../controllers/MenuController");

const { protect, authorize } = require("../middlewares/authMiddleware");

// 🛡️ All routes below are protected for restaurant role
router.use(protect);
router.use(authorize("restaurant"));

// ➕ Create new menu item (uses req.user.id internally)
router.post("/", createMenuItem);

// 📋 Get all menu items for the current logged-in restaurant
router.get("/", getRestaurantMenu);

// 🔍 Get single menu item by ID
router.get("/:id", getMenuItemById);

// ✏️ Update menu item
router.put("/:id", updateMenuItem);

// ❌ Delete menu item
router.delete("/:id", deleteMenuItem);
router.get("/restaurant/:restaurantId", getMenuByRestaurantId);

module.exports = router;
