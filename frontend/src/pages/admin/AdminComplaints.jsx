import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaExclamationTriangle,
  FaCheck,
  FaTrash,
  FaSpinner,
  FaSearch,
  FaFilter,
  FaTicketAlt,
  FaCheckCircle,
  FaHourglassHalf,
  FaTimesCircle,
  FaClock,
  FaUser,
  FaEnvelope,
  FaCalendarAlt,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaExclamationCircle,
  FaCommentAlt,
  FaReply,
  FaEye,
  FaHistory,
  FaSortAmountDown,
  FaSortAmountUp,
  FaFileExport,
  FaHeadset,
  FaBug,
  FaShippingFast,
  FaMoneyBillWave,
  FaUtensils,
  FaInfoCircle,
  FaClipboardList,
  FaPhone,
  FaRegClock,
  FaFlag,
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

const getTimeAgo = (date) => {
  if (!date) return "";
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(date);
};

/* -------------------------------------------------------------- */
/* MAIN COMPONENT                                                  */
/* -------------------------------------------------------------- */

const AdminComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [issueFilter, setIssueFilter] = useState("");
  const [actionLoading, setActionLoading] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [replyModal, setReplyModal] = useState(null);

  const ITEMS_PER_PAGE = 10;

  const statusConfig = {
    pending: {
      icon: <FaExclamationCircle />,
      bg: "bg-red-100 dark:bg-red-900/30",
      text: "text-red-700 dark:text-red-400",
      border: "border-red-200 dark:border-red-500/30",
      gradient: "from-red-500 to-rose-600",
      label: "Pending",
    },
    "in-progress": {
      icon: <FaHourglassHalf />,
      bg: "bg-amber-100 dark:bg-amber-900/30",
      text: "text-amber-700 dark:text-amber-400",
      border: "border-amber-200 dark:border-amber-500/30",
      gradient: "from-amber-500 to-orange-600",
      label: "In Progress",
    },
    resolved: {
      icon: <FaCheckCircle />,
      bg: "bg-emerald-100 dark:bg-emerald-900/30",
      text: "text-emerald-700 dark:text-emerald-400",
      border: "border-emerald-200 dark:border-emerald-500/30",
      gradient: "from-emerald-500 to-teal-600",
      label: "Resolved",
    },
    closed: {
      icon: <FaTimesCircle />,
      bg: "bg-gray-100 dark:bg-gray-900/30",
      text: "text-gray-700 dark:text-gray-400",
      border: "border-gray-200 dark:border-gray-500/30",
      gradient: "from-gray-500 to-slate-600",
      label: "Closed",
    },
  };

  const issueConfig = {
    delivery: {
      icon: <FaShippingFast />,
      color: "text-blue-500",
      bg: "bg-blue-100 dark:bg-blue-900/30",
    },
    payment: {
      icon: <FaMoneyBillWave />,
      color: "text-emerald-500",
      bg: "bg-emerald-100 dark:bg-emerald-900/30",
    },
    food: {
      icon: <FaUtensils />,
      color: "text-orange-500",
      bg: "bg-orange-100 dark:bg-orange-900/30",
    },
    order: {
      icon: <FaClipboardList />,
      color: "text-purple-500",
      bg: "bg-purple-100 dark:bg-purple-900/30",
    },
    other: {
      icon: <FaBug />,
      color: "text-gray-500",
      bg: "bg-gray-100 dark:bg-gray-900/30",
    },
  };

  // Fetch complaints
  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/complaints");
      setComplaints(res.data.data || res.data || []);
    } catch (error) {
      console.error("Error fetching complaints:", error);
    } finally {
      setLoading(false);
    }
  };

  // Resolve complaint
  const handleResolve = async (ticketId) => {
    try {
      setActionLoading(ticketId);
      await API.put(`/admin/complaints/${ticketId}/status`, {
        status: "resolved",
      });
      fetchComplaints();
      setConfirmAction(null);
    } catch (error) {
      console.error("Error updating complaint:", error);
    } finally {
      setActionLoading(null);
    }
  };

  // Delete complaint
  const handleDelete = async (ticketId, complaintId) => {
    try {
      setActionLoading(ticketId);
      await API.delete(`/admin/complaints/${ticketId}`);
      setComplaints((prev) => prev.filter((c) => c._id !== complaintId));
      setConfirmAction(null);
    } catch (error) {
      console.error("Error deleting complaint:", error);
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // Stats
  const stats = useMemo(() => {
    const total = complaints.length;
    const pending = complaints.filter((c) => c.status === "pending").length;
    const inProgress = complaints.filter(
      (c) => c.status === "in-progress"
    ).length;
    const resolved = complaints.filter((c) => c.status === "resolved").length;
    const closed = complaints.filter((c) => c.status === "closed").length;

    // Calculate average resolution time (mock)
    const avgResolutionTime = "2.5 hrs";

    return { total, pending, inProgress, resolved, closed, avgResolutionTime };
  }, [complaints]);

  // Animated counts
  const totalCount = useCountUp(stats.total, 0.8);
  const pendingCount = useCountUp(stats.pending, 0.9);
  const inProgressCount = useCountUp(stats.inProgress, 1);
  const resolvedCount = useCountUp(stats.resolved, 1.1);

  // Filter & Sort
  const filteredComplaints = useMemo(() => {
    let result = complaints.filter((c) => {
      const matchSearch =
        c.name?.toLowerCase().includes(search.toLowerCase()) ||
        c.issue?.toLowerCase().includes(search.toLowerCase()) ||
        c.message?.toLowerCase().includes(search.toLowerCase()) ||
        c.ticketId?.toLowerCase().includes(search.toLowerCase()) ||
        c.email?.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter ? c.status === statusFilter : true;
      const matchIssue = issueFilter ? c.issue === issueFilter : true;
      return matchSearch && matchStatus && matchIssue;
    });

    // Sort
    result.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      if (sortBy === "createdAt") {
        aVal = new Date(aVal || 0).getTime();
        bVal = new Date(bVal || 0).getTime();
      }

      if (sortOrder === "asc") return aVal > bVal ? 1 : -1;
      return aVal < bVal ? 1 : -1;
    });

    return result;
  }, [complaints, search, statusFilter, issueFilter, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredComplaints.length / ITEMS_PER_PAGE);
  const paginatedComplaints = filteredComplaints.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
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
    window.open("/api/admin/export/complaints-csv", "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50/30 to-orange-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <motion.div
        className="px-4 sm:px-8 md:px-10 lg:px-12 py-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Hero Header */}
        <HeroHeader
          pendingCount={stats.pending}
          inProgressCount={stats.inProgress}
          onExport={handleExport}
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <StatsCard
            icon={<FaTicketAlt />}
            value={totalCount}
            label="Total Tickets"
            gradient="from-blue-500 to-cyan-600"
            delay={0.1}
          />
          <StatsCard
            icon={<FaExclamationCircle />}
            value={pendingCount}
            label="Pending"
            gradient="from-red-500 to-rose-600"
            delay={0.15}
            pulse={stats.pending > 0}
          />
          <StatsCard
            icon={<FaHourglassHalf />}
            value={inProgressCount}
            label="In Progress"
            gradient="from-amber-500 to-orange-600"
            delay={0.2}
          />
          <StatsCard
            icon={<FaCheckCircle />}
            value={resolvedCount}
            label="Resolved"
            gradient="from-emerald-500 to-teal-600"
            delay={0.25}
          />
          <StatsCard
            icon={<FaTimesCircle />}
            value={stats.closed}
            label="Closed"
            gradient="from-gray-500 to-slate-600"
            delay={0.3}
          />
          <StatsCard
            icon={<FaClock />}
            value={stats.avgResolutionTime}
            label="Avg. Resolution"
            gradient="from-purple-500 to-indigo-600"
            delay={0.35}
          />
        </div>

        {/* Filters Section */}
        <FiltersSection
          search={search}
          setSearch={setSearch}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          issueFilter={issueFilter}
          setIssueFilter={setIssueFilter}
          statusConfig={statusConfig}
          totalResults={filteredComplaints.length}
        />

        {/* Complaints Table/Cards */}
        {loading ? (
          <LoadingState />
        ) : paginatedComplaints.length === 0 ? (
          <EmptyState />
        ) : (
          <ComplaintsTable
            complaints={paginatedComplaints}
            statusConfig={statusConfig}
            issueConfig={issueConfig}
            onView={setSelectedComplaint}
            onResolve={(c) =>
              setConfirmAction({ type: "resolve", complaint: c })
            }
            onDelete={(c) => setConfirmAction({ type: "delete", complaint: c })}
            onReply={setReplyModal}
            actionLoading={actionLoading}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={toggleSort}
          />
        )}

        {/* Pagination */}
        {!loading && paginatedComplaints.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredComplaints.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
          />
        )}

        {/* Complaint Detail Modal */}
        <AnimatePresence>
          {selectedComplaint && (
            <ComplaintDetailModal
              complaint={selectedComplaint}
              statusConfig={statusConfig}
              issueConfig={issueConfig}
              onClose={() => setSelectedComplaint(null)}
              onResolve={() => {
                setSelectedComplaint(null);
                setConfirmAction({
                  type: "resolve",
                  complaint: selectedComplaint,
                });
              }}
              onReply={() => {
                setSelectedComplaint(null);
                setReplyModal(selectedComplaint);
              }}
            />
          )}
        </AnimatePresence>

        {/* Confirm Action Modal */}
        <AnimatePresence>
          {confirmAction && (
            <ConfirmActionModal
              type={confirmAction.type}
              complaint={confirmAction.complaint}
              onConfirm={() => {
                if (confirmAction.type === "resolve") {
                  handleResolve(confirmAction.complaint.ticketId);
                } else {
                  handleDelete(
                    confirmAction.complaint.ticketId,
                    confirmAction.complaint._id
                  );
                }
              }}
              onClose={() => setConfirmAction(null)}
              isProcessing={actionLoading === confirmAction.complaint.ticketId}
            />
          )}
        </AnimatePresence>

        {/* Reply Modal */}
        <AnimatePresence>
          {replyModal && (
            <ReplyModal
              complaint={replyModal}
              onClose={() => setReplyModal(null)}
              onSend={(message) => {
                console.log("Sending reply:", message);
                setReplyModal(null);
              }}
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
  <motion.div
    className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-200 dark:border-white/10 p-12"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    <div className="flex flex-col items-center justify-center">
      <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-gray-600 dark:text-gray-400 font-medium">
        Loading complaints...
      </p>
    </div>
  </motion.div>
);

/* Empty State */
const EmptyState = () => (
  <motion.div
    className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-200 dark:border-white/10 p-12 text-center"
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
  >
    <div className="w-24 h-24 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-6">
      <FaCheckCircle className="text-5xl text-emerald-500" />
    </div>
    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
      No Complaints Found
    </h3>
    <p className="text-gray-500 dark:text-gray-400">
      All caught up! No complaints match your criteria.
    </p>
  </motion.div>
);

/* Hero Header */
const HeroHeader = ({ pendingCount, inProgressCount, onExport }) => (
  <motion.div
    className="relative overflow-hidden rounded-3xl shadow-2xl mb-8 border border-red-200 dark:border-white/10"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
  >
    {/* Gradient Background */}
    <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-rose-500 to-orange-600"></div>

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
              <FaHeadset className="text-white" />
            </div>
            <span className="text-white/90 font-semibold">Support Center</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-black text-white drop-shadow-lg mb-2">
            Complaints & Help Tickets 🎫
          </h1>
          <p className="text-white/80 text-lg">
            Manage and resolve customer support tickets
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
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white text-sm">
                  <FaExclamationCircle />
                </div>
                <span className="text-xs text-gray-600 font-bold uppercase tracking-wide">
                  Urgent
                </span>
              </div>
              <p className="text-2xl font-black text-gray-800">
                {pendingCount}
              </p>
              <p className="text-xs text-gray-500">pending tickets</p>
            </div>
          )}

          {inProgressCount > 0 && (
            <div className="px-5 py-4 rounded-2xl bg-white/95 backdrop-blur-xl shadow-xl border border-white/50">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-sm">
                  <FaHourglassHalf />
                </div>
                <span className="text-xs text-gray-600 font-bold uppercase tracking-wide">
                  Active
                </span>
              </div>
              <p className="text-2xl font-black text-gray-800">
                {inProgressCount}
              </p>
              <p className="text-xs text-gray-500">in progress</p>
            </div>
          )}

          <motion.button
            onClick={onExport}
            className="flex items-center gap-2 px-5 py-4 bg-white/95 backdrop-blur-xl text-red-700 font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all"
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
    <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

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
  issueFilter,
  setIssueFilter,
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
          placeholder="Search by name, ticket ID, issue, or message..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
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

        {/* Issue Type Filter */}
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-2"></div>

        <select
          value={issueFilter}
          onChange={(e) => setIssueFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-red-500"
        >
          <option value="">All Issues</option>
          <option value="delivery">🚚 Delivery</option>
          <option value="payment">💳 Payment</option>
          <option value="food">🍕 Food Quality</option>
          <option value="order">📦 Order</option>
          <option value="other">🔧 Other</option>
        </select>

        <div className="px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30">
          <span className="text-sm font-bold text-red-700 dark:text-red-400">
            {totalResults} tickets
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
          : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/30"
        : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-slate-700"
    }`}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    {icon}
    {label}
  </motion.button>
);

/* Complaints Table */
const ComplaintsTable = ({
  complaints,
  statusConfig,
  issueConfig,
  onView,
  onResolve,
  onDelete,
  onReply,
  actionLoading,
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
          <span className="text-red-500">
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
                Ticket
              </th>
              <th className="px-4 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-4 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Issue
              </th>
              <th className="px-4 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Message
              </th>
              <th className="px-4 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <SortableHeader field="createdAt">
                <span className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </span>
              </SortableHeader>
              <th className="px-4 py-4 text-right text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {complaints.map((complaint, index) => (
                <ComplaintRow
                  key={complaint._id}
                  complaint={complaint}
                  statusConfig={statusConfig}
                  issueConfig={issueConfig}
                  onView={() => onView(complaint)}
                  onResolve={() => onResolve(complaint)}
                  onDelete={() => onDelete(complaint)}
                  onReply={() => onReply(complaint)}
                  actionLoading={actionLoading}
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

/* Complaint Row */
const ComplaintRow = ({
  complaint,
  statusConfig,
  issueConfig,
  onView,
  onResolve,
  onDelete,
  onReply,
  actionLoading,
  delay,
}) => {
  const config = statusConfig[complaint.status] || statusConfig.pending;
  const issue = issueConfig[complaint.issue] || issueConfig.other;
  const isLoading = actionLoading === complaint.ticketId;

  return (
    <motion.tr
      className="border-b border-gray-100 dark:border-white/5 hover:bg-red-50/50 dark:hover:bg-slate-800/50 transition-colors"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ delay }}
    >
      {/* Ticket ID */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white shadow-md">
            <FaTicketAlt />
          </div>
          <div>
            <p className="font-mono font-bold text-gray-900 dark:text-white text-sm">
              #{complaint.ticketId?.slice(-6).toUpperCase()}
            </p>
            <p className="text-xs text-gray-500">
              {getTimeAgo(complaint.createdAt)}
            </p>
          </div>
        </div>
      </td>

      {/* Customer */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm">
            {complaint.name?.charAt(0)?.toUpperCase() || "?"}
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white text-sm">
              {complaint.name}
            </p>
            {complaint.email && (
              <p className="text-xs text-gray-500 truncate max-w-[120px]">
                {complaint.email}
              </p>
            )}
          </div>
        </div>
      </td>

      {/* Issue Type */}
      <td className="px-4 py-4">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold capitalize ${issue.bg} ${issue.color}`}
        >
          {issue.icon}
          {complaint.issue}
        </span>
      </td>

      {/* Message Preview */}
      <td className="px-4 py-4">
        <p className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-[200px]">
          {complaint.message}
        </p>
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

      {/* Date */}
      <td className="px-4 py-4">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {formatDate(complaint.createdAt)}
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
            <FaEye /> View
          </motion.button>

          {complaint.status !== "resolved" && complaint.status !== "closed" && (
            <motion.button
              onClick={onResolve}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold text-xs shadow-md hover:shadow-lg transition-all disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isLoading ? <FaSpinner className="animate-spin" /> : <FaCheck />}
              Resolve
            </motion.button>
          )}

          <motion.button
            onClick={onDelete}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 font-semibold text-xs hover:bg-red-200 dark:hover:bg-red-900/50 transition-all disabled:opacity-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaTrash />
          </motion.button>
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
        tickets
      </p>

      <div className="flex items-center gap-2">
        <motion.button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
            currentPage === 1
              ? "bg-gray-100 dark:bg-slate-800 text-gray-400 cursor-not-allowed"
              : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50"
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
                    ? "bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg"
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
              : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50"
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

/* Complaint Detail Modal */
const ComplaintDetailModal = ({
  complaint,
  statusConfig,
  issueConfig,
  onClose,
  onResolve,
  onReply,
}) => {
  const config = statusConfig[complaint.status] || statusConfig.pending;
  const issue = issueConfig[complaint.issue] || issueConfig.other;

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

          {/* Priority Flag */}
          {complaint.status === "pending" && (
            <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-red-500 text-white rounded-full text-xs font-bold">
              <FaFlag /> Urgent
            </div>
          )}

          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
            <div>
              <p className="text-white/80 text-sm mb-1">Ticket ID</p>
              <h2 className="text-2xl font-black text-white">
                #{complaint.ticketId?.slice(-8).toUpperCase()}
              </h2>
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
          {/* Customer & Issue Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <InfoCard
              icon={<FaUser />}
              title="Customer Name"
              value={complaint.name}
              color="blue"
            />
            <InfoCard
              icon={<FaEnvelope />}
              title="Email"
              value={complaint.email || "N/A"}
              color="purple"
            />
            <InfoCard
              icon={issue.icon}
              title="Issue Type"
              value={complaint.issue}
              color="orange"
            />
            <InfoCard
              icon={<FaCalendarAlt />}
              title="Submitted On"
              value={formatDateTime(complaint.createdAt)}
              color="emerald"
            />
          </div>

          {/* Message */}
          <div className="mb-6">
            <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <FaCommentAlt className="text-red-500" /> Complaint Message
            </h4>
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-white/10">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {complaint.message}
              </p>
            </div>
          </div>

          {/* Timeline */}
          <div className="mb-6">
            <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FaHistory className="text-indigo-500" /> Activity Timeline
            </h4>
            <div className="space-y-4">
              <TimelineItem
                icon={<FaTicketAlt />}
                title="Ticket Created"
                time={formatDateTime(complaint.createdAt)}
                completed
              />
              {complaint.status === "in-progress" && (
                <TimelineItem
                  icon={<FaHourglassHalf />}
                  title="Under Review"
                  time="In progress"
                  completed
                  active
                />
              )}
              {complaint.status === "resolved" && (
                <TimelineItem
                  icon={<FaCheckCircle />}
                  title="Resolved"
                  time={formatDateTime(complaint.resolvedAt || new Date())}
                  completed
                />
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 flex-wrap">
            {complaint.status !== "resolved" &&
              complaint.status !== "closed" && (
                <>
                  <motion.button
                    onClick={onResolve}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold shadow-lg hover:shadow-xl transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FaCheckCircle /> Mark as Resolved
                  </motion.button>
                  <motion.button
                    onClick={onReply}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold shadow-lg hover:shadow-xl transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FaReply /> Send Reply
                  </motion.button>
                </>
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
    orange: "from-orange-500 to-rose-600",
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
          <p className="font-bold text-gray-900 dark:text-white text-sm capitalize">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
};

const TimelineItem = ({ icon, title, time, completed, active }) => (
  <div className="flex items-start gap-4">
    <div className="relative">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center ${
          completed
            ? active
              ? "bg-gradient-to-br from-amber-500 to-orange-600 text-white animate-pulse"
              : "bg-gradient-to-br from-emerald-500 to-teal-600 text-white"
            : "bg-gray-200 dark:bg-slate-700 text-gray-400"
        }`}
      >
        {icon}
      </div>
    </div>
    <div className="flex-1 pt-2">
      <p
        className={`font-semibold ${
          completed ? "text-gray-900 dark:text-white" : "text-gray-400"
        }`}
      >
        {title}
      </p>
      <p className="text-sm text-gray-500">{time}</p>
    </div>
  </div>
);

/* Confirm Action Modal */
const ConfirmActionModal = ({
  type,
  complaint,
  onConfirm,
  onClose,
  isProcessing,
}) => {
  const isResolve = type === "resolve";

  return (
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
        <div
          className={`p-6 ${
            isResolve
              ? "bg-gradient-to-r from-emerald-500 to-teal-600"
              : "bg-gradient-to-r from-red-500 to-rose-600"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white">
                {isResolve ? (
                  <FaCheckCircle className="text-xl" />
                ) : (
                  <FaTrash className="text-xl" />
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  {isResolve ? "Resolve Ticket" : "Delete Ticket"}
                </h3>
                <p className="text-white/80 text-sm">
                  #{complaint.ticketId?.slice(-6).toUpperCase()}
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
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
                isResolve
                  ? "bg-emerald-100 dark:bg-emerald-900/30"
                  : "bg-red-100 dark:bg-red-900/30"
              }`}
            >
              {isResolve ? (
                <FaCheckCircle className="text-4xl text-emerald-500" />
              ) : (
                <FaTrash className="text-4xl text-red-500" />
              )}
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              {isResolve
                ? "Are you sure you want to mark this ticket as resolved?"
                : "Are you sure you want to delete this ticket?"}
            </p>
            <p className="font-semibold text-gray-900 dark:text-white">
              {complaint.name} - {complaint.issue}
            </p>
          </div>

          {!isResolve && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 mb-6">
              <div className="flex items-start gap-3">
                <FaExclamationTriangle className="text-red-500 text-lg mt-0.5" />
                <p className="text-sm text-red-700 dark:text-red-400">
                  This action cannot be undone. The ticket and all associated
                  data will be permanently deleted.
                </p>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <motion.button
              onClick={onConfirm}
              disabled={isProcessing}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-white font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 ${
                isResolve
                  ? "bg-gradient-to-r from-emerald-500 to-teal-600"
                  : "bg-gradient-to-r from-red-500 to-rose-600"
              }`}
              whileHover={!isProcessing ? { scale: 1.02 } : {}}
              whileTap={!isProcessing ? { scale: 0.98 } : {}}
            >
              {isProcessing ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  {isResolve ? <FaCheck /> : <FaTrash />}
                  {isResolve ? "Resolve" : "Delete"}
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
};

/* Reply Modal */
const ReplyModal = ({ complaint, onClose, onSend }) => {
  const [message, setMessage] = useState("");

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl border border-gray-200 dark:border-white/10 overflow-hidden"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-blue-500 to-indigo-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white">
                <FaReply className="text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  Reply to Ticket
                </h3>
                <p className="text-white/80 text-sm">
                  #{complaint.ticketId?.slice(-6).toUpperCase()}
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
          <div className="mb-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Replying to:
            </p>
            <p className="font-semibold text-gray-900 dark:text-white">
              {complaint.name} ({complaint.email})
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Your Response
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your response here..."
              rows={5}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            />
          </div>

          <div className="flex gap-3">
            <motion.button
              onClick={() => onSend(message)}
              disabled={!message.trim()}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={message.trim() ? { scale: 1.02 } : {}}
              whileTap={message.trim() ? { scale: 0.98 } : {}}
            >
              <FaReply /> Send Reply
            </motion.button>
            <motion.button
              onClick={onClose}
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
};

export default AdminComplaints;
