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
  FaChevronRight,
  FaChevronDown,
  FaFileAlt,
  FaUser,
  FaComments,
  FaCog,
  FaQuestionCircle,
  FaTimes,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

/* -------------------------------------- */
/* LINKS */
/* -------------------------------------- */
const restaurantLinks = [
  {
    label: "Dashboard",
    to: "",
    icon: FaHome,
    end: true,
    color: "from-orange-500 to-pink-600",
  },
  {
    label: "Orders",
    to: "orders",
    icon: FaHistory,
    color: "from-amber-500 to-orange-600",
  },
  {
    label: "Menu Manager",
    to: "menu-manager",
    icon: FaListAlt,
    color: "from-orange-500 to-red-500",
  },
  {
    label: "Menu Scheduler",
    to: "menu-scheduler",
    icon: FaCalendarAlt,
    color: "from-pink-500 to-rose-600",
  },
  {
    label: "Availability",
    to: "availability-toggle",
    icon: FaToggleOn,
    color: "from-green-500 to-emerald-600",
  },
  {
    label: "Offers",
    to: "offers-manager",
    icon: FaGift,
    color: "from-purple-500 to-fuchsia-600",
  },
  {
    label: "Delivery",
    to: "delivery",
    icon: FaTruck,
    color: "from-blue-500 to-cyan-600",
  },
  {
    label: "Reviews",
    to: "reviews",
    icon: FaStar,
    color: "from-yellow-500 to-orange-500",
  },

  {
    label: "Analytics",
    isDropdown: true,
    icon: FaChartBar,
    color: "from-orange-500 to-amber-600",
  },

  {
    label: "Payouts",
    to: "payouts",
    icon: FaFileAlt,
    ownerOnly: true,
    color: "from-gray-500 to-slate-600",
  },
  {
    label: "Staff",
    to: "staff",
    icon: FaUser,
    ownerOnly: true,
    color: "from-indigo-500 to-purple-600",
  },
  {
    label: "Chat Inbox",
    to: "chat-inbox",
    icon: FaComments,
    ownerOnly: true,
    color: "from-pink-500 to-fuchsia-600",
  },
  {
    label: "Settings",
    to: "settings",
    icon: FaCog,
    ownerOnly: true,
    color: "from-gray-500 to-slate-600",
  },
  {
    label: "Help",
    to: "help",
    icon: FaQuestionCircle,
    color: "from-indigo-500 to-purple-600",
  },
];

const analyticsSubLinks = [
  { label: "Overview", to: "analytics" },
  { label: "Sales Trends", to: "analytics/sales" },
  { label: "Heatmap", to: "analytics/heatmap" },
  { label: "Customers", to: "analytics/customers" },
];

/* -------------------------------------- */
/* SIDEBAR */
/* -------------------------------------- */

const RestaurantSidebar = ({ isOpen, toggleSidebar, isOwnerMode }) => {
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);

  return (
    <>
      {/* BACKDROP */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      {/* SIDEBAR */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            key="sidebar"
            initial={{ x: -280, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -280, opacity: 0 }}
            transition={{ type: "spring", stiffness: 250, damping: 30 }}
            className="fixed top-0 left-0 h-full w-72 z-50"
          >
            <div className="relative h-full flex flex-col">
              {/* GLOW (reduced intensity to match customer) */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-orange-400/20 via-pink-400/20 to-purple-500/20 blur-2xl animate-pulse"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                style={{ backgroundSize: "200% 200%" }}
              />

              {/* UPDATED GLASS (MATCHES CUSTOMER EXACTLY) */}
              <motion.div
                initial={{ opacity: 0.95, backdropFilter: "blur(18px)" }}
                animate={{
                  opacity: 1,
                  backdropFilter: "blur(18px)",
                }}
                whileHover={{
                  opacity: 0.92,
                  backdropFilter: "blur(26px)",
                  transition: { duration: 0.6, ease: "easeOut" },
                }}
                className="
                  relative h-full flex flex-col
                  bg-white/15 dark:bg-slate-900/30
                  border-r border-white/10
                  backdrop-blur-[18px]
                  shadow-none
                  transition-all duration-500
                "
              >
                {/* UPDATED HEADER (MATCHED TO CUSTOMER) */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-white/10 backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-pink-600 rounded-xl blur-md opacity-50"></div>
                      <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center text-white text-xl shadow-lg">
                        🍽️
                      </div>
                    </div>
                    <h2 className="text-xl font-black bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
                      Restaurant
                    </h2>
                  </div>

                  <motion.button
                    onClick={toggleSidebar}
                    className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center text-gray-100 hover:bg-white/30 hover:text-black transition-all"
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FaTimes />
                  </motion.button>
                </div>

                {/* OWNER MODE */}
                {isOwnerMode && (
                  <div className="mx-4 mt-4 mb-2 px-3 py-2 rounded-md bg-emerald-500/20 text-emerald-300 text-sm font-semibold text-center">
                    Owner Mode
                  </div>
                )}

                {/* NAVIGATION */}
                <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5 scrollbar-hide">
                  {restaurantLinks
                    .filter((l) => !l.ownerOnly || isOwnerMode)
                    .map((link) =>
                      link.isDropdown ? (
                        <div key="analytics">
                          <button
                            onClick={() => setIsAnalyticsOpen(!isAnalyticsOpen)}
                            className="group flex items-center gap-3 px-3 py-2.5 rounded-lg text-[0.92rem] font-medium text-white/90 hover:bg-white/10 transition-all"
                          >
                            <div
                              className={`w-9 h-9 rounded-lg bg-gradient-to-br ${link.color} flex items-center justify-center text-white shadow-md`}
                            >
                              <FaChartBar />
                            </div>
                            <span className="flex-1">{link.label}</span>
                            <FaChevronDown
                              className={`transition-transform ${
                                isAnalyticsOpen ? "rotate-180" : ""
                              }`}
                            />
                          </button>

                          <AnimatePresence>
                            {isAnalyticsOpen && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="ml-6 mt-1 flex flex-col border-l border-white/10"
                              >
                                {analyticsSubLinks.map((sub) => (
                                  <NavLink
                                    key={sub.to}
                                    to={`/restaurant/${sub.to}`}
                                    onClick={toggleSidebar}
                                    className={({ isActive }) =>
                                      `px-3 py-1.5 mt-1 rounded-md text-sm ${
                                        isActive
                                          ? "bg-orange-500 text-white"
                                          : "text-white/80 hover:bg-white/10"
                                      }`
                                    }
                                  >
                                    {sub.label}
                                  </NavLink>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : (
                        <NavLink
                          key={link.to}
                          to={`/restaurant/${link.to}`}
                          end={link.end}
                          onClick={toggleSidebar}
                          className={({ isActive }) =>
                            `group flex items-center gap-3 px-3 py-2.5 rounded-lg text-[0.92rem] font-medium transition-all ${
                              isActive
                                ? "bg-gradient-to-r from-orange-500 to-pink-600 text-white shadow-lg"
                                : "text-white/90 hover:bg-white/10"
                            }`
                          }
                        >
                          {({ isActive }) => (
                            <>
                              <div
                                className={`w-9 h-9 rounded-lg flex items-center justify-center text-base transition-all ${
                                  isActive
                                    ? "bg-white/20"
                                    : `bg-gradient-to-br ${link.color} text-white shadow-md group-hover:scale-110`
                                }`}
                              >
                                <link.icon />
                              </div>

                              <span className="flex-1">{link.label}</span>

                              {isActive ? (
                                <FaChevronRight className="text-white" />
                              ) : (
                                <FaChevronRight className="text-white/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                              )}
                            </>
                          )}
                        </NavLink>
                      )
                    )}
                </nav>

                {/* UPDATED FOOTER (MATCHED TO CUSTOMER) */}
                <div className="px-6 py-4 border-t border-white/10 bg-gradient-to-br from-black/70 via-gray-900/70 to-black/80 backdrop-blur-md">
                  <div className="flex items-center justify-between text-xs text-white/80">
                    <span>© {new Date().getFullYear()} QuickBite</span>
                    <div className="flex gap-2">
                      <a
                        href="/terms"
                        className="hover:text-orange-300 transition-colors"
                      >
                        Terms
                      </a>
                      <span>•</span>
                      <a
                        href="/privacy"
                        className="hover:text-orange-300 transition-colors"
                      >
                        Privacy
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

export default RestaurantSidebar;


// old
// import React, { useState } from "react";
// import { NavLink } from "react-router-dom";
// import {
//   FaHome,
//   FaHistory,
//   FaListAlt,
//   FaCalendarAlt,
//   FaToggleOn,
//   FaGift,
//   FaTruck,
//   FaStar,
//   FaChartBar,
//   FaChevronDown,
//   FaChevronRight,
//   FaFileAlt,
//   FaComments,
//   FaCog,
//   FaUser,
//   FaQuestionCircle,
// } from "react-icons/fa";

// const restaurantLinks = [
//   { label: "Dashboard", to: "", icon: <FaHome />, end: true },
//   { label: "Orders", to: "orders", icon: <FaHistory /> },
//   { label: "Menu Manager", to: "menu-manager", icon: <FaListAlt /> },
//   { label: "Menu Scheduler", to: "menu-scheduler", icon: <FaCalendarAlt /> },
//   { label: "Availability", to: "availability-toggle", icon: <FaToggleOn /> },
//   { label: "Offers", to: "offers-manager", icon: <FaGift /> },
//   { label: "Delivery", to: "delivery", icon: <FaTruck /> },
//   { label: "Reviews", to: "reviews", icon: <FaStar /> },

//   // Analytics is handled separately with dropdown
//   { label: "Analytics", isDropdown: true, icon: <FaChartBar /> },

//   // Owner-only routes
//   { label: "Payouts", to: "payouts", icon: <FaFileAlt />, ownerOnly: true },
//   { label: "Staff", to: "staff", icon: <FaUser />, ownerOnly: true }, // ✅ added
//   {
//     label: "Chat Inbox",
//     to: "chat-inbox",
//     icon: <FaComments />,
//     ownerOnly: true,
//   },
//   { label: "Settings", to: "settings", icon: <FaCog />, ownerOnly: true },

//   { label: "Profile", to: "profile", icon: <FaUser /> },
//   { label: "Help", to: "help", icon: <FaQuestionCircle /> },
// ];

// // Sub-links for analytics dropdown
// const analyticsSubLinks = [
//   { label: "Overview", to: "analytics" },
//   { label: "Sales Trends", to: "analytics/sales" },
//   { label: "Heatmap", to: "analytics/heatmap" },
//   { label: "Customers", to: "analytics/customers" },
// ];

// const RestaurantSidebar = ({ isOpen, isOwnerMode }) => {
//   const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);

//   return (
//     <aside
//       className={`bg-white dark:bg-gray-900 shadow-md fixed top-14 left-0 z-30 h-[calc(100vh-56px)] overflow-y-auto transition-all duration-300 ease-in-out ${
//         isOpen ? "w-64" : "w-16"
//       }`}
//     >
//       <nav className="mt-4 flex flex-col space-y-1 px-1">
//         {isOwnerMode && (
//           <div className="mx-2 mb-3 px-3 py-2 rounded-md bg-green-100 text-green-700 text-sm font-semibold text-center">
//             Owner Mode
//           </div>
//         )}

//         {restaurantLinks
//           .filter((link) => !link.ownerOnly || isOwnerMode)
//           .map((link) =>
//             link.isDropdown ? (
//               <div key="analytics">
//                 <div
//                   className={`flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition ${
//                     isAnalyticsOpen
//                       ? "bg-orange-500 text-white"
//                       : "text-gray-700 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-orange-600 hover:text-orange-700 dark:hover:text-white"
//                   }`}
//                 >
//                   {/* Clicking label goes to Analytics Overview */}
//                   <NavLink
//                     to="/restaurant/analytics"
//                     className="flex items-center gap-3 flex-1"
//                   >
//                     <span className="text-lg">{link.icon}</span>
//                     {isOpen && <span>{link.label}</span>}
//                   </NavLink>

//                   {/* Arrow toggle – only opens dropdown */}
//                   {isOpen && (
//                     <button
//                       onClick={() => setIsAnalyticsOpen(!isAnalyticsOpen)}
//                       className="p-1 focus:outline-none"
//                     >
//                       <FaChevronRight
//                         className={`transform transition-transform duration-300 ${
//                           isAnalyticsOpen ? "rotate-90" : ""
//                         }`}
//                       />
//                     </button>
//                   )}
//                 </div>

//                 {/* Dropdown Sub-links */}
//                 <div
//                   className={`overflow-hidden transition-all duration-300 ${
//                     isAnalyticsOpen
//                       ? "max-h-48 opacity-100"
//                       : "max-h-0 opacity-0"
//                   }`}
//                 >
//                   <div className="ml-5 mt-1 flex flex-col space-y-1 border-l border-gray-200 dark:border-gray-700 pl-3">
//                     {analyticsSubLinks.slice(1).map((sublink) => (
//                       <NavLink
//                         key={sublink.to}
//                         to={`/restaurant/${sublink.to}`}
//                         className={({ isActive }) =>
//                           `px-3 py-1.5 rounded-md text-sm transition ${
//                             isActive
//                               ? "bg-orange-400 text-white"
//                               : "text-gray-600 dark:text-gray-400 hover:bg-orange-50 dark:hover:bg-orange-800 hover:text-orange-700"
//                           }`
//                         }
//                       >
//                         {sublink.label}
//                       </NavLink>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               <NavLink
//                 key={link.to}
//                 to={`/restaurant/${link.to}`}
//                 end={link.end}
//                 className={({ isActive }) =>
//                   `group relative flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
//                     isActive
//                       ? "bg-orange-500 text-white"
//                       : "text-gray-700 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-orange-600 hover:text-orange-700 dark:hover:text-white"
//                   }`
//                 }
//               >
//                 <span className="text-lg">{link.icon}</span>
//                 {isOpen ? (
//                   <span>{link.label}</span>
//                 ) : (
//                   <span
//                     className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded shadow opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-40"
//                     style={{ top: "50%", transform: "translateY(-50%)" }}
//                   >
//                     {link.label}
//                   </span>
//                 )}
//               </NavLink>
//             )
//           )}
//       </nav>
//     </aside>
//   );
// };

// export default RestaurantSidebar;
