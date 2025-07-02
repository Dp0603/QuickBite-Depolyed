import React from "react";

export default function AdminSiteAnalytics() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-purple-800">Site Analytics</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white shadow rounded-lg p-4 flex flex-col items-center">
          <span className="text-lg font-semibold text-gray-700">Total Users</span>
          <span className="text-2xl font-bold text-blue-600">1240</span>
        </div>
        <div className="bg-white shadow rounded-lg p-4 flex flex-col items-center">
          <span className="text-lg font-semibold text-gray-700">Orders Today</span>
          <span className="text-2xl font-bold text-green-600">87</span>
        </div>
        <div className="bg-white shadow rounded-lg p-4 flex flex-col items-center">
          <span className="text-lg font-semibold text-gray-700">Active Restaurants</span>
          <span className="text-2xl font-bold text-orange-600">34</span>
        </div>
        <div className="bg-white shadow rounded-lg p-4 flex flex-col items-center">
          <span className="text-lg font-semibold text-gray-700">Revenue</span>
          <span className="text-2xl font-bold text-purple-600">₹1,20,000</span>
        </div>
      </div>
      <div className="bg-white shadow rounded-lg p-6 mt-8">
        <h3 className="text-xl font-semibold mb-4 text-purple-700">Trends</h3>
        <p className="text-gray-700">Analytics charts and graphs will appear here.</p>
      </div>
    </div>
  );
}