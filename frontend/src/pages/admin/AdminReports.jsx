import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bar, Pie } from "react-chartjs-2";
import {
  FaChartLine,
  FaDownload,
  FaFileCsv,
  FaPizzaSlice,
  FaUtensils,
  FaUsers,
  FaShoppingCart,
  FaMoneyBillWave,
} from "react-icons/fa";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import API from "../../api/axios";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement
);

const AdminReports = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [month, setMonth] = useState("July");
  const [overview, setOverview] = useState(null);
  const [salesTrends, setSalesTrends] = useState([]);
  const [topRestaurants, setTopRestaurants] = useState([]);
  const [customerStats, setCustomerStats] = useState(null);
  const [topCategories, setTopCategories] = useState([]);

  // Month mapping
  const monthMap = { May: 5, June: 6, July: 7 };

  const fetchReports = async (selectedMonth = month) => {
    try {
      setLoading(true);
      setError(null);

      const [salesRes, restaurantRes, customerRes, categoriesRes] =
        await Promise.all([
          API.get(`admin/reports/sales?month=${monthMap[selectedMonth]}`),
          API.get("admin/reports/restaurants"),
          API.get("admin/reports/customers"),
          API.get(
            `admin/reports/top-categories?month=${monthMap[selectedMonth]}`
          ),
        ]);

      setOverview(salesRes.data.data.summary || null);
      setSalesTrends(salesRes.data.data.dailyTrends || []);
      setTopRestaurants(restaurantRes.data.data || []);
      setCustomerStats(customerRes.data.data || null);
      setTopCategories(categoriesRes.data.data || []);
    } catch (err) {
      console.error("Error fetching admin reports:", err);
      setError("Failed to fetch reports. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleMonthChange = (e) => {
    setMonth(e.target.value);
    fetchReports(e.target.value);
  };

  const handleExportPDF = () => {
    window.open(`${API.defaults.baseURL}admin/reports/export/pdf`, "_blank");
  };

  const handleExportCSV = () => {
    window.open(`${API.defaults.baseURL}admin/reports/export/csv`, "_blank");
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 dark:text-gray-300">
        Loading reports...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );

  // Charts
  const chartData = {
    labels: salesTrends.map((t) => t._id),
    datasets: [
      {
        label: "Revenue (₹)",
        data: salesTrends.map((t) => t.totalRevenue / 1000),
        backgroundColor: "#FF5722",
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, ticks: { color: "#9CA3AF" } },
      x: { ticks: { color: "#9CA3AF" } },
    },
  };

  const categoryData = {
    labels: topCategories.map((c) => c.name),
    datasets: [
      {
        label: "Orders",
        data: topCategories.map((c) => c.totalOrders),
        backgroundColor: [
          "#FF5722",
          "#FFC107",
          "#4CAF50",
          "#03A9F4",
          "#9C27B0",
          "#E91E63",
        ],
      },
    ],
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
            onChange={handleMonthChange}
            className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-secondary text-sm"
          >
            {["July", "June", "May"].map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          <button
            className="px-3 py-2 text-sm bg-primary text-white rounded hover:bg-orange-600 flex items-center gap-2"
            onClick={handleExportPDF}
          >
            <FaDownload /> Export PDF
          </button>
          <button
            className="px-3 py-2 text-sm bg-white border border-gray-300 dark:bg-gray-800 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded flex items-center gap-2"
            onClick={handleExportCSV}
          >
            <FaFileCsv /> Export CSV
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      {overview && customerStats && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-10">
          <div className="bg-white dark:bg-secondary p-5 rounded-xl shadow text-center flex flex-col items-center justify-center">
            <FaMoneyBillWave className="text-2xl text-orange-500 mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Total Revenue
            </p>
            <h3 className="text-xl font-bold">₹{overview.totalRevenue}</h3>
          </div>
          <div className="bg-white dark:bg-secondary p-5 rounded-xl shadow text-center flex flex-col items-center justify-center">
            <FaShoppingCart className="text-2xl text-green-500 mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Total Orders
            </p>
            <h3 className="text-xl font-bold">{overview.totalOrders}</h3>
          </div>
          <div className="bg-white dark:bg-secondary p-5 rounded-xl shadow text-center flex flex-col items-center justify-center">
            <FaUsers className="text-2xl text-blue-500 mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Total Customers
            </p>
            <h3 className="text-xl font-bold">
              {customerStats.totalCustomers}
            </h3>
          </div>
          <div className="bg-white dark:bg-secondary p-5 rounded-xl shadow text-center flex flex-col items-center justify-center">
            <FaMoneyBillWave className="text-2xl text-purple-500 mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Avg Order Value
            </p>
            <h3 className="text-xl font-bold">
              ₹{overview.avgOrderValue?.toFixed(2)}
            </h3>
          </div>
        </div>
      )}

      {/* Revenue Chart */}
      <div className="bg-white dark:bg-secondary p-6 rounded-xl shadow mb-10">
        <h4 className="text-lg font-semibold mb-4">📊 Daily Revenue</h4>
        <Bar data={chartData} options={chartOptions} />
      </div>

      {/* Top Categories Pie */}
      <div className="bg-white dark:bg-secondary p-6 rounded-xl shadow mb-10">
        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FaPizzaSlice /> Top Categories
        </h4>
        {topCategories.length ? (
          <Pie data={categoryData} />
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No data available.</p>
        )}
      </div>

      {/* Top Restaurants */}
      <div className="bg-white dark:bg-secondary p-6 rounded-xl shadow">
        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FaUtensils /> Top Restaurants
        </h4>
        {topRestaurants.length ? (
          <ul className="space-y-2 text-sm">
            {topRestaurants.map((r, idx) => (
              <li
                key={idx}
                className="flex justify-between border-b dark:border-gray-700 pb-2"
              >
                <span className="flex items-center gap-2">
                  <FaPizzaSlice className="text-orange-400" /> {r.name}
                </span>
                <span className="font-semibold text-gray-600 dark:text-gray-300">
                  ₹{r.totalRevenue} | {r.totalOrders} orders
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No data available.</p>
        )}
      </div>
    </motion.div>
  );
};

export default AdminReports;
