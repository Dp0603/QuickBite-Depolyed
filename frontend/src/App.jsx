//Private routed
import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";

import AdminLayout from "./layouts/AdminLayout";
import CustomerLayout from "./layouts/CustomerLayout";
import RestaurantLayout from "./layouts/RestaurantLayout";
import DeliveryLayout from "./layouts/DeliveryLayout";

import { adminRoutes } from "./routes/AdminRoutes";
import { restaurantRoutes } from "./routes/RestaurantRoutes";
import { customerRoutes } from "./routes/CustomerRoutes";
import { deliveryRoutes } from "./routes/DeliveryRoutes";

import PrivateRoute from "./routes/PrivateRoute";

function App() {
  return (
    <Routes>
      {/* 🌐 Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email/:token" element={<VerifyEmail />} />
      <Route path="/unauthorized" element={<Unauthorized />} />{" "}
      {/* ⛔ Unauthorized */}
      {/* 🔐 Admin Routes - Only accessible to 'admin' */}
      <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
        <Route path="/admin" element={<AdminLayout />}>
          {adminRoutes}
        </Route>
      </Route>
      {/* 🔐 Customer Routes - Only accessible to 'customer' */}
      <Route element={<PrivateRoute allowedRoles={["customer"]} />}>
        <Route path="/customer" element={<CustomerLayout />}>
          {customerRoutes}
        </Route>
      </Route>
      {/* 🔐 Restaurant Routes - Only accessible to 'restaurant' */}
      <Route element={<PrivateRoute allowedRoles={["restaurant"]} />}>
        <Route path="/restaurant" element={<RestaurantLayout />}>
          {restaurantRoutes}
        </Route>
      </Route>
      {/* 🔐 Delivery Routes - Only accessible to 'delivery' */}
      <Route element={<PrivateRoute allowedRoles={["delivery"]} />}>
        <Route path="/delivery" element={<DeliveryLayout />}>
          {deliveryRoutes}
        </Route>
      </Route>
      {/* ⚠️ Catch-All: 404 Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;

//Open Routes for testing purposes

// import React from "react";
// import { Routes, Route } from "react-router-dom";

// import Home from "./pages/Home";
// import Login from "./pages/Login";
// import Register from "./pages/Register";

// import AdminLayout from "./layouts/AdminLayout";
// import CustomerLayout from "./layouts/CustomerLayout";
// import RestaurantLayout from "./layouts/RestaurantLayout";
// import DeliveryLayout from "./layouts/DeliveryLayout";
// import { adminRoutes } from "./routes/AdminRoutes";
// import { restaurantRoutes } from "./routes/RestaurantRoutes";
// import { customerRoutes } from "./routes/CustomerRoutes";
// import { deliveryRoutes } from "./routes/DeliveryRoutes";

// function App() {
//   return (
//     <Routes>
//       {/* Public Routes */}
//       <Route path="/" element={<Home />} />
//       <Route path="/login" element={<Login />} />
//       <Route path="/register" element={<Register />} />

//       {/* ✅ Admin Routes with layout */}
//       <Route path="/admin" element={<AdminLayout />}>
//         {adminRoutes}
//       </Route>

//       {/* ✅ Delivery Routes with layout */}
//       <Route path="/delivery" element={<DeliveryLayout />}>
//         {deliveryRoutes}
//       </Route>

//       {/* ✅ Customer Routes with layout */}
//       <Route path="/customer" element={<CustomerLayout />}>
//         {customerRoutes}
//       </Route>

//       {/* ✅ Restaurant Routes with layout */}
//       <Route path="/restaurant" element={<RestaurantLayout />}>
//         {restaurantRoutes}
//       </Route>
//     </Routes>
//   );
// }

// export default App;
