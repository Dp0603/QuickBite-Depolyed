import React from "react";
import { Route } from "react-router-dom";

// Updated imports (only needed files)
import RestaurantDashboard from "../pages/restaurant/RestaurantDashboard";
import RestaurantOrders from "../pages/restaurant/RestaurantOrders";
import RestaurantMenuManager from "../pages/restaurant/RestaurantMenuManager";
import RestaurantMenuScheduler from "../pages/restaurant/RestaurantMenuScheduler";
import RestaurantAvailabilityToggle from "../pages/restaurant/RestaurantAvailabilityToggle";
import RestaurantOffersManager from "../pages/restaurant/RestaurantOffersManager";
import RestaurantDeliveryStatus from "../pages/restaurant/RestaurantDeliveryStatus";
import RestaurantReviews from "../pages/restaurant/RestaurantReviews";
import RestaurantAnalytics from "../pages/restaurant/RestaurantAnalytics";
import RestaurantPayouts from "../pages/restaurant/RestaurantPayouts";
import RestaurantChatInbox from "../pages/restaurant/RestaurantChatInbox";
import RestaurantProfile from "../pages/restaurant/RestaurantProfile";
import RestaurantSettings from "../pages/restaurant/RestaurantSettings";
import RestaurantHelp from "../pages/restaurant/RestaurantHelp";

export const restaurantRoutes = [
  <Route key="restaurant-dashboard" index element={<RestaurantDashboard />} />,
  <Route key="restaurant-orders" path="orders" element={<RestaurantOrders />} />,
  <Route key="restaurant-menu-manager" path="menu-manager" element={<RestaurantMenuManager />} />,
  <Route key="restaurant-menu-scheduler" path="menu-scheduler" element={<RestaurantMenuScheduler />} />,
  <Route key="restaurant-availability" path="availability-toggle" element={<RestaurantAvailabilityToggle />} />,
  <Route key="restaurant-offers" path="offers-manager" element={<RestaurantOffersManager />} />,
  <Route key="restaurant-delivery-status" path="delivery-status" element={<RestaurantDeliveryStatus />} />,
  <Route key="restaurant-reviews" path="reviews" element={<RestaurantReviews />} />,
  <Route key="restaurant-analytics" path="analytics" element={<RestaurantAnalytics />} />,
  <Route key="restaurant-payouts" path="payouts" element={<RestaurantPayouts />} />,
  <Route key="restaurant-chat-inbox" path="chat-inbox" element={<RestaurantChatInbox />} />,
  <Route key="restaurant-profile" path="profile" element={<RestaurantProfile />} />,
  <Route key="restaurant-settings" path="settings" element={<RestaurantSettings />} />,
  <Route key="restaurant-help" path="help" element={<RestaurantHelp />} />,
];
