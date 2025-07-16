const UserModel = require("../models/UserModel");
const RestaurantModel = require("../models/RestaurantModel");

let carts = {}; // userId -> cart items
let orders = {}; // userId -> orders array

// ✅ Get Customer Profile
const getCustomerProfile = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id).select("-password");

    if (!user || user.role !== "customer") {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json({
      message: "Customer profile fetched successfully",
      data: user,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔄 Update Customer Profile
const updateCustomerProfile = async (req, res) => {
  try {
    const updates = {
      name: req.body.name,
      email: req.body.email,
    };

    const updatedUser = await UserModel.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json({
      message: "Customer profile updated",
      data: updatedUser,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 🛍 View Cart
const viewCart = async (req, res) => {
  try {
    const cart = carts[req.user.id] || [];
    res.status(200).json({
      message: "Cart retrieved successfully",
      data: cart,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ➕ Add to Cart
const addToCart = async (req, res) => {
  try {
    const { itemId, name, price, quantity } = req.body;

    if (!itemId || !name || !price || !quantity) {
      return res.status(400).json({ message: "All item fields are required" });
    }

    const newItem = { itemId, name, price, quantity };
    carts[req.user.id] = carts[req.user.id] || [];
    carts[req.user.id].push(newItem);

    res.status(201).json({
      message: "Item added to cart",
      data: carts[req.user.id],
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ❌ Remove from Cart
const removeFromCart = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const userCart = carts[req.user.id] || [];

    carts[req.user.id] = userCart.filter((item) => item.itemId !== itemId);

    res.status(200).json({
      message: "Item removed from cart",
      data: carts[req.user.id],
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📦 Place Order
const placeOrder = async (req, res) => {
  try {
    const cart = carts[req.user.id];
    if (!cart || cart.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const newOrder = {
      orderId: Date.now().toString(),
      items: cart,
      total,
      createdAt: new Date(),
      status: "Pending",
    };

    orders[req.user.id] = orders[req.user.id] || [];
    orders[req.user.id].push(newOrder);
    carts[req.user.id] = []; // Clear cart

    res.status(201).json({
      message: "Order placed successfully",
      data: newOrder,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📄 View Orders
const getOrders = async (req, res) => {
  try {
    const userOrders = orders[req.user.id] || [];
    res.status(200).json({
      message: "Orders retrieved successfully",
      data: userOrders,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🍽 Browse Restaurants (from DB)
const browseRestaurants = async (req, res) => {
  try {
    // ✅ Fetch only verified + open restaurants
    const restaurants = await RestaurantModel.find({
      isOpen: true,
      verified: true,
    }).select(
      "restaurantName cuisine address.city ratings isOpen logoUrl bannerUrl"
    );

    res.status(200).json({
      message: "Restaurants retrieved successfully",
      data: restaurants,
    });
  } catch (err) {
    console.error("❌ Error fetching restaurants:", err);
    res.status(500).json({ message: err.message });
  }
};

// ⭐ Submit Review (mock)
const submitReview = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      return res
        .status(400)
        .json({ message: "Rating and comment are required" });
    }

    const review = {
      orderId,
      user: req.user.id,
      rating,
      comment,
      createdAt: new Date(),
    };

    res.status(201).json({
      message: "Review submitted successfully",
      data: review,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getCustomerProfile,
  updateCustomerProfile,
  viewCart,
  addToCart,
  removeFromCart,
  placeOrder,
  getOrders,
  browseRestaurants,
  submitReview,
};
