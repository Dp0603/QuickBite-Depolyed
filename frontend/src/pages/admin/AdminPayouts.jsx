import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaMoneyBillWave, FaCheck, FaClock } from "react-icons/fa";

const AdminPayouts = () => {
  const payouts = [
    {
      id: 1,
      restaurant: "Pizza Hub",
      owner: "Elena Rossi",
      amount: 12000,
      status: "paid",
      date: "Jul 5, 2025",
    },
    {
      id: 2,
      restaurant: "Sushi Express",
      owner: "Akira Tanaka",
      amount: 8900,
      status: "pending",
      date: "-",
    },
    {
      id: 3,
      restaurant: "Tandoori Nights",
      owner: "Aman Kapoor",
      amount: 10150,
      status: "paid",
      date: "Jul 1, 2025",
    },
    {
      id: 4,
      restaurant: "Burger Haven",
      owner: "Priya Menon",
      amount: 7250,
      status: "pending",
      date: "-",
    },
  ];

  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");

  const filtered = payouts.filter((p) => {
    const matchStatus = statusFilter ? p.status === statusFilter : true;
    const matchSearch = p.restaurant
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const statusStyles = {
    paid: "text-green-600 bg-green-100 dark:bg-green-800 dark:text-green-300",
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
          <FaMoneyBillWave /> Payout Management
        </h2>
        <div className="flex flex-wrap gap-2 sm:gap-4">
          <input
            type="text"
            placeholder="Search restaurant..."
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
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white dark:bg-secondary rounded-xl shadow">
        <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800 text-sm">
              <th className="px-4 py-3">Restaurant</th>
              <th className="px-4 py-3">Owner</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Payout Date</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((payout) => (
                <tr
                  key={payout.id}
                  className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 even:bg-gray-50 dark:even:bg-secondary transition"
                >
                  <td className="px-4 py-3 font-medium">{payout.restaurant}</td>
                  <td className="px-4 py-3">{payout.owner}</td>
                  <td className="px-4 py-3 font-semibold">₹{payout.amount}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full font-medium ${
                        statusStyles[payout.status]
                      }`}
                    >
                      {payout.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">{payout.date}</td>
                  <td className="px-4 py-3 text-right">
                    {payout.status === "pending" ? (
                      <button className="px-3 py-1 text-xs font-medium bg-primary text-white rounded hover:bg-orange-600 transition flex items-center gap-1">
                        <FaCheck /> Pay Now
                      </button>
                    ) : (
                      <span className="text-sm text-gray-400 dark:text-gray-500">
                        <FaCheck className="inline mr-1" />
                        Paid
                      </span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="px-4 py-6 text-center text-gray-500 dark:text-gray-400"
                >
                  No payouts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default AdminPayouts;
