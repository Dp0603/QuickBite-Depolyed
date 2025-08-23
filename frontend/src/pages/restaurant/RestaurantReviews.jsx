import React, { useEffect, useState, useContext } from "react";
import { FaStar, FaRegStar, FaSortAmountDown, FaReply } from "react-icons/fa";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";

// ⭐ Stars Component
const Stars = ({ rating }) => {
  const totalStars = 5;
  return (
    <div className="flex items-center text-yellow-400">
      {Array.from({ length: totalStars }).map((_, i) =>
        i < rating ? (
          <FaStar key={i} className="text-sm" />
        ) : (
          <FaRegStar key={i} className="text-sm" />
        )
      )}
    </div>
  );
};

// 📦 Individual Review Card
const ReviewCard = ({ review, onReply }) => {
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleReplySubmit = () => {
    if (replyText.trim().length < 2) {
      alert("Reply must be at least 2 characters.");
      return;
    }
    onReply(review._id, replyText);
    setReplyText("");
    setReplying(false);
  };

  return (
    <div className="bg-white dark:bg-secondary p-4 rounded-lg shadow hover:shadow-md transition">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-semibold text-gray-800 dark:text-white">
          {review.user?.name || "Anonymous"}
        </h4>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {new Date(review.createdAt).toLocaleDateString()}
        </span>
      </div>

      <Stars rating={review.rating} />

      <p className="text-gray-700 dark:text-gray-300 text-sm my-2">
        {review.comment || "No comment provided."}
      </p>

      {review.reply?.text ? (
        <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded mt-2 text-sm">
          <strong className="text-gray-800 dark:text-white">
            Owner Reply:
          </strong>{" "}
          <span className="text-gray-600 dark:text-gray-300">
            {review.reply.text}
          </span>
        </div>
      ) : replying ? (
        <div className="mt-2">
          <textarea
            className="w-full p-2 border rounded-md text-sm dark:bg-gray-800 dark:text-white"
            rows={2}
            placeholder="Write your reply..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
          <div className="flex gap-2 mt-1">
            <button
              onClick={handleReplySubmit}
              className="px-3 py-1 bg-primary text-white rounded text-sm hover:bg-primary-dark"
            >
              Reply
            </button>
            <button
              onClick={() => setReplying(false)}
              className="px-3 py-1 border rounded text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setReplying(true)}
          className="flex items-center gap-1 mt-2 text-primary hover:underline text-sm"
        >
          <FaReply /> Reply
        </button>
      )}
    </div>
  );
};

// 📊 Review Summary Component
const ReviewSummary = ({ reviews }) => {
  if (!reviews.length) return null;

  const avgRating =
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  return (
    <div className="mb-6">
      <h3 className="text-xl font-bold mb-2">Overall Rating</h3>
      <div className="flex items-center gap-2 mb-3">
        <Stars rating={Math.round(avgRating)} />
        <span className="font-semibold">{avgRating.toFixed(1)} / 5</span>
        <span className="text-gray-500">({reviews.length} reviews)</span>
      </div>
      <div className="space-y-1">
        {distribution.map((d) => (
          <div key={d.star} className="flex items-center gap-2 text-sm">
            <span className="w-8">{d.star}★</span>
            <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded">
              <div
                className="h-2 bg-yellow-400 rounded"
                style={{
                  width: `${(d.count / reviews.length) * 100 || 0}%`,
                }}
              ></div>
            </div>
            <span>{d.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// 🚀 Main Component
const RestaurantReviews = () => {
  const { user } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sort, setSort] = useState("newest");

  // You need the restaurant ID, not the user ID
  const restaurantId = user?.restaurantId; // Make sure your user context has this

  // Fetch reviews
  const fetchReviews = async () => {
    if (!restaurantId) return setError("Restaurant ID not found.");
    try {
      setLoading(true);
      setError("");
      const res = await API.get(`/review/${restaurantId}`);
      setReviews(res.data.reviews || []);
    } catch (err) {
      console.error("Failed to fetch reviews", err);
      setError("Unable to load reviews. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle owner reply
  const handleReply = async (reviewId, replyText) => {
    try {
      await API.post(`/review/${reviewId}/reply`, { reply: replyText });
      setReviews((prev) =>
        prev.map((r) =>
          r._id === reviewId
            ? { ...r, reply: { text: replyText, repliedAt: new Date() } }
            : r
        )
      );
    } catch (err) {
      console.error("Failed to post reply", err);
      alert("Failed to post reply. Please try again.");
    }
  };

  // Sort reviews
  const sortedReviews = [...reviews].sort((a, b) => {
    if (sort === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
    if (sort === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
    if (sort === "highest") return b.rating - a.rating;
    if (sort === "lowest") return a.rating - b.rating;
    return 0;
  });

  useEffect(() => {
    fetchReviews();
  }, [restaurantId]);

  return (
    <div className="p-6 text-gray-800 dark:text-white">
      <h2 className="text-2xl font-bold mb-5 flex items-center gap-2">
        <FaStar className="text-yellow-500" /> Customer Reviews
      </h2>

      {loading ? (
        <p>Loading reviews...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : reviews.length === 0 ? (
        <p className="text-gray-500">No reviews yet.</p>
      ) : (
        <>
          <ReviewSummary reviews={reviews} />

          {/* Sort/Filter */}
          <div className="flex justify-end mb-4">
            <label className="flex items-center gap-2 text-sm">
              <FaSortAmountDown /> Sort by:
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="p-1 border rounded text-sm dark:bg-gray-800"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="highest">Highest Rated</option>
                <option value="lowest">Lowest Rated</option>
              </select>
            </label>
          </div>

          {/* Review Cards */}
          <div className="grid gap-5">
            {sortedReviews.map((review) => (
              <ReviewCard
                key={review._id}
                review={review}
                onReply={handleReply}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default RestaurantReviews;
