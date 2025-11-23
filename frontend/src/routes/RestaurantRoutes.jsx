// src/routes/RestaurantRoutes.jsx
import React from "react";
import { Route } from "react-router-dom";

// Main
import RestaurantDashboard from "../pages/restaurant/RestaurantDashboard";

// Orders
import RestaurantOrders from "../pages/restaurant/RestaurantOrders";
import RestaurantOrderDetails from "../pages/restaurant/RestaurantOrderDetails";

// Menu Management
import RestaurantMenuManager from "../pages/restaurant/RestaurantMenuManager";
import RestaurantMenuScheduler from "../pages/restaurant/RestaurantMenuScheduler";
import RestaurantAddDish from "../pages/restaurant/RestaurantAddDish";
import RestaurantEditDish from "../pages/restaurant/RestaurantEditDish";
import RestaurantAvailabilityToggle from "../pages/restaurant/RestaurantAvailabilityToggle";

// Customer Engagement
import RestaurantReviews from "../pages/restaurant/RestaurantReviews";
import RestaurantChatInbox from "../pages/restaurant/RestaurantChatInbox";
// Optional extras (uncomment when ready)
// import RestaurantChat from "../pages/restaurant/RestaurantChat";
// import RestaurantNotifications from "../pages/restaurant/RestaurantNotifications";

// Analytics
import RestaurantAnalytics from "../pages/restaurant/RestaurantAnalytics";
import RestaurantHeatmap from "../pages/restaurant/RestaurantHeatmap";
import RestaurantSalesTrends from "../pages/restaurant/RestaurantSalesTrends";
import RestaurantCustomers from "../pages/restaurant/RestaurantCustomers";

// Finance
import RestaurantPayouts from "../pages/restaurant/RestaurantPayouts";
// import RestaurantInvoices from "../pages/restaurant/RestaurantInvoices";

// Profile & Settings
import RestaurantProfile from "../pages/restaurant/RestaurantProfile";
import RestaurantSettings from "../pages/restaurant/RestaurantSettings";
import RestaurantStaff from "../pages/restaurant/RestaurantStaff";

// Support
import RestaurantHelp from "../pages/restaurant/RestaurantHelp";

// Delivery
import RestaurantDelivery from "../pages/restaurant/RestaurantDelivery";
// import RestaurantDeliveryStatus from "../pages/restaurant/RestaurantDeliveryStatus";
// import RestaurantDeliverySettings from "../pages/restaurant/RestaurantDeliverySettings";

// Offers
import RestaurantOffersManager from "../pages/restaurant/RestaurantOffersManager";

export const restaurantRoutes = (isOwnerMode) => [
  // Main
  <Route key="restaurant-dashboard" index element={<RestaurantDashboard />} />,

  // Orders
  <Route
    key="restaurant-orders"
    path="orders"
    element={<RestaurantOrders />}
  />,
  <Route
    key="restaurant-order-details"
    path="orders/:orderId"
    element={<RestaurantOrderDetails />}
  />,

  // Menu Management
  <Route
    key="restaurant-menu-manager"
    path="menu-manager"
    element={<RestaurantMenuManager />}
  />,
  <Route
    key="restaurant-menu-scheduler"
    path="menu-scheduler"
    element={<RestaurantMenuScheduler />}
  />,
  <Route
    key="restaurant-add-menu"
    path="menu/add"
    element={<RestaurantAddDish />}
  />,
  <Route
    key="restaurant-edit-menu"
    path="menu/edit/:id"
    element={<RestaurantEditDish />}
  />,
  <Route
    key="restaurant-availability-toggle"
    path="availability-toggle"
    element={<RestaurantAvailabilityToggle />}
  />,

  // Customer Engagement
  <Route
    key="restaurant-reviews"
    path="reviews"
    element={<RestaurantReviews />}
  />,
  <Route
    key="restaurant-chat-inbox"
    path="chat-inbox"
    element={<RestaurantChatInbox />}
  />,
  // Optional extras (uncomment when ready)
  // <Route key="restaurant-chat" path="chat" element={<RestaurantChat />} />,
  // <Route key="restaurant-notifications" path="notifications" element={<RestaurantNotifications />} />,

  // Analytics
  <Route
    key="restaurant-analytics"
    path="analytics"
    element={<RestaurantAnalytics />}
  />,
  <Route
    key="restaurant-heatmap"
    path="analytics/heatmap"
    element={<RestaurantHeatmap />}
  />,
  <Route
    key="restaurant-sales-trends"
    path="analytics/sales"
    element={<RestaurantSalesTrends />}
  />,
  <Route
    key="restaurant-customers"
    path="analytics/customers"
    element={<RestaurantCustomers />}
  />,

  // Finance (owner only)
  ...(isOwnerMode
    ? [
        <Route
          key="restaurant-payouts"
          path="payouts"
          element={<RestaurantPayouts />}
        />,
        // <Route key="restaurant-invoices" path="payouts/invoices" element={<RestaurantInvoices />} />,
      ]
    : []),

  // Offers
  <Route
    key="restaurant-offers"
    path="offers-manager"
    element={<RestaurantOffersManager />}
  />,

  // Delivery

  <Route
    key="restaurant-delivery"
    path="delivery"
    element={<RestaurantDelivery />}
  />,

  // <Route
  //   key="restaurant-delivery"
  //   path="delivery-status"
  //   element={<RestaurantDeliveryStatus />}
  // />,

  // <Route
  //   key="restaurant-delivery-settings"
  //   path="delivery-settings"
  //   element={<RestaurantDeliverySettings />}
  // />,

  // Profile & Settings
  <Route
    key="restaurant-profile"
    path="profile"
    element={<RestaurantProfile />}
  />,
  ...(isOwnerMode
    ? [
        <Route
          key="restaurant-settings"
          path="settings"
          element={<RestaurantSettings />}
        />,
        <Route
          key="restaurant-staff"
          path="staff"
          element={<RestaurantStaff />}
        />,
      ]
    : []),

  // Support
  <Route key="restaurant-help" path="help" element={<RestaurantHelp />} />,
];

// src/routes/RestaurantRoutes.jsx
// import React from "react";
// import { Route } from "react-router-dom";

// // Pages
// import RestaurantDashboard from "../pages/restaurant/RestaurantDashboard";
// import RestaurantOrders from "../pages/restaurant/RestaurantOrders";
// import RestaurantOrderDetails from "../pages/restaurant/RestaurantOrderDetails";
// import RestaurantMenuManager from "../pages/restaurant/RestaurantMenuManager";
// import RestaurantMenuScheduler from "../pages/restaurant/RestaurantMenuScheduler";
// import RestaurantAddDish from "../pages/restaurant/RestaurantAddDish";
// import RestaurantEditDish from "../pages/restaurant/RestaurantEditDish";
// import RestaurantAvailabilityToggle from "../pages/restaurant/RestaurantAvailabilityToggle";
// import RestaurantReviews from "../pages/restaurant/RestaurantReviews";
// import RestaurantChatInbox from "../pages/restaurant/RestaurantChatInbox";
// import RestaurantAnalytics from "../pages/restaurant/RestaurantAnalytics";
// import RestaurantHeatmap from "../pages/restaurant/RestaurantHeatmap";
// import RestaurantSalesTrends from "../pages/restaurant/RestaurantSalesTrends";
// import RestaurantCustomers from "../pages/restaurant/RestaurantCustomers";
// import RestaurantPayouts from "../pages/restaurant/RestaurantPayouts";
// import RestaurantOffersManager from "../pages/restaurant/RestaurantOffersManager";
// import RestaurantDeliveryStatus from "../pages/restaurant/RestaurantDeliveryStatus";
// import RestaurantProfile from "../pages/restaurant/RestaurantProfile";
// import RestaurantSettings from "../pages/restaurant/RestaurantSettings";
// import RestaurantStaff from "../pages/restaurant/RestaurantStaff";
// import RestaurantHelp from "../pages/restaurant/RestaurantHelp";

// // ---------------- Staff Roles ----------------
// export const STAFF_ROUTE_ACCESS = {
//   owner: [
//     "dashboard",
//     "orders",
//     "order-details",
//     "menu-manager",
//     "menu-scheduler",
//     "add-dish",
//     "edit-dish",
//     "availability-toggle",
//     "reviews",
//     "chat-inbox",
//     "analytics",
//     "heatmap",
//     "sales-trends",
//     "customers",
//     "payouts",
//     "offers-manager",
//     "delivery-status",
//     "profile",
//     "settings",
//     "staff",
//     "help",
//   ],
//   manager: [
//     "dashboard",
//     "orders",
//     "order-details",
//     "menu-manager",
//     "menu-scheduler",
//     "add-dish",
//     "edit-dish",
//     "availability-toggle",
//     "reviews",
//     "chat-inbox",
//     "analytics",
//     "heatmap",
//     "sales-trends",
//     "customers",
//     "offers-manager",
//     "delivery-status",
//     "profile",
//     "help",
//   ],
//   chef: [
//     "orders",
//     "order-details",
//     "menu-manager",
//     "menu-scheduler",
//     "add-dish",
//     "edit-dish",
//     "availability-toggle",
//     "analytics",
//     "customers",
//     "help",
//   ],
//   cashier: [
//     "orders",
//     "order-details",
//     "reviews",
//     "chat-inbox",
//     "delivery-status",
//     "help",
//   ],
//   delivery: [
//     "delivery-status",
//     "help",
//   ],
// };

// // ---------------- Generate Routes Dynamically ----------------
// export const restaurantRoutes = (staffRole = "owner") => {
//   const access = STAFF_ROUTE_ACCESS[staffRole] || [];

//   const allRoutes = [
//     { key: "dashboard", path: "", element: <RestaurantDashboard /> },
//     { key: "orders", path: "orders", element: <RestaurantOrders /> },
//     { key: "order-details", path: "orders/:orderId", element: <RestaurantOrderDetails /> },
//     { key: "menu-manager", path: "menu-manager", element: <RestaurantMenuManager /> },
//     { key: "menu-scheduler", path: "menu-scheduler", element: <RestaurantMenuScheduler /> },
//     { key: "add-dish", path: "menu/add", element: <RestaurantAddDish /> },
//     { key: "edit-dish", path: "menu/edit/:id", element: <RestaurantEditDish /> },
//     { key: "availability-toggle", path: "availability-toggle", element: <RestaurantAvailabilityToggle /> },
//     { key: "reviews", path: "reviews", element: <RestaurantReviews /> },
//     { key: "chat-inbox", path: "chat-inbox", element: <RestaurantChatInbox /> },
//     { key: "analytics", path: "analytics", element: <RestaurantAnalytics /> },
//     { key: "heatmap", path: "analytics/heatmap", element: <RestaurantHeatmap /> },
//     { key: "sales-trends", path: "analytics/sales", element: <RestaurantSalesTrends /> },
//     { key: "customers", path: "analytics/customers", element: <RestaurantCustomers /> },
//     { key: "payouts", path: "payouts", element: <RestaurantPayouts /> },
//     { key: "offers-manager", path: "offers-manager", element: <RestaurantOffersManager /> },
//     { key: "delivery-status", path: "delivery-status", element: <RestaurantDeliveryStatus /> },
//     { key: "profile", path: "profile", element: <RestaurantProfile /> },
//     { key: "settings", path: "settings", element: <RestaurantSettings /> },
//     { key: "staff", path: "staff", element: <RestaurantStaff /> },
//     { key: "help", path: "help", element: <RestaurantHelp /> },
//   ];

//   return allRoutes
//     .filter(route => access.includes(route.key))
//     .map(route => <Route key={route.key} path={route.path} element={route.element} />);
// };
