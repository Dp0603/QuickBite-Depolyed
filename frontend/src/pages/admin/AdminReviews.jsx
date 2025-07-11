import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaStar,
  FaTrash,
  FaCheck,
  FaExclamationCircle,
  FaUserCircle,
} from "react-icons/fa";

const AdminReviews = () => {
  const reviews = [
    {
      id: 1,
      user: "Alice Johnson",
      restaurant: "Pizza Hub",
      rating: 5,
      message: "Amazing food, delivered hot and fresh!",
      date: "Jul 10, 2025",
      status: "approved",
    },
    {
      id: 2,
      user: "Ravi Mehra",
      restaurant: "Sushi Express",
      rating: 2,
      message: "Fish was not fresh and rice was hard.",
      date: "Jul 9, 2025",
      status: "flagged",
    },
    {
      id: 3,
      user: "Jane Smith",
      restaurant: "Tandoori Nights",
      rating: 4,
      message: "Great flavors, just a bit slow on delivery.",
      date: "Jul 8, 2025",
      status: "pending",
    },
    {
      id: 4,
      user: "Amit Patel",
      restaurant: "Burger Haven",
      rating: 1,
      message: "Worst experience ever. Cold burger and rude delivery guy.",
      date: "Jul 7, 2025",
      status: "flagged",
    },
  ];

  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filtered = reviews.filter((r) => {
    const matchSearch =
      r.user.toLowerCase().includes(search.toLowerCase()) ||
      r.restaurant.toLowerCase().includes(search.toLowerCase()) ||
      r.message.toLowerCase().includes(search.toLowerCase());

    const matchRating = ratingFilter
      ? r.rating === parseInt(ratingFilter)
      : true;
    const matchStatus = statusFilter ? r.status === statusFilter : true;

    return matchSearch && matchRating && matchStatus;
  });

  const statusColors = {
    approved:
      "text-green-600 bg-green-100 dark:bg-green-800 dark:text-green-300",
    flagged:
      "text-yellow-700 bg-yellow-100 dark:bg-yellow-800 dark:text-yellow-300",
    pending: "text-red-600 bg-red-100 dark:bg-red-800 dark:text-red-300",
  };

  return (
    <motion.div
      className="min-h-screen w-full bg-gray-50 dark:bg-gray-950 px-4 sm:px-8 md:px-10 lg:px-12 py-8 text-gray-800 dark:text-white"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FaStar className="text-yellow-500" /> Review Moderation
        </h2>
        <div className="flex flex-wrap gap-2 sm:gap-4">
          <input
            type="text"
            placeholder="Search user, restaurant or text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 w-full sm:w-64 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-secondary text-sm"
          />
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-secondary text-sm"
          >
            <option value="">All Ratings</option>
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>
                {r} Stars
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-secondary text-sm"
          >
            <option value="">All Statuses</option>
            <option value="approved">Approved</option>
            <option value="flagged">Flagged</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white dark:bg-secondary rounded-xl shadow">
        <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800 text-sm">
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Restaurant</th>
              <th className="px-4 py-3">Rating</th>
              <th className="px-4 py-3">Message</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((review) => (
                <tr
                  key={review.id}
                  className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 even:bg-gray-50 dark:even:bg-secondary transition"
                >
                  <td className="px-4 py-3 font-medium flex items-center gap-2">
                    <FaUserCircle className="text-gray-400" />
                    {review.user}
                  </td>
                  <td className="px-4 py-3">{review.restaurant}</td>
                  <td className="px-4 py-3 flex items-center text-yellow-500 gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <FaStar key={i} className="text-xs" />
                    ))}
                    <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">
                      ({review.rating})
                    </span>
                  </td>
                  <td className="px-4 py-3 truncate max-w-xs">
                    {review.message}
                  </td>
                  <td className="px-4 py-3">{review.date}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                        statusColors[review.status]
                      }`}
                    >
                      {review.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right flex justify-end gap-2">
                    {review.status !== "approved" && (
                      <button className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800 dark:text-green-300 rounded flex items-center gap-1">
                        <FaCheck /> Approve
                      </button>
                    )}
                    <button className="px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-800 dark:text-yellow-200 rounded flex items-center gap-1">
                      <FaExclamationCircle /> Flag
                    </button>
                    <button className="px-3 py-1 text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 dark:text-red-300 rounded flex items-center gap-1">
                      <FaTrash /> Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="px-4 py-6 text-center text-gray-500 dark:text-gray-400"
                >
                  No reviews found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default AdminReviews;
