import React, { useState } from "react";
import { FaUser, FaEnvelope, FaPhone, FaTruck } from "react-icons/fa";

const DeliverySettings = () => {
  const [isOnline, setIsOnline] = useState(true);

  const profile = {
    name: "Ravi Kumar",
    email: "ravi.delivery@quickbite.com",
    phone: "+91 9876543210",
    agentId: "AGT2041",
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-white px-6 py-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <FaTruck className="text-primary" />
        Delivery Agent Settings
      </h2>

      {/* Availability Toggle */}
      <div className="bg-white dark:bg-secondary rounded-xl shadow p-6 mb-8 w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="text-lg font-semibold mb-1">Availability</h3>
            <p className="text-sm text-gray-500 dark:text-gray-300">
              Toggle your status to appear online or offline for delivery
              assignments.
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isOnline}
              onChange={() => setIsOnline(!isOnline)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer dark:bg-gray-600 peer-checked:bg-green-500 transition-colors" />
            <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-5" />
            <span className="ml-3 text-sm font-medium">
              {isOnline ? "Online" : "Offline"}
            </span>
          </label>
        </div>
      </div>

      {/* Profile Info */}
      <div className="bg-white dark:bg-secondary rounded-xl shadow p-6 w-full space-y-4">
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <FaUser className="text-primary" />
          Agent Profile
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-200">
          <p>
            <span className="font-semibold">Name:</span> {profile.name}
          </p>
          <p className="flex items-center gap-2">
            <FaEnvelope className="text-gray-400" />
            {profile.email}
          </p>
          <p className="flex items-center gap-2">
            <FaPhone className="text-gray-400" />
            {profile.phone}
          </p>
          <p>
            <span className="font-semibold">Agent ID:</span> #{profile.agentId}
          </p>
        </div>
      </div>
    </main>
  );
};

export default DeliverySettings;
