import React, { useEffect, useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaStar,
  FaRegStar,
  FaSortAmountDown,
  FaReply,
  FaUserCircle,
  FaCalendarAlt,
  FaChartBar,
  FaCheckCircle,
  FaTimes,
  FaSpinner,
  FaHeart,
  FaCommentDots,
  FaExclamationTriangle,
} from "react-icons/fa";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";

/* ------------------------------- Stars Component ------------------------------- */
const Stars = ({ rating, size = "sm" }) => {
  const totalStars = 5;
  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-xl",
    xl: "text-3xl",
  };

  return (
    <div className={`flex items-center text-amber-400 ${sizeClasses[size]}`}>
      {Array.from({ length: totalStars }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.05, type: "spring" }}
        >
          {i < rating ? <FaStar /> : <FaRegStar className="text-gray-300" />}
        </motion.div>
      ))}
    </div>
  );
};

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
            t.type === "error"
              ? "bg-red-500/95 border-red-400"
              : "bg-emerald-500/95 border-emerald-400"
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

/* ------------------------------- Review Card ------------------------------- */
const ReviewCard = ({ review, onReply, index }) => {
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleReplySubmit = async () => {
    if (replyText.trim().length < 2) {
      alert("Reply must be at least 2 characters.");
      return;
    }
    setSubmitting(true);
    await onReply(review._id, replyText);
    setReplyText("");
    setReplying(false);
    setSubmitting(false);
  };

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 hover:border-rose-300 hover:shadow-xl overflow-hidden transition-all"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      layout
    >
      {/* Header */}
      <div className="p-5 bg-gradient-to-r from-gray-50 to-slate-50 border-b-2 border-gray-200">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white text-xl shadow-lg">
              {review.user?.name?.[0]?.toUpperCase() || <FaUserCircle />}
            </div>
            <div className="flex-1">
              <h4 className="font-black text-gray-900 text-lg">
                {review.user?.name || "Anonymous"}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <Stars rating={review.rating} size="sm" />
                <span className="text-xs text-gray-500 font-semibold">
                  {review.rating}.0
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500">
            <FaCalendarAlt />
            <span className="font-semibold">
              {new Date(review.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {review.comment ? (
          <div className="mb-4">
            <div className="flex items-start gap-2 mb-2">
              <FaCommentDots className="text-gray-400 mt-1" />
              <p className="text-gray-700 leading-relaxed font-medium">
                "{review.comment}"
              </p>
            </div>
          </div>
        ) : (
          <p className="text-gray-400 italic text-sm mb-4">
            No comment provided.
          </p>
        )}

        {/* Owner Reply Section */}
        <AnimatePresence mode="wait">
          {review.reply?.text ? (
            <motion.div
              className="p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white flex-shrink-0">
                  <FaReply />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-black text-indigo-900 text-sm">
                      Owner's Reply
                    </span>
                    <span className="text-xs text-indigo-600">
                      {new Date(review.reply.repliedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-indigo-800 font-medium leading-relaxed">
                    {review.reply.text}
                  </p>
                </div>
              </div>
            </motion.div>
          ) : replying ? (
            <motion.div
              className="space-y-3"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <textarea
                className="w-full p-4 rounded-xl border-2 border-indigo-200 focus:border-indigo-400 focus:outline-none transition-all font-medium resize-none"
                rows={3}
                placeholder="Write a thoughtful reply to this review..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                autoFocus
              />
              <div className="flex gap-3">
                <motion.button
                  onClick={handleReplySubmit}
                  disabled={submitting}
                  className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  whileHover={{ scale: submitting ? 1 : 1.02 }}
                  whileTap={{ scale: submitting ? 1 : 0.98 }}
                >
                  {submitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <FaSpinner />
                      </motion.div>
                      Posting...
                    </>
                  ) : (
                    <>
                      <FaReply /> Post Reply
                    </>
                  )}
                </motion.button>
                <motion.button
                  onClick={() => setReplying(false)}
                  disabled={submitting}
                  className="px-6 py-3 rounded-xl border-2 border-gray-300 font-bold hover:bg-gray-50 transition-all disabled:opacity-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.button
              onClick={() => setReplying(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-sm transition-all"
              whileHover={{ scale: 1.05, x: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaReply /> Reply to Review
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

/* ------------------------------- Review Summary ------------------------------- */
const ReviewSummary = ({ reviews }) => {
  if (!reviews.length) return null;

  const avgRating =
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="p-6 bg-gradient-to-r from-amber-500 to-orange-600 text-white">
        <h3 className="text-2xl font-black flex items-center gap-2">
          <FaChartBar />
          Overall Rating
        </h3>
        <p className="text-white/80 text-sm mt-1">Customer feedback summary</p>
      </div>

      <div className="p-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left: Big Rating */}
          <div className="flex-shrink-0 text-center md:text-left">
            <motion.div
              className="inline-flex flex-col items-center p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-6xl font-black text-amber-600 mb-2">
                {avgRating.toFixed(1)}
              </div>
              <Stars rating={Math.round(avgRating)} size="lg" />
              <p className="text-sm text-gray-600 font-semibold mt-3">
                Based on {reviews.length} review
                {reviews.length !== 1 ? "s" : ""}
              </p>
            </motion.div>
          </div>

          {/* Right: Distribution */}
          <div className="flex-1 space-y-3">
            {distribution.map((d, index) => (
              <motion.div
                key={d.star}
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <div className="flex items-center gap-1 w-12">
                  <span className="font-bold text-gray-700">{d.star}</span>
                  <FaStar className="text-amber-400 text-sm" />
                </div>
                <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(d.count / reviews.length) * 100 || 0}%`,
                    }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
                  />
                </div>
                <span className="w-12 text-right font-bold text-gray-700">
                  {d.count}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ------------------------------- Main Component ------------------------------- */
const RestaurantReviews = () => {
  const { user } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);
  const [sort, setSort] = useState("newest");

  const restaurantId = user?.restaurantId;

  /* --------------------- Toast System --------------------- */
  const pushToast = (payload) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, ...payload }]);
    setTimeout(() => removeToast(id), 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  /* --------------------- Fetch Reviews --------------------- */
  const fetchReviews = async () => {
    if (!restaurantId) {
      pushToast({
        type: "error",
        title: "Restaurant ID not found",
        icon: <FaExclamationTriangle />,
      });
      return;
    }

    try {
      setLoading(true);
      const res = await API.get(`/reviews/${restaurantId}`);
      setReviews(res.data.reviews || []);
    } catch (err) {
      console.error("Failed to fetch reviews", err);
      pushToast({
        type: "error",
        title: "Failed to load reviews",
        message: "Please try again",
        icon: <FaExclamationTriangle />,
      });
    } finally {
      setLoading(false);
    }
  };

  /* --------------------- Handle Reply --------------------- */
  const handleReply = async (reviewId, replyText) => {
    try {
      await API.post(`/reviews/review/${reviewId}/reply`, { reply: replyText });
      setReviews((prev) =>
        prev.map((r) =>
          r._id === reviewId
            ? { ...r, reply: { text: replyText, repliedAt: new Date() } }
            : r
        )
      );
      pushToast({
        type: "success",
        title: "Reply posted successfully!",
        icon: <FaCheckCircle />,
      });
    } catch (err) {
      console.error("Failed to post reply", err);
      pushToast({
        type: "error",
        title: "Failed to post reply",
        message: "Please try again",
        icon: <FaExclamationTriangle />,
      });
    }
  };

  /* --------------------- Sort Reviews --------------------- */
  const sortedReviews = [...reviews].sort((a, b) => {
    if (sort === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
    if (sort === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
    if (sort === "highest") return b.rating - a.rating;
    if (sort === "lowest") return a.rating - b.rating;
    return 0;
  });

  useEffect(() => {
    if (restaurantId) fetchReviews();
  }, [restaurantId]);

  const repliedCount = reviews.filter((r) => r.reply?.text).length;
  const pendingCount = reviews.length - repliedCount;
  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(
        1
      )
    : 0;

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
          <div className="absolute inset-0 bg-gradient-to-br from-amber-600 via-orange-600 to-rose-600"></div>
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
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  ⭐
                </motion.div>
                <div>
                  <h1 className="text-4xl font-black text-white drop-shadow-lg">
                    Customer Reviews
                  </h1>
                  <p className="text-white/90 text-sm font-medium mt-1">
                    Manage and respond to customer feedback
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <StatCard
                icon={<FaCommentDots />}
                value={reviews.length}
                label="Total Reviews"
                gradient="from-blue-500 to-cyan-600"
              />
              <StatCard
                icon={<FaStar />}
                value={avgRating}
                label="Average Rating"
                gradient="from-amber-500 to-orange-600"
              />
              <StatCard
                icon={<FaCheckCircle />}
                value={repliedCount}
                label="Replied"
                gradient="from-emerald-500 to-teal-600"
              />
              <StatCard
                icon={<FaHeart />}
                value={pendingCount}
                label="Pending Reply"
                gradient="from-rose-500 to-pink-600"
              />
            </motion.div>
          </div>
        </motion.div>

        {loading ? (
          <LoadingState />
        ) : reviews.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Review Summary */}
            <ReviewSummary reviews={reviews} />

            {/* Sort Controls */}
            <motion.div
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="text-xl font-black text-gray-800">
                All Reviews ({sortedReviews.length})
              </h3>

              <div className="flex items-center gap-3">
                <FaSortAmountDown className="text-gray-600" />
                <label className="text-sm font-semibold text-gray-600">
                  Sort by:
                </label>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-rose-400 focus:outline-none transition-all font-medium appearance-none cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="highest">Highest Rated</option>
                  <option value="lowest">Lowest Rated</option>
                </select>
              </div>
            </motion.div>

            {/* Review Cards */}
            <div className="space-y-6">
              <AnimatePresence mode="popLayout">
                {sortedReviews.map((review, index) => (
                  <ReviewCard
                    key={review._id}
                    review={review}
                    index={index}
                    onReply={handleReply}
                  />
                ))}
              </AnimatePresence>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

/* ------------------------------- Sub Components ------------------------------- */

const StatCard = ({ icon, value, label, gradient }) => (
  <motion.div
    className="px-5 py-4 rounded-xl bg-white/90 backdrop-blur-md shadow-lg border border-white/50"
    whileHover={{ scale: 1.05, y: -2 }}
  >
    <div className="flex items-center gap-3">
      <div
        className={`w-10 h-10 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-md`}
      >
        {icon}
      </div>
      <div>
        <p className="text-2xl font-black text-gray-800">{value}</p>
        <p className="text-xs text-gray-600 font-semibold">{label}</p>
      </div>
    </div>
  </motion.div>
);

const LoadingState = () => (
  <div className="flex items-center justify-center py-20">
    <motion.div
      className="text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="relative w-24 h-24 mx-auto mb-6"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute inset-0 border-4 border-amber-200 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-amber-600 border-t-transparent rounded-full"></div>
      </motion.div>
      <motion.p
        className="text-gray-700 text-lg font-bold"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        Loading reviews...
      </motion.p>
    </motion.div>
  </div>
);

const EmptyState = () => (
  <motion.div
    className="text-center py-20 bg-white rounded-3xl shadow-xl border border-gray-200"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
  >
    <motion.div
      className="text-9xl mb-6"
      animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      ⭐
    </motion.div>
    <h3 className="text-3xl font-black text-gray-800 mb-3">No Reviews Yet</h3>
    <p className="text-gray-600 text-lg">
      Your customer reviews will appear here once you start receiving feedback!
    </p>
  </motion.div>
);

export default RestaurantReviews;


// import React, { useEffect, useState, useContext } from "react";
// import { FaStar, FaRegStar, FaSortAmountDown, FaReply } from "react-icons/fa";
// import API from "../../api/axios";
// import { AuthContext } from "../../context/AuthContext";

// // ⭐ Stars Component
// const Stars = ({ rating }) => {
//   const totalStars = 5;
//   return (
//     <div className="flex items-center text-yellow-400">
//       {Array.from({ length: totalStars }).map((_, i) =>
//         i < rating ? (
//           <FaStar key={i} className="text-sm" />
//         ) : (
//           <FaRegStar key={i} className="text-sm" />
//         )
//       )}
//     </div>
//   );
// };

// // 📦 Individual Review Card
// const ReviewCard = ({ review, onReply }) => {
//   const [replying, setReplying] = useState(false);
//   const [replyText, setReplyText] = useState("");

//   const handleReplySubmit = () => {
//     if (replyText.trim().length < 2) {
//       alert("Reply must be at least 2 characters.");
//       return;
//     }
//     onReply(review._id, replyText);
//     setReplyText("");
//     setReplying(false);
//   };

//   return (
//     <div className="bg-white dark:bg-secondary p-4 rounded-lg shadow hover:shadow-md transition">
//       <div className="flex justify-between items-center mb-2">
//         <h4 className="font-semibold text-gray-800 dark:text-white">
//           {review.user?.name || "Anonymous"}
//         </h4>
//         <span className="text-sm text-gray-500 dark:text-gray-400">
//           {new Date(review.createdAt).toLocaleDateString()}
//         </span>
//       </div>

//       <Stars rating={review.rating} />

//       <p className="text-gray-700 dark:text-gray-300 text-sm my-2">
//         {review.comment || "No comment provided."}
//       </p>

//       {review.reply?.text ? (
//         <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded mt-2 text-sm">
//           <strong className="text-gray-800 dark:text-white">
//             Owner Reply:
//           </strong>{" "}
//           <span className="text-gray-600 dark:text-gray-300">
//             {review.reply.text}
//           </span>
//         </div>
//       ) : replying ? (
//         <div className="mt-2">
//           <textarea
//             className="w-full p-2 border rounded-md text-sm dark:bg-gray-800 dark:text-white"
//             rows={2}
//             placeholder="Write your reply..."
//             value={replyText}
//             onChange={(e) => setReplyText(e.target.value)}
//           />
//           <div className="flex gap-2 mt-1">
//             <button
//               onClick={handleReplySubmit}
//               className="px-3 py-1 bg-primary text-white rounded text-sm hover:bg-primary-dark"
//             >
//               Reply
//             </button>
//             <button
//               onClick={() => setReplying(false)}
//               className="px-3 py-1 border rounded text-sm"
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       ) : (
//         <button
//           onClick={() => setReplying(true)}
//           className="flex items-center gap-1 mt-2 text-primary hover:underline text-sm"
//         >
//           <FaReply /> Reply
//         </button>
//       )}
//     </div>
//   );
// };

// // 📊 Review Summary Component
// const ReviewSummary = ({ reviews }) => {
//   if (!reviews.length) return null;

//   const avgRating =
//     reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
//   const distribution = [5, 4, 3, 2, 1].map((star) => ({
//     star,
//     count: reviews.filter((r) => r.rating === star).length,
//   }));

//   return (
//     <div className="mb-6">
//       <h3 className="text-xl font-bold mb-2">Overall Rating</h3>
//       <div className="flex items-center gap-2 mb-3">
//         <Stars rating={Math.round(avgRating)} />
//         <span className="font-semibold">{avgRating.toFixed(1)} / 5</span>
//         <span className="text-gray-500">({reviews.length} reviews)</span>
//       </div>
//       <div className="space-y-1">
//         {distribution.map((d) => (
//           <div key={d.star} className="flex items-center gap-2 text-sm">
//             <span className="w-8">{d.star}★</span>
//             <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded">
//               <div
//                 className="h-2 bg-yellow-400 rounded"
//                 style={{ width: `${(d.count / reviews.length) * 100 || 0}%` }}
//               ></div>
//             </div>
//             <span>{d.count}</span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// // 🚀 Main Component
// const RestaurantReviews = () => {
//   const { user } = useContext(AuthContext);
//   const [reviews, setReviews] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [sort, setSort] = useState("newest");

//   const restaurantId = user?.restaurantId;

//   // Fetch reviews
//   const fetchReviews = async () => {
//     if (!restaurantId) return setError("Restaurant ID not found.");
//     try {
//       setLoading(true);
//       setError("");
//       const res = await API.get(`/reviews/${restaurantId}`);
//       setReviews(res.data.reviews || []);
//     } catch (err) {
//       console.error("Failed to fetch reviews", err);
//       setError("Unable to load reviews. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle owner reply
//   const handleReply = async (reviewId, replyText) => {
//     try {
//       await API.post(`/reviews/review/${reviewId}/reply`, { reply: replyText });
//       setReviews((prev) =>
//         prev.map((r) =>
//           r._id === reviewId
//             ? { ...r, reply: { text: replyText, repliedAt: new Date() } }
//             : r
//         )
//       );
//     } catch (err) {
//       console.error("Failed to post reply", err);
//       alert("Failed to post reply. Please try again.");
//     }
//   };

//   // Sort reviews
//   const sortedReviews = [...reviews].sort((a, b) => {
//     if (sort === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
//     if (sort === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
//     if (sort === "highest") return b.rating - a.rating;
//     if (sort === "lowest") return a.rating - b.rating;
//     return 0;
//   });

//   useEffect(() => {
//     if (restaurantId) fetchReviews();
//   }, [restaurantId]);

//   return (
//     <div className="p-6 text-gray-800 dark:text-white">
//       <h2 className="text-2xl font-bold mb-5 flex items-center gap-2">
//         <FaStar className="text-yellow-500" /> Customer Reviews
//       </h2>

//       {loading ? (
//         <p>Loading reviews...</p>
//       ) : error ? (
//         <p className="text-red-500">{error}</p>
//       ) : reviews.length === 0 ? (
//         <p className="text-gray-500">No reviews yet.</p>
//       ) : (
//         <>
//           <ReviewSummary reviews={reviews} />

//           {/* Sort/Filter */}
//           <div className="flex justify-end mb-4">
//             <label className="flex items-center gap-2 text-sm">
//               <FaSortAmountDown /> Sort by:
//               <select
//                 value={sort}
//                 onChange={(e) => setSort(e.target.value)}
//                 className="p-1 border rounded text-sm dark:bg-gray-800"
//               >
//                 <option value="newest">Newest</option>
//                 <option value="oldest">Oldest</option>
//                 <option value="highest">Highest Rated</option>
//                 <option value="lowest">Lowest Rated</option>
//               </select>
//             </label>
//           </div>

//           {/* Review Cards */}
//           <div className="grid gap-5">
//             {sortedReviews.map((review) => (
//               <ReviewCard
//                 key={review._id}
//                 review={review}
//                 onReply={handleReply}
//               />
//             ))}
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default RestaurantReviews;
