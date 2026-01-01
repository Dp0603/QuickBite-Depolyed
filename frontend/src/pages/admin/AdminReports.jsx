import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bar, Pie, Line, Doughnut } from "react-chartjs-2";
import {
  FaChartLine,
  FaDownload,
  FaFileCsv,
  FaFilePdf,
  FaPizzaSlice,
  FaUtensils,
  FaUsers,
  FaShoppingCart,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaChevronDown,
  FaStar,
  FaArrowUp,
  FaArrowDown,
  FaStore,
  FaChartPie,
  FaChartBar,
  FaTrophy,
  FaFire,
  FaPercent,
  FaExclamationTriangle,
  FaSync,
  FaEye,
  FaCrown,
  FaMedal,
  FaAward,
  FaRegCalendarAlt,
  FaFilter,
  FaExpand,
  FaTimes,
} from "react-icons/fa";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";
import API from "../../api/axios";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);

/* -------------------------------------------------------------- */
/* UTILITIES                                                       */
/* -------------------------------------------------------------- */

const useCountUp = (to = 0, duration = 0.8) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const increment = to / (duration * 60);
    const timer = setInterval(() => {
      start += increment;
      if (start >= to) {
        setVal(to);
        clearInterval(timer);
      } else {
        setVal(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [to, duration]);
  return val;
};

const currency = (n) =>
  typeof n === "number"
    ? n.toLocaleString("en-IN", { maximumFractionDigits: 0 })
    : n;

/* -------------------------------------------------------------- */
/* MAIN COMPONENT                                                  */
/* -------------------------------------------------------------- */

const AdminReports = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [month, setMonth] = useState("July");
  const [year, setYear] = useState("2024");
  const [overview, setOverview] = useState(null);
  const [salesTrends, setSalesTrends] = useState([]);
  const [topRestaurants, setTopRestaurants] = useState([]);
  const [customerStats, setCustomerStats] = useState(null);
  const [topCategories, setTopCategories] = useState([]);
  const [expandedChart, setExpandedChart] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const monthMap = {
    January: 1,
    February: 2,
    March: 3,
    April: 4,
    May: 5,
    June: 6,
    July: 7,
    August: 8,
    September: 9,
    October: 10,
    November: 11,
    December: 12,
  };
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

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

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchReports(month);
    setRefreshing(false);
  };

  const handleExportPDF = () => {
    window.open(`${API.defaults.baseURL}admin/reports/export/pdf`, "_blank");
  };

  const handleExportCSV = () => {
    window.open(`${API.defaults.baseURL}admin/reports/export/csv`, "_blank");
  };

  // Animated counts
  const revenueCount = useCountUp(overview?.totalRevenue || 0, 1.2);
  const ordersCount = useCountUp(overview?.totalOrders || 0, 1);
  const customersCount = useCountUp(customerStats?.totalCustomers || 0, 0.9);
  const avgOrderCount = useCountUp(overview?.avgOrderValue || 0, 1.1);

  // Growth percentages (mock data - replace with actual API data)
  const growthData = useMemo(
    () => ({
      revenue: 12.5,
      orders: 8.3,
      customers: 15.2,
      avgOrder: -2.1,
    }),
    []
  );

  if (loading) return <LoadingState />;
  if (error)
    return <ErrorState error={error} onRetry={() => fetchReports(month)} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <motion.div
        className="px-4 sm:px-8 md:px-10 lg:px-12 py-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Hero Header */}
        <HeroHeader
          month={month}
          year={year}
          months={months}
          onMonthChange={handleMonthChange}
          onYearChange={(e) => setYear(e.target.value)}
          onExportPDF={handleExportPDF}
          onExportCSV={handleExportCSV}
          onRefresh={handleRefresh}
          refreshing={refreshing}
        />

        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            icon={<FaMoneyBillWave />}
            value={`₹${currency(revenueCount)}`}
            label="Total Revenue"
            subtitle="This month"
            gradient="from-emerald-500 to-teal-600"
            trend={growthData.revenue}
            delay={0.1}
          />
          <StatsCard
            icon={<FaShoppingCart />}
            value={currency(ordersCount)}
            label="Total Orders"
            subtitle="Completed orders"
            gradient="from-blue-500 to-cyan-600"
            trend={growthData.orders}
            delay={0.2}
          />
          <StatsCard
            icon={<FaUsers />}
            value={currency(customersCount)}
            label="Total Customers"
            subtitle="Active users"
            gradient="from-purple-500 to-indigo-600"
            trend={growthData.customers}
            delay={0.3}
          />
          <StatsCard
            icon={<FaPercent />}
            value={`₹${currency(avgOrderCount)}`}
            label="Avg Order Value"
            subtitle="Per transaction"
            gradient="from-orange-500 to-pink-600"
            trend={growthData.avgOrder}
            delay={0.4}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart */}
          <RevenueChart
            data={salesTrends}
            onExpand={() => setExpandedChart("revenue")}
          />

          {/* Categories Chart */}
          <CategoriesChart
            data={topCategories}
            onExpand={() => setExpandedChart("categories")}
          />
        </div>

        {/* Additional Insights */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Top Restaurants */}
          <div className="lg:col-span-2">
            <TopRestaurantsSection restaurants={topRestaurants} />
          </div>

          {/* Quick Insights */}
          <QuickInsights
            overview={overview}
            customerStats={customerStats}
            topCategories={topCategories}
          />
        </div>

        {/* Performance Metrics */}
        <PerformanceMetrics salesTrends={salesTrends} month={month} />

        {/* Export Section */}
        <ExportSection
          onExportPDF={handleExportPDF}
          onExportCSV={handleExportCSV}
        />

        {/* Expanded Chart Modal */}
        <AnimatePresence>
          {expandedChart && (
            <ExpandedChartModal
              type={expandedChart}
              data={expandedChart === "revenue" ? salesTrends : topCategories}
              onClose={() => setExpandedChart(null)}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

/* -------------------------------------------------------------- */
/* COMPONENTS                                                      */
/* -------------------------------------------------------------- */

/* Loading State */
const LoadingState = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
    <motion.div
      className="text-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="w-20 h-20 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
      <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
        Loading Reports
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Fetching analytics data...
      </p>
    </motion.div>
  </div>
);

/* Error State */
const ErrorState = ({ error, onRetry }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-6">
    <motion.div
      className="text-center max-w-md bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-red-200 dark:border-red-500/30"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-6">
        <FaExclamationTriangle className="text-4xl text-red-500" />
      </div>
      <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
        Failed to Load Reports
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
      <motion.button
        onClick={onRetry}
        className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FaSync className="inline mr-2" /> Try Again
      </motion.button>
    </motion.div>
  </div>
);

/* Hero Header */
const HeroHeader = ({
  month,
  year,
  months,
  onMonthChange,
  onYearChange,
  onExportPDF,
  onExportCSV,
  onRefresh,
  refreshing,
}) => (
  <motion.div
    className="relative overflow-hidden rounded-3xl shadow-2xl mb-8 border border-purple-200 dark:border-white/10"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
  >
    {/* Gradient Background */}
    <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-700"></div>

    {/* Animated Background Pattern */}
    <div
      className="absolute inset-0 opacity-10"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}
    ></div>

    {/* Floating Charts Decoration */}
    <div className="absolute top-10 right-10 opacity-20">
      <FaChartLine className="text-white text-6xl" />
    </div>
    <div className="absolute bottom-10 right-32 opacity-10">
      <FaChartPie className="text-white text-8xl" />
    </div>

    <div className="relative z-10 p-8 md:p-10">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        {/* Left */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="inline-flex items-center gap-3 mb-4 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <FaChartLine className="text-white" />
            </div>
            <span className="text-white/90 font-semibold">
              Analytics Dashboard
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-black text-white drop-shadow-lg mb-2">
            Reports & Insights 📊
          </h1>
          <p className="text-white/80 text-lg">
            Comprehensive analytics for your platform
          </p>
        </motion.div>

        {/* Right - Filters & Actions */}
        <motion.div
          className="flex flex-wrap gap-3 items-center"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          {/* Month Selector */}
          <div className="relative">
            <select
              value={month}
              onChange={onMonthChange}
              className="appearance-none px-5 py-3 pr-10 rounded-xl bg-white/95 backdrop-blur-xl text-gray-800 font-semibold shadow-lg border-0 focus:ring-2 focus:ring-white/50 cursor-pointer"
            >
              {months.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>

          {/* Year Selector */}
          <div className="relative">
            <select
              value={year}
              onChange={onYearChange}
              className="appearance-none px-5 py-3 pr-10 rounded-xl bg-white/95 backdrop-blur-xl text-gray-800 font-semibold shadow-lg border-0 focus:ring-2 focus:ring-white/50 cursor-pointer"
            >
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
            <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>

          {/* Refresh Button */}
          <motion.button
            onClick={onRefresh}
            disabled={refreshing}
            className="p-3 rounded-xl bg-white/20 backdrop-blur-xl text-white hover:bg-white/30 transition-all disabled:opacity-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaSync className={refreshing ? "animate-spin" : ""} />
          </motion.button>

          {/* Export Buttons */}
          <motion.button
            onClick={onExportPDF}
            className="flex items-center gap-2 px-5 py-3 bg-white/95 backdrop-blur-xl text-red-600 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaFilePdf /> PDF
          </motion.button>

          <motion.button
            onClick={onExportCSV}
            className="flex items-center gap-2 px-5 py-3 bg-white/95 backdrop-blur-xl text-emerald-600 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaFileCsv /> CSV
          </motion.button>
        </motion.div>
      </div>
    </div>
  </motion.div>
);

/* Stats Card */
const StatsCard = ({
  icon,
  value,
  label,
  subtitle,
  gradient,
  trend,
  delay,
}) => (
  <motion.div
    className="group relative"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    whileHover={{ y: -5 }}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

    <div className="relative p-6 rounded-3xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/10 shadow-lg hover:shadow-xl transition-all">
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-110 transition-transform`}
        >
          {icon}
        </div>

        {trend !== undefined && (
          <div
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold ${
              trend >= 0
                ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
            }`}
          >
            {trend >= 0 ? <FaArrowUp /> : <FaArrowDown />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>

      <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-1">
        {value}
      </h3>
      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
        {label}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-500">{subtitle}</p>
    </div>
  </motion.div>
);

/* Revenue Chart */
const RevenueChart = ({ data, onExpand }) => {
  const chartData = {
    labels: data.map((t) => t._id),
    datasets: [
      {
        label: "Revenue (₹)",
        data: data.map((t) => t.totalRevenue / 1000),
        backgroundColor: "rgba(139, 92, 246, 0.3)",
        borderColor: "#8b5cf6",
        borderWidth: 3,
        borderRadius: 8,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1f2937",
        titleColor: "#fff",
        bodyColor: "#fff",
        padding: 12,
        borderRadius: 12,
        displayColors: false,
        callbacks: {
          label: (context) => `₹${(context.raw * 1000).toLocaleString()}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "rgba(156, 163, 175, 0.1)" },
        ticks: { color: "#9CA3AF", font: { weight: "600" } },
      },
      x: {
        grid: { display: false },
        ticks: { color: "#9CA3AF", font: { weight: "600" } },
      },
    },
  };

  return (
    <motion.div
      className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-200 dark:border-white/10 overflow-hidden"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className="p-6 border-b border-gray-200 dark:border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
            <FaChartBar className="text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Revenue Trend
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Daily revenue overview
            </p>
          </div>
        </div>
        <motion.button
          onClick={onExpand}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 transition-all"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FaExpand />
        </motion.button>
      </div>

      <div className="p-6 h-80">
        {data.length > 0 ? (
          <Line data={chartData} options={chartOptions} />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            No data available
          </div>
        )}
      </div>
    </motion.div>
  );
};

/* Categories Chart */
const CategoriesChart = ({ data, onExpand }) => {
  const chartData = {
    labels: data.map((c) => c.name),
    datasets: [
      {
        data: data.map((c) => c.totalOrders),
        backgroundColor: [
          "#8b5cf6",
          "#ec4899",
          "#f97316",
          "#10b981",
          "#3b82f6",
          "#f59e0b",
        ],
        borderWidth: 0,
        hoverOffset: 10,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          color: "#9CA3AF",
          font: { size: 12, weight: "600" },
          padding: 15,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        backgroundColor: "#1f2937",
        titleColor: "#fff",
        bodyColor: "#fff",
        padding: 12,
        borderRadius: 12,
      },
    },
    cutout: "60%",
  };

  return (
    <motion.div
      className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-200 dark:border-white/10 overflow-hidden"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.6 }}
    >
      <div className="p-6 border-b border-gray-200 dark:border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-lg">
            <FaPizzaSlice className="text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Top Categories
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Orders by category
            </p>
          </div>
        </div>
        <motion.button
          onClick={onExpand}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 transition-all"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FaExpand />
        </motion.button>
      </div>

      <div className="p-6 h-80">
        {data.length > 0 ? (
          <Doughnut data={chartData} options={chartOptions} />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            No data available
          </div>
        )}
      </div>
    </motion.div>
  );
};

/* Top Restaurants Section */
const TopRestaurantsSection = ({ restaurants }) => (
  <motion.div
    className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-200 dark:border-white/10 overflow-hidden"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.7 }}
  >
    <div className="p-6 border-b border-gray-200 dark:border-white/10">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500 to-rose-600 flex items-center justify-center shadow-lg">
          <FaTrophy className="text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Top Performing Restaurants
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Ranked by revenue
          </p>
        </div>
      </div>
    </div>

    <div className="p-6">
      {restaurants.length > 0 ? (
        <div className="space-y-4">
          {restaurants.slice(0, 5).map((restaurant, index) => (
            <RestaurantCard
              key={index}
              restaurant={restaurant}
              rank={index + 1}
              delay={index * 0.1}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <FaStore className="text-4xl mx-auto mb-3 opacity-50" />
          <p>No restaurant data available</p>
        </div>
      )}
    </div>
  </motion.div>
);

const RestaurantCard = ({ restaurant, rank, delay }) => {
  const rankIcons = {
    1: { icon: <FaCrown />, color: "from-amber-400 to-yellow-500" },
    2: { icon: <FaMedal />, color: "from-gray-300 to-gray-400" },
    3: { icon: <FaAward />, color: "from-amber-600 to-orange-700" },
  };

  const rankStyle = rankIcons[rank] || {
    icon: `#${rank}`,
    color: "from-slate-400 to-slate-500",
  };

  return (
    <motion.div
      className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-white/10 hover:shadow-md transition-all"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.7 + delay }}
      whileHover={{ x: 5 }}
    >
      {/* Rank Badge */}
      <div
        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${rankStyle.color} flex items-center justify-center text-white font-black text-lg shadow-lg`}
      >
        {typeof rankStyle.icon === "string" ? rankStyle.icon : rankStyle.icon}
      </div>

      {/* Restaurant Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="font-bold text-gray-900 dark:text-white truncate">
            {restaurant.name}
          </h4>
          {restaurant.rating && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-100 dark:bg-amber-900/30">
              <FaStar className="text-amber-500 text-xs" />
              <span className="text-xs font-bold text-amber-700 dark:text-amber-400">
                {restaurant.rating}
              </span>
            </div>
          )}
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {restaurant.totalOrders} orders
        </p>
      </div>

      {/* Revenue */}
      <div className="text-right">
        <p className="text-xl font-black text-gray-900 dark:text-white">
          ₹{currency(restaurant.totalRevenue)}
        </p>
        <p className="text-xs text-gray-500">Revenue</p>
      </div>
    </motion.div>
  );
};

/* Quick Insights */
const QuickInsights = ({ overview, customerStats, topCategories }) => (
  <motion.div
    className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-200 dark:border-white/10 overflow-hidden"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.8 }}
  >
    <div className="p-6 border-b border-gray-200 dark:border-white/10">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
          <FaFire className="text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Quick Insights
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Key highlights
          </p>
        </div>
      </div>
    </div>

    <div className="p-6 space-y-4">
      {/* Best Selling Category */}
      {topCategories.length > 0 && (
        <InsightCard
          icon={<FaPizzaSlice />}
          title="Top Category"
          value={topCategories[0].name}
          subtitle={`${topCategories[0].totalOrders} orders`}
          color="orange"
        />
      )}

      {/* Customer Stats */}
      {customerStats && (
        <>
          <InsightCard
            icon={<FaUsers />}
            title="New Customers"
            value={customerStats.newCustomers || 0}
            subtitle="This month"
            color="blue"
          />
          <InsightCard
            icon={<FaPercent />}
            title="Retention Rate"
            value={`${customerStats.retentionRate || 85}%`}
            subtitle="Returning customers"
            color="emerald"
          />
        </>
      )}

      {/* Peak Hours */}
      <InsightCard
        icon={<FaRegCalendarAlt />}
        title="Peak Hours"
        value="12PM - 2PM"
        subtitle="Most orders"
        color="purple"
      />
    </div>
  </motion.div>
);

const InsightCard = ({ icon, title, value, subtitle, color }) => {
  const colors = {
    orange: "from-orange-500 to-rose-600",
    blue: "from-blue-500 to-cyan-600",
    emerald: "from-emerald-500 to-teal-600",
    purple: "from-purple-500 to-indigo-600",
  };

  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-white/10">
      <div
        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors[color]} flex items-center justify-center text-white shadow-md`}
      >
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-xs text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-lg font-bold text-gray-900 dark:text-white">
          {value}
        </p>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>
    </div>
  );
};

/* Performance Metrics */
const PerformanceMetrics = ({ salesTrends, month }) => {
  // Calculate metrics
  const totalDays = salesTrends.length;
  const avgDailyRevenue =
    totalDays > 0
      ? salesTrends.reduce((sum, t) => sum + t.totalRevenue, 0) / totalDays
      : 0;
  const avgDailyOrders =
    totalDays > 0
      ? salesTrends.reduce((sum, t) => sum + t.totalOrders, 0) / totalDays
      : 0;
  const peakDay = salesTrends.reduce(
    (max, t) => (t.totalRevenue > (max.totalRevenue || 0) ? t : max),
    {}
  );

  return (
    <motion.div
      className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-200 dark:border-white/10 overflow-hidden mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9 }}
    >
      <div className="p-6 border-b border-gray-200 dark:border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
            <FaChartLine className="text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Performance Metrics
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {month} performance summary
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <MetricCard
            title="Avg Daily Revenue"
            value={`₹${currency(Math.round(avgDailyRevenue))}`}
            icon={<FaMoneyBillWave />}
            color="emerald"
          />
          <MetricCard
            title="Avg Daily Orders"
            value={Math.round(avgDailyOrders)}
            icon={<FaShoppingCart />}
            color="blue"
          />
          <MetricCard
            title="Peak Revenue Day"
            value={peakDay._id || "N/A"}
            icon={<FaFire />}
            color="orange"
          />
          <MetricCard
            title="Peak Revenue"
            value={`₹${currency(peakDay.totalRevenue || 0)}`}
            icon={<FaTrophy />}
            color="purple"
          />
        </div>
      </div>
    </motion.div>
  );
};

const MetricCard = ({ title, value, icon, color }) => {
  const colors = {
    emerald:
      "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
    blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    orange:
      "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
    purple:
      "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
  };

  return (
    <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-white/10 text-center">
      <div
        className={`w-12 h-12 rounded-xl ${colors[color]} flex items-center justify-center mx-auto mb-3`}
      >
        {icon}
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{title}</p>
      <p className="text-xl font-black text-gray-900 dark:text-white">
        {value}
      </p>
    </div>
  );
};

/* Export Section */
const ExportSection = ({ onExportPDF, onExportCSV }) => (
  <motion.div
    className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 rounded-3xl p-8 shadow-xl border border-white/10"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 1 }}
  >
    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
          <FaDownload className="text-white text-2xl" />
        </div>
        <div>
          <h4 className="text-xl font-black text-white">Export Reports</h4>
          <p className="text-gray-400 text-sm">
            Download detailed reports in various formats
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <motion.button
          onClick={onExportPDF}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold shadow-lg hover:shadow-xl transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaFilePdf /> Export PDF
        </motion.button>
        <motion.button
          onClick={onExportCSV}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold shadow-lg hover:shadow-xl transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaFileCsv /> Export CSV
        </motion.button>
        <motion.button
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold shadow-lg hover:shadow-xl transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaChartBar /> Full Report
        </motion.button>
      </div>
    </div>
  </motion.div>
);

/* Expanded Chart Modal */
const ExpandedChartModal = ({ type, data, onClose }) => {
  const isRevenue = type === "revenue";

  const chartData = isRevenue
    ? {
        labels: data.map((t) => t._id),
        datasets: [
          {
            label: "Revenue (₹)",
            data: data.map((t) => t.totalRevenue / 1000),
            backgroundColor: "rgba(139, 92, 246, 0.3)",
            borderColor: "#8b5cf6",
            borderWidth: 3,
            fill: true,
            tension: 0.4,
          },
        ],
      }
    : {
        labels: data.map((c) => c.name),
        datasets: [
          {
            data: data.map((c) => c.totalOrders),
            backgroundColor: [
              "#8b5cf6",
              "#ec4899",
              "#f97316",
              "#10b981",
              "#3b82f6",
              "#f59e0b",
            ],
            borderWidth: 0,
          },
        ],
      };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: isRevenue ? { display: false } : { position: "right" },
    },
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-3xl shadow-2xl border border-gray-200 dark:border-white/10 overflow-hidden"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-xl bg-gradient-to-br ${
                isRevenue
                  ? "from-purple-500 to-indigo-600"
                  : "from-pink-500 to-rose-600"
              } flex items-center justify-center shadow-lg`}
            >
              {isRevenue ? (
                <FaChartBar className="text-white" />
              ) : (
                <FaPizzaSlice className="text-white" />
              )}
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {isRevenue ? "Revenue Trend" : "Category Distribution"}
            </h3>
          </div>
          <motion.button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-gray-500 hover:bg-gray-200 dark:hover:bg-slate-700"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaTimes />
          </motion.button>
        </div>

        {/* Chart */}
        <div className="p-6 h-96">
          {isRevenue ? (
            <Line data={chartData} options={chartOptions} />
          ) : (
            <Pie data={chartData} options={chartOptions} />
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdminReports;
