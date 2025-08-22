// src/routes/RestaurantRoutes.jsx
import React from "react";
import { Route } from "react-router-dom";

// Main
import RestaurantDashboard from "../pages/restaurant/RestaurantDashboard";

// Orders
import RestaurantOrders from "../pages/restaurant/RestaurantOrders";

// Menu Management
import RestaurantMenuManager from "../pages/restaurant/RestaurantMenuManager";
import RestaurantMenuScheduler from "../pages/restaurant/RestaurantMenuScheduler";
import RestaurantAddDish from "../pages/restaurant/RestaurantAddDish";
import RestaurantEditDish from "../pages/restaurant/RestaurantEditDish";
import RestaurantAvailabilityToggle from "../pages/restaurant/RestaurantAvailabilityToggle";

// Customer Engagement
import RestaurantReviews from "../pages/restaurant/RestaurantReviews";

// Analytics
import RestaurantAnalytics from "../pages/restaurant/RestaurantAnalytics";

// Finance (owner only)
import RestaurantPayouts from "../pages/restaurant/RestaurantPayouts";

// Profile & Settings (settings = owner only)
import RestaurantProfile from "../pages/restaurant/RestaurantProfile";
import RestaurantSettings from "../pages/restaurant/RestaurantSettings";

// Support
import RestaurantHelp from "../pages/restaurant/RestaurantHelp";

export const restaurantRoutes = (isOwnerMode) => [
  // Main
  <Route key="restaurant-dashboard" index element={<RestaurantDashboard />} />,

  // Orders
  <Route
    key="restaurant-orders"
    path="orders"
    element={<RestaurantOrders />}
  />,

  // Menu Management
  <Route
    key="restaurant-menu-manager"
    path="menu-manager"
    element={<RestaurantMenuManager />}
  />,
  <Route
    key="restaurant-menu-scheduler"
    path="menu-scheduler"
    element={<RestaurantMenuScheduler />}
  />,
  <Route
    key="restaurant-add-menu"
    path="menu/add"
    element={<RestaurantAddDish />}
  />,
  <Route
    key="restaurant-edit-menu"
    path="menu/edit/:id"
    element={<RestaurantEditDish />}
  />,
  <Route
    key="restaurant-availability-toggle"
    path="availability-toggle"
    element={<RestaurantAvailabilityToggle />}
  />,

  // Customer Engagement
  <Route
    key="restaurant-reviews"
    path="reviews"
    element={<RestaurantReviews />}
  />,

  // Analytics
  <Route
    key="restaurant-analytics"
    path="analytics"
    element={<RestaurantAnalytics />}
  />,

  // Finance (owner only)
  ...(isOwnerMode
    ? [
        <Route
          key="restaurant-payouts"
          path="payouts"
          element={<RestaurantPayouts />}
        />,
      ]
    : []),

  // Profile & Settings
  <Route
    key="restaurant-profile"
    path="profile"
    element={<RestaurantProfile />}
  />,
  ...(isOwnerMode
    ? [
        <Route
          key="restaurant-settings"
          path="settings"
          element={<RestaurantSettings />}
        />,
      ]
    : []),

  // Support
  <Route key="restaurant-help" path="help" element={<RestaurantHelp />} />,
];
