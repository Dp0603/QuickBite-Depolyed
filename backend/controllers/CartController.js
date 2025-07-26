const Cart = require("../models/CartModel");

// ➕ Add or update cart item
const addOrUpdateCartItem = async (req, res) => {
  try {
    const { userId, restaurantId, menuItemId, quantity, note } = req.body;

    if (!userId || !restaurantId || !menuItemId || !quantity) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let cart = await Cart.findOne({ userId, restaurantId });

    if (!cart) {
      cart = new Cart({
        userId,
        restaurantId,
        items: [{ menuItem: menuItemId, quantity, note }],
      });
    } else {
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

    const populatedCart = await Cart.findById(cart._id)
      .populate("items.menuItem")
      .populate("restaurantId", "name logo");

    res.status(200).json({
      message: "Cart updated successfully",
      cart: populatedCart,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating cart", error: err.message });
  }
};

// 🛒 Get cart for a user
const getUserCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId })
      .populate("items.menuItem")
      .populate("restaurantId", "name logo");

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    res.status(200).json({
      message: "Cart fetched successfully",
      cart,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching cart", error: err.message });
  }
};

// ❌ Remove a specific item
const removeCartItem = async (req, res) => {
  try {
    const { userId, menuItemId } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.menuItem.toString() !== menuItemId
    );

    await cart.save();

    const updatedCart = await Cart.findById(cart._id)
      .populate("items.menuItem")
      .populate("restaurantId", "name logo");

    res.status(200).json({
      message: "Item removed from cart",
      cart: updatedCart,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error removing item", error: err.message });
  }
};

// 🧹 Clear entire cart
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = [];
    await cart.save();

    const clearedCart = await Cart.findById(cart._id)
      .populate("items.menuItem")
      .populate("restaurantId", "name logo");

    res.status(200).json({
      message: "Cart cleared successfully",
      cart: clearedCart,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error clearing cart", error: err.message });
  }
};

module.exports = {
  addOrUpdateCartItem,
  getUserCart,
  removeCartItem,
  clearCart,
};
