const mongoose = require("mongoose");
const Menu = require("../models/MenuModel");
const Restaurant = require("../models/RestaurantModel");

// 🍽️ Create a new menu item (only restaurant owner)
const createMenuItem = async (req, res) => {
  try {
    const { restaurantId, ...data } = req.body;

    console.log("📡 Creating menu item for restaurantId:", restaurantId);

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    if (restaurant.owner.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Forbidden: Not your restaurant" });
    }

    const menuItem = await Menu.create({
      restaurantId: new mongoose.Types.ObjectId(restaurantId),
      ...data,
    });

    console.log("✅ Dish saved:", menuItem);

    res.status(201).json({
      message: "Menu item created successfully",
      menuItem,
    });
  } catch (err) {
    console.error("❌ Error creating menu item:", err);
    res.status(500).json({ message: err.message });
  }
};

// 📋 Get all menu items for a restaurant (public)
const getMenuByRestaurant = async (req, res) => {
  try {
    console.log("📡 Fetching menu for restaurantId:", req.params.restaurantId);

    const restaurantObjectId = new mongoose.Types.ObjectId(
      req.params.restaurantId
    );
    const menu = await Menu.find({ restaurantId: restaurantObjectId });

    console.log("✅ Menu found:", menu);

    res.status(200).json({
      message: "Menu fetched successfully",
      menu,
    });
  } catch (err) {
    console.error("❌ Error fetching menu:", err);
    res.status(500).json({ message: err.message });
  }
};

// 📄 Get single menu item by ID (public)
const getMenuItemById = async (req, res) => {
  try {
    const menuItem = await Menu.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.status(200).json({
      message: "Menu item fetched successfully",
      menuItem,
    });
  } catch (err) {
    console.error("❌ Error fetching menu item:", err);
    res.status(500).json({ message: err.message });
  }
};

// 🔁 Update menu item (only owner)
const updateMenuItem = async (req, res) => {
  try {
    const menuItem = await Menu.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    const restaurant = await Restaurant.findById(menuItem.restaurantId);
    if (
      !restaurant ||
      restaurant.owner.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Forbidden: Not your restaurant" });
    }

    Object.assign(menuItem, req.body);
    await menuItem.save();

    res.status(200).json({
      message: "Menu item updated successfully",
      menuItem,
    });
  } catch (err) {
    console.error("❌ Error updating menu item:", err);
    res.status(500).json({ message: err.message });
  }
};

// ❌ Delete menu item (only owner)
const deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await Menu.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    const restaurant = await Restaurant.findById(menuItem.restaurantId);
    if (
      !restaurant ||
      restaurant.owner.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Forbidden: Not your restaurant" });
    }

    await menuItem.deleteOne();

    res.status(200).json({ message: "Menu item deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting menu item:", err);
    res.status(500).json({ message: err.message });
  }
};

// 🚦 Toggle availability (only owner)
const toggleAvailability = async (req, res) => {
  try {
    const menuItem = await Menu.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    const restaurant = await Restaurant.findById(menuItem.restaurantId);
    if (
      !restaurant ||
      restaurant.owner.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Forbidden: Not your restaurant" });
    }

    menuItem.isAvailable = !menuItem.isAvailable;
    await menuItem.save();

    res.status(200).json({
      message: `Menu item is now ${
        menuItem.isAvailable ? "available" : "unavailable"
      }`,
      menuItem,
    });
  } catch (err) {
    console.error("❌ Error toggling availability:", err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createMenuItem,
  getMenuByRestaurant,
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem,
  toggleAvailability,
};
