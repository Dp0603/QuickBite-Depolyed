import React, { useState } from "react";
import { FaMoon, FaBell, FaTrash } from "react-icons/fa";

const CustomerSettings = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="p-6 text-gray-800 dark:text-white max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">⚙️ Settings</h1>

      {/* Appearance */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Appearance</h2>
        <div className="flex items-center justify-between bg-white dark:bg-secondary p-4 rounded-xl border dark:border-gray-700 shadow mb-3">
          <div className="flex items-center gap-3">
            <FaMoon className="text-primary" />
            <span>Dark Mode</span>
          </div>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
            <div className="w-11 h-6 bg-gray-300 rounded-full dark:bg-gray-600 relative">
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  darkMode ? "translate-x-full" : ""
                }`}
              />
            </div>
          </label>
        </div>
      </section>

      {/* Notifications */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Notifications</h2>
        <div className="flex items-center justify-between bg-white dark:bg-secondary p-4 rounded-xl border dark:border-gray-700 shadow">
          <div className="flex items-center gap-3">
            <FaBell className="text-primary" />
            <span>Order Updates</span>
          </div>
          <input
            type="checkbox"
            className="toggle toggle-primary"
            checked={notifications}
            onChange={() => setNotifications(!notifications)}
          />
        </div>
      </section>

      {/* Danger Zone */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-red-500">Danger Zone</h2>
        <div className="bg-white dark:bg-secondary p-4 rounded-xl border dark:border-gray-700 shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-red-500">
              <FaTrash />
              <span>Delete Account</span>
            </div>
            <button
              onClick={() => alert("Account deletion process initiated.")}
              className="text-sm bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
            >
              Delete
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CustomerSettings;
