// src/pages/restaurant/RestaurantDelivery.jsx
import React, { useState } from "react";
import { FaCog, FaMotorcycle } from "react-icons/fa";
import RestaurantDeliverySettings from "./RestaurantDeliverySettings";
import RestaurantDeliveryStatus from "./RestaurantDeliveryStatus";

const RestaurantDelivery = () => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="p-6 text-gray-800 dark:text-white">
      {/* Page Title */}
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <FaMotorcycle className="text-orange-500" />
        Delivery Management
      </h1>

      {/* Status Section - always visible */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">📡 Live Status</h2>
        <RestaurantDeliveryStatus />
      </section>

      {/* Toggle Settings */}
      <div className="mb-6">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg shadow transition"
        >
          <FaCog />
          {showSettings
            ? "Hide Delivery Settings"
            : "Configure Delivery Settings"}
        </button>
      </div>

      {/* Settings Section - toggled */}
      {showSettings && (
        <section>
          <RestaurantDeliverySettings />
        </section>
      )}
    </div>
  );
};

export default RestaurantDelivery;
