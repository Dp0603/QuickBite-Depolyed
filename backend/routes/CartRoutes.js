const express = require("express");
const {
  addOrUpdateCartItem,
  getUserCart,
  removeCartItem,
  clearCart,
  getActiveCart,
  reorderFromOrder,
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

// 🟢 Get active cart for a user (any restaurant, latest non-empty)
// URL:  /api/cart/:userId
router.get("/:userId", getActiveCart);

// 🔁 Reorder from a past order
// URL: /api/cart/reorder/:userId/:orderId
router.post("/reorder/:userId/:orderId", reorderFromOrder);

module.exports = router;
