const UserModel = require("../models/UserModel");
const RestaurantModel = require("../models/RestaurantModel");
const DeliveryAgentModel = require("../models/DeliveryAgentModel");
const OrderModel = require("../models/OrderModel"); // ✅ Make sure this exists

// ✅ Get all users (except admin)
const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find({ role: { $ne: "admin" } }).select(
      "-password"
    );
    res
      .status(200)
      .json({ message: "Users fetched successfully", data: users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Delete a user
const deleteUser = async (req, res) => {
  try {
    await UserModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get all restaurants
const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await RestaurantModel.find();
    res
      .status(200)
      .json({ message: "Restaurants fetched successfully", data: restaurants });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Delete a restaurant
const deleteRestaurant = async (req, res) => {
  try {
    await RestaurantModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Restaurant deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get all delivery agents
const getAllDeliveryAgents = async (req, res) => {
  try {
    const agents = await DeliveryAgentModel.find();
    res
      .status(200)
      .json({ message: "Delivery agents fetched successfully", data: agents });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Delete a delivery agent
const deleteDeliveryAgent = async (req, res) => {
  try {
    await DeliveryAgentModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Delivery agent deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Admin Dashboard Stats
const getDashboardStats = async (req, res) => {
  try {
    const customerCount = await UserModel.countDocuments({ role: "customer" });
    const restaurantUserCount = await UserModel.countDocuments({
      role: "restaurant",
    });
    const deliveryAgentCount = await UserModel.countDocuments({
      role: "deliveryAgent",
    });

    const restaurantCount = await RestaurantModel.countDocuments();
    const totalOrders = await OrderModel.countDocuments();

    const totalRevenueData = await OrderModel.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$totalPrice" }, // 🔁 Make sure your OrderModel has a field named `totalPrice`
        },
      },
    ]);

    const totalRevenue = totalRevenueData[0]?.total || 0;

    res.status(200).json({
      message: "Dashboard metrics fetched successfully",
      data: {
        users: {
          customers: customerCount,
          restaurants: restaurantUserCount,
          deliveryAgents: deliveryAgentCount,
        },
        restaurants: restaurantCount,
        totalOrders,
        totalRevenue,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllUsers,
  deleteUser,
  getAllRestaurants,
  deleteRestaurant,
  getAllDeliveryAgents,
  deleteDeliveryAgent,
  getDashboardStats, // ✅ Don't forget this in your routes
};
