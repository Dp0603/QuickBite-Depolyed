import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import { FaStar, FaRegStar } from "react-icons/fa";

const StarRating = ({ rating }) => {
  return (
    <div className="flex" aria-label={`Rating: ${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) =>
        star <= rating ? (
          <FaStar
            key={star}
            className="w-6 h-6 text-yellow-400 drop-shadow"
            aria-hidden="true"
          />
        ) : (
          <FaRegStar
            key={star}
            className="w-6 h-6 text-yellow-400 drop-shadow"
            aria-hidden="true"
          />
        )
      )}
    </div>
  );
};

const CustomerReviews = () => {
  const [reviews, setReviews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editComment, setEditComment] = useState("");
  const [editRating, setEditRating] = useState(0);

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

  const deleteReview = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      await API.delete(`/reviews/review/delete/${id}`);
      setReviews(reviews.filter((r) => r._id !== id));
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
      const res = await API.put(`/reviews/review/edit/${id}`, {
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
      <p className="text-center text-gray-500 italic mt-20 text-lg">
        Loading reviews...
      </p>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <p className="text-center text-gray-500 italic mt-20 text-lg">
        You haven't left any reviews yet.
      </p>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        My Reviews
      </h1>

      {reviews.map((r) => (
        <div
          key={r._id}
          className="flex flex-col md:flex-row border rounded-lg shadow-sm p-6 mb-6 bg-white hover:shadow-md transition-shadow duration-300"
        >
          <img
            src={r.restaurantId?.logo || "/placeholder.jpg"}
            alt={r.restaurantId?.name || "Restaurant Image"}
            className="w-28 h-28 rounded-lg object-cover flex-shrink-0 mx-auto md:mx-0"
          />

          <div className="flex-grow md:ml-6 mt-4 md:mt-0">
            <h3 className="text-xl font-semibold text-gray-900">
              {r.restaurantId?.name || "Unknown Restaurant"}
            </h3>

            {editingReviewId === r._id ? (
              <>
                {/* Edit Mode */}
                <label className="block mt-4 font-medium text-gray-700">
                  Rating:
                  <select
                    value={editRating}
                    onChange={(e) => setEditRating(Number(e.target.value))}
                    className="ml-2 border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  >
                    {[1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </label>

                <textarea
                  value={editComment}
                  onChange={(e) => setEditComment(e.target.value)}
                  className="w-full border rounded-md p-3 mt-3 resize-y focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  rows={5}
                  placeholder="Update your review..."
                />

                <div className="mt-4 flex space-x-3">
                  <button
                    onClick={() => saveEdit(r._id)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-5 rounded-md shadow"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-5 rounded-md shadow"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Display Mode */}
                <div className="flex items-center mt-2 space-x-3">
                  <StarRating rating={r.rating} />
                  <span className="text-sm text-gray-500 font-medium">
                    {r.verified ? "Verified" : "Unverified"}
                  </span>
                </div>

                <p className="mt-3 text-gray-700 whitespace-pre-line leading-relaxed">
                  {r.comment}
                </p>

                <small className="text-gray-400 block mt-3">
                  Reviewed on{" "}
                  {new Date(r.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </small>

                <div className="mt-4 flex space-x-4">
                  <button
                    onClick={() => startEditing(r)}
                    className="text-yellow-600 hover:text-yellow-800 font-semibold transition-colors"
                    aria-label="Edit review"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteReview(r._id)}
                    className="text-red-600 hover:text-red-800 font-semibold transition-colors"
                    aria-label="Delete review"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CustomerReviews;
