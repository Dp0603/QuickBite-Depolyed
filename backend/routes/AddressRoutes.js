const express = require("express");
const router = express.Router();
const {
  addAddress,
  getMyAddresses,
  deleteAddress,
} = require("../controllers/AddressController");
const { protect } = require("../middlewares/authMiddleware");

router.post("/customer/address", protect, addAddress);
router.get("/customer/addresses", protect, getMyAddresses);
router.delete("/customer/address/:id", protect, deleteAddress);

module.exports = router;
