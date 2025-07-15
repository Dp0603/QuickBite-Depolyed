import React, { useEffect, useState } from "react";
import { FaShoppingCart, FaRupeeSign, FaClock, FaStar } from "react-icons/fa";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import API from "../../api/axios";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const StatCard = ({ icon, value, label }) => (
  <div className="bg-white dark:bg-secondary p-5 rounded-lg shadow hover:shadow-md transition text-center">
    <div className="flex justify-center mb-2">{icon}</div>
    <h4 className="text-xl font-semibold text-gray-800 dark:text-white">
      {value}
    </h4>
    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{label}</p>
  </div>
);

const RestaurantAnalytics = () => {
  const [salesData, setSalesData] = useState([]);
  const [topDishes, setTopDishes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [salesRes, dishesRes] = await Promise.all([
          API.get("/restaurant/analytics/sales"),
          API.get("/restaurant/analytics/top-dishes"),
        ]);

        setSalesData(salesRes.data.data);
        setTopDishes(dishesRes.data.data);
      } catch (err) {
        console.error("Failed to fetch analytics", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const stats = [
    {
      label: "Total Orders (7d)",
      value: salesData.reduce((sum, d) => sum + d.revenue / 150, 0).toFixed(0),
      icon: <FaShoppingCart className="text-orange-500 text-xl" />,
    },
    {
      label: "Revenue (7d)",
      value: `₹${salesData
        .reduce((sum, d) => sum + d.revenue, 0)
        .toLocaleString()}`,
      icon: <FaRupeeSign className="text-green-600 text-xl" />,
    },
    {
      label: "Avg. Delivery Time",
      value: "32 min",
      icon: <FaClock className="text-blue-500 text-xl" />,
    },
    {
      label: "Customer Rating",
      value: "4.5 / 5",
      icon: <FaStar className="text-yellow-500 text-xl" />,
    },
  ];

  const chartData = {
    labels: salesData.map((d) => d.date.slice(5)), // show MM-DD
    datasets: [
      {
        label: "Revenue (₹)",
        data: salesData.map((d) => d.revenue),
        backgroundColor: "#f97316",
      },
    ],
  };

  return (
    <div className="p-6 text-gray-800 dark:text-white">
      <h2 className="text-2xl font-bold mb-6">📈 Analytics Overview</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="bg-white dark:bg-secondary p-6 rounded-lg shadow mb-10">
        <h3 className="text-lg font-semibold mb-4">Revenue (Last 7 Days)</h3>
        {loading ? (
          <p className="text-gray-400 text-sm">Loading chart...</p>
        ) : (
          <Bar data={chartData} options={{ responsive: true }} height={300} />
        )}
      </div>

      {/* Top Dishes */}
      <div className="bg-white dark:bg-secondary p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">
          Top 5 Best-Selling Dishes
        </h3>
        {topDishes.length === 0 ? (
          <p className="text-gray-400 text-sm">No data yet.</p>
        ) : (
          <ul className="space-y-2">
            {topDishes.map((dish, i) => (
              <li
                key={i}
                className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-2"
              >
                <span>{dish.name}</span>
                <span className="text-sm text-gray-500">
                  {dish.count} orders
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default RestaurantAnalytics;
