const express = require("express");
const router = express.Router();

const {
  uploadRestaurantLogo,
  uploadRestaurantBanner,
} = require("../controllers/UploadController");

// 🖼️ Upload restaurant logo
router.post("/logo", uploadRestaurantLogo);

// 🖼️ Upload restaurant banner
router.post("/banner", uploadRestaurantBanner);

module.exports = router;
