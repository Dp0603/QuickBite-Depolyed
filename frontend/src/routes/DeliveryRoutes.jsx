import React from "react";
import { Route } from "react-router-dom";

import DeliveryDashboard from "../pages/delivery/DeliveryDashboard";
import DeliveryAssignedOrders from "../pages/delivery/DeliveryAssignedOrders";
import DeliveryMapView from "../pages/delivery/DeliveryMapView";
import DeliveryHistory from "../pages/delivery/DeliveryHistory";
import DeliverySettings from "../pages/delivery/DeliverySettings";
import DeliveryHelp from "../pages/delivery/DeliveryHelp";

export const deliveryRoutes = [
  // Main
  <Route key="delivery-dashboard" index element={<DeliveryDashboard />} />,
  <Route key="delivery-assigned" path="assigned" element={<DeliveryAssignedOrders />} />,
  <Route key="delivery-map" path="map" element={<DeliveryMapView />} />,
  <Route key="delivery-history" path="history" element={<DeliveryHistory />} />,

  // Account
  <Route key="delivery-settings" path="settings" element={<DeliverySettings />} />,

  // Extras
  <Route key="delivery-help" path="help" element={<DeliveryHelp />} />,
];
