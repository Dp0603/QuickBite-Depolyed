import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaAddressBook,
  FaUtensils,
  FaShoppingCart,
  FaTags,
  FaQuestionCircle,
  FaStar,
  FaCrown,
  FaHistory,
  FaCog,
} from "react-icons/fa";

const adminLinks = [
  { label: "Dashboard", to: "", icon: <FaHome />, end: true },
  { label: "Users", to: "users", icon: <FaAddressBook /> },
  { label: "Restaurants", to: "restaurants", icon: <FaUtensils /> },
  { label: "Orders", to: "orders", icon: <FaShoppingCart /> },
  { label: "Payouts", to: "payouts", icon: <FaTags /> },
  { label: "Complaints", to: "complaints", icon: <FaQuestionCircle /> },
  { label: "Reviews", to: "reviews", icon: <FaStar /> },
  { label: "Offers", to: "offers", icon: <FaCrown /> },
  { label: "Reports", to: "reports", icon: <FaHistory /> },
  { label: "Settings", to: "settings", icon: <FaCog /> },
];

const AdminSidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <aside
      className={`bg-white dark:bg-gray-900 shadow-md fixed top-14 left-0 z-30 h-[calc(100vh-56px)] overflow-hidden transition-all duration-300 ease-in-out ${
        isOpen ? "w-64" : "w-16"
      }`}
    >
      <nav className="mt-4 flex flex-col space-y-1 px-1">
        {adminLinks.map((link) => (
          <NavLink
            key={link.to}
            to={`/admin/${link.to}`}
            end={link.end}
            onClick={toggleSidebar}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-orange-500 text-white"
                  : "text-gray-700 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-orange-600 hover:text-orange-700 dark:hover:text-white"
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

export default AdminSidebar;
