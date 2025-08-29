import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const RestaurantSalesTrends = () => {
  // Dummy sales trend data
  const salesTrendData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Revenue (₹)",
        data: [1200, 1900, 1500, 2200, 2800, 3000, 2500],
        borderColor: "#f97316",
        backgroundColor: "rgba(249, 115, 22, 0.2)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  return (
    <div className="p-6 text-gray-800 dark:text-white max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">📈 Sales Trends</h2>

      <div className="bg-white dark:bg-secondary p-6 rounded-xl shadow">
        <h3 className="text-xl font-semibold mb-4">Weekly Revenue</h3>
        <Line
          data={salesTrendData}
          options={{ responsive: true }}
          height={300}
        />
      </div>
    </div>
  );
};

export default RestaurantSalesTrends;
