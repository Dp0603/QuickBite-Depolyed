const express = require("express");
const {
  createProfile,
  updateProfile,
  getMyProfile,
  getAllRestaurants,
  getRestaurantById,
  changeStatus,
  deleteRestaurant,
  getAvailability,
  updateAvailability,
  getRestaurantSettings,
  updateOrderSettings,
  updateDeliverySettings,
  updatePayoutSettings,
  updateNotificationSettings,
  updateSecuritySettings,
} = require("../controllers/RestaurantController");

// ✅ Import protect & authorize correctly
const { protect, authorize } = require("../middlewares/authMiddleware");

const router = express.Router();

// 🟢 Restaurant Routes (Owner actions)
router.post(
  "/restaurants/create",
  protect,
  authorize("restaurant"),
  createProfile
);
router.put(
  "/restaurants/update",
  protect,
  authorize("restaurant"),
  updateProfile
);
router.get("/restaurants/me", protect, authorize("restaurant"), getMyProfile);

// 🔵 Customer Routes (no auth)
router.get("/restaurants", getAllRestaurants);
router.get("/restaurants/:id", getRestaurantById);

// 🟣 Admin Routes
router.patch(
  "/restaurants/:id/status",
  protect,
  authorize("admin"),
  changeStatus
);

// 🟢 Restaurant/Admin Common
router.delete(
  "/restaurants/:id",
  protect,
  authorize("restaurant", "admin"),
  deleteRestaurant
);

// 🟢 Restaurant Availability Routes
router.get(
  "/restaurants/availability/me",
  protect,
  authorize("restaurant"),
  getAvailability
);
router.put(
  "/restaurants/availability",
  protect,
  authorize("restaurant"),
  updateAvailability
);

router.get(
  "/restaurants/settings/me",
  protect,
  authorize("restaurant"),
  getRestaurantSettings
);
// 🆕 Restaurant Settings Routes
router.put(
  "/restaurants/settings/order",
  protect,
  authorize("restaurant"),
  updateOrderSettings
);
router.put(
  "/restaurants/settings/delivery",
  protect,
  authorize("restaurant"),
  updateDeliverySettings
);
router.put(
  "/restaurants/settings/finance",
  protect,
  authorize("restaurant"),
  updatePayoutSettings
);
router.put(
  "/restaurants/settings/notifications",
  protect,
  authorize("restaurant"),
  updateNotificationSettings
);
router.put(
  "/restaurants/settings/security",
  protect,
  authorize("restaurant"),
  updateSecuritySettings
);

module.exports = router;