const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
const Restaurant = require("../models/RestaurantModel");
const { isValidTime } = require("../utils/validateTime");

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

// 🟢 Get Availability
const getAvailability = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ owner: req.user._id });
    if (!restaurant)
      return res.status(404).json({ message: "Profile not found" });

    res.status(200).json({
      data: {
        isOnline: restaurant.isOnline,
        autoAvailabilityEnabled: restaurant.autoAvailabilityEnabled,
        autoAcceptOrders: restaurant.autoAcceptOrders,
        weeklyAvailability: restaurant.weeklyAvailability,
        holidays: restaurant.holidays,
        overrides: restaurant.overrides,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🟢 Update Availability (with partial + validation)
const updateAvailability = async (req, res) => {
  try {
    const updates = {};
    const {
      isOnline,
      autoAvailabilityEnabled,
      autoAcceptOrders,
      weeklyAvailability,
      holidays,
      overrides,
    } = req.body;

    // ✅ Top-level fields
    if (typeof isOnline === "boolean") updates.isOnline = isOnline;
    if (typeof autoAvailabilityEnabled === "boolean")
      updates.autoAvailabilityEnabled = autoAvailabilityEnabled;
    if (typeof autoAcceptOrders === "boolean")
      updates.autoAcceptOrders = autoAcceptOrders;

    // ✅ Weekly Availability (partial update allowed)
    if (weeklyAvailability && Array.isArray(weeklyAvailability)) {
      for (let dayObj of weeklyAvailability) {
        const { day, open, close, shifts } = dayObj;

        if (!day) return res.status(400).json({ message: "Day is required" });

        // Validate open/close
        if (open && !isValidTime(open)) {
          return res
            .status(400)
            .json({ message: `Invalid open time for ${day}` });
        }
        if (close && !isValidTime(close)) {
          return res
            .status(400)
            .json({ message: `Invalid close time for ${day}` });
        }

        // Validate shifts
        if (shifts && Array.isArray(shifts)) {
          for (let shift of shifts) {
            if (shift.start && !isValidTime(shift.start)) {
              return res
                .status(400)
                .json({ message: `Invalid shift start time for ${day}` });
            }
            if (shift.end && !isValidTime(shift.end)) {
              return res
                .status(400)
                .json({ message: `Invalid shift end time for ${day}` });
            }
          }
        }

        // Build partial update path
        updates[`weeklyAvailability.${day}`] = {};
        if (open) updates[`weeklyAvailability.${day}.open`] = open;
        if (close) updates[`weeklyAvailability.${day}.close`] = close;
        if (shifts) updates[`weeklyAvailability.${day}.shifts`] = shifts;
      }
    }

    // ✅ Holidays
    if (holidays && Array.isArray(holidays)) {
      updates.holidays = holidays;
    }

    // ✅ Overrides
    if (overrides && Array.isArray(overrides)) {
      updates.overrides = overrides;
    }

    const restaurant = await Restaurant.findOneAndUpdate(
      { owner: req.user._id },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!restaurant)
      return res.status(404).json({ message: "Profile not found" });

    res.status(200).json({ message: "Availability updated", data: restaurant });
  } catch (err) {
    res.status(500).json({ message: err.message });
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
  getAvailability,
  updateAvailability,
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
