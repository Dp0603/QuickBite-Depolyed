const Menu = require("../models/MenuModel");

// 🍽️ Create a new menu item
const createMenuItem = async (req, res) => {
  try {
    const menuItem = await Menu.create(req.body);

    res.status(201).json({
      message: "Menu item created successfully",
      menuItem,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📋 Get all menu items for a restaurant
const getMenuByRestaurant = async (req, res) => {
  try {
    const menu = await Menu.find({ restaurantId: req.params.restaurantId });

    res.status(200).json({
      message: "Menu fetched successfully",
      menu,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📄 Get single menu item by ID
const getMenuItemById = async (req, res) => {
  try {
    const menuItem = await Menu.findById(req.params.id);

    if (!menuItem)
      return res.status(404).json({ message: "Menu item not found" });

    res.status(200).json({
      message: "Menu item fetched successfully",
      menuItem,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔁 Update menu item
const updateMenuItem = async (req, res) => {
  try {
    const updatedItem = await Menu.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updatedItem)
      return res.status(404).json({ message: "Menu item not found" });

    res.status(200).json({
      message: "Menu item updated successfully",
      menuItem: updatedItem,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ❌ Delete menu item
const deleteMenuItem = async (req, res) => {
  try {
    const deletedItem = await Menu.findByIdAndDelete(req.params.id);

    if (!deletedItem)
      return res.status(404).json({ message: "Menu item not found" });

    res.status(200).json({ message: "Menu item deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🚦 Toggle availability
const toggleAvailability = async (req, res) => {
  try {
    const menuItem = await Menu.findById(req.params.id);
    if (!menuItem)
      return res.status(404).json({ message: "Menu item not found" });

    menuItem.isAvailable = !menuItem.isAvailable;
    await menuItem.save();

    res.status(200).json({
      message: `Menu item is now ${
        menuItem.isAvailable ? "available" : "unavailable"
      }`,
      menuItem,
    });
  } catch (err) {
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
