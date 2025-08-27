import React, { useState } from "react";
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
  FaChevronDown,
  FaChevronRight,
  FaFileAlt,
  FaComments,
  FaCog,
  FaUser,
  FaQuestionCircle,
} from "react-icons/fa";

const restaurantLinks = [
  { label: "Dashboard", to: "", icon: <FaHome />, end: true },
  { label: "Orders", to: "orders", icon: <FaHistory /> },
  { label: "Menu Manager", to: "menu-manager", icon: <FaListAlt /> },
  { label: "Menu Scheduler", to: "menu-scheduler", icon: <FaCalendarAlt /> },
  { label: "Availability", to: "availability-toggle", icon: <FaToggleOn /> },
  { label: "Offers", to: "offers-manager", icon: <FaGift /> },
  { label: "Delivery Status", to: "delivery-status", icon: <FaTruck /> },
  { label: "Reviews", to: "reviews", icon: <FaStar /> },

  // Analytics is handled separately with dropdown
  { label: "Analytics", isDropdown: true, icon: <FaChartBar /> },

  // Owner-only routes
  { label: "Payouts", to: "payouts", icon: <FaFileAlt />, ownerOnly: true },
  {
    label: "Chat Inbox",
    to: "chat-inbox",
    icon: <FaComments />,
    ownerOnly: true,
  },
  { label: "Settings", to: "settings", icon: <FaCog />, ownerOnly: true },

  { label: "Profile", to: "profile", icon: <FaUser /> },
  { label: "Help", to: "help", icon: <FaQuestionCircle /> },
];

// Sub-links for analytics dropdown
const analyticsSubLinks = [
  { label: "Overview", to: "analytics" },
  { label: "Sales Trends", to: "analytics/sales" },
  { label: "Heatmap", to: "analytics/heatmap" },
  { label: "Customers", to: "analytics/customers" },
];

const RestaurantSidebar = ({ isOpen, isOwnerMode }) => {
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);

  return (
    <aside
      className={`bg-white dark:bg-gray-900 shadow-md fixed top-14 left-0 z-30 h-[calc(100vh-56px)] overflow-y-auto transition-all duration-300 ease-in-out ${
        isOpen ? "w-64" : "w-16"
      }`}
    >
      <nav className="mt-4 flex flex-col space-y-1 px-1">
        {isOwnerMode && (
          <div className="mx-2 mb-3 px-3 py-2 rounded-md bg-green-100 text-green-700 text-sm font-semibold text-center">
            Owner Mode
          </div>
        )}

        {restaurantLinks
          .filter((link) => !link.ownerOnly || isOwnerMode)
          .map((link) =>
            link.isDropdown ? (
              <div key="analytics">
                <div
                  className={`flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition ${
                    isAnalyticsOpen
                      ? "bg-orange-500 text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-orange-600 hover:text-orange-700 dark:hover:text-white"
                  }`}
                >
                  {/* Clicking label goes to Analytics Overview */}
                  <NavLink
                    to="/restaurant/analytics"
                    className="flex items-center gap-3 flex-1"
                  >
                    <span className="text-lg">{link.icon}</span>
                    {isOpen && <span>{link.label}</span>}
                  </NavLink>

                  {/* Arrow toggle – only opens dropdown */}
                  {isOpen && (
                    <button
                      onClick={() => setIsAnalyticsOpen(!isAnalyticsOpen)}
                      className="p-1 focus:outline-none"
                    >
                      <FaChevronRight
                        className={`transform transition-transform duration-300 ${
                          isAnalyticsOpen ? "rotate-90" : ""
                        }`}
                      />
                    </button>
                  )}
                </div>

                {/* Dropdown Sub-links */}
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isAnalyticsOpen
                      ? "max-h-48 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="ml-5 mt-1 flex flex-col space-y-1 border-l border-gray-200 dark:border-gray-700 pl-3">
                    {analyticsSubLinks.slice(1).map((sublink) => (
                      <NavLink
                        key={sublink.to}
                        to={`/restaurant/${sublink.to}`}
                        className={({ isActive }) =>
                          `px-3 py-1.5 rounded-md text-sm transition ${
                            isActive
                              ? "bg-orange-400 text-white"
                              : "text-gray-600 dark:text-gray-400 hover:bg-orange-50 dark:hover:bg-orange-800 hover:text-orange-700"
                          }`
                        }
                      >
                        {sublink.label}
                      </NavLink>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
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
            )
          )}
      </nav>
    </aside>
  );
};

export default RestaurantSidebar;
