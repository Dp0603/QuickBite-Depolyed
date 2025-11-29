import React, { useState, useEffect, useRef, useContext } from "react";
import { FaBell, FaSignOutAlt, FaUser, FaCog } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminNavbar = ({ toggleSidebar }) => {
  const [isSolid, setIsSolid] = useState(false);
  const [hidden, setHidden] = useState(false);

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const lastScroll = useRef(0);

  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  /* Hide navbar on scroll */
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

  /* Close dropdowns when clicking outside */
  useEffect(() => {
    const close = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target))
        setShowNotifications(false);
      if (profileRef.current && !profileRef.current.contains(e.target))
        setShowProfile(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const notifications = [
    {
      id: 1,
      title: "New Report Generated",
      message: "System generated a new analytics report",
      time: "Just now",
      unread: true,
    },
    {
      id: 2,
      title: "New Login",
      message: "Admin logged in from new device",
      time: "12 mins ago",
      unread: false,
    },
  ];
  const unreadCount = notifications.filter((n) => n.unread).length;

  /* Logout */
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  /* UI */
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{
        y: hidden ? -100 : 0,
        opacity: 1,
        backgroundColor: isSolid
          ? "rgba(255,255,255,0.9)"
          : "rgba(255,255,255,0.15)",
      }}
      transition={{
        y: { type: "spring", stiffness: 200, damping: 25 },
      }}
      className="fixed top-0 left-0 w-full px-6 py-3 z-50
      backdrop-blur-xl border-b border-blue-200/40 dark:border-white/10
      dark:bg-slate-900/20 dark:text-white flex items-center justify-between"
    >
      {/* LEFT */}
      <div className="flex items-center gap-4">
        <motion.button
          onClick={toggleSidebar}
          className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 
          flex items-center justify-center text-blue-600 dark:text-blue-300
          hover:bg-blue-200 dark:hover:bg-blue-800 transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ☰
        </motion.button>

        {/* Admin icon */}
        <motion.div whileHover={{ scale: 1.05 }}>
          <div className="relative">
            <div
              className="absolute inset-0 bg-gradient-to-br 
              from-[#3A8DFF] to-[#7B4DFF]
              dark:from-[#1F4AFF] dark:to-[#661BFF]
              rounded-2xl blur-lg opacity-40 animate-pulse"
            ></div>

            <div
              className="relative w-10 h-10 rounded-xl bg-gradient-to-br 
                from-[#3A8DFF] to-[#7B4DFF]
                dark:from-[#1F4AFF] dark:to-[#661BFF]
                flex items-center justify-center text-white text-2xl shadow-xl"
            >
              🧑‍💼
            </div>
          </div>
        </motion.div>

        <div className="hidden sm:block">
          <h1
            className="text-xl font-black bg-gradient-to-r 
            from-[#3A8DFF] to-[#7B4DFF]
            bg-clip-text text-transparent"
          >
            QuickBite
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1">
            Admin Control Panel
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">
        {/* NOTIFICATIONS */}
        <div className="relative" ref={notifRef}>
          <motion.button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative w-10 h-10 rounded-xl bg-gray-100 dark:bg-slate-800 
            flex items-center justify-center hover:text-blue-500 transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaBell />
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br
                from-blue-500 to-purple-500 text-white text-xs rounded-full
                flex items-center justify-center shadow-lg"
              >
                {unreadCount}
              </motion.span>
            )}
          </motion.button>

          {/* Notification Dropdown */}
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 250, damping: 22 }}
                className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-900
                backdrop-blur-xl border border-gray-200 dark:border-slate-700
                rounded-2xl shadow-2xl overflow-hidden z-50"
              >
                <div
                  className="px-5 py-4 bg-gradient-to-r from-blue-50 to-purple-50
                dark:from-blue-900/20 dark:to-purple-900/20 border-b"
                >
                  <h3 className="font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                    <FaBell className="text-blue-600" />
                    Notifications
                  </h3>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((n, i) => (
                    <motion.div
                      key={n.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="px-5 py-4 border-b border-gray-100 dark:border-slate-800
                      hover:bg-gray-50 dark:hover:bg-slate-800/40 cursor-pointer"
                    >
                      <div className="font-semibold">{n.title}</div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {n.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* PROFILE */}
        <div className="relative" ref={profileRef}>
          <motion.button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-xl
            hover:bg-gray-100 dark:hover:bg-slate-800 transition"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <div className="relative">
              <div
                className="w-9 h-9 rounded-xl overflow-hidden ring-2
              ring-blue-300 dark:ring-blue-800 hover:ring-blue-500 transition"
              >
                <img
                  src={user?.avatar || "https://i.pravatar.cc/40?img=8"}
                  alt="Admin"
                  className="w-full h-full object-cover"
                />
              </div>
              <div
                className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 
              rounded-full border-2 border-white dark:border-slate-900"
              ></div>
            </div>
          </motion.button>

          {/* Profile dropdown (WITHOUT logout) */}
          <AnimatePresence>
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.96 }}
                transition={{ type: "spring", stiffness: 240, damping: 22 }}
                className="absolute right-0 mt-3 w-72 bg-white dark:bg-slate-900
                backdrop-blur-xl border border-gray-200 dark:border-slate-700 
                rounded-2xl shadow-2xl overflow-hidden z-50"
              >
                {/* Header */}
                <div
                  className="px-5 py-4 bg-gradient-to-r from-blue-50 to-purple-50
                dark:from-blue-900/20 dark:to-purple-900/20 border-b"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div
                        className="w-14 h-14 rounded-xl overflow-hidden ring-2
                      ring-blue-300 dark:ring-blue-700"
                      >
                        <img
                          src={user?.avatar || "https://i.pravatar.cc/56?img=8"}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div
                        className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 
                      rounded-full border-2 border-white dark:border-slate-900"
                      ></div>
                    </div>

                    <div>
                      <h4 className="font-bold">
                        {user?.name || "Admin User"}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {user?.email || "admin@quickbite.com"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <motion.button
                    whileHover={{ x: 4 }}
                    onClick={() => navigate("/admin/profile")}
                    className="flex items-center gap-3 px-5 py-3 text-sm 
                    hover:bg-gray-50 dark:hover:bg-slate-800 w-full transition"
                  >
                    <div
                      className="w-8 h-8 rounded-lg bg-gradient-to-br
                    from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30
                    flex items-center justify-center"
                    >
                      <FaUser className="text-blue-600 dark:text-blue-300" />
                    </div>
                    Profile
                  </motion.button>

                  <motion.button
                    whileHover={{ x: 4 }}
                    onClick={() => navigate("/admin/settings")}
                    className="flex items-center gap-3 px-5 py-3 text-sm 
                    hover:bg-gray-50 dark:hover:bg-slate-800 w-full transition"
                  >
                    <div
                      className="w-8 h-8 rounded-lg bg-gradient-to-br
                    from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30
                    flex items-center justify-center"
                    >
                      <FaCog className="text-purple-600 dark:text-purple-300" />
                    </div>
                    Settings
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ONLY LOGOUT BUTTON (Top-right) */}
        <motion.button
          onClick={handleLogout}
          className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/20
          text-red-600 dark:text-red-400 flex items-center justify-center
          hover:bg-red-200 transition shadow-sm"
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.93 }}
          title="Logout"
        >
          <FaSignOutAlt />
        </motion.button>
      </div>
    </motion.header>
  );
};

export default AdminNavbar;

// import React, { useState, useRef, useEffect, useContext } from "react";
// import { FaSignOutAlt } from "react-icons/fa";
// import Lottie from "lottie-react";
// import { useNavigate } from "react-router-dom";

// import NotificationLottie from "../assets/lottie icons/Notification.json";
// import CloseLottie from "../assets/lottie icons/Hamburger menu.json";
// import { AuthContext } from "../context/AuthContext";

// const AdminNavbar = ({ toggleSidebar }) => {
//   const [showProfileMenu, setShowProfileMenu] = useState(false);
//   const [showNotifications, setShowNotifications] = useState(false);
//   const profileRef = useRef(null);
//   const notifRef = useRef(null);
//   const navigate = useNavigate();
//   const { logout } = useContext(AuthContext); // ✅ Use logout function

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (profileRef.current && !profileRef.current.contains(event.target)) {
//         setShowProfileMenu(false);
//       }
//       if (notifRef.current && !notifRef.current.contains(event.target)) {
//         setShowNotifications(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const handleLogout = () => {
//     logout(); // Clear user & token from context and localStorage
//     navigate("/login"); // Redirect to login page
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
//         <h1 className="text-xl font-bold text-primary tracking-wide">
//           <span role="img" aria-label="admin-tools">
//             🛠️
//           </span>{" "}
//           QuickBite <span className="text-sm font-normal">/ Admin</span>
//         </h1>
//       </div>

//       {/* Right Actions */}
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
//                   New restaurant signup pending.
//                 </li>
//                 <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
//                   Complaint received from user #123
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
//               src="https://i.pravatar.cc/40?img=2"
//               alt="Admin Avatar"
//               className="w-8 h-8 rounded-full object-cover"
//             />
//           </button>
//           {showProfileMenu && (
//             <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 rounded shadow-md text-sm z-50 border dark:border-gray-700 overflow-hidden transition-all duration-200 animate-fade-in">
//               <a
//                 href="/admin/profile"
//                 className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
//               >
//                 My Profile
//               </a>
//               <a
//                 href="/admin/settings"
//                 className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
//               >
//                 Settings
//               </a>
//             </div>
//           )}
//         </div>

//         {/* ✅ Logout Button */}
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

// export default AdminNavbar;
