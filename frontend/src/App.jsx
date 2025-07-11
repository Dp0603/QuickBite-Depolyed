import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import AdminLayout from "./layouts/AdminLayout";
import CustomerLayout from "./layouts/CustomerLayout";
import RestaurantLayout from "./layouts/RestaurantLayout";
import DeliveryLayout from "./layouts/DeliveryLayout";
import { adminRoutes } from "./routes/AdminRoutes";
import { restaurantRoutes } from "./routes/RestaurantRoutes";
import { customerRoutes } from "./routes/CustomerRoutes";
import { deliveryRoutes } from "./routes/DeliveryRoutes";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ✅ Admin Routes with layout */}
      <Route path="/admin" element={<AdminLayout />}>
        {adminRoutes}
      </Route>

      {/* ✅ Delivery Routes with layout */}
      <Route path="/delivery" element={<DeliveryLayout />}>
        {deliveryRoutes}
      </Route>

      {/* ✅ Customer Routes with layout */}
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
