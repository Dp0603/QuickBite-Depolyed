import React, { useState } from "react";
import { motion } from "framer-motion";
import { Bar } from "react-chartjs-2";
import {
  FaChartLine,
  FaDownload,
  FaFileCsv,
  FaPizzaSlice,
  FaUtensils,
} from "react-icons/fa";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const AdminReports = () => {
  const [month, setMonth] = useState("July");

  const stats = {
    totalRevenue: "₹5.4L",
    totalOrders: 1280,
    totalUsers: 7420,
  };

  const topCategories = [
    { name: "Pizza", orders: 320 },
    { name: "Biryani", orders: 285 },
    { name: "Burgers", orders: 260 },
    { name: "Chinese", orders: 190 },
    { name: "South Indian", orders: 150 },
  ];

  const chartData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Revenue (in ₹K)",
        data: [85, 120, 95, 140],
        backgroundColor: "#FF5722",
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: "#9CA3AF",
        },
      },
      x: {
        ticks: {
          color: "#9CA3AF",
        },
      },
    },
  };

  return (
    <motion.div
      className="min-h-screen w-full bg-gray-50 dark:bg-gray-950 px-4 sm:px-8 md:px-10 lg:px-12 py-8 text-gray-800 dark:text-white"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FaChartLine /> Reports & Insights
        </h2>
        <div className="flex gap-2">
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-secondary text-sm"
          >
            {["July", "June", "May"].map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          <button className="px-3 py-2 text-sm bg-primary text-white rounded hover:bg-orange-600 flex items-center gap-2">
            <FaDownload /> Export PDF
          </button>
          <button className="px-3 py-2 text-sm bg-white border border-gray-300 dark:bg-gray-800 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded flex items-center gap-2">
            <FaFileCsv /> Export CSV
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-white dark:bg-secondary p-5 rounded-xl shadow text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            Total Revenue
          </p>
          <h3 className="text-xl font-bold">{stats.totalRevenue}</h3>
        </div>
        <div className="bg-white dark:bg-secondary p-5 rounded-xl shadow text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            Total Orders
          </p>
          <h3 className="text-xl font-bold">{stats.totalOrders}</h3>
        </div>
        <div className="bg-white dark:bg-secondary p-5 rounded-xl shadow text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            Total Users
          </p>
          <h3 className="text-xl font-bold">{stats.totalUsers}</h3>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-secondary p-6 rounded-xl shadow mb-10">
        <h4 className="text-lg font-semibold mb-4">📊 Weekly Revenue</h4>
        <Bar data={chartData} options={chartOptions} />
      </div>

      {/* Top Categories */}
      <div className="bg-white dark:bg-secondary p-6 rounded-xl shadow">
        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FaUtensils /> Top Performing Categories
        </h4>
        <ul className="space-y-2 text-sm">
          {topCategories.map((cat, idx) => (
            <li
              key={idx}
              className="flex justify-between border-b dark:border-gray-700 pb-2"
            >
              <span className="flex items-center gap-2">
                <FaPizzaSlice className="text-orange-400" /> {cat.name}
              </span>
              <span className="font-semibold text-gray-600 dark:text-gray-300">
                {cat.orders} orders
              </span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export default AdminReports;
