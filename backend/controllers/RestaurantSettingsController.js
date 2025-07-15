const Restaurant = require("../models/RestaurantModel");
const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");

// 🔄 Update order settings (min order, delivery time, auto accept)
exports.updateOrderSettings = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ userId: req.user._id });
    if (!restaurant)
      return res.status(404).json({ message: "Restaurant not found" });

    const { minOrderAmount, deliveryTime, autoAcceptOrders } = req.body;

    restaurant.availability.autoAcceptOrders = autoAcceptOrders;
    restaurant.minOrderAmount = minOrderAmount;
    restaurant.deliveryTime = deliveryTime;

    await restaurant.save();

    res.json({ success: true, message: "Settings updated successfully" });
  } catch (err) {
    console.error("Update order settings error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔑 Change password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
      return res.status(400).json({ message: "Both fields required" });

    const user = await User.findById(req.user._id);
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch)
      return res.status(400).json({ message: "Current password incorrect" });

    user.password = newPassword; // will be hashed in pre-save
    await user.save();

    res.json({ success: true, message: "Password changed successfully" });
  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
