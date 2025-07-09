import React, { useState } from "react";
import { FaPowerOff, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const RestaurantAvailabilityToggle = () => {
  const [isOnline, setIsOnline] = useState(true);

  const handleToggle = () => setIsOnline((prev) => !prev);

  return (
    <div className="bg-white dark:bg-gray-900 shadow-lg rounded-xl p-6 w-full max-w-md mx-auto text-gray-800 dark:text-white">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <FaPowerOff className="text-orange-500" />
        Restaurant Availability
      </h2>

      <div className="flex items-center justify-between mb-6">
        <div className="text-sm">
          <p className="text-gray-600 dark:text-gray-400">Current Status:</p>
          <div className="flex items-center gap-2 mt-1">
            {isOnline ? (
              <FaCheckCircle className="text-green-500 text-lg" />
            ) : (
              <FaTimesCircle className="text-red-500 text-lg" />
            )}
            <span
              className={`font-semibold px-3 py-1 rounded-full text-sm ${
                isOnline
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {isOnline ? "Online - Accepting Orders" : "Offline"}
            </span>
          </div>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={handleToggle}
          className={`px-6 py-2 text-sm font-semibold rounded-lg shadow-sm transition duration-200 ${
            isOnline
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-green-500 hover:bg-green-600 text-white"
          }`}
        >
          {isOnline ? "Switch to Offline Mode" : "Switch to Online Mode"}
        </button>
      </div>
    </div>
  );
};

export default RestaurantAvailabilityToggle;
