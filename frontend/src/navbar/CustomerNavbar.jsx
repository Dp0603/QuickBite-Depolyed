import React, { useState, useEffect, useRef, useContext } from "react";
import {
  FaBars,
  // FaSearch,
  FaBell,
  FaShoppingCart,
  FaUser,
  FaSignOutAlt,
  // FaTimes,
  FaCog,
  FaHistory,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";

const CustomerNavbar = ({ toggleSidebar }) => {
  const [isSolid, setIsSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  // const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  // const [searchQuery, setSearchQuery] = useState("");
  const { cartItems, totalItems, fetchCart, cartUpdated } =
    useContext(CartContext);
  const notifRef = useRef(null);
  const cartRef = useRef(null);
  const profileRef = useRef(null);
  const lastScroll = useRef(0);
  const navigate = useNavigate();
  const { logout, user } = useContext(AuthContext);

  // const dummyCart = [
  //   { id: 1, name: "Pizza", quantity: 2, price: 299 },
  //   { id: 2, name: "Burger", quantity: 1, price: 199 },
  // ];
  const notifications = [
    { id: 1, text: "Order delivered!", unread: true },
    { id: 2, text: "50% off on Pizza!", unread: false },
  ];

  // ✅ Fetch cart when user logs in or changes
  useEffect(() => {
    if (user?._id) fetchCart();
  }, [user, cartUpdated]);

  // 🧭 Hide on scroll + bounce reappear
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setIsSolid(y > 50);
      if (y > lastScroll.current && y > 100) setHidden(true);
      else setHidden(false);
      lastScroll.current = y;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🧠 Close dropdowns when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target))
        setShowNotifications(false);
      if (cartRef.current && !cartRef.current.contains(e.target))
        setShowCart(false);
      if (profileRef.current && !profileRef.current.contains(e.target))
        setShowProfile(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const totalCart = totalItems;
  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <>
      {/* 🌟 Navbar */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{
          y: hidden ? -80 : 0,
          opacity: 1,
          backgroundColor: isSolid
            ? "rgba(255,255,255,0.9)"
            : "rgba(255,255,255,0.15)",
        }}
        transition={{
          y: { type: "spring", stiffness: 200, damping: 25 },
          backgroundColor: { duration: 0.3 },
        }}
        className={`fixed top-0 left-0 w-full flex items-center justify-between backdrop-blur-xl border-b border-orange-200 dark:border-white/10 px-6 py-3 z-50 dark:bg-slate-900/20 dark:text-white ${
          isSolid ? "shadow-lg" : "shadow-none"
        }`}
      >
        {/* 🍔 Left Section */}
        <div className="flex items-center gap-4">
          <motion.button
            onClick={toggleSidebar}
            className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center text-orange-600 dark:text-orange-400 hover:bg-orange-200 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaBars />
          </motion.button>

          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-pink-600 rounded-xl blur-md opacity-50"></div>
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center text-white text-2xl shadow-lg">
                🍔
              </div>
            </div>
            <h1 className="text-2xl font-black bg-gradient-to-r from-orange-600 to-pink-600 dark:from-orange-400 dark:to-pink-500 bg-clip-text text-transparent hidden sm:block">
              QuickBite
            </h1>
          </div>
        </div>

        {/* 🎛️ Right Section */}
        <div className="flex items-center gap-3">
          {/* 🔍 Search */}
          {/* <motion.button
            onClick={() => setShowSearch(true)}
            className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center hover:text-orange-500 transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaSearch />
          </motion.button> */}

          {/* 🔔 Notifications */}
          <div className="relative" ref={notifRef}>
            <motion.button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative w-10 h-10 rounded-xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center hover:text-orange-500 transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaBell />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </motion.button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-3 w-72 bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden z-50"
                >
                  <div className="px-4 py-3 font-semibold border-b dark:border-gray-700">
                    Notifications
                  </div>
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`px-4 py-2 text-sm ${
                        n.unread
                          ? "bg-orange-50 dark:bg-orange-500/10"
                          : "hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      {n.text}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 🛒 Cart */}
          <div className="relative" ref={cartRef}>
            <motion.button
              onClick={() => setShowCart(!showCart)}
              className="relative w-10 h-10 rounded-xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center hover:text-orange-500 transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaShoppingCart />
              {totalCart > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                  {totalCart}
                </span>
              )}
            </motion.button>

            <AnimatePresence>
              {showCart && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-3 w-72 bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden z-50"
                >
                  <div className="px-4 py-3 font-semibold border-b dark:border-gray-700">
                    Cart Preview
                  </div>
                  {cartItems.length > 0 ? (
                    cartItems.map((item) => (
                      <div
                        key={item.menuItem?._id}
                        className="px-4 py-2 text-sm flex justify-between hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <span>{item.menuItem?.name || "Item"}</span>
                        <span className="text-gray-500">x{item.quantity}</span>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-sm text-gray-500 text-center">
                      Your cart is empty 🍽️
                    </div>
                  )}

                  <div className="p-3 border-t dark:border-gray-700">
                    <button
                      onClick={() => navigate("/customer/cart")}
                      className="w-full bg-gradient-to-r from-orange-500 to-pink-600 text-white py-2 rounded-lg"
                    >
                      Checkout
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 👤 Profile */}
          <div className="relative" ref={profileRef}>
            <motion.button
              onClick={() => setShowProfile(!showProfile)}
              className="w-10 h-10 rounded-xl overflow-hidden ring-2 ring-orange-200 dark:ring-white/10 hover:ring-orange-500 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img
                src={user?.avatar || "https://i.pravatar.cc/40"}
                alt="User"
                className="w-full h-full object-cover"
              />
            </motion.button>

            <AnimatePresence>
              {showProfile && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-3 w-56 bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden z-50"
                >
                  <div className="px-4 py-3 border-b dark:border-gray-700">
                    <div className="font-semibold">
                      {user?.name || "Customer"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {user?.email || "customer@quickbite.com"}
                    </div>
                  </div>
                  <a
                    href="/customer/profile"
                    className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <FaUser /> Profile
                  </a>
                  <a
                    href="/customer/orders"
                    className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <FaHistory /> Orders
                  </a>
                  <a
                    href="/customer/settings"
                    className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <FaCog /> Settings
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 🚪 Logout */}
          <motion.button
            onClick={logout}
            className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 flex items-center justify-center hover:bg-red-200 transition"
            title="Logout"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaSignOutAlt />
          </motion.button>
        </div>
      </motion.header>

      {/* 🔍 Search Modal */}
      {/* <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
            onClick={() => setShowSearch(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-700 dark:text-white">
                  Search QuickBite
                </h2>
                <button
                  onClick={() => setShowSearch(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-slate-800 hover:text-red-500 transition"
                >
                  <FaTimes />
                </button>
              </div>
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search dishes or restaurants..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:border-orange-500 outline-none"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence> */}
    </>
  );
};

export default CustomerNavbar;

// import React, { useState, useRef, useEffect, useContext } from "react";
// import { FaSignOutAlt } from "react-icons/fa";
// import Lottie from "lottie-react";
// import { useNavigate } from "react-router-dom";

// import SearchLottie from "../assets/lottie icons/Search.json";
// import NotificationLottie from "../assets/lottie icons/Notification.json";
// import CloseLottie from "../assets/lottie icons/Hamburger menu.json";
// import CartLottie from "../assets/lottie icons/Shopping cart.json";
// import { AuthContext } from "../context/AuthContext"; // ✅ Add this

// const CustomerNavbar = ({ toggleSidebar }) => {
//   const [showSearch, setShowSearch] = useState(false);
//   const [showProfileMenu, setShowProfileMenu] = useState(false);
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [showCartPreview, setShowCartPreview] = useState(false);

//   const profileRef = useRef(null);
//   const notifRef = useRef(null);
//   const navigate = useNavigate();
//   const { logout } = useContext(AuthContext); // ✅ Access logout from context

//   const dummyCartItems = [
//     { id: 1, name: "Margherita Pizza", quantity: 2 },
//     { id: 2, name: "Sushi Rolls", quantity: 1 },
//     { id: 3, name: "Tacos", quantity: 1 },
//   ];

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

//   useEffect(() => {
//     const handleEsc = (e) => {
//       if (e.key === "Escape") setShowSearch(false);
//     };
//     document.addEventListener("keydown", handleEsc);
//     return () => document.removeEventListener("keydown", handleEsc);
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
//         <h1 className="text-xl font-bold text-primary tracking-wide">
//           <span role="img" aria-label="burger">
//             🍔 QuickBite
//           </span>
//         </h1>
//       </div>

//       {/* Right Actions */}
//       <div className="flex items-center gap-4 relative">
//         {/* Search */}
//         <button
//           onClick={() => setShowSearch(true)}
//           className="hover:scale-110 transition"
//           aria-label="Search"
//         >
//           <Lottie
//             animationData={SearchLottie}
//             style={{ width: 30, height: 30 }}
//           />
//         </button>

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
//               3
//             </span>
//           </button>

//           {showNotifications && (
//             <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded shadow-md text-sm z-50 border dark:border-gray-700 overflow-hidden transition-all duration-200 animate-fade-in">
//               <div className="px-4 py-2 border-b dark:border-gray-600 font-semibold">
//                 Notifications
//               </div>
//               <ul>
//                 <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
//                   Your order has been shipped!
//                 </li>
//                 <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
//                   New discount available!
//                 </li>
//                 <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
//                   Welcome to QuickBite!
//                 </li>
//               </ul>
//             </div>
//           )}
//         </div>

//         {/* Cart with Hover */}
//         <div
//           className="relative"
//           onMouseEnter={() => setShowCartPreview(true)}
//           onMouseLeave={() => setShowCartPreview(false)}
//         >
//           <button
//             onClick={() => navigate("/customer/cart")}
//             className="hover:scale-110 transition relative"
//             aria-label="Cart"
//           >
//             <Lottie
//               animationData={CartLottie}
//               style={{ width: 30, height: 30 }}
//             />
//             <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
//               {dummyCartItems.reduce((sum, item) => sum + item.quantity, 0)}
//             </span>
//           </button>

//           {showCartPreview && (
//             <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded shadow-md text-sm z-50 border dark:border-gray-700 animate-fade-in transition-all overflow-hidden">
//               <div className="px-4 py-2 border-b dark:border-gray-600 font-semibold">
//                 Cart Preview
//               </div>

//               <ul className="max-h-60 overflow-y-auto">
//                 {dummyCartItems.slice(0, 3).map((item) => (
//                   <li
//                     key={item.id}
//                     className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex justify-between"
//                   >
//                     <span>{item.name}</span>
//                     <span className="text-gray-500 dark:text-gray-400">
//                       × {item.quantity}
//                     </span>
//                   </li>
//                 ))}
//                 {dummyCartItems.length > 3 && (
//                   <li className="px-4 py-2 text-center text-xs text-gray-500 dark:text-gray-400">
//                     + {dummyCartItems.length - 3} more item(s)
//                   </li>
//                 )}
//               </ul>

//               <div className="border-t dark:border-gray-700 p-3">
//                 <button
//                   onClick={() => navigate("/customer/cart")}
//                   className="w-full bg-primary hover:bg-orange-600 transition text-white font-medium py-2 rounded-md text-sm"
//                 >
//                   Proceed to Checkout
//                 </button>
//               </div>
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
//               alt="User Avatar"
//               className="w-8 h-8 rounded-full object-cover"
//             />
//           </button>
//           {showProfileMenu && (
//             <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 rounded shadow-md text-sm z-50 border dark:border-gray-700 overflow-hidden transition-all duration-200 animate-fade-in">
//               <a
//                 href="/customer/profile"
//                 className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
//               >
//                 My Profile
//               </a>
//               <a
//                 href="/customer/settings"
//                 className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
//               >
//                 Settings
//               </a>
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

//       {/* Search Modal */}
//       {showSearch && (
//         <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
//           <div className="bg-white dark:bg-gray-900 w-full max-w-xl rounded-xl shadow-xl p-6 relative animate-fade-in">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-base font-semibold text-gray-700 dark:text-white">
//                 Search
//               </h2>
//               <button
//                 onClick={() => setShowSearch(false)}
//                 className="w-6 h-6"
//                 title="Close"
//                 aria-label="Close Search"
//               >
//                 <Lottie
//                   animationData={CloseLottie}
//                   style={{ width: "100%", height: "100%" }}
//                 />
//               </button>
//             </div>
//             <input
//               type="text"
//               placeholder="Search for dishes, cuisines, or restaurants..."
//               className="w-full px-4 py-3 border rounded-lg dark:bg-gray-800 dark:text-white focus:outline-primary text-sm"
//               autoFocus
//             />
//             <div className="mt-4">
//               <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">
//                 Recent Searches
//               </p>
//               <ul className="flex flex-wrap gap-2">
//                 {["Pizza", "Burger", "Sushi", "Indian", "Tacos"].map((item) => (
//                   <li
//                     key={item}
//                     className="bg-gray-100 dark:bg-gray-800 text-sm px-3 py-1 rounded-full cursor-pointer hover:bg-orange-100 dark:hover:bg-orange-600 transition-colors"
//                   >
//                     {item}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         </div>
//       )}
//     </header>
//   );
// };

// export default CustomerNavbar;
