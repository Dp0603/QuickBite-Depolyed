import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaCog,
  FaMoon,
  FaSun,
  FaBell,
  FaGlobe,
  FaUser,
  FaLock,
} from "react-icons/fa";

const AdminSettings = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [language, setLanguage] = useState("en");
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);

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

      {/* Profile Info */}
      <section className="bg-white dark:bg-secondary rounded-xl p-6 shadow mb-8">
        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FaUser /> Profile
        </h4>
        <div className="flex items-center gap-4">
          <img
            src="https://i.pravatar.cc/100"
            alt="Admin Avatar"
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold">Admin User</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              admin@example.com
            </p>
            <span className="text-xs font-medium mt-1 inline-block bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-300 px-2 py-1 rounded">
              Super Admin
            </span>
          </div>
        </div>
      </section>

      {/* Preferences */}
      <section className="bg-white dark:bg-secondary rounded-xl p-6 shadow mb-8">
        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FaSun /> Preferences
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Theme toggle */}
          <div>
            <label className="flex items-center gap-2 mb-1 font-medium">
              <FaMoon /> Dark Mode
            </label>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`px-4 py-2 rounded-md font-medium transition ${
                darkMode
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
              }`}
            >
              {darkMode ? "Enabled" : "Disabled"}
            </button>
          </div>

          {/* Language */}
          <div>
            <label className="flex items-center gap-2 mb-1 font-medium">
              <FaGlobe /> Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-sm"
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="ar">Arabic</option>
              <option value="fr">French</option>
            </select>
          </div>
        </div>
      </section>

      {/* Notifications */}
      <section className="bg-white dark:bg-secondary rounded-xl p-6 shadow mb-8">
        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FaBell /> Notifications
        </h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Email Alerts</span>
            <input
              type="checkbox"
              checked={emailNotif}
              onChange={() => setEmailNotif(!emailNotif)}
              className="form-checkbox w-5 h-5 text-primary"
            />
          </div>
          <div className="flex items-center justify-between">
            <span>SMS Notifications</span>
            <input
              type="checkbox"
              checked={smsNotif}
              onChange={() => setSmsNotif(!smsNotif)}
              className="form-checkbox w-5 h-5 text-primary"
            />
          </div>
        </div>
      </section>

      {/* Password */}
      <section className="bg-white dark:bg-secondary rounded-xl p-6 shadow">
        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FaLock /> Update Password
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium">Current Password</label>
            <input
              type="password"
              className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="text-sm font-medium">New Password</label>
            <input
              type="password"
              className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm"
              placeholder="••••••••"
            />
          </div>
        </div>
        <button className="mt-6 bg-primary text-white px-6 py-2 rounded hover:bg-orange-600 text-sm font-medium">
          Update Password
        </button>
      </section>
    </motion.div>
  );
};

export default AdminSettings;
