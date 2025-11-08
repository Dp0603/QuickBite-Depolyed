import React, { useState, useContext, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaStar,
  FaRegStar,
  FaCheckCircle,
  FaStore,
  FaArrowRight,
  FaQuoteLeft,
  FaMagic,
  FaHeart,
} from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import API from "../../api/axios";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

const CustomerLeaveReview = () => {
  const { id: orderId } = useParams();
  const [searchParams] = useSearchParams();
  const restaurantId = searchParams.get("restaurant");
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { width, height } = useWindowSize();

  const [restaurant, setRestaurant] = useState(null);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (restaurantId) {
      API.get(`/restaurants/restaurant/public/${restaurantId}`)
        .then((res) => setRestaurant(res.data.restaurant))
        .catch(() => setRestaurant(null));
    }
  }, [restaurantId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a star rating.");
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      await API.post("/reviews/review", {
        orderId,
        restaurantId,
        userId: user._id,
        rating,
        comment,
      });
      setShowSuccess(true);
      setTimeout(() => {
        navigate("/customer/orders");
      }, 3000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to submit review. Try again."
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center px-4 py-12">
      {/* Confetti */}
      {showSuccess && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.3}
        />
      )}

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl"
      >
        <div className="relative">
          {/* Gradient Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-3xl blur-2xl opacity-50"></div>

          <div className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-orange-200 dark:border-white/10 overflow-hidden">
            {/* Header */}
            {restaurant && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="relative overflow-hidden"
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-pink-600 to-purple-600"></div>
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1600&q=80')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                ></div>

                <div className="relative z-10 p-8 text-center text-white">
                  {/* Restaurant Logo */}
                  {restaurant.logo && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{
                        delay: 0.3,
                        type: "spring",
                        stiffness: 200,
                      }}
                      className="inline-block mb-4"
                    >
                      <div className="relative">
                        <div className="absolute inset-0 bg-white rounded-2xl blur-xl opacity-50"></div>
                        <img
                          src={restaurant.logo}
                          alt={restaurant.name}
                          className="relative w-24 h-24 rounded-2xl object-cover shadow-2xl border-4 border-white"
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Title */}
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-3xl md:text-4xl font-black mb-2 drop-shadow-lg flex items-center justify-center gap-3"
                  >
                    <FaStore />
                    Rate Your Experience
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-white/90 text-lg"
                  >
                    How was your meal at{" "}
                    <span className="font-bold">{restaurant.name}</span>?
                  </motion.p>
                </div>
              </motion.div>
            )}

            {/* Content */}
            <div className="p-8 md:p-10">
              <AnimatePresence mode="wait">
                {!showSuccess ? (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {/* Star Rating */}
                    <div className="mb-8">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="text-center mb-4"
                      >
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                          Your Rating
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Click on the stars to rate
                        </p>
                      </motion.div>

                      <div className="flex justify-center gap-3 mb-4">
                        {[1, 2, 3, 4, 5].map((star) => {
                          const filled = star <= (hover || rating);
                          return (
                            <motion.button
                              key={star}
                              type="button"
                              onClick={() => setRating(star)}
                              onMouseEnter={() => setHover(star)}
                              onMouseLeave={() => setHover(0)}
                              className="focus:outline-none focus:ring-4 focus:ring-orange-500/30 rounded-lg"
                              whileHover={{ scale: 1.2, rotate: 15 }}
                              whileTap={{ scale: 0.9 }}
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.7 + star * 0.05 }}
                            >
                              {filled ? (
                                <FaStar className="text-5xl md:text-6xl text-yellow-500 drop-shadow-lg" />
                              ) : (
                                <FaRegStar className="text-5xl md:text-6xl text-gray-300 dark:text-gray-600" />
                              )}
                            </motion.button>
                          );
                        })}
                      </div>

                      {rating > 0 && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="text-center"
                        >
                          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-600/30 text-yellow-700 dark:text-yellow-300 font-bold">
                            <FaHeart className="text-yellow-600 dark:text-yellow-400" />
                            {rating === 5 && "Outstanding!"}
                            {rating === 4 && "Great!"}
                            {rating === 3 && "Good!"}
                            {rating === 2 && "Fair"}
                            {rating === 1 && "Needs Improvement"}
                          </span>
                        </motion.div>
                      )}
                    </div>

                    {/* Error Message */}
                    <AnimatePresence>
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, height: 0 }}
                          animate={{ opacity: 1, y: 0, height: "auto" }}
                          exit={{ opacity: 0, y: -10, height: 0 }}
                          className="mb-6 p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30"
                        >
                          <p className="text-red-600 dark:text-red-400 font-semibold text-center flex items-center justify-center gap-2">
                            ⚠️ {error}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Comment */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                      >
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                          Share Your Experience (Optional)
                        </label>
                        <div className="relative">
                          <FaQuoteLeft className="absolute top-4 left-4 text-orange-500/20 text-2xl pointer-events-none" />
                          <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Tell us what you loved or how we can improve..."
                            className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all resize-none"
                            rows={6}
                            maxLength={500}
                          />
                          <div className="absolute bottom-3 right-4 text-xs text-gray-500 dark:text-gray-400">
                            {comment.length} / 500
                          </div>
                        </div>
                      </motion.div>

                      {/* Submit Button */}
                      <motion.button
                        type="submit"
                        disabled={rating === 0 || isSubmitting}
                        className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
                          rating === 0 || isSubmitting
                            ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed opacity-50"
                            : "bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 hover:shadow-xl"
                        }`}
                        whileHover={
                          rating > 0 && !isSubmitting ? { scale: 1.02 } : {}
                        }
                        whileTap={
                          rating > 0 && !isSubmitting ? { scale: 0.98 } : {}
                        }
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Submitting...
                          </>
                        ) : (
                          <>
                            Submit Review
                            <FaArrowRight />
                          </>
                        )}
                      </motion.button>
                    </form>
                  </motion.div>
                ) : (
                  /* Success Screen */
                  <motion.div
                    key="success"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center py-12"
                  >
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{
                        delay: 0.2,
                        type: "spring",
                        stiffness: 200,
                      }}
                      className="inline-block mb-6"
                    >
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full blur-2xl opacity-50 animate-pulse"></div>
                        <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-2xl">
                          <FaCheckCircle className="text-white text-5xl" />
                        </div>
                      </div>
                    </motion.div>

                    <motion.h2
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-4xl font-black mb-4 bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-500 bg-clip-text text-transparent"
                    >
                      Thank You! 🎉
                    </motion.h2>

                    <motion.p
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="text-lg text-gray-600 dark:text-gray-400 mb-8"
                    >
                      Your review has been submitted successfully!
                    </motion.p>

                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.6 }}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-500/30 text-green-700 dark:text-green-300 font-semibold"
                    >
                      <FaMagic />
                      Redirecting to orders...
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CustomerLeaveReview;
