// routes/AdminRoutes.js

const express = require("express");
const {
  getAllUsers,
  deleteUser,
  getAllRestaurants,
  deleteRestaurant,
  getAllDeliveryAgents,
  deleteDeliveryAgent,
  getDashboardStats,
} = require("../controllers/AdminController");

const router = express.Router();

// Users
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);

// Restaurants
router.get("/restaurants", getAllRestaurants);
router.delete("/restaurants/:id", deleteRestaurant);

// Delivery Agents
router.get("/delivery-agents", getAllDeliveryAgents);
router.delete("/delivery-agents/:id", deleteDeliveryAgent);

router.get("/dashboard-stats", getDashboardStats);

module.exports = router;
