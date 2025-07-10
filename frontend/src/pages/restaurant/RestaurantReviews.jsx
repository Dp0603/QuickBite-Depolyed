import React from "react";
import { FaStar, FaRegStar } from "react-icons/fa";

const reviews = [
  {
    id: 1,
    customer: "Ravi Kumar",
    rating: 5,
    comment: "Delicious food and fast delivery!",
    date: "July 8, 2025",
  },
  {
    id: 2,
    customer: "Ananya Singh",
    rating: 4,
    comment: "Loved the biryani. Packaging could improve.",
    date: "July 6, 2025",
  },
  {
    id: 3,
    customer: "Amit Das",
    rating: 3,
    comment: "Average taste. Quantity was low for the price.",
    date: "July 2, 2025",
  },
];

// Reusable Review Card
const ReviewCard = ({ review }) => {
  const totalStars = 5;

  return (
    <div className="bg-white dark:bg-secondary p-4 rounded-lg shadow hover:shadow-md transition">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-semibold text-gray-800 dark:text-white">
          {review.customer}
        </h4>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {review.date}
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
        {review.comment}
      </p>
    </div>
  );
};

const RestaurantReviews = () => {
  return (
    <div className="p-6 text-gray-800 dark:text-white">
      <h2 className="text-2xl font-bold mb-5 flex items-center gap-2">
        <FaStar className="text-yellow-500" /> Customer Reviews
      </h2>

      <div className="grid gap-5">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
};

export default RestaurantReviews;
