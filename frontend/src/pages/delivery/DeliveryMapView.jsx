import React from "react";
import { FaMapMarkedAlt, FaLocationArrow } from "react-icons/fa";

const DeliveryMapView = () => {
  return (
    <div className="p-6 text-gray-800 dark:text-white">
      {/* Header */}
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <FaMapMarkedAlt className="text-primary text-xl" />
        Live Map & Route
      </h2>

      {/* Map Placeholder Container */}
      <div className="bg-white dark:bg-secondary rounded-xl shadow-md overflow-hidden h-[28rem] relative flex items-center justify-center text-gray-500 dark:text-gray-400">
        <div className="text-center px-6">
          <p className="text-lg font-semibold mb-2 text-gray-600 dark:text-gray-300">
            Map integration coming soon
          </p>
          <p className="text-sm">
            This area will show your real-time delivery route using Google Maps
            or Mapbox.
          </p>
        </div>

        {/* Simulated Button */}
        <button
          disabled
          className="absolute bottom-5 right-5 flex items-center gap-2 bg-primary text-white text-sm font-medium px-4 py-2 rounded-lg shadow-md cursor-not-allowed opacity-80"
        >
          <FaLocationArrow />
          Start Navigation
        </button>
      </div>
    </div>
  );
};

export default DeliveryMapView;
