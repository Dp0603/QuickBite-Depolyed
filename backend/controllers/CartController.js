const CartModel = require("../models/CartModel");
const FoodModel = require("../models/FoodModel");

// ➕ Add item to cart
const addToCart = async (req, res) => {
  try {
    const userId = req.body.userId;
    const { foodId, quantity } = req.body;

    if (!userId || !foodId || !quantity) {
      return res
        .status(400)
        .json({ message: "User ID, food ID and quantity are required." });
    }

    const foodExists = await FoodModel.findById(foodId);
    if (!foodExists) {
      return res.status(404).json({ message: "Food item not found" });
    }

    let cart = await CartModel.findOne({ userId });

    if (!cart) {
      cart = new CartModel({ userId, items: [{ foodId, quantity }] });
    } else {
      const index = cart.items.findIndex((item) =>
        item.foodId.equals(foodId)
      );
      if (index > -1) {
        cart.items[index].quantity += quantity;
      } else {
        cart.items.push({ foodId, quantity });
      }
    }

    const updatedCart = await cart.save();
    res.status(200).json({
      message: "Item added to cart successfully",
      data: updatedCart,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🛒 Get cart for a user
const getCart = async (req, res) => {
  try {
    const { userId } = req.params;

    const cart = await CartModel.findOne({ userId }).populate("items.foodId");
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    res.status(200).json({ message: "Cart fetched", data: cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✏️ Update item quantity
const updateItemQuantity = async (req, res) => {
  try {
    const { userId, foodId, quantity } = req.body;

    const cart = await CartModel.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const index = cart.items.findIndex((item) =>
      item.foodId.equals(foodId)
    );

    if (index === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    if (quantity <= 0) {
      cart.items.splice(index, 1);
    } else {
      cart.items[index].quantity = quantity;
    }

    const updatedCart = await cart.save();
    res.status(200).json({ message: "Cart updated", data: updatedCart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ❌ Remove single item from cart
const removeItem = async (req, res) => {
  try {
    const { userId, foodId } = req.body;

    const cart = await CartModel.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => !item.foodId.equals(foodId)
    );

    const updatedCart = await cart.save();
    res.status(200).json({ message: "Item removed", data: updatedCart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🧹 Clear entire cart
const clearCart = async (req, res) => {
  try {
    const { userId } = req.params;

    const cart = await CartModel.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = [];
    await cart.save();

    res.status(200).json({ message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  addToCart,
  getCart,
  updateItemQuantity,
  removeItem,
  clearCart,
};
