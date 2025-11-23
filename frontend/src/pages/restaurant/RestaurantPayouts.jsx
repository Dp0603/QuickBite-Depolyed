import React, { useEffect, useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import {
  FaMoneyCheckAlt,
  FaUniversity,
  FaRupeeSign,
  FaFileDownload,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaChartLine,
  FaWallet,
  FaHistory,
  FaFilter,
  FaExclamationTriangle,
  FaArrowUp,
  FaArrowDown,
  FaSpinner,
  FaInfoCircle,
  FaBell,
  FaCreditCard,
  FaDownload,
} from "react-icons/fa";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
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
          className={`flex items-start gap-3 p-4 rounded-xl shadow-2xl text-white backdrop-blur-md border ${
            t.type === "success"
              ? "bg-emerald-500/95 border-emerald-400"
              : t.type === "error"
              ? "bg-red-500/95 border-red-400"
              : "bg-blue-500/95 border-blue-400"
          }`}
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
const StatCard = ({ icon, value, label, gradient, trend, delay, subtitle }) => (
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
      </div>

      <p className="text-white/80 text-sm font-semibold mb-1">{label}</p>
      <motion.h4
        className="text-4xl font-black text-white drop-shadow-lg mb-1"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: delay + 0.2, type: "spring" }}
      >
        {value}
      </motion.h4>
      {subtitle && (
        <p className="text-white/70 text-xs font-medium">{subtitle}</p>
      )}
    </div>
  </motion.div>
);

/* ------------------------------- Status Badge ------------------------------- */
const StatusBadge = ({ status }) => {
  const statusConfig = {
    paid: {
      bg: "bg-emerald-100 text-emerald-700",
      icon: <FaCheckCircle />,
      label: "Paid",
    },
    pending: {
      bg: "bg-yellow-100 text-yellow-700",
      icon: <FaClock />,
      label: "Pending",
    },
    failed: {
      bg: "bg-red-100 text-red-700",
      icon: <FaTimesCircle />,
      label: "Failed",
    },
    processing: {
      bg: "bg-blue-100 text-blue-700",
      icon: <FaSpinner />,
      label: "Processing",
    },
  };

  const config = statusConfig[status?.toLowerCase()] || statusConfig.pending;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${config.bg}`}
    >
      {config.icon}
      {config.label}
    </span>
  );
};

/* ------------------------------- Main Component ------------------------------- */
const RestaurantPayouts = () => {
  const { user, token } = useContext(AuthContext);
  const [payouts, setPayouts] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [bankDetails, setBankDetails] = useState(null);
  const [nextPayoutDate, setNextPayoutDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);
  const [downloadingId, setDownloadingId] = useState(null);

  /* --------------------- Toast System --------------------- */
  const pushToast = (payload) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, ...payload }]);
    setTimeout(() => removeToast(id), 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  /* --------------------- Fetch Payouts --------------------- */
  const fetchPayouts = async () => {
    if (!user?._id) return;
    setLoading(true);

    try {
      const res = await axios.get(`/api/payouts/payouts/payee/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          fromDate: fromDate || undefined,
          toDate: toDate || undefined,
        },
      });

      setPayouts(res.data.payouts || []);
      setBankDetails(res.data.bankDetails || null);
      setNextPayoutDate(res.data.nextPayoutDate || null);
    } catch (err) {
      console.error("Failed to fetch payouts", err);
      pushToast({
        type: "error",
        title: "Failed to load payouts",
        message: "Please try again later",
        icon: <FaExclamationTriangle />,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayouts();
  }, [user, token]);

  /* --------------------- Download Invoice --------------------- */
  const handleDownloadInvoice = async (payoutId) => {
    setDownloadingId(payoutId);
    try {
      const res = await axios.get(`/api/payouts/${payoutId}/invoice`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice_${payoutId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      pushToast({
        type: "success",
        title: "Invoice Downloaded",
        message: "Check your downloads folder",
        icon: <FaCheckCircle />,
      });
    } catch (err) {
      console.error("Failed to download invoice", err);
      pushToast({
        type: "error",
        title: "Download Failed",
        message: "Unable to download invoice",
        icon: <FaExclamationTriangle />,
      });
    } finally {
      setDownloadingId(null);
    }
  };

  /* --------------------- Calculations --------------------- */
  const totalPaid = payouts
    .filter((p) => p.status?.toLowerCase() === "paid")
    .reduce((sum, p) => sum + (p.amount || p.payoutAmount || 0), 0);

  const totalPending = payouts
    .filter((p) => p.status?.toLowerCase() === "pending")
    .reduce((sum, p) => sum + (p.amount || p.payoutAmount || 0), 0);

  const totalAmount = payouts.reduce(
    (sum, p) => sum + (p.amount || p.payoutAmount || 0),
    0
  );

  const avgPayout = payouts.length
    ? Math.round(totalAmount / payouts.length)
    : 0;

  /* --------------------- Chart Data --------------------- */
  const last7Payouts = payouts.slice(0, 7).reverse();
  const chartData = {
    labels: last7Payouts.map((p) =>
      new Date(p.createdAt).toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
      })
    ),
    datasets: [
      {
        label: "Payout Amount (₹)",
        data: last7Payouts.map((p) => p.amount || p.payoutAmount || 0),
        borderColor: "rgba(16, 185, 129, 1)",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "rgba(16, 185, 129, 1)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        cornerRadius: 8,
        titleFont: { size: 14, weight: "bold" },
        bodyFont: { size: 13 },
        callbacks: {
          label: (context) =>
            `Amount: ₹${context.parsed.y.toLocaleString("en-IN")}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "rgba(0, 0, 0, 0.05)" },
        ticks: {
          callback: (value) => `₹${value.toLocaleString("en-IN")}`,
          font: { size: 11, weight: "bold" },
        },
      },
      x: {
        grid: { display: false },
        ticks: { font: { size: 11, weight: "bold" } },
      },
    },
  };

  const statCards = [
    {
      icon: <FaRupeeSign />,
      value: `₹${totalPaid.toLocaleString("en-IN")}`,
      label: "Total Paid",
      gradient: "from-emerald-500 to-teal-600",
      trend: 12,
      subtitle: "Successfully transferred",
    },
    {
      icon: <FaClock />,
      value: `₹${totalPending.toLocaleString("en-IN")}`,
      label: "Pending Amount",
      gradient: "from-amber-500 to-orange-600",
      trend: undefined,
      subtitle: "In processing",
    },
    {
      icon: <FaChartLine />,
      value: `₹${avgPayout.toLocaleString("en-IN")}`,
      label: "Avg Payout",
      gradient: "from-purple-500 to-pink-600",
      trend: 5,
      subtitle: "Per transaction",
    },
    {
      icon: <FaHistory />,
      value: payouts.length.toLocaleString(),
      label: "Total Transactions",
      gradient: "from-blue-500 to-cyan-600",
      trend: 18,
      subtitle: "All time",
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
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <motion.div
                  className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-3xl"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  💰
                </motion.div>
                <div>
                  <h1 className="text-4xl font-black text-white drop-shadow-lg">
                    Payouts & Settlement
                  </h1>
                  <p className="text-white/90 text-sm font-medium mt-1 flex items-center gap-2">
                    <FaWallet />
                    Track your earnings and payment history
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Alert Banner */}
        {nextPayoutDate && (
          <motion.div
            className="mb-8 p-5 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg border border-blue-400"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <FaBell className="text-2xl" />
              </motion.div>
              <div>
                <p className="font-bold text-lg">Next Payout Scheduled</p>
                <p className="text-sm text-white/90">
                  Your next payout of ₹{totalPending.toLocaleString("en-IN")} is
                  scheduled for{" "}
                  <span className="font-bold">
                    {new Date(nextPayoutDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Bank Details Card */}
        {bankDetails && (
          <motion.div
            className="mb-8 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="p-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
              <h3 className="text-xl font-black flex items-center gap-2">
                <FaUniversity />
                Payment Method
              </h3>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4">
                {bankDetails.preferredMethod === "bank" ? (
                  <>
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl shadow-lg">
                      <FaUniversity />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-semibold">
                        Bank Account
                      </p>
                      <p className="text-xl font-black text-gray-900">
                        {bankDetails.holderName || "Account Holder"}
                      </p>
                      <p className="text-sm text-gray-600">
                        •••• {bankDetails.bankAccount?.slice(-4) || "0000"} •{" "}
                        {bankDetails.ifsc || "N/A"}
                      </p>
                    </div>
                  </>
                ) : bankDetails.preferredMethod === "upi" ? (
                  <>
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-2xl shadow-lg">
                      <FaMoneyCheckAlt />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-semibold">
                        UPI ID
                      </p>
                      <p className="text-xl font-black text-gray-900">
                        {bankDetails.upiId || "Not Linked"}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-3 text-gray-600">
                    <FaCreditCard className="text-3xl" />
                    <span className="font-semibold">Other payment method</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Stat Cards */}
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
                  subtitle={stat.subtitle}
                />
              ))}
        </div>

        {/* Payout Trend Chart */}
        {!loading && payouts.length > 0 && (
          <motion.div
            className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="p-6 bg-gradient-to-r from-rose-500 to-pink-600 text-white">
              <h3 className="text-2xl font-black flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                  <FaChartLine />
                </div>
                Payout Trends
              </h3>
            </div>
            <div className="p-6">
              <div className="h-80">
                <Line data={chartData} options={chartOptions} />
              </div>
            </div>
          </motion.div>
        )}

        {/* Filters */}
        <motion.div
          className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white">
              <FaFilter />
            </div>
            <h3 className="text-xl font-black text-gray-900">Filter Payouts</h3>
          </div>

          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                From Date
              </label>
              <div className="relative">
                <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-300 focus:border-purple-500 focus:outline-none transition-colors font-medium"
                />
              </div>
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                To Date
              </label>
              <div className="relative">
                <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-300 focus:border-purple-500 focus:outline-none transition-colors font-medium"
                />
              </div>
            </div>

            <motion.button
              onClick={fetchPayouts}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <FaSpinner className="animate-spin" />
                  Loading...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <FaFilter />
                  Apply Filter
                </span>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Payouts Table */}
        <motion.div
          className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="p-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
            <h3 className="text-2xl font-black flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                <FaHistory />
              </div>
              Payout History
            </h3>
          </div>

          <div className="overflow-x-auto">
            <AnimatePresence mode="wait">
              {loading ? (
                <LoadingState key="loading" />
              ) : payouts.length === 0 ? (
                <EmptyState key="empty" />
              ) : (
                <motion.table
                  key="table"
                  className="w-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <thead className="bg-gray-50 border-b-2 border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                        Transaction ID
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-black text-gray-700 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-black text-gray-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-black text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <AnimatePresence>
                      {payouts.map((payout, index) => (
                        <motion.tr
                          key={payout._id}
                          className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.8 + index * 0.05 }}
                          whileHover={{ x: 4 }}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2 text-gray-900 font-semibold">
                              <FaCalendarAlt className="text-gray-400 text-sm" />
                              {new Date(payout.createdAt).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                }
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-mono text-sm text-gray-600">
                              #{payout._id.slice(-8).toUpperCase()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <span className="font-black text-emerald-600 text-lg">
                              ₹
                              {(
                                payout.amount ||
                                payout.payoutAmount ||
                                0
                              ).toLocaleString("en-IN")}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <StatusBadge status={payout.status} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <motion.button
                              onClick={() => handleDownloadInvoice(payout._id)}
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-bold hover:shadow-lg transition-all disabled:opacity-50"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              disabled={downloadingId === payout._id}
                            >
                              {downloadingId === payout._id ? (
                                <>
                                  <FaSpinner className="animate-spin" />
                                  Downloading...
                                </>
                              ) : (
                                <>
                                  <FaDownload />
                                  Invoice
                                </>
                              )}
                            </motion.button>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </motion.table>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Info Section */}
        <motion.div
          className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white shadow-2xl relative overflow-hidden"
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
            <h3 className="text-2xl font-black mb-4 flex items-center gap-2">
              <FaInfoCircle />
              Payout Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                <p className="font-bold mb-1">💳 Payout Frequency</p>
                <p className="text-white/90">
                  Payouts are processed every Monday & Thursday
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                <p className="font-bold mb-1">⏱️ Processing Time</p>
                <p className="text-white/90">
                  Typically 2-3 business days to reach your account
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                <p className="font-bold mb-1">💰 Minimum Payout</p>
                <p className="text-white/90">₹500 minimum balance required</p>
              </div>
              <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                <p className="font-bold mb-1">📧 Support</p>
                <p className="text-white/90">
                  Contact support@restaurant.com for queries
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

const LoadingState = () => (
  <div className="flex flex-col items-center justify-center py-20">
    <motion.div
      className="relative w-16 h-16 mb-4"
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
    >
      <div className="absolute inset-0 border-4 border-emerald-200 rounded-full"></div>
      <div className="absolute inset-0 border-4 border-emerald-600 border-t-transparent rounded-full"></div>
    </motion.div>
    <p className="text-gray-600 font-semibold">Loading payout data...</p>
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
      💸
    </motion.div>
    <h4 className="text-2xl font-black text-gray-800 mb-2">No Payouts Found</h4>
    <p className="text-gray-500 text-lg">
      Your payout history will appear here once transactions are processed
    </p>
  </motion.div>
);

export default RestaurantPayouts;



// import React, { useEffect, useState, useContext } from "react";
// import {
//   FaMoneyCheckAlt,
//   FaUniversity,
//   FaRupeeSign,
//   FaFileDownload,
// } from "react-icons/fa";
// import axios from "axios";
// import { AuthContext } from "../../context/AuthContext";

// const getStatusBadge = (status) => {
//   const base = "inline-block px-3 py-1 rounded-full text-xs font-semibold";
//   if (status.toLowerCase() === "paid")
//     return `${base} bg-green-100 text-green-700`;
//   if (status.toLowerCase() === "pending")
//     return `${base} bg-yellow-100 text-yellow-700`;
//   if (status.toLowerCase() === "failed")
//     return `${base} bg-red-100 text-red-700`;
//   return `${base} bg-gray-100 text-gray-600`;
// };

// const RestaurantPayouts = () => {
//   const { user, token } = useContext(AuthContext);
//   const [payouts, setPayouts] = useState([]);
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [bankDetails, setBankDetails] = useState(null);
//   const [nextPayoutDate, setNextPayoutDate] = useState(null);

//   // 📦 Fetch payouts + bank details
//   const fetchPayouts = async () => {
//     if (!user?._id) return;
//     console.log("🔍 Fetching payouts for user:", user._id, {
//       fromDate,
//       toDate,
//     });

//     try {
//       const res = await axios.get(`/api/payouts/payouts/payee/${user._id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         params: {
//           fromDate: fromDate || undefined,
//           toDate: toDate || undefined,
//         },
//       });

//       console.log("✅ API Response:", res.data);

//       setPayouts(res.data.payouts || []);
//       setBankDetails(res.data.bankDetails || null);
//       setNextPayoutDate(res.data.nextPayoutDate || null);

//       console.log("📊 Payouts set:", res.data.payouts?.length || 0);
//       console.log("🏦 Bank Details:", res.data.bankDetails);
//       console.log("🗓️ Next Payout Date:", res.data.nextPayoutDate);
//     } catch (err) {
//       console.error("❌ Failed to fetch payouts", err);
//     }
//   };

//   useEffect(() => {
//     console.log("⚙️ useEffect triggered: fetching payouts...");
//     fetchPayouts();
//   }, [user, token]);

//   useEffect(() => {
//     console.log("📅 Date filters updated:", { fromDate, toDate });
//   }, [fromDate, toDate]);

//   const totalPaid = payouts
//     .filter((p) => p.status?.toLowerCase() === "paid")
//     .reduce((sum, p) => sum + (p.amount || p.payoutAmount || 0), 0);

//   const handleDownloadInvoice = async (payoutId) => {
//     console.log("⬇️ Downloading invoice for payout:", payoutId);
//     try {
//       const res = await axios.get(`/api/payouts/${payoutId}/invoice`, {
//         headers: { Authorization: `Bearer ${token}` },
//         responseType: "blob",
//       });

//       const url = window.URL.createObjectURL(new Blob([res.data]));
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute("download", `invoice_${payoutId}.pdf`);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();

//       console.log("✅ Invoice downloaded successfully:", payoutId);
//     } catch (err) {
//       console.error("❌ Failed to download invoice", err);
//     }
//   };

//   return (
//     <div className="px-6 py-8 min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-white">
//       <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
//         {/* Header */}
//         <div className="flex items-center justify-between flex-wrap gap-3">
//           <h2 className="text-3xl font-bold">💸 Payouts & Settlement</h2>
//           <span className="text-sm text-gray-500 dark:text-gray-400">
//             Last updated: {new Date().toLocaleString()}
//           </span>
//         </div>

//         {/* Info Banner */}
//         <div className="bg-accent dark:bg-orange-900/10 border-l-4 border-primary text-primary dark:text-orange-300 p-4 rounded-xl shadow">
//           🔔 Your next payout is scheduled on{" "}
//           {nextPayoutDate
//             ? new Date(nextPayoutDate).toLocaleDateString()
//             : "TBD"}
//         </div>

//         {/* Summary Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <div className="bg-white dark:bg-secondary p-5 rounded-2xl shadow flex items-center gap-4">
//             <FaRupeeSign className="text-2xl text-green-600" />
//             <div>
//               <p className="text-sm text-gray-500 dark:text-gray-400">
//                 Total Payouts
//               </p>
//               <h4 className="text-xl font-semibold">
//                 ₹{totalPaid.toLocaleString("en-IN")}
//               </h4>
//             </div>
//           </div>

//           <div className="bg-white dark:bg-secondary p-5 rounded-2xl shadow flex items-center gap-4">
//             <FaUniversity className="text-2xl text-blue-500" />
//             <div>
//               <p className="text-sm text-gray-500 dark:text-gray-400">
//                 Bank Account
//               </p>
//               <h4 className="text-base font-medium flex items-center gap-2">
//                 {bankDetails ? (
//                   bankDetails.preferredMethod === "bank" ? (
//                     <>
//                       <FaUniversity className="text-blue-500" />
//                       {`${
//                         bankDetails.holderName || "Account"
//                       } — ****${bankDetails.bankAccount?.slice(-4)} (${
//                         bankDetails.ifsc || "N/A"
//                       })`}
//                     </>
//                   ) : bankDetails.preferredMethod === "upi" ? (
//                     <>
//                       <FaMoneyCheckAlt className="text-green-500" />
//                       {`UPI: ${bankDetails.upiId || "Not Linked"}`}
//                     </>
//                   ) : (
//                     "Linked via other method"
//                   )
//                 ) : (
//                   "Not Linked"
//                 )}
//               </h4>
//             </div>
//           </div>

//           <div className="bg-white dark:bg-secondary p-5 rounded-2xl shadow flex items-center gap-4">
//             <FaMoneyCheckAlt className="text-2xl text-yellow-500" />
//             <div>
//               <p className="text-sm text-gray-500 dark:text-gray-400">
//                 Next Payout
//               </p>
//               <h4 className="text-base font-medium">
//                 {nextPayoutDate
//                   ? new Date(nextPayoutDate).toLocaleDateString()
//                   : "Pending"}
//               </h4>
//             </div>
//           </div>
//         </div>

//         {/* Filters */}
//         <div className="flex flex-wrap gap-4 items-end">
//           <div>
//             <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">
//               From
//             </label>
//             <input
//               type="date"
//               value={fromDate}
//               onChange={(e) => setFromDate(e.target.value)}
//               className="px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">
//               To
//             </label>
//             <input
//               type="date"
//               value={toDate}
//               onChange={(e) => setToDate(e.target.value)}
//               className="px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
//             />
//           </div>
//           <button
//             onClick={fetchPayouts}
//             className="bg-primary text-white px-5 py-2 rounded-xl text-sm hover:bg-orange-600 transition"
//           >
//             Apply Filter
//           </button>
//         </div>

//         {/* Table */}
//         <div className="rounded-xl shadow overflow-x-auto bg-white dark:bg-secondary">
//           <table className="w-full text-sm min-w-[700px]">
//             <thead className="bg-gray-100 dark:bg-gray-700 sticky top-0 z-10">
//               <tr className="text-left text-gray-600 dark:text-gray-300">
//                 <th className="px-6 py-4 font-semibold">Date</th>
//                 <th className="px-6 py-4 font-semibold">Amount</th>
//                 <th className="px-6 py-4 font-semibold">Status</th>
//                 <th className="px-6 py-4 font-semibold">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {payouts.length > 0 ? (
//                 payouts.map((p) => (
//                   <tr
//                     key={p._id}
//                     className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
//                   >
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {new Date(p.createdAt).toLocaleDateString()}
//                     </td>
//                     <td className="px-6 py-4 font-medium">
//                       ₹
//                       {(p.amount || p.payoutAmount || 0).toLocaleString(
//                         "en-IN"
//                       )}
//                     </td>
//                     <td className="px-6 py-4">
//                       <span className={getStatusBadge(p.status)}>
//                         {p.status}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4">
//                       <button
//                         onClick={() => handleDownloadInvoice(p._id)}
//                         className="flex items-center gap-2 text-primary hover:underline text-sm"
//                       >
//                         <FaFileDownload />
//                         Invoice
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td
//                     colSpan="4"
//                     className="text-center py-6 text-gray-400 dark:text-gray-500"
//                   >
//                     No payouts found.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RestaurantPayouts;
