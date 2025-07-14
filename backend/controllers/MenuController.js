const MenuModel = require("../models/MenuModel");

// ➕ Create menu item
const createMenuItem = async (req, res) => {
  try {
    const { name, description, price, image } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: "Name and price are required" });
    }

    const newItem = await MenuModel.create({
      name,
      description,
      price,
      image,
      restaurantId: req.user.id, // ✅ Securely link item to logged-in restaurant
    });

    res.status(201).json({
      message: "Menu item created successfully",
      data: newItem,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📋 Get all menu items for logged-in restaurant
const getRestaurantMenu = async (req, res) => {
  try {
    const items = await MenuModel.find({ restaurantId: req.user.id });
    res.status(200).json({
      message: "Menu retrieved successfully",
      data: items,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔍 Get single menu item by ID
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
    const updated = await MenuModel.findOneAndUpdate(
      { _id: req.params.id, restaurantId: req.user.id },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res
        .status(404)
        .json({ message: "Menu item not found or unauthorized" });
    }

    res.status(200).json({ message: "Item updated", data: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ❌ Delete menu item
const deleteMenuItem = async (req, res) => {
  try {
    const deleted = await MenuModel.findOneAndDelete({
      _id: req.params.id,
      restaurantId: req.user.id,
    });

    if (!deleted) {
      return res
        .status(404)
        .json({ message: "Menu item not found or unauthorized" });
    }

    res.status(200).json({ message: "Item deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 👤 Public route to get menu by restaurant ID
const getMenuByRestaurantId = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const items = await MenuModel.find({ restaurantId });

    res.status(200).json({
      message: "Menu fetched by restaurant ID",
      data: items,
    });
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
  getMenuByRestaurantId,
};
