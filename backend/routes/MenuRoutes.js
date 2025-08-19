const express = require("express");
const {
  createMenuItem,
  getMenuByRestaurant, // customer-facing (only available items)
  getFullMenuByRestaurant, // owner-facing (all items with schedules)
  updateMenuItemSchedule,
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem,
  toggleAvailability,
} = require("../controllers/MenuController");

const { protect, authorize } = require("../middlewares/authMiddleware");

const router = express.Router();

//
// 🟢 Restaurant Owner Actions
//
router.post("/menu", protect, authorize("restaurant"), createMenuItem);
router.put("/menu/:id", protect, authorize("restaurant"), updateMenuItem);
router.delete("/menu/:id", protect, authorize("restaurant"), deleteMenuItem);
router.patch(
  "/menu/toggle/:id",
  protect,
  authorize("restaurant"),
  toggleAvailability
);

// Full menu for the owner (ID removed, use logged-in user's restaurant)
router.get(
  "/restaurant/menu/full",
  protect,
  authorize("restaurant"),
  getFullMenuByRestaurant
);

// Update schedule for a menu item (only owner)
router.put(
  "/menu/schedule/:id",
  protect,
  authorize("restaurant"),
  updateMenuItemSchedule
);

//
// 🔵 Customer (public) Routes
//
router.get("/menu/:id", getMenuItemById);
router.get("/restaurant/:restaurantId/menu", getMenuByRestaurant);

module.exports = router;
