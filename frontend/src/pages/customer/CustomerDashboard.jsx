// src/pages/Customer/CustomerDashboard.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { FaStar, FaUtensils, FaHistory, FaPlusCircle } from "react-icons/fa";

const CustomerDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${
            import.meta.env.VITE_API_URL || "http://localhost:5000/"
          }/orders`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setOrders(res.data.orders || []);
      } catch (err) {
        setError("Failed to load orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent to-white dark:from-[#232526] dark:to-[#414345] px-4 py-10 md:px-10 transition-colors">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary dark:text-white mb-2 flex items-center gap-2">
            <FaUtensils className="text-orange-400" /> Welcome, Foodie!
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Here’s a snapshot of your food journey with QuickBite.
          </p>
        </motion.div>

        {/* Orders Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-secondary dark:text-white">
              Recent Orders
            </h2>
            <button
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full shadow hover:bg-orange-600 transition"
              onClick={() => navigate("/customer/browse")}
            >
              <FaPlusCircle /> New Order
            </button>
          </div>
          <div className="bg-white dark:bg-[#232526] rounded-xl shadow-lg overflow-x-auto">
            {loading ? (
              <div className="py-10 text-center text-primary font-semibold">
                Loading your orders...
              </div>
            ) : error ? (
              <div className="py-10 text-center text-red-500">{error}</div>
            ) : orders.length === 0 ? (
              <div className="py-10 text-center text-gray-500 dark:text-gray-300">
                You haven’t placed any orders yet.
              </div>
            ) : (
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-accent dark:bg-[#353535] text-secondary dark:text-white">
                    <th className="py-3 px-4 text-left">Restaurant</th>
                    <th className="py-3 px-4 text-left">Items</th>
                    <th className="py-3 px-4 text-left">Status</th>
                    <th className="py-3 px-4 text-left">Ordered At</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr
                      key={o._id}
                      className="border-t border-gray-100 dark:border-gray-700 hover:bg-orange-50 dark:hover:bg-[#2d2d2d] transition"
                    >
                      <td className="py-2 px-4 font-medium">{o.restaurantName}</td>
                      <td className="py-2 px-4">
                        {o.items.map((item) => (
                          <span key={item._id} className="block">
                            {item.name} × {item.quantity}
                          </span>
                        ))}
                      </td>
                      <td className="py-2 px-4">
                        <span
                          className={`capitalize px-2 py-1 rounded text-xs font-semibold ${
                            o.status === "delivered"
                              ? "bg-green-100 text-green-700"
                              : o.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {o.status}
                        </span>
                      </td>
                      <td className="py-2 px-4">
                        {new Date(o.createdAt).toLocaleString([], {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>

        {/* Actions & Feedback */}
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ duration: 0.25 }}
            className="bg-white dark:bg-[#232526] p-7 rounded-xl shadow-lg flex flex-col justify-between"
          >
            <div>
              <h3 className="text-xl font-semibold text-primary dark:text-orange-300 mb-2 flex items-center gap-2">
                <FaUtensils /> Quick Actions
              </h3>
              <ul className="list-disc ml-6 text-gray-700 dark:text-gray-300 text-sm space-y-1">
                <li>Browse restaurants & menus</li>
                <li>Add items to cart and place orders</li>
                <li>Track your ongoing deliveries</li>
              </ul>
            </div>
            <button
              className="mt-6 px-5 py-2 rounded-full bg-primary text-white hover:bg-orange-600 transition font-semibold"
              onClick={() => navigate("/customer/browse")}
            >
              🍔 Order Food
            </button>
          </motion.div>

          <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ duration: 0.25 }}
            className="bg-white dark:bg-[#232526] p-7 rounded-xl shadow-lg flex flex-col justify-between"
          >
            <div>
              <h3 className="text-xl font-semibold text-primary dark:text-orange-300 mb-2 flex items-center gap-2">
                <FaStar /> Feedback & Reviews
              </h3>
              <ul className="list-disc ml-6 text-gray-700 dark:text-gray-300 text-sm space-y-1">
                <li>Rate your recent orders</li>
                <li>Write reviews for restaurants</li>
                <li>See your review history</li>
              </ul>
            </div>
            <button
              className="mt-6 px-5 py-2 rounded-full bg-primary text-white hover:bg-orange-600 transition font-semibold"
              onClick={() => navigate("/customer/reviews")}
            >
              ✍️ Give Feedback
            </button>
          </motion.div>
        </div>

        {/* Order History Shortcut */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
          className="mt-12 bg-accent dark:bg-[#353535] rounded-xl shadow p-6 flex items-center gap-4"
        >
          <FaHistory className="text-2xl text-primary dark:text-orange-300" />
          <div className="flex-1">
            <div className="font-semibold text-secondary dark:text-white">
              Want to see your full order history?
            </div>
            <div className="text-gray-600 dark:text-gray-300 text-sm">
              View all your past orders and reorder your favorites.
            </div>
          </div>
          <button
            className="ml-auto px-4 py-2 rounded-full bg-primary text-white hover:bg-orange-600 transition font-semibold"
            onClick={() => navigate("/customer/orders")}
          >
            View History
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default CustomerDashboard;


// Figma ui
// import React from "react";
// import { motion } from "framer-motion";
// import { FaBell, FaUserCircle, FaCrown, FaHeart, FaStar } from "react-icons/fa";
// import { FiSearch } from "react-icons/fi";
// import { BsClockHistory } from "react-icons/bs";

// const CustomerDashboard = () => {
//   return (
//     <motion.div
//       className="bg-accent dark:bg-secondary text-gray-800 dark:text-white min-h-screen"
//       initial={{ opacity: 0, y: 50 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.4 }}
//     >
//       {/* 🌐 Header */}
//       <header className="flex justify-between items-center px-6 py-4 bg-white dark:bg-secondary shadow sticky top-0 z-50">
//         <h1 className="text-2xl font-bold">
//           Quick<span className="text-primary">Bite</span> 🍔
//         </h1>
//         <div className="flex items-center gap-5 text-xl">
//           <FiSearch className="hover:text-primary cursor-pointer" />
//           <FaBell className="hover:text-primary cursor-pointer" />
//           <FaUserCircle className="hover:text-primary cursor-pointer" />
//         </div>
//       </header>

//       {/* 🔍 Search Bar */}
//       <div className="max-w-6xl mx-auto px-4 pt-6">
//         <input
//           type="text"
//           placeholder="Search for dishes, cuisines, or restaurants..."
//           className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-secondary shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
//         />
//       </div>

//       {/* 👑 Premium Banner */}
//       <div className="max-w-6xl mx-auto px-4 mt-6">
//         <div className="bg-gradient-to-r from-orange-100 to-orange-200 dark:from-orange-700 dark:to-orange-600 rounded-xl p-5 flex justify-between items-center shadow hover:shadow-md transition">
//           <div className="flex items-center gap-3">
//             <FaCrown className="text-yellow-600 text-2xl" />
//             <div>
//               <h2 className="font-semibold text-lg">Premium Member</h2>
//               <p className="text-sm text-gray-700 dark:text-gray-200">Valid until March 2025</p>
//             </div>
//           </div>
//           <div className="text-right">
//             <p className="text-xs text-gray-500">This month saved</p>
//             <h3 className="font-bold text-xl text-green-600 dark:text-green-300">₹4,150</h3>
//           </div>
//         </div>
//       </div>

//       {/* 🍽️ Recommended */}
//       <section className="max-w-6xl mx-auto px-4 mt-10">
//         <h3 className="text-xl font-semibold mb-4">🍽️ Recommended For You</h3>
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//           {["Pasta House", "Sushi Express", "Burger Palace"].map((res, i) => (
//             <div
//               key={i}
//               className="bg-white dark:bg-secondary p-4 rounded-xl shadow hover:shadow-md transition"
//             >
//               <div className="h-24 bg-gray-100 dark:bg-gray-700 rounded mb-3 flex items-center justify-center text-sm text-gray-400">
//                 Restaurant Image
//               </div>
//               <h4 className="font-semibold">{res}</h4>
//               <p className="text-sm text-gray-500 dark:text-gray-300">
//                 20–30 min • FREE DELIVERY
//               </p>
//               <div className="flex items-center text-yellow-500 mt-1 text-sm">
//                 <FaStar className="mr-1" /> 4.{i + 6}
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* 🕒 Recent Orders */}
//       <section className="max-w-6xl mx-auto px-4 mt-10">
//         <h3 className="text-xl font-semibold mb-4 flex items-center">
//           <BsClockHistory className="mr-2" /> Recent Orders
//         </h3>
//         <ul className="space-y-4">
//           {[
//             { name: "Margherita Pizza", price: "₹299", status: "Delivered ✔️" },
//             { name: "Teriyaki Bowl", price: "₹199", status: "Canceled ❌" },
//             { name: "Caesar Salad", price: "₹149", status: "Ongoing 🛵" },
//           ].map((item, i) => (
//             <li
//               key={i}
//               className="bg-white dark:bg-secondary p-4 rounded-xl flex justify-between items-center shadow hover:shadow-md"
//             >
//               <div>
//                 <h4 className="font-medium">{item.name}</h4>
//                 <p className="text-xs text-gray-500">Jan {15 - i}, 2025</p>
//               </div>
//               <div className="text-right">
//                 <p className="font-semibold">{item.price}</p>
//                 <p className="text-sm text-gray-400">{item.status}</p>
//               </div>
//             </li>
//           ))}
//         </ul>
//       </section>

//       {/* ❤️ Favorites */}
//       <section className="max-w-6xl mx-auto px-4 mt-10 pb-12">
//         <h3 className="text-xl font-semibold mb-4 flex items-center">
//           <FaHeart className="text-pink-500 mr-2" /> Your Favorites
//         </h3>
//         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
//           {["Taco Bell", "Starbucks", "Thai Garden", "Pizza Hut"].map((fav, i) => (
//             <div
//               key={i}
//               className="bg-white dark:bg-secondary p-4 rounded-xl shadow hover:shadow-md text-center transition"
//             >
//               <div className="h-20 bg-gray-200 dark:bg-gray-700 mb-3 rounded flex items-center justify-center text-sm text-gray-400">
//                 IMG
//               </div>
//               <h4 className="font-semibold">{fav}</h4>
//               <p className="text-sm text-gray-500">Fast Food</p>
//             </div>
//           ))}
//         </div>
//       </section>
//     </motion.div>
//   );
// };

// export default CustomerDashboard;
