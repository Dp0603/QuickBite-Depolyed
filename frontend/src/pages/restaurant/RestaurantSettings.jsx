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
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Restaurant Settings</h2>
      <div className="space-y-4 max-w-md">
        <div>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="isOpen"
              checked={settings.isOpen}
              onChange={handleChange}
            />
            <span>Restaurant is Open</span>
          </label>
        </div>

        <div>
          <label className="block mb-1 font-medium">Min Order Amount (₹)</label>
          <input
            type="number"
            name="minOrderAmount"
            value={settings.minOrderAmount}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Estimated Delivery Time (min)</label>
          <input
            type="number"
            name="deliveryTime"
            value={settings.deliveryTime}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <button className="bg-primary text-white px-5 py-2 rounded mt-4 hover:bg-orange-600">
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default RestaurantSettings;
