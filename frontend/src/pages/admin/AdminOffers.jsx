// src/pages/Admin/AdminOffers.jsx
import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaGift,
  FaPlus,
  FaEdit,
  FaTrash,
  FaPause,
  FaPlay,
  FaClock,
  FaChartLine,
  FaTag,
  FaCheckCircle,
  FaSearch,
  FaFilter,
  FaTimesCircle,
  FaCalendarAlt,
  FaPercent,
  FaRupeeSign,
  FaStore,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaExclamationTriangle,
  FaFileExport,
  FaSortAmountDown,
  FaSortAmountUp,
  FaEye,
  FaHourglassHalf,
  FaTicketAlt,
  FaInfoCircle,
  FaSpinner,
  FaSave,
  FaCopy,
  FaUsers,
  FaShoppingCart,
  FaPercentage,
  FaBolt,
  FaFire,
} from "react-icons/fa";
import API from "../../api/axios";
import toast from "react-hot-toast";

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

const getTimeRemaining = (date) => {
  if (!date) return "";
  const diff = new Date(date) - new Date();
  if (diff <= 0) return "Expired";
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days > 0) return `${days} days left`;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours > 0) return `${hours} hours left`;
  const minutes = Math.floor(diff / (1000 * 60));
  return `${minutes} mins left`;
};

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text);
  toast.success("Copied to clipboard!");
};

/* -------------------------------------------------------------- */
/* MAIN COMPONENT                                                  */
/* -------------------------------------------------------------- */

const AdminOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  const OFFERS_PER_PAGE = 10;

  const statusConfig = {
    active: {
      icon: <FaCheckCircle />,
      bg: "bg-emerald-100 dark:bg-emerald-900/30",
      text: "text-emerald-700 dark:text-emerald-400",
      border: "border-emerald-200 dark:border-emerald-500/30",
      gradient: "from-emerald-500 to-teal-600",
      label: "Active",
    },
    inactive: {
      icon: <FaPause />,
      bg: "bg-amber-100 dark:bg-amber-900/30",
      text: "text-amber-700 dark:text-amber-400",
      border: "border-amber-200 dark:border-amber-500/30",
      gradient: "from-amber-500 to-orange-600",
      label: "Inactive",
    },
    expired: {
      icon: <FaTimesCircle />,
      bg: "bg-red-100 dark:bg-red-900/30",
      text: "text-red-700 dark:text-red-400",
      border: "border-red-200 dark:border-red-500/30",
      gradient: "from-red-500 to-rose-600",
      label: "Expired",
    },
    scheduled: {
      icon: <FaClock />,
      bg: "bg-blue-100 dark:bg-blue-900/30",
      text: "text-blue-700 dark:text-blue-400",
      border: "border-blue-200 dark:border-blue-500/30",
      gradient: "from-blue-500 to-cyan-600",
      label: "Scheduled",
    },
  };

  // Fetch offers
  const fetchOffers = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/offers");
      setOffers(res.data.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load offers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  // Get offer status
  const getOfferStatus = (offer) => {
    const now = new Date();
    const validFrom = new Date(offer.validFrom);
    const validTill = new Date(offer.validTill);

    if (validTill < now) return "expired";
    if (validFrom > now) return "scheduled";
    if (!offer.isActive) return "inactive";
    return "active";
  };

  // Toggle offer status
  const handleToggle = async (id) => {
    try {
      setActionLoading(id);
      await API.patch(`/admin/offers/toggle/${id}`);
      toast.success("Offer status updated");
      fetchOffers();
    } catch (err) {
      toast.error("Failed to update offer status");
    } finally {
      setActionLoading(null);
    }
  };

  // Delete offer
  const handleDelete = async (id) => {
    try {
      setActionLoading(id);
      await API.delete(`/admin/offers/${id}`);
      toast.success("Offer deleted successfully");
      fetchOffers();
      setConfirmDelete(null);
    } catch (err) {
      toast.error("Failed to delete offer");
    } finally {
      setActionLoading(null);
    }
  };

  // Stats
  const stats = useMemo(() => {
    const total = offers.length;
    const active = offers.filter((o) => getOfferStatus(o) === "active").length;
    const inactive = offers.filter(
      (o) => getOfferStatus(o) === "inactive"
    ).length;
    const expired = offers.filter(
      (o) => getOfferStatus(o) === "expired"
    ).length;
    const scheduled = offers.filter(
      (o) => getOfferStatus(o) === "scheduled"
    ).length;
    const flatOffers = offers.filter((o) => o.discountType === "FLAT").length;
    const percentOffers = offers.filter(
      (o) => o.discountType === "PERCENT"
    ).length;

    // Calculate total potential savings
    const totalSavings = offers
      .filter((o) => getOfferStatus(o) === "active")
      .reduce((sum, o) => {
        if (o.discountType === "FLAT") return sum + (o.discountValue || 0);
        return sum + (o.discountValue || 0) * 10; // Assuming avg order ₹1000
      }, 0);

    return {
      total,
      active,
      inactive,
      expired,
      scheduled,
      flatOffers,
      percentOffers,
      totalSavings,
    };
  }, [offers]);

  // Animated counts
  const totalCount = useCountUp(stats.total, 0.8);
  const activeCount = useCountUp(stats.active, 0.9);
  const expiredCount = useCountUp(stats.expired, 1);
  const scheduledCount = useCountUp(stats.scheduled, 1.1);

  // Filter & Sort
  const filteredOffers = useMemo(() => {
    let result = offers.filter((o) => {
      const matchSearch =
        o.title?.toLowerCase().includes(search.toLowerCase()) ||
        (o.promoCode || "").toLowerCase().includes(search.toLowerCase()) ||
        o.restaurantId?.name?.toLowerCase().includes(search.toLowerCase());

      const offerStatus = getOfferStatus(o);
      const matchStatus = statusFilter ? offerStatus === statusFilter : true;
      const matchType = typeFilter ? o.discountType === typeFilter : true;

      return matchSearch && matchStatus && matchType;
    });

    // Sort
    result.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      if (sortBy === "discountValue") {
        aVal = Number(aVal) || 0;
        bVal = Number(bVal) || 0;
      } else if (
        sortBy === "createdAt" ||
        sortBy === "validTill" ||
        sortBy === "validFrom"
      ) {
        aVal = new Date(aVal || 0).getTime();
        bVal = new Date(bVal || 0).getTime();
      } else {
        aVal = String(aVal || "").toLowerCase();
        bVal = String(bVal || "").toLowerCase();
      }

      if (sortOrder === "asc") return aVal > bVal ? 1 : -1;
      return aVal < bVal ? 1 : -1;
    });

    return result;
  }, [offers, search, statusFilter, typeFilter, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredOffers.length / OFFERS_PER_PAGE);
  const paginatedOffers = filteredOffers.slice(
    (currentPage - 1) * OFFERS_PER_PAGE,
    currentPage * OFFERS_PER_PAGE
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
    window.open("/api/admin/export/offers-csv", "_blank");
  };

  if (loading) return <LoadingState />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-amber-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <motion.div
        className="px-4 sm:px-8 md:px-10 lg:px-12 py-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Hero Header */}
        <HeroHeader
          activeOffers={stats.active}
          totalSavings={stats.totalSavings}
          onExport={handleExport}
          onCreate={() => setShowCreateModal(true)}
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <StatsCard
            icon={<FaGift />}
            value={totalCount}
            label="Total Offers"
            gradient="from-blue-500 to-cyan-600"
            delay={0.1}
          />
          <StatsCard
            icon={<FaCheckCircle />}
            value={activeCount}
            label="Active"
            gradient="from-emerald-500 to-teal-600"
            delay={0.15}
            pulse={stats.active > 0}
          />
          <StatsCard
            icon={<FaPause />}
            value={stats.inactive}
            label="Inactive"
            gradient="from-amber-500 to-orange-600"
            delay={0.2}
          />
          <StatsCard
            icon={<FaTimesCircle />}
            value={expiredCount}
            label="Expired"
            gradient="from-red-500 to-rose-600"
            delay={0.25}
          />
          <StatsCard
            icon={<FaClock />}
            value={scheduledCount}
            label="Scheduled"
            gradient="from-blue-500 to-indigo-600"
            delay={0.3}
          />
          <StatsCard
            icon={<FaPercentage />}
            value={stats.percentOffers}
            label="% Discounts"
            gradient="from-purple-500 to-pink-600"
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
          totalResults={filteredOffers.length}
        />

        {/* Offers Table */}
        {paginatedOffers.length === 0 ? (
          <EmptyState onCreate={() => setShowCreateModal(true)} />
        ) : (
          <OffersTable
            offers={paginatedOffers}
            statusConfig={statusConfig}
            getOfferStatus={getOfferStatus}
            onView={setSelectedOffer}
            onEdit={setEditingOffer}
            onToggle={handleToggle}
            onDelete={setConfirmDelete}
            actionLoading={actionLoading}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={toggleSort}
          />
        )}

        {/* Pagination */}
        {paginatedOffers.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredOffers.length}
            itemsPerPage={OFFERS_PER_PAGE}
            onPageChange={setCurrentPage}
          />
        )}

        {/* Offer Detail Modal */}
        <AnimatePresence>
          {selectedOffer && (
            <OfferDetailModal
              offer={selectedOffer}
              statusConfig={statusConfig}
              getOfferStatus={getOfferStatus}
              onClose={() => setSelectedOffer(null)}
              onEdit={() => {
                setSelectedOffer(null);
                setEditingOffer(selectedOffer);
              }}
              onToggle={() => {
                handleToggle(selectedOffer._id);
                setSelectedOffer(null);
              }}
            />
          )}
        </AnimatePresence>

        {/* Create/Edit Modal */}
        <AnimatePresence>
          {(showCreateModal || editingOffer) && (
            <OfferFormModal
              offer={editingOffer}
              onClose={() => {
                setShowCreateModal(false);
                setEditingOffer(null);
              }}
              onSuccess={() => {
                setShowCreateModal(false);
                setEditingOffer(null);
                fetchOffers();
              }}
            />
          )}
        </AnimatePresence>

        {/* Confirm Delete Modal */}
        <AnimatePresence>
          {confirmDelete && (
            <ConfirmDeleteModal
              offer={confirmDelete}
              onConfirm={() => handleDelete(confirmDelete._id)}
              onClose={() => setConfirmDelete(null)}
              isProcessing={actionLoading === confirmDelete._id}
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
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-orange-50/30 to-amber-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
    <motion.div
      className="text-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="w-20 h-20 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
      <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
        Loading Offers
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Fetching promotional offers...
      </p>
    </motion.div>
  </div>
);

/* Empty State */
const EmptyState = ({ onCreate }) => (
  <motion.div
    className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-200 dark:border-white/10 p-12 text-center"
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
  >
    <div className="w-24 h-24 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mx-auto mb-6">
      <FaGift className="text-5xl text-orange-500" />
    </div>
    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
      No Offers Found
    </h3>
    <p className="text-gray-500 dark:text-gray-400 mb-6">
      Create your first promotional offer to attract customers
    </p>
    <motion.button
      onClick={onCreate}
      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <FaPlus /> Create New Offer
    </motion.button>
  </motion.div>
);

/* Hero Header */
const HeroHeader = ({ activeOffers, totalSavings, onExport, onCreate }) => (
  <motion.div
    className="relative overflow-hidden rounded-3xl shadow-2xl mb-8 border border-orange-200 dark:border-white/10"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
  >
    {/* Gradient Background */}
    <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-600"></div>

    {/* Pattern Overlay */}
    <div
      className="absolute inset-0 opacity-10"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}
    ></div>

    {/* Floating Icons */}
    <div className="absolute top-6 right-20 opacity-20">
      <FaGift className="text-6xl text-white animate-bounce" />
    </div>
    <div className="absolute bottom-6 right-40 opacity-10">
      <FaPercentage className="text-8xl text-white" />
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
              <FaGift className="text-white" />
            </div>
            <span className="text-white/90 font-semibold">Promotions Hub</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-black text-white drop-shadow-lg mb-2">
            Manage Offers 🎁
          </h1>
          <p className="text-white/80 text-lg">
            Create, manage, and track promotional campaigns
          </p>
        </motion.div>

        {/* Right - Quick Stats & Actions */}
        <motion.div
          className="flex gap-4 flex-wrap"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          {activeOffers > 0 && (
            <div className="px-5 py-4 rounded-2xl bg-white/95 backdrop-blur-xl shadow-xl border border-white/50">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-sm">
                  <FaFire />
                </div>
                <span className="text-xs text-gray-600 font-bold uppercase tracking-wide">
                  Live Now
                </span>
              </div>
              <p className="text-2xl font-black text-gray-800">
                {activeOffers}
              </p>
              <p className="text-xs text-gray-500">active offers</p>
            </div>
          )}

          <motion.button
            onClick={onExport}
            className="flex items-center gap-2 px-5 py-4 bg-white/95 backdrop-blur-xl text-orange-700 font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaFileExport /> Export
          </motion.button>

          <motion.button
            onClick={onCreate}
            className="flex items-center gap-2 px-5 py-4 bg-white text-orange-600 font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaPlus /> New Offer
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
    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-amber-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

    <div className="relative p-4 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/10 shadow-md hover:shadow-lg transition-all">
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-md`}
        >
          {icon}
        </div>
        <div>
          <p className="text-xl font-black text-gray-900 dark:text-white">
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
          placeholder="Search by title, code, or restaurant..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
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
          className="px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-orange-500"
        >
          <option value="">All Types</option>
          <option value="FLAT">💵 Flat Discount</option>
          <option value="PERCENT">📊 Percentage</option>
        </select>

        <div className="px-3 py-1.5 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-500/30">
          <span className="text-sm font-bold text-orange-700 dark:text-orange-400">
            {totalResults} offers
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
          : "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-500/30"
        : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-slate-700"
    }`}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    {icon}
    {label}
  </motion.button>
);

/* Offers Table */
const OffersTable = ({
  offers,
  statusConfig,
  getOfferStatus,
  onView,
  onEdit,
  onToggle,
  onDelete,
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
          <span className="text-orange-500">
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
              <SortableHeader field="title">
                <span className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Offer
                </span>
              </SortableHeader>
              <th className="px-4 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Restaurant
              </th>
              <th className="px-4 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Code
              </th>
              <SortableHeader field="discountValue">
                <span className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Discount
                </span>
              </SortableHeader>
              <SortableHeader field="validTill">
                <span className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Validity
                </span>
              </SortableHeader>
              <th className="px-4 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-4 text-right text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {offers.map((offer, index) => (
                <OfferRow
                  key={offer._id}
                  offer={offer}
                  statusConfig={statusConfig}
                  getOfferStatus={getOfferStatus}
                  onView={() => onView(offer)}
                  onEdit={() => onEdit(offer)}
                  onToggle={() => onToggle(offer._id)}
                  onDelete={() => onDelete(offer)}
                  isLoading={actionLoading === offer._id}
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

/* Offer Row */
const OfferRow = ({
  offer,
  statusConfig,
  getOfferStatus,
  onView,
  onEdit,
  onToggle,
  onDelete,
  isLoading,
  delay,
}) => {
  const status = getOfferStatus(offer);
  const config = statusConfig[status] || statusConfig.inactive;
  const isFlat = offer.discountType === "FLAT";
  const timeRemaining = getTimeRemaining(offer.validTill);

  return (
    <motion.tr
      className="border-b border-gray-100 dark:border-white/5 hover:bg-orange-50/50 dark:hover:bg-slate-800/50 transition-colors"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ delay }}
    >
      {/* Offer Title */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white shadow-md">
            <FaGift />
          </div>
          <div>
            <p className="font-bold text-gray-900 dark:text-white text-sm">
              {offer.title}
            </p>
            <p className="text-xs text-gray-500">
              {offer.description?.slice(0, 30) || "No description"}...
            </p>
          </div>
        </div>
      </td>

      {/* Restaurant */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <FaStore className="text-sm" />
          </div>
          <span className="font-medium text-gray-700 dark:text-gray-300 text-sm truncate max-w-[120px]">
            {offer.restaurantId?.name || "All Restaurants"}
          </span>
        </div>
      </td>

      {/* Promo Code */}
      <td className="px-4 py-4">
        {offer.promoCode ? (
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-sm px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white border border-dashed border-gray-300 dark:border-white/20">
              {offer.promoCode}
            </span>
            <motion.button
              onClick={() => copyToClipboard(offer.promoCode)}
              className="p-1.5 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-500 hover:text-orange-500 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaCopy className="text-xs" />
            </motion.button>
          </div>
        ) : (
          <span className="text-sm text-gray-400 italic">Auto-applied</span>
        )}
      </td>

      {/* Discount */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              isFlat
                ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                : "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
            }`}
          >
            {isFlat ? (
              <FaRupeeSign className="text-sm" />
            ) : (
              <FaPercent className="text-sm" />
            )}
          </div>
          <span className="font-black text-gray-900 dark:text-white">
            {isFlat ? `₹${offer.discountValue}` : `${offer.discountValue}%`}
          </span>
        </div>
      </td>

      {/* Validity */}
      <td className="px-4 py-4">
        <div>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {formatDate(offer.validFrom)} → {formatDate(offer.validTill)}
          </p>
          <p
            className={`text-xs font-medium ${
              status === "expired"
                ? "text-red-500"
                : status === "active"
                ? "text-emerald-500"
                : "text-gray-400"
            }`}
          >
            {timeRemaining}
          </p>
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

      {/* Actions */}
      <td className="px-4 py-4">
        <div className="flex items-center justify-end gap-2">
          <motion.button
            onClick={onView}
            className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="View Details"
          >
            <FaEye className="text-sm" />
          </motion.button>

          <motion.button
            onClick={onEdit}
            className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-all"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Edit Offer"
          >
            <FaEdit className="text-sm" />
          </motion.button>

          {status !== "expired" && (
            <motion.button
              onClick={onToggle}
              disabled={isLoading}
              className={`p-2 rounded-xl transition-all ${
                offer.isActive
                  ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900/50"
                  : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/50"
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title={offer.isActive ? "Pause Offer" : "Activate Offer"}
            >
              {isLoading ? (
                <FaSpinner className="text-sm animate-spin" />
              ) : offer.isActive ? (
                <FaPause className="text-sm" />
              ) : (
                <FaPlay className="text-sm" />
              )}
            </motion.button>
          )}

          <motion.button
            onClick={onDelete}
            className="p-2 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-all"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Delete Offer"
          >
            <FaTrash className="text-sm" />
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
        offers
      </p>

      <div className="flex items-center gap-2">
        <motion.button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
            currentPage === 1
              ? "bg-gray-100 dark:bg-slate-800 text-gray-400 cursor-not-allowed"
              : "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-900/50"
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
                    ? "bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-lg"
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
              : "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-900/50"
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

/* Offer Detail Modal */
const OfferDetailModal = ({
  offer,
  statusConfig,
  getOfferStatus,
  onClose,
  onEdit,
  onToggle,
}) => {
  const status = getOfferStatus(offer);
  const config = statusConfig[status] || statusConfig.inactive;
  const isFlat = offer.discountType === "FLAT";
  const timeRemaining = getTimeRemaining(offer.validTill);

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
          className={`relative h-40 bg-gradient-to-br ${config.gradient} to-slate-800`}
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
                <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white shadow-lg">
                  <FaGift className="text-2xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">
                    {offer.title}
                  </h2>
                  <p className="text-white/80">{offer.description}</p>
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
          {/* Discount Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-white mb-6 text-center">
            <p className="text-white/80 text-sm mb-2">Discount Value</p>
            <p className="text-5xl font-black">
              {isFlat ? `₹${offer.discountValue}` : `${offer.discountValue}%`}
            </p>
            <p className="text-white/80 text-sm mt-2">
              {isFlat ? "Flat Discount" : "Percentage Off"}
            </p>
          </div>

          {/* Promo Code */}
          {offer.promoCode && (
            <div className="mb-6 p-4 rounded-xl bg-gray-50 dark:bg-slate-800 border-2 border-dashed border-gray-300 dark:border-white/20 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                Promo Code
              </p>
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl font-mono font-black text-gray-900 dark:text-white tracking-widest">
                  {offer.promoCode}
                </span>
                <motion.button
                  onClick={() => copyToClipboard(offer.promoCode)}
                  className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 hover:bg-orange-200 transition-all"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaCopy />
                </motion.button>
              </div>
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <InfoCard
              icon={<FaStore />}
              title="Restaurant"
              value={offer.restaurantId?.name || "All Restaurants"}
              color="purple"
            />
            <InfoCard
              icon={<FaCalendarAlt />}
              title="Valid From"
              value={formatDateTime(offer.validFrom)}
              color="blue"
            />
            <InfoCard
              icon={<FaClock />}
              title="Valid Till"
              value={formatDateTime(offer.validTill)}
              color="amber"
            />
            <InfoCard
              icon={<FaHourglassHalf />}
              title="Time Remaining"
              value={timeRemaining}
              color={status === "expired" ? "red" : "emerald"}
            />
          </div>

          {/* Additional Info */}
          {(offer.minOrderValue || offer.maxDiscount || offer.usageLimit) && (
            <div className="mb-6">
              <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <FaInfoCircle className="text-orange-500" /> Terms & Conditions
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {offer.minOrderValue && (
                  <div className="p-3 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-white/10">
                    <p className="text-xs text-gray-500">Min Order Value</p>
                    <p className="font-bold text-gray-900 dark:text-white">
                      ₹{offer.minOrderValue}
                    </p>
                  </div>
                )}
                {offer.maxDiscount && (
                  <div className="p-3 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-white/10">
                    <p className="text-xs text-gray-500">Max Discount</p>
                    <p className="font-bold text-gray-900 dark:text-white">
                      ₹{offer.maxDiscount}
                    </p>
                  </div>
                )}
                {offer.usageLimit && (
                  <div className="p-3 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-white/10">
                    <p className="text-xs text-gray-500">Usage Limit</p>
                    <p className="font-bold text-gray-900 dark:text-white">
                      {offer.usageLimit} times
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 flex-wrap">
            {status !== "expired" && (
              <motion.button
                onClick={onToggle}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all ${
                  offer.isActive
                    ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white"
                    : "bg-gradient-to-r from-emerald-500 to-teal-600 text-white"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {offer.isActive ? <FaPause /> : <FaPlay />}
                {offer.isActive ? "Pause Offer" : "Activate Offer"}
              </motion.button>
            )}
            <motion.button
              onClick={onEdit}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaEdit /> Edit Offer
            </motion.button>
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
    red: "from-red-500 to-rose-600",
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

/* Offer Form Modal (Create/Edit) */
const OfferFormModal = ({ offer, onClose, onSuccess }) => {
  const isEditing = !!offer;
  const [formData, setFormData] = useState({
    title: offer?.title || "",
    description: offer?.description || "",
    promoCode: offer?.promoCode || "",
    discountType: offer?.discountType || "PERCENT",
    discountValue: offer?.discountValue || "",
    minOrderValue: offer?.minOrderValue || "",
    maxDiscount: offer?.maxDiscount || "",
    validFrom: offer?.validFrom
      ? new Date(offer.validFrom).toISOString().slice(0, 16)
      : "",
    validTill: offer?.validTill
      ? new Date(offer.validTill).toISOString().slice(0, 16)
      : "",
    usageLimit: offer?.usageLimit || "",
    isActive: offer?.isActive ?? true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isEditing) {
        await API.put(`/admin/offers/${offer._id}`, formData);
        toast.success("Offer updated successfully");
      } else {
        await API.post("/admin/offers", formData);
        toast.success("Offer created successfully");
      }
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save offer");
    } finally {
      setIsSubmitting(false);
    }
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
        className="bg-white dark:bg-slate-900 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl border border-gray-200 dark:border-white/10"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-orange-500 to-amber-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white">
                {isEditing ? (
                  <FaEdit className="text-xl" />
                ) : (
                  <FaPlus className="text-xl" />
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  {isEditing ? "Edit Offer" : "Create New Offer"}
                </h3>
                <p className="text-white/80 text-sm">
                  {isEditing
                    ? "Update offer details"
                    : "Set up a new promotional offer"}
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-5">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Offer Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Summer Sale 50% Off"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief description of the offer..."
                rows={2}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
              />
            </div>

            {/* Promo Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Promo Code
              </label>
              <input
                type="text"
                name="promoCode"
                value={formData.promoCode}
                onChange={handleChange}
                placeholder="e.g., SUMMER50"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all font-mono uppercase"
              />
            </div>

            {/* Discount Type & Value */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Discount Type *
                </label>
                <select
                  name="discountType"
                  value={formData.discountType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500"
                >
                  <option value="PERCENT">Percentage (%)</option>
                  <option value="FLAT">Flat Amount (₹)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Discount Value *
                </label>
                <input
                  type="number"
                  name="discountValue"
                  value={formData.discountValue}
                  onChange={handleChange}
                  placeholder={
                    formData.discountType === "PERCENT"
                      ? "e.g., 20"
                      : "e.g., 100"
                  }
                  required
                  min="0"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Min Order & Max Discount */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Min Order Value (₹)
                </label>
                <input
                  type="number"
                  name="minOrderValue"
                  value={formData.minOrderValue}
                  onChange={handleChange}
                  placeholder="e.g., 500"
                  min="0"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Max Discount (₹)
                </label>
                <input
                  type="number"
                  name="maxDiscount"
                  value={formData.maxDiscount}
                  onChange={handleChange}
                  placeholder="e.g., 200"
                  min="0"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Validity Period */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Valid From *
                </label>
                <input
                  type="datetime-local"
                  name="validFrom"
                  value={formData.validFrom}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Valid Till *
                </label>
                <input
                  type="datetime-local"
                  name="validTill"
                  value={formData.validTill}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Usage Limit & Active Toggle */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Usage Limit
                </label>
                <input
                  type="number"
                  name="usageLimit"
                  value={formData.usageLimit}
                  onChange={handleChange}
                  placeholder="Unlimited if empty"
                  min="0"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-white/10 cursor-pointer w-full">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="w-5 h-5 rounded text-orange-500 focus:ring-orange-500"
                  />
                  <span className="font-medium text-gray-900 dark:text-white">
                    Activate Immediately
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-8">
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              whileHover={!isSubmitting ? { scale: 1.02 } : {}}
              whileTap={!isSubmitting ? { scale: 0.98 } : {}}
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <FaSave />
                  {isEditing ? "Update Offer" : "Create Offer"}
                </>
              )}
            </motion.button>
            <motion.button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-4 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-200 dark:hover:bg-slate-700 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

/* Confirm Delete Modal */
const ConfirmDeleteModal = ({ offer, onConfirm, onClose, isProcessing }) => (
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
      <div className="p-6 bg-gradient-to-r from-red-500 to-rose-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white">
              <FaTrash className="text-xl" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Delete Offer</h3>
              <p className="text-white/80 text-sm">
                This action cannot be undone
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
          <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
            <FaExclamationTriangle className="text-4xl text-red-500" />
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            Are you sure you want to delete this offer?
          </p>
          <p className="font-bold text-gray-900 dark:text-white text-lg">
            "{offer.title}"
          </p>
          {offer.promoCode && (
            <p className="font-mono text-sm text-gray-500 mt-1">
              Code: {offer.promoCode}
            </p>
          )}
        </div>

        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 mb-6">
          <div className="flex items-start gap-3">
            <FaExclamationTriangle className="text-red-500 text-lg mt-0.5" />
            <p className="text-sm text-red-700 dark:text-red-400">
              This will permanently delete the offer and cannot be recovered.
              Any active promotions using this offer will stop working
              immediately.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <motion.button
            onClick={onConfirm}
            disabled={isProcessing}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
            whileHover={!isProcessing ? { scale: 1.02 } : {}}
            whileTap={!isProcessing ? { scale: 0.98 } : {}}
          >
            {isProcessing ? (
              <>
                <FaSpinner className="animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <FaTrash />
                Delete Offer
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

export default AdminOffers;

// old
// import React, { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import {
//   FaGift,
//   FaPlus,
//   FaEdit,
//   FaTrash,
//   FaPause,
//   FaPlay,
//   FaClock,
//   FaChartLine,
//   FaTag,
//   FaCheckCircle,
// } from "react-icons/fa";
// import API from "../../api/axios";
// import toast from "react-hot-toast";

// const AdminOffers = () => {
//   const [offers, setOffers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");

//   // ✅ Fetch offers (from working API)
//   const fetchOffers = async () => {
//     try {
//       setLoading(true);
//       const res = await API.get("/admin/offers");
//       setOffers(res.data.data || []);
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to load offers");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOffers();
//   }, []);

//   // ✅ Toggle offer status
//   const handleToggle = async (id) => {
//     try {
//       await API.patch(`/admin/offers/toggle/${id}`);
//       toast.success("Offer status updated");
//       fetchOffers();
//     } catch (err) {
//       toast.error("Failed to update offer status");
//     }
//   };

//   // ✅ Delete offer
//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this offer?")) return;
//     try {
//       await API.delete(`/admin/offers/${id}`);
//       toast.success("Offer deleted");
//       fetchOffers();
//     } catch (err) {
//       toast.error("Failed to delete offer");
//     }
//   };

//   // 🧮 Filtering
//   const filtered = offers.filter((o) => {
//     const matchSearch =
//       o.title?.toLowerCase().includes(search.toLowerCase()) ||
//       (o.promoCode || "").toLowerCase().includes(search.toLowerCase());
//     const matchStatus = statusFilter
//       ? (o.isActive ? "active" : "inactive") === statusFilter
//       : true;
//     return matchSearch && matchStatus;
//   });

//   // 🟢 Status colors
//   const statusColors = {
//     active: "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-300",
//     expired: "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-300",
//     inactive:
//       "bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-300",
//   };

//   return (
//     <motion.div
//       className="min-h-screen w-full bg-gray-50 dark:bg-gray-950 px-6 py-8 text-gray-800 dark:text-white"
//       initial={{ opacity: 0, y: 30 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.4 }}
//     >
//       {/* HEADER */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
//         <div>
//           <h2 className="text-3xl font-bold flex items-center gap-2">
//             <FaGift className="text-orange-500" /> Manage Offers
//           </h2>
//           <p className="text-gray-600 dark:text-gray-400 text-sm">
//             View, toggle, and manage all promotional offers.
//           </p>
//         </div>
//         <button className="bg-primary text-white px-4 py-2 rounded hover:bg-orange-600 flex items-center gap-2">
//           <FaPlus /> New Offer
//         </button>
//       </div>

//       {/* Summary cards */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
//         <div className="bg-white dark:bg-secondary p-5 rounded-xl shadow text-center">
//           <FaCheckCircle className="text-green-500 text-2xl mx-auto mb-2" />
//           <p className="text-lg font-semibold">
//             {offers.filter((o) => o.isActive).length}
//           </p>
//           <p className="text-sm text-gray-500">Active Offers</p>
//         </div>
//         <div className="bg-white dark:bg-secondary p-5 rounded-xl shadow text-center">
//           <FaClock className="text-red-500 text-2xl mx-auto mb-2" />
//           <p className="text-lg font-semibold">
//             {offers.filter((o) => new Date(o.validTill) < new Date()).length}
//           </p>
//           <p className="text-sm text-gray-500">Expired Offers</p>
//         </div>
//         <div className="bg-white dark:bg-secondary p-5 rounded-xl shadow text-center">
//           <FaChartLine className="text-blue-500 text-2xl mx-auto mb-2" />
//           <p className="text-lg font-semibold">{offers.length}</p>
//           <p className="text-sm text-gray-500">Total Offers</p>
//         </div>
//         <div className="bg-white dark:bg-secondary p-5 rounded-xl shadow text-center">
//           <FaTag className="text-orange-500 text-2xl mx-auto mb-2" />
//           <p className="text-lg font-semibold">
//             {offers.filter((o) => !o.isActive).length}
//           </p>
//           <p className="text-sm text-gray-500">Inactive</p>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="flex flex-wrap justify-between gap-4 mb-6">
//         <input
//           type="text"
//           placeholder="Search by title or code"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="px-3 py-2 w-full sm:w-80 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-secondary text-sm"
//         />
//         <select
//           value={statusFilter}
//           onChange={(e) => setStatusFilter(e.target.value)}
//           className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-secondary text-sm"
//         >
//           <option value="">All</option>
//           <option value="active">Active</option>
//           <option value="inactive">Inactive</option>
//         </select>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto bg-white dark:bg-secondary rounded-xl shadow">
//         <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
//           <thead>
//             <tr className="bg-gray-100 dark:bg-gray-800 text-sm">
//               <th className="px-4 py-3">Title</th>
//               <th className="px-4 py-3">Restaurant</th>
//               <th className="px-4 py-3">Code</th>
//               <th className="px-4 py-3">Type</th>
//               <th className="px-4 py-3">Discount</th>
//               <th className="px-4 py-3">Validity</th>
//               <th className="px-4 py-3">Status</th>
//               <th className="px-4 py-3 text-right">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {loading ? (
//               <tr>
//                 <td
//                   colSpan="8"
//                   className="text-center py-6 text-gray-500 dark:text-gray-400"
//                 >
//                   Loading offers...
//                 </td>
//               </tr>
//             ) : filtered.length > 0 ? (
//               filtered.map((offer) => {
//                 const isExpired = new Date(offer.validTill) < new Date();
//                 const status = isExpired
//                   ? "expired"
//                   : offer.isActive
//                   ? "active"
//                   : "inactive";

//                 return (
//                   <tr
//                     key={offer._id}
//                     className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
//                   >
//                     <td className="px-4 py-3 font-medium">{offer.title}</td>
//                     <td className="px-4 py-3 text-sm italic text-gray-600 dark:text-gray-400">
//                       {offer.restaurantId?.name || "—"}
//                     </td>
//                     <td className="px-4 py-3 text-sm font-mono">
//                       {offer.promoCode || "—"}
//                     </td>
//                     <td className="px-4 py-3">{offer.discountType}</td>
//                     <td className="px-4 py-3">
//                       {offer.discountType === "FLAT"
//                         ? `₹${offer.discountValue}`
//                         : `${offer.discountValue}%`}
//                     </td>
//                     <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
//                       {new Date(offer.validFrom).toLocaleDateString()} →{" "}
//                       {new Date(offer.validTill).toLocaleDateString()}
//                     </td>
//                     <td className="px-4 py-3">
//                       <span
//                         className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusColors[status]}`}
//                       >
//                         {status}
//                       </span>
//                     </td>
//                     <td className="px-4 py-3 text-right flex justify-end gap-2">
//                       <button
//                         onClick={() => handleToggle(offer._id)}
//                         className={`px-3 py-1 text-xs rounded flex items-center gap-1 ${
//                           offer.isActive
//                             ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
//                             : "bg-green-100 text-green-700 hover:bg-green-200"
//                         }`}
//                       >
//                         {offer.isActive ? <FaPause /> : <FaPlay />}
//                         {offer.isActive ? "Pause" : "Activate"}
//                       </button>

//                       <button className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded flex items-center gap-1 hover:bg-blue-200">
//                         <FaEdit /> Edit
//                       </button>

//                       <button
//                         onClick={() => handleDelete(offer._id)}
//                         className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded flex items-center gap-1 hover:bg-red-200"
//                       >
//                         <FaTrash /> Delete
//                       </button>
//                     </td>
//                   </tr>
//                 );
//               })
//             ) : (
//               <tr>
//                 <td
//                   colSpan="8"
//                   className="px-4 py-6 text-center text-gray-500 dark:text-gray-400"
//                 >
//                   No offers found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </motion.div>
//   );
// };

// export default AdminOffers;
