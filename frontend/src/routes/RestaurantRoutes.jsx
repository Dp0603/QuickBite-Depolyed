import React from "react";
import { Route } from "react-router-dom";
import RestaurantDashboard from "../pages/restaurant/RestaurantDashboard";
import RestaurantMenuManager from "../pages/restaurant/RestaurantMenuManager";
import RestaurantOrders from "../pages/restaurant/RestaurantOrders";
import RestaurantAddDish from "../pages/restaurant/RestaurantAddDish";
import RestaurantProfile from "../pages/restaurant/RestaurantProfile";

export const restaurantRoutes = [
  <Route key="restaurant-dashboard" path="/restaurant" element={<RestaurantDashboard />} />,
  <Route key="restaurant-menu" path="/restaurant/menu" element={<RestaurantMenuManager />} />,
  <Route key="restaurant-orders" path="/restaurant/orders" element={<RestaurantOrders />} />,
  <Route key="restaurant-add-dish" path="/restaurant/add-dish" element={<RestaurantAddDish />} />,
  <Route key="restaurant-profile" path="/restaurant/profile" element={<RestaurantProfile />} />,
];