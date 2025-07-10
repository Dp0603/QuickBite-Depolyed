import React, { useState } from "react";

const RestaurantSettings = () => {
  const [settings, setSettings] = useState({
    isOpen: true,
    minOrderAmount: 200,
    deliveryTime: 30,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="px-6 py-8 min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-white">
      <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
        <h2 className="text-3xl font-bold">⚙️ Restaurant Settings</h2>

        <div className="bg-white dark:bg-secondary p-6 rounded-xl shadow space-y-6">
          {/* Open/Close Toggle */}
          <div className="flex items-center justify-between">
            <label htmlFor="isOpen" className="text-base font-medium">
              Restaurant Status
            </label>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="isOpen"
                id="isOpen"
                checked={settings.isOpen}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-checked:bg-primary rounded-full peer relative transition-all">
                <div className="w-5 h-5 bg-white rounded-full shadow absolute top-0.5 left-0.5 peer-checked:translate-x-full transition-transform" />
              </div>
              <span className="ml-3 text-sm font-medium text-gray-600 dark:text-gray-300">
                {settings.isOpen ? "Open" : "Closed"}
              </span>
            </label>
          </div>

          {/* Minimum Order */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Minimum Order Amount (₹)
            </label>
            <input
              type="number"
              name="minOrderAmount"
              value={settings.minOrderAmount}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              Orders below this value will not be accepted.
            </p>
          </div>

          {/* Delivery Time */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Estimated Delivery Time (minutes)
            </label>
            <input
              type="number"
              name="deliveryTime"
              value={settings.deliveryTime}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              Shown to customers during checkout.
            </p>
          </div>

          {/* Save Button */}
          <div className="pt-4">
            <button className="bg-primary hover:bg-orange-600 text-white px-6 py-2 rounded-xl text-sm font-medium transition">
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantSettings;
