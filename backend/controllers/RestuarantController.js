const RestaurantModel = require("../models/RestaurantModel");
const OrderModel = require("../models/OrderModel");
const UserModel = require("../models/UserModel");

// 🆕 Create Restaurant Profile
const createRestaurantProfile = async (req, res) => {
  try {
    const existing = await RestaurantModel.findOne({ userId: req.user.id });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Restaurant profile already exists" });
    }

    const restaurant = await RestaurantModel.create({
      userId: req.user.id,
      restaurantName: req.body.restaurantName,
      description: req.body.description,
      phone: req.body.phone,
      cuisine: req.body.cuisine,
      logoUrl: req.body.logoUrl,
      bannerUrl: req.body.bannerUrl,
      address: {
        street: req.body.address?.street || "",
        city: req.body.address?.city || "",
        state: req.body.address?.state || "",
        zip: req.body.address?.zip || "",
      },
    });

    // Store email separately in User model if provided
    if (req.body.email) {
      await UserModel.findByIdAndUpdate(req.user.id, { email: req.body.email });
    }

    res.status(201).json({
      message: "Restaurant profile created",
      data: restaurant,
    });
  } catch (err) {
    console.error("❌ Error creating profile:", err);
    res.status(500).json({ message: err.message });
  }
};

// 📄 Get Restaurant Profile (with email)
const getRestaurantProfile = async (req, res) => {
  try {
    const restaurant = await RestaurantModel.findOne({
      userId: req.user.id,
    }).lean();
    const user = await UserModel.findById(req.user.id).select("email");

    if (!restaurant || !user) {
      return res.status(404).json({ message: "Restaurant profile not found" });
    }

    res.status(200).json({
      message: "Restaurant profile fetched",
      data: {
        ...restaurant,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✏️ Update Restaurant Profile (with email)
const updateRestaurantProfile = async (req, res) => {
  try {
    const restaurant = await RestaurantModel.findOne({ userId: req.user.id });
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const {
      restaurantName,
      cuisine,
      phone,
      address,
      logoUrl,
      bannerUrl,
      description,
      email,
    } = req.body;

    restaurant.restaurantName = restaurantName || restaurant.restaurantName;
    restaurant.cuisine = cuisine || restaurant.cuisine;
    restaurant.phone = phone || restaurant.phone;
    restaurant.address = address || restaurant.address;
    restaurant.logoUrl = logoUrl || restaurant.logoUrl;
    restaurant.bannerUrl = bannerUrl || restaurant.bannerUrl;
    restaurant.description = description || restaurant.description;

    await restaurant.save();

    // Update email in User model
    if (email) {
      await UserModel.findByIdAndUpdate(req.user.id, { email });
    }

    res.status(200).json({
      message: "Restaurant profile updated",
      data: restaurant,
    });
  } catch (err) {
    console.error("🔥 Error in updateRestaurantProfile:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// 📦 View Orders
const getRestaurantOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find({ restaurantId: req.user.id })
      .populate("customerId", "name")
      .populate("items.menuItemId", "name price");

    res.status(200).json({
      message: "Orders retrieved",
      data: orders,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔄 Update Order Status
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const updatedOrder = await OrderModel.findOneAndUpdate(
      { _id: orderId, restaurantId: req.user.id },
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      message: "Order status updated",
      data: updatedOrder,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Toggle Restaurant Availability
const toggleAvailability = async (req, res) => {
  try {
    const restaurant = await RestaurantModel.findOne({ userId: req.user.id });

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    restaurant.isOpen = !restaurant.isOpen;
    await restaurant.save();

    res.status(200).json({
      message: `Restaurant is now ${restaurant.isOpen ? "Online" : "Offline"}`,
      isOpen: restaurant.isOpen,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ⚙️ Get Availability Settings
const getAvailabilitySettings = async (req, res) => {
  try {
    const restaurant = await RestaurantModel.findOne({ userId: req.user.id });
    if (!restaurant) return res.status(404).json({ message: "Not found" });

    res.status(200).json({
      message: "Availability settings fetched",
      data: restaurant.availability || {},
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ⚙️ Update Availability Settings
const updateAvailabilitySettings = async (req, res) => {
  try {
    const updates = req.body;
    const restaurant = await RestaurantModel.findOne({ userId: req.user.id });
    if (!restaurant) return res.status(404).json({ message: "Not found" });

    restaurant.availability = {
      ...restaurant.availability,
      ...updates,
    };

    await restaurant.save();

    res.status(200).json({
      message: "Availability settings updated",
      data: restaurant.availability,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 💬 View Reviews (Mocked)
const getReviews = async (req, res) => {
  try {
    const reviews = [
      {
        id: "rev1",
        user: "Customer A",
        rating: 5,
        comment: "Amazing food!",
      },
      {
        id: "rev2",
        user: "Customer B",
        rating: 4,
        comment: "Great experience overall.",
      },
    ];

    res.status(200).json({
      message: "Reviews retrieved",
      data: reviews,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const getMenuSchedule = async (req, res) => {
  try {
    const restaurant = await RestaurantModel.findOne({ userId: req.user.id });
    if (!restaurant) return res.status(404).json({ message: "Not found" });

    res.status(200).json({
      message: "Menu schedule fetched",
      data: restaurant.menuSchedule || [],
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const updateMenuSchedule = async (req, res) => {
  try {
    const { schedule } = req.body;
    const restaurant = await RestaurantModel.findOne({ userId: req.user.id });

    if (!restaurant) return res.status(404).json({ message: "Not found" });

    restaurant.menuSchedule = schedule;
    await restaurant.save();

    res.status(200).json({
      message: "Menu schedule updated",
      data: restaurant.menuSchedule,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createRestaurantProfile,
  getRestaurantProfile,
  updateRestaurantProfile,
  getRestaurantOrders,
  updateOrderStatus,
  toggleAvailability,
  getAvailabilitySettings,
  updateAvailabilitySettings,
  getReviews,
  getMenuSchedule,
  updateMenuSchedule,
};
