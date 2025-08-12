import React, { useState, useContext, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import API from "../../api/axios";
import { FaStar } from "react-icons/fa";

const CustomerLeaveReview = () => {
  const { id: orderId } = useParams();
  const [searchParams] = useSearchParams();
  const restaurantId = searchParams.get("restaurant");
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

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
      }, 2200);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to submit review. Try again."
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-yellow-50 via-yellow-100 to-yellow-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4 py-12">
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-lg w-full p-10 relative overflow-hidden">
        {/* Restaurant Branding */}
        {restaurant && (
          <div className="flex flex-col items-center mb-10">
            {restaurant.logo && (
              <img
                src={restaurant.logo}
                alt={restaurant.name}
                className="w-24 h-24 rounded-full object-cover mb-4 shadow-xl ring-4 ring-yellow-400 dark:ring-yellow-600 transition-transform hover:scale-105"
              />
            )}
            <h1 className="text-4xl font-extrabold text-yellow-600 dark:text-yellow-400 tracking-tight drop-shadow-md">
              Review{" "}
              <span className="underline decoration-yellow-400">
                {restaurant.name}
              </span>
            </h1>
          </div>
        )}

        {/* Success Overlay */}
        {showSuccess && (
          <div
            className="absolute inset-0 bg-black bg-opacity-70 rounded-3xl flex flex-col items-center justify-center text-white p-6 z-50 animate-fadeIn"
            style={{ animationDuration: "0.6s" }}
          >
            <h2 className="text-4xl font-bold mb-4">Thank you!</h2>
            <p className="text-xl max-w-xs text-center">
              Your review has been submitted successfully.
            </p>
          </div>
        )}

        {/* Form */}
        {!showSuccess && (
          <>
            <div
              className="flex justify-center mb-8 select-none"
              aria-label="Star rating"
            >
              {[1, 2, 3, 4, 5].map((star) => {
                const filled = star <= (hover || rating);
                return (
                  <FaStar
                    key={star}
                    size={48}
                    className={`cursor-pointer transition-transform duration-200 ease-in-out ${
                      filled
                        ? "text-yellow-400 drop-shadow-lg"
                        : "text-gray-300 dark:text-gray-600"
                    } ${
                      filled && (hover === star || rating === star)
                        ? "scale-110"
                        : "scale-100"
                    } hover:text-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded`}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    role="button"
                    tabIndex={0}
                    aria-label={`${star} Star`}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") setRating(star);
                    }}
                  />
                );
              })}
            </div>

            {error && (
              <p
                className="text-red-600 text-center mb-6 font-semibold select-none"
                role="alert"
              >
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="relative">
                <textarea
                  id="comment"
                  placeholder=" "
                  rows={6}
                  className="peer block w-full rounded-xl border border-yellow-300 bg-yellow-50 dark:bg-gray-800 dark:border-yellow-500 dark:text-gray-100 px-5 pt-6 pb-4 resize-none placeholder-transparent focus:outline-none focus:ring-4 focus:ring-yellow-400 transition"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  maxLength={500}
                  aria-describedby="comment-help"
                />
                <label
                  htmlFor="comment"
                  className="absolute left-5 top-3 text-yellow-600 dark:text-yellow-400 text-sm font-semibold transition-all peer-placeholder-shown:top-6 peer-placeholder-shown:text-yellow-400 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal pointer-events-none select-none"
                >
                  Write your feedback here...
                </label>
                <p
                  id="comment-help"
                  className="text-xs text-yellow-600 dark:text-yellow-400 mt-1 select-none"
                >
                  {comment.length} / 500 characters
                </p>
              </div>

              <button
                type="submit"
                disabled={rating === 0 || isSubmitting}
                className={`w-full py-4 rounded-xl font-extrabold tracking-wide transition ${
                  rating === 0 || isSubmitting
                    ? "bg-yellow-200 text-yellow-600 cursor-not-allowed"
                    : "bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg hover:shadow-yellow-600/50"
                }`}
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </>
        )}
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from {opacity: 0;}
            to {opacity: 1;}
          }
          .animate-fadeIn {
            animation-name: fadeIn;
          }
        `}
      </style>
    </div>
  );
};

export default CustomerLeaveReview;
