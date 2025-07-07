import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "../src/pages/admin/AdminDashboard";
import CustomerDashboard from "../src/pages/customer/CustomerDashboard";
import RestaurantDashboard from "../src/pages/restaurant/RestaurantDashboard";
import DeliveryDashboard from "../src/pages/delivery/DeliveryDashboard";
import { adminRoutes } from "./routes/AdminRoutes";
import { restaurantRoutes } from "./routes/RestaurantRoutes";
import { customerRoutes } from "./routes/CustomerRoutes";
import CustomerLayout from "./layouts/CustomerLayout";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/restaurant" element={<RestaurantDashboard />} />
      <Route path="/delivery" element={<DeliveryDashboard />} />
      {adminRoutes}
      {restaurantRoutes}
      <Route path="/customer" element={<CustomerLayout />}>
        {customerRoutes}
      </Route>
    </Routes>
  );
}

export default App;
