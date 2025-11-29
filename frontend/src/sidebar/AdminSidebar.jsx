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
  FaTimes,
  FaChevronRight,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

/* ---------------- ADMIN LINKS ---------------- */
const adminLinks = [
  {
    label: "Dashboard",
    to: "",
    icon: FaHome,
    end: true,
    color: "from-[#3A8DFF] to-[#7B4DFF]",
  },
  {
    label: "Users",
    to: "users",
    icon: FaAddressBook,
    color: "from-[#3A8DFF] to-[#7B4DFF]",
  },
  {
    label: "Restaurants",
    to: "restaurants",
    icon: FaUtensils,
    color: "from-[#3A8DFF] to-[#7B4DFF]",
  },
  {
    label: "Orders",
    to: "orders",
    icon: FaShoppingCart,
    color: "from-[#3A8DFF] to-[#7B4DFF]",
  },
  {
    label: "Payouts",
    to: "payouts",
    icon: FaTags,
    color: "from-[#3A8DFF] to-[#7B4DFF]",
  },
  {
    label: "Complaints",
    to: "complaints",
    icon: FaQuestionCircle,
    color: "from-[#3A8DFF] to-[#7B4DFF]",
  },
  {
    label: "Reviews",
    to: "reviews",
    icon: FaStar,
    color: "from-[#3A8DFF] to-[#7B4DFF]",
  },
  {
    label: "Offers",
    to: "offers",
    icon: FaCrown,
    color: "from-[#3A8DFF] to-[#7B4DFF]",
  },
  {
    label: "Reports",
    to: "reports",
    icon: FaHistory,
    color: "from-[#3A8DFF] to-[#7B4DFF]",
  },
  {
    label: "Settings",
    to: "settings",
    icon: FaCog,
    color: "from-[#3A8DFF] to-[#7B4DFF]",
  },
];

/* ---------------- SIDEBAR COMPONENT ---------------- */
const AdminSidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <>
      {/* BACKDROP (mobile) */}
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

      {/* SIDEBAR ITSELF */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            key="admin-sidebar"
            initial={{ x: -280, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -280, opacity: 0 }}
            transition={{ type: "spring", stiffness: 240, damping: 28 }}
            className="fixed top-0 left-0 h-full w-72 z-50"
          >
            <div className="relative h-full flex flex-col">
              {/* BACKGROUND GLOW */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br 
                  from-blue-400/20 via-purple-400/20 to-purple-600/20
                  blur-2xl animate-pulse"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                style={{ backgroundSize: "200% 200%" }}
              />

              {/* GLASSED SIDEBAR LAYER */}
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
                className="relative h-full bg-white/15 dark:bg-slate-900/30
                border-r border-white/10 backdrop-blur-[18px]
                flex flex-col shadow-none"
              >
                {/* HEADER */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-white/10 backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div
                        className="absolute inset-0 bg-gradient-to-br 
                        from-[#3A8DFF] to-[#7B4DFF]
                        dark:from-[#1F4AFF] dark:to-[#661BFF]
                        rounded-xl blur-md opacity-50"
                      ></div>

                      <div
                        className="relative w-10 h-10 rounded-xl 
                        bg-gradient-to-br from-[#3A8DFF] to-[#7B4DFF]
                        dark:from-[#1F4AFF] dark:to-[#661BFF]
                        flex items-center justify-center text-white text-xl shadow-lg"
                      >
                        🧑‍💼
                      </div>
                    </div>

                    <h2
                      className="text-xl font-black bg-gradient-to-r 
                      from-[#3A8DFF] to-[#7B4DFF]
                      bg-clip-text text-transparent"
                    >
                      Admin Panel
                    </h2>
                  </div>

                  {/* CLOSE BUTTON */}
                  <motion.button
                    onClick={toggleSidebar}
                    className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm
                      flex items-center justify-center text-white
                      hover:bg-white/30 hover:text-black transition-all"
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FaTimes />
                  </motion.button>
                </div>

                {/* NAVIGATION */}
                <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1 scrollbar-hide">
                  {adminLinks.map((link) => (
                    <NavLink
                      key={link.to}
                      to={`/admin/${link.to}`}
                      end={link.end}
                      onClick={toggleSidebar}
                      className={({ isActive }) =>
                        `group flex items-center gap-3 px-3 py-2.5 rounded-lg 
                        text-[0.92rem] font-medium transition-all 
                        ${
                          isActive
                            ? "bg-gradient-to-r from-[#3A8DFF] to-[#7B4DFF] text-white shadow-lg"
                            : "text-white/90 hover:bg-white/10"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {/* ICON */}
                          <div
                            className={`w-9 h-9 rounded-lg flex items-center justify-center text-base transition-all
                            ${
                              isActive
                                ? "bg-white/20"
                                : `bg-gradient-to-br ${link.color} text-white shadow-md group-hover:scale-110`
                            }`}
                          >
                            <link.icon />
                          </div>

                          {/* LABEL */}
                          <span className="flex-1">{link.label}</span>

                          {/* ACTIVE ARROW */}
                          {isActive ? (
                            <FaChevronRight className="text-white" />
                          ) : (
                            <FaChevronRight className="text-white/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                          )}
                        </>
                      )}
                    </NavLink>
                  ))}
                </nav>

                {/* FOOTER */}
                <div
                  className="px-6 py-4 border-t border-white/10 bg-gradient-to-br 
                  from-black/70 via-gray-900/70 to-black/80 backdrop-blur-md"
                >
                  <div className="flex items-center justify-between text-xs text-white/80">
                    <span>© {new Date().getFullYear()} QuickBite</span>
                    <div className="flex gap-2">
                      <a
                        href="/terms"
                        className="hover:text-blue-300 transition-colors"
                      >
                        Terms
                      </a>
                      <span>•</span>
                      <a
                        href="/privacy"
                        className="hover:text-purple-300 transition-colors"
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

export default AdminSidebar;

// import React from "react";
// import { NavLink } from "react-router-dom";
// import {
//   FaHome,
//   FaAddressBook,
//   FaUtensils,
//   FaShoppingCart,
//   FaTags,
//   FaQuestionCircle,
//   FaStar,
//   FaCrown,
//   FaHistory,
//   FaCog,
// } from "react-icons/fa";

// const adminLinks = [
//   { label: "Dashboard", to: "", icon: <FaHome />, end: true },
//   { label: "Users", to: "users", icon: <FaAddressBook /> },
//   { label: "Restaurants", to: "restaurants", icon: <FaUtensils /> },
//   { label: "Orders", to: "orders", icon: <FaShoppingCart /> },
//   { label: "Payouts", to: "payouts", icon: <FaTags /> },
//   { label: "Complaints", to: "complaints", icon: <FaQuestionCircle /> },
//   { label: "Reviews", to: "reviews", icon: <FaStar /> },
//   { label: "Offers", to: "offers", icon: <FaCrown /> },
//   { label: "Reports", to: "reports", icon: <FaHistory /> },
//   { label: "Settings", to: "settings", icon: <FaCog /> },
// ];

// const AdminSidebar = ({ isOpen, toggleSidebar }) => {
//   return (
//     <aside
//       className={`bg-white dark:bg-gray-900 shadow-md fixed top-14 left-0 z-30 h-[calc(100vh-56px)] overflow-hidden transition-all duration-300 ease-in-out ${
//         isOpen ? "w-64" : "w-16"
//       }`}
//     >
//       <nav className="mt-4 flex flex-col space-y-1 px-1">
//         {adminLinks.map((link) => (
//           <NavLink
//             key={link.to}
//             to={`/admin/${link.to}`}
//             end={link.end}
//             onClick={toggleSidebar}
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

// export default AdminSidebar;
