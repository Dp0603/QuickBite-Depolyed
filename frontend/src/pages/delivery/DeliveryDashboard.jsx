import React from 'react';

function DeliveryDashboard() {
  // Placeholder data
  const deliveries = [
    { id: 1, order: 'Order #1023', status: 'Picked Up', address: '123 Main St', time: '12:30 PM' },
    { id: 2, order: 'Order #1024', status: 'Pending', address: '456 Oak Ave', time: '1:00 PM' },
    { id: 3, order: 'Order #1025', status: 'Delivered', address: '789 Pine Rd', time: '11:45 AM' },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-yellow-700">Delivery Agent Dashboard</h2>
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Today's Deliveries</h3>
        <table className="min-w-full bg-white shadow rounded-lg">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Order</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Address</th>
              <th className="py-2 px-4 border-b">Time</th>
            </tr>
          </thead>
          <tbody>
            {deliveries.map((d) => (
              <tr key={d.id}>
                <td className="py-2 px-4 border-b">{d.order}</td>
                <td className="py-2 px-4 border-b">{d.status}</td>
                <td className="py-2 px-4 border-b">{d.address}</td>
                <td className="py-2 px-4 border-b">{d.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4 text-yellow-700">Quick Actions</h3>
        <ul className="list-disc ml-6 text-gray-700">
          <li>Update order status</li>
          <li>View delivery history</li>
          <li>Contact support</li>
        </ul>
        <button className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700">
          Go to Deliveries
        </button>
      </div>
    </div>
  );
}

export default DeliveryDashboard;