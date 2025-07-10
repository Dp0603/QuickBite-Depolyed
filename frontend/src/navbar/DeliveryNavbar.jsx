import React, { useState, useRef, useEffect } from "react";
import { FaSignOutAlt } from "react-icons/fa";
import Lottie from "lottie-react";
import { useNavigate } from "react-router-dom";

import NotificationLottie from "../assets/lottie icons/Notification.json";
import CloseLottie from "../assets/lottie icons/Hamburger menu.json";

const DeliveryNavbar = ({ toggleSidebar }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const profileRef = useRef(null);
  const notifRef = useRef(null);
  const navigate = useNavigate();

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
          <span role="img" aria-label="bike">
            🛵 QuickBite Rider
          </span>
        </h1>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4 relative">
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
              2
            </span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded shadow-md text-sm z-50 border dark:border-gray-700 overflow-hidden transition-all duration-200 animate-fade-in">
              <div className="px-4 py-2 border-b dark:border-gray-600 font-semibold">
                Notifications
              </div>
              <ul>
                <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                  Order #ORD1234 picked up.
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                  New delivery assigned.
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
              src="https://i.pravatar.cc/40?img=56"
              alt="Rider Avatar"
              className="w-8 h-8 rounded-full object-cover"
            />
          </button>
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 rounded shadow-md text-sm z-50 border dark:border-gray-700 overflow-hidden transition-all duration-200 animate-fade-in">
              <a
                href="/delivery/settings"
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                Settings
              </a>
              <a
                href="/delivery/profile"
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                Profile
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
    </header>
  );
};

export default DeliveryNavbar;
