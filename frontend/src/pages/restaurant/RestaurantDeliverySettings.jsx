import React, { useState, useEffect, useContext } from "react";
import { FaCog, FaDollarSign, FaShoppingCart, FaClock } from "react-icons/fa";
import API from "../../api/axios"; // ✅ use the global axios instance
import { AuthContext } from "../../context/AuthContext"; // ✅ get logged-in restaurant

const RestaurantDeliverySettings = () => {
  const { user } = useContext(AuthContext);
  const [deliveryEnabled, setDeliveryEnabled] = useState(true);
  const [pickupEnabled, setPickupEnabled] = useState(true);
  const [deliveryFee, setDeliveryFee] = useState(5);
  const [minOrder, setMinOrder] = useState(20);
  const [deliveryTime, setDeliveryTime] = useState("30-45 mins");

  // 🔄 Fetch current delivery settings on mount
  const fetchSettings = async () => {
    try {
      const res = await API.get("/restaurants/restaurants/settings/me");
      const settings = res.data?.deliverySettings; // ✅ match backend response

      if (settings) {
        setDeliveryEnabled(settings.deliveryEnabled ?? true);
        setPickupEnabled(settings.pickupEnabled ?? true);
        setDeliveryFee(settings.deliveryFee ?? 5);
        setMinOrder(settings.minOrder ?? 20);
        setDeliveryTime(settings.deliveryTime ?? "30-45 mins");
      }
    } catch (err) {
      console.error(
        "❌ Error fetching delivery settings:",
        err.response?.data || err.message
      );
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchSettings();
    }
  }, [user]);

  // ✏️ Save delivery settings
  const handleSave = async () => {
    try {
      const res = await API.put("/restaurants/restaurants/settings/delivery", {
        deliveryEnabled,
        pickupEnabled,
        deliveryFee,
        minOrder,
        deliveryTime,
      });

      alert("✅ Delivery settings saved successfully!");
      console.log("Response:", res.data);
    } catch (err) {
      console.error(
        "❌ Failed to save settings:",
        err.response?.data || err.message
      );
      alert("❌ Failed to save settings.");
    }
  };

  return (
    <div className="p-6 text-gray-800 dark:text-white bg-white dark:bg-secondary rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <FaCog className="text-blue-500" />
        Delivery Settings
      </h2>

      {/* Enable Toggles */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={deliveryEnabled}
            onChange={() => setDeliveryEnabled(!deliveryEnabled)}
            className="w-5 h-5 accent-blue-600"
          />
          <label className="font-medium">Enable Delivery</label>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={pickupEnabled}
            onChange={() => setPickupEnabled(!pickupEnabled)}
            className="w-5 h-5 accent-blue-600"
          />
          <label className="font-medium">Enable Pickup</label>
        </div>
      </div>

      {/* Numeric Inputs */}
      <div className="mt-6 grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-1 flex items-center gap-2">
            <FaDollarSign className="text-green-600" /> Delivery Fee ($)
          </label>
          <input
            type="number"
            value={deliveryFee}
            onChange={(e) => setDeliveryFee(Number(e.target.value))}
            className="w-full border rounded px-3 py-2 text-gray-800 dark:text-black"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 flex items-center gap-2">
            <FaShoppingCart className="text-orange-600" /> Minimum Order Amount
            ($)
          </label>
          <input
            type="number"
            value={minOrder}
            onChange={(e) => setMinOrder(Number(e.target.value))}
            className="w-full border rounded px-3 py-2 text-gray-800 dark:text-black"
          />
        </div>
      </div>

      {/* Delivery Time */}
      <div className="mt-6">
        <label className="block text-sm font-medium mb-1 flex items-center gap-2">
          <FaClock className="text-purple-600" /> Estimated Delivery Time
        </label>
        <input
          type="text"
          value={deliveryTime}
          onChange={(e) => setDeliveryTime(e.target.value)}
          className="w-full border rounded px-3 py-2 text-gray-800 dark:text-black"
          placeholder="e.g., 30-45 mins"
        />
      </div>

      {/* Save Button */}
      <div className="mt-8">
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default RestaurantDeliverySettings;
