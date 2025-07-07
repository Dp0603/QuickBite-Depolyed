import React, { useState, useRef, useEffect } from "react";
import { FaSignOutAlt } from "react-icons/fa";
import Lottie from "lottie-react";

import SearchLottie from "../assets/lottie icons/Search.json";
import NotificationLottie from "../assets/lottie icons/Notification.json";
import CloseLottie from "../assets/lottie icons/Hamburger menu.json";

const CustomerNavbar = ({ toggleSidebar }) => {
  const [showSearch, setShowSearch] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const profileRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setShowSearch(false);
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <header className="flex items-center justify-between bg-white dark:bg-gray-900 border-b dark:border-gray-700 shadow px-4 py-3 sticky top-0 z-40 w-full">
      {/* Sidebar Toggle + Logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          aria-label="Toggle Sidebar"
          className="text-2xl text-gray-600 dark:text-gray-300"
        >
          ☰
        </button>
        <h1 className="text-xl font-bold text-primary tracking-wide">
          <span role="img" aria-label="burger">
            🍔 QuickBite
          </span>
        </h1>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4 relative">
        {/* Search */}
        <button
          onClick={() => setShowSearch(true)}
          className="hover:scale-110 transition"
          aria-label="Search"
        >
          <Lottie
            animationData={SearchLottie}
            style={{ width: 30, height: 30 }}
          />
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="hover:scale-110 transition relative"
            aria-label="Notifications"
          >
            <Lottie
              animationData={NotificationLottie}
              style={{ width: 30, height: 30 }}
            />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
              3
            </span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded shadow-md text-sm z-50 border dark:border-gray-700 overflow-hidden transition-all duration-200 animate-fade-in">
              <div className="px-4 py-2 border-b dark:border-gray-600 font-semibold">
                Notifications
              </div>
              <ul>
                <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                  Your order has been shipped!
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                  New discount available!
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                  Welcome to QuickBite!
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="hover:text-primary transition rounded-full w-8 h-8"
            aria-label="Account Menu"
          >
            <img
              src="https://i.pravatar.cc/40"
              alt="User Avatar"
              className="w-8 h-8 rounded-full object-cover"
            />
          </button>
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 rounded shadow-md text-sm z-50 border dark:border-gray-700 overflow-hidden transition-all duration-200 animate-fade-in">
              <a
                href="/customer/profile"
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                My Profile
              </a>
              <a
                href="/customer/settings"
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                Settings
              </a>
            </div>
          )}
        </div>

        {/* Logout */}
        <a
          href="/logout"
          className="hover:text-red-500 transition"
          title="Logout"
          aria-label="Logout"
        >
          <FaSignOutAlt />
        </a>
      </div>

      {/* Search Modal */}
      {showSearch && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white dark:bg-gray-900 w-full max-w-xl rounded-xl shadow-xl p-6 relative animate-fade-in">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base font-semibold text-gray-700 dark:text-white">
                Search
              </h2>
              <button
                onClick={() => setShowSearch(false)}
                className="w-6 h-6"
                title="Close"
                aria-label="Close Search"
              >
                <Lottie
                  animationData={CloseLottie}
                  style={{ width: "100%", height: "100%" }}
                />
              </button>
            </div>

            {/* Input */}
            <input
              type="text"
              placeholder="Search for dishes, cuisines, or restaurants..."
              className="w-full px-4 py-3 border rounded-lg dark:bg-gray-800 dark:text-white focus:outline-primary text-sm"
              autoFocus
            />

            {/* Recent */}
            <div className="mt-4">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">
                Recent Searches
              </p>
              <ul className="flex flex-wrap gap-2">
                {["Pizza", "Burger", "Sushi", "Indian", "Tacos"].map((item) => (
                  <li
                    key={item}
                    className="bg-gray-100 dark:bg-gray-800 text-sm px-3 py-1 rounded-full cursor-pointer hover:bg-orange-100 dark:hover:bg-orange-600 transition-colors"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default CustomerNavbar;
