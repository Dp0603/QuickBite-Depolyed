const express = require("express");
const router = express.Router();
const {
  updateOrderSettings,
  changePassword,
} = require("../controllers/RestaurantSettingsController");

const { protect, authorize } = require("../middlewares/authMiddleware");

router.use(protect);
router.use(authorize("restaurant"));

// ⚙️ Update order-related settings
router.put("/order-settings", updateOrderSettings);

// 🔐 Change password
router.put("/change-password", changePassword);

module.exports = router;
