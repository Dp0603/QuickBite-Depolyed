import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaShoppingCart, FaTruck, FaSearch } from "react-icons/fa";

const AdminOrders = () => {
  const orders = [
    {
      id: 1,
      customer: "Alice Johnson",
      restaurant: "Pizza Hub",
      total: 599,
      status: "pending",
      delivery: null,
    },
    {
      id: 2,
      customer: "Ravi Mehra",
      restaurant: "Sushi Express",
      total: 899,
      status: "ongoing",
      delivery: "Deepak Sharma",
    },
    {
      id: 3,
      customer: "Jane Smith",
      restaurant: "Tandoori Nights",
      total: 499,
      status: "delivered",
      delivery: "Sunil Kumar",
    },
    {
      id: 4,
      customer: "Amit Patel",
      restaurant: "Burger Haven",
      total: 699,
      status: "cancelled",
      delivery: null,
    },
  ];

  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");

  const deliveryAgents = ["Deepak Sharma", "Sunil Kumar", "Meena Rathi"];

  const statusColors = {
    pending:
      "text-yellow-600 bg-yellow-100 dark:bg-yellow-800 dark:text-yellow-300",
    ongoing: "text-blue-600 bg-blue-100 dark:bg-blue-800 dark:text-blue-300",
    delivered:
      "text-green-600 bg-green-100 dark:bg-green-800 dark:text-green-300",
    cancelled: "text-red-600 bg-red-100 dark:bg-red-800 dark:text-red-300",
  };

  const filtered = orders.filter((o) => {
    const matchStatus = statusFilter ? o.status === statusFilter : true;
    const matchSearch =
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.restaurant.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

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
          <FaShoppingCart /> Manage Orders
        </h2>
        <div className="flex flex-wrap gap-2 sm:gap-4">
          <input
            type="text"
            placeholder="Search customer or restaurant"
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
            <option value="pending">Pending</option>
            <option value="ongoing">Ongoing</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white dark:bg-secondary rounded-xl shadow">
        <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800 text-sm">
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Restaurant</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Delivery Agent</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((order) => (
                <tr
                  key={order.id}
                  className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 even:bg-gray-50 dark:even:bg-secondary transition"
                >
                  <td className="px-4 py-3 font-medium">{order.customer}</td>
                  <td className="px-4 py-3">{order.restaurant}</td>
                  <td className="px-4 py-3 font-semibold">₹{order.total}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        statusColors[order.status]
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {order.delivery ? (
                      order.delivery
                    ) : (
                      <select className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800">
                        <option value="">Assign</option>
                        {deliveryAgents.map((agent, i) => (
                          <option key={i} value={agent}>
                            {agent}
                          </option>
                        ))}
                      </select>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="px-3 py-1 text-xs font-medium bg-primary text-white rounded hover:bg-orange-600 transition">
                      View
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
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default AdminOrders;
