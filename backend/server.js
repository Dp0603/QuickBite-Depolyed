// 🌍 Load environment variables FIRST
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");
// const path = require("path");
// const fs = require("fs");

const connectDB = require("./config/db");
const { initSocket } = require("./utils/socket");

// 🌐 Route Imports
const AuthRoutes = require("./routes/AuthRoutes");
const AdminRoutes = require("./routes/AdminRoutes");
const ReportsRoutes = require("./routes/ReportsRoutes");
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
const ReviewRoutes = require("./routes/ReviewRoutes");
const HelpSupportRoutes = require("./routes/HelpSupportRoutes");
const testOfferRoutes = require("./routes/TestOfferRoutes");
const UploadRoutes = require("./routes/UploadRoutes");

// ⚙️ Connect MongoDB (auto local/prod switch)
connectDB();

// 🚀 Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Create HTTP server for socket.io
const server = http.createServer(app);

// ✅ Initialize Socket.IO
const io = initSocket(server);
app.set("io", io);

// 🛡 Security & Middleware
app.set("trust proxy", 1); // Required for Render/HTTPS cookies

// 🌍 Dynamic CORS setup
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",").map((origin) => origin.trim())
  : [
      "http://localhost:5173", // local dev
      "https://quickbite-frontend.onrender.com", // production frontend
    ];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    exposedHeaders: ["x-rtb-fingerprint-id"],
  })
);

app.use(express.json({ limit: "1mb" }));

// ✅ Ensure uploads folder exists (local only)
// const uploadsPath = path.join(__dirname, "uploads");
// if (!fs.existsSync(uploadsPath)) {
//   fs.mkdirSync(uploadsPath);
// }

// ✅ Serve uploads folder as static (temporary for local)
// app.use("/uploads", express.static(uploadsPath));

// 🔗 Mount Routes
app.use("/api/auth", AuthRoutes);
app.use("/api/admin/reports", ReportsRoutes);
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
app.use("/api/reviews", ReviewRoutes);
app.use("/api/helpsupport", HelpSupportRoutes);
app.use("/api", testOfferRoutes);
app.use("/api/upload", UploadRoutes);

// 🏠 Root route
app.get("/", (req, res) => {
  res.setHeader("x-rtb-fingerprint-id", "sample-id-123");
  res.send("🍔 QuickBite API is running successfully!");
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
  console.log(
    `🚀 Server running in ${
      process.env.NODE_ENV || "development"
    } mode on http://localhost:${PORT}`
  );
});
