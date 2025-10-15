import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaExclamationTriangle,
  FaCheck,
  FaTrash,
  FaSpinner,
} from "react-icons/fa";
import API from "../../api/axios"; // ✅ your existing axios helper

const AdminComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  // ✅ Fetch complaints (help tickets) from backend
  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/complaints");
      setComplaints(res.data.data || res.data || []); // flexible parsing
    } catch (error) {
      console.error("Error fetching complaints:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Update complaint status (Mark as resolved)
  const handleResolve = async (ticketId) => {
    try {
      setActionLoading(ticketId);
      await API.put(`/admin/complaints/${ticketId}/status`, {
        status: "resolved",
      });
      fetchComplaints();
    } catch (error) {
      console.error("Error updating complaint:", error);
    } finally {
      setActionLoading(null);
    }
  };

  // ✅ Delete complaint (if admin wants)
  const handleDelete = async (ticketId) => {
    if (!window.confirm("Are you sure you want to delete this ticket?")) return;
    try {
      setActionLoading(ticketId);
      await API.delete(`/admin/complaints/${ticketId}`);
      setComplaints((prev) => prev.filter((c) => c._id !== ticketId));
    } catch (error) {
      console.error("Error deleting complaint:", error);
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // ✅ Filter by search
  const filtered = complaints.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.issue?.toLowerCase().includes(search.toLowerCase()) ||
      c.message?.toLowerCase().includes(search.toLowerCase()) ||
      c.status?.toLowerCase().includes(search.toLowerCase())
  );

  const statusColors = {
    pending: "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-300",
    "in-progress":
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-300",
    resolved:
      "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-300",
    closed: "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
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
          <FaExclamationTriangle /> Complaints & Help Tickets
        </h2>
        <input
          type="text"
          placeholder="Search name, issue, or status"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 w-full sm:w-64 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-secondary text-sm"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white dark:bg-secondary rounded-xl shadow">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <FaSpinner className="animate-spin text-xl text-gray-500" />
          </div>
        ) : (
          <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800 text-sm">
                <th className="px-4 py-3">Ticket ID</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Issue</th>
                <th className="px-4 py-3">Message</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((c) => (
                  <tr
                    key={c._id}
                    className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 even:bg-gray-50 dark:even:bg-secondary transition"
                  >
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">
                      {c.ticketId}
                    </td>
                    <td className="px-4 py-3 font-medium">{c.name}</td>
                    <td className="px-4 py-3 capitalize">{c.issue}</td>
                    <td className="px-4 py-3 truncate max-w-xs">{c.message}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                          statusColors[c.status] || ""
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right flex justify-end gap-2">
                      {c.status !== "resolved" && (
                        <button
                          onClick={() => handleResolve(c.ticketId)}
                          disabled={actionLoading === c.ticketId}
                          className="px-3 py-1 text-xs font-medium bg-primary text-white rounded hover:bg-orange-600 transition flex items-center gap-1 disabled:opacity-50"
                        >
                          {actionLoading === c.ticketId ? (
                            <FaSpinner className="animate-spin" />
                          ) : (
                            <FaCheck />
                          )}
                          Resolve
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(c._id)}
                        disabled={actionLoading === c._id}
                        className="px-3 py-1 text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 dark:text-red-300 rounded flex items-center gap-1 disabled:opacity-50"
                      >
                        {actionLoading === c._id ? (
                          <FaSpinner className="animate-spin" />
                        ) : (
                          <FaTrash />
                        )}
                        Delete
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
                    No complaints found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </motion.div>
  );
};

export default AdminComplaints;
