import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaShoppingCart,
  FaRupeeSign,
  FaStar,
  FaChartLine,
  FaTrophy,
  FaFire,
  FaArrowUp,
  FaArrowDown,
  FaCalendarAlt,
  FaChartBar,
  FaExclamationTriangle,
  FaSpinner,
} from "react-icons/fa";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import API from "../../api/axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

/* ------------------------------- Toast Component ------------------------------- */
const Toast = ({ toasts, remove }) => (
  <div className="fixed z-[9999] top-6 right-6 flex flex-col gap-3 max-w-md">
    <AnimatePresence>
      {toasts.map((t) => (
        <motion.div
          key={t.id}
          initial={{ opacity: 0, x: 100, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 100, scale: 0.8 }}
          className="flex items-start gap-3 p-4 rounded-xl shadow-2xl text-white backdrop-blur-md border bg-red-500/95 border-red-400"
        >
          <div className="pt-0.5 text-xl">{t.icon}</div>
          <div className="flex-1">
            <div className="font-bold text-sm">{t.title}</div>
            {t.message && (
              <div className="text-xs opacity-90 mt-1">{t.message}</div>
            )}
          </div>
          <motion.button
            onClick={() => remove(t.id)}
            className="opacity-80 hover:opacity-100 font-bold text-lg"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            ✕
          </motion.button>
        </motion.div>
      ))}
    </AnimatePresence>
  </div>
);

/* ------------------------------- Stat Card ------------------------------- */
const StatCard = ({ icon, value, label, gradient, trend, delay }) => (
  <motion.div
    className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer"
    initial={{ opacity: 0, scale: 0.9, y: 20 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ delay, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
    whileHover={{ scale: 1.03, y: -5 }}
  >
    {/* Background gradient */}
    <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`}></div>

    {/* Animated pattern */}
    <motion.div
      className="absolute inset-0 opacity-10"
      animate={{
        backgroundPosition: ["0% 0%", "100% 100%"],
      }}
      transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
      style={{
        backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
        backgroundSize: "30px 30px",
      }}
    />

    <div className="relative z-10 p-6">
      <div className="flex items-start justify-between mb-4">
        <motion.div
          className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-2xl shadow-lg border border-white/30"
          whileHover={{ rotate: 360, scale: 1.1 }}
          transition={{ duration: 0.6 }}
        >
          {icon}
        </motion.div>

        {trend && (
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
              trend > 0 ? "bg-white/20 text-white" : "bg-white/10 text-white/70"
            }`}
          >
            {trend > 0 ? <FaArrowUp /> : <FaArrowDown />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>

      <motion.h4
        className="text-4xl font-black text-white drop-shadow-lg mb-2"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: delay + 0.2, type: "spring" }}
      >
        {value}
      </motion.h4>
      <p className="text-white/80 font-semibold text-sm">{label}</p>
    </div>
  </motion.div>
);

/* ------------------------------- Chart Card ------------------------------- */
const ChartCard = ({ title, icon, children, gradient }) => (
  <motion.div
    className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    whileHover={{ y: -2 }}
  >
    <div className={`p-6 bg-gradient-to-r ${gradient} text-white`}>
      <h3 className="text-2xl font-black flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
          {icon}
        </div>
        {title}
      </h3>
    </div>
    <div className="p-6">{children}</div>
  </motion.div>
);

/* ------------------------------- Main Component ------------------------------- */
const RestaurantAnalytics = () => {
  const [salesData, setSalesData] = useState([]);
  const [topDishes, setTopDishes] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);

  /* --------------------- Toast System --------------------- */
  const pushToast = (payload) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, ...payload }]);
    setTimeout(() => removeToast(id), 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  /* --------------------- Fetch Analytics --------------------- */
  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const [salesRes, dishesRes, statsRes] = await Promise.all([
          API.get("/analytics/restaurant/sales-trends"),
          API.get("/analytics/restaurant/top-dishes"),
          API.get("/analytics/restaurant/overview"),
        ]);

        setStats(statsRes.data.data || {});
        setSalesData(salesRes.data.data || []);
        setTopDishes(dishesRes.data.data || []);
      } catch (err) {
        console.error("Failed to fetch analytics", err);
        pushToast({
          type: "error",
          title: "Failed to load analytics",
          message: "Please try again later",
          icon: <FaExclamationTriangle />,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  /* --------------------- Chart Data --------------------- */
  const salesChartData = {
    labels: salesData.map((d) => {
      const date = new Date(d._id);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }),
    datasets: [
      {
        label: "Revenue",
        data: salesData.map((d) => d.revenue),
        backgroundColor: "rgba(249, 115, 22, 0.1)",
        borderColor: "rgba(249, 115, 22, 1)",
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "rgba(249, 115, 22, 1)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const topDishesChartData = {
    labels: topDishes.map((d) => d.name),
    datasets: [
      {
        label: "Orders",
        data: topDishes.map((d) => d.totalQuantity),
        backgroundColor: [
          "rgba(239, 68, 68, 0.8)",
          "rgba(249, 115, 22, 0.8)",
          "rgba(251, 191, 36, 0.8)",
          "rgba(34, 197, 94, 0.8)",
          "rgba(59, 130, 246, 0.8)",
        ],
        borderRadius: 8,
        barThickness: 40,
      },
    ],
  };

  const statCards = [
    {
      icon: <FaRupeeSign />,
      value: `₹${(stats.totalRevenue || 0).toLocaleString("en-IN")}`,
      label: "Total Revenue",
      gradient: "from-emerald-500 to-teal-600",
      trend: 12,
    },
    {
      icon: <FaShoppingCart />,
      value: (stats.totalOrders || 0).toLocaleString(),
      label: "Total Orders",
      gradient: "from-blue-500 to-cyan-600",
      trend: 8,
    },
    {
      icon: <FaRupeeSign />,
      value: `₹${Math.round(stats.avgOrderValue || 0).toLocaleString("en-IN")}`,
      label: "Avg Order Value",
      gradient: "from-purple-500 to-pink-600",
      trend: 5,
    },
    {
      icon: <FaStar />,
      value: (stats.rating || 0).toFixed(1),
      label: "Customer Rating",
      gradient: "from-amber-500 to-orange-600",
      trend: 0,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      <Toast toasts={toasts} remove={removeToast} />

      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-8 py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Premium Header */}
        <motion.div
          className="relative overflow-hidden rounded-3xl mb-8 shadow-2xl border border-rose-200"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-rose-600 via-pink-600 to-purple-600"></div>
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          />

          <motion.div
            className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], x: [0, 20, 0] }}
            transition={{ duration: 8, repeat: Infinity }}
          />

          <div className="relative z-10 p-8 md:p-10">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <motion.div
                  className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-3xl"
                  animate={{ rotate: [0, 360] }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  📊
                </motion.div>
                <div>
                  <h1 className="text-4xl font-black text-white drop-shadow-lg">
                    Analytics Dashboard
                  </h1>
                  <p className="text-white/90 text-sm font-medium mt-1 flex items-center gap-2">
                    <FaCalendarAlt />
                    Track your business performance and insights
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="h-40 rounded-2xl bg-white shadow-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.4, 0.6, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              ))
            : statCards.map((stat, i) => (
                <StatCard
                  key={i}
                  icon={stat.icon}
                  value={stat.value}
                  label={stat.label}
                  gradient={stat.gradient}
                  trend={stat.trend}
                  delay={i * 0.1}
                />
              ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart */}
          <ChartCard
            title="Revenue Trend"
            icon={<FaChartLine />}
            gradient="from-emerald-500 to-teal-600"
          >
            {loading ? (
              <LoadingState message="Loading revenue data..." />
            ) : salesData.length === 0 ? (
              <EmptyState
                icon="📈"
                title="No Sales Data"
                message="Sales data will appear here once you start receiving orders"
              />
            ) : (
              <div className="h-80">
                <Line
                  data={salesChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false,
                      },
                      tooltip: {
                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                        padding: 12,
                        cornerRadius: 8,
                        titleFont: { size: 14, weight: "bold" },
                        bodyFont: { size: 13 },
                        callbacks: {
                          label: (context) =>
                            `Revenue: ₹${context.parsed.y.toLocaleString(
                              "en-IN"
                            )}`,
                        },
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        grid: {
                          color: "rgba(0, 0, 0, 0.05)",
                        },
                        ticks: {
                          callback: (value) =>
                            `₹${value.toLocaleString("en-IN")}`,
                          font: { size: 11, weight: "bold" },
                        },
                      },
                      x: {
                        grid: {
                          display: false,
                        },
                        ticks: {
                          font: { size: 11, weight: "bold" },
                        },
                      },
                    },
                  }}
                />
              </div>
            )}
          </ChartCard>

          {/* Top Dishes Chart */}
          <ChartCard
            title="Best Sellers"
            icon={<FaTrophy />}
            gradient="from-amber-500 to-orange-600"
          >
            {loading ? (
              <LoadingState message="Loading top dishes..." />
            ) : topDishes.length === 0 ? (
              <EmptyState
                icon="🏆"
                title="No Dishes Data"
                message="Your best-selling dishes will appear here"
              />
            ) : (
              <div className="h-80">
                <Bar
                  data={topDishesChartData}
                  options={{
                    indexAxis: "y",
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false,
                      },
                      tooltip: {
                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                        padding: 12,
                        cornerRadius: 8,
                        titleFont: { size: 14, weight: "bold" },
                        bodyFont: { size: 13 },
                        callbacks: {
                          label: (context) => `Orders: ${context.parsed.x}`,
                        },
                      },
                    },
                    scales: {
                      x: {
                        beginAtZero: true,
                        grid: {
                          color: "rgba(0, 0, 0, 0.05)",
                        },
                        ticks: {
                          font: { size: 11, weight: "bold" },
                        },
                      },
                      y: {
                        grid: {
                          display: false,
                        },
                        ticks: {
                          font: { size: 11, weight: "bold" },
                        },
                      },
                    },
                  }}
                />
              </div>
            )}
          </ChartCard>
        </div>

        {/* Top Dishes Table */}
        {!loading && topDishes.length > 0 && (
          <motion.div
            className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="p-6 bg-gradient-to-r from-rose-500 to-pink-600 text-white">
              <h3 className="text-2xl font-black flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                  <FaFire />
                </div>
                Top Performing Dishes
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                      Rank
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                      Dish Name
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-black text-gray-700 uppercase tracking-wider">
                      Orders
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-black text-gray-700 uppercase tracking-wider">
                      Revenue
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <AnimatePresence>
                    {topDishes.map((dish, index) => (
                      <motion.tr
                        key={dish.name}
                        className="hover:bg-gradient-to-r hover:from-rose-50 hover:to-pink-50 transition-all"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.9 + index * 0.1 }}
                        whileHover={{ x: 4 }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {index < 3 && (
                              <span className="text-xl">
                                {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                              </span>
                            )}
                            <span className="font-bold text-gray-900">
                              #{index + 1}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-bold text-gray-900">
                            {dish.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-bold">
                            {dish.totalQuantity}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <span className="font-black text-emerald-600 text-lg">
                            ₹{(dish.revenue || 0).toLocaleString("en-IN")}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Insights Card */}
        <motion.div
          className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white shadow-2xl relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
        >
          <motion.div
            className="absolute inset-0 opacity-20"
            animate={{
              background: [
                "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.8) 0%, transparent 50%)",
                "radial-gradient(circle at 80% 50%, rgba(255,255,255,0.8) 0%, transparent 50%)",
                "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.8) 0%, transparent 50%)",
              ],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />

          <div className="relative z-10">
            <h3 className="text-2xl font-black mb-3 flex items-center gap-2">
              <FaChartBar />
              Quick Insights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                <p className="text-white/80 text-sm font-semibold mb-1">
                  Average Daily Revenue
                </p>
                <p className="text-2xl font-black">
                  ₹
                  {salesData.length
                    ? Math.round(
                        salesData.reduce((sum, d) => sum + d.revenue, 0) /
                          salesData.length
                      ).toLocaleString("en-IN")
                    : 0}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                <p className="text-white/80 text-sm font-semibold mb-1">
                  Most Popular Dish
                </p>
                <p className="text-xl font-black truncate">
                  {topDishes[0]?.name || "N/A"}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                <p className="text-white/80 text-sm font-semibold mb-1">
                  Growth Trend
                </p>
                <p className="text-2xl font-black flex items-center gap-2">
                  <FaArrowUp className="text-emerald-300" />
                  12% ↑
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

/* ------------------------------- Sub Components ------------------------------- */

const LoadingState = ({ message }) => (
  <div className="flex flex-col items-center justify-center py-16">
    <motion.div
      className="relative w-16 h-16 mb-4"
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
    >
      <div className="absolute inset-0 border-4 border-rose-200 rounded-full"></div>
      <div className="absolute inset-0 border-4 border-rose-600 border-t-transparent rounded-full"></div>
    </motion.div>
    <p className="text-gray-600 font-semibold">{message}</p>
  </div>
);

const EmptyState = ({ icon, title, message }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <motion.div
      className="text-7xl mb-4"
      animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      {icon}
    </motion.div>
    <h4 className="text-xl font-black text-gray-800 mb-2">{title}</h4>
    <p className="text-gray-500">{message}</p>
  </div>
);

export default RestaurantAnalytics;


// import React, { useEffect, useState } from "react";
// import { FaShoppingCart, FaRupeeSign, FaStar } from "react-icons/fa";
// import { Bar } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import API from "../../api/axios";

// ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

// const StatCard = ({ icon, value, label }) => (
//   <div className="bg-white dark:bg-secondary p-6 rounded-xl shadow hover:shadow-lg transition flex flex-col items-center justify-center text-center">
//     <div className="text-3xl mb-3">{icon}</div>
//     <h4 className="text-2xl font-bold text-gray-800 dark:text-white">
//       {value}
//     </h4>
//     <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{label}</p>
//   </div>
// );

// const RestaurantAnalytics = () => {
//   const [salesData, setSalesData] = useState([]);
//   const [topDishes, setTopDishes] = useState([]);
//   const [stats, setStats] = useState({});
//   const [loading, setLoading] = useState(true);

//   // Fetch analytics from backend
//   useEffect(() => {
//     const fetchAnalytics = async () => {
//       setLoading(true);
//       try {
//         const [salesRes, dishesRes, statsRes] = await Promise.all([
//           API.get("/analytics/restaurant/sales-trends"), // ✅ correct
//           API.get("/analytics/restaurant/top-dishes"), // ✅ correct
//           API.get("/analytics/restaurant/overview"), // ✅ correct
//         ]);

//         setStats(statsRes.data.data || {});
//         setSalesData(salesRes.data.data || []);
//         setTopDishes(dishesRes.data.data || []);
//       } catch (err) {
//         console.error("Failed to fetch analytics", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAnalytics();
//   }, []);

//   const salesChartData = {
//     labels: salesData.map((d) => d._id), // backend returns _id as date string (YYYY-MM-DD)
//     datasets: [
//       {
//         label: "Revenue (₹)",
//         data: salesData.map((d) => d.revenue),
//         backgroundColor: "#f97316",
//         borderRadius: 6,
//         barThickness: 20,
//       },
//     ],
//   };

//   const topDishesChartData = {
//     labels: topDishes.map((d) => d.name),
//     datasets: [
//       {
//         label: "Orders",
//         data: topDishes.map((d) => d.totalQuantity),
//         backgroundColor: "#3b82f6",
//         borderRadius: 6,
//         barThickness: 20,
//       },
//     ],
//   };

//   const statCards = [
//     {
//       icon: <FaRupeeSign />,
//       value: `₹${stats.totalRevenue || 0}`,
//       label: "Total Revenue",
//     },
//     {
//       icon: <FaShoppingCart />,
//       value: stats.totalOrders || 0,
//       label: "Total Orders",
//     },
//     {
//       icon: <FaRupeeSign />,
//       value: `₹${Math.round(stats.avgOrderValue || 0)}`,
//       label: "Avg Order Value",
//     },
//     {
//       icon: <FaStar />,
//       value: stats.rating || 0,
//       label: "Rating",
//     },
//   ];

//   return (
//     <div className="p-6 text-gray-800 dark:text-white max-w-7xl mx-auto">
//       <h2 className="text-3xl font-bold mb-6">📊 Analytics Dashboard</h2>

//       {/* KPI Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
//         {loading
//           ? Array.from({ length: 4 }).map((_, i) => (
//               <div
//                 key={i}
//                 className="bg-gray-100 dark:bg-gray-700 h-32 rounded-xl animate-pulse"
//               />
//             ))
//           : statCards.map((stat, i) => (
//               <StatCard
//                 key={i}
//                 icon={stat.icon}
//                 value={stat.value}
//                 label={stat.label}
//               />
//             ))}
//       </div>

//       {/* Revenue Chart */}
//       <div className="bg-white dark:bg-secondary p-6 rounded-xl shadow mb-10">
//         <h3 className="text-xl font-semibold mb-4">Revenue (Last 7 Days)</h3>
//         {loading ? (
//           <p className="text-gray-400 text-sm">Loading chart...</p>
//         ) : (
//           <Bar
//             data={salesChartData}
//             options={{ responsive: true }}
//             height={300}
//           />
//         )}
//       </div>

//       {/* Top Dishes Chart */}
//       <div className="bg-white dark:bg-secondary p-6 rounded-xl shadow mb-10">
//         <h3 className="text-xl font-semibold mb-4">
//           Top 5 Best-Selling Dishes
//         </h3>
//         {loading || topDishes.length === 0 ? (
//           <p className="text-gray-400 text-sm">No data yet.</p>
//         ) : (
//           <Bar
//             data={topDishesChartData}
//             options={{ indexAxis: "y", responsive: true }}
//             height={300}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default RestaurantAnalytics;
