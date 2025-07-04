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
