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
import CustomerOffers from "../pages/customer/CustomerOffers";
import CustomerReviews from "../pages/customer/CustomerReviews";
import CustomerHelp from "../pages/customer/CustomerHelp";

export const customerRoutes = [
  <Route key="customer-dashboard" path="/customer" element={<CustomerDashboard />} />,
  <Route key="customer-browse" path="/customer/browse" element={<CustomerBrowseRestaurants />} />,
  <Route key="customer-restaurant-menu" path="/customer/restaurant/:id" element={<CustomerRestaurantMenu />} />,
  <Route key="customer-cart" path="/customer/cart" element={<CustomerCart />} />,
  <Route key="customer-checkout" path="/customer/checkout" element={<CustomerCheckout />} />,
  <Route key="customer-payment-success" path="/customer/payment-success" element={<CustomerPaymentSuccess />} />,
  <Route key="customer-orders" path="/customer/orders" element={<CustomerOrders />} />,
  <Route key="customer-track-order" path="/customer/track-order/:orderId" element={<CustomerTrackOrder />} />,
  <Route key="customer-profile" path="/customer/profile" element={<CustomerProfile />} />,
  <Route key="customer-addresses" path="/customer/addresses" element={<CustomerAddressBook />} />,
  <Route key="customer-offers" path="/customer/offers" element={<CustomerOffers />} />,
  <Route key="customer-reviews" path="/customer/reviews" element={<CustomerReviews />} />,
  <Route key="customer-help" path="/customer/help" element={<CustomerHelp />} />,
];
