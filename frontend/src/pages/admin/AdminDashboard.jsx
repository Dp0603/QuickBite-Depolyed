import React from 'react';

function AdminDashboard() {
  // Placeholder data for demonstration
  const stats = [
    { label: 'Total Users', value: 1240 },
    { label: 'Restaurants', value: 87 },
    { label: 'Delivery Agents', value: 34 },
    { label: 'Active Orders', value: 56 },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-blue-800">Admin Dashboard</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white shadow rounded-lg p-4 flex flex-col items-center"
          >
            <span className="text-lg font-semibold text-gray-700">{stat.label}</span>
            <span className="text-2xl font-bold text-blue-600">{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Management Sections */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* User Management */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-blue-700">User Management</h3>
          <ul className="list-disc ml-6 text-gray-700">
            <li>View, edit, or remove users</li>
            <li>Assign roles (admin, restaurant, delivery, customer)</li>
            <li>Reset user passwords</li>
          </ul>
          <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Manage Users
          </button>
        </div>

        {/* Restaurant Management */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-blue-700">Restaurant Management</h3>
          <ul className="list-disc ml-6 text-gray-700">
            <li>Approve or reject new restaurants</li>
            <li>View restaurant details and menus</li>
            <li>Handle restaurant issues</li>
          </ul>
          <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            Manage Restaurants
          </button>
        </div>

        {/* Delivery Agent Management */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-blue-700">Delivery Agent Management</h3>
          <ul className="list-disc ml-6 text-gray-700">
            <li>View and verify delivery agents</li>
            <li>Assign or remove agents</li>
            <li>Track agent performance</li>
          </ul>
          <button className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700">
            Manage Delivery Agents
          </button>
        </div>

        {/* Order Management */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-blue-700">Order Management</h3>
          <ul className="list-disc ml-6 text-gray-700">
            <li>View all orders</li>
            <li>Update order status</li>
            <li>Handle order disputes</li>
          </ul>
          <button className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
            Manage Orders
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;