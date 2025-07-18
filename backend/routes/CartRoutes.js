const express = require("express");
const {
  addOrUpdateCartItem,
  getUserCart,
  removeCartItem,
  clearCart,
} = require("../controllers/CartController");

const router = express.Router();

// ➕ Add or update an item in the cart
router.post("/cart", addOrUpdateCartItem);

// 🛒 Get a user's cart
router.get("/cart/:userId", getUserCart);

// ❌ Remove an item from the cart
router.delete("/cart/item", removeCartItem);

// 🧹 Clear a user's entire cart
router.delete("/cart/:userId", clearCart);

module.exports = router;
