const MenuModel = require("../models/MenuModel");

// ➕ Create menu item
const createMenuItem = async (req, res) => {
  try {
    const newItem = await MenuModel.create(req.body);
    res.status(201).json({
      message: "Menu item created successfully",
      data: newItem,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📋 Get all menu items for a restaurant
const getRestaurantMenu = async (req, res) => {
  try {
    const items = await MenuModel.find({ restaurantId: req.params.restaurantId });
    res.status(200).json({
      message: "Menu retrieved successfully",
      data: items,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔍 Get single menu item
const getMenuItemById = async (req, res) => {
  try {
    const item = await MenuModel.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Menu item not found" });

    res.status(200).json({ message: "Item retrieved", data: item });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✏️ Update menu item
const updateMenuItem = async (req, res) => {
  try {
    const updated = await MenuModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({ message: "Item updated", data: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ❌ Delete item
const deleteMenuItem = async (req, res) => {
  try {
    await MenuModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createMenuItem,
  getRestaurantMenu,
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem,
};
