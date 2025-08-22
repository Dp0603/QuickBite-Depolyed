import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaHistory,
  FaListAlt,
  FaCalendarAlt,
  FaToggleOn,
  FaGift,
  FaTruck,
  FaStar,
  FaChartBar,
  FaFileAlt,
  FaComments,
  FaCog,
  FaUser,
  FaQuestionCircle,
} from "react-icons/fa";

const restaurantLinks = [
  // Normal routes (always visible)
  { label: "Dashboard", to: "", icon: <FaHome />, end: true },
  { label: "Orders", to: "orders", icon: <FaHistory /> },
  { label: "Menu Manager", to: "menu-manager", icon: <FaListAlt /> },
  { label: "Menu Scheduler", to: "menu-scheduler", icon: <FaCalendarAlt /> },
  { label: "Availability", to: "availability-toggle", icon: <FaToggleOn /> },
  { label: "Offers", to: "offers-manager", icon: <FaGift /> },
  { label: "Delivery Status", to: "delivery-status", icon: <FaTruck /> },
  { label: "Reviews", to: "reviews", icon: <FaStar /> },
  { label: "Analytics", to: "analytics", icon: <FaChartBar /> },

  // Owner-only routes
  { label: "Payouts", to: "payouts", icon: <FaFileAlt />, ownerOnly: true },
  {
    label: "Chat Inbox",
    to: "chat-inbox",
    icon: <FaComments />,
    ownerOnly: true,
  },
  { label: "Settings", to: "settings", icon: <FaCog />, ownerOnly: true },

  // Always visible
  { label: "Profile", to: "profile", icon: <FaUser /> },
  { label: "Help", to: "help", icon: <FaQuestionCircle /> },
];

const RestaurantSidebar = ({ isOpen, isOwnerMode }) => {
  return (
    <aside
      className={`bg-white dark:bg-gray-900 shadow-md fixed top-14 left-0 z-30 h-[calc(100vh-56px)] overflow-hidden transition-all duration-300 ease-in-out ${
        isOpen ? "w-64" : "w-16"
      }`}
    >
      <nav className="mt-4 flex flex-col space-y-1 px-1">
        {/* Owner mode banner */}
        {isOwnerMode && (
          <div className="mx-2 mb-3 px-3 py-2 rounded-md bg-green-100 text-green-700 text-sm font-semibold text-center">
            Owner Mode
          </div>
        )}

        {restaurantLinks
          .filter((link) => !link.ownerOnly || isOwnerMode)
          .map((link) => (
            <NavLink
              key={link.to}
              to={`/restaurant/${link.to}`}
              end={link.end}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-orange-500 text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-orange-600 hover:text-orange-700 dark:hover:text-white"
                }`
              }
            >
              <span className="text-lg">{link.icon}</span>

              {isOpen ? (
                <span>{link.label}</span>
              ) : (
                <span
                  className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded shadow opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-40"
                  style={{ top: "50%", transform: "translateY(-50%)" }}
                >
                  {link.label}
                </span>
              )}
            </NavLink>
          ))}
      </nav>
    </aside>
  );
};

export default RestaurantSidebar;
