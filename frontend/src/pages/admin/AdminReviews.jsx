import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaStar,
  FaTrash,
  FaCheck,
  FaExclamationCircle,
  FaUserCircle,
  FaSearch,
  FaFilter,
  FaStore,
  FaCheckCircle,
  FaFlag,
  FaHourglassHalf,
  FaTimesCircle,
  FaCalendarAlt,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaEye,
  FaQuoteLeft,
  FaThumbsUp,
  FaThumbsDown,
  FaSortAmountDown,
  FaSortAmountUp,
  FaFileExport,
  FaComment,
  FaStarHalfAlt,
  FaRegStar,
  FaSpinner,
  FaChartBar,
  FaAward,
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
/* STAR RATING COMPONENT                                           */
/* -------------------------------------------------------------- */

const StarRating = ({ rating, size = "sm", showNumber = true }) => {
  const sizes = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-1">
      <div className={`flex items-center text-amber-400 ${sizes[size]}`}>
        {[...Array(fullStars)].map((_, i) => (
          <FaStar key={`full-${i}`} />
        ))}
        {hasHalfStar && <FaStarHalfAlt />}
        {[...Array(emptyStars)].map((_, i) => (
          <FaRegStar
            key={`empty-${i}`}
            className="text-gray-300 dark:text-gray-600"
          />
        ))}
      </div>
      {showNumber && (
        <span className="ml-1 text-sm font-bold text-gray-700 dark:text-gray-300">
          ({rating})
        </span>
      )}
    </div>
  );
};

/* -------------------------------------------------------------- */
/* MAIN COMPONENT                                                  */
/* -------------------------------------------------------------- */

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  const ITEMS_PER_PAGE = 10;

  const statusConfig = {
    approved: {
      icon: <FaCheckCircle />,
      bg: "bg-emerald-100 dark:bg-emerald-900/30",
      text: "text-emerald-700 dark:text-emerald-400",
      border: "border-emerald-200 dark:border-emerald-500/30",
      gradient: "from-emerald-500 to-teal-600",
      label: "Approved",
    },
    flagged: {
      icon: <FaFlag />,
      bg: "bg-amber-100 dark:bg-amber-900/30",
      text: "text-amber-700 dark:text-amber-400",
      border: "border-amber-200 dark:border-amber-500/30",
      gradient: "from-amber-500 to-orange-600",
      label: "Flagged",
    },
    pending: {
      icon: <FaHourglassHalf />,
      bg: "bg-red-100 dark:bg-red-900/30",
      text: "text-red-700 dark:text-red-400",
      border: "border-red-200 dark:border-red-500/30",
      gradient: "from-red-500 to-rose-600",
      label: "Pending",
    },
  };

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await API.get("/admin/reviews");
        setReviews(data.data || []);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  // Update status
  const handleStatusChange = async (id, status) => {
    setActionLoading(id);
    try {
      await API.put(`/admin/reviews/${id}/status`, { status });
      setReviews((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status } : r))
      );
      setConfirmAction(null);
    } catch (err) {
      alert("Failed to update status");
    } finally {
      setActionLoading(null);
    }
  };

  // Delete review
  const handleDelete = async (id) => {
    setActionLoading(id);
    try {
      await API.delete(`/admin/reviews/${id}`);
      setReviews((prev) => prev.filter((r) => r._id !== id));
      setConfirmAction(null);
    } catch (err) {
      alert("Failed to delete review");
    } finally {
      setActionLoading(null);
    }
  };

  // Stats
  const stats = useMemo(() => {
    const total = reviews.length;
    const approved = reviews.filter((r) => r.status === "approved").length;
    const flagged = reviews.filter((r) => r.status === "flagged").length;
    const pending = reviews.filter((r) => r.status === "pending").length;

    const avgRating = total
      ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / total).toFixed(
          1
        )
      : "0.0";

    const fiveStars = reviews.filter((r) => r.rating === 5).length;
    const lowRatings = reviews.filter((r) => r.rating <= 2).length;

    return {
      total,
      approved,
      flagged,
      pending,
      avgRating,
      fiveStars,
      lowRatings,
    };
  }, [reviews]);

  // Animated counts
  const totalCount = useCountUp(stats.total, 0.8);
  const approvedCount = useCountUp(stats.approved, 0.9);
  const flaggedCount = useCountUp(stats.flagged, 1);
  const pendingCount = useCountUp(stats.pending, 1.1);

  // Filter & Sort
  const filteredReviews = useMemo(() => {
    let result = reviews.filter((r) => {
      const matchSearch =
        r.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
        r.restaurantId?.name?.toLowerCase().includes(search.toLowerCase()) ||
        r.comment?.toLowerCase().includes(search.toLowerCase());

      const matchRating = ratingFilter
        ? r.rating === parseInt(ratingFilter)
        : true;
      const matchStatus = statusFilter ? r.status === statusFilter : true;

      return matchSearch && matchRating && matchStatus;
    });

    // Sort
    result.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      if (sortBy === "rating") {
        aVal = Number(aVal) || 0;
        bVal = Number(bVal) || 0;
      } else if (sortBy === "createdAt") {
        aVal = new Date(aVal || 0).getTime();
        bVal = new Date(bVal || 0).getTime();
      }

      if (sortOrder === "asc") return aVal > bVal ? 1 : -1;
      return aVal < bVal ? 1 : -1;
    });

    return result;
  }, [reviews, search, ratingFilter, statusFilter, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredReviews.length / ITEMS_PER_PAGE);
  const paginatedReviews = filteredReviews.slice(
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
    window.open("/api/admin/export/reviews-csv", "_blank");
  };

  if (loading) return <LoadingState />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/30 to-orange-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <motion.div
        className="px-4 sm:px-8 md:px-10 lg:px-12 py-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Hero Header */}
        <HeroHeader
          avgRating={stats.avgRating}
          pendingCount={stats.pending}
          flaggedCount={stats.flagged}
          onExport={handleExport}
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <StatsCard
            icon={<FaComment />}
            value={totalCount}
            label="Total Reviews"
            gradient="from-blue-500 to-cyan-600"
            delay={0.1}
          />
          <StatsCard
            icon={<FaStar />}
            value={stats.avgRating}
            label="Avg Rating"
            gradient="from-amber-500 to-orange-600"
            delay={0.15}
          />
          <StatsCard
            icon={<FaCheckCircle />}
            value={approvedCount}
            label="Approved"
            gradient="from-emerald-500 to-teal-600"
            delay={0.2}
          />
          <StatsCard
            icon={<FaFlag />}
            value={flaggedCount}
            label="Flagged"
            gradient="from-amber-500 to-yellow-600"
            delay={0.25}
            pulse={stats.flagged > 0}
          />
          <StatsCard
            icon={<FaHourglassHalf />}
            value={pendingCount}
            label="Pending"
            gradient="from-red-500 to-rose-600"
            delay={0.3}
            pulse={stats.pending > 0}
          />
          <StatsCard
            icon={<FaAward />}
            value={stats.fiveStars}
            label="5-Star Reviews"
            gradient="from-purple-500 to-indigo-600"
            delay={0.35}
          />
        </div>

        {/* Rating Distribution */}
        <RatingDistribution reviews={reviews} />

        {/* Filters Section */}
        <FiltersSection
          search={search}
          setSearch={setSearch}
          ratingFilter={ratingFilter}
          setRatingFilter={setRatingFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          statusConfig={statusConfig}
          totalResults={filteredReviews.length}
        />

        {/* Reviews Grid */}
        {paginatedReviews.length === 0 ? (
          <EmptyState />
        ) : (
          <ReviewsGrid
            reviews={paginatedReviews}
            statusConfig={statusConfig}
            onView={setSelectedReview}
            onApprove={(r) => setConfirmAction({ type: "approve", review: r })}
            onFlag={(r) => setConfirmAction({ type: "flag", review: r })}
            onDelete={(r) => setConfirmAction({ type: "delete", review: r })}
            actionLoading={actionLoading}
          />
        )}

        {/* Pagination */}
        {paginatedReviews.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredReviews.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
          />
        )}

        {/* Review Detail Modal */}
        <AnimatePresence>
          {selectedReview && (
            <ReviewDetailModal
              review={selectedReview}
              statusConfig={statusConfig}
              onClose={() => setSelectedReview(null)}
              onApprove={() => {
                setSelectedReview(null);
                setConfirmAction({ type: "approve", review: selectedReview });
              }}
              onFlag={() => {
                setSelectedReview(null);
                setConfirmAction({ type: "flag", review: selectedReview });
              }}
              onDelete={() => {
                setSelectedReview(null);
                setConfirmAction({ type: "delete", review: selectedReview });
              }}
            />
          )}
        </AnimatePresence>

        {/* Confirm Action Modal */}
        <AnimatePresence>
          {confirmAction && (
            <ConfirmActionModal
              type={confirmAction.type}
              review={confirmAction.review}
              onConfirm={() => {
                if (confirmAction.type === "approve") {
                  handleStatusChange(confirmAction.review._id, "approved");
                } else if (confirmAction.type === "flag") {
                  handleStatusChange(confirmAction.review._id, "flagged");
                } else {
                  handleDelete(confirmAction.review._id);
                }
              }}
              onClose={() => setConfirmAction(null)}
              isProcessing={actionLoading === confirmAction.review._id}
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
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-amber-50/30 to-orange-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
    <motion.div
      className="text-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="w-20 h-20 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
      <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
        Loading Reviews
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Fetching review data...
      </p>
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
    <div className="w-24 h-24 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-6">
      <FaStar className="text-5xl text-amber-500" />
    </div>
    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
      No Reviews Found
    </h3>
    <p className="text-gray-500 dark:text-gray-400">
      Try adjusting your search or filter criteria
    </p>
  </motion.div>
);

/* Hero Header */
const HeroHeader = ({ avgRating, pendingCount, flaggedCount, onExport }) => (
  <motion.div
    className="relative overflow-hidden rounded-3xl shadow-2xl mb-8 border border-amber-200 dark:border-white/10"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
  >
    {/* Gradient Background */}
    <div className="absolute inset-0 bg-gradient-to-br from-amber-500 via-orange-500 to-rose-600"></div>

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
              <FaStar className="text-white" />
            </div>
            <span className="text-white/90 font-semibold">
              Review Moderation
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-black text-white drop-shadow-lg mb-2">
            Customer Reviews ⭐
          </h1>
          <p className="text-white/80 text-lg">
            Moderate and manage customer feedback
          </p>
        </motion.div>

        {/* Right - Quick Stats & Actions */}
        <motion.div
          className="flex gap-4 flex-wrap"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          {/* Average Rating Card */}
          <div className="px-5 py-4 rounded-2xl bg-white/95 backdrop-blur-xl shadow-xl border border-white/50">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-sm">
                <FaStar />
              </div>
              <span className="text-xs text-gray-600 font-bold uppercase tracking-wide">
                Avg Rating
              </span>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-black text-gray-800">{avgRating}</p>
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`text-xs ${
                      i < Math.floor(avgRating) ? "" : "opacity-30"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {pendingCount > 0 && (
            <div className="px-5 py-4 rounded-2xl bg-white/95 backdrop-blur-xl shadow-xl border border-white/50 animate-pulse">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white text-sm">
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

          {flaggedCount > 0 && (
            <div className="px-5 py-4 rounded-2xl bg-white/95 backdrop-blur-xl shadow-xl border border-white/50">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-sm">
                  <FaFlag />
                </div>
                <span className="text-xs text-gray-600 font-bold uppercase tracking-wide">
                  Flagged
                </span>
              </div>
              <p className="text-2xl font-black text-gray-800">
                {flaggedCount}
              </p>
            </div>
          )}

          <motion.button
            onClick={onExport}
            className="flex items-center gap-2 px-5 py-4 bg-white/95 backdrop-blur-xl text-amber-700 font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all"
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
    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

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

/* Rating Distribution */
const RatingDistribution = ({ reviews }) => {
  const distribution = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      if (r.rating >= 1 && r.rating <= 5) {
        counts[r.rating]++;
      }
    });
    const total = reviews.length || 1;
    return Object.entries(counts)
      .reverse()
      .map(([rating, count]) => ({
        rating: parseInt(rating),
        count,
        percentage: Math.round((count / total) * 100),
      }));
  }, [reviews]);

  return (
    <motion.div
      className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-white/10 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
          <FaChartBar className="text-white" />
        </div>
        <h3 className="text-xl font-black text-gray-900 dark:text-white">
          Rating Distribution
        </h3>
      </div>

      <div className="space-y-3">
        {distribution.map(({ rating, count, percentage }) => (
          <div key={rating} className="flex items-center gap-4">
            <div className="flex items-center gap-1 w-20">
              <span className="font-bold text-gray-700 dark:text-gray-300">
                {rating}
              </span>
              <FaStar className="text-amber-400" />
            </div>
            <div className="flex-1 h-3 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${
                  rating >= 4
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                    : rating === 3
                    ? "bg-gradient-to-r from-amber-500 to-orange-500"
                    : "bg-gradient-to-r from-red-500 to-rose-500"
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ delay: 0.5 + rating * 0.1, duration: 0.5 }}
              />
            </div>
            <span className="w-12 text-right text-sm font-semibold text-gray-600 dark:text-gray-400">
              {count}
            </span>
            <span className="w-12 text-right text-sm text-gray-500">
              {percentage}%
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

/* Filters Section */
const FiltersSection = ({
  search,
  setSearch,
  ratingFilter,
  setRatingFilter,
  statusFilter,
  setStatusFilter,
  statusConfig,
  totalResults,
}) => (
  <motion.div
    className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-lg border border-gray-200 dark:border-white/10 mb-6"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.5 }}
  >
    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
      {/* Search */}
      <div className="relative flex-1 w-full lg:max-w-md">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by user, restaurant, or comment..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
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

        {/* Rating Filter */}
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-2"></div>

        <select
          value={ratingFilter}
          onChange={(e) => setRatingFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-amber-500"
        >
          <option value="">All Ratings</option>
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>
              {"⭐".repeat(r)} {r} Stars
            </option>
          ))}
        </select>

        <div className="px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-500/30">
          <span className="text-sm font-bold text-amber-700 dark:text-amber-400">
            {totalResults} reviews
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
          : "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/30"
        : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-slate-700"
    }`}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    {icon}
    {label}
  </motion.button>
);

/* Reviews Grid */
const ReviewsGrid = ({
  reviews,
  statusConfig,
  onView,
  onApprove,
  onFlag,
  onDelete,
  actionLoading,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
    <AnimatePresence>
      {reviews.map((review, index) => (
        <ReviewCard
          key={review._id}
          review={review}
          statusConfig={statusConfig}
          onView={() => onView(review)}
          onApprove={() => onApprove(review)}
          onFlag={() => onFlag(review)}
          onDelete={() => onDelete(review)}
          isLoading={actionLoading === review._id}
          delay={index * 0.05}
        />
      ))}
    </AnimatePresence>
  </div>
);

/* Review Card */
const ReviewCard = ({
  review,
  statusConfig,
  onView,
  onApprove,
  onFlag,
  onDelete,
  isLoading,
  delay,
}) => {
  const config = statusConfig[review.status] || statusConfig.pending;

  return (
    <motion.div
      className="group bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-200 dark:border-white/10 overflow-hidden hover:shadow-xl transition-all"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay }}
      whileHover={{ y: -5 }}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100 dark:border-white/5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
              {review.userId?.name?.charAt(0)?.toUpperCase() || "?"}
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white">
                {review.userId?.name || "Anonymous"}
              </h4>
              <p className="text-xs text-gray-500">
                {getTimeAgo(review.createdAt)}
              </p>
            </div>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl ${config.bg} ${config.text} border ${config.border} font-bold text-xs`}
          >
            {config.icon}
            {config.label}
          </span>
        </div>
      </div>

      {/* Restaurant Info */}
      <div className="px-4 py-3 bg-gray-50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-white/5">
        <div className="flex items-center gap-2">
          <FaStore className="text-orange-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {review.restaurantId?.name || "Unknown Restaurant"}
          </span>
        </div>
      </div>

      {/* Rating & Comment */}
      <div className="p-4">
        <div className="mb-3">
          <StarRating rating={review.rating} size="md" />
        </div>

        <div className="relative">
          <FaQuoteLeft className="absolute -top-1 -left-1 text-gray-200 dark:text-gray-700 text-lg" />
          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 pl-5">
            {review.comment || "No comment provided"}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 pb-4 flex gap-2">
        <motion.button
          onClick={onView}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-semibold text-xs hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FaEye /> View
        </motion.button>

        {review.status !== "approved" && (
          <motion.button
            onClick={onApprove}
            disabled={isLoading}
            className="flex items-center justify-center gap-1 px-3 py-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-semibold text-xs hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-all disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? <FaSpinner className="animate-spin" /> : <FaCheck />}
          </motion.button>
        )}

        {review.status !== "flagged" && (
          <motion.button
            onClick={onFlag}
            disabled={isLoading}
            className="flex items-center justify-center gap-1 px-3 py-2 rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 font-semibold text-xs hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-all disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaFlag />
          </motion.button>
        )}

        <motion.button
          onClick={onDelete}
          disabled={isLoading}
          className="flex items-center justify-center gap-1 px-3 py-2 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 font-semibold text-xs hover:bg-red-200 dark:hover:bg-red-900/50 transition-all disabled:opacity-50"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FaTrash />
        </motion.button>
      </div>
    </motion.div>
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
      className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-200 dark:border-white/10"
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
        reviews
      </p>

      <div className="flex items-center gap-2">
        <motion.button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
            currentPage === 1
              ? "bg-gray-100 dark:bg-slate-800 text-gray-400 cursor-not-allowed"
              : "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900/50"
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
                    ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg"
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
              : "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900/50"
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

/* Review Detail Modal */
const ReviewDetailModal = ({
  review,
  statusConfig,
  onClose,
  onApprove,
  onFlag,
  onDelete,
}) => {
  const config = statusConfig[review.status] || statusConfig.pending;

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

          {/* Rating Display */}
          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                <span className="text-3xl font-black text-white">
                  {review.rating}
                </span>
              </div>
              <div>
                <div className="flex text-white mb-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={
                        i < review.rating ? "text-white" : "text-white/30"
                      }
                    />
                  ))}
                </div>
                <p className="text-white/80 text-sm">Customer Rating</p>
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
          {/* User & Restaurant Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <InfoCard
              icon={<FaUserCircle />}
              title="Customer"
              value={review.userId?.name || "Anonymous"}
              subtitle={review.userId?.email || "N/A"}
              color="blue"
            />
            <InfoCard
              icon={<FaStore />}
              title="Restaurant"
              value={review.restaurantId?.name || "Unknown"}
              subtitle={review.restaurantId?.cuisine || "N/A"}
              color="orange"
            />
          </div>

          {/* Review Date */}
          <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-white/10 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <FaCalendarAlt />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Review Posted
              </p>
              <p className="font-bold text-gray-900 dark:text-white">
                {formatDateTime(review.createdAt)}
              </p>
            </div>
          </div>

          {/* Comment */}
          <div className="mb-6">
            <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <FaQuoteLeft className="text-amber-500" /> Review Comment
            </h4>
            <div className="p-5 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-500/30">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap italic">
                "{review.comment || "No comment provided"}"
              </p>
            </div>
          </div>

          {/* Sentiment Analysis (Mock) */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-500/30 text-center">
              <FaThumbsUp className="text-3xl text-emerald-500 mx-auto mb-2" />
              <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                Positive Sentiment
              </p>
              <p className="text-xs text-emerald-600 dark:text-emerald-500">
                {review.rating >= 4
                  ? "85%"
                  : review.rating >= 3
                  ? "50%"
                  : "20%"}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 text-center">
              <FaThumbsDown className="text-3xl text-red-500 mx-auto mb-2" />
              <p className="text-sm font-bold text-red-700 dark:text-red-400">
                Negative Sentiment
              </p>
              <p className="text-xs text-red-600 dark:text-red-500">
                {review.rating >= 4
                  ? "15%"
                  : review.rating >= 3
                  ? "50%"
                  : "80%"}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 flex-wrap">
            {review.status !== "approved" && (
              <motion.button
                onClick={onApprove}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold shadow-lg hover:shadow-xl transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaCheckCircle /> Approve
              </motion.button>
            )}
            {review.status !== "flagged" && (
              <motion.button
                onClick={onFlag}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold shadow-lg hover:shadow-xl transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaFlag /> Flag
              </motion.button>
            )}
            <motion.button
              onClick={onDelete}
              className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaTrash /> Delete
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

const InfoCard = ({ icon, title, value, subtitle, color }) => {
  const colors = {
    blue: "from-blue-500 to-cyan-600",
    orange: "from-orange-500 to-rose-600",
  };

  return (
    <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-white/10">
      <div className="flex items-center gap-3">
        <div
          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors[color]} flex items-center justify-center text-white shadow-md`}
        >
          {icon}
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">{title}</p>
          <p className="font-bold text-gray-900 dark:text-white">{value}</p>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
};

/* Confirm Action Modal */
const ConfirmActionModal = ({
  type,
  review,
  onConfirm,
  onClose,
  isProcessing,
}) => {
  const config = {
    approve: {
      title: "Approve Review",
      description: "This review will be visible to all users.",
      icon: <FaCheckCircle />,
      gradient: "from-emerald-500 to-teal-600",
      bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
      textColor: "text-emerald-500",
    },
    flag: {
      title: "Flag Review",
      description: "This review will be marked for further investigation.",
      icon: <FaFlag />,
      gradient: "from-amber-500 to-orange-600",
      bgColor: "bg-amber-100 dark:bg-amber-900/30",
      textColor: "text-amber-500",
    },
    delete: {
      title: "Delete Review",
      description:
        "This action cannot be undone. The review will be permanently removed.",
      icon: <FaTrash />,
      gradient: "from-red-500 to-rose-600",
      bgColor: "bg-red-100 dark:bg-red-900/30",
      textColor: "text-red-500",
    },
  };

  const current = config[type];

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
        <div className={`p-6 bg-gradient-to-r ${current.gradient}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white">
                {current.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  {current.title}
                </h3>
                <p className="text-white/80 text-sm">
                  Review by {review.userId?.name}
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
              className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${current.bgColor}`}
            >
              <span className={`text-4xl ${current.textColor}`}>
                {current.icon}
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {current.description}
            </p>

            {/* Review Preview */}
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-white/10 text-left">
              <div className="flex items-center gap-2 mb-2">
                <StarRating rating={review.rating} size="sm" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                "{review.comment || "No comment"}"
              </p>
            </div>
          </div>

          {type === "delete" && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 mb-6">
              <div className="flex items-start gap-3">
                <FaExclamationCircle className="text-red-500 text-lg mt-0.5" />
                <p className="text-sm text-red-700 dark:text-red-400">
                  Warning: This action is irreversible. The review and all
                  associated data will be permanently deleted.
                </p>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <motion.button
              onClick={onConfirm}
              disabled={isProcessing}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-white font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 bg-gradient-to-r ${current.gradient}`}
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
                  {current.icon}
                  Confirm
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

export default AdminReviews;
