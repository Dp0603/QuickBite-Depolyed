import React, { useState } from "react";
import {
  FaUtensils,
  FaCheck,
  FaTimes,
  FaFileExport,
  FaInfoCircle,
  FaStar,
  FaClock,
} from "react-icons/fa";
import { motion } from "framer-motion";

const AdminRestaurants = () => {
  const [restaurants] = useState([
    {
      id: 1,
      name: "Sushi Express",
      owner: "Akira Tanaka",
      email: "akira@sushiexpress.com",
      status: "pending",
    },
    {
      id: 2,
      name: "Pizza Hub",
      owner: "Elena Rossi",
      email: "elena@pizzahub.com",
      status: "approved",
    },
    {
      id: 3,
      name: "Ramen King",
      owner: "Tomoyuki Sato",
      email: "tomo@ramenking.com",
      status: "rejected",
    },
    {
      id: 4,
      name: "Tandoori Nights",
      owner: "Aman Kapoor",
      email: "aman@tandoorinights.com",
      status: "pending",
    },
  ]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  const filtered = restaurants.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.owner.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter ? r.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const statusColors = {
    approved:
      "text-green-600 bg-green-100 dark:bg-green-800 dark:text-green-300",
    rejected: "text-red-600 bg-red-100 dark:bg-red-800 dark:text-red-300",
    pending:
      "text-yellow-600 bg-yellow-100 dark:bg-yellow-800 dark:text-yellow-300",
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
          <FaUtensils /> Manage Restaurants
        </h2>
        <div className="flex flex-wrap gap-2 sm:gap-4">
          <input
            type="text"
            placeholder="Search by name or owner..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 w-full sm:w-56 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-secondary text-sm"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-secondary text-sm"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <button className="px-4 py-2 bg-primary text-white rounded hover:bg-orange-600 text-sm flex items-center gap-2">
            <FaFileExport /> Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white dark:bg-secondary rounded-xl shadow">
        <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800 text-sm">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Owner</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((r) => (
                <tr
                  key={r.id}
                  className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 even:bg-gray-50 dark:even:bg-secondary transition"
                >
                  <td className="px-4 py-3 font-medium">{r.name}</td>
                  <td className="px-4 py-3">{r.owner}</td>
                  <td className="px-4 py-3">{r.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        statusColors[r.status]
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right flex justify-end gap-2 flex-wrap">
                    <button
                      onClick={() => setSelectedRestaurant(r)}
                      className="px-3 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 dark:text-blue-300 flex items-center gap-1"
                    >
                      <FaInfoCircle /> View
                    </button>
                    <button className="px-3 py-1 text-xs font-semibold rounded bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800 dark:text-green-300 flex items-center gap-1">
                      <FaCheck /> Approve
                    </button>
                    <button className="px-3 py-1 text-xs font-semibold rounded bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 dark:text-red-300 flex items-center gap-1">
                      <FaTimes /> Reject
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-4 py-6 text-center text-gray-500">
                  No restaurants found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selectedRestaurant && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white dark:bg-secondary w-full max-w-lg rounded-xl shadow-lg p-6 relative animate-fade-in">
            {/* Close */}
            <button
              onClick={() => setSelectedRestaurant(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
              aria-label="Close"
            >
              ✕
            </button>

            <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <FaUtensils /> {selectedRestaurant.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-300 mb-4">
              Owned by: {selectedRestaurant.owner} ({selectedRestaurant.email})
            </p>

            {/* Dummy Info */}
            <div className="mb-3">
              <h4 className="font-semibold text-sm mb-1">🍽 Sample Menu</h4>
              <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 pl-2">
                <li>Spicy Ramen - ₹299</li>
                <li>Chicken Katsu - ₹349</li>
                <li>Gyoza Dumplings - ₹199</li>
              </ul>
            </div>

            <div className="flex items-center gap-4 text-sm mb-2">
              <span className="flex items-center gap-1 text-yellow-500">
                <FaStar /> 4.6 Rating
              </span>
              <span className="flex items-center gap-1 text-gray-500 dark:text-gray-300">
                <FaClock /> 10:00 AM – 11:00 PM
              </span>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Last updated: Jul 10, 2025
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default AdminRestaurants;
