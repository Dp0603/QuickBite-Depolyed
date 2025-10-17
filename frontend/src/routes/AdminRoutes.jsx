// routes/AdminRoutes.js
import React from "react";
import { Route } from "react-router-dom";

// Admin Pages
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminRestaurants from "../pages/admin/AdminRestaurants";
import AdminOrders from "../pages/admin/AdminOrders";
import AdminPayouts from "../pages/admin/AdminPayouts";
import AdminComplaints from "../pages/admin/AdminComplaints";
import AdminReviews from "../pages/admin/AdminReviews";
import AdminOffers from "../pages/admin/AdminOffers";
import AdminReports from "../pages/admin/AdminReports";
import AdminProfile from "../pages/admin/AdminProfile";
import AdminSettings from "../pages/admin/AdminSettings";
import AdminChangePassword from "../pages/admin/AdminChangePassword";

export const adminRoutes = (
  <>
    <Route index element={<AdminDashboard />} />
    <Route path="users" element={<AdminUsers />} />
    <Route path="restaurants" element={<AdminRestaurants />} />
    <Route path="orders" element={<AdminOrders />} />
    <Route path="payouts" element={<AdminPayouts />} />
    <Route path="complaints" element={<AdminComplaints />} />
    <Route path="reviews" element={<AdminReviews />} />
    <Route path="offers" element={<AdminOffers />} />
    <Route path="reports" element={<AdminReports />} />
    <Route path="profile" element={<AdminProfile />} />
    <Route path="settings" element={<AdminSettings />} />
    <Route path="change-password" element={<AdminChangePassword />} />
  </>
);
