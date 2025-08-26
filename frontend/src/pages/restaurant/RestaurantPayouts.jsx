import React, { useEffect, useState, useContext } from "react";
import {
  FaMoneyCheckAlt,
  FaUniversity,
  FaRupeeSign,
  FaFileDownload,
} from "react-icons/fa";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const getStatusBadge = (status) => {
  const base = "inline-block px-3 py-1 rounded-full text-xs font-semibold";
  if (status === "Paid") return `${base} bg-green-100 text-green-700`;
  if (status === "Pending") return `${base} bg-yellow-100 text-yellow-700`;
  if (status === "Failed") return `${base} bg-red-100 text-red-700`;
  return `${base} bg-gray-100 text-gray-600`;
};

const RestaurantPayouts = () => {
  const { user, token } = useContext(AuthContext);
  const [payouts, setPayouts] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [bankDetails, setBankDetails] = useState(null);
  const [nextPayoutDate, setNextPayoutDate] = useState(null);

  // 📦 Fetch payouts + bank details
  const fetchPayouts = async () => {
    if (!user?._id) return;
    try {
      const res = await axios.get(`/api/payouts/payouts/payee/${user._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          fromDate: fromDate || undefined,
          toDate: toDate || undefined,
        },
      });

      setPayouts(res.data.payouts || []);
      setBankDetails(res.data.bankDetails || null);
      setNextPayoutDate(res.data.nextPayoutDate || null);
    } catch (err) {
      console.error("Failed to fetch payouts", err);
    }
  };

  useEffect(() => {
    fetchPayouts();
  }, [user, token]);

  const totalPaid = payouts
    .filter((p) => p.status === "Paid")
    .reduce((sum, p) => sum + (p.amount || p.payoutAmount || 0), 0);

  const handleDownloadInvoice = async (payoutId) => {
    try {
      const res = await axios.get(`/api/payouts/${payoutId}/invoice`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice_${payoutId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Failed to download invoice", err);
    }
  };

  return (
    <div className="px-6 py-8 min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-white">
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-3xl font-bold">💸 Payouts & Settlement</h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Last updated: {new Date().toLocaleString()}
          </span>
        </div>

        {/* Info Banner */}
        <div className="bg-accent dark:bg-orange-900/10 border-l-4 border-primary text-primary dark:text-orange-300 p-4 rounded-xl shadow">
          🔔 Your next payout is scheduled on{" "}
          {nextPayoutDate
            ? new Date(nextPayoutDate).toLocaleDateString()
            : "TBD"}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-secondary p-5 rounded-2xl shadow flex items-center gap-4">
            <FaRupeeSign className="text-2xl text-green-600" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Payouts
              </p>
              <h4 className="text-xl font-semibold">
                ₹{totalPaid.toLocaleString("en-IN")}
              </h4>
            </div>
          </div>

          <div className="bg-white dark:bg-secondary p-5 rounded-2xl shadow flex items-center gap-4">
            <FaUniversity className="text-2xl text-blue-500" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Bank Account
              </p>
              <h4 className="text-base font-medium">
                {bankDetails
                  ? `${
                      bankDetails.bankName
                    } — ****${bankDetails.accountNumber?.slice(-4)}`
                  : "Not Linked"}
              </h4>
            </div>
          </div>

          <div className="bg-white dark:bg-secondary p-5 rounded-2xl shadow flex items-center gap-4">
            <FaMoneyCheckAlt className="text-2xl text-yellow-500" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Next Payout
              </p>
              <h4 className="text-base font-medium">
                {nextPayoutDate
                  ? new Date(nextPayoutDate).toLocaleDateString()
                  : "Pending"}
              </h4>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">
              From
            </label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">
              To
            </label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
            />
          </div>
          <button
            onClick={fetchPayouts}
            className="bg-primary text-white px-5 py-2 rounded-xl text-sm hover:bg-orange-600 transition"
          >
            Apply Filter
          </button>
        </div>

        {/* Table */}
        <div className="rounded-xl shadow overflow-x-auto bg-white dark:bg-secondary">
          <table className="w-full text-sm min-w-[700px]">
            <thead className="bg-gray-100 dark:bg-gray-700 sticky top-0 z-10">
              <tr className="text-left text-gray-600 dark:text-gray-300">
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Amount</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payouts.length > 0 ? (
                payouts.map((p) => (
                  <tr
                    key={p._id}
                    className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      ₹
                      {(p.amount || p.payoutAmount || 0).toLocaleString(
                        "en-IN"
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={getStatusBadge(p.status)}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDownloadInvoice(p._id)}
                        className="flex items-center gap-2 text-primary hover:underline text-sm"
                      >
                        <FaFileDownload />
                        Invoice
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center py-6 text-gray-400 dark:text-gray-500"
                  >
                    No payouts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RestaurantPayouts;
