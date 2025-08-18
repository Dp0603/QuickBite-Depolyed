const express = require("express");
const {
  createMenuItem,
  getMenuByRestaurant,
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem,
  toggleAvailability,
} = require("../controllers/MenuController");

const { protect, authorize } = require("../middlewares/authMiddleware");

const router = express.Router();

// 🟢 Restaurant Owner Actions
router.post("/menu", protect, authorize("restaurant"), createMenuItem);
router.put("/menu/:id", protect, authorize("restaurant"), updateMenuItem);
router.delete("/menu/:id", protect, authorize("restaurant"), deleteMenuItem);
router.patch(
  "/menu/toggle/:id",
  protect,
  authorize("restaurant"),
  toggleAvailability
);

// 🔵 Customer (public) Routes
router.get("/menu/:id", getMenuItemById);
router.get("/restaurant/:restaurantId/menu", getMenuByRestaurant);

module.exports = router;
