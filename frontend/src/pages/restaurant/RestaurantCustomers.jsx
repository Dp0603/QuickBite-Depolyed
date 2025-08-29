import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const RestaurantCustomers = () => {
  // Dummy customer stats
  const totalCustomers = 320;
  const newCustomers = 120;
  const returningCustomers = 200;

  const customerChartData = {
    labels: ["New Customers", "Returning Customers"],
    datasets: [
      {
        data: [newCustomers, returningCustomers],
        backgroundColor: ["#3b82f6", "#10b981"],
      },
    ],
  };

  // Dummy top customers
  const topCustomers = [
    { name: "Amit Sharma", orders: 24 },
    { name: "Priya Verma", orders: 19 },
    { name: "Rahul Singh", orders: 15 },
  ];

  return (
    <div className="p-6 text-gray-800 dark:text-white max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">👥 Customers</h2>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-white dark:bg-secondary p-6 rounded-xl shadow text-center">
          <h4 className="text-2xl font-bold">{totalCustomers}</h4>
          <p className="text-gray-500 dark:text-gray-400">Total Customers</p>
        </div>
        <div className="bg-white dark:bg-secondary p-6 rounded-xl shadow text-center">
          <h4 className="text-2xl font-bold">{newCustomers}</h4>
          <p className="text-gray-500 dark:text-gray-400">New</p>
        </div>
        <div className="bg-white dark:bg-secondary p-6 rounded-xl shadow text-center">
          <h4 className="text-2xl font-bold">{returningCustomers}</h4>
          <p className="text-gray-500 dark:text-gray-400">Returning</p>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="bg-white dark:bg-secondary p-6 rounded-xl shadow mb-10">
        <h3 className="text-xl font-semibold mb-4">Customer Breakdown</h3>
        <Pie data={customerChartData} />
      </div>

      {/* Top Customers */}
      <div className="bg-white dark:bg-secondary p-6 rounded-xl shadow">
        <h3 className="text-xl font-semibold mb-4">Top Customers</h3>
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {topCustomers.map((c, i) => (
            <li key={i} className="flex justify-between py-3">
              <span>{c.name}</span>
              <span className="font-semibold">{c.orders} orders</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RestaurantCustomers;
