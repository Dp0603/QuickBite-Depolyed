import React from "react";
import {
  FaUtensils,
  FaRupeeSign,
  FaClock,
  FaChartLine,
  FaStar,
  FaCheckCircle,
} from "react-icons/fa";
import { motion } from "framer-motion";

const RestaurantDashboard = () => {
  const stats = [
    {
      label: "Today’s Orders",
      value: 38,
      icon: <FaUtensils className="text-orange-500 text-xl" />,
    },
    {
      label: "Earnings",
      value: "₹8,450",
      icon: <FaRupeeSign className="text-green-500 text-xl" />,
    },
    {
      label: "Avg Prep Time",
      value: "27 mins",
      icon: <FaClock className="text-blue-500 text-xl" />,
    },
  ];

  const topDishes = [
    { name: "Paneer Butter Masala", orders: 120 },
    { name: "Cheese Burst Pizza", orders: 97 },
    { name: "Chicken Biryani", orders: 83 },
  ];

  const recentOrders = [
    {
      customer: "Rahul Sharma",
      dish: "Veg Manchurian",
      time: "11:30 AM",
      status: "Delivered",
    },
    {
      customer: "Sneha R.",
      dish: "Chicken Wrap",
      time: "12:10 PM",
      status: "Ongoing",
    },
    {
      customer: "Amit Patel",
      dish: "Paneer Tikka",
      time: "1:00 PM",
      status: "Cancelled",
    },
  ];

  return (
    <motion.div
      className="px-6 py-8 text-gray-800 dark:text-white"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* 👋 Welcome */}
      <h2 className="text-3xl font-bold mb-2">Welcome back, Chef! 👨‍🍳</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Here's how your kitchen is performing today.
      </p>

      {/* 📊 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-secondary rounded-xl p-5 shadow hover:shadow-md flex items-center gap-4"
          >
            <div>{stat.icon}</div>
            <div>
              <h4 className="text-xl font-semibold">{stat.value}</h4>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 🔥 Top Selling Dishes */}
      <div className="mb-10">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FaChartLine /> Top Selling Dishes
        </h3>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {topDishes.map((dish, i) => (
            <div
              key={i}
              className="bg-white dark:bg-secondary p-4 rounded-xl shadow hover:shadow-md"
            >
              <div className="h-24 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center mb-3 text-sm text-gray-400">
                Dish Image
              </div>
              <h4 className="font-semibold">{dish.name}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-300">
                {dish.orders} orders
              </p>
              <div className="flex items-center mt-1 text-yellow-500 text-sm">
                <FaStar className="mr-1" /> 4.{8 - i}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🕒 Recent Orders */}
      <div>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FaCheckCircle /> Recent Orders
        </h3>
        <div className="grid gap-4">
          {recentOrders.map((order, i) => (
            <div
              key={i}
              className="bg-white dark:bg-secondary rounded-lg shadow p-4 flex justify-between items-center hover:shadow-md"
            >
              <div>
                <h4 className="font-medium">{order.dish}</h4>
                <p className="text-xs text-gray-500">
                  {order.customer} • {order.time}
                </p>
              </div>
              <div className="text-right">
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
      </div>
    </motion.div>
  );
};

export default RestaurantDashboard;
