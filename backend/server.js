// server.js

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db"); // ✅ Using modular MongoDB connection
const UserRoutes = require("./routes/UserRoutes");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize app
const app = express();
const PORT = process.env.PORT || 5000;

// 🔐 Middleware
app.use(cors());
app.use(express.json());

// 🔗 Routes
app.use("/api/users", UserRoutes);

// 🏠 Health Check Route
app.get("/", (req, res) => {
  res.send("🍔 QuickBite API is running...");
});

// 🔎 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: "❌ Route not found" });
});

// 🧯 Global Error Handler
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

// 🚀 Start server
app.listen(PORT, () => {
  console.clear();
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
