import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pie, Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import {
  FaUsers,
  FaUserPlus,
  FaUserCheck,
  FaCrown,
  FaHeart,
  FaChartPie,
  FaTrophy,
  FaStar,
  FaArrowUp,
  FaArrowDown,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaShoppingCart,
  FaRupeeSign,
  FaPercentage,
  FaMedal,
  FaFire,
  FaChevronRight,
} from "react-icons/fa";
import API from "../../api/axios";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
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
const StatCard = ({ icon, value, label, gradient, trend, delay, emoji }) => (
  <motion.div
    className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer"
    initial={{ opacity: 0, scale: 0.9, y: 20 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ delay, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
    whileHover={{ scale: 1.03, y: -5 }}
  >
    <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`}></div>

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

        {trend !== undefined && (
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
              trend > 0 ? "bg-white/20 text-white" : "bg-white/10 text-white/70"
            }`}
          >
            {trend > 0 ? <FaArrowUp /> : <FaArrowDown />}
            {Math.abs(trend)}%
          </div>
        )}

        {emoji && <div className="text-3xl">{emoji}</div>}
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

/* ------------------------------- Customer Tier Badge ------------------------------- */
const TierBadge = ({ tier }) => {
  const tiers = {
    platinum: {
      icon: <FaCrown />,
      bg: "bg-gradient-to-r from-purple-500 to-pink-500",
      text: "Platinum",
    },
    gold: {
      icon: <FaMedal />,
      bg: "bg-gradient-to-r from-amber-500 to-orange-500",
      text: "Gold",
    },
    silver: {
      icon: <FaStar />,
      bg: "bg-gradient-to-r from-gray-400 to-gray-500",
      text: "Silver",
    },
    bronze: {
      icon: <FaTrophy />,
      bg: "bg-gradient-to-r from-orange-600 to-red-600",
      text: "Bronze",
    },
  };

  const current = tiers[tier] || tiers.bronze;

  return (
    <div
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-white text-xs font-bold ${current.bg}`}
    >
      {current.icon}
      {current.text}
    </div>
  );
};

/* ------------------------------- Main Component ------------------------------- */
const RestaurantCustomers = () => {
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);
  const [customerData, setCustomerData] = useState({
    total: 0,
    new: 0,
    returning: 0,
    vip: 0,
  });
  const [topCustomers, setTopCustomers] = useState([]);
  const [segmentData, setSegmentData] = useState([]);

  /* --------------------- Toast System --------------------- */
  const pushToast = (payload) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, ...payload }]);
    setTimeout(() => removeToast(id), 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  /* --------------------- Fetch Customer Data --------------------- */
  useEffect(() => {
    const fetchCustomerData = async () => {
      setLoading(true);
      try {
        // Replace with your actual API endpoints
        // const [statsRes, topRes, segmentRes] = await Promise.all([
        //   API.get("/analytics/restaurant/customer-stats"),
        //   API.get("/analytics/restaurant/top-customers"),
        //   API.get("/analytics/restaurant/customer-segments"),
        // ]);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Dummy data
        setCustomerData({
          total: 1248,
          new: 342,
          returning: 906,
          vip: 78,
        });

        setTopCustomers([
          {
            id: 1,
            name: "Amit Sharma",
            orders: 45,
            spent: 18500,
            tier: "platinum",
            avatar: "AS",
          },
          {
            id: 2,
            name: "Priya Verma",
            orders: 38,
            spent: 15200,
            tier: "gold",
            avatar: "PV",
          },
          {
            id: 3,
            name: "Rahul Singh",
            orders: 32,
            spent: 12800,
            tier: "gold",
            avatar: "RS",
          },
          {
            id: 4,
            name: "Sneha Patel",
            orders: 28,
            spent: 11200,
            tier: "silver",
            avatar: "SP",
          },
          {
            id: 5,
            name: "Vikram Reddy",
            orders: 24,
            spent: 9600,
            tier: "silver",
            avatar: "VR",
          },
        ]);

        setSegmentData([
          { segment: "Frequent", count: 156, percentage: 12.5 },
          { segment: "Regular", count: 374, percentage: 30 },
          { segment: "Occasional", count: 499, percentage: 40 },
          { segment: "New", count: 219, percentage: 17.5 },
        ]);
      } catch (err) {
        console.error("Failed to fetch customer data", err);
        pushToast({
          type: "error",
          title: "Failed to load customer data",
          message: "Please try again later",
          icon: <FaExclamationTriangle />,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, []);

  /* --------------------- Chart Data --------------------- */
  const customerTypeChartData = {
    labels: ["New Customers", "Returning Customers"],
    datasets: [
      {
        data: [customerData.new, customerData.returning],
        backgroundColor: ["rgba(59, 130, 246, 0.8)", "rgba(16, 185, 129, 0.8)"],
        borderColor: ["rgba(59, 130, 246, 1)", "rgba(16, 185, 129, 1)"],
        borderWidth: 2,
        hoverOffset: 10,
      },
    ],
  };

  const segmentChartData = {
    labels: segmentData.map((s) => s.segment),
    datasets: [
      {
        label: "Customers",
        data: segmentData.map((s) => s.count),
        backgroundColor: [
          "rgba(239, 68, 68, 0.8)",
          "rgba(249, 115, 22, 0.8)",
          "rgba(251, 191, 36, 0.8)",
          "rgba(59, 130, 246, 0.8)",
        ],
        borderRadius: 8,
        barThickness: 50,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 20,
          font: {
            size: 12,
            weight: "bold",
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        cornerRadius: 8,
        titleFont: { size: 14, weight: "bold" },
        bodyFont: { size: 13 },
      },
    },
  };

  const barChartOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
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

  /* --------------------- Metrics --------------------- */
  const retentionRate = Math.round(
    (customerData.returning / customerData.total) * 100
  );
  const avgOrdersPerCustomer = Math.round(
    topCustomers.reduce((sum, c) => sum + c.orders, 0) / topCustomers.length
  );

  const statCards = [
    {
      icon: <FaUsers />,
      value: customerData.total.toLocaleString(),
      label: "Total Customers",
      gradient: "from-blue-500 to-cyan-600",
      trend: 15,
      emoji: "👥",
    },
    {
      icon: <FaUserPlus />,
      value: customerData.new.toLocaleString(),
      label: "New Customers",
      gradient: "from-emerald-500 to-teal-600",
      trend: 22,
      emoji: "✨",
    },
    {
      icon: <FaUserCheck />,
      value: customerData.returning.toLocaleString(),
      label: "Returning Customers",
      gradient: "from-purple-500 to-pink-600",
      trend: 12,
      emoji: "🔄",
    },
    {
      icon: <FaCrown />,
      value: customerData.vip.toLocaleString(),
      label: "VIP Customers",
      gradient: "from-amber-500 to-orange-600",
      trend: 8,
      emoji: "👑",
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
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600"></div>
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
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  👥
                </motion.div>
                <div>
                  <h1 className="text-4xl font-black text-white drop-shadow-lg">
                    Customer Analytics
                  </h1>
                  <p className="text-white/90 text-sm font-medium mt-1 flex items-center gap-2">
                    <FaHeart className="text-red-300" />
                    Understand your customer base and retention
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
                  emoji={stat.emoji}
                />
              ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Customer Type Breakdown */}
          <ChartCard
            title="Customer Type"
            icon={<FaChartPie />}
            gradient="from-blue-500 to-indigo-600"
          >
            {loading ? (
              <LoadingState message="Loading customer data..." />
            ) : (
              <div className="h-80">
                <Doughnut data={customerTypeChartData} options={chartOptions} />
              </div>
            )}
          </ChartCard>

          {/* Customer Segments */}
          <ChartCard
            title="Customer Segments"
            icon={<FaUsers />}
            gradient="from-purple-500 to-pink-600"
          >
            {loading ? (
              <LoadingState message="Loading segments..." />
            ) : segmentData.length === 0 ? (
              <EmptyState
                icon="📊"
                title="No Segment Data"
                message="Customer segments will appear here"
              />
            ) : (
              <div className="h-80">
                <Bar data={segmentChartData} options={barChartOptions} />
              </div>
            )}
          </ChartCard>
        </div>

        {/* Top Customers Table */}
        {!loading && topCustomers.length > 0 && (
          <motion.div
            className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="p-6 bg-gradient-to-r from-amber-500 to-orange-600 text-white">
              <h3 className="text-2xl font-black flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                  <FaTrophy />
                </div>
                Top Customers
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
                      Customer
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                      Tier
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-black text-gray-700 uppercase tracking-wider">
                      Orders
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-black text-gray-700 uppercase tracking-wider">
                      Total Spent
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <AnimatePresence>
                    {topCustomers.map((customer, index) => (
                      <motion.tr
                        key={customer.id}
                        className="hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 transition-all"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.9 + index * 0.1 }}
                        whileHover={{ x: 4 }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {index < 3 && (
                              <span className="text-2xl">
                                {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                              </span>
                            )}
                            <span className="font-bold text-gray-900">
                              #{index + 1}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                              {customer.avatar}
                            </div>
                            <div>
                              <div className="font-bold text-gray-900">
                                {customer.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <TierBadge tier={customer.tier} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-bold flex items-center justify-center gap-1 w-fit mx-auto">
                            <FaShoppingCart className="text-xs" />
                            {customer.orders}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <span className="font-black text-emerald-600 text-lg">
                            ₹{customer.spent.toLocaleString("en-IN")}
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

        {/* Insights Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          {/* Retention Metrics */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
              <h3 className="text-xl font-black flex items-center gap-2">
                <FaHeart />
                Retention Metrics
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <MetricRow
                label="Retention Rate"
                value={`${retentionRate}%`}
                icon={<FaPercentage className="text-emerald-500" />}
              />
              <MetricRow
                label="Avg Orders/Customer"
                value={avgOrdersPerCustomer}
                icon={<FaShoppingCart className="text-blue-500" />}
              />
              <MetricRow
                label="Customer Lifetime Value"
                value="₹12,450"
                icon={<FaRupeeSign className="text-amber-500" />}
              />
              <MetricRow
                label="Churn Rate"
                value="8%"
                icon={<FaArrowDown className="text-red-500" />}
              />
            </div>
          </div>

          {/* Engagement Insights */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
              <h3 className="text-xl font-black flex items-center gap-2">
                <FaFire />
                Engagement Insights
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <InsightCard
                emoji="🎯"
                title="Most Active Time"
                value="Weekend Evenings"
                subtitle="7 PM - 9 PM peak engagement"
              />
              <InsightCard
                emoji="💎"
                title="VIP Growth"
                value="+8% this month"
                subtitle="Premium customer base expanding"
              />
              <InsightCard
                emoji="📈"
                title="Repeat Order Rate"
                value="68%"
                subtitle="Strong customer loyalty"
              />
            </div>
          </div>
        </motion.div>

        {/* Customer Acquisition Card */}
        <motion.div
          className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-pink-600 via-rose-600 to-red-600 text-white shadow-2xl relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2 }}
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
            <h3 className="text-2xl font-black mb-4 flex items-center gap-2">
              <FaUserPlus />
              Customer Acquisition
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                <p className="text-white/80 text-sm font-semibold mb-1">
                  Monthly Growth
                </p>
                <p className="text-3xl font-black">+15%</p>
              </div>
              <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                <p className="text-white/80 text-sm font-semibold mb-1">
                  Referral Rate
                </p>
                <p className="text-3xl font-black">23%</p>
              </div>
              <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                <p className="text-white/80 text-sm font-semibold mb-1">
                  Avg Acquisition Cost
                </p>
                <p className="text-3xl font-black">₹120</p>
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
      <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
      <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full"></div>
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

const MetricRow = ({ label, value, icon }) => (
  <motion.div
    className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-50 to-slate-50 hover:from-emerald-50 hover:to-teal-50 transition-all"
    whileHover={{ x: 4 }}
  >
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-white shadow-md flex items-center justify-center">
        {icon}
      </div>
      <span className="font-bold text-gray-900">{label}</span>
    </div>
    <span className="font-black text-gray-900 text-lg">{value}</span>
  </motion.div>
);

const InsightCard = ({ emoji, title, value, subtitle }) => (
  <motion.div
    className="p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 hover:shadow-md transition-all"
    whileHover={{ scale: 1.02 }}
  >
    <div className="flex items-start gap-3">
      <div className="text-3xl">{emoji}</div>
      <div className="flex-1">
        <p className="text-xs text-gray-600 font-semibold mb-1">{title}</p>
        <p className="text-2xl font-black text-gray-900 mb-1">{value}</p>
        <p className="text-xs text-gray-500 leading-relaxed">{subtitle}</p>
      </div>
      <FaChevronRight className="text-gray-400 mt-1" />
    </div>
  </motion.div>
);

export default RestaurantCustomers;

// import React from "react";
// import { Pie } from "react-chartjs-2";
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// ChartJS.register(ArcElement, Tooltip, Legend);

// const RestaurantCustomers = () => {
//   // Dummy customer stats
//   const totalCustomers = 320;
//   const newCustomers = 120;
//   const returningCustomers = 200;

//   const customerChartData = {
//     labels: ["New Customers", "Returning Customers"],
//     datasets: [
//       {
//         data: [newCustomers, returningCustomers],
//         backgroundColor: ["#3b82f6", "#10b981"],
//       },
//     ],
//   };

//   // Dummy top customers
//   const topCustomers = [
//     { name: "Amit Sharma", orders: 24 },
//     { name: "Priya Verma", orders: 19 },
//     { name: "Rahul Singh", orders: 15 },
//   ];

//   return (
//     <div className="p-6 text-gray-800 dark:text-white max-w-5xl mx-auto">
//       <h2 className="text-3xl font-bold mb-6">👥 Customers</h2>

//       {/* Overview Stats */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
//         <div className="bg-white dark:bg-secondary p-6 rounded-xl shadow text-center">
//           <h4 className="text-2xl font-bold">{totalCustomers}</h4>
//           <p className="text-gray-500 dark:text-gray-400">Total Customers</p>
//         </div>
//         <div className="bg-white dark:bg-secondary p-6 rounded-xl shadow text-center">
//           <h4 className="text-2xl font-bold">{newCustomers}</h4>
//           <p className="text-gray-500 dark:text-gray-400">New</p>
//         </div>
//         <div className="bg-white dark:bg-secondary p-6 rounded-xl shadow text-center">
//           <h4 className="text-2xl font-bold">{returningCustomers}</h4>
//           <p className="text-gray-500 dark:text-gray-400">Returning</p>
//         </div>
//       </div>

//       {/* Pie Chart */}
//       <div className="bg-white dark:bg-secondary p-6 rounded-xl shadow mb-10">
//         <h3 className="text-xl font-semibold mb-4">Customer Breakdown</h3>
//         <Pie data={customerChartData} />
//       </div>

//       {/* Top Customers */}
//       <div className="bg-white dark:bg-secondary p-6 rounded-xl shadow">
//         <h3 className="text-xl font-semibold mb-4">Top Customers</h3>
//         <ul className="divide-y divide-gray-200 dark:divide-gray-700">
//           {topCustomers.map((c, i) => (
//             <li key={i} className="flex justify-between py-3">
//               <span>{c.name}</span>
//               <span className="font-semibold">{c.orders} orders</span>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default RestaurantCustomers;
