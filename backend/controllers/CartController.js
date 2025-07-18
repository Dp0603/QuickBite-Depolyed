const Cart = require("../models/CartModel");
const Menu = require("../models/MenuModel");

// ➕ Add or update item in cart
const addOrUpdateCartItem = async (req, res) => {
  try {
    const { userId, restaurantId, menuItemId, quantity, note } = req.body;

    // Check if cart exists for the user & restaurant
    let cart = await Cart.findOne({ userId, restaurantId });

    if (!cart) {
      // Create new cart if none exists
      cart = new Cart({
        userId,
        restaurantId,
        items: [{ menuItem: menuItemId, quantity, note }],
      });
    } else {
      // Check if item already exists in cart
      const existingItem = cart.items.find(
        (item) => item.menuItem.toString() === menuItemId
      );

      if (existingItem) {
        existingItem.quantity = quantity;
        existingItem.note = note || existingItem.note;
      } else {
        cart.items.push({ menuItem: menuItemId, quantity, note });
      }
    }

    await cart.save();

    res.status(200).json({
      message: "Cart updated successfully",
      cart,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🛒 Get cart for a user
const getUserCart = async (req, res) => {
  try {
    const userId = req.params.userId;

    const cart = await Cart.findOne({ userId })
      .populate("items.menuItem")
      .populate("restaurantId", "name logo");

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    res.status(200).json({
      message: "Cart fetched successfully",
      cart,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ❌ Remove item from cart
const removeCartItem = async (req, res) => {
  try {
    const { userId, menuItemId } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.menuItem.toString() !== menuItemId
    );

    await cart.save();

    res.status(200).json({
      message: "Item removed from cart",
      cart,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🧹 Clear cart for a user
const clearCart = async (req, res) => {
  try {
    const userId = req.params.userId;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = [];
    await cart.save();

    res.status(200).json({
      message: "Cart cleared successfully",
      cart,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  addOrUpdateCartItem,
  getUserCart,
  removeCartItem,
  clearCart,
};
