import React from "react";

export default function AdminManageRestaurants() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-green-800">Manage Restaurants</h2>
      <p className="mb-4 text-gray-700">Approve, edit, or remove restaurants from the platform.</p>
      {/* Table placeholder */}
      <div className="bg-white shadow rounded-lg p-4">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Owner</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2 px-4 border-b">Urban Bites</td>
              <td className="py-2 px-4 border-b">Alice Smith</td>
              <td className="py-2 px-4 border-b">Pending</td>
              <td className="py-2 px-4 border-b">
                <button className="bg-green-500 text-white px-2 py-1 rounded mr-2">Approve</button>
                <button className="bg-red-500 text-white px-2 py-1 rounded">Remove</button>
              </td>
            </tr>
            {/* More rows as needed */}
          </tbody>
        </table>
      </div>
    </div>
  );
}