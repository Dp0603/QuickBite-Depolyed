import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import {
  FaChartLine,
  FaArrowUp,
  FaArrowDown,
  FaCalendarAlt,
  FaRupeeSign,
  FaShoppingCart,
  FaPercentage,
  FaTrophy,
  FaFire,
  FaSpinner,
  FaChevronRight,
} from "react-icons/fa";
import API from "../../api/axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  Filler
);

/* ------------------------------- Period Selector ------------------------------- */
const PeriodButton = ({ active, onClick, children, icon }) => (
  <motion.button
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm shadow-md transition-all ${
      active
        ? "bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg"
        : "bg-white text-gray-700 hover:bg-gray-50"
    }`}
    whileHover={{ scale: active ? 1 : 1.05, y: active ? 0 : -2 }}
    whileTap={{ scale: 0.95 }}
  >
    {icon}
    {children}
  </motion.button>
);

/* ------------------------------- Metric Card ------------------------------- */
const MetricCard = ({ icon, title, value, change, gradient, delay }) => {
  const isPositive = change >= 0;

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all"
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ scale: 1.03, y: -5 }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`}></div>

      {/* Pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: "30px 30px",
        }}
      />

      <div className="relative z-10 p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-xl shadow-lg border border-white/30">
            {icon}
          </div>

          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
              isPositive
                ? "bg-white/20 text-white"
                : "bg-white/10 text-white/70"
            }`}
          >
            {isPositive ? <FaArrowUp /> : <FaArrowDown />}
            {Math.abs(change)}%
          </div>
        </div>

        <p className="text-white/80 text-sm font-semibold mb-1">{title}</p>
        <motion.p
          className="text-3xl font-black text-white drop-shadow-lg"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: delay + 0.2, type: "spring" }}
        >
          {value}
        </motion.p>
      </div>
    </motion.div>
  );
};

/* ------------------------------- Main Component ------------------------------- */
const RestaurantSalesTrends = () => {
  const [period, setPeriod] = useState("week"); // week, month, year
  const [chartType, setChartType] = useState("line"); // line, bar
  const [loading, setLoading] = useState(false);
  const [salesData, setSalesData] = useState([]);

  // Fetch data based on period
  useEffect(() => {
    const fetchSalesData = async () => {
      setLoading(true);
      try {
        // Simulate API call - replace with your actual endpoint
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Dummy data based on period
        const data = getDummyData(period);
        setSalesData(data);
      } catch (err) {
        console.error("Failed to fetch sales data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, [period]);

  // Generate dummy data based on period
  const getDummyData = (period) => {
    switch (period) {
      case "week":
        return {
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          data: [1200, 1900, 1500, 2200, 2800, 3000, 2500],
          orders: [12, 19, 15, 22, 28, 30, 25],
        };
      case "month":
        return {
          labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
          data: [8500, 12000, 10500, 15000],
          orders: [85, 120, 105, 150],
        };
      case "year":
        return {
          labels: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
          data: [
            45000, 52000, 48000, 61000, 59000, 68000, 75000, 82000, 78000,
            85000, 92000, 98000,
          ],
          orders: [450, 520, 480, 610, 590, 680, 750, 820, 780, 850, 920, 980],
        };
      default:
        return { labels: [], data: [], orders: [] };
    }
  };

  // Calculate metrics
  const totalRevenue = salesData.data?.reduce((sum, val) => sum + val, 0) || 0;
  const totalOrders = salesData.orders?.reduce((sum, val) => sum + val, 0) || 0;
  const avgOrderValue = totalOrders
    ? Math.round(totalRevenue / totalOrders)
    : 0;
  const peakDay =
    salesData.labels?.[
      salesData.data?.indexOf(Math.max(...(salesData.data || [0])))
    ];

  // Chart data
  const chartData = {
    labels: salesData.labels || [],
    datasets: [
      {
        label: "Revenue (₹)",
        data: salesData.data || [],
        borderColor: "rgba(249, 115, 22, 1)",
        backgroundColor:
          chartType === "line"
            ? "rgba(249, 115, 22, 0.1)"
            : "rgba(249, 115, 22, 0.8)",
        borderWidth: 3,
        fill: chartType === "line",
        tension: 0.4,
        pointBackgroundColor: "rgba(249, 115, 22, 1)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        borderRadius: chartType === "bar" ? 8 : 0,
      },
    ],
  };

  const chartOptions = {
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
            `Revenue: ₹${context.parsed.y.toLocaleString("en-IN")}`,
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
          callback: (value) => `₹${value.toLocaleString("en-IN")}`,
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
  };

  const ChartComponent = chartType === "line" ? Line : Bar;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
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
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600"></div>
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
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <motion.div
                    className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-3xl"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    📈
                  </motion.div>
                  <div>
                    <h1 className="text-4xl font-black text-white drop-shadow-lg">
                      Sales Trends
                    </h1>
                    <p className="text-white/90 text-sm font-medium mt-1">
                      Track your revenue performance over time
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Period Selector */}
              <motion.div
                className="flex gap-2 flex-wrap"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <PeriodButton
                  active={period === "week"}
                  onClick={() => setPeriod("week")}
                  icon={<FaCalendarAlt />}
                >
                  Week
                </PeriodButton>
                <PeriodButton
                  active={period === "month"}
                  onClick={() => setPeriod("month")}
                  icon={<FaCalendarAlt />}
                >
                  Month
                </PeriodButton>
                <PeriodButton
                  active={period === "year"}
                  onClick={() => setPeriod("year")}
                  icon={<FaCalendarAlt />}
                >
                  Year
                </PeriodButton>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            icon={<FaRupeeSign />}
            title="Total Revenue"
            value={`₹${totalRevenue.toLocaleString("en-IN")}`}
            change={12}
            gradient="from-emerald-500 to-teal-600"
            delay={0.1}
          />
          <MetricCard
            icon={<FaShoppingCart />}
            title="Total Orders"
            value={totalOrders.toLocaleString()}
            change={8}
            gradient="from-blue-500 to-cyan-600"
            delay={0.2}
          />
          <MetricCard
            icon={<FaPercentage />}
            title="Avg Order Value"
            value={`₹${avgOrderValue.toLocaleString("en-IN")}`}
            change={5}
            gradient="from-purple-500 to-pink-600"
            delay={0.3}
          />
          <MetricCard
            icon={<FaTrophy />}
            title="Peak Period"
            value={peakDay || "N/A"}
            change={0}
            gradient="from-amber-500 to-orange-600"
            delay={0.4}
          />
        </div>

        {/* Chart Section */}
        <motion.div
          className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="p-6 bg-gradient-to-r from-rose-500 to-pink-600 text-white border-b-2 border-rose-400">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <h3 className="text-2xl font-black flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                  <FaChartLine />
                </div>
                Revenue Trend
              </h3>

              {/* Chart Type Toggle */}
              <div className="flex gap-2">
                <motion.button
                  onClick={() => setChartType("line")}
                  className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                    chartType === "line"
                      ? "bg-white text-rose-600"
                      : "bg-white/20 hover:bg-white/30"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Line
                </motion.button>
                <motion.button
                  onClick={() => setChartType("bar")}
                  className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                    chartType === "bar"
                      ? "bg-white text-rose-600"
                      : "bg-white/20 hover:bg-white/30"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Bar
                </motion.button>
              </div>
            </div>
          </div>

          <div className="p-6">
            <AnimatePresence mode="wait">
              {loading ? (
                <LoadingState key="loading" />
              ) : (
                <motion.div
                  key={`${period}-${chartType}`}
                  className="h-96"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChartComponent data={chartData} options={chartOptions} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Insights Section */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {/* Growth Analysis */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
              <h3 className="text-xl font-black flex items-center gap-2">
                <FaFire />
                Growth Analysis
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <InsightRow
                label="Revenue Growth"
                value="+12%"
                icon={<FaArrowUp className="text-emerald-500" />}
                positive
              />
              <InsightRow
                label="Order Volume"
                value="+8%"
                icon={<FaArrowUp className="text-emerald-500" />}
                positive
              />
              <InsightRow
                label="Customer Retention"
                value="+15%"
                icon={<FaArrowUp className="text-emerald-500" />}
                positive
              />
              <InsightRow
                label="Avg Order Value"
                value="+5%"
                icon={<FaArrowUp className="text-emerald-500" />}
                positive
              />
            </div>
          </div>

          {/* Performance Highlights */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-amber-500 to-orange-600 text-white">
              <h3 className="text-xl font-black flex items-center gap-2">
                <FaTrophy />
                Performance Highlights
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <HighlightCard
                emoji="🔥"
                title="Best Day"
                value={peakDay || "N/A"}
                subtitle={`₹${Math.max(
                  ...(salesData.data || [0])
                ).toLocaleString("en-IN")} revenue`}
              />
              <HighlightCard
                emoji="⭐"
                title="Avg Daily Revenue"
                value={`₹${Math.round(
                  totalRevenue / (salesData.data?.length || 1)
                ).toLocaleString("en-IN")}`}
                subtitle="Consistent performance"
              />
              <HighlightCard
                emoji="📊"
                title="Growth Trend"
                value="Upward"
                subtitle="Strong momentum"
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

/* ------------------------------- Sub Components ------------------------------- */

const InsightRow = ({ label, value, icon, positive }) => (
  <motion.div
    className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-50 to-slate-50 hover:from-rose-50 hover:to-pink-50 transition-all"
    whileHover={{ x: 4 }}
  >
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-white shadow-md flex items-center justify-center">
        {icon}
      </div>
      <span className="font-bold text-gray-900">{label}</span>
    </div>
    <span
      className={`font-black text-lg ${
        positive ? "text-emerald-600" : "text-red-600"
      }`}
    >
      {value}
    </span>
  </motion.div>
);

const HighlightCard = ({ emoji, title, value, subtitle }) => (
  <motion.div
    className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 hover:shadow-md transition-all"
    whileHover={{ scale: 1.02 }}
  >
    <div className="flex items-start gap-3">
      <div className="text-3xl">{emoji}</div>
      <div className="flex-1">
        <p className="text-xs text-gray-600 font-semibold mb-1">{title}</p>
        <p className="text-2xl font-black text-gray-900 mb-1">{value}</p>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>
      <FaChevronRight className="text-gray-400 mt-2" />
    </div>
  </motion.div>
);

const LoadingState = () => (
  <div className="flex flex-col items-center justify-center py-20">
    <motion.div
      className="relative w-16 h-16 mb-4"
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
    >
      <div className="absolute inset-0 border-4 border-rose-200 rounded-full"></div>
      <div className="absolute inset-0 border-4 border-rose-600 border-t-transparent rounded-full"></div>
    </motion.div>
    <p className="text-gray-600 font-semibold">Loading chart data...</p>
  </div>
);

export default RestaurantSalesTrends;



// import React from "react";
// import { Line } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Tooltip,
//   Legend,
// } from "chart.js";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Tooltip,
//   Legend
// );

// const RestaurantSalesTrends = () => {
//   // Dummy sales trend data
//   const salesTrendData = {
//     labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
//     datasets: [
//       {
//         label: "Revenue (₹)",
//         data: [1200, 1900, 1500, 2200, 2800, 3000, 2500],
//         borderColor: "#f97316",
//         backgroundColor: "rgba(249, 115, 22, 0.2)",
//         tension: 0.3,
//         fill: true,
//       },
//     ],
//   };

//   return (
//     <div className="p-6 text-gray-800 dark:text-white max-w-5xl mx-auto">
//       <h2 className="text-3xl font-bold mb-6">📈 Sales Trends</h2>

//       <div className="bg-white dark:bg-secondary p-6 rounded-xl shadow">
//         <h3 className="text-xl font-semibold mb-4">Weekly Revenue</h3>
//         <Line
//           data={salesTrendData}
//           options={{ responsive: true }}
//           height={300}
//         />
//       </div>
//     </div>
//   );
// };

// export default RestaurantSalesTrends;
