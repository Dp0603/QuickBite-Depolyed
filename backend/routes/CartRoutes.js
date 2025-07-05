const express = require("express");
const router = express.Router();
const {
  addToCart,
  getCart,
  updateItemQuantity,
  removeItem,
  clearCart,
} = require("../controllers/CartController");

// ➕ Add item to cart
router.post("/add", addToCart);

// 🛒 Get user's cart
router.get("/:userId", getCart);

// ✏️ Update item quantity
router.put("/update", updateItemQuantity);

// ❌ Remove specific item from cart
router.delete("/remove", removeItem);

// 🧹 Clear cart
router.delete("/clear/:userId", clearCart);

module.exports = router;
