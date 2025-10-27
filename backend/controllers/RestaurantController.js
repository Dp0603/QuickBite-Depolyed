const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
const Restaurant = require("../models/RestaurantModel");
const { isValidTime } = require("../utils/validateTime");

// 🔑 Helper: Generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// 🟢 Final Step: Create Restaurant Profile (linked to user)
const createProfile = async (req, res) => {
  try {
    const ownerId = req.user._id;

    // Check if restaurant already exists for this owner
    const existing = await Restaurant.findOne({ owner: ownerId });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Restaurant profile already exists" });
    }

    // Create restaurant profile
    const restaurant = await Restaurant.create({
      owner: ownerId,
      name: req.body.name,
      phoneNumber: req.body.phoneNumber,
      address: req.body.address,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      cuisines: req.body.cuisines,
      logo: req.body.logo,
      coverImage: req.body.coverImage,
      licenseNumber: req.body.licenseNumber,
      gstNumber: req.body.gstNumber,
      bankAccount: req.body.bankAccount,
      // status: "pending",
      isActive: true,
    });

    // Ensure user role is "restaurant"
    const user = await User.findById(ownerId);
    if (user.role !== "restaurant") {
      user.role = "restaurant";
      await user.save();
    }

    // 🏦 Auto-sync payout settings from bankAccount if provided
    if (req.body.bankAccount && Object.keys(req.body.bankAccount).length > 0) {
      restaurant.payoutSettings = {
        preferredMethod: "bank",
        bankAccount: req.body.bankAccount.accountNumber || "",
        ifsc: req.body.bankAccount.ifsc || "",
        accountHolder: req.body.bankAccount.holderName || "",
      };
      await restaurant.save();
    }

    // Generate fresh token
    const token = generateToken(user);

    return res.status(201).json({
      message:
        "Restaurant profile created successfully. Pending admin approval.",
      restaurant,
      token,
    });
  } catch (error) {
    console.error("Error in createProfile:", error);
    return res.status(500).json({ message: error.message });
  }
};

// 🟢 Update Profile
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

    // 🏦 Keep payoutSettings updated if bankAccount changes
    if (req.body.bankAccount && Object.keys(req.body.bankAccount).length > 0) {
      restaurant.payoutSettings = {
        preferredMethod: "bank",
        bankAccount: req.body.bankAccount.accountNumber || "",
        ifsc: req.body.bankAccount.ifsc || "",
        accountHolder: req.body.bankAccount.holderName || "",
      };
      await restaurant.save();
    }

    res.json({
      message: "Restaurant profile updated successfully",
      restaurant,
    });
  } catch (error) {
    console.error("Error in updateProfile:", error);
    res.status(500).json({ message: error.message });
  }
};

// 🟢 Get My Profile
const getMyProfile = async (req, res) => {
  try {
    const ownerId = req.user._id;
    const restaurant = await Restaurant.findOne({ owner: ownerId });

    if (!restaurant) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json({ restaurant });
  } catch (error) {
    console.error("Error in getMyProfile:", error);
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
    console.error("Error in getAllRestaurants:", error);
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
    console.error("Error in getRestaurantById:", error);
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
    console.error("Error in changeStatus:", error);
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
    console.error("Error in deleteRestaurant:", error);
    res.status(500).json({ message: error.message });
  }
};

// 🟢 Get Availability
const getAvailability = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ owner: req.user._id });
    if (!restaurant) {
      return res.status(404).json({ message: "Profile not found" });
    }

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
    console.error("Error in getAvailability:", err);
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

    if (typeof isOnline === "boolean") updates.isOnline = isOnline;
    if (typeof autoAvailabilityEnabled === "boolean")
      updates.autoAvailabilityEnabled = autoAvailabilityEnabled;
    if (typeof autoAcceptOrders === "boolean")
      updates.autoAcceptOrders = autoAcceptOrders;

    // ✅ Weekly availability validation
    if (weeklyAvailability && Array.isArray(weeklyAvailability)) {
      for (let dayObj of weeklyAvailability) {
        const { day, open, close, shifts } = dayObj;
        if (!day) return res.status(400).json({ message: "Day is required" });

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

        updates[`weeklyAvailability.${day}`] = {};
        if (open) updates[`weeklyAvailability.${day}.open`] = open;
        if (close) updates[`weeklyAvailability.${day}.close`] = close;
        if (shifts) updates[`weeklyAvailability.${day}.shifts`] = shifts;
      }
    }

    if (holidays && Array.isArray(holidays)) {
      updates.holidays = holidays;
    }
    if (overrides && Array.isArray(overrides)) {
      updates.overrides = overrides;
    }

    const restaurant = await Restaurant.findOneAndUpdate(
      { owner: req.user._id },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!restaurant) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json({ message: "Availability updated", data: restaurant });
  } catch (err) {
    console.error("Error in updateAvailability:", err);
    res.status(500).json({ message: err.message });
  }
};

// 🟢 Get Restaurant Settings
const getRestaurantSettings = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ owner: req.user._id }).select(
      "orderSettings deliverySettings payoutSettings notificationSettings securitySettings"
    );

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.json({
      orderSettings: restaurant.orderSettings || {},
      deliverySettings: restaurant.deliverySettings || {},
      financeSettings: restaurant.payoutSettings || {},
      notificationSettings: restaurant.notificationSettings || {},
      securitySettings: restaurant.securitySettings || {},
    });
  } catch (err) {
    console.error("Error fetching restaurant settings:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🆕 Settings Update Handlers
const updateOrderSettings = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOneAndUpdate(
      { owner: req.user._id },
      { orderSettings: req.body },
      { new: true, runValidators: true }
    );
    if (!restaurant)
      return res.status(404).json({ message: "Restaurant not found" });
    res.json({
      message: "Order settings updated",
      data: restaurant.orderSettings,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateDeliverySettings = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOneAndUpdate(
      { owner: req.user._id },
      { deliverySettings: req.body },
      { new: true, runValidators: true }
    );
    if (!restaurant)
      return res.status(404).json({ message: "Restaurant not found" });
    res.json({
      message: "Delivery settings updated",
      data: restaurant.deliverySettings,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updatePayoutSettings = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOneAndUpdate(
      { owner: req.user._id },
      { payoutSettings: req.body },
      { new: true, runValidators: true }
    );
    if (!restaurant)
      return res.status(404).json({ message: "Restaurant not found" });
    res.json({
      message: "Payout settings updated",
      data: restaurant.payoutSettings,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateNotificationSettings = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOneAndUpdate(
      { owner: req.user._id },
      { notificationSettings: req.body },
      { new: true, runValidators: true }
    );
    if (!restaurant)
      return res.status(404).json({ message: "Restaurant not found" });
    res.json({
      message: "Notification settings updated",
      data: restaurant.notificationSettings,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateSecuritySettings = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOneAndUpdate(
      { owner: req.user._id },
      { securitySettings: req.body },
      { new: true, runValidators: true }
    );
    if (!restaurant)
      return res.status(404).json({ message: "Restaurant not found" });
    res.json({
      message: "Security settings updated",
      data: restaurant.securitySettings,
    });
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
  getRestaurantSettings,
  updateOrderSettings,
  updateDeliverySettings,
  updatePayoutSettings,
  updateNotificationSettings,
  updateSecuritySettings,
};
