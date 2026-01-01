import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaMoneyBillWave,
  FaCheck,
  FaClock,
  FaDownload,
  FaSearch,
  FaFilter,
  FaWallet,
  FaCheckCircle,
  FaHourglassHalf,
  FaTimesCircle,
  FaStore,
  FaMotorcycle,
  FaRupeeSign,
  FaCalendarAlt,
  FaFileInvoice,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaExclamationTriangle,
  FaHistory,
  FaCreditCard,
  FaUniversity,
  FaFileExport,
  FaExclamationCircle,
  FaUserTie,
  FaReceipt,
  FaArrowUp,
  FaArrowDown,
  FaSortAmountDown,
  FaSortAmountUp,
  FaInfoCircle,
  FaChartLine,
  FaPercentage,
} from "react-icons/fa";
import API from "../../api/axios";

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

const formatDate = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatDateTime = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/* -------------------------------------------------------------- */
/* MAIN COMPONENT                                                  */
/* -------------------------------------------------------------- */

const AdminPayouts = () => {
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [selectedPayout, setSelectedPayout] = useState(null);
  const [confirmPayout, setConfirmPayout] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  const PAYOUTS_PER_PAGE = 10;

  const statusConfig = {
    paid: {
      icon: <FaCheckCircle />,
      bg: "bg-emerald-100 dark:bg-emerald-900/30",
      text: "text-emerald-700 dark:text-emerald-400",
      border: "border-emerald-200 dark:border-emerald-500/30",
      gradient: "from-emerald-500 to-teal-600",
      label: "Paid",
    },
    pending: {
      icon: <FaHourglassHalf />,
      bg: "bg-amber-100 dark:bg-amber-900/30",
      text: "text-amber-700 dark:text-amber-400",
      border: "border-amber-200 dark:border-amber-500/30",
      gradient: "from-amber-500 to-orange-600",
      label: "Pending",
    },
    failed: {
      icon: <FaTimesCircle />,
      bg: "bg-red-100 dark:bg-red-900/30",
      text: "text-red-700 dark:text-red-400",
      border: "border-red-200 dark:border-red-500/30",
      gradient: "from-red-500 to-rose-600",
      label: "Failed",
    },
    processing: {
      icon: <FaClock />,
      bg: "bg-blue-100 dark:bg-blue-900/30",
      text: "text-blue-700 dark:text-blue-400",
      border: "border-blue-200 dark:border-blue-500/30",
      gradient: "from-blue-500 to-cyan-600",
      label: "Processing",
    },
  };

  // Fetch payouts
  useEffect(() => {
    const fetchPayouts = async () => {
      try {
        const { data } = await API.get("/payouts/payouts");
        setPayouts(data?.payouts || []);
      } catch (err) {
        console.error("❌ Error fetching payouts:", err);
        setError("Failed to load payouts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchPayouts();
  }, []);

  // Mark as paid
  const markAsPaid = async (id) => {
    setProcessingId(id);
    try {
      await API.put(`/payouts/payouts/${id}`, {
        status: "paid",
        note: "Marked paid by admin manually",
      });
      setPayouts((prev) =>
        prev.map((p) =>
          p._id === id ? { ...p, status: "paid", processedAt: new Date() } : p
        )
      );
      setConfirmPayout(null);
    } catch (err) {
      console.error("❌ Error updating payout status:", err);
      alert("Failed to update payout status.");
    } finally {
      setProcessingId(null);
    }
  };

  // Download invoice
  const downloadInvoice = async (id) => {
    try {
      const response = await API.get(`/payouts/payouts/invoice/${id}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `payout_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error("❌ Error downloading invoice:", err);
      alert("Failed to download invoice.");
    }
  };

  // Stats
  const stats = useMemo(() => {
    const total = payouts.length;
    const totalAmount = payouts.reduce(
      (sum, p) => sum + (p.payoutAmount || 0),
      0
    );
    const pendingCount = payouts.filter((p) => p.status === "pending").length;
    const pendingAmount = payouts
      .filter((p) => p.status === "pending")
      .reduce((sum, p) => sum + (p.payoutAmount || 0), 0);
    const paidCount = payouts.filter((p) => p.status === "paid").length;
    const paidAmount = payouts
      .filter((p) => p.status === "paid")
      .reduce((sum, p) => sum + (p.payoutAmount || 0), 0);
    const failedCount = payouts.filter((p) => p.status === "failed").length;
    const restaurantPayouts = payouts.filter(
      (p) => p.payeeType === "restaurant"
    ).length;
    const agentPayouts = payouts.filter(
      (p) => p.payeeType === "delivery"
    ).length;

    return {
      total,
      totalAmount,
      pendingCount,
      pendingAmount,
      paidCount,
      paidAmount,
      failedCount,
      restaurantPayouts,
      agentPayouts,
    };
  }, [payouts]);

  // Animated counts
  const totalAmountCount = useCountUp(stats.totalAmount, 1);
  const pendingAmountCount = useCountUp(stats.pendingAmount, 1.1);
  const paidAmountCount = useCountUp(stats.paidAmount, 1.2);

  // Filter & Sort
  const filteredPayouts = useMemo(() => {
    let result = payouts.filter((p) => {
      const matchStatus = statusFilter ? p.status === statusFilter : true;
      const matchType = typeFilter ? p.payeeType === typeFilter : true;
      const matchSearch = p?.payeeId?.name
        ?.toLowerCase()
        .includes(search.toLowerCase());
      return matchStatus && matchType && matchSearch;
    });

    // Sort
    result.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      if (sortBy === "payoutAmount") {
        aVal = Number(aVal) || 0;
        bVal = Number(bVal) || 0;
      } else if (sortBy === "createdAt" || sortBy === "processedAt") {
        aVal = new Date(aVal || 0).getTime();
        bVal = new Date(bVal || 0).getTime();
      }

      if (sortOrder === "asc") return aVal > bVal ? 1 : -1;
      return aVal < bVal ? 1 : -1;
    });

    return result;
  }, [payouts, search, statusFilter, typeFilter, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredPayouts.length / PAYOUTS_PER_PAGE);
  const paginatedPayouts = filteredPayouts.slice(
    (currentPage - 1) * PAYOUTS_PER_PAGE,
    currentPage * PAYOUTS_PER_PAGE
  );

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  // Export
  const handleExport = () => {
    window.open("/api/admin/export/payouts-csv", "_blank");
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <motion.div
        className="px-4 sm:px-8 md:px-10 lg:px-12 py-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Hero Header */}
        <HeroHeader
          pendingAmount={stats.pendingAmount}
          pendingCount={stats.pendingCount}
          onExport={handleExport}
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <StatsCard
            icon={<FaWallet />}
            value={stats.total}
            label="Total Payouts"
            gradient="from-blue-500 to-cyan-600"
            delay={0.1}
          />
          <StatsCard
            icon={<FaRupeeSign />}
            value={`₹${currency(totalAmountCount)}`}
            label="Total Amount"
            gradient="from-purple-500 to-indigo-600"
            delay={0.15}
          />
          <StatsCard
            icon={<FaHourglassHalf />}
            value={`₹${currency(pendingAmountCount)}`}
            label="Pending"
            gradient="from-amber-500 to-orange-600"
            delay={0.2}
            pulse={stats.pendingCount > 0}
          />
          <StatsCard
            icon={<FaCheckCircle />}
            value={`₹${currency(paidAmountCount)}`}
            label="Paid Out"
            gradient="from-emerald-500 to-teal-600"
            delay={0.25}
          />
          <StatsCard
            icon={<FaStore />}
            value={stats.restaurantPayouts}
            label="Restaurants"
            gradient="from-rose-500 to-pink-600"
            delay={0.3}
          />
          <StatsCard
            icon={<FaMotorcycle />}
            value={stats.agentPayouts}
            label="Agents"
            gradient="from-indigo-500 to-purple-600"
            delay={0.35}
          />
        </div>

        {/* Filters Section */}
        <FiltersSection
          search={search}
          setSearch={setSearch}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          statusConfig={statusConfig}
          totalResults={filteredPayouts.length}
        />

        {/* Payouts Table */}
        {paginatedPayouts.length === 0 ? (
          <EmptyState />
        ) : (
          <PayoutsTable
            payouts={paginatedPayouts}
            statusConfig={statusConfig}
            onView={setSelectedPayout}
            onPay={setConfirmPayout}
            onDownload={downloadInvoice}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={toggleSort}
          />
        )}

        {/* Pagination */}
        {paginatedPayouts.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredPayouts.length}
            itemsPerPage={PAYOUTS_PER_PAGE}
            onPageChange={setCurrentPage}
          />
        )}

        {/* Payout Detail Modal */}
        <AnimatePresence>
          {selectedPayout && (
            <PayoutDetailModal
              payout={selectedPayout}
              statusConfig={statusConfig}
              onClose={() => setSelectedPayout(null)}
              onPay={() => {
                setSelectedPayout(null);
                setConfirmPayout(selectedPayout);
              }}
              onDownload={downloadInvoice}
            />
          )}
        </AnimatePresence>

        {/* Confirm Payment Modal */}
        <AnimatePresence>
          {confirmPayout && (
            <ConfirmPaymentModal
              payout={confirmPayout}
              onConfirm={() => markAsPaid(confirmPayout._id)}
              onClose={() => setConfirmPayout(null)}
              isProcessing={processingId === confirmPayout._id}
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
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
    <motion.div
      className="text-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="w-20 h-20 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
      <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
        Loading Payouts
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Fetching payout records...
      </p>
    </motion.div>
  </div>
);

/* Error State */
const ErrorState = ({ message }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-6">
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
        className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
      >
        Try Again
      </button>
    </motion.div>
  </div>
);

/* Empty State */
const EmptyState = () => (
  <motion.div
    className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-200 dark:border-white/10 p-12 text-center"
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
  >
    <div className="w-24 h-24 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-6">
      <FaMoneyBillWave className="text-5xl text-emerald-500" />
    </div>
    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
      No Payouts Found
    </h3>
    <p className="text-gray-500 dark:text-gray-400">
      Try adjusting your search or filter criteria
    </p>
  </motion.div>
);

/* Hero Header */
const HeroHeader = ({ pendingAmount, pendingCount, onExport }) => (
  <motion.div
    className="relative overflow-hidden rounded-3xl shadow-2xl mb-8 border border-emerald-200 dark:border-white/10"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
  >
    {/* Gradient Background */}
    <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700"></div>

    {/* Pattern Overlay */}
    <div
      className="absolute inset-0 opacity-10"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}
    ></div>

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
              <FaMoneyBillWave className="text-white" />
            </div>
            <span className="text-white/90 font-semibold">
              Financial Management
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-black text-white drop-shadow-lg mb-2">
            Payout Management 💰
          </h1>
          <p className="text-white/80 text-lg">
            Process and track partner payments
          </p>
        </motion.div>

        {/* Right - Quick Stats & Actions */}
        <motion.div
          className="flex gap-4 flex-wrap"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          {pendingCount > 0 && (
            <div className="px-5 py-4 rounded-2xl bg-white/95 backdrop-blur-xl shadow-xl border border-white/50 animate-pulse">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-sm">
                  <FaHourglassHalf />
                </div>
                <span className="text-xs text-gray-600 font-bold uppercase tracking-wide">
                  Pending
                </span>
              </div>
              <p className="text-2xl font-black text-gray-800">
                ₹{currency(pendingAmount)}
              </p>
              <p className="text-xs text-gray-500">{pendingCount} payouts</p>
            </div>
          )}

          <motion.button
            onClick={onExport}
            className="flex items-center gap-2 px-5 py-4 bg-white/95 backdrop-blur-xl text-emerald-700 font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaFileExport /> Export
          </motion.button>
        </motion.div>
      </div>
    </div>
  </motion.div>
);

/* Stats Card */
const StatsCard = ({ icon, value, label, gradient, delay, pulse }) => (
  <motion.div
    className={`relative group ${pulse ? "animate-pulse" : ""}`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    whileHover={{ y: -3 }}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

    <div className="relative p-4 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/10 shadow-md hover:shadow-lg transition-all">
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-md`}
        >
          {icon}
        </div>
        <div>
          <p className="text-lg font-black text-gray-900 dark:text-white">
            {value}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        </div>
      </div>
    </div>
  </motion.div>
);

/* Filters Section */
const FiltersSection = ({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  typeFilter,
  setTypeFilter,
  statusConfig,
  totalResults,
}) => (
  <motion.div
    className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-lg border border-gray-200 dark:border-white/10 mb-6"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.4 }}
  >
    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
      {/* Search */}
      <div className="relative flex-1 w-full lg:max-w-md">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by payee name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <FaFilter className="text-gray-400 mr-1" />

        {/* Status Pills */}
        <StatusPill
          active={statusFilter === ""}
          onClick={() => setStatusFilter("")}
          label="All"
        />
        {Object.entries(statusConfig).map(([status, config]) => (
          <StatusPill
            key={status}
            active={statusFilter === status}
            onClick={() => setStatusFilter(status)}
            label={config.label}
            icon={config.icon}
            color={config}
          />
        ))}

        {/* Type Filter */}
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-2"></div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-emerald-500"
        >
          <option value="">All Types</option>
          <option value="restaurant">🍽️ Restaurant</option>
          <option value="delivery">🏍️ Delivery Agent</option>
        </select>

        <div className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-500/30">
          <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
            {totalResults} payouts
          </span>
        </div>
      </div>
    </div>
  </motion.div>
);

const StatusPill = ({ active, onClick, label, icon, color }) => (
  <motion.button
    onClick={onClick}
    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold text-xs border transition-all ${
      active
        ? color
          ? `${color.bg} ${color.text} ${color.border}`
          : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30"
        : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-slate-700"
    }`}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    {icon}
    {label}
  </motion.button>
);

/* Payouts Table */
const PayoutsTable = ({
  payouts,
  statusConfig,
  onView,
  onPay,
  onDownload,
  sortBy,
  sortOrder,
  onSort,
}) => {
  const SortableHeader = ({ field, children, className }) => (
    <th
      className={`px-4 py-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors ${className}`}
      onClick={() => onSort(field)}
    >
      <div className="flex items-center gap-2">
        {children}
        {sortBy === field && (
          <span className="text-emerald-500">
            {sortOrder === "asc" ? (
              <FaSortAmountUp className="text-xs" />
            ) : (
              <FaSortAmountDown className="text-xs" />
            )}
          </span>
        )}
      </div>
    </th>
  );

  return (
    <motion.div
      className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-200 dark:border-white/10 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-800 border-b border-gray-200 dark:border-white/10">
              <th className="px-4 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Payee
              </th>
              <th className="px-4 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Type
              </th>
              <SortableHeader field="payoutAmount">
                <span className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Amount
                </span>
              </SortableHeader>
              <th className="px-4 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <SortableHeader field="createdAt">
                <span className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Created
                </span>
              </SortableHeader>
              <SortableHeader field="processedAt">
                <span className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Processed
                </span>
              </SortableHeader>
              <th className="px-4 py-4 text-right text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {payouts.map((payout, index) => (
                <PayoutRow
                  key={payout._id}
                  payout={payout}
                  statusConfig={statusConfig}
                  onView={() => onView(payout)}
                  onPay={() => onPay(payout)}
                  onDownload={() => onDownload(payout._id)}
                  delay={index * 0.03}
                />
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

/* Payout Row */
const PayoutRow = ({
  payout,
  statusConfig,
  onView,
  onPay,
  onDownload,
  delay,
}) => {
  const config = statusConfig[payout.status] || statusConfig.pending;
  const isRestaurant = payout.payeeType === "restaurant";

  return (
    <motion.tr
      className="border-b border-gray-100 dark:border-white/5 hover:bg-emerald-50/50 dark:hover:bg-slate-800/50 transition-colors"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ delay }}
    >
      {/* Payee */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl bg-gradient-to-br ${
              isRestaurant
                ? "from-orange-500 to-rose-600"
                : "from-indigo-500 to-purple-600"
            } flex items-center justify-center text-white shadow-md`}
          >
            {isRestaurant ? <FaStore /> : <FaMotorcycle />}
          </div>
          <div>
            <p className="font-bold text-gray-900 dark:text-white text-sm">
              {payout?.payeeId?.name || "Unknown"}
            </p>
            <p className="text-xs text-gray-500">
              ID: {payout._id?.slice(-6).toUpperCase()}
            </p>
          </div>
        </div>
      </td>

      {/* Type */}
      <td className="px-4 py-4">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${
            isRestaurant
              ? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-500/30"
              : "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30"
          }`}
        >
          {isRestaurant ? <FaStore /> : <FaMotorcycle />}
          {isRestaurant ? "Restaurant" : "Delivery"}
        </span>
      </td>

      {/* Amount */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-1">
          <span className="text-lg font-black text-gray-900 dark:text-white">
            ₹{currency(payout.payoutAmount)}
          </span>
        </div>
      </td>

      {/* Status */}
      <td className="px-4 py-4">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl ${config.bg} ${config.text} border ${config.border} font-bold text-xs`}
        >
          {config.icon}
          {config.label}
        </span>
      </td>

      {/* Created Date */}
      <td className="px-4 py-4">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {formatDate(payout.createdAt)}
        </span>
      </td>

      {/* Processed Date */}
      <td className="px-4 py-4">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {payout.processedAt ? formatDate(payout.processedAt) : "-"}
        </span>
      </td>

      {/* Actions */}
      <td className="px-4 py-4">
        <div className="flex items-center justify-end gap-2">
          <motion.button
            onClick={onView}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-semibold text-xs hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaInfoCircle /> View
          </motion.button>

          {payout.status === "pending" ? (
            <motion.button
              onClick={onPay}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold text-xs shadow-md hover:shadow-lg transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaCheck /> Pay Now
            </motion.button>
          ) : payout.status === "paid" ? (
            <motion.button
              onClick={onDownload}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 font-semibold text-xs hover:bg-gray-200 dark:hover:bg-slate-700 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaDownload /> Invoice
            </motion.button>
          ) : null}
        </div>
      </td>
    </motion.tr>
  );
};

/* Pagination */
const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <motion.div
      className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-200 dark:border-white/10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Showing{" "}
        <span className="font-bold text-gray-900 dark:text-white">
          {startItem}-{endItem}
        </span>{" "}
        of{" "}
        <span className="font-bold text-gray-900 dark:text-white">
          {totalItems}
        </span>{" "}
        payouts
      </p>

      <div className="flex items-center gap-2">
        <motion.button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
            currentPage === 1
              ? "bg-gray-100 dark:bg-slate-800 text-gray-400 cursor-not-allowed"
              : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/50"
          }`}
          whileHover={currentPage !== 1 ? { scale: 1.05 } : {}}
          whileTap={currentPage !== 1 ? { scale: 0.95 } : {}}
        >
          <FaChevronLeft /> Prev
        </motion.button>

        <div className="flex items-center gap-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let page;
            if (totalPages <= 5) {
              page = i + 1;
            } else if (currentPage <= 3) {
              page = i + 1;
            } else if (currentPage >= totalPages - 2) {
              page = totalPages - 4 + i;
            } else {
              page = currentPage - 2 + i;
            }

            return (
              <motion.button
                key={page}
                onClick={() => onPageChange(page)}
                className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
                  currentPage === page
                    ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg"
                    : "bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700"
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {page}
              </motion.button>
            );
          })}
        </div>

        <motion.button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
            currentPage === totalPages
              ? "bg-gray-100 dark:bg-slate-800 text-gray-400 cursor-not-allowed"
              : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/50"
          }`}
          whileHover={currentPage !== totalPages ? { scale: 1.05 } : {}}
          whileTap={currentPage !== totalPages ? { scale: 0.95 } : {}}
        >
          Next <FaChevronRight />
        </motion.button>
      </div>
    </motion.div>
  );
};

/* Payout Detail Modal */
const PayoutDetailModal = ({
  payout,
  statusConfig,
  onClose,
  onPay,
  onDownload,
}) => {
  const config = statusConfig[payout.status] || statusConfig.pending;
  const isRestaurant = payout.payeeType === "restaurant";

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white dark:bg-slate-900 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl border border-gray-200 dark:border-white/10"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className={`relative h-36 bg-gradient-to-br ${config.gradient} to-slate-800`}
        >
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>

          {/* Close Button */}
          <motion.button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-all"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaTimes />
          </motion.button>

          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div
                  className={`w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white shadow-lg`}
                >
                  {isRestaurant ? (
                    <FaStore className="text-xl" />
                  ) : (
                    <FaMotorcycle className="text-xl" />
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-black text-white">
                    {payout?.payeeId?.name || "Unknown"}
                  </h2>
                  <p className="text-white/80 text-sm capitalize">
                    {payout.payeeType} Partner
                  </p>
                </div>
              </div>
            </div>
            <span
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl ${config.bg} ${config.text} border ${config.border} font-bold text-sm shadow-lg`}
            >
              {config.icon}
              {config.label}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Amount Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white mb-6">
            <p className="text-white/80 text-sm mb-1">Payout Amount</p>
            <p className="text-4xl font-black">
              ₹{currency(payout.payoutAmount)}
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <InfoCard
              icon={<FaReceipt />}
              title="Payout ID"
              value={`#${payout._id?.slice(-8).toUpperCase()}`}
              color="blue"
            />
            <InfoCard
              icon={<FaCalendarAlt />}
              title="Created On"
              value={formatDateTime(payout.createdAt)}
              color="purple"
            />
            <InfoCard
              icon={<FaClock />}
              title="Processed On"
              value={
                payout.processedAt
                  ? formatDateTime(payout.processedAt)
                  : "Not yet"
              }
              color="amber"
            />
            <InfoCard
              icon={<FaUniversity />}
              title="Payment Method"
              value={payout.paymentMethod || "Bank Transfer"}
              color="emerald"
            />
          </div>

          {/* Notes */}
          {payout.note && (
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-white/10 mb-6">
              <h4 className="font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <FaInfoCircle className="text-blue-500" /> Notes
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {payout.note}
              </p>
            </div>
          )}

          {/* Bank Details */}
          {payout.bankDetails && (
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-white/10 mb-6">
              <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <FaUniversity className="text-indigo-500" /> Bank Details
              </h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-500">Account Name</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {payout.bankDetails.accountName || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Account Number</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {payout.bankDetails.accountNumber || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">IFSC Code</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {payout.bankDetails.ifscCode || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Bank Name</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {payout.bankDetails.bankName || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            {payout.status === "pending" && (
              <motion.button
                onClick={onPay}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold shadow-lg hover:shadow-xl transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaCheckCircle /> Process Payment
              </motion.button>
            )}
            {payout.status === "paid" && (
              <motion.button
                onClick={() => onDownload(payout._id)}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold shadow-lg hover:shadow-xl transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaDownload /> Download Invoice
              </motion.button>
            )}
            <motion.button
              onClick={onClose}
              className="px-6 py-4 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-200 dark:hover:bg-slate-700 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Close
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const InfoCard = ({ icon, title, value, color }) => {
  const colors = {
    blue: "from-blue-500 to-cyan-600",
    purple: "from-purple-500 to-indigo-600",
    amber: "from-amber-500 to-orange-600",
    emerald: "from-emerald-500 to-teal-600",
  };

  return (
    <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-white/10">
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors[color]} flex items-center justify-center text-white shadow-md`}
        >
          {icon}
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">{title}</p>
          <p className="font-bold text-gray-900 dark:text-white text-sm">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
};

/* Confirm Payment Modal */
const ConfirmPaymentModal = ({ payout, onConfirm, onClose, isProcessing }) => (
  <motion.div
    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onClose}
  >
    <motion.div
      className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-gray-200 dark:border-white/10 overflow-hidden"
      initial={{ scale: 0.9, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.9, y: 20 }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-emerald-500 to-teal-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white">
              <FaMoneyBillWave className="text-xl" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Confirm Payment</h3>
              <p className="text-white/80 text-sm">
                Payout #{payout._id?.slice(-6).toUpperCase()}
              </p>
            </div>
          </div>
          <motion.button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaTimes />
          </motion.button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="text-center mb-6">
          <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-4">
            <FaCheckCircle className="text-4xl text-emerald-500" />
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            You are about to process a payout of
          </p>
          <p className="text-4xl font-black text-gray-900 dark:text-white">
            ₹{currency(payout.payoutAmount)}
          </p>
          <p className="text-gray-500 mt-2">
            to{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {payout?.payeeId?.name}
            </span>
          </p>
        </div>

        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-500/30 mb-6">
          <div className="flex items-start gap-3">
            <FaExclamationCircle className="text-amber-500 text-lg mt-0.5" />
            <p className="text-sm text-amber-700 dark:text-amber-400">
              This action cannot be undone. Please ensure all details are
              correct before proceeding.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <motion.button
            onClick={onConfirm}
            disabled={isProcessing}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
            whileHover={!isProcessing ? { scale: 1.02 } : {}}
            whileTap={!isProcessing ? { scale: 0.98 } : {}}
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <FaCheck /> Confirm Payment
              </>
            )}
          </motion.button>
          <motion.button
            onClick={onClose}
            disabled={isProcessing}
            className="px-6 py-4 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-200 dark:hover:bg-slate-700 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Cancel
          </motion.button>
        </div>
      </div>
    </motion.div>
  </motion.div>
);

export default AdminPayouts;
