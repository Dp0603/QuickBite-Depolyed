const express = require("express");
const router = express.Router();
const {
  addAddress,
  getAddressesByEntity,
  getAddressById,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} = require("../controllers/AddressController");

// ➕ Add new address
router.post("/", addAddress);

// 📦 Get all addresses for a specific entity (user or restaurant)
router.get("/entity/:entityType/:entityId", getAddressesByEntity);

// 📄 Get address by ID
router.get("/:id", getAddressById);

// ✏️ Update address by ID
router.put("/:id", updateAddress);

// 🗑️ Delete address by ID
router.delete("/:id", deleteAddress);

// 🌟 Set default address
router.patch("/default/:id", setDefaultAddress);

module.exports = router;
