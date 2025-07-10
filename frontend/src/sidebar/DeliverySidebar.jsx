import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaShoppingCart,
  FaHistory,
  FaCog,
  FaQuestionCircle,
  FaUtensils, // use placeholder for map
} from "react-icons/fa";

const deliveryLinks = [
  { label: "Dashboard", to: "", icon: <FaHome />, end: true },
  { label: "Assigned Orders", to: "assigned", icon: <FaShoppingCart /> },
  { label: "Map View", to: "map", icon: <FaUtensils /> },
  { label: "History", to: "history", icon: <FaHistory /> },
  { label: "Settings", to: "settings", icon: <FaCog /> },
  { label: "Help", to: "help", icon: <FaQuestionCircle /> },
];

const DeliverySidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <aside
      className={`bg-white dark:bg-gray-900 shadow-md fixed top-14 left-0 z-30 h-[calc(100vh-56px)] overflow-hidden transition-all duration-300 ease-in-out ${
        isOpen ? "w-64" : "w-16"
      }`}
    >
      <nav className="mt-4 flex flex-col space-y-1 px-1">
        {deliveryLinks.map((link) => (
          <NavLink
            key={link.to}
            to={`/delivery/${link.to}`}
            end={link.end}
            onClick={toggleSidebar}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-primary text-white"
                  : "text-gray-700 dark:text-gray-300 hover:bg-accent dark:hover:bg-orange-600 hover:text-orange-700 dark:hover:text-white"
              }`
            }
          >
            {/* Icon */}
            <span className="text-lg">{link.icon}</span>

            {/* Label or Tooltip */}
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

export default DeliverySidebar;
