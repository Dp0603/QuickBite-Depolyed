const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http"); // ✅ for attaching socket.io
const connectDB = require("./config/db");
const { initSocket } = require("./utils/socket"); // ✅ import your socket setup

// 🌐 Route Imports (PascalCase)
const AuthRoutes = require("./routes/AuthRoutes");
const AdminRoutes = require("./routes/AdminRoutes");
const UserRoutes = require("./routes/UserRoutes");
const AddressRoutes = require("./routes/AddressRoutes");
const RestaurantRoutes = require("./routes/RestaurantRoutes");
const MenuRoutes = require("./routes/MenuRoutes");
const CartRoutes = require("./routes/CartRoutes");
const FavoriteRoutes = require("./routes/FavoriteRoutes");
const OrderRoutes = require("./routes/OrderRoutes");
const OfferRoutes = require("./routes/OfferRoutes");
const NotificationRoutes = require("./routes/NotificationRoutes");
const PayoutRoutes = require("./routes/PayoutRoutes");
const PremiumSubscriptionRoutes = require("./routes/PremiumSubscriptionRoutes");
const MessageRoutes = require("./routes/MessageRoutes");
const AnalyticsRoutes = require("./routes/AnalyticsRoutes");
const FeedbackRoutes = require("./routes/FeedbackRoutes");
const PaymentRoutes = require("./routes/PaymentRoutes");
const SupportRoutes = require("./routes/SupportRoutes");

// 📦 Load environment variables
dotenv.config();

// 🔌 Connect to MongoDB
connectDB();

// 🚀 Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Create HTTP server for socket.io to hook into
const server = http.createServer(app);

// ✅ Initialize Socket.IO
const io = initSocket(server);
app.set("io", io); // Optional: so you can access it inside routes/controllers using req.app.get("io")

// 🛡️ Middleware
app.use(cors());
app.use(express.json());

// 🔗 Mount Routes (clean + organized)
app.use("/api/auth", AuthRoutes);
app.use("/api/admin", AdminRoutes);
app.use("/api/users", UserRoutes);
app.use("/api/addresses", AddressRoutes);
app.use("/api/restaurants", RestaurantRoutes);
app.use("/api/menu", MenuRoutes);
app.use("/api/cart", CartRoutes);
app.use("/api/favorites", FavoriteRoutes);
app.use("/api/orders", OrderRoutes);
app.use("/api/offers", OfferRoutes);
app.use("/api/notifications", NotificationRoutes);
app.use("/api/payouts", PayoutRoutes);
app.use("/api/premium", PremiumSubscriptionRoutes);
app.use("/api/messages", MessageRoutes);
app.use("/api/analytics", AnalyticsRoutes);
app.use("/api/feedback", FeedbackRoutes);
app.use("/api/payment", PaymentRoutes);
app.use("/api/support", SupportRoutes);

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
server.listen(PORT, () => {
  console.clear();
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
