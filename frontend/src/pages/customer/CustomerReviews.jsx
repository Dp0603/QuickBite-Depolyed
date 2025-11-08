import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaStar,
  FaRegStar,
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaReply,
  FaCalendarAlt,
  FaStore,
  FaTimes,
  FaSave,
  FaQuoteLeft,
  FaShieldAlt,
} from "react-icons/fa";
import API from "../../api/axios";

// Star Rating Component
const StarRating = ({ rating, size = "md", interactive = false, onChange }) => {
  const sizes = {
    sm: "text-sm",
    md: "text-xl",
    lg: "text-2xl",
  };

  return (
    <div className="flex gap-1" aria-label={`Rating: ${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= rating;
        return (
          <motion.button
            key={star}
            type="button"
            onClick={() => interactive && onChange?.(star)}
            disabled={!interactive}
            className={`${sizes[size]} ${
              interactive ? "cursor-pointer hover:scale-125" : "cursor-default"
            } transition-transform`}
            whileHover={interactive ? { scale: 1.2 } : {}}
            whileTap={interactive ? { scale: 0.9 } : {}}
          >
            {isFilled ? (
              <FaStar className="text-yellow-500" />
            ) : (
              <FaRegStar className="text-gray-300 dark:text-gray-600" />
            )}
          </motion.button>
        );
      })}
    </div>
  );
};

const CustomerReviews = () => {
  const [reviews, setReviews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editComment, setEditComment] = useState("");
  const [editRating, setEditRating] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchMyReviews();
  }, []);

  const fetchMyReviews = async () => {
    setLoading(true);
    try {
      const res = await API.get("/reviews/me");
      setReviews(res.data || []);
    } catch (err) {
      console.error("Error fetching user reviews:", err);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async () => {
    if (!deleteId) return;

    try {
      await API.delete(`/reviews/review/delete/${deleteId}`);
      setReviews(reviews.filter((r) => r._id !== deleteId));
      setShowDeleteModal(false);
      setDeleteId(null);
    } catch (err) {
      console.error("Failed to delete review:", err);
      alert("Failed to delete review.");
    }
  };

  const startEditing = (review) => {
    setEditingReviewId(review._id);
    setEditComment(review.comment);
    setEditRating(review.rating);
  };

  const cancelEditing = () => {
    setEditingReviewId(null);
    setEditComment("");
    setEditRating(0);
  };

  const saveEdit = async (id) => {
    if (editRating < 1 || editRating > 5) {
      alert("Rating must be between 1 and 5");
      return;
    }
    if (editComment.trim().length < 5) {
      alert("Comment must be at least 5 characters");
      return;
    }

    try {
      await API.put(`/reviews/review/edit/${id}`, {
        rating: editRating,
        comment: editComment.trim(),
      });
      setReviews(
        reviews.map((r) =>
          r._id === id
            ? { ...r, rating: editRating, comment: editComment.trim() }
            : r
        )
      );
      cancelEditing();
    } catch (err) {
      console.error("Failed to update review:", err);
      alert("Failed to update review.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading reviews...</p>
        </motion.div>
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center p-12 rounded-3xl bg-white dark:bg-slate-900 border border-orange-200 dark:border-white/10 shadow-xl max-w-md"
        >
          <div className="text-8xl mb-6">📝</div>
          <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
            No Reviews Yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You haven't left any reviews yet. Order food and share your
            experience!
          </p>
          <motion.button
            onClick={() => (window.location.href = "/customer/browse")}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-bold shadow-lg hover:shadow-xl transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Browse Restaurants
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <motion.div
        className="px-4 sm:px-8 md:px-10 lg:px-12 py-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-orange-600 to-pink-600 dark:from-orange-400 dark:to-pink-500 bg-clip-text text-transparent mb-3 flex items-center gap-3">
            <FaStar className="text-yellow-500" />
            My Reviews
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Manage your restaurant reviews and ratings
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative p-6 rounded-3xl bg-white dark:bg-slate-900 border border-orange-200 dark:border-white/10 shadow-md hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white text-xl shadow-md">
                  <FaStar />
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Total Reviews
                  </div>
                  <div className="text-3xl font-black text-gray-900 dark:text-white">
                    {reviews.length}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative p-6 rounded-3xl bg-white dark:bg-slate-900 border border-orange-200 dark:border-white/10 shadow-md hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white text-xl shadow-md">
                  <FaStar />
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Average Rating
                  </div>
                  <div className="text-3xl font-black text-gray-900 dark:text-white">
                    {(
                      reviews.reduce((sum, r) => sum + r.rating, 0) /
                      reviews.length
                    ).toFixed(1)}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative p-6 rounded-3xl bg-white dark:bg-slate-900 border border-orange-200 dark:border-white/10 shadow-md hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-xl shadow-md">
                  <FaCheckCircle />
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Verified Reviews
                  </div>
                  <div className="text-3xl font-black text-gray-900 dark:text-white">
                    {reviews.filter((r) => r.verified).length}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          <AnimatePresence>
            {reviews.map((review, index) => (
              <ReviewCard
                key={review._id}
                review={review}
                index={index}
                isEditing={editingReviewId === review._id}
                editComment={editComment}
                setEditComment={setEditComment}
                editRating={editRating}
                setEditRating={setEditRating}
                onStartEdit={startEditing}
                onCancelEdit={cancelEditing}
                onSaveEdit={saveEdit}
                onDelete={(id) => {
                  setDeleteId(id);
                  setShowDeleteModal(true);
                }}
              />
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 max-w-md w-full border border-orange-200 dark:border-white/10"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center mx-auto mb-4">
                  <FaTrash className="text-white text-3xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Delete Review?
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  This action cannot be undone. Are you sure you want to delete
                  this review?
                </p>
              </div>

              <div className="flex gap-3">
                <motion.button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-6 py-3 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={deleteReview}
                  className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold shadow-lg hover:shadow-xl transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Delete
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ========== Review Card ========== */
const ReviewCard = ({
  review,
  index,
  isEditing,
  editComment,
  setEditComment,
  editRating,
  setEditRating,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onDelete,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.05 }}
      className="group relative"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <div className="relative p-6 rounded-3xl bg-white dark:bg-slate-900 border border-orange-200 dark:border-white/10 shadow-md hover:shadow-xl transition-all duration-300">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Restaurant Image */}
          <div className="relative flex-shrink-0">
            <div className="w-32 h-32 rounded-2xl overflow-hidden border-2 border-orange-200 dark:border-white/10">
              <img
                src={review.restaurantId?.logo || "/QuickBite.png"}
                alt={review.restaurantId?.name || "Restaurant"}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            {review.verified && (
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                <FaShieldAlt className="text-white text-sm" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <FaStore className="text-orange-500" />
                  {review.restaurantId?.name || "Unknown Restaurant"}
                </h3>
                {review.verified && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-bold">
                    <FaCheckCircle /> Verified Purchase
                  </span>
                )}
              </div>
            </div>

            {isEditing ? (
              /* Edit Mode */
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    Your Rating
                  </label>
                  <StarRating
                    rating={editRating}
                    size="lg"
                    interactive
                    onChange={setEditRating}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    Your Review
                  </label>
                  <textarea
                    value={editComment}
                    onChange={(e) => setEditComment(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all resize-none"
                    rows={5}
                    placeholder="Share your experience..."
                  />
                </div>

                <div className="flex gap-3">
                  <motion.button
                    onClick={() => onSaveEdit(review._id)}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold shadow-lg hover:shadow-xl transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FaSave />
                    Save Changes
                  </motion.button>
                  <motion.button
                    onClick={onCancelEdit}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FaTimes />
                    Cancel
                  </motion.button>
                </div>
              </div>
            ) : (
              /* Display Mode */
              <>
                {/* Rating */}
                <div className="mb-4">
                  <StarRating rating={review.rating} size="lg" />
                </div>

                {/* Comment */}
                <div className="relative mb-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50">
                  <FaQuoteLeft className="absolute top-4 left-4 text-orange-500/20 text-2xl" />
                  <p className="relative z-10 text-gray-700 dark:text-gray-300 leading-relaxed pl-8">
                    {review.comment}
                  </p>
                </div>

                {/* Owner Reply */}
                {review.reply?.text && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-500/30 mb-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white flex-shrink-0">
                        <FaReply />
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-blue-700 dark:text-blue-300 mb-1">
                          Owner Reply
                        </div>
                        <p className="text-sm text-blue-600 dark:text-blue-400 mb-2">
                          {review.reply.text}
                        </p>
                        {review.reply.repliedAt && (
                          <div className="text-xs text-blue-500 dark:text-blue-400">
                            Replied on{" "}
                            {new Date(
                              review.reply.repliedAt
                            ).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Date */}
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <FaCalendarAlt />
                  <span>
                    Reviewed on{" "}
                    {new Date(review.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <motion.button
                    onClick={() => onStartEdit(review)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 font-semibold hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaEdit />
                    Edit
                  </motion.button>
                  <motion.button
                    onClick={() => onDelete(review._id)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 font-semibold hover:bg-red-200 dark:hover:bg-red-900/50 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaTrash />
                    Delete
                  </motion.button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CustomerReviews;