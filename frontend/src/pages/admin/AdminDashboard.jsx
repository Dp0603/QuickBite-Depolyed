// src/pages/Admin/AdminDashboard.jsx
import React, { useEffect, useState, useMemo } from "react";
import API from "../../api/axios";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
import { useNavigate } from "react-router-dom";
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
  FaStore,
  FaClock,
  FaCheckCircle,
  FaHourglassHalf,
  FaTimesCircle,
  FaTruck,
  FaChevronRight,
  FaArrowUp,
  FaArrowDown,
  FaFileExport,
  FaCrown,
  FaChartLine,
  FaUtensils,
  FaExclamationTriangle,
  FaClipboardList,
} from "react-icons/fa";
import {
  motion,
  useMotionValue,
  animate,
  AnimatePresence,
} from "framer-motion";
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
  AreaChart,
  Area,
} from "recharts";

/* -------------------------------------------------------------- */
/* UTILITIES                                                       */
/* -------------------------------------------------------------- */

const useTimeGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Morning";
  if (h < 18) return "Afternoon";
  return "Evening";
};

const useCountUp = (to = 0, duration = 0.8) => {
  const mv = useMotionValue(0);
  const [val, setVal] = useState(0);
  useEffect(() => {
    const controls = animate(mv, to, {
      duration: Math.max(duration, 0.5),
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setVal(v),
    });
    return () => controls.stop();
  }, [to, duration, mv]);
  return Math.round(val);
};

const currency = (n) =>
  typeof n === "number"
    ? n.toLocaleString("en-IN", { maximumFractionDigits: 0 })
    : n;

/* -------------------------------------------------------------- */
/* MAIN DASHBOARD                                                  */
/* -------------------------------------------------------------- */

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const greeting = useTimeGreeting();

  const COLORS = ["#f97316", "#ec4899", "#8b5cf6", "#10b981", "#3b82f6"];

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
    {
      text: "3 new restaurants pending approval",
      type: "warning",
      icon: <FaStore />,
    },
    {
      text: "5 complaints unresolved",
      type: "error",
      icon: <FaExclamationTriangle />,
    },
    { text: "2 delayed orders flagged", type: "info", icon: <FaTruck /> },
    {
      text: "1 payout pending confirmation",
      type: "success",
      icon: <FaRupeeSign />,
    },
  ];

  const auditLog = [
    {
      text: "Approved 'Ramen King' restaurant",
      icon: <FaCheckCircle />,
      color: "text-emerald-500",
    },
    {
      text: "Banned user Ravi Mehra",
      icon: <FaTimesCircle />,
      color: "text-red-500",
    },
    {
      text: "Issued payout of ₹12,000 to Pizza Hub",
      icon: <FaRupeeSign />,
      color: "text-blue-500",
    },
    {
      text: "Updated delivery fee settings",
      icon: <FaTasks />,
      color: "text-purple-500",
    },
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

  /* Animated Counts */
  const totalUsers = stats?.totals?.totalUsers || 0;
  const totalOrders = stats?.totals?.totalOrders || 0;
  const totalSales = stats?.totals?.totalSales || 0;
  const totalRestaurants = stats?.totals?.totalRestaurants || 0;

  const usersCount = useCountUp(totalUsers, 0.9);
  const ordersCount = useCountUp(totalOrders, 1);
  const salesCount = useCountUp(totalSales, 1.2);
  const restaurantsCount = useCountUp(totalRestaurants, 0.8);

  const navigate = useNavigate();

  /* Loading State */
  if (loading) return <LoadingScreen />;

  /* Error State */
  if (error) return <ErrorScreen message={error} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-rose-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <motion.div
        className="px-4 sm:px-8 md:px-10 lg:px-12 py-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Hero Section */}
        <HeroSection
          greeting={greeting}
          totalOrders={totalOrders}
          pendingApprovals={3}
          unresolvedIssues={5}
        />

        {/* KPI Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatsCard
            icon={<FaUsers />}
            value={usersCount}
            label="Total Users"
            subtitle="Registered accounts"
            gradient="from-blue-500 to-cyan-600"
            trend={12}
            delay={0.1}
            onClick={() => navigate("/admin/users")}
          />
          <StatsCard
            icon={<FaShoppingCart />}
            value={ordersCount}
            label="Total Orders"
            subtitle="All time orders"
            gradient="from-orange-500 to-pink-600"
            trend={8}
            delay={0.2}
            onClick={() => navigate("/admin/orders")}
          />
          <StatsCard
            icon={<FaRupeeSign />}
            value={`₹${currency(salesCount)}`}
            label="Total Revenue"
            subtitle="Platform earnings"
            gradient="from-emerald-500 to-teal-600"
            trend={15}
            delay={0.3}
            onClick={() => navigate("/admin/reports")}
          />
          <StatsCard
            icon={<FaStore />}
            value={restaurantsCount}
            label="Restaurants"
            subtitle="Active partners"
            gradient="from-purple-500 to-indigo-600"
            trend={5}
            delay={0.4}
            onClick={() => navigate("/admin/restaurants")}
          />
        </div>

        {/* Order Status Breakdown */}
        <OrderStatusSection orderStatus={orderStatus} />

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-8 mb-10">
          <WeeklyTrendChart data={weeklyOrders} />
          <CityDistributionChart data={geoData} colors={COLORS} />
        </div>

        {/* Top Restaurants */}
        <TopRestaurantsSection restaurants={topRestaurants} />

        {/* Notifications & Audit Log */}
        <div className="grid lg:grid-cols-2 gap-8 mb-10">
          <NotificationsCard notifications={notifications} />
          <AuditLogCard auditLog={auditLog} />
        </div>

        {/* Export Section */}
        <ExportSection
          onExportCSV={exportOrdersCSV}
          onExportPDF={exportRevenuePDF}
          onExportXLSX={exportUsersXLSX}
        />
      </motion.div>
    </div>
  );
};

/* -------------------------------------------------------------- */
/* COMPONENTS                                                      */
/* -------------------------------------------------------------- */

/* Loading Screen */
const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-orange-50/30 to-rose-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
    <motion.div
      className="text-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="w-20 h-20 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
      <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
        Loading Dashboard
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Fetching platform statistics...
      </p>
    </motion.div>
  </div>
);

/* Error Screen */
const ErrorScreen = ({ message }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-orange-50/30 to-rose-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-6">
    <motion.div
      className="text-center max-w-md bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-red-200 dark:border-red-500/30"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-6">
        <FaExclamationTriangle className="text-4xl text-red-500" />
      </div>
      <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
        Something went wrong
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
      <button
        onClick={() => window.location.reload()}
        className="px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
      >
        Try Again
      </button>
    </motion.div>
  </div>
);

/* Hero Section */
const HeroSection = ({
  greeting,
  totalOrders,
  pendingApprovals,
  unresolvedIssues,
}) => (
  <motion.div
    className="relative overflow-hidden rounded-3xl shadow-2xl mb-10 border border-orange-200 dark:border-white/10"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
  >
    {/* Gradient Overlay */}
    <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-purple-900 to-slate-900"></div>

    {/* Background Pattern */}
    <div
      className="absolute inset-0 opacity-10"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}
    ></div>

    <div className="relative z-10 p-8 md:p-10">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="inline-flex items-center gap-3 mb-4 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center">
              <FaCrown className="text-white" />
            </div>
            <span className="text-white/90 font-semibold">Admin Panel</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-black text-white drop-shadow-lg mb-2">
            Good {greeting}, Admin! 🛠️
          </h1>
          <p className="text-white/80 text-lg">
            Here's your QuickBite platform overview
          </p>
        </motion.div>

        {/* Right - Quick Stats */}
        <motion.div
          className="flex gap-4 flex-wrap"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <HeroMiniCard
            label="Today's Orders"
            value={totalOrders}
            icon={<FaShoppingCart />}
            gradient="from-orange-500 to-pink-600"
          />
          <HeroMiniCard
            label="Pending"
            value={pendingApprovals}
            icon={<FaHourglassHalf />}
            gradient="from-amber-500 to-orange-600"
            pulse
          />
          <HeroMiniCard
            label="Issues"
            value={unresolvedIssues}
            icon={<FaExclamationTriangle />}
            gradient="from-red-500 to-rose-600"
            pulse
          />
        </motion.div>
      </div>
    </div>
  </motion.div>
);

const HeroMiniCard = ({ label, value, icon, gradient, pulse }) => (
  <div
    className={`px-5 py-4 rounded-2xl bg-white/95 backdrop-blur-xl shadow-xl min-w-[140px] border border-white/50 ${
      pulse ? "animate-pulse" : ""
    }`}
  >
    <div className="flex items-center gap-2 mb-2">
      <div
        className={`w-8 h-8 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-sm`}
      >
        {icon}
      </div>
      <span className="text-xs text-gray-600 font-bold uppercase tracking-wide">
        {label}
      </span>
    </div>
    <p className="text-2xl font-black text-gray-800">{value}</p>
  </div>
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
  onClick,
}) => (
  <motion.div
    className="group relative cursor-pointer"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    whileHover={{ scale: 1.03, y: -5 }}
    onClick={onClick}
  >
    {/* Glow Effect */}
    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

    <div className="relative p-6 rounded-3xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/10 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-110 transition-transform`}
        >
          {icon}
        </div>
        {trend !== undefined && (
          <div
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
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

/* Order Status Section */
const OrderStatusSection = ({ orderStatus }) => {
  const getStatusMeta = (status) => {
    const s = status?.toLowerCase();
    if (s === "delivered")
      return {
        icon: <FaCheckCircle />,
        gradient: "from-emerald-500 to-teal-600",
        bg: "bg-emerald-50 dark:bg-emerald-900/20",
      };
    if (s === "pending")
      return {
        icon: <FaHourglassHalf />,
        gradient: "from-amber-500 to-orange-600",
        bg: "bg-amber-50 dark:bg-amber-900/20",
      };
    if (s === "cancelled")
      return {
        icon: <FaTimesCircle />,
        gradient: "from-red-500 to-rose-600",
        bg: "bg-red-50 dark:bg-red-900/20",
      };
    if (s === "preparing")
      return {
        icon: <FaUtensils />,
        gradient: "from-blue-500 to-cyan-600",
        bg: "bg-blue-50 dark:bg-blue-900/20",
      };
    if (s === "out for delivery")
      return {
        icon: <FaTruck />,
        gradient: "from-purple-500 to-indigo-600",
        bg: "bg-purple-50 dark:bg-purple-900/20",
      };
    return {
      icon: <FaClock />,
      gradient: "from-gray-500 to-slate-600",
      bg: "bg-gray-50 dark:bg-gray-900/20",
    };
  };

  return (
    <motion.div
      className="mb-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
          <FaChartPie className="text-white" />
        </div>
        <h3 className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
          Order Status Breakdown
        </h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {orderStatus.map((s, i) => {
          const meta = getStatusMeta(s._id);
          return (
            <motion.div
              key={i}
              className={`${meta.bg} p-5 rounded-2xl border border-gray-200 dark:border-white/10 shadow-md hover:shadow-lg transition-all`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              whileHover={{ y: -3 }}
            >
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${meta.gradient} flex items-center justify-center text-white mb-3 shadow-md`}
              >
                {meta.icon}
              </div>
              <p className="text-3xl font-black text-gray-900 dark:text-white">
                {s.count}
              </p>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 capitalize">
                {s._id}
              </p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

/* Weekly Trend Chart */
const WeeklyTrendChart = ({ data }) => (
  <motion.div
    className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-lg border border-gray-200 dark:border-white/10"
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.6 }}
  >
    <div className="flex items-center gap-3 mb-6">
      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center shadow-lg">
        <FaChartLine className="text-white" />
      </div>
      <h4 className="text-xl font-black text-gray-900 dark:text-white">
        Weekly Order Trend
      </h4>
    </div>

    <ResponsiveContainer width="100%" height={250}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="day"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#9ca3af", fontSize: 12 }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#9ca3af", fontSize: 12 }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1f2937",
            border: "none",
            borderRadius: "12px",
            color: "#fff",
          }}
        />
        <Area
          type="monotone"
          dataKey="orders"
          stroke="#f97316"
          strokeWidth={3}
          fillOpacity={1}
          fill="url(#colorOrders)"
        />
      </AreaChart>
    </ResponsiveContainer>
  </motion.div>
);

/* City Distribution Chart */
const CityDistributionChart = ({ data, colors }) => {
  // Normalize missing city names + assign correct colors
  const fixedData = data.map((item, i) => ({
    ...item,
    name: item.name || "Unknown",
    color: colors[i % colors.length],
  }));

  // Prepare custom legend items (correct order + correct colors)
  const legendPayload = fixedData.map((item) => ({
    value: item.name,
    type: "circle",
    color: item.color,
  }));

  return (
    <motion.div
      className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-lg border border-gray-200 dark:border-white/10"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.7 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
          <FaMapMarkerAlt className="text-white" />
        </div>
        <h4 className="text-xl font-black text-gray-900 dark:text-white">
          City-wise Distribution
        </h4>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={fixedData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={85}
            innerRadius={50}
            paddingAngle={3}
            label={({
              cx,
              cy,
              midAngle,
              outerRadius,
              percent,
              name,
              index,
            }) => {
              const RADIAN = Math.PI / 180;

              // Default label spacing
              let radius = outerRadius + 25;

              // Push left-side labels further outward
              if (midAngle > 90 && midAngle < 270) {
                radius = outerRadius + 40;
              }

              const x = cx + radius * Math.cos(-midAngle * RADIAN);
              const y = cy + radius * Math.sin(-midAngle * RADIAN);

              return (
                <text
                  x={x}
                  y={y}
                  fill={fixedData[index].color}
                  fontSize="14"
                  fontWeight="600"
                  dominantBaseline="middle"
                  textAnchor={x > cx ? "start" : "end"}
                >
                  {`${name} ${(percent * 100).toFixed(0)}%`}
                </text>
              );
            }}
            labelLine={false}
          >
            {fixedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
            ))}
          </Pie>

          {/*  FIXED LEGEND with correct colors + order  */}
          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            iconType="circle"
            payload={legendPayload}
          />

          <Tooltip
            cursor={{ opacity: 0.1 }}
            content={({ active, payload }) => {
              if (!active || !payload || !payload.length) return null;

              const item = payload[0];
              const color = item.payload.color;
              const name = item.payload.name;

              return (
                <div
                  style={{
                    padding: "10px 14px",
                    borderRadius: "14px",
                    backdropFilter: "blur(12px)",
                    background: "rgba(255,255,255,0.25)",
                    border: `1px solid ${color}55`,
                    color,
                    fontWeight: 700,
                    fontSize: "14px",
                  }}
                >
                  {name}: {item.value}
                </div>
              );
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

/* Top Restaurants Section */
const TopRestaurantsSection = ({ restaurants }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      className="mb-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg">
            <FaStore className="text-white" />
          </div>
          <h3 className="text-2xl font-black bg-gradient-to-r from-rose-600 to-pink-600 dark:from-rose-400 dark:to-pink-400 bg-clip-text text-transparent">
            Top 5 Restaurants
          </h3>
        </div>
        <button
          onClick={() => navigate("/admin/restaurants")}
          className="px-4 py-2 rounded-xl bg-rose-100 dark:bg-rose-900/30 hover:bg-rose-200 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-400 font-semibold flex items-center gap-2 transition-all"
        >
          View All <FaChevronRight className="text-xs" />
        </button>
      </div>

      <div className="grid gap-4">
        {restaurants.map((r, idx) => (
          <motion.div
            key={idx}
            className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-white/10 shadow-md hover:shadow-lg transition-all"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 + idx * 0.1 }}
            whileHover={{ x: 5 }}
          >
            {/* Rank Badge */}
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg ${
                idx === 0
                  ? "bg-gradient-to-br from-yellow-400 to-amber-500"
                  : idx === 1
                  ? "bg-gradient-to-br from-gray-300 to-gray-400"
                  : idx === 2
                  ? "bg-gradient-to-br from-amber-600 to-orange-700"
                  : "bg-gradient-to-br from-slate-400 to-slate-500"
              }`}
            >
              {idx === 0
                ? "🥇"
                : idx === 1
                ? "🥈"
                : idx === 2
                ? "🥉"
                : `#${idx + 1}`}
            </div>

            {/* Restaurant Info */}
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-gray-900 dark:text-white truncate">
                {r.name}
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {r.orders} orders completed
              </p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-500/30">
              <FaStar className="text-amber-500" />
              <span className="font-bold text-amber-700 dark:text-amber-400">
                {r.rating}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

/* Notifications Card */
const NotificationsCard = ({ notifications }) => {
  const getTypeMeta = (type) => {
    if (type === "warning")
      return {
        bg: "bg-amber-50 dark:bg-amber-900/20",
        text: "text-amber-700 dark:text-amber-400",
        border: "border-amber-200 dark:border-amber-500/30",
      };
    if (type === "error")
      return {
        bg: "bg-red-50 dark:bg-red-900/20",
        text: "text-red-700 dark:text-red-400",
        border: "border-red-200 dark:border-red-500/30",
      };
    if (type === "success")
      return {
        bg: "bg-emerald-50 dark:bg-emerald-900/20",
        text: "text-emerald-700 dark:text-emerald-400",
        border: "border-emerald-200 dark:border-emerald-500/30",
      };
    return {
      bg: "bg-blue-50 dark:bg-blue-900/20",
      text: "text-blue-700 dark:text-blue-400",
      border: "border-blue-200 dark:border-blue-500/30",
    };
  };

  return (
    <motion.div
      className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-lg border border-gray-200 dark:border-white/10"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.9 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
          <FaBell className="text-white" />
        </div>
        <h4 className="text-xl font-black text-gray-900 dark:text-white">
          Notifications
        </h4>
        <span className="ml-auto px-3 py-1 rounded-full bg-red-500 text-white text-xs font-bold">
          {notifications.length} new
        </span>
      </div>

      <div className="space-y-3">
        {notifications.map((note, i) => {
          const meta = getTypeMeta(note.type);
          return (
            <motion.div
              key={i}
              className={`flex items-center gap-3 p-4 rounded-xl ${meta.bg} border ${meta.border}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 + i * 0.1 }}
            >
              <div className={`${meta.text} text-lg`}>{note.icon}</div>
              <p className={`text-sm font-medium ${meta.text}`}>{note.text}</p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

/* Audit Log Card */
const AuditLogCard = ({ auditLog }) => (
  <motion.div
    className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-lg border border-gray-200 dark:border-white/10"
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 1 }}
  >
    <div className="flex items-center gap-3 mb-6">
      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-lg">
        <FaClipboardList className="text-white" />
      </div>
      <h4 className="text-xl font-black text-gray-900 dark:text-white">
        Recent Activity
      </h4>
    </div>

    <div className="space-y-3">
      {auditLog.map((log, i) => (
        <motion.div
          key={i}
          className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-white/10"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1 + i * 0.1 }}
        >
          <div className={`${log.color} text-lg`}>{log.icon}</div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {log.text}
          </p>
          <span className="ml-auto text-xs text-gray-400">Just now</span>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

/* Export Section */
const ExportSection = ({ onExportCSV, onExportPDF, onExportXLSX }) => (
  <motion.div
    className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 rounded-3xl p-8 shadow-xl border border-white/10"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 1.1 }}
  >
    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center shadow-lg">
          <FaFileExport className="text-white text-2xl" />
        </div>
        <div>
          <h4 className="text-xl font-black text-white">Quick Export</h4>
          <p className="text-gray-400 text-sm">
            Download reports in various formats
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <motion.button
          onClick={onExportCSV}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold shadow-lg hover:shadow-xl transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaDownload /> Orders CSV
        </motion.button>
        <motion.button
          onClick={onExportPDF}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold shadow-lg hover:shadow-xl transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaDownload /> Revenue PDF
        </motion.button>
        <motion.button
          onClick={onExportXLSX}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold shadow-lg hover:shadow-xl transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaDownload /> Users XLSX
        </motion.button>
      </div>
    </div>
  </motion.div>
);

export default AdminDashboard;

// // src/pages/Admin/AdminDashboard.jsx
// import React, { useEffect, useState, useMemo } from "react";
// import API from "../../api/axios";
// const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// import {
//   FaUsers,
//   FaShoppingCart,
//   FaRupeeSign,
//   FaChartPie,
//   FaStar,
//   FaMapMarkerAlt,
//   FaBell,
//   FaDownload,
//   FaTasks,
// } from "react-icons/fa";
// import { motion } from "framer-motion";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
//   Legend,
// } from "recharts";

// const AdminDashboard = () => {
//   const [stats, setStats] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const COLORS = ["#FF5722", "#FF9800", "#FFC107", "#4CAF50", "#2196F3"];

//   // ✅ Fetch Dashboard Data
//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         const { data } = await API.get("/admin/dashboard-stats");
//         setStats(data?.data || {});
//       } catch (err) {
//         console.error("❌ Error fetching dashboard stats:", err);
//         setError("Failed to load dashboard stats. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchStats();
//   }, []);

//   const dayMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

//   const weeklyOrders = useMemo(
//     () =>
//       stats?.weeklyOrders?.map((d) => ({
//         day: dayMap[d._id - 1],
//         orders: d.orders,
//       })) || [],
//     [stats]
//   );

//   const topRestaurants = stats?.topRestaurants || [];

//   const geoData = useMemo(
//     () =>
//       stats?.cityDistribution?.map((c) => ({
//         name: c._id,
//         value: c.value,
//       })) || [],
//     [stats]
//   );

//   const orderStatus = stats?.orderStatus || [];

//   const notifications = [
//     "🍽️ 3 new restaurants pending approval",
//     "🚨 5 complaints unresolved",
//     "📦 2 delayed orders flagged by delivery agents",
//     "💰 1 payout pending confirmation",
//   ];

//   const auditLog = [
//     "✔️ Approved 'Ramen King' restaurant",
//     "🚫 Banned user Ravi Mehra",
//     "💸 Issued payout of ₹12,000 to Pizza Hub",
//     "📝 Updated system-wide delivery fee settings",
//   ];

//   const exportOrdersCSV = () => {
//     window.open(`${API_URL}/admin/export/orders-csv`, "_blank");
//   };
//   const exportRevenuePDF = () => {
//     window.open(`${API_URL}/admin/export/revenue-pdf`, "_blank");
//   };
//   const exportUsersXLSX = () => {
//     window.open(`${API_URL}/admin/export/users-xlsx`, "_blank");
//   };

//   // 🌀 Loading State
//   if (loading)
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <p className="text-gray-600 dark:text-gray-300 text-lg animate-pulse">
//           Loading dashboard...
//         </p>
//       </div>
//     );

//   // ⚠️ Error State
//   if (error)
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <p className="text-red-500 font-medium">{error}</p>
//       </div>
//     );

//   const totalUsers = stats?.totals?.totalUsers || 0;
//   const totalOrders = stats?.totals?.totalOrders || 0;
//   const totalSales = stats?.totals?.totalSales || 0;
//   const totalRestaurants = stats?.totals?.totalRestaurants || 0;

//   return (
//     <motion.div
//       className="min-h-screen w-full bg-gray-50 dark:bg-gray-950 px-4 sm:px-8 md:px-10 lg:px-12 py-8 text-gray-800 dark:text-white"
//       initial={{ opacity: 0, y: 30 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.4 }}
//     >
//       {/* Welcome */}
//       <h2 className="text-3xl font-bold mb-2">Welcome, Admin 🛠️</h2>
//       <p className="text-gray-600 dark:text-gray-300 mb-6">
//         Here’s your updated QuickBite platform summary.
//       </p>

//       {/* KPI Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
//         <div className="bg-white dark:bg-secondary rounded-xl p-5 shadow hover:shadow-lg transition">
//           <FaUsers className="text-2xl text-primary mb-2" />
//           <h4 className="text-xl font-semibold">{totalUsers} Users</h4>
//           <p className="text-sm text-gray-500">Total Registered</p>
//         </div>

//         <div className="bg-white dark:bg-secondary rounded-xl p-5 shadow hover:shadow-lg transition">
//           <FaShoppingCart className="text-2xl text-orange-500 mb-2" />
//           <h4 className="text-xl font-semibold">{totalOrders} Orders</h4>
//           <p className="text-sm text-gray-500">Total Orders</p>
//         </div>

//         <div className="bg-white dark:bg-secondary rounded-xl p-5 shadow hover:shadow-lg transition">
//           <FaRupeeSign className="text-2xl text-green-500 mb-2" />
//           <h4 className="text-xl font-semibold">
//             ₹{totalSales.toLocaleString()}
//           </h4>
//           <p className="text-sm text-gray-500">Total Revenue</p>
//         </div>

//         <div className="bg-white dark:bg-secondary rounded-xl p-5 shadow hover:shadow-lg transition">
//           <FaChartPie className="text-2xl text-blue-500 mb-2" />
//           <h4 className="text-xl font-semibold">
//             {totalRestaurants} Restaurants
//           </h4>
//           <p className="text-sm text-gray-500">Active on Platform</p>
//         </div>
//       </div>

//       {/* Orders Breakdown */}
//       <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
//         <FaChartPie /> Order Status Breakdown
//       </h3>
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
//         {orderStatus.map((s, i) => (
//           <div
//             key={i}
//             className="bg-white dark:bg-secondary p-4 rounded-xl shadow text-center"
//           >
//             <p className="text-lg font-bold text-primary">{s.count}</p>
//             <p className="text-sm text-gray-500 dark:text-gray-400">{s._id}</p>
//           </div>
//         ))}
//       </div>

//       {/* Charts */}
//       <div className="grid md:grid-cols-2 gap-8 mb-10">
//         {/* Weekly Order Trend */}
//         <div className="bg-white dark:bg-secondary rounded-xl p-6 shadow">
//           <h4 className="text-lg font-semibold mb-4">📈 Weekly Order Trend</h4>
//           <ResponsiveContainer width="100%" height={200}>
//             <LineChart data={weeklyOrders}>
//               <XAxis dataKey="day" />
//               <YAxis />
//               <Tooltip />
//               <Line
//                 type="monotone"
//                 dataKey="orders"
//                 stroke="#FF5722"
//                 strokeWidth={2}
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>

//         {/* City Distribution */}
//         <div className="bg-white dark:bg-secondary rounded-xl p-6 shadow">
//           <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
//             <FaMapMarkerAlt /> City-wise Order Distribution
//           </h4>
//           <ResponsiveContainer width="100%" height={200}>
//             <PieChart>
//               <Pie
//                 data={geoData}
//                 dataKey="value"
//                 nameKey="name"
//                 cx="50%"
//                 cy="50%"
//                 outerRadius={70}
//                 label
//               >
//                 {geoData.map((entry, index) => (
//                   <Cell
//                     key={`cell-${index}`}
//                     fill={COLORS[index % COLORS.length]}
//                   />
//                 ))}
//               </Pie>
//               <Legend />
//             </PieChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       {/* Top Restaurants */}
//       <h3 className="text-xl font-semibold mb-4">🍱 Top 5 Restaurants</h3>
//       <div className="overflow-x-auto mb-10">
//         <table className="min-w-[500px] w-full text-sm text-left text-gray-600 dark:text-gray-300">
//           <thead>
//             <tr className="bg-gray-100 dark:bg-gray-700 text-sm">
//               <th className="px-4 py-3">Restaurant</th>
//               <th className="px-4 py-3">Orders</th>
//               <th className="px-4 py-3">Rating</th>
//             </tr>
//           </thead>
//           <tbody>
//             {topRestaurants.map((r, idx) => (
//               <tr
//                 key={idx}
//                 className="border-b dark:border-gray-700 hover:bg-orange-50 dark:hover:bg-gray-800 transition cursor-pointer"
//               >
//                 <td className="px-4 py-3">{r.name}</td>
//                 <td className="px-4 py-3 font-semibold">{r.orders}</td>
//                 <td className="px-4 py-3 flex items-center gap-1">
//                   <FaStar className="text-yellow-400" /> {r.rating}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Notifications & Audit Log */}
//       <div className="grid md:grid-cols-2 gap-6 mb-10">
//         <div className="bg-white dark:bg-secondary p-5 rounded-xl shadow">
//           <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
//             <FaBell /> Notifications
//           </h4>
//           <ul className="space-y-2 text-sm">
//             {notifications.map((note, i) => (
//               <li key={i} className="border-b dark:border-gray-700 pb-2">
//                 {note}
//               </li>
//             ))}
//           </ul>
//         </div>

//         <div className="bg-white dark:bg-secondary p-5 rounded-xl shadow">
//           <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
//             <FaTasks /> Recent Activity
//           </h4>
//           <ul className="space-y-2 text-sm">
//             {auditLog.map((log, i) => (
//               <li key={i} className="border-b dark:border-gray-700 pb-2">
//                 {log}
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>

//       {/* Export Buttons */}
//       <div className="bg-white dark:bg-secondary rounded-xl p-5 shadow text-center text-sm text-gray-500 dark:text-gray-400">
//         📤 Quick Export:
//         <div className="mt-3 flex flex-wrap justify-center gap-3">
//           <button
//             onClick={exportOrdersCSV}
//             className="bg-primary text-white px-4 py-2 rounded hover:bg-orange-600 transition flex items-center gap-2"
//           >
//             <FaDownload /> Orders CSV
//           </button>
//           <button
//             onClick={exportRevenuePDF}
//             className="bg-primary text-white px-4 py-2 rounded hover:bg-orange-600 transition flex items-center gap-2"
//           >
//             <FaDownload /> Revenue PDF
//           </button>
//           <button
//             onClick={exportUsersXLSX}
//             className="bg-primary text-white px-4 py-2 rounded hover:bg-orange-600 transition flex items-center gap-2"
//           >
//             <FaDownload /> Users XLSX
//           </button>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// export default AdminDashboard;
