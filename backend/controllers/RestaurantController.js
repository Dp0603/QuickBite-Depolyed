const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
const Restaurant = require("../models/RestaurantModel");

// 🔑 helper → generate token
const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// 🟢 Owner: Create Profile
const createProfile = async (req, res) => {
  try {
    const ownerId = req.user._id;

    const existing = await Restaurant.findOne({ owner: ownerId });
    if (existing) {
      return res.status(400).json({ message: "Profile already exists" });
    }

    const restaurant = await Restaurant.create({
      ...req.body,
      owner: ownerId,
      status: "pending",
      isActive: true,
    });

    // ✅ Ensure role = restaurant
    const user = await User.findById(ownerId);
    if (user.role !== "restaurant") {
      user.role = "restaurant";
      await user.save();
    }

    // ✅ Fresh token
    const token = generateToken(user);

    res.status(201).json({
      message: "Restaurant profile created. Pending admin approval.",
      restaurant,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🟢 Owner: Update Profile
const updateProfile = async (req, res) => {
  try {
    const ownerId = req.user._id;

    const restaurant = await Restaurant.findOneAndUpdate(
      { owner: ownerId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant profile not found" });
    }

    // 🔄 Ensure role = restaurant
    const user = await User.findById(ownerId);
    if (user.role !== "restaurant") {
      user.role = "restaurant";
      await user.save();
    }

    // 🔑 Only issue new token if role was changed
    const token = user.role === "restaurant" ? generateToken(user) : null;

    res.json({
      message: "Restaurant profile updated successfully",
      restaurant,
      ...(token && { token }),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🟢 Owner: Get My Profile
const getMyProfile = async (req, res) => {
  try {
    const ownerId = req.user._id;
    const restaurant = await Restaurant.findOne({ owner: ownerId });

    if (!restaurant) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json({ restaurant });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔵 Customer: Get All Approved Restaurants
const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({
      status: "approved",
      isActive: true,
    });
    res.status(200).json({ restaurants });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔵 Customer: Get Restaurant By ID
const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).populate(
      "owner",
      "name email"
    );

    if (!restaurant || restaurant.status !== "approved") {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.status(200).json({ restaurant });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🟣 Admin: Change Status
const changeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const restaurant = await Restaurant.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.status(200).json({ message: `Restaurant ${status}`, restaurant });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🟢 Owner/Admin: Delete Restaurant
const deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndDelete(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.status(200).json({ message: "Restaurant deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProfile,
  updateProfile,
  getMyProfile,
  getAllRestaurants,
  getRestaurantById,
  changeStatus,
  deleteRestaurant,
};

//OLD
//  const Restaurant = require("../models/RestaurantModel");

// // 🍽️ Create a new restaurant (By owner)
// const createRestaurant = async (req, res) => {
//   try {
//     const newRestaurant = await Restaurant.create(req.body);

//     res.status(201).json({
//       message: "Restaurant created successfully",
//       restaurant: newRestaurant,
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // 📄 Get a restaurant by ID
// const getRestaurantById = async (req, res) => {
//   try {
//     const restaurant = await Restaurant.findById(req.params.id)
//       .populate("userId", "name email")
//       .populate("addressId");

//     if (!restaurant)
//       return res.status(404).json({ message: "Restaurant not found" });

//     res.status(200).json({
//       message: "Restaurant fetched successfully",
//       restaurant,
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // 📦 Get all restaurants (public)
// const getAllRestaurants = async (req, res) => {
//   try {
//     const restaurants = await Restaurant.find({
//       isVerified: true,
//       isOpen: true,
//     }).populate("addressId");

//     res.status(200).json({
//       message: "Restaurants fetched successfully",
//       restaurants,
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // 🔍 Get restaurants by owner (owner dashboard)
// const getRestaurantsByOwner = async (req, res) => {
//   try {
//     const restaurants = await Restaurant.find({ ownerId: req.params.ownerId });

//     res.status(200).json({
//       message: "Owner's restaurants fetched successfully",
//       restaurants,
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // ✅ Verify a restaurant (admin use)
// const verifyRestaurant = async (req, res) => {
//   try {
//     const updated = await Restaurant.findByIdAndUpdate(
//       req.params.id,
//       { isVerified: true },
//       { new: true }
//     );

//     if (!updated)
//       return res.status(404).json({ message: "Restaurant not found" });

//     res.status(200).json({
//       message: "Restaurant verified successfully",
//       restaurant: updated,
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // 🔁 Update restaurant details
// const updateRestaurant = async (req, res) => {
//   try {
//     const updated = await Restaurant.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       {
//         new: true,
//       }
//     );

//     if (!updated)
//       return res.status(404).json({ message: "Restaurant not found" });

//     res.status(200).json({
//       message: "Restaurant updated successfully",
//       restaurant: updated,
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // ❌ Delete restaurant
// const deleteRestaurant = async (req, res) => {
//   try {
//     const deleted = await Restaurant.findByIdAndDelete(req.params.id);

//     if (!deleted)
//       return res.status(404).json({ message: "Restaurant not found" });

//     res.status(200).json({ message: "Restaurant deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// module.exports = {
//   createRestaurant,
//   getRestaurantById,
//   getAllRestaurants,
//   getRestaurantsByOwner,
//   verifyRestaurant,
//   updateRestaurant,
//   deleteRestaurant,
// };
