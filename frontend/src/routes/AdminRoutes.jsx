// AdminRoutes.jsx
import React from "react";
import { Route } from "react-router-dom";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminManageUsers from "../pages/admin/AdminManageUsers";
import AdminManageRestaurants from "../pages/admin/AdminManageRestaurants";
import AdminSiteAnalytics from "../pages/admin/AdminSiteAnalytics";
import AdminViewReports from "../pages/admin/AdminViewReports";

export const adminRoutes = [
  <Route key="admin" path="/admin" element={<AdminDashboard />} />,
  <Route
    key="admin-users"
    path="/admin/users"
    element={<AdminManageUsers />}
  />,
  <Route
    key="admin-restaurants"
    path="/admin/restaurants"
    element={<AdminManageRestaurants />}
  />,
  <Route
    key="admin-analytics"
    path="/admin/analytics"
    element={<AdminSiteAnalytics />}
  />,
  <Route
    key="admin-reports"
    path="/admin/reports"
    element={<AdminViewReports />}
  />,
];
