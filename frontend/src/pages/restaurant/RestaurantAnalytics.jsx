import React from "react";

const RestaurantAnalytics = () => {
  const stats = [
    { label: "Total Orders", value: 320 },
    { label: "Revenue This Month", value: "₹48,000" },
    { label: "Avg. Delivery Time", value: "32 min" },
    { label: "Customer Rating", value: "4.5/5" },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Analytics Overview</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow text-center"
          >
            <h4 className="text-xl font-semibold">{stat.value}</h4>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Placeholder chart */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow text-center text-gray-500 dark:text-gray-400">
        📊 Chart analytics (e.g., revenue over time, popular dishes) can go here.
      </div>
    </div>
  );
};

export default RestaurantAnalytics;
