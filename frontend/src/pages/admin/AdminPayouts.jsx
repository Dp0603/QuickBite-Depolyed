import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaMoneyBillWave, FaCheck, FaClock, FaDownload } from "react-icons/fa";
import API from "../../api/axios";

const AdminPayouts = () => {
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  // 🧾 Fetch all payouts (Admin)
  useEffect(() => {
    const fetchPayouts = async () => {
      try {
        const { data } = await API.get("/payouts/payouts");
        setPayouts(data?.payouts || []);
      } catch (err) {
        console.error("❌ Error fetching payouts:", err);
        setError("Failed to load payouts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchPayouts();
  }, []);

  // 🪙 Update payout status (Mark Paid)
  const markAsPaid = async (id) => {
    try {
      await API.put(`/payouts/payouts/${id}`, {
        status: "paid",
        note: "Marked paid by admin manually",
      });
      setPayouts((prev) =>
        prev.map((p) =>
          p._id === id ? { ...p, status: "paid", processedAt: new Date() } : p
        )
      );
    } catch (err) {
      console.error("❌ Error updating payout status:", err);
      alert("Failed to update payout status.");
    }
  };

  // 📄 Download invoice PDF
  const downloadInvoice = async (id) => {
    try {
      const response = await API.get(`/payouts/payouts/invoice/${id}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `payout_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error("❌ Error downloading invoice:", err);
      alert("Failed to download invoice.");
    }
  };

  const filtered = payouts.filter((p) => {
    const matchStatus = statusFilter ? p.status === statusFilter : true;
    const matchSearch = p?.payeeId?.name
      ?.toLowerCase()
      .includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const statusStyles = {
    paid: "text-green-600 bg-green-100 dark:bg-green-800 dark:text-green-300",
    pending:
      "text-yellow-600 bg-yellow-100 dark:bg-yellow-800 dark:text-yellow-300",
    failed: "text-red-600 bg-red-100 dark:bg-red-800 dark:text-red-300",
  };

  // 🌀 Loading
  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 dark:text-gray-300 animate-pulse">
          Loading payouts...
        </p>
      </div>
    );

  // ⚠️ Error
  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );

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
            placeholder="Search restaurant or payee..."
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
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white dark:bg-secondary rounded-xl shadow">
        <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800 text-sm">
              <th className="px-4 py-3">Payee</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Processed</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((payout) => (
                <tr
                  key={payout._id}
                  className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 even:bg-gray-50 dark:even:bg-secondary transition"
                >
                  <td className="px-4 py-3 font-medium">
                    {payout?.payeeId?.name || "Unknown"}
                  </td>
                  <td className="px-4 py-3 capitalize">{payout.payeeType}</td>
                  <td className="px-4 py-3 font-semibold">
                    ₹{payout.payoutAmount?.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full font-medium ${
                        statusStyles[payout.status]
                      }`}
                    >
                      {payout.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                    {payout.processedAt
                      ? new Date(payout.processedAt).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="px-4 py-3 text-right flex justify-end gap-2">
                    {payout.status === "pending" ? (
                      <button
                        onClick={() => markAsPaid(payout._id)}
                        className="px-3 py-1 text-xs font-medium bg-primary text-white rounded hover:bg-orange-600 transition flex items-center gap-1"
                      >
                        <FaCheck /> Pay Now
                      </button>
                    ) : (
                      <button
                        onClick={() => downloadInvoice(payout._id)}
                        className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 dark:text-blue-300 rounded flex items-center gap-1"
                      >
                        <FaDownload /> Invoice
                      </button>
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
