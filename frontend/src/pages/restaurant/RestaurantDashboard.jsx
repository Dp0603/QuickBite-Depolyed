import React from 'react';

function RestaurantDashboard() {
  // Placeholder data
  const orders = [
    { id: 1, customer: 'Alice', item: 'Pizza', status: 'Pending', time: '12:15 PM' },
    { id: 2, customer: 'Bob', item: 'Burger', status: 'Preparing', time: '12:30 PM' },
    { id: 3, customer: 'Charlie', item: 'Pasta', status: 'Completed', time: '11:50 AM' },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-green-800">Restaurant Dashboard</h2>
      <p className="mb-4 text-gray-700">Welcome! Manage your restaurant, menu, and orders here.</p>
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Recent Orders</h3>
        <table className="min-w-full bg-white shadow rounded-lg">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Customer</th>
              <th className="py-2 px-4 border-b">Item</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Time</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td className="py-2 px-4 border-b">{o.customer}</td>
                <td className="py-2 px-4 border-b">{o.item}</td>
                <td className="py-2 px-4 border-b">{o.status}</td>
                <td className="py-2 px-4 border-b">{o.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-green-700">Menu Management</h3>
          <ul className="list-disc ml-6 text-gray-700">
            <li>Add, edit, or remove menu items</li>
            <li>Update item availability</li>
            <li>View menu analytics</li>
          </ul>
          <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            Manage Menu
          </button>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-green-700">Order Management</h3>
          <ul className="list-disc ml-6 text-gray-700">
            <li>View and update order status</li>
            <li>Assign orders to delivery agents</li>
            <li>Handle customer queries</li>
          </ul>
          <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            Manage Orders
          </button>
        </div>
      </div>
    </div>
  );
}

export default RestaurantDashboard;