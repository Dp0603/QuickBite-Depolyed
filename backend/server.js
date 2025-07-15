const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// 🌐 Route imports
const AuthRoutes = require("./routes/authRoutes");
const RestaurantRoutes = require("./routes/RestaurantRoutes");
const MenuRoutes = require("./routes/MenuRoutes");
const CartRoutes = require("./routes/CartRoutes");
const OrderRoutes = require("./routes/OrderRoutes"); // ✅ Add this
const OfferRoutes = require("./routes/OfferRoutes");
const payoutRoutes = require("./routes/PayoutRoutes");
const chatRoutes = require("./routes/ChatRoutes");
const restaurantSettingsRoutes = require("./routes/RestaurantSettingsRoutes");
const reviewRoutes = require("./routes/ReviewRoutes"); // ✅ NEW ROUTE ADDED

// 📦 Load environment variables
dotenv.config();

// 🔌 Connect to MongoDB
connectDB();

// 🚀 Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// 🛡️ Middleware
app.use(cors());
app.use(express.json());

// 🔗 Mount Routes
app.use("/api/auth", AuthRoutes);
app.use("/api/restaurant", RestaurantRoutes);
app.use("/api/menu", MenuRoutes); // ✅ NEW ROUTE ADDED
app.use("/api/cart", CartRoutes); // 👈 Mount /api/cart routes
app.use("/api/orders", OrderRoutes); // ✅ Mount it
app.use("/api/offers", OfferRoutes);
app.use("/api/payouts", payoutRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/restaurant/settings", restaurantSettingsRoutes);
app.use("/api", reviewRoutes); // ✅ NEW ROUTE ADDED"));

// 🏠 Root route
app.get("/", (req, res) => {
  res.send("🍔 QuickBite API is running...");
});

// ❌ 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: "❌ Route not found" });
});

// 🔥 Error Handler
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// 💥 Crash Safety
process.on("unhandledRejection", (reason) => {
  console.error("💥 Unhandled Rejection:", reason);
});
process.on("uncaughtException", (err) => {
  console.error("💥 Uncaught Exception:", err);
});

// 🚀 Start Server
app.listen(PORT, () => {
  console.clear();
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
