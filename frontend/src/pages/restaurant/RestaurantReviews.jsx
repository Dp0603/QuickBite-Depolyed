import React, { useEffect, useState, useContext } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";

const ReviewCard = ({ review }) => {
  const totalStars = 5;

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

      <div className="flex items-center text-yellow-400 mb-2">
        {Array.from({ length: totalStars }).map((_, i) =>
          i < review.rating ? (
            <FaStar key={i} className="text-sm" />
          ) : (
            <FaRegStar key={i} className="text-sm" />
          )
        )}
      </div>

      <p className="text-gray-700 dark:text-gray-300 text-sm">
        {review.feedback || "No comment provided."}
      </p>
    </div>
  );
};

const RestaurantReviews = () => {
  const { user } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const res = await API.get(`/ratings/restaurant/${user._id}`);
      setReviews(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch reviews", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div className="p-6 text-gray-800 dark:text-white">
      <h2 className="text-2xl font-bold mb-5 flex items-center gap-2">
        <FaStar className="text-yellow-500" /> Customer Reviews
      </h2>

      {loading ? (
        <p>Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="text-gray-500">No reviews yet.</p>
      ) : (
        <div className="grid gap-5">
          {reviews.map((review) => (
            <ReviewCard key={review._id} review={review} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantReviews;
