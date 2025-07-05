const express = require("express");
const router = express.Router();
const {
  createOrUpdateRating,
  getRatingsByFood,
  getRatingsByUser,
} = require("../controllers/RatingController");
const verifyToken = require("../middleware/verifyToken"); // Auth middleware

// 🔒 POST or UPDATE Rating (Customer must be logged in)
router.post("/", verifyToken, createOrUpdateRating);

// 📥 GET all ratings for a specific food item (Public)
router.get("/food/:foodId", getRatingsByFood);

// 👤 GET all ratings by the logged-in user (Private)
router.get("/user", verifyToken, getRatingsByUser);

module.exports = router;
