const mongoose = require("mongoose");
const Cart = require("../models/CartModel");
const Order = require("../models/OrderModel");
const Menu = require("../models/MenuModel");

/**
 * Helper to validate ObjectIds
 */
const validateIds = (ids) => {
  for (const [key, value] of Object.entries(ids)) {
    if (value && !mongoose.Types.ObjectId.isValid(value)) {
      return `Invalid ${key}`;
    }
  }
  return null;
};

/**
 * Add or update cart item
 * POST /api/cart/:userId/:restaurantId/item/:menuItemId
 * Body: { quantity, note, clearOldCart: boolean }
 */
const addOrUpdateCartItem = async (req, res) => {
  try {
    const { userId, restaurantId, menuItemId } = req.params;
    const { quantity, note, clearOldCart } = req.body;

    const invalid = validateIds({ userId, restaurantId, menuItemId });
    if (invalid) return res.status(400).json({ message: invalid });

    const userObjId = new mongoose.Types.ObjectId(userId);
    const restaurantObjId = new mongoose.Types.ObjectId(restaurantId);
    const menuItemObjId = new mongoose.Types.ObjectId(menuItemId);

    if (!quantity || quantity < 1)
      return res.status(400).json({ message: "Quantity must be at least 1" });

    // Check if user has items in another restaurant
    const otherCartWithItems = await Cart.findOne({
      userId: userObjId,
      restaurantId: { $ne: restaurantObjId },
      "items.0": { $exists: true },
    });

    if (otherCartWithItems && !clearOldCart) {
      return res.status(400).json({
        message:
          "You already have items in your cart from another restaurant. Please clear cart first.",
      });
    }

    // Clear other restaurant carts if requested
    if (clearOldCart) {
      await Cart.deleteMany({
        userId: userObjId,
        restaurantId: { $ne: restaurantObjId },
      });
    }

    // Find cart for current restaurant
    let cart = await Cart.findOne({
      userId: userObjId,
      restaurantId: restaurantObjId,
    });

    if (!cart) {
      // Lazy creation: only create cart when first item is added
      cart = new Cart({
        userId: userObjId,
        restaurantId: restaurantObjId,
        items: [{ menuItem: menuItemObjId, quantity, note }],
      });
    } else {
      // Update existing items or add new one
      const existingItem = cart.items.find(
        (item) => item.menuItem.toString() === menuItemId
      );
      if (existingItem) {
        existingItem.quantity = quantity;
        existingItem.note = note || existingItem.note;
      } else {
        cart.items.push({ menuItem: menuItemObjId, quantity, note });
      }
    }

    await cart.save();

    const populatedCart = await Cart.findById(cart._id)
      .populate("items.menuItem")
      .populate("restaurantId", "name logo");

    res
      .status(200)
      .json({ message: "Cart updated successfully", cart: populatedCart });
  } catch (err) {
    console.error("❌ addOrUpdateCartItem error:", err);
    res
      .status(500)
      .json({ message: "Error updating cart", error: err.message });
  }
};

/**
 * Get user cart for a restaurant (lazy fetch, no creation)
 * GET /api/cart/:userId/:restaurantId
 */
const getUserCart = async (req, res) => {
  try {
    const { userId, restaurantId } = req.params;
    const invalid = validateIds({ userId, restaurantId });
    if (invalid) return res.status(400).json({ message: invalid });

    const userObjId = new mongoose.Types.ObjectId(userId);
    const restaurantObjId = new mongoose.Types.ObjectId(restaurantId);

    const cart = await Cart.findOne({
      userId: userObjId,
      restaurantId: restaurantObjId,
    })
      .populate("items.menuItem")
      .populate("restaurantId", "name logo");

    if (!cart) {
      // Do not create empty cart; return null
      return res.status(200).json({ message: "No cart yet", cart: null });
    }

    res.status(200).json({ message: "Cart fetched successfully", cart });
  } catch (err) {
    console.error("❌ getUserCart error:", err);
    res
      .status(500)
      .json({ message: "Error fetching cart", error: err.message });
  }
};

/**
 * Remove a specific item
 * DELETE /api/cart/:userId/:restaurantId/item/:menuItemId
 */
const removeCartItem = async (req, res) => {
  try {
    const { userId, restaurantId, menuItemId } = req.params;
    const invalid = validateIds({ userId, restaurantId, menuItemId });
    if (invalid) return res.status(400).json({ message: invalid });

    const userObjId = new mongoose.Types.ObjectId(userId);
    const restaurantObjId = new mongoose.Types.ObjectId(restaurantId);
    const menuItemObjId = new mongoose.Types.ObjectId(menuItemId);

    const cart = await Cart.findOne({
      userId: userObjId,
      restaurantId: restaurantObjId,
    });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.menuItem.toString() !== menuItemObjId.toString()
    );

    if (cart.items.length === 0) {
      // ✅ If no items left, delete the whole cart
      await Cart.deleteOne({ _id: cart._id });
      return res.status(200).json({ message: "Cart deleted", cart: null });
    }

    await cart.save();

    const updatedCart = await Cart.findById(cart._id)
      .populate("items.menuItem")
      .populate("restaurantId", "name logo");

    res.status(200).json({ message: "Item removed", cart: updatedCart });
  } catch (err) {
    console.error("❌ removeCartItem error:", err);
    res
      .status(500)
      .json({ message: "Error removing item", error: err.message });
  }
};

/**
 * Clear entire cart
 * DELETE /api/cart/:userId/:restaurantId
 */
const clearCart = async (req, res) => {
  try {
    const { userId, restaurantId } = req.params;
    const invalid = validateIds({ userId, restaurantId });
    if (invalid) return res.status(400).json({ message: invalid });

    const userObjId = new mongoose.Types.ObjectId(userId);
    const restaurantObjId = new mongoose.Types.ObjectId(restaurantId);

    const cart = await Cart.findOne({
      userId: userObjId,
      restaurantId: restaurantObjId,
    });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    // ✅ Instead of saving empty items, delete the cart
    await Cart.deleteOne({ _id: cart._id });

    res.status(200).json({ message: "Cart deleted", cart: null });
  } catch (err) {
    console.error("❌ clearCart error:", err);
    res
      .status(500)
      .json({ message: "Error clearing cart", error: err.message });
  }
};

/**
 * Optional: Get active cart regardless of restaurant
 * GET /api/cart/:userId
 */
const getActiveCart = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const userObjId = new mongoose.Types.ObjectId(userId);

    const cart = await Cart.findOne({
      userId: userObjId,
      "items.0": { $exists: true },
    })
      .populate("items.menuItem")
      .populate("restaurantId", "name logo")
      .sort({ updatedAt: -1 });

    if (!cart) {
      return res.status(200).json({ message: "No active cart", cart: null });
    }

    res.status(200).json({ message: "Active cart fetched", cart });
  } catch (err) {
    console.error("❌ getActiveCart error:", err);
    res
      .status(500)
      .json({ message: "Error fetching cart", error: err.message });
  }
};

/**
 * 🔁 Reorder from past order
 * POST /api/cart/reorder/:userId/:orderId
 */
const reorderFromOrder = async (req, res) => {
  try {
    const { userId, orderId } = req.params;

    const invalid = validateIds({ userId, orderId });
    if (invalid) return res.status(400).json({ message: invalid });

    const userObjId = new mongoose.Types.ObjectId(userId);

    // 1️⃣ Get the old order
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // 2️⃣ Check items availability from Menu
    const validItems = [];
    for (const item of order.items) {
      const menuItem = await Menu.findById(item.menuItemId); // ✅ FIXED
      if (menuItem && menuItem.isAvailable) {
        validItems.push({
          menuItem: menuItem._id, // ✅ Cart expects "menuItem"
          quantity: item.quantity,
          note: item.note || "",
        });
      }
    }

    if (validItems.length === 0) {
      return res.status(400).json({ message: "No items available to reorder" });
    }

    // 3️⃣ Clear any existing cart for this restaurant
    await Cart.deleteMany({ userId: userObjId });

    // 4️⃣ Create a new cart with valid items
    const newCart = new Cart({
      userId: userObjId,
      restaurantId: order.restaurantId,
      items: validItems,
    });
    await newCart.save();

    const populatedCart = await Cart.findById(newCart._id)
      .populate("items.menuItem")
      .populate("restaurantId", "name logo");

    res
      .status(200)
      .json({ message: "Reorder successful", cart: populatedCart });
  } catch (err) {
    console.error("❌ reorderFromOrder error:", err);
    res.status(500).json({ message: "Error reordering", error: err.message });
  }
};
module.exports = {
  addOrUpdateCartItem,
  getUserCart,
  removeCartItem,
  clearCart,
  getActiveCart,
  reorderFromOrder,
};
