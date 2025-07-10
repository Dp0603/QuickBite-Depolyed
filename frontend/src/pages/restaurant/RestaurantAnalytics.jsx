import React from "react";
import { FaShoppingCart, FaRupeeSign, FaClock, FaStar } from "react-icons/fa";

const RestaurantAnalytics = () => {
  const stats = [
    {
      label: "Total Orders",
      value: 320,
      icon: <FaShoppingCart className="text-orange-500 text-xl" />,
    },
    {
      label: "Revenue This Month",
      value: "₹48,000",
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

  // ✅ Inline reusable stat card component
  const StatCard = ({ icon, value, label }) => (
    <div className="bg-white dark:bg-secondary p-5 rounded-lg shadow hover:shadow-md transition text-center">
      <div className="flex justify-center mb-2">{icon}</div>
      <h4 className="text-xl font-semibold text-gray-800 dark:text-white">
        {value}
      </h4>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{label}</p>
    </div>
  );

  return (
    <div className="p-6 text-gray-800 dark:text-white">
      <h2 className="text-2xl font-bold mb-6">📈 Analytics Overview</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      {/* Placeholder for chart section */}
      <div className="bg-white dark:bg-secondary p-6 rounded-lg shadow flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 h-64">
        <p className="text-lg">📊 Coming Soon</p>
        <p className="text-sm">Charts like revenue trends & top dishes</p>
      </div>
    </div>
  );
};

export default RestaurantAnalytics;
