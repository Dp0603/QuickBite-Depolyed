import React, { useState, useEffect } from "react";
import { FaCog, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { motion } from "framer-motion";

const AdminSettings = () => {
  const navigate = useNavigate();

  const [settings, setSettings] = useState({
    platformName: "",
    contactEmail: "",
    supportNumber: "",
    deliveryCharge: "",
    taxPercentage: "",
    payoutThreshold: "",
    maintenanceMode: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // ⚙️ Fetch Settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await API.get("/admin/settings");
        setSettings(res.data.data);
      } catch (err) {
        console.error("Error fetching settings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  // 🔄 General Settings handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      const res = await API.put("/admin/settings", settings);
      setMessage("✅ Settings updated successfully!");
      setSettings(res.data.data);
      setTimeout(() => setMessage(""), 2500);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );

  return (
    <motion.div
      className="min-h-screen w-full bg-gray-50 dark:bg-gray-950 px-4 sm:px-8 md:px-10 lg:px-12 py-8 text-gray-800 dark:text-white"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <FaCog /> Admin Settings
      </h2>

      {message && (
        <div className="mb-4 text-green-600 bg-green-100 dark:bg-green-800 dark:text-green-300 p-3 rounded">
          {message}
        </div>
      )}

      {/* General Settings */}
      <section className="bg-white dark:bg-secondary rounded-xl p-6 shadow mb-8">
        <h4 className="text-lg font-semibold mb-4">⚙️ General Settings</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            "platformName",
            "contactEmail",
            "supportNumber",
            "deliveryCharge",
            "taxPercentage",
            "payoutThreshold",
          ].map((field) => (
            <div key={field}>
              <label className="text-sm font-medium">
                {field.replace(/([A-Z])/g, " $1")}
              </label>
              <input
                type={["contactEmail"].includes(field) ? "email" : "text"}
                name={field}
                value={settings[field]}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-sm"
              />
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
          <span className="font-medium flex items-center gap-2">
            Maintenance Mode
          </span>
          <input
            type="checkbox"
            name="maintenanceMode"
            checked={settings.maintenanceMode}
            onChange={handleChange}
            className="w-5 h-5 accent-orange-500"
          />
        </div>

        <button
          onClick={handleSaveSettings}
          disabled={saving}
          className={`mt-6 bg-primary text-white px-6 py-2 rounded hover:bg-orange-600 text-sm font-medium ${
            saving && "opacity-70 cursor-not-allowed"
          }`}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </section>

      {/* Security / Change Password */}
      <section className="bg-white dark:bg-secondary rounded-xl p-6 shadow mb-8">
        <h4 className="text-lg font-semibold mb-4">
          <FaLock /> Security
        </h4>
        <div
          className="flex justify-between items-center border rounded p-4 hover:shadow transition cursor-pointer"
          onClick={() => navigate("/admin/change-password")} //
        >
          <span>Change Password</span>
          <button className="text-sm text-blue-600 hover:underline">
            Change
          </button>
        </div>
      </section>
    </motion.div>
  );
};

export default AdminSettings;
