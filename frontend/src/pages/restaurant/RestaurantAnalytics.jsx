import React, { useEffect, useState } from "react";
import { FaShoppingCart, FaRupeeSign, FaStar } from "react-icons/fa";
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
  <div className="bg-white dark:bg-secondary p-6 rounded-xl shadow hover:shadow-lg transition flex flex-col items-center justify-center text-center">
    <div className="text-3xl mb-3">{icon}</div>
    <h4 className="text-2xl font-bold text-gray-800 dark:text-white">
      {value}
    </h4>
    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{label}</p>
  </div>
);

const RestaurantAnalytics = () => {
  const [salesData, setSalesData] = useState([]);
  const [topDishes, setTopDishes] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch analytics from backend
  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const [salesRes, dishesRes, statsRes] = await Promise.all([
          API.get("/analytics/restaurant/sales-trends"), // ✅ correct
          API.get("/analytics/restaurant/top-dishes"), // ✅ correct
          API.get("/analytics/restaurant/overview"), // ✅ correct
        ]);

        setStats(statsRes.data.data || {});
        setSalesData(salesRes.data.data || []);
        setTopDishes(dishesRes.data.data || []);
      } catch (err) {
        console.error("Failed to fetch analytics", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const salesChartData = {
    labels: salesData.map((d) => d._id), // backend returns _id as date string (YYYY-MM-DD)
    datasets: [
      {
        label: "Revenue (₹)",
        data: salesData.map((d) => d.revenue),
        backgroundColor: "#f97316",
        borderRadius: 6,
        barThickness: 20,
      },
    ],
  };

  const topDishesChartData = {
    labels: topDishes.map((d) => d.name),
    datasets: [
      {
        label: "Orders",
        data: topDishes.map((d) => d.totalQuantity),
        backgroundColor: "#3b82f6",
        borderRadius: 6,
        barThickness: 20,
      },
    ],
  };

  const statCards = [
    {
      icon: <FaRupeeSign />,
      value: `₹${stats.totalRevenue || 0}`,
      label: "Total Revenue",
    },
    {
      icon: <FaShoppingCart />,
      value: stats.totalOrders || 0,
      label: "Total Orders",
    },
    {
      icon: <FaRupeeSign />,
      value: `₹${Math.round(stats.avgOrderValue || 0)}`,
      label: "Avg Order Value",
    },
    {
      icon: <FaStar />,
      value: stats.rating || 0,
      label: "Rating",
    },
  ];

  return (
    <div className="p-6 text-gray-800 dark:text-white max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">📊 Analytics Dashboard</h2>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-gray-100 dark:bg-gray-700 h-32 rounded-xl animate-pulse"
              />
            ))
          : statCards.map((stat, i) => (
              <StatCard
                key={i}
                icon={stat.icon}
                value={stat.value}
                label={stat.label}
              />
            ))}
      </div>

      {/* Revenue Chart */}
      <div className="bg-white dark:bg-secondary p-6 rounded-xl shadow mb-10">
        <h3 className="text-xl font-semibold mb-4">Revenue (Last 7 Days)</h3>
        {loading ? (
          <p className="text-gray-400 text-sm">Loading chart...</p>
        ) : (
          <Bar
            data={salesChartData}
            options={{ responsive: true }}
            height={300}
          />
        )}
      </div>

      {/* Top Dishes Chart */}
      <div className="bg-white dark:bg-secondary p-6 rounded-xl shadow mb-10">
        <h3 className="text-xl font-semibold mb-4">
          Top 5 Best-Selling Dishes
        </h3>
        {loading || topDishes.length === 0 ? (
          <p className="text-gray-400 text-sm">No data yet.</p>
        ) : (
          <Bar
            data={topDishesChartData}
            options={{ indexAxis: "y", responsive: true }}
            height={300}
          />
        )}
      </div>
    </div>
  );
};

export default RestaurantAnalytics;
