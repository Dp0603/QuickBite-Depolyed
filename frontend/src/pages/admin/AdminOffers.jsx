import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaTags,
  FaCheck,
  FaEdit,
  FaTrash,
  FaClock,
  FaGift,
} from "react-icons/fa";

const AdminOffers = () => {
  const offers = [
    {
      id: 1,
      title: "Flat 20% OFF",
      type: "percentage",
      value: 20,
      code: "SAVE20",
      status: "active",
      validFrom: "Jul 5, 2025",
      validTo: "Jul 20, 2025",
    },
    {
      id: 2,
      title: "₹100 OFF on ₹499",
      type: "amount",
      value: 100,
      code: "GET100",
      status: "expired",
      validFrom: "Jun 1, 2025",
      validTo: "Jun 30, 2025",
    },
    {
      id: 3,
      title: "Free Delivery Weekend",
      type: "free-delivery",
      value: 0,
      code: "FREEDLV",
      status: "active",
      validFrom: "Jul 12, 2025",
      validTo: "Jul 14, 2025",
    },
  ];

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filtered = offers.filter((o) => {
    const matchSearch =
      o.title.toLowerCase().includes(search.toLowerCase()) ||
      o.code.toLowerCase().includes(search.toLowerCase());

    const matchStatus = statusFilter ? o.status === statusFilter : true;

    return matchSearch && matchStatus;
  });

  const statusColors = {
    active: "text-green-600 bg-green-100 dark:bg-green-800 dark:text-green-300",
    expired: "text-red-600 bg-red-100 dark:bg-red-800 dark:text-red-300",
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
          <FaGift /> Manage Offers & Banners
        </h2>
        <div className="flex flex-wrap gap-2 sm:gap-4">
          <input
            type="text"
            placeholder="Search by title or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 w-full sm:w-64 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-secondary text-sm"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-secondary text-sm"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white dark:bg-secondary rounded-xl shadow">
        <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800 text-sm">
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Value</th>
              <th className="px-4 py-3">Validity</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((offer) => (
                <tr
                  key={offer.id}
                  className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 even:bg-gray-50 dark:even:bg-secondary transition"
                >
                  <td className="px-4 py-3 font-medium">{offer.title}</td>
                  <td className="px-4 py-3 text-sm font-mono">{offer.code}</td>
                  <td className="px-4 py-3 capitalize">{offer.type}</td>
                  <td className="px-4 py-3">
                    {offer.type === "amount"
                      ? `₹${offer.value}`
                      : offer.type === "percentage"
                      ? `${offer.value}%`
                      : "Free"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                    <FaClock className="inline mr-1" />
                    {offer.validFrom} → {offer.validTo}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                        statusColors[offer.status]
                      }`}
                    >
                      {offer.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right flex justify-end gap-2">
                    <button className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 dark:text-blue-300 rounded flex items-center gap-1">
                      <FaEdit /> Edit
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
                  No offers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default AdminOffers;
