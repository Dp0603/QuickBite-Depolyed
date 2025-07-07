import React from "react";
import {
  FaCrown,
  FaStar,
  FaHeart,
  FaShoppingCart,
  FaClock,
} from "react-icons/fa";
import { motion } from "framer-motion";

const CustomerDashboard = () => {
  const recommended = ["Sushi Express", "Pizza Hut", "Thai Garden"];
  const recentOrders = [
    {
      name: "Cheesy Margherita",
      date: "Jul 5, 2025",
      price: "₹299",
      status: "Delivered",
    },
    {
      name: "Spicy Ramen Bowl",
      date: "Jul 3, 2025",
      price: "₹349",
      status: "Ongoing",
    },
    {
      name: "Tandoori Platter",
      date: "Jul 1, 2025",
      price: "₹499",
      status: "Cancelled",
    },
  ];

  return (
    <motion.div
      className="px-4 sm:px-8 md:px-10 lg:px-12 py-8 text-gray-800 dark:text-white"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* 👋 Welcome */}
      <h2 className="text-3xl font-bold mb-2">Welcome back, Foodie! 👋</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Here’s what’s cooking in your QuickBite world.
      </p>

      {/* 📊 Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white dark:bg-secondary rounded-xl p-5 shadow hover:shadow-md">
          <FaShoppingCart className="text-2xl text-primary mb-2" />
          <h4 className="text-xl font-semibold">12 Orders</h4>
          <p className="text-sm text-gray-500">Last 30 days</p>
        </div>
        <div className="bg-white dark:bg-secondary rounded-xl p-5 shadow hover:shadow-md">
          <FaCrown className="text-2xl text-yellow-500 mb-2" />
          <h4 className="text-xl font-semibold">₹4,150 Saved</h4>
          <p className="text-sm text-gray-500">Using Premium</p>
        </div>
        <div className="bg-white dark:bg-secondary rounded-xl p-5 shadow hover:shadow-md">
          <FaStar className="text-2xl text-yellow-400 mb-2" />
          <h4 className="text-xl font-semibold">4.8 Rating</h4>
          <p className="text-sm text-gray-500">From your reviews</p>
        </div>
      </div>

      {/* 🔥 Premium Banner */}
      <div className="bg-gradient-to-r from-orange-100 to-orange-200 dark:from-orange-600 dark:to-orange-500 rounded-xl p-6 flex justify-between items-center mb-10 shadow hover:shadow-lg transition">
        <div className="flex items-center gap-4">
          <FaCrown className="text-yellow-600 text-3xl" />
          <div>
            <h2 className="text-lg font-semibold">Premium Membership Active</h2>
            <p className="text-sm text-gray-700 dark:text-gray-200">
              Valid till: March 2025
            </p>
          </div>
        </div>
        <button className="bg-white text-primary font-medium px-4 py-2 rounded-lg shadow hover:bg-gray-100">
          View Benefits
        </button>
      </div>

      {/* 🍽️ Recommended */}
      <h3 className="text-xl font-semibold mb-4">🍽️ Recommended Restaurants</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
        {recommended.map((name, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-secondary p-4 rounded-xl shadow hover:shadow-md transition"
          >
            <div className="h-24 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center mb-3 text-sm text-gray-400">
              Restaurant Image
            </div>
            <h4 className="font-semibold">{name}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-300">
              30–40 min • ₹20 Delivery
            </p>
            <div className="flex items-center mt-1 text-yellow-500 text-sm">
              <FaStar className="mr-1" /> 4.{8 - idx}
            </div>
          </div>
        ))}
      </div>

      {/* 🕒 Recent Orders */}
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <FaClock /> Recent Orders
      </h3>
      <div className="grid gap-4">
        {recentOrders.map((order, i) => (
          <div
            key={i}
            className="bg-white dark:bg-secondary rounded-lg shadow p-4 flex justify-between items-center hover:shadow-md"
          >
            <div>
              <h4 className="font-medium">{order.name}</h4>
              <p className="text-xs text-gray-500">{order.date}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">{order.price}</p>
              <span
                className={`text-sm font-medium ${
                  order.status === "Delivered"
                    ? "text-green-600"
                    : order.status === "Ongoing"
                    ? "text-yellow-600"
                    : "text-red-500"
                }`}
              >
                {order.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default CustomerDashboard;
