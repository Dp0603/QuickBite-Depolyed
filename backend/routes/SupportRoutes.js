const express = require("express");
const router = express.Router();
const { submitSupportRequest } = require("..//controllers/SupportController");

// 🆘 Support Routes
router.post("/submit", submitSupportRequest);

module.exports = router;
