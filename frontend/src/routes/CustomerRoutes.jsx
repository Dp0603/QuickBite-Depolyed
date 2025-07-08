import React from "react";
import { Route } from "react-router-dom";

import CustomerDashboard from "../pages/customer/CustomerDashboard";
import CustomerBrowseRestaurants from "../pages/customer/CustomerBrowseRestaurants";
import CustomerRestaurantMenu from "../pages/customer/CustomerRestaurantMenu";
import CustomerCart from "../pages/customer/CustomerCart";
import CustomerCheckout from "../pages/customer/CustomerCheckout";
import CustomerPaymentSuccess from "../pages/customer/CustomerPaymentSuccess";
import CustomerOrders from "../pages/customer/CustomerOrders";
import CustomerTrackOrder from "../pages/customer/CustomerTrackOrder";
import CustomerProfile from "../pages/customer/CustomerProfile";
import CustomerAddressBook from "../pages/customer/CustomerAddressBook";
import CustomerSettings from "../pages/customer/CustomerSetting";
import CustomerFavorites from "../pages/customer/CustomerFavorites";
import CustomerPremium from "../pages/customer/CustomerPremium";
import CustomerOffers from "../pages/customer/CustomerOffers";
import CustomerReviews from "../pages/customer/CustomerReviews";
import CustomerHelp from "../pages/customer/CustomerHelp";

export const customerRoutes = [
  // Main
  <Route key="customer-dashboard" index element={<CustomerDashboard />} />,
  <Route key="customer-browse" path="browse" element={<CustomerBrowseRestaurants />} />,
  <Route key="customer-restaurant-menu" path="restaurant/:id" element={<CustomerRestaurantMenu />} />,
  <Route key="customer-cart" path="cart" element={<CustomerCart />} />,
  <Route key="customer-checkout" path="checkout" element={<CustomerCheckout />} />,
  <Route key="customer-payment-success" path="payment-success" element={<CustomerPaymentSuccess />} />,
  <Route key="customer-orders" path="orders" element={<CustomerOrders />} />,
  <Route key="customer-track-order" path="track-order/:orderId" element={<CustomerTrackOrder />} />,

  // Account
  <Route key="customer-profile" path="profile" element={<CustomerProfile />} />,
  <Route key="customer-addresses" path="addresses" element={<CustomerAddressBook />} />,
  <Route key="customer-settings" path="settings" element={<CustomerSettings />} />,

  // Extras
  <Route key="customer-favorites" path="favorites" element={<CustomerFavorites />} />,
  <Route key="customer-premium" path="premium" element={<CustomerPremium />} />,
  <Route key="customer-offers" path="offers" element={<CustomerOffers />} />,
  <Route key="customer-reviews" path="reviews" element={<CustomerReviews />} />,
  <Route key="customer-help" path="help" element={<CustomerHelp />} />,
];
