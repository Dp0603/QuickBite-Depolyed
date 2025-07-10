import React from "react";
import { FaClipboardList } from "react-icons/fa";

const history = [
  {
    id: "ORD1221",
    date: "Jul 8, 2025",
    customer: "Anjali Sharma",
    earnings: "₹90",
  },
  {
    id: "ORD1220",
    date: "Jul 8, 2025",
    customer: "Tarun Patel",
    earnings: "₹70",
  },
  {
    id: "ORD1219",
    date: "Jul 7, 2025",
    customer: "Neha Verma",
    earnings: "₹110",
  },
];

const DeliveryHistory = () => {
  const totalEarnings = history.reduce(
    (sum, item) => sum + parseInt(item.earnings.replace("₹", "")),
    0
  );

  return (
    <div className="p-6 text-gray-800 dark:text-white">
      {/* Header with Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FaClipboardList className="text-primary" />
          Delivery History
        </h2>

        <button
          className="text-sm bg-primary text-white px-4 py-2 rounded hover:bg-orange-600 transition cursor-not-allowed opacity-80"
          title="Export to CSV (coming soon)"
          disabled
        >
          Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl shadow bg-white dark:bg-secondary">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase text-xs tracking-wider">
            <tr>
              <th className="px-5 py-3 whitespace-nowrap">Order ID</th>
              <th className="px-5 py-3 whitespace-nowrap">Date</th>
              <th className="px-5 py-3 whitespace-nowrap">Customer</th>
              <th className="px-5 py-3 whitespace-nowrap text-right">
                Earnings
              </th>
            </tr>
          </thead>
          <tbody>
            {history.map((item, index) => (
              <tr
                key={item.id}
                className={`transition hover:bg-orange-50 dark:hover:bg-orange-600/20 cursor-pointer ${
                  index % 2 === 0
                    ? "bg-white dark:bg-secondary"
                    : "bg-gray-50 dark:bg-gray-800"
                }`}
              >
                <td className="px-5 py-3 font-mono font-medium text-sm">
                  {item.id}
                </td>
                <td className="px-5 py-3 text-sm text-gray-500 dark:text-gray-300">
                  {item.date}
                </td>
                <td className="px-5 py-3 text-sm">{item.customer}</td>
                <td className="px-5 py-3 text-sm text-right font-semibold text-green-600">
                  {item.earnings}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Scroll Hint (for mobile) */}
      <div className="text-xs text-gray-400 mt-2 sm:hidden text-center">
        Swipe → to scroll the table
      </div>

      {/* Total Earnings */}
      <div className="mt-5 text-right text-sm font-medium text-gray-600 dark:text-gray-300">
        Total Earnings:{" "}
        <span className="text-green-600 font-bold">₹{totalEarnings}</span>
      </div>
    </div>
  );
};

export default DeliveryHistory;
