import React from "react";
import { FaStar } from "react-icons/fa";

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

const RestaurantReviews = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Customer Reviews</h2>
      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-white dark:bg-gray-800 p-4 rounded shadow"
          >
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium">{review.customer}</h4>
              <span className="text-sm text-gray-500">{review.date}</span>
            </div>
            <div className="flex items-center text-yellow-400 mb-1">
              {Array.from({ length: review.rating }).map((_, i) => (
                <FaStar key={i} />
              ))}
            </div>
            <p className="text-gray-700 dark:text-gray-300">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RestaurantReviews;
