// src/pages/Admin/AdminDashboard.jsx
import React, { useEffect, useState, useMemo } from "react";
import API from "../../api/axios";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

import {
  FaUsers,
  FaShoppingCart,
  FaRupeeSign,
  FaChartPie,
  FaStar,
  FaMapMarkerAlt,
  FaBell,
  FaDownload,
  FaTasks,
} from "react-icons/fa";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const COLORS = ["#FF5722", "#FF9800", "#FFC107", "#4CAF50", "#2196F3"];

  // ✅ Fetch Dashboard Data
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await API.get("/admin/dashboard-stats");
        setStats(data?.data || {});
      } catch (err) {
        console.error("❌ Error fetching dashboard stats:", err);
        setError("Failed to load dashboard stats. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const dayMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const weeklyOrders = useMemo(
    () =>
      stats?.weeklyOrders?.map((d) => ({
        day: dayMap[d._id - 1],
        orders: d.orders,
      })) || [],
    [stats]
  );

  const topRestaurants = stats?.topRestaurants || [];

  const geoData = useMemo(
    () =>
      stats?.cityDistribution?.map((c) => ({
        name: c._id,
        value: c.value,
      })) || [],
    [stats]
  );

  const orderStatus = stats?.orderStatus || [];

  const notifications = [
    "🍽️ 3 new restaurants pending approval",
    "🚨 5 complaints unresolved",
    "📦 2 delayed orders flagged by delivery agents",
    "💰 1 payout pending confirmation",
  ];

  const auditLog = [
    "✔️ Approved 'Ramen King' restaurant",
    "🚫 Banned user Ravi Mehra",
    "💸 Issued payout of ₹12,000 to Pizza Hub",
    "📝 Updated system-wide delivery fee settings",
  ];

  const exportOrdersCSV = () => {
    window.open(`${API_URL}/admin/export/orders-csv`, "_blank");
  };
  const exportRevenuePDF = () => {
    window.open(`${API_URL}/admin/export/revenue-pdf`, "_blank");
  };
  const exportUsersXLSX = () => {
    window.open(`${API_URL}/admin/export/users-xlsx`, "_blank");
  };

  // 🌀 Loading State
  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600 dark:text-gray-300 text-lg animate-pulse">
          Loading dashboard...
        </p>
      </div>
    );

  // ⚠️ Error State
  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 font-medium">{error}</p>
      </div>
    );

  const totalUsers = stats?.totals?.totalUsers || 0;
  const totalOrders = stats?.totals?.totalOrders || 0;
  const totalSales = stats?.totals?.totalSales || 0;
  const totalRestaurants = stats?.totals?.totalRestaurants || 0;

  return (
    <motion.div
      className="min-h-screen w-full bg-gray-50 dark:bg-gray-950 px-4 sm:px-8 md:px-10 lg:px-12 py-8 text-gray-800 dark:text-white"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Welcome */}
      <h2 className="text-3xl font-bold mb-2">Welcome, Admin 🛠️</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Here’s your updated QuickBite platform summary.
      </p>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white dark:bg-secondary rounded-xl p-5 shadow hover:shadow-lg transition">
          <FaUsers className="text-2xl text-primary mb-2" />
          <h4 className="text-xl font-semibold">{totalUsers} Users</h4>
          <p className="text-sm text-gray-500">Total Registered</p>
        </div>

        <div className="bg-white dark:bg-secondary rounded-xl p-5 shadow hover:shadow-lg transition">
          <FaShoppingCart className="text-2xl text-orange-500 mb-2" />
          <h4 className="text-xl font-semibold">{totalOrders} Orders</h4>
          <p className="text-sm text-gray-500">Total Orders</p>
        </div>

        <div className="bg-white dark:bg-secondary rounded-xl p-5 shadow hover:shadow-lg transition">
          <FaRupeeSign className="text-2xl text-green-500 mb-2" />
          <h4 className="text-xl font-semibold">
            ₹{totalSales.toLocaleString()}
          </h4>
          <p className="text-sm text-gray-500">Total Revenue</p>
        </div>

        <div className="bg-white dark:bg-secondary rounded-xl p-5 shadow hover:shadow-lg transition">
          <FaChartPie className="text-2xl text-blue-500 mb-2" />
          <h4 className="text-xl font-semibold">
            {totalRestaurants} Restaurants
          </h4>
          <p className="text-sm text-gray-500">Active on Platform</p>
        </div>
      </div>

      {/* Orders Breakdown */}
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <FaChartPie /> Order Status Breakdown
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {orderStatus.map((s, i) => (
          <div
            key={i}
            className="bg-white dark:bg-secondary p-4 rounded-xl shadow text-center"
          >
            <p className="text-lg font-bold text-primary">{s.count}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{s._id}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-8 mb-10">
        {/* Weekly Order Trend */}
        <div className="bg-white dark:bg-secondary rounded-xl p-6 shadow">
          <h4 className="text-lg font-semibold mb-4">📈 Weekly Order Trend</h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={weeklyOrders}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="orders"
                stroke="#FF5722"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* City Distribution */}
        <div className="bg-white dark:bg-secondary rounded-xl p-6 shadow">
          <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FaMapMarkerAlt /> City-wise Order Distribution
          </h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={geoData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
                label
              >
                {geoData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Restaurants */}
      <h3 className="text-xl font-semibold mb-4">🍱 Top 5 Restaurants</h3>
      <div className="overflow-x-auto mb-10">
        <table className="min-w-[500px] w-full text-sm text-left text-gray-600 dark:text-gray-300">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700 text-sm">
              <th className="px-4 py-3">Restaurant</th>
              <th className="px-4 py-3">Orders</th>
              <th className="px-4 py-3">Rating</th>
            </tr>
          </thead>
          <tbody>
            {topRestaurants.map((r, idx) => (
              <tr
                key={idx}
                className="border-b dark:border-gray-700 hover:bg-orange-50 dark:hover:bg-gray-800 transition cursor-pointer"
              >
                <td className="px-4 py-3">{r.name}</td>
                <td className="px-4 py-3 font-semibold">{r.orders}</td>
                <td className="px-4 py-3 flex items-center gap-1">
                  <FaStar className="text-yellow-400" /> {r.rating}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Notifications & Audit Log */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white dark:bg-secondary p-5 rounded-xl shadow">
          <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <FaBell /> Notifications
          </h4>
          <ul className="space-y-2 text-sm">
            {notifications.map((note, i) => (
              <li key={i} className="border-b dark:border-gray-700 pb-2">
                {note}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white dark:bg-secondary p-5 rounded-xl shadow">
          <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <FaTasks /> Recent Activity
          </h4>
          <ul className="space-y-2 text-sm">
            {auditLog.map((log, i) => (
              <li key={i} className="border-b dark:border-gray-700 pb-2">
                {log}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Export Buttons */}
      <div className="bg-white dark:bg-secondary rounded-xl p-5 shadow text-center text-sm text-gray-500 dark:text-gray-400">
        📤 Quick Export:
        <div className="mt-3 flex flex-wrap justify-center gap-3">
          <button
            onClick={exportOrdersCSV}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-orange-600 transition flex items-center gap-2"
          >
            <FaDownload /> Orders CSV
          </button>
          <button
            onClick={exportRevenuePDF}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-orange-600 transition flex items-center gap-2"
          >
            <FaDownload /> Revenue PDF
          </button>
          <button
            onClick={exportUsersXLSX}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-orange-600 transition flex items-center gap-2"
          >
            <FaDownload /> Users XLSX
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
