import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaExclamationTriangle, FaCheck, FaTrash } from "react-icons/fa";

const AdminComplaints = () => {
  const [search, setSearch] = useState("");

  const complaints = [
    {
      id: 1,
      user: "Alice Johnson",
      type: "delivery",
      message: "Delivery was delayed by 45 minutes.",
      date: "Jul 10, 2025",
      status: "open",
    },
    {
      id: 2,
      user: "Ravi Mehra",
      type: "food",
      message: "The food was cold and packaging was damaged.",
      date: "Jul 9, 2025",
      status: "open",
    },
    {
      id: 3,
      user: "Jane Smith",
      type: "order",
      message: "Wrong item delivered. I ordered veg, got chicken.",
      date: "Jul 8, 2025",
      status: "resolved",
    },
  ];

  const filtered = complaints.filter(
    (c) =>
      c.user.toLowerCase().includes(search.toLowerCase()) ||
      c.type.toLowerCase().includes(search.toLowerCase()) ||
      c.message.toLowerCase().includes(search.toLowerCase())
  );

  const typeColors = {
    delivery: "bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-300",
    food: "bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-300",
    order:
      "bg-purple-100 text-purple-700 dark:bg-purple-800 dark:text-purple-300",
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
          <FaExclamationTriangle /> Complaints & Issues
        </h2>
        <input
          type="text"
          placeholder="Search by user, type, or message"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 w-full sm:w-64 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-secondary text-sm"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white dark:bg-secondary rounded-xl shadow">
        <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800 text-sm">
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Message</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((c) => (
                <tr
                  key={c.id}
                  className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 even:bg-gray-50 dark:even:bg-secondary transition"
                >
                  <td className="px-4 py-3 font-medium">{c.user}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                        typeColors[c.type]
                      }`}
                    >
                      {c.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 truncate max-w-xs">{c.message}</td>
                  <td className="px-4 py-3">{c.date}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        c.status === "open"
                          ? "bg-red-100 text-red-600 dark:bg-red-800 dark:text-red-300"
                          : "bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-300"
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right flex justify-end gap-2">
                    {c.status === "open" && (
                      <button className="px-3 py-1 text-xs font-medium bg-primary text-white rounded hover:bg-orange-600 transition flex items-center gap-1">
                        <FaCheck /> Mark Resolved
                      </button>
                    )}
                    <button className="px-3 py-1 text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 dark:text-red-300 rounded flex items-center gap-1">
                      <FaTrash /> Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="px-4 py-6 text-center text-gray-500 dark:text-gray-400"
                >
                  No complaints found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default AdminComplaints;
