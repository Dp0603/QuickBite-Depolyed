const express = require("express");
const {
  addOrUpdateCartItem,
  getUserCart,
  removeCartItem,
  clearCart,
} = require("../controllers/CartController");

const router = express.Router();

/**
 * 🛒 Cart Routes (per user + restaurant)
 */

// ➕ Add or update an item
// Body: { quantity, note }
// URL:  /api/cart/:userId/:restaurantId/item/:menuItemId
router.post("/:userId/:restaurantId/item/:menuItemId", addOrUpdateCartItem);

// 🛒 Get (or auto-create) cart for a user + restaurant
// URL:  /api/cart/:userId/:restaurantId
router.get("/:userId/:restaurantId", getUserCart);

// ❌ Remove an item from cart
// URL:  /api/cart/:userId/:restaurantId/item/:menuItemId
router.delete("/:userId/:restaurantId/item/:menuItemId", removeCartItem);

// 🧹 Clear entire cart for a restaurant
// URL:  /api/cart/:userId/:restaurantId
router.delete("/:userId/:restaurantId", clearCart);

module.exports = router;
