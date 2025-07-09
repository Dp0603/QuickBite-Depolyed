import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import AdminDashboard from "./pages/admin/AdminDashboard";
import DeliveryDashboard from "./pages/delivery/DeliveryDashboard";

import CustomerLayout from "./layouts/CustomerLayout";
import RestaurantLayout from "./layouts/RestaurantLayout"; // ✅ New layout
import { adminRoutes } from "./routes/AdminRoutes";
import { restaurantRoutes } from "./routes/RestaurantRoutes";
import { customerRoutes } from "./routes/CustomerRoutes";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Admin Route */}
      <Route path="/admin" element={<AdminDashboard />} />
      {adminRoutes}

      {/* Delivery Route */}
      <Route path="/delivery" element={<DeliveryDashboard />} />

      {/* Customer Routes with layout */}
      <Route path="/customer" element={<CustomerLayout />}>
        {customerRoutes}
      </Route>

      {/* ✅ Restaurant Routes with layout */}
      <Route path="/restaurant" element={<RestaurantLayout />}>
        {restaurantRoutes}
      </Route>
    </Routes>
  );
}

export default App;
