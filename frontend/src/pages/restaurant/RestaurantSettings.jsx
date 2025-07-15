import React, { useState, useEffect, useContext } from "react";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

const RestaurantSettings = () => {
  const { token } = useContext(AuthContext);

  const [orderSettings, setOrderSettings] = useState({
    minOrderAmount: 200,
    deliveryTime: 30,
    autoAcceptOrders: true,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await API.get("/restaurant/profile");
        setOrderSettings((prev) => ({
          ...prev,
          minOrderAmount: res.data.data.minOrderAmount || 200,
          deliveryTime: res.data.data.deliveryTime || 30,
          autoAcceptOrders:
            res.data.data.availability?.autoAcceptOrders ?? true,
        }));
      } catch (err) {
        toast.error("Failed to load settings");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleOrderChange = (e) => {
    const { name, type, checked, value } = e.target;
    setOrderSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const submitOrderSettings = async (e) => {
    e.preventDefault();
    try {
      await API.put("/restaurant/settings/order-settings", orderSettings);
      toast.success("✅ Settings updated");
    } catch (err) {
      toast.error("❌ Failed to update");
      console.error(err);
    }
  };

  const submitPasswordChange = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = passwordData;
    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      await API.put("/restaurant/settings/change-password", {
        currentPassword,
        newPassword,
      });
      toast.success("🔒 Password updated");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      toast.error("❌ Failed to change password");
      console.error(err);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="px-6 py-8 min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-white max-w-3xl mx-auto space-y-10 animate-fade-in">
      <h2 className="text-3xl font-bold">⚙️ Restaurant Settings</h2>

      {/* 🛒 Order Settings */}
      <form
        onSubmit={submitOrderSettings}
        className="bg-white dark:bg-secondary p-6 rounded-xl shadow space-y-6"
      >
        <h3 className="text-xl font-semibold">🛍️ Order Preferences</h3>

        <div>
          <label className="block text-sm font-medium mb-1">
            Minimum Order Amount (₹)
          </label>
          <input
            type="number"
            name="minOrderAmount"
            value={orderSettings.minOrderAmount}
            onChange={handleOrderChange}
            className="input-style"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Estimated Delivery Time (minutes)
          </label>
          <input
            type="number"
            name="deliveryTime"
            value={orderSettings.deliveryTime}
            onChange={handleOrderChange}
            className="input-style"
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="autoAcceptOrders"
            name="autoAcceptOrders"
            checked={orderSettings.autoAcceptOrders}
            onChange={handleOrderChange}
            className="h-4 w-4"
          />
          <label htmlFor="autoAcceptOrders" className="text-sm">
            Auto-accept incoming orders
          </label>
        </div>

        <button
          type="submit"
          className="bg-primary hover:bg-orange-600 text-white px-6 py-2 rounded-xl text-sm font-medium transition"
        >
          Save Order Settings
        </button>
      </form>

      {/* 🔐 Change Password */}
      <form
        onSubmit={submitPasswordChange}
        className="bg-white dark:bg-secondary p-6 rounded-xl shadow space-y-6"
      >
        <h3 className="text-xl font-semibold">🔐 Change Password</h3>

        <div>
          <label className="block text-sm font-medium mb-1">
            Current Password
          </label>
          <input
            type="password"
            name="currentPassword"
            value={passwordData.currentPassword}
            onChange={handlePasswordChange}
            className="input-style"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">New Password</label>
          <input
            type="password"
            name="newPassword"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
            className="input-style"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Confirm New Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={passwordData.confirmPassword}
            onChange={handlePasswordChange}
            className="input-style"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-primary hover:bg-orange-600 text-white px-6 py-2 rounded-xl text-sm font-medium transition"
        >
          Update Password
        </button>
      </form>
    </div>
  );
};

export default RestaurantSettings;
