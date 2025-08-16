const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const {
  createProfile,
  updateProfile,
  getMyProfile,
  changeStatus,
} = require("../controllers/RestaurantStep2Controller");

// 👤 Restaurant owner routes
router.post("/create", protect, createProfile);
router.put("/update", protect, updateProfile);
router.get("/me", protect, getMyProfile);

// 👑 Admin routes
router.patch("/:id/status", protect, changeStatus);

module.exports = router;
