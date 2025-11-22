import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../../api/axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import { MatrixController, MatrixElement } from "chartjs-chart-matrix";
import "chartjs-chart-matrix";
import {
  FaFire,
  FaClock,
  FaCalendarAlt,
  FaChartBar,
  FaTrophy,
  FaMoon,
  FaSun,
  FaExclamationTriangle,
  FaArrowUp,
  FaChevronRight,
} from "react-icons/fa";

ChartJS.register(
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  MatrixController,
  MatrixElement
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

/* ------------------------------- Insight Card ------------------------------- */
const InsightCard = ({
  icon,
  title,
  value,
  subtitle,
  gradient,
  delay,
  emoji,
}) => (
  <motion.div
    className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer"
    initial={{ opacity: 0, scale: 0.9, y: 20 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    whileHover={{ scale: 1.03, y: -5 }}
  >
    <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`}></div>

    <div
      className="absolute inset-0 opacity-10"
      style={{
        backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
        backgroundSize: "30px 30px",
      }}
    />

    <div className="relative z-10 p-6">
      <div className="flex items-start justify-between mb-3">
        <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-2xl shadow-lg border border-white/30">
          {icon}
        </div>
        {emoji && <div className="text-3xl">{emoji}</div>}
      </div>

      <p className="text-white/80 text-sm font-semibold mb-1">{title}</p>
      <motion.p
        className="text-3xl font-black text-white drop-shadow-lg mb-1"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: delay + 0.2, type: "spring" }}
      >
        {value}
      </motion.p>
      <p className="text-white/70 text-xs font-medium">{subtitle}</p>
    </div>
  </motion.div>
);

/* ------------------------------- Legend Component ------------------------------- */
const ColorLegend = () => (
  <motion.div
    className="bg-white rounded-xl p-4 shadow-lg border border-gray-200"
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.6 }}
  >
    <p className="text-sm font-bold text-gray-700 mb-3">Order Volume</p>
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-600 font-semibold">Low</span>
      <div className="flex-1 h-6 rounded-lg overflow-hidden flex">
        {[
          "rgba(59, 130, 246, 0.2)",
          "rgba(59, 130, 246, 0.4)",
          "rgba(251, 191, 36, 0.6)",
          "rgba(249, 115, 22, 0.8)",
          "rgba(239, 68, 68, 1)",
        ].map((color, i) => (
          <div key={i} className="flex-1" style={{ backgroundColor: color }} />
        ))}
      </div>
      <span className="text-xs text-gray-600 font-semibold">High</span>
    </div>
  </motion.div>
);

/* ------------------------------- Main Component ------------------------------- */
const RestaurantHeatmap = () => {
  const [heatmapData, setHeatmapData] = useState([]);
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

  /* --------------------- Fetch Heatmap --------------------- */
  useEffect(() => {
    const fetchHeatmap = async () => {
      setLoading(true);
      try {
        const res = await API.get("/analytics/restaurant/heatmap");
        setHeatmapData(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch heatmap", err);
        pushToast({
          type: "error",
          title: "Failed to load heatmap",
          message: "Please try again later",
          icon: <FaExclamationTriangle />,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchHeatmap();
  }, []);

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Initialize 7x24 matrix
  const matrix = useMemo(() => {
    const mat = Array(7)
      .fill()
      .map(() => Array(24).fill(0));

    heatmapData.forEach((d) => {
      if (mat[d.dayOfWeek] && typeof mat[d.dayOfWeek][d.hour] !== "undefined") {
        mat[d.dayOfWeek][d.hour] = d.orders;
      }
    });

    return mat;
  }, [heatmapData]);

  // Calculate insights
  const insights = useMemo(() => {
    let maxOrders = 0;
    let maxDay = 0;
    let maxHour = 0;
    let totalOrders = 0;

    matrix.forEach((row, dayIdx) => {
      row.forEach((value, hourIdx) => {
        totalOrders += value;
        if (value > maxOrders) {
          maxOrders = value;
          maxDay = dayIdx;
          maxHour = hourIdx;
        }
      });
    });

    // Find busiest day
    const dayTotals = matrix.map((row) =>
      row.reduce((sum, val) => sum + val, 0)
    );
    const busiestDay = dayTotals.indexOf(Math.max(...dayTotals));

    // Find peak time period
    const peakPeriod =
      maxHour < 12 ? "Morning" : maxHour < 17 ? "Afternoon" : "Evening";

    return {
      totalOrders,
      peakDay: days[maxDay],
      peakHour: `${maxHour}:00`,
      peakOrders: maxOrders,
      busiestDay: days[busiestDay],
      peakPeriod,
    };
  }, [matrix, days]);

  // Enhanced color function
  const getColor = (value, maxValue) => {
    if (value === 0) return "rgba(226, 232, 240, 0.3)"; // Very light gray for zero

    const ratio = value / Math.max(maxValue, 1);

    // Blue -> Yellow -> Orange -> Red gradient
    if (ratio < 0.25) {
      const alpha = 0.2 + ratio * 2; // 0.2 to 0.7
      return `rgba(59, 130, 246, ${alpha})`; // Blue
    } else if (ratio < 0.5) {
      const alpha = 0.4 + (ratio - 0.25) * 2;
      return `rgba(251, 191, 36, ${alpha})`; // Yellow
    } else if (ratio < 0.75) {
      const alpha = 0.6 + (ratio - 0.5) * 2;
      return `rgba(249, 115, 22, ${alpha})`; // Orange
    } else {
      const alpha = 0.8 + (ratio - 0.75) * 0.8;
      return `rgba(239, 68, 68, ${alpha})`; // Red
    }
  };

  const data = {
    datasets: [
      {
        label: "Orders Heatmap",
        data: matrix.flatMap((row, dayIdx) =>
          row.map((value, hourIdx) => ({
            x: hourIdx,
            y: dayIdx,
            v: value,
          }))
        ),
        backgroundColor: (ctx) => {
          const value = ctx.dataset.data[ctx.dataIndex].v;
          return getColor(value, insights.peakOrders);
        },
        borderColor: "rgba(255, 255, 255, 0.5)",
        borderWidth: 1,
        width: ({ chart }) => (chart.chartArea?.width || 600) / 24 - 2,
        height: ({ chart }) => (chart.chartArea?.height || 300) / 7 - 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        padding: 12,
        cornerRadius: 8,
        titleFont: { size: 14, weight: "bold" },
        bodyFont: { size: 13 },
        callbacks: {
          title: (ctx) => {
            const hour = ctx[0].raw.x;
            const period = hour < 12 ? "AM" : "PM";
            const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
            return `${days[ctx[0].raw.y]}, ${displayHour}:00 ${period}`;
          },
          label: (ctx) => `${ctx.raw.v} orders`,
        },
      },
    },
    scales: {
      x: {
        type: "linear",
        min: 0,
        max: 23,
        ticks: {
          stepSize: 3,
          callback: (val) => {
            const hour = Math.round(val);
            const period = hour < 12 ? "AM" : "PM";
            const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
            return `${displayHour}${period}`;
          },
          font: { size: 10, weight: "bold" },
        },
        grid: {
          display: false,
        },
      },
      y: {
        type: "linear",
        min: 0,
        max: 6,
        ticks: {
          stepSize: 1,
          callback: (val) => days[Math.round(val)],
          font: { size: 11, weight: "bold" },
        },
        grid: {
          display: false,
        },
      },
    },
  };

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
          <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-orange-600 to-amber-600"></div>
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
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🔥
                </motion.div>
                <div>
                  <h1 className="text-4xl font-black text-white drop-shadow-lg">
                    Order Heatmap
                  </h1>
                  <p className="text-white/90 text-sm font-medium mt-1">
                    Visualize peak hours and optimize your operations
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Insights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <InsightCard
            icon={<FaChartBar />}
            title="Total Orders"
            value={insights.totalOrders.toLocaleString()}
            subtitle="In analyzed period"
            gradient="from-blue-500 to-cyan-600"
            delay={0.1}
          />
          <InsightCard
            icon={<FaTrophy />}
            title="Peak Day"
            value={insights.busiestDay}
            subtitle={`${insights.peakOrders} orders at peak`}
            gradient="from-amber-500 to-orange-600"
            delay={0.2}
            emoji="🏆"
          />
          <InsightCard
            icon={<FaClock />}
            title="Peak Hour"
            value={insights.peakHour}
            subtitle={`${insights.peakOrders} orders received`}
            gradient="from-purple-500 to-pink-600"
            delay={0.3}
            emoji="⏰"
          />
          <InsightCard
            icon={
              insights.peakPeriod === "Morning" ? (
                <FaSun />
              ) : insights.peakPeriod === "Afternoon" ? (
                <FaFire />
              ) : (
                <FaMoon />
              )
            }
            title="Peak Period"
            value={insights.peakPeriod}
            subtitle="Busiest time of day"
            gradient="from-emerald-500 to-teal-600"
            delay={0.4}
            emoji={
              insights.peakPeriod === "Morning"
                ? "🌅"
                : insights.peakPeriod === "Afternoon"
                ? "☀️"
                : "🌙"
            }
          />
        </div>

        {/* Heatmap Chart */}
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
                  <FaFire />
                </div>
                Orders by Day & Hour
              </h3>

              <ColorLegend />
            </div>
          </div>

          <div className="p-6">
            <AnimatePresence mode="wait">
              {loading ? (
                <LoadingState key="loading" />
              ) : heatmapData.length === 0 ? (
                <EmptyState key="empty" />
              ) : (
                <motion.div
                  key="chart"
                  className="h-[500px]"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <Chart type="matrix" data={data} options={options} />
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
          {/* Time Recommendations */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
              <h3 className="text-xl font-black flex items-center gap-2">
                <FaClock />
                Time Insights
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <InsightRow
                icon={<FaFire className="text-orange-500" />}
                label="Busiest Hours"
                value="7 PM - 9 PM"
              />
              <InsightRow
                icon={<FaMoon className="text-indigo-500" />}
                label="Quiet Hours"
                value="3 AM - 6 AM"
              />
              <InsightRow
                icon={<FaSun className="text-amber-500" />}
                label="Morning Rush"
                value="8 AM - 10 AM"
              />
              <InsightRow
                icon={<FaCalendarAlt className="text-blue-500" />}
                label="Weekend vs Weekday"
                value="+35% on weekends"
              />
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
              <h3 className="text-xl font-black flex items-center gap-2">
                <FaTrophy />
                Recommendations
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <RecommendationCard
                emoji="👨‍🍳"
                title="Staff Optimization"
                message="Schedule more staff during 7-9 PM peak hours"
              />
              <RecommendationCard
                emoji="📦"
                title="Inventory Management"
                message="Stock up ingredients for weekend rush"
              />
              <RecommendationCard
                emoji="💰"
                title="Special Offers"
                message="Run promotions during 3-5 PM to boost orders"
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

/* ------------------------------- Sub Components ------------------------------- */

const InsightRow = ({ icon, label, value }) => (
  <motion.div
    className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-50 to-slate-50 hover:from-indigo-50 hover:to-purple-50 transition-all"
    whileHover={{ x: 4 }}
  >
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-white shadow-md flex items-center justify-center">
        {icon}
      </div>
      <span className="font-bold text-gray-900">{label}</span>
    </div>
    <span className="font-black text-gray-900">{value}</span>
  </motion.div>
);

const RecommendationCard = ({ emoji, title, message }) => (
  <motion.div
    className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 hover:shadow-md transition-all"
    whileHover={{ scale: 1.02 }}
  >
    <div className="flex items-start gap-3">
      <div className="text-3xl">{emoji}</div>
      <div className="flex-1">
        <p className="font-bold text-gray-900 mb-1">{title}</p>
        <p className="text-sm text-gray-600 leading-relaxed">{message}</p>
      </div>
      <FaChevronRight className="text-gray-400 mt-1" />
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
    <p className="text-gray-600 font-semibold">Loading heatmap data...</p>
  </div>
);

const EmptyState = () => (
  <motion.div
    className="flex flex-col items-center justify-center py-20 text-center"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
  >
    <motion.div
      className="text-8xl mb-4"
      animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      📊
    </motion.div>
    <h4 className="text-2xl font-black text-gray-800 mb-2">No Heatmap Data</h4>
    <p className="text-gray-500 text-lg">
      Order data will appear here once you start receiving orders
    </p>
  </motion.div>
);

export default RestaurantHeatmap;


// import React, { useEffect, useState } from "react";
// import API from "../../api/axios";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import { Chart } from "react-chartjs-2";
// import { MatrixController, MatrixElement } from "chartjs-chart-matrix"; // 🔑 matrix chart
// import "chartjs-chart-matrix";

// // Register Chart.js components including matrix
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   Tooltip,
//   Legend,
//   MatrixController,
//   MatrixElement
// );

// const RestaurantHeatmap = () => {
//   const [heatmapData, setHeatmapData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchHeatmap = async () => {
//       setLoading(true);
//       try {
//         const res = await API.get("/analytics/restaurant/heatmap"); // backend route
//         setHeatmapData(res.data.data || []);
//       } catch (err) {
//         console.error("Failed to fetch heatmap", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchHeatmap();
//   }, []);

//   const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
//   const hours = Array.from({ length: 24 }, (_, i) => i);

//   // Initialize 7x24 matrix
//   const matrix = Array(7)
//     .fill()
//     .map(() => Array(24).fill(0));

//   heatmapData.forEach((d) => {
//     if (
//       matrix[d.dayOfWeek] &&
//       typeof matrix[d.dayOfWeek][d.hour] !== "undefined"
//     ) {
//       matrix[d.dayOfWeek][d.hour] = d.orders;
//     }
//   });

//   const data = {
//     datasets: [
//       {
//         label: "Orders Heatmap",
//         data: matrix.flatMap((row, dayIdx) =>
//           row.map((value, hourIdx) => ({
//             x: hourIdx,
//             y: dayIdx,
//             v: value,
//           }))
//         ),
//         backgroundColor: (ctx) => {
//           const value = ctx.dataset.data[ctx.dataIndex].v;
//           const alpha = value ? Math.min(value / 20, 1) : 0; // adjust scaling
//           return `rgba(255, 99, 132, ${alpha})`;
//         },
//         borderWidth: 1,
//         width: ({ chart }) => chart.chartArea?.width / 24 - 2,
//         height: ({ chart }) => chart.chartArea?.height / 7 - 2,
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     plugins: {
//       legend: { display: false },
//       tooltip: {
//         callbacks: {
//           label: (ctx) =>
//             `Day: ${days[ctx.raw.y]}, Hour: ${ctx.raw.x}:00, Orders: ${
//               ctx.raw.v
//             }`,
//         },
//       },
//     },
//     scales: {
//       x: {
//         type: "linear",
//         ticks: { stepSize: 1, callback: (val) => `${val}:00` },
//       },
//       y: {
//         type: "linear",
//         ticks: { stepSize: 1, callback: (val) => days[val] },
//       },
//     },
//   };

//   return (
//     <div className="p-6 text-gray-800 dark:text-white max-w-7xl mx-auto">
//       <h2 className="text-3xl font-bold mb-6">🔥 Order Heatmap</h2>
//       <div className="bg-white dark:bg-secondary p-6 rounded-xl shadow mb-10">
//         <h3 className="text-xl font-semibold mb-4">Orders by Day & Hour</h3>
//         {loading ? (
//           <p className="text-gray-400 text-sm">Loading heatmap...</p>
//         ) : (
//           <Chart
//             key={heatmapData.length} // 🔑 forces new chart instance when data changes
//             type="matrix"
//             data={data}
//             options={options}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default RestaurantHeatmap;
