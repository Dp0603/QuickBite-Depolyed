import React, { useState } from "react";
import { FaBan, FaCheckCircle, FaFileExport } from "react-icons/fa";
import { motion } from "framer-motion";

const AdminUsers = () => {
  const users = [
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice@example.com",
      role: "customer",
      status: "active",
    },
    {
      id: 2,
      name: "Ravi Mehra",
      email: "ravi@example.com",
      role: "delivery",
      status: "banned",
    },
    {
      id: 3,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "customer",
      status: "active",
    },
    {
      id: 4,
      name: "Amit Patel",
      email: "amit@example.com",
      role: "delivery",
      status: "active",
    },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter ? user.role === roleFilter : true;

    return matchesSearch && matchesRole;
  });

  const getStatusColor = (status) => {
    return status === "active" ? "text-green-600" : "text-red-500";
  };

  return (
    <motion.div
      className="min-h-screen w-full bg-gray-50 dark:bg-gray-950 px-4 sm:px-8 md:px-10 lg:px-12 py-8 text-gray-800 dark:text-white"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header + Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold">👥 Manage Users</h2>
        <div className="flex flex-wrap gap-2 sm:gap-4">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 w-full sm:w-56 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-secondary text-sm"
          />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-secondary text-sm"
          >
            <option value="">All Roles</option>
            <option value="customer">Customer</option>
            <option value="delivery">Delivery</option>
          </select>
          <button className="px-4 py-2 bg-primary text-white rounded hover:bg-orange-600 text-sm flex items-center gap-2">
            <FaFileExport /> Export CSV
          </button>
        </div>
      </div>

      {/* User Table */}
      <div className="overflow-x-auto bg-white dark:bg-secondary rounded-xl shadow">
        <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800 text-sm">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 even:bg-gray-50 dark:even:bg-secondary transition"
                >
                  <td className="px-4 py-3 font-medium flex items-center gap-2">
                    <span
                      className={`inline-block w-2 h-2 rounded-full ${
                        user.status === "active" ? "bg-green-500" : "bg-red-500"
                      }`}
                    ></span>
                    {user.name}
                  </td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3 capitalize">
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded-full ${
                        user.role === "customer"
                          ? "bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-300"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-300"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td
                    className={`px-4 py-3 font-semibold ${getStatusColor(
                      user.status
                    )}`}
                  >
                    {user.status}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      className={`px-3 py-1 text-xs font-semibold rounded-md flex items-center gap-1 transition-all duration-200 ease-in-out cursor-pointer ${
                        user.status === "active"
                          ? "bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800"
                          : "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800"
                      }`}
                    >
                      {user.status === "active" ? <FaBan /> : <FaCheckCircle />}
                      {user.status === "active" ? "Ban" : "Unban"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-4 py-6 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination (Dummy) */}
      <div className="mt-6 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
        <p>
          Showing {filteredUsers.length} of {users.length} users
        </p>
        <div className="flex gap-2">
          <button className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600">
            Prev
          </button>
          <button className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600">
            Next
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminUsers;
