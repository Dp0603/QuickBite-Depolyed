import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaShoppingCart,
  FaHistory,
  FaHeart,
  FaCrown,
  FaCog,
  FaTags,
  FaStar,
  FaQuestionCircle,
  FaUtensils,
  FaAddressBook,
  FaTimes,
  FaChevronRight,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const sidebarLinks = [
  {
    label: "Dashboard",
    to: "",
    icon: FaHome,
    end: true,
    color: "from-orange-500 to-pink-600",
  },
  {
    label: "Browse",
    to: "browse",
    icon: FaUtensils,
    color: "from-orange-500 to-amber-600",
  },
  {
    label: "Cart",
    to: "cart",
    icon: FaShoppingCart,
    color: "from-pink-500 to-rose-600",
  },
  {
    label: "Orders",
    to: "orders",
    icon: FaHistory,
    color: "from-blue-500 to-cyan-600",
  },
  {
    label: "Favorites",
    to: "favorites",
    icon: FaHeart,
    color: "from-red-500 to-pink-600",
  },
  {
    label: "Premium",
    to: "premium",
    icon: FaCrown,
    color: "from-yellow-500 to-amber-600",
  },
  {
    label: "Offers",
    to: "offers",
    icon: FaTags,
    color: "from-green-500 to-emerald-600",
  },
  {
    label: "Reviews",
    to: "reviews",
    icon: FaStar,
    color: "from-yellow-500 to-orange-600",
  },
  {
    label: "Addresses",
    to: "addresses",
    icon: FaAddressBook,
    color: "from-purple-500 to-pink-600",
  },
  {
    label: "Settings",
    to: "settings",
    icon: FaCog,
    color: "from-gray-500 to-slate-600",
  },
  {
    label: "Help",
    to: "help",
    icon: FaQuestionCircle,
    color: "from-indigo-500 to-purple-600",
  },
];

const CustomerSidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
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
            <div className="relative h-full flex flex-col group">
              {/* 🌈 Animated Gradient Glow */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-orange-400/20 via-pink-400/20 to-purple-500/20 blur-2xl animate-pulse"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{
                  backgroundSize: "200% 200%",
                }}
              ></motion.div>

              {/* 🧊 Glassmorphism Layer with Hover Transition */}
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
                className="relative h-full bg-white/15 dark:bg-slate-900/30 border-r border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] flex flex-col overflow-hidden transition-all duration-500"
              >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-white/10 backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-pink-600 rounded-xl blur-md opacity-50"></div>
                      <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center text-white text-xl shadow-lg">
                        🍔
                      </div>
                    </div>
                    <h2 className="text-xl font-black bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
                      QuickBite
                    </h2>
                  </div>
                  <motion.button
                    onClick={toggleSidebar}
                    className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center text-gray-100 hover:bg-white/30 hover:text-black transition-all"
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Close Sidebar"
                  >
                    <FaTimes />
                  </motion.button>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5 scrollbar-hide">
                  {sidebarLinks.map((link, index) => (
                    <NavLink
                      key={link.to}
                      to={`/customer/${link.to}`}
                      end={link.end}
                      onClick={toggleSidebar}
                      className={({ isActive }) =>
                        `group relative flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[0.92rem] font-medium transition-all duration-300 ${
                          isActive
                            ? "bg-gradient-to-r from-orange-500 to-pink-600 text-white shadow-lg shadow-orange-500/30"
                            : "text-white/90 hover:bg-white/10 hover:backdrop-blur-sm"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <div
                            className={`relative w-9 h-9 rounded-lg flex items-center justify-center text-base transition-all duration-300 ${
                              isActive
                                ? "bg-white/20"
                                : `bg-gradient-to-br ${link.color} text-white shadow-md group-hover:scale-110`
                            }`}
                          >
                            <link.icon />
                          </div>
                          <span className="relative flex-1">{link.label}</span>
                          {isActive ? (
                            <motion.div
                              initial={{ x: -10, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              className="text-white"
                            >
                              <FaChevronRight />
                            </motion.div>
                          ) : (
                            <FaChevronRight className="text-white/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                          )}
                        </>
                      )}
                    </NavLink>
                  ))}
                </nav>

                {/* Footer */}
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

export default CustomerSidebar;

// old
// import React from "react";
// import { NavLink } from "react-router-dom";
// import {
//   FaHome,
//   FaShoppingCart,
//   FaHistory,
//   FaHeart,
//   FaCrown,
//   FaCog,
//   FaTags,
//   FaStar,
//   FaQuestionCircle,
//   FaUtensils,
//   FaAddressBook,
// } from "react-icons/fa";

// const sidebarLinks = [
//   { label: "Dashboard", to: "", icon: <FaHome />, end: true },
//   { label: "Browse", to: "browse", icon: <FaUtensils /> },
//   { label: "Cart", to: "cart", icon: <FaShoppingCart /> },
//   { label: "Orders", to: "orders", icon: <FaHistory /> },
//   { label: "Favorites", to: "favorites", icon: <FaHeart /> },
//   { label: "Premium", to: "premium", icon: <FaCrown /> },
//   { label: "Offers", to: "offers", icon: <FaTags /> },
//   { label: "Reviews", to: "reviews", icon: <FaStar /> },
//   { label: "Addresses", to: "addresses", icon: <FaAddressBook /> },
//   { label: "Settings", to: "settings", icon: <FaCog /> },
//   { label: "Help", to: "help", icon: <FaQuestionCircle /> },
// ];

// const CustomerSidebar = ({ isOpen, toggleSidebar }) => {
//   return (
//     <aside
//       className={`bg-white dark:bg-gray-900 shadow-md fixed top-14 left-0 z-30 h-[calc(100vh-56px)] overflow-hidden transition-all duration-300 ease-in-out ${
//         isOpen ? "w-64" : "w-16"
//       }`}
//     >
//       <nav className="mt-4 flex flex-col space-y-1 px-1">
//         {sidebarLinks.map((link) => (
//           <NavLink
//             key={link.to}
//             to={`/customer/${link.to}`}
//             end={link.end}
//             onClick={() => toggleSidebar()}
//             className={({ isActive }) =>
//               `group relative flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
//                 isActive
//                   ? "bg-orange-500 text-white"
//                   : "text-gray-700 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-orange-600 hover:text-orange-700 dark:hover:text-white"
//               }`
//             }
//           >
//             {/* Icon */}
//             <span className="text-lg">{link.icon}</span>

//             {/* Label or Tooltip */}
//             {isOpen ? (
//               <span>{link.label}</span>
//             ) : (
//               <span
//                 className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded shadow opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-40"
//                 style={{ top: "50%", transform: "translateY(-50%)" }}
//               >
//                 {link.label}
//               </span>
//             )}
//           </NavLink>
//         ))}
//       </nav>
//     </aside>
//   );
// };

// export default CustomerSidebar;
