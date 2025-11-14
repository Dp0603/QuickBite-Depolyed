import React, { useState, useEffect, useRef, useContext } from "react";
import {
  FaSignOutAlt,
  FaUser,
  FaCog,
  FaBell,
  FaUtensils,
  FaChartLine,
  FaHistory,
  FaCrown,
  FaCheckCircle,
  FaClock,
  FaExclamationCircle,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const RestaurantNavbar = ({ toggleSidebar, isOwnerMode, setIsOwnerMode }) => {
  /* ---------------------- State ---------------------- */
  const [isSolid, setIsSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const lastScroll = useRef(0);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const navigate = useNavigate();
  const { logout, user } = useContext(AuthContext);

  /* ---------------------- Hide on Scroll ---------------------- */
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setIsSolid(y > 40);
      if (y > lastScroll.current && y > 100) setHidden(true);
      else setHidden(false);
      lastScroll.current = y;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ---------------------- Click Outside ---------------------- */
  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target))
        setShowNotifications(false);
      if (profileRef.current && !profileRef.current.contains(e.target))
        setShowProfile(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  /* ---------------------- Logout ---------------------- */
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  /* ---------------------- Enhanced Notifications ---------------------- */
  const notifications = [
    {
      id: 1,
      type: "order",
      title: "New Order Received!",
      message: "Order #12345 from John Doe",
      time: "2 mins ago",
      unread: true,
      icon: FaUtensils,
      color: "from-amber-500 to-orange-500",
    },
    {
      id: 2,
      type: "ready",
      title: "Order Ready",
      message: "Order #12344 is ready for pickup",
      time: "15 mins ago",
      unread: true,
      icon: FaCheckCircle,
      color: "from-emerald-500 to-green-500",
    },
    {
      id: 3,
      type: "alert",
      title: "Low Stock Alert",
      message: "Margherita Pizza ingredients running low",
      time: "1 hour ago",
      unread: false,
      icon: FaExclamationCircle,
      color: "from-red-500 to-rose-500",
    },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  /* ---------------------- Quick Stats ---------------------- */
  const quickStats = {
    pendingOrders: 5,
    todayRevenue: "₹12,450",
    activeOrders: 8,
  };

  /* -------------------------------------------------------------------------- */
  /*                                MAIN NAVBAR                                 */
  /* -------------------------------------------------------------------------- */
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{
        y: hidden ? -100 : 0,
        opacity: 1,
      }}
      transition={{
        y: { type: "spring", stiffness: 200, damping: 25 },
      }}
      className={`fixed top-0 left-0 w-full flex items-center justify-between backdrop-blur-xl border-b border-orange-200 dark:border-white/10 px-6 py-3 z-50 dark:bg-slate-900/20 dark:text-white ${
        isSolid ? "shadow-lg bg-white/90" : "bg-white/20"
      }`}
    >
      {/* ---------------------- LEFT SECTION ---------------------- */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Sidebar Toggle */}
        <motion.button
          onClick={toggleSidebar}
          className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center hover:shadow-lg transition-all duration-200 group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="flex flex-col gap-1">
            <div className="w-4 h-0.5 bg-gradient-to-r from-amber-600 to-orange-600 rounded-full transition-all group-hover:w-5"></div>
            <div className="w-4 h-0.5 bg-gradient-to-r from-amber-600 to-orange-600 rounded-full"></div>
            <div className="w-4 h-0.5 bg-gradient-to-r from-amber-600 to-orange-600 rounded-full transition-all group-hover:w-5"></div>
          </div>
        </motion.button>

        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <motion.div
            className="relative"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 rounded-2xl blur-lg opacity-40 animate-pulse"></div>

            {/* Logo Container */}
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 flex items-center justify-center shadow-lg">
              <span className="text-2xl">🍽️</span>
            </div>
          </motion.div>

          <div className="hidden sm:block">
            <h1 className="text-xl md:text-2xl font-black bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent leading-tight">
              QuickBite
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 -mt-0.5">
              Restaurant Panel
            </p>
          </div>
        </div>

        {/* Owner Mode Badge */}
        {isOwnerMode && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 text-white text-xs font-semibold shadow-lg"
          >
            <FaCrown className="text-yellow-300" />
            Owner Mode
          </motion.div>
        )}
      </div>

      {/* ---------------------- RIGHT SECTION ---------------------- */}
      <div className="flex items-center gap-3">
        {/* ---------------------- NOTIFICATIONS ---------------------- */}
        <div className="relative" ref={notifRef}>
          <motion.button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative w-10 h-10 rounded-xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center hover:text-orange-500 transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaBell />

            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-red-500 to-rose-600 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg"
              >
                {unreadCount}
              </motion.span>
            )}
          </motion.button>

          {/* NOTIFICATION DROPDOWN */}
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="absolute right-0 mt-3 w-80 md:w-96 bg-white dark:bg-slate-900 backdrop-blur-xl border border-gray-200 dark:border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-50"
              >
                {/* Header */}
                <div className="px-5 py-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-b border-gray-200 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <FaBell className="text-amber-600" />
                      Notifications
                    </h3>
                    {unreadCount > 0 && (
                      <span className="px-2.5 py-0.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs rounded-full font-semibold">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                </div>

                {/* Notifications List */}
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notif, index) => (
                    <motion.div
                      key={notif.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`px-5 py-4 border-b border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/50 cursor-pointer transition-all ${
                        notif.unread
                          ? "bg-amber-50/30 dark:bg-amber-900/10"
                          : ""
                      }`}
                    >
                      <div className="flex gap-3">
                        {/* Icon */}
                        <div
                          className={`flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${notif.color} flex items-center justify-center shadow-md`}
                        >
                          <notif.icon className="text-white text-sm" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                              {notif.title}
                            </h4>
                            {notif.unread && (
                              <div className="w-2 h-2 bg-amber-500 rounded-full flex-shrink-0 mt-1"></div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                            {notif.message}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            {notif.time}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Footer */}
                <div className="px-5 py-3 bg-gray-50 dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700">
                  <button className="w-full text-sm font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors">
                    View All Notifications
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ---------------------- PROFILE ---------------------- */}
        <div className="relative" ref={profileRef}>
          <motion.button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="relative">
              <div className="w-9 h-9 rounded-xl overflow-hidden ring-2 ring-amber-200 dark:ring-amber-800 hover:ring-amber-500 transition-all">
                <img
                  src={user?.avatar || "https://i.pravatar.cc/40"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Online Status */}
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900"></div>
            </div>

            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">
                {user?.name || "Restaurant Owner"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight">
                {isOwnerMode ? "Owner" : "Manager"}
              </p>
            </div>
          </motion.button>

          {/* PROFILE MENU */}
          <AnimatePresence>
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="absolute right-0 mt-3 w-72 bg-white dark:bg-slate-900 backdrop-blur-xl border border-gray-200 dark:border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-50"
              >
                {/* User Info Header */}
                <div className="px-5 py-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-b border-gray-200 dark:border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-xl overflow-hidden ring-2 ring-amber-300 dark:ring-amber-700">
                        <img
                          src={user?.avatar || "https://i.pravatar.cc/56"}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 dark:text-white truncate">
                        {user?.name || "Restaurant Owner"}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                        {user?.email || "owner@quickbite.com"}
                      </p>
                      {isOwnerMode && (
                        <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-gradient-to-r from-emerald-500 to-green-500 text-white text-xs rounded-full font-semibold">
                          <FaCrown className="text-yellow-300" />
                          Owner
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <motion.button
                    whileHover={{ x: 4 }}
                    onClick={() => navigate("/restaurant/profile")}
                    className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 w-full text-left transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
                      <FaUser className="text-amber-600 dark:text-amber-400" />
                    </div>
                    <span className="font-medium">My Profile</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ x: 4 }}
                    onClick={() => navigate("/restaurant/settings")}
                    className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 w-full text-left transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 flex items-center justify-center">
                      <FaCog className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="font-medium">Settings</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ x: 4 }}
                    onClick={() => navigate("/restaurant/orders")}
                    className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 w-full text-left transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center">
                      <FaHistory className="text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="font-medium">Order History</span>
                  </motion.button>
                </div>

                <div className="border-t border-gray-200 dark:border-slate-700 py-2">
                  {/* Owner Mode Toggle */}
                  <motion.button
                    whileHover={{ x: 4 }}
                    onClick={() => setIsOwnerMode((prev) => !prev)}
                    className={`flex items-center gap-3 px-5 py-3 text-sm w-full text-left font-semibold transition-colors ${
                      isOwnerMode
                        ? "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                        : "text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center ${
                        isOwnerMode
                          ? "from-red-100 to-rose-100 dark:from-red-900/30 dark:to-rose-900/30"
                          : "from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30"
                      }`}
                    >
                      <FaCrown
                        className={
                          isOwnerMode ? "text-red-600" : "text-emerald-600"
                        }
                      />
                    </div>
                    <span>
                      {isOwnerMode ? "Exit Owner Mode" : "Enable Owner Mode"}
                    </span>
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {/* Logout */}
        <motion.button
          onClick={handleLogout}
          className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/20
             text-red-600 dark:text-red-400 flex items-center justify-center
             hover:bg-red-200 transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Logout"
          aria-label="Logout"
        >
          <FaSignOutAlt />
        </motion.button>
      </div>
    </motion.header>
  );
};

export default RestaurantNavbar;


// old
// mport React, { useState, useRef, useEffect, useContext } from "react";
// import { FaSignOutAlt } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import Lottie from "lottie-react";

// import NotificationLottie from "../assets/lottie icons/Notification.json";
// import { AuthContext } from "../context/AuthContext";

// const RestaurantNavbar = ({ toggleSidebar, isOwnerMode, setIsOwnerMode }) => {
//   const [showProfileMenu, setShowProfileMenu] = useState(false);
//   const [showNotifications, setShowNotifications] = useState(false);

//   const profileRef = useRef(null);
//   const notifRef = useRef(null);
//   const navigate = useNavigate();
//   const { logout } = useContext(AuthContext);

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (profileRef.current && !profileRef.current.contains(e.target)) {
//         setShowProfileMenu(false);
//       }
//       if (notifRef.current && !notifRef.current.contains(e.target)) {
//         setShowNotifications(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   return (
//     <header className="flex items-center justify-between bg-white dark:bg-gray-900 border-b dark:border-gray-700 shadow px-4 py-3 sticky top-0 z-40 w-full">
//       {/* Sidebar Toggle + Logo */}
//       <div className="flex items-center gap-3">
//         <button
//           onClick={toggleSidebar}
//           aria-label="Toggle Sidebar"
//           className="text-2xl text-gray-600 dark:text-gray-300"
//         >
//           ☰
//         </button>
//         <h1 className="text-xl font-bold text-primary tracking-wide flex items-center gap-2">
//           🍽 QuickBite / Restaurant
//           {isOwnerMode && (
//             <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
//               Owner Mode
//             </span>
//           )}
//         </h1>
//       </div>

//       {/* Right Section */}
//       <div className="flex items-center gap-4 relative">
//         {/* Notifications */}
//         <div className="relative" ref={notifRef}>
//           <button
//             onClick={() => setShowNotifications(!showNotifications)}
//             className="hover:scale-110 transition relative"
//             aria-label="Notifications"
//           >
//             <Lottie
//               animationData={NotificationLottie}
//               style={{ width: 30, height: 30 }}
//             />
//             <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
//               2
//             </span>
//           </button>

//           {showNotifications && (
//             <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded shadow-md text-sm z-50 border dark:border-gray-700 overflow-hidden transition-all duration-200 animate-fade-in">
//               <div className="px-4 py-2 border-b dark:border-gray-600 font-semibold">
//                 Notifications
//               </div>
//               <ul>
//                 <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
//                   New order received!
//                 </li>
//                 <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
//                   Order #123 is ready for pickup.
//                 </li>
//               </ul>
//             </div>
//           )}
//         </div>

//         {/* Profile Dropdown */}
//         <div className="relative" ref={profileRef}>
//           <button
//             onClick={() => setShowProfileMenu(!showProfileMenu)}
//             className="hover:text-primary transition rounded-full w-8 h-8"
//             aria-label="Account Menu"
//           >
//             <img
//               src="https://i.pravatar.cc/40"
//               alt="Restaurant Owner Avatar"
//               className="w-8 h-8 rounded-full object-cover"
//             />
//           </button>
//           {showProfileMenu && (
//             <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded shadow-md text-sm z-50 border dark:border-gray-700 overflow-hidden transition-all duration-200 animate-fade-in">
//               <a
//                 href="/restaurant/profile"
//                 className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
//               >
//                 My Profile
//               </a>
//               <a
//                 href="/restaurant/settings"
//                 className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
//               >
//                 Settings
//               </a>

//               {/* Owner Mode Toggle */}
//               <button
//                 onClick={() => setIsOwnerMode((prev) => !prev)}
//                 className={`w-full text-left px-4 py-2 transition font-medium ${
//                   isOwnerMode
//                     ? "text-red-600 hover:bg-red-100 dark:hover:bg-gray-700"
//                     : "text-green-600 hover:bg-green-100 dark:hover:bg-gray-700"
//                 }`}
//               >
//                 {isOwnerMode ? "Exit Owner Mode" : "Switch to Owner Mode"}
//               </button>
//             </div>
//           )}
//         </div>

//         {/* Logout */}
//         <button
//           onClick={handleLogout}
//           className="hover:text-red-500 transition"
//           title="Logout"
//           aria-label="Logout"
//         >
//           <FaSignOutAlt />
//         </button>
//       </div>
//     </header>
//   );
// };

// export default RestaurantNavbar;
