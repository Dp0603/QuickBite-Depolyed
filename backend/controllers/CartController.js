const mongoose = require("mongoose");
const Cart = require("../models/CartModel");
const Order = require("../models/OrderModel");
const Menu = require("../models/MenuModel");
const PremiumSubscription = require("../models/PremiumSubscriptionModel");

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

const calculatePremiumBenefits = (cartItems, premiumPlan) => {
  if (!premiumPlan || !premiumPlan.isActive)
    return {
      freeDelivery: 0,
      extraDiscount: 0,
      cashback: 0,
      totalSavings: 0,
    };

  let subtotal = 0;
  cartItems.forEach((item) => {
    const price = Number(item.menuItem?.price) || 0;
    const qty = Number(item.quantity) || 0;
    subtotal += price * qty;
  });

  const normalDeliveryFee = subtotal >= 500 ? 0 : 40;

  const freeDelivery = premiumPlan.perks?.freeDelivery ? normalDeliveryFee : 0;

  const extraDiscountPercent = Number(premiumPlan.perks?.extraDiscount) || 0;
  const cashbackPercent = Number(premiumPlan.perks?.cashback) || 0;

  const extraDiscount = (subtotal * extraDiscountPercent) / 100;
  const cashback = (subtotal * cashbackPercent) / 100;

  const totalSavings = freeDelivery + extraDiscount + cashback;

  // ✅ Always return valid numbers
  return {
    freeDelivery: Number.isFinite(freeDelivery) ? freeDelivery : 0,
    extraDiscount: Number.isFinite(extraDiscount) ? extraDiscount : 0,
    cashback: Number.isFinite(cashback) ? cashback : 0,
    totalSavings: Number.isFinite(totalSavings) ? totalSavings : 0,
  };
};

/**
 * Fetch active premium subscription for user
 */
const getActivePremiumPlan = async (userId) => {
  const plan = await PremiumSubscription.findOne({
    subscriberId: userId,
    isActive: true,
    startDate: { $lte: new Date() },
    endDate: { $gte: new Date() },
  });
  return plan;
};

/**
 * Add or update cart item
 */
const addOrUpdateCartItem = async (req, res) => {
  try {
    const { userId, restaurantId, menuItemId } = req.params;
    const { quantity, note, clearOldCart, applyPremium } = req.body;

    const invalid = validateIds({ userId, restaurantId, menuItemId });
    if (invalid) return res.status(400).json({ message: invalid });

    if (!quantity || quantity < 1)
      return res.status(400).json({ message: "Quantity must be at least 1" });

    const userObjId = new mongoose.Types.ObjectId(userId);
    const restaurantObjId = new mongoose.Types.ObjectId(restaurantId);
    const menuItemObjId = new mongoose.Types.ObjectId(menuItemId);

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
      cart = new Cart({
        userId: userObjId,
        restaurantId: restaurantObjId,
        items: [{ menuItem: menuItemObjId, quantity, note }],
      });
    } else {
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

    // Apply Premium if requested
    if (applyPremium) {
      const premiumPlan = await getActivePremiumPlan(userObjId);
      await cart.populate("items.menuItem");
      cart.premiumSummary = calculatePremiumBenefits(cart.items, premiumPlan);
    } else {
      cart.premiumSummary = null;
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
 * Get user cart for a restaurant
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

    if (!cart)
      return res.status(200).json({ message: "No cart yet", cart: null });

    const premiumPlan = await getActivePremiumPlan(userObjId);
    cart.premiumSummary = calculatePremiumBenefits(cart.items, premiumPlan);

    res.status(200).json({ message: "Cart fetched successfully", cart });
  } catch (err) {
    console.error("❌ getUserCart error:", err);
    res
      .status(500)
      .json({ message: "Error fetching cart", error: err.message });
  }
};

/**
 * Remove cart item
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
      await Cart.deleteOne({ _id: cart._id });
      return res.status(200).json({ message: "Cart deleted", cart: null });
    }

    const premiumPlan = await getActivePremiumPlan(userObjId);
    await cart.populate("items.menuItem");
    cart.premiumSummary = calculatePremiumBenefits(cart.items, premiumPlan);

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
 * Clear cart
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
 * Get active cart
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

    if (!cart)
      return res.status(200).json({ message: "No active cart", cart: null });

    const premiumPlan = await getActivePremiumPlan(userObjId);
    cart.premiumSummary = calculatePremiumBenefits(cart.items, premiumPlan);

    res.status(200).json({ message: "Active cart fetched", cart });
  } catch (err) {
    console.error("❌ getActiveCart error:", err);
    res
      .status(500)
      .json({ message: "Error fetching cart", error: err.message });
  }
};

/**
 * Reorder from past order
 */
const reorderFromOrder = async (req, res) => {
  try {
    const { userId, orderId } = req.params;
    const invalid = validateIds({ userId, orderId });
    if (invalid) return res.status(400).json({ message: invalid });

    const userObjId = new mongoose.Types.ObjectId(userId);

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const validItems = [];
    for (const item of order.items) {
      const menuItem = await Menu.findById(item.menuItemId);
      if (menuItem && menuItem.isAvailable) {
        validItems.push({
          menuItem: menuItem._id,
          quantity: item.quantity,
          note: item.note || "",
        });
      }
    }

    if (validItems.length === 0)
      return res.status(400).json({ message: "No items available to reorder" });

    await Cart.deleteMany({ userId: userObjId });

    const newCart = new Cart({
      userId: userObjId,
      restaurantId: order.restaurantId,
      items: validItems,
    });

    const premiumPlan = await getActivePremiumPlan(userObjId);
    await newCart.populate("items.menuItem");
    newCart.premiumSummary = calculatePremiumBenefits(
      newCart.items,
      premiumPlan
    );

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
