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
// import RestaurantAvailability from "../pages/restaurant/RestaurantAvailability";

// Customer Engagement
import RestaurantReviews from "../pages/restaurant/RestaurantReviews";
// import RestaurantChat from "../pages/restaurant/RestaurantChat";
// import RestaurantNotifications from "../pages/restaurant/RestaurantNotifications";

// Analytics
import RestaurantAnalytics from "../pages/restaurant/RestaurantAnalytics";
// import RestaurantHeatmap from "../pages/restaurant/RestaurantHeatmap";

// Finance
import RestaurantPayouts from "../pages/restaurant/RestaurantPayouts";
// import RestaurantInvoices from "../pages/restaurant/RestaurantInvoices";

// Profile & Settings
import RestaurantProfile from "../pages/restaurant/RestaurantProfile";
import RestaurantSettings from "../pages/restaurant/RestaurantSettings";
// import RestaurantStaff from "../pages/restaurant/RestaurantStaff";

// Support
import RestaurantHelp from "../pages/restaurant/RestaurantHelp";

export const restaurantRoutes = [
  // Main
  <Route key="restaurant-dashboard" index element={<RestaurantDashboard />} />,

  // Orders
  <Route key="restaurant-orders" path="orders" element={<RestaurantOrders />} />,

  // Menu Management
  <Route key="restaurant-menu-manager" path="menu-manager" element={<RestaurantMenuManager />} />,
  <Route key="restaurant-menu-scheduler" path="menu-scheduler" element={<RestaurantMenuScheduler />} />,
  <Route key="restaurant-add-menu" path="menu/add" element={<RestaurantAddDish />} />,
  <Route key="restaurant-edit-menu" path="menu/edit/:id" element={<RestaurantEditDish />} />,
  // <Route key="restaurant-availability" path="menu/availability" element={<RestaurantAvailability />} />,

  // Customer Engagement
  <Route key="restaurant-reviews" path="reviews" element={<RestaurantReviews />} />,
  // <Route key="restaurant-chat" path="chat" element={<RestaurantChat />} />,
  // <Route key="restaurant-notifications" path="notifications" element={<RestaurantNotifications />} />,

  // Analytics
  <Route key="restaurant-analytics" path="analytics" element={<RestaurantAnalytics />} />,
  // <Route key="restaurant-heatmap" path="analytics/heatmap" element={<RestaurantHeatmap />} />,

  // Finance
  <Route key="restaurant-payouts" path="payouts" element={<RestaurantPayouts />} />,
  // <Route key="restaurant-invoices" path="payouts/invoices" element={<RestaurantInvoices />} />,

  // Profile & Settings
  <Route key="restaurant-profile" path="profile" element={<RestaurantProfile />} />,
  <Route key="restaurant-settings" path="settings" element={<RestaurantSettings />} />,
  // <Route key="restaurant-staff" path="staff" element={<RestaurantStaff />} />,

  // Support
  <Route key="restaurant-help" path="help" element={<RestaurantHelp />} />,
];
