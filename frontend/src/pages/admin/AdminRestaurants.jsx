import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUtensils,
  FaCheck,
  FaTimes,
  FaInfoCircle,
  FaFileExport,
  FaSearch,
  FaFilter,
  FaStore,
  FaCheckCircle,
  FaHourglassHalf,
  FaTimesCircle,
  FaStar,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaChevronDown,
  FaExternalLinkAlt,
  FaUserTie,
  FaClipboardCheck,
  FaExclamationTriangle,
  FaEye,
  FaDownload,
  FaClock,
  FaGlobe,
} from "react-icons/fa";
import API from "../../api/axios";

const PAGE_SIZE = 9;

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

/* -------------------------------------------------------------- */
/* MAIN COMPONENT                                                  */
/* -------------------------------------------------------------- */

const AdminRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  // Fetch all restaurants
  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      try {
        const res = await API.get("/admin/restaurants");
        setRestaurants(res.data.data);
      } catch (err) {
        console.error("❌ Error fetching restaurants:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  // Approve/Reject with loading state
  const updateStatus = async (id, status) => {
    setActionLoading(id);
    try {
      const res = await API.put(`/admin/restaurants/${id}/approval`, {
        status,
      });

      setRestaurants((prev) =>
        prev.map((r) =>
          r._id === id ? { ...r, status: res.data.data.status } : r
        )
      );
    } catch (err) {
      console.error("❌ Error updating restaurant approval:", err);
    } finally {
      setActionLoading(null);
    }
  };

  // Stats
  const stats = useMemo(() => {
    const total = restaurants.length;
    const pending = restaurants.filter((r) => r.status === "pending").length;
    const approved = restaurants.filter((r) => r.status === "approved").length;
    const rejected = restaurants.filter((r) => r.status === "rejected").length;
    return { total, pending, approved, rejected };
  }, [restaurants]);

  // Animated counts
  const totalCount = useCountUp(stats.total, 0.8);
  const pendingCount = useCountUp(stats.pending, 0.9);
  const approvedCount = useCountUp(stats.approved, 1);
  const rejectedCount = useCountUp(stats.rejected, 1.1);

  // Filters
  const filtered = useMemo(() => {
    return restaurants.filter((r) => {
      const matchesSearch = `${r.name} ${r.owner?.name || ""}`
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesStatus = statusFilter ? r.status === statusFilter : true;
      return matchesSearch && matchesStatus;
    });
  }, [restaurants, search, statusFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Export CSV
  const handleExport = () => {
    window.open("/api/admin/export/restaurants-csv", "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-zinc-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <motion.div
        className="px-4 sm:px-8 md:px-10 lg:px-12 py-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Hero Header */}
        <HeroHeader
          pendingCount={stats.pending}
          totalCount={stats.total}
          onExport={handleExport}
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatsCard
            icon={<FaStore />}
            value={totalCount}
            label="Total Restaurants"
            gradient="from-slate-600 to-slate-800"
            delay={0.1}
          />
          <StatsCard
            icon={<FaHourglassHalf />}
            value={pendingCount}
            label="Pending Approval"
            gradient="from-amber-600 to-amber-700"
            pulse={pendingCount > 0}
          />
          <StatsCard
            icon={<FaCheckCircle />}
            value={approvedCount}
            label="Approved"
            gradient="from-emerald-600 to-emerald-700"
            delay={0.2}
          />
          <StatsCard
            icon={<FaTimesCircle />}
            value={rejectedCount}
            label="Rejected"
            gradient="from-red-600 to-rose-700"
            delay={0.25}
          />
        </div>

        {/* Filters Section */}
        <FiltersSection
          search={search}
          setSearch={setSearch}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          totalResults={filtered.length}
        />

        {/* Restaurants Grid/Table */}
        {loading ? (
          <LoadingState />
        ) : paginated.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <RestaurantsGrid
              restaurants={paginated}
              onView={setSelectedRestaurant}
              onApprove={(id) => updateStatus(id, "approved")}
              onReject={(id) => updateStatus(id, "rejected")}
              actionLoading={actionLoading}
            />
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-10">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Showing {(page - 1) * PAGE_SIZE + 1}–
                  {Math.min(page * PAGE_SIZE, filtered.length)} of{" "}
                  {filtered.length} restaurants
                </p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    disabled={page === 1}
                    className="px-3 py-2 rounded-lg border text-sm disabled:opacity-50"
                  >
                    ◀ Prev
                  </button>

                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`px-3 py-2 rounded-lg text-sm font-semibold ${
                        page === i + 1
                          ? "bg-slate-800 text-white dark:bg-slate-700"
                          : "bg-gray-100 dark:bg-slate-800"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                    disabled={page === totalPages}
                    className="px-3 py-2 rounded-lg border text-sm disabled:opacity-50"
                  >
                    Next ▶
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Restaurant Detail Modal */}
        <AnimatePresence>
          {selectedRestaurant && (
            <RestaurantModal
              restaurant={selectedRestaurant}
              onClose={() => setSelectedRestaurant(null)}
              onApprove={() => {
                updateStatus(selectedRestaurant._id, "approved");
                setSelectedRestaurant(null);
              }}
              onReject={() => {
                updateStatus(selectedRestaurant._id, "rejected");
                setSelectedRestaurant(null);
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

/* Hero Header */
const HeroHeader = ({ pendingCount, totalCount, onExport }) => (
  <motion.div
    className="relative overflow-hidden rounded-3xl shadow-2xl mb-8 border border-white/10 dark:border-white/10"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
  >
    {/* Gradient Background */}
    <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-zinc-950"></div>
    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent"></div>

    {/* Background Image */}
    <div
      className="absolute inset-0 opacity-15"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    ></div>

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
              <FaUtensils className="text-white" />
            </div>
            <span className="text-white/90 font-semibold">
              Restaurant Management
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-black text-white drop-shadow-lg mb-2">
            Manage Restaurants 🍽️
          </h1>
          <p className="text-white/80 text-lg">
            Review, approve, and manage restaurant partners
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
                {pendingCount}
              </p>
            </div>
          )}

          <motion.button
            onClick={onExport}
            className="flex items-center gap-2 px-5 py-4 bg-white/95 backdrop-blur-xl text-slate-700 dark:text-slate-900 font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaDownload /> Export CSV
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
    <div className="absolute inset-0 bg-gradient-to-br from-slate-500/20 to-zinc-700/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

    <div className="relative p-5 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/10 shadow-lg hover:shadow-xl transition-all">
      <div className="flex items-center gap-4">
        <div
          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-xl shadow-lg`}
        >
          {icon}
        </div>
        <div>
          <p className="text-2xl font-black text-gray-900 dark:text-white">
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
  totalResults,
}) => (
  <motion.div
    className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-lg border border-gray-200 dark:border-white/10 mb-6"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3 }}
  >
    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
      {/* Search */}
      <div className="relative flex-1 w-full lg:max-w-md">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by restaurant or owner name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-slate-500
 focus:border-slate-500"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2">
          <FaFilter className="text-gray-400" />
          <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:inline">
            Filter:
          </span>
        </div>

        {/* Status Pills */}
        <div className="flex gap-2">
          <StatusPill
            active={statusFilter === ""}
            onClick={() => setStatusFilter("")}
            label="All"
            count={totalResults}
          />
          <StatusPill
            active={statusFilter === "pending"}
            onClick={() => setStatusFilter("pending")}
            label="Pending"
            color="amber"
            icon={<FaHourglassHalf />}
          />
          <StatusPill
            active={statusFilter === "approved"}
            onClick={() => setStatusFilter("approved")}
            label="Approved"
            color="emerald"
            icon={<FaCheckCircle />}
          />
          <StatusPill
            active={statusFilter === "rejected"}
            onClick={() => setStatusFilter("rejected")}
            label="Rejected"
            color="red"
            icon={<FaTimesCircle />}
          />
        </div>
      </div>
    </div>
  </motion.div>
);

const StatusPill = ({ active, onClick, label, color, icon, count }) => {
  const colors = {
    amber:
      "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/30",
    emerald:
      "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30",
    red: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/30",
  };

  return (
    <motion.button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm border transition-all ${
        active
          ? color
            ? colors[color]
            : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-500/30"
          : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-slate-700"
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {icon}
      {label}
      {count !== undefined && (
        <span className="ml-1 px-2 py-0.5 rounded-full bg-white/50 dark:bg-black/20 text-xs">
          {count}
        </span>
      )}
    </motion.button>
  );
};

/* Loading State */
const LoadingState = () => (
  <motion.div
    className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-200 dark:border-white/10 p-12"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    <div className="flex flex-col items-center justify-center">
      <div className="w-16 h-16 border-4 border-slate-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-gray-600 dark:text-gray-400 font-medium">
        Loading restaurants...
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
    <div className="w-24 h-24 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mx-auto mb-6">
      <FaStore className="text-5xl text-slate-500" />
    </div>
    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
      No Restaurants Found
    </h3>
    <p className="text-gray-500 dark:text-gray-400">
      Try adjusting your search or filter criteria
    </p>
  </motion.div>
);

/* Restaurants Grid */
const RestaurantsGrid = ({
  restaurants,
  onView,
  onApprove,
  onReject,
  actionLoading,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
    <AnimatePresence>
      {restaurants.map((restaurant, index) => (
        <RestaurantCard
          key={restaurant._id}
          restaurant={restaurant}
          onView={() => onView(restaurant)}
          onApprove={() => onApprove(restaurant._id)}
          onReject={() => onReject(restaurant._id)}
          isLoading={actionLoading === restaurant._id}
          delay={index * 0.05}
        />
      ))}
    </AnimatePresence>
  </div>
);

/* Restaurant Card */
const RestaurantCard = ({
  restaurant,
  onView,
  onApprove,
  onReject,
  isLoading,
  delay,
}) => {
  const [openActions, setOpenActions] = useState(false);
  const getStatusConfig = (status) => {
    switch (status) {
      case "approved":
        return {
          icon: <FaCheckCircle />,
          bg: "bg-emerald-100 dark:bg-emerald-900/30",
          text: "text-emerald-700 dark:text-emerald-400",
          border: "border-emerald-200 dark:border-emerald-500/30",
          label: "Approved",
        };
      case "rejected":
        return {
          icon: <FaTimesCircle />,
          bg: "bg-red-100 dark:bg-red-900/30",
          text: "text-red-700 dark:text-red-400",
          border: "border-red-200 dark:border-red-500/30",
          label: "Rejected",
        };
      default:
        return {
          icon: <FaHourglassHalf />,
          bg: "bg-amber-100 dark:bg-amber-900/30",
          text: "text-amber-700 dark:text-amber-400",
          border: "border-amber-200 dark:border-amber-500/30",
          label: "Pending",
        };
    }
  };

  const statusConfig = getStatusConfig(restaurant.status);

  return (
    <motion.div
      className="group bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-200 dark:border-white/10 hover:shadow-xl transition-all"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay }}
      whileHover={{ y: -5 }}
    >
      {/* Header with Logo */}
      <div
        className="relative h-32 p-4"
        style={{
          backgroundImage: restaurant.coverImage
            ? `url(${restaurant.coverImage})`
            : "linear-gradient(135deg, #334155, #1e293b, #09090b)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "saturate(1.1) contrast(1.05)"  
        }}
      >
      <div className="absolute inset-0 bg-black/30"></div>

        {/* Pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>

        {/* Logo */}
        <div className="absolute -bottom-8 left-4">
          <div className="w-20 h-20 rounded-2xl bg-white dark:bg-slate-800 shadow-xl border-4 border-white dark:border-slate-900 flex items-center justify-center overflow-hidden">
            {restaurant.logo ? (
              <img
                src={restaurant.logo}
                alt={restaurant.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <FaUtensils
                className="text-3xl text-slate-500
"
              />
            )}
          </div>
        </div>

        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border} font-bold text-xs shadow-md`}
          >
            {statusConfig.icon}
            {statusConfig.label}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pt-12">
        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1 truncate">
          {restaurant.name}
        </h3>
        {restaurant.address && (
          <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            <FaMapMarkerAlt className="text-rose-500 text-sm" />
            <span className="truncate">{restaurant.address}</span>
          </div>
        )}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <FaUserTie className="text-slate-500" />
            <span className="truncate">{restaurant.owner?.name || "—"}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <FaEnvelope className="text-blue-500" />
            <span className="truncate">{restaurant.owner?.email || "—"}</span>
          </div>
          {restaurant.phoneNumber && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <FaPhone className="text-emerald-500" />
              <span>{restaurant.phoneNumber}</span>
            </div>
          )}
        </div>

        {/* Rating & Info */}
        <div className="flex items-center gap-3 mb-4">
          {restaurant.averageRating && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-500/30">
              <FaStar className="text-amber-500 text-sm" />
              <span className="text-sm font-bold text-amber-700 dark:text-amber-400">
                {restaurant.averageRating.toFixed(1)}
              </span>
            </div>
          )}
          <div
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-100 dark:bg-slate-800 cursor-help"
            title="Restaurant joining date"
          >
            <FaCalendarAlt className="text-gray-400 text-sm" />
            <span className="text-xs text-gray-600 dark:text-gray-400">
              Joined on{" "}
              {new Date(restaurant.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 relative">
          {/* View Button */}
          <motion.button
            onClick={onView}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-semibold text-sm hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaEye /> View
          </motion.button>

          {/* Actions Button */}
          <motion.button
            onClick={() => setOpenActions((prev) => !prev)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 font-semibold text-sm hover:bg-gray-200 dark:hover:bg-slate-700 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Actions{" "}
            <FaChevronDown
              className={`text-xs transition-transform ${
                openActions ? "rotate-180" : ""
              }`}
            />
          </motion.button>

          {/* Dropdown */}
          {openActions && (
            <>
              {/* Backdrop (click outside) */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setOpenActions(false)}
              />

              <div className="absolute right-0 bottom-12 w-44 bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
                <button
                  onClick={() => {
                    onView();
                    setOpenActions(false);
                  }}
                  className="w-full px-4 py-3 text-left text-sm hover:bg-gray-100 dark:hover:bg-slate-800 flex items-center gap-2"
                >
                  <FaEye /> View Details
                </button>

                {restaurant.status === "pending" && (
                  <>
                    <button
                      onClick={() => {
                        onApprove();
                        setOpenActions(false);
                      }}
                      disabled={isLoading}
                      className="w-full px-4 py-3 text-left text-sm flex items-center gap-2
                         hover:bg-emerald-50 dark:hover:bg-emerald-900/20
                         text-emerald-600
                         disabled:opacity-50"
                    >
                      <FaCheck /> Approve
                    </button>

                    <button
                      onClick={() => {
                        onReject();
                        setOpenActions(false);
                      }}
                      disabled={isLoading}
                      className="w-full px-4 py-3 text-left text-sm flex items-center gap-2
                         hover:bg-red-50 dark:hover:bg-red-900/20
                         text-red-600
                         disabled:opacity-50"
                    >
                      <FaTimes /> Reject
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

/* Restaurant Modal */
const RestaurantModal = ({ restaurant, onClose, onApprove, onReject }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case "approved":
        return {
          icon: <FaCheckCircle />,
          bg: "bg-emerald-100 dark:bg-emerald-900/30",
          text: "text-emerald-700 dark:text-emerald-400",
          border: "border-emerald-200 dark:border-emerald-500/30",
          label: "Approved",
        };
      case "rejected":
        return {
          icon: <FaTimesCircle />,
          bg: "bg-red-100 dark:bg-red-900/30",
          text: "text-red-700 dark:text-red-400",
          border: "border-red-200 dark:border-red-500/30",
          label: "Rejected",
        };
      default:
        return {
          icon: <FaHourglassHalf />,
          bg: "bg-amber-100 dark:bg-amber-900/30",
          text: "text-amber-700 dark:text-amber-400",
          border: "border-amber-200 dark:border-amber-500/30",
          label: "Pending Review",
        };
    }
  };

  const statusConfig = getStatusConfig(restaurant.status);

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-white/10"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative h-40 bg-gradient-to-br from-gray-800 via-gray-900 to-zinc-950">
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

          {/* Logo */}
          <div className="absolute -bottom-10 left-6">
            <div className="w-24 h-24 rounded-2xl bg-white dark:bg-slate-800 shadow-xl border-4 border-white dark:border-slate-900 flex items-center justify-center overflow-hidden">
              {restaurant.logo ? (
                <img
                  src={restaurant.logo}
                  alt={restaurant.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <FaUtensils className="text-4xl text-slate-500" />
              )}
            </div>
          </div>

          {/* Status */}
          <div className="absolute bottom-4 right-6">
            <span
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border} font-bold text-sm shadow-lg`}
            >
              {statusConfig.icon}
              {statusConfig.label}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 pt-14">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-1">
            {restaurant.name}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Restaurant Partner Application
          </p>

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <InfoItem
              icon={<FaUserTie />}
              label="Owner Name"
              value={restaurant.owner?.name || "—"}
              color="orange"
            />
            <InfoItem
              icon={<FaEnvelope />}
              label="Email Address"
              value={restaurant.owner?.email || "—"}
              color="blue"
            />
            {restaurant.phone && (
              <InfoItem
                icon={<FaPhone />}
                label="Phone Number"
                value={restaurant.owner?.phoneNumber || "—"}
                color="emerald"
              />
            )}
            {restaurant.address && (
              <InfoItem
                icon={<FaMapMarkerAlt />}
                label="Address"
                value={restaurant.address}
                color="purple"
              />
            )}
            <InfoItem
              icon={<FaCalendarAlt />}
              label="Applied On"
              value={new Date(restaurant.createdAt).toLocaleDateString(
                "en-IN",
                {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }
              )}
              color="rose"
            />
            {restaurant.averageRating && (
              <InfoItem
                icon={<FaStar />}
                label="Rating"
                value={`${restaurant.averageRating.toFixed(1)} / 5`}
                color="amber"
              />
            )}
          </div>

          {/* Description */}
          {restaurant.description && (
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-white/10 mb-6">
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                Description
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {restaurant.description}
              </p>
            </div>
          )}

          {/* Actions */}
          {restaurant.status === "pending" && (
            <div className="flex gap-3">
              <motion.button
                onClick={onApprove}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold shadow-lg hover:shadow-xl transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaCheckCircle /> Approve Restaurant
              </motion.button>
              <motion.button
                onClick={onReject}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold shadow-lg hover:shadow-xl transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaTimesCircle /> Reject Application
              </motion.button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const InfoItem = ({ icon, label, value, color }) => {
  const colors = {
    orange: "text-slate-500",
    blue: "text-blue-500",
    emerald: "text-emerald-500",
    purple: "text-purple-500",
    rose: "text-rose-500",
    amber: "text-amber-500",
  };

  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-white/10">
      <div className={`${colors[color]} text-lg mt-0.5`}>{icon}</div>
      <div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
          {label}
        </p>
        <p className="font-semibold text-gray-900 dark:text-white text-sm">
          {value}
        </p>
      </div>
    </div>
  );
};

export default AdminRestaurants;

// old
// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import {
//   FaUtensils,
//   FaCheck,
//   FaTimes,
//   FaInfoCircle,
//   FaFileExport,
// } from "react-icons/fa";
// import API from "../../api/axios";

// const PAGE_SIZE = 9;

// const AdminRestaurants = () => {
//   const [restaurants, setRestaurants] = useState([]);
//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");
//   const [selectedRestaurant, setSelectedRestaurant] = useState(null);
//   const [page, setPage] = useState(1);
//   const [loading, setLoading] = useState(false);

//   // Fetch all restaurants
//   useEffect(() => {
//     const fetchRestaurants = async () => {
//       setLoading(true);
//       try {
//         const res = await API.get("/admin/restaurants"); // Admin API endpoint
//         setRestaurants(res.data.data); // Adjust based on API response
//       } catch (err) {
//         console.error("❌ Error fetching restaurants:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchRestaurants();
//   }, []);

//   // Approve/Reject
//   const updateStatus = async (id, status) => {
//     try {
//       await API.put(`/admin/restaurants/${id}/status`, { status });
//       setRestaurants((prev) =>
//         prev.map((r) => (r._id === id ? { ...r, status } : r))
//       );
//     } catch (err) {
//       console.error("❌ Error updating status:", err);
//     }
//   };

//   // Filters
//   let filtered = restaurants.filter((r) => {
//     const matchesSearch = `${r.name} ${r.ownerName}`
//       .toLowerCase()
//       .includes(search.toLowerCase());
//     const matchesStatus = statusFilter ? r.status === statusFilter : true;
//     return matchesSearch && matchesStatus;
//   });

//   const paginated = filtered.slice(0, PAGE_SIZE * page);
//   const hasMore = paginated.length < filtered.length;

//   const statusColors = {
//     approved:
//       "text-green-600 bg-green-100 dark:bg-green-800 dark:text-green-300",
//     rejected: "text-red-600 bg-red-100 dark:bg-red-800 dark:text-red-300",
//     pending:
//       "text-yellow-600 bg-yellow-100 dark:bg-yellow-800 dark:text-yellow-300",
//   };

//   return (
//     <motion.div
//       className="px-4 sm:px-8 md:px-10 lg:px-12 py-8 text-gray-800 dark:text-white min-h-screen"
//       initial={{ opacity: 0, y: 30 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.4 }}
//     >
//       <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
//         <FaUtensils /> Manage Restaurants
//       </h1>

//       {/* Search & Filters */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
//         <input
//           type="text"
//           placeholder="Search by name or owner..."
//           className="px-4 py-2 rounded-xl bg-white dark:bg-secondary text-sm shadow w-full sm:w-80 outline-none"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />
//         <select
//           value={statusFilter}
//           onChange={(e) => setStatusFilter(e.target.value)}
//           className="px-4 py-2 rounded-xl bg-white dark:bg-secondary text-sm shadow outline-none"
//         >
//           <option value="">All Statuses</option>
//           <option value="pending">Pending</option>
//           <option value="approved">Approved</option>
//           <option value="rejected">Rejected</option>
//         </select>
//         <button className="px-4 py-2 bg-primary text-white rounded-xl flex items-center gap-2 hover:bg-orange-600 text-sm">
//           <FaFileExport /> Export CSV
//         </button>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto bg-white dark:bg-secondary rounded-xl shadow">
//         <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
//           <thead>
//             <tr className="bg-gray-100 dark:bg-gray-800 text-sm">
//               <th className="px-4 py-3">Name</th>
//               <th className="px-4 py-3">Owner</th>
//               <th className="px-4 py-3">Email</th>
//               <th className="px-4 py-3">Status</th>
//               <th className="px-4 py-3 text-right">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {paginated.length > 0 ? (
//               paginated.map((r) => (
//                 <tr
//                   key={r._id}
//                   className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
//                 >
//                   <td className="px-4 py-3 font-medium">{r.name}</td>
//                   <td className="px-4 py-3">{r.ownerName}</td>
//                   <td className="px-4 py-3">{r.email}</td>
//                   <td className="px-4 py-3">
//                     <span
//                       className={`px-2 py-1 rounded-full text-xs font-medium ${
//                         statusColors[r.status]
//                       }`}
//                     >
//                       {r.status}
//                     </span>
//                   </td>
//                   <td className="px-4 py-3 text-right flex gap-2 justify-end flex-wrap">
//                     <button
//                       onClick={() => setSelectedRestaurant(r)}
//                       className="px-3 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 flex items-center gap-1"
//                     >
//                       <FaInfoCircle /> View
//                     </button>
//                     {r.status === "pending" && (
//                       <>
//                         <button
//                           onClick={() => updateStatus(r._id, "approved")}
//                           className="px-3 py-1 text-xs font-semibold rounded bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800 flex items-center gap-1"
//                         >
//                           <FaCheck /> Approve
//                         </button>
//                         <button
//                           onClick={() => updateStatus(r._id, "rejected")}
//                           className="px-3 py-1 text-xs font-semibold rounded bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800 flex items-center gap-1"
//                         >
//                           <FaTimes /> Reject
//                         </button>
//                       </>
//                     )}
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td
//                   colSpan="5"
//                   className="px-4 py-6 text-center text-gray-500 dark:text-gray-400"
//                 >
//                   No restaurants found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Load More */}
//       {hasMore && !loading && (
//         <div className="flex justify-center mt-6">
//           <button
//             onClick={() => setPage((prev) => prev + 1)}
//             className="px-6 py-2 bg-primary text-white rounded-xl shadow hover:bg-primary-dark transition"
//           >
//             Load More
//           </button>
//         </div>
//       )}

//       {/* Restaurant Modal */}
//       {selectedRestaurant && (
//         <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
//           <div className="bg-white dark:bg-secondary w-full max-w-lg rounded-xl shadow-lg p-6 relative animate-fade-in">
//             <button
//               onClick={() => setSelectedRestaurant(null)}
//               className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
//               aria-label="Close"
//             >
//               ✕
//             </button>
//             <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
//               <FaUtensils /> {selectedRestaurant.name}
//             </h3>
//             <p className="text-sm text-gray-500 dark:text-gray-300 mb-4">
//               Owner: {selectedRestaurant.ownerName} ({selectedRestaurant.email})
//             </p>
//             <p className="text-sm text-gray-500 dark:text-gray-300">
//               Status: {selectedRestaurant.status}
//             </p>
//             <p className="text-sm text-gray-500 dark:text-gray-300 mt-2">
//               Created At:{" "}
//               {new Date(selectedRestaurant.createdAt).toLocaleString()}
//             </p>
//           </div>
//         </div>
//       )}
//     </motion.div>
//   );
// };

// export default AdminRestaurants;
