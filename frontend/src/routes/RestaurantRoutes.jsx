// src/routes/RestaurantRoutes.jsx
import React from "react";
import { Route } from "react-router-dom";

import RestaurantDashboard from "../pages/restaurant/RestaurantDashboard";
import RestaurantOrders from "../pages/restaurant/RestaurantOrders";
import RestaurantMenuManager from "../pages/restaurant/RestaurantMenuManager";
// import RestaurantAddMenu from "../pages/restaurant/RestaurantAddMenu";
// import RestaurantEditMenu from "../pages/restaurant/RestaurantEditMenu";
import RestaurantMenuScheduler from "../pages/restaurant/RestaurantMenuScheduler";
// import RestaurantAvailability from "../pages/restaurant/RestaurantAvailability";
// import RestaurantOffers from "../pages/restaurant/RestaurantOffers";
// import RestaurantLoyaltyProgram from "../pages/restaurant/RestaurantLoyaltyProgram";
// import RestaurantDeliveryStatus from "../pages/restaurant/RestaurantDeliveryStatus";
// import RestaurantDeliverySettings from "../pages/restaurant/RestaurantDeliverySettings";
import RestaurantReviews from "../pages/restaurant/RestaurantReviews";
// import RestaurantChat from "../pages/restaurant/RestaurantChat";
// import RestaurantNotifications from "../pages/restaurant/RestaurantNotifications";
import RestaurantAnalytics from "../pages/restaurant/RestaurantAnalytics";
// import RestaurantHeatmap from "../pages/restaurant/RestaurantHeatmap";
import RestaurantPayouts from "../pages/restaurant/RestaurantPayouts";
// import RestaurantInvoices from "../pages/restaurant/RestaurantInvoices";
import RestaurantProfile from "../pages/restaurant/RestaurantProfile";
// import RestaurantStaff from "../pages/restaurant/RestaurantStaff";
import RestaurantSettings from "../pages/restaurant/RestaurantSettings";
import RestaurantHelp from "../pages/restaurant/RestaurantHelp";

export const restaurantRoutes = [
  // Main
  <Route key="restaurant-dashboard" index element={<RestaurantDashboard />} />,

  // Orders
  <Route key="restaurant-orders" path="orders" element={<RestaurantOrders />} />,

  // Menu Management
  <Route key="restaurant-menu-manager" path="menu-manager" element={<RestaurantMenuManager />} />,
  // <Route key="restaurant-add-menu" path="menu/add" element={<RestaurantAddMenu />} />,
  // <Route key="restaurant-edit-menu" path="menu/edit/:id" element={<RestaurantEditMenu />} />,
  <Route key="restaurant-menu-scheduler" path="menu-scheduler" element={<RestaurantMenuScheduler />} />,
  // <Route key="restaurant-availability" path="availability" element={<RestaurantAvailability />} />,

  // Offers & Promotions
  // <Route key="restaurant-offers" path="offers" element={<RestaurantOffers />} />,
  // <Route key="restaurant-loyalty" path="loyalty-program" element={<RestaurantLoyaltyProgram />} />,

  // Delivery Management
  // <Route key="restaurant-delivery-status" path="delivery-status" element={<RestaurantDeliveryStatus />} />,
  // <Route key="restaurant-delivery-settings" path="delivery-settings" element={<RestaurantDeliverySettings />} />,

  // Customer Engagement
  <Route key="restaurant-reviews" path="reviews" element={<RestaurantReviews />} />,
  // <Route key="restaurant-chat" path="chat" element={<RestaurantChat />} />,
  // <Route key="restaurant-notifications" path="notifications" element={<RestaurantNotifications />} />,

  // Analytics
  <Route key="restaurant-analytics" path="analytics" element={<RestaurantAnalytics />} />,
  // <Route key="restaurant-heatmap" path="heatmap" element={<RestaurantHeatmap />} />,

  // Finance
  <Route key="restaurant-payouts" path="payouts" element={<RestaurantPayouts />} />,
  // <Route key="restaurant-invoices" path="invoices" element={<RestaurantInvoices />} />,

  // Profile & Settings
  <Route key="restaurant-profile" path="profile" element={<RestaurantProfile />} />,
  // <Route key="restaurant-staff" path="staff" element={<RestaurantStaff />} />,
  <Route key="restaurant-settings" path="settings" element={<RestaurantSettings />} />,

  // Support
  <Route key="restaurant-help" path="help" element={<RestaurantHelp />} />,
];
