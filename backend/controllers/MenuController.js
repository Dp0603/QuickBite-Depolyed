const mongoose = require("mongoose");
const Menu = require("../models/MenuModel");
const Restaurant = require("../models/RestaurantModel");

//
// 🔎 Helper: check if a menu item is currently available
//
const isAvailableNow = (menuItem) => {
  if (!menuItem.isAvailable) return false;

  const now = new Date();
  const day = now.toLocaleString("en-US", { weekday: "long" }).toLowerCase(); // e.g. "monday"
  const schedule = menuItem.schedule?.[day];

  if (!schedule || !schedule.available) return false;

  const currentTime = now.toTimeString().slice(0, 5); // "HH:mm"
  return schedule.startTime <= currentTime && currentTime <= schedule.endTime;
};

//
// 🍽️ Create a new menu item (only restaurant owner)
//
const createMenuItem = async (req, res) => {
  try {
    const { restaurantId, ...data } = req.body;

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

    res.status(201).json({
      message: "Menu item created successfully",
      menuItem,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//
// 📋 Get all currently available menu items for a restaurant (customer)
//
const getMenuByRestaurant = async (req, res) => {
  try {
    const restaurantObjectId = new mongoose.Types.ObjectId(
      req.params.restaurantId
    );
    const menu = await Menu.find({ restaurantId: restaurantObjectId });

    // filter by schedule
    const availableMenu = menu.filter(isAvailableNow);

    res.status(200).json({
      message: "Menu fetched successfully",
      menu: availableMenu,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//
// 📋 Get full menu for a restaurant (owner/admin/dashboard)
//
const getFullMenuByRestaurant = async (req, res) => {
  try {
    // Find the restaurant for the logged-in user
    const restaurant = await Restaurant.findOne({ owner: req.user._id });
    if (!restaurant) {
      return res
        .status(404)
        .json({ message: "Restaurant not found for this owner" });
    }

    // Fetch all menu items for that restaurant
    const menu = await Menu.find({ restaurantId: restaurant._id });

    res.status(200).json({
      message: "Full menu fetched successfully",
      menu,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateMenuItemSchedule = async (req, res) => {
  try {
    const menuItem = await Menu.findById(req.params.id);
    if (!menuItem)
      return res.status(404).json({ message: "Menu item not found" });

    const restaurant = await Restaurant.findById(menuItem.restaurantId);
    if (
      !restaurant ||
      restaurant.owner.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Forbidden: Not your restaurant" });
    }

    // Update only the schedule
    menuItem.schedule = req.body.schedule;
    await menuItem.save();

    res
      .status(200)
      .json({ message: "Schedule updated successfully", menuItem });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//
// 📄 Get single menu item by ID
//
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
    res.status(500).json({ message: err.message });
  }
};

//
// 🔁 Update menu item (only owner)
//
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
    res.status(500).json({ message: err.message });
  }
};

//
// ❌ Delete menu item (only owner)
//
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
    res.status(500).json({ message: err.message });
  }
};

//
// 🚦 Toggle availability (only owner)
//
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
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createMenuItem,
  getMenuByRestaurant,
  getFullMenuByRestaurant,
  updateMenuItemSchedule,
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem,
  toggleAvailability,
};
