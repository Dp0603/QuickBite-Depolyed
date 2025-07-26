const express = require("express");
const {
  addOrUpdateCartItem,
  getUserCart,
  removeCartItem,
  clearCart,
} = require("../controllers/CartController");

const router = express.Router();

// ➕ Add or update an item
router.post("/", addOrUpdateCartItem);

// 🛒 Get user cart
router.get("/:userId", getUserCart);

// ❌ Remove an item from cart
router.delete("/item", removeCartItem);

// 🧹 Clear entire cart
router.delete("/:userId", clearCart);

module.exports = router;
