import React from "react";

const payouts = [
  { date: "July 7, 2025", amount: "₹12,500", status: "Completed" },
  { date: "July 1, 2025", amount: "₹9,700", status: "Completed" },
  { date: "June 25, 2025", amount: "₹10,300", status: "Pending" },
];

const RestaurantPayouts = () => {
  return (
    <div className="p-6 max-w-3xl">
      <h2 className="text-2xl font-bold mb-4">Payout History</h2>

      <table className="w-full table-auto bg-white dark:bg-gray-800 rounded shadow overflow-hidden">
        <thead className="bg-gray-100 dark:bg-gray-700 text-left">
          <tr>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Amount</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {payouts.map((p, i) => (
            <tr key={i} className="border-t dark:border-gray-700">
              <td className="px-4 py-3">{p.date}</td>
              <td className="px-4 py-3 font-medium">{p.amount}</td>
              <td
                className={`px-4 py-3 font-semibold ${
                  p.status === "Completed" ? "text-green-600" : "text-yellow-500"
                }`}
              >
                {p.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RestaurantPayouts;
