import React from 'react';

function CustomerDashboard() {
  // Placeholder data
  const orders = [
    { id: 1, restaurant: 'Pizza Place', item: 'Pepperoni Pizza', status: 'On the way', time: '12:40 PM' },
    { id: 2, restaurant: 'Burger Joint', item: 'Cheese Burger', status: 'Delivered', time: '11:20 AM' },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-blue-800">Customer Dashboard</h2>
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Your Recent Orders</h3>
        <table className="min-w-full bg-white shadow rounded-lg">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Restaurant</th>
              <th className="py-2 px-4 border-b">Item</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Time</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td className="py-2 px-4 border-b">{o.restaurant}</td>
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
          <h3 className="text-xl font-semibold mb-4 text-blue-700">Quick Actions</h3>
          <ul className="list-disc ml-6 text-gray-700">
            <li>Browse restaurants and menus</li>
            <li>Add items to cart and place new orders</li>
            <li>Track your current orders</li>
          </ul>
          <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Order Food
          </button>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-blue-700">Feedback & Reviews</h3>
          <ul className="list-disc ml-6 text-gray-700">
            <li>Rate your orders</li>
            <li>Write reviews for restaurants</li>
            <li>View your review history</li>
          </ul>
          <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Give Feedback
          </button>
        </div>
      </div>
    </div>
  );
}

export default CustomerDashboard;