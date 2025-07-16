import React, { useEffect, useState, useContext } from "react";
import { FaStar, FaEdit, FaTrashAlt, FaUtensils } from "react-icons/fa";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";

const CustomerReviews = () => {
  const [reviews, setReviews] = useState([]);
  const { user } = useContext(AuthContext);

  // ✅ Fetch reviews on mount
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await API.get("/reviews/me"); // Protected route
        setReviews(res.data.data);
      } catch (err) {
        console.error("❌ Error fetching reviews:", err);
      }
    };

    fetchReviews();
  }, []);

  // ✅ Handle delete review
  const handleDelete = async (reviewId) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this review?"
    );
    if (!confirm) return;

    try {
      await API.delete(`/reviews/${reviewId}`);
      setReviews((prev) => prev.filter((r) => r._id !== reviewId));
    } catch (err) {
      console.error("❌ Error deleting review:", err);
      alert("Failed to delete review. Please try again.");
    }
  };

  return (
    <div className="p-6 text-gray-800 dark:text-white">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <FaUtensils className="text-primary" /> My Reviews
      </h1>

      {reviews.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          You haven't posted any reviews yet.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="p-5 bg-white dark:bg-secondary border dark:border-gray-700 shadow rounded-xl animate-fade-in"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold">
                  {review.restaurantId?.restaurantName || "Unknown Restaurant"}
                </h3>
                <span className="text-xs text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString("en-IN")}
                </span>
              </div>

              {/* ⭐ Star rating */}
              <div className="flex items-center gap-1 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FaStar
                    key={i}
                    className={`${
                      i < review.rating
                        ? "text-yellow-400"
                        : "text-gray-300 dark:text-gray-600"
                    }`}
                  />
                ))}
              </div>

              {/* 💬 Comment */}
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                {review.comment}
              </p>

              {/* ✏️ Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => alert("Edit functionality coming soon!")}
                  className="flex items-center gap-2 text-sm bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-white px-3 py-1.5 rounded-md transition"
                >
                  <FaEdit /> Edit
                </button>
                <button
                  onClick={() => handleDelete(review._id)}
                  className="flex items-center gap-2 text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md transition"
                >
                  <FaTrashAlt /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerReviews;
