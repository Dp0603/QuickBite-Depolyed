import React from "react";
import { Route } from "react-router-dom";

import CustomerDashboard from "../pages/customer/CustomerDashboard";
import CustomerBrowseRestaurants from "../pages/customer/CustomerBrowseRestaurants";
import CustomerRestaurantMenu from "../pages/customer/CustomerRestaurantMenu";
import CustomerCart from "../pages/customer/CustomerCart";
import CustomerCheckout from "../pages/customer/CustomerCheckout";
import CustomerPaymentSuccess from "../pages/customer/CustomerPaymentSuccess";
import CustomerPaymentFailure from "../pages/customer/CustomerPaymentFailure";
import CustomerOrders from "../pages/customer/CustomerOrders";
import CustomerTrackOrder from "../pages/customer/CustomerTrackOrder";
import CustomerOrderDetails from "../pages/customer/CustomerOrderDetails";
import CustomerProfile from "../pages/customer/CustomerProfile";
import CustomerAddressBook from "../pages/customer/CustomerAddressBook";
import CustomerSettings from "../pages/customer/CustomerSetting";
import ChangePassword from "../pages/ChangePassword";
import CustomerFavorites from "../pages/customer/CustomerFavorites";
import CustomerPremium from "../pages/customer/CustomerPremium";
import CustomerOffers from "../pages/customer/CustomerOffers";
import CustomerReviews from "../pages/customer/CustomerReviews";
import CustomerHelp from "../pages/customer/CustomerHelp";
import CustomerLeaveReview from "../pages/customer/CustomerLeaveReview";


export const customerRoutes = [
  // Main
  <Route key="customer-dashboard" index element={<CustomerDashboard />} />,
  <Route key="customer-browse" path="browse" element={<CustomerBrowseRestaurants />} />,
  <Route key="customer-restaurant-menu" path="menu/restaurant/:id" element={<CustomerRestaurantMenu />} />,
  <Route key="customer-cart" path="cart" element={<CustomerCart />} />,
  <Route key="customer-checkout" path="checkout" element={<CustomerCheckout />} />,
  <Route key="customer-payment-success" path="payment-success" element={<CustomerPaymentSuccess />} />,
  <Route key="customer-payment-failure" path="payment-failure" element={<CustomerPaymentFailure />} />,
  <Route key="customer-orders" path="orders" element={<CustomerOrders />} />,
  <Route key="customer-track-order" path="track-order/:orderId" element={<CustomerTrackOrder />} />,
  <Route key="customer-order-details" path="order-details/:orderId" element={<CustomerOrderDetails />} />,

  // Account
  <Route key="customer-profile" path="profile" element={<CustomerProfile />} />,
  <Route key="customer-addresses" path="addresses" element={<CustomerAddressBook />} />,
  <Route key="customer-settings" path="settings" element={<CustomerSettings />} />,
  <Route key="customer-change-password" path="change-password" element={<ChangePassword />} />,
  
  // Extras
  <Route key="customer-favorites" path="favorites" element={<CustomerFavorites />} />,
  <Route key="customer-premium" path="premium" element={<CustomerPremium />} />,
  <Route key="customer-offers" path="offers" element={<CustomerOffers />} />,
  <Route key="customer-reviews" path="reviews" element={<CustomerReviews />} />,
  <Route key="customer-leave-review" path="review/:orderId" element={<CustomerLeaveReview />} />,
  <Route key="customer-help" path="help" element={<CustomerHelp />} />,
];
