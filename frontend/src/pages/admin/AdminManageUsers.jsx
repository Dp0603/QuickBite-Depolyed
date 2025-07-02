import React from "react";

export default function AdminManageUsers() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-blue-800">Manage Users</h2>
      <p className="mb-4 text-gray-700">View, edit, or remove users from the platform.</p>
      {/* Table placeholder */}
      <div className="bg-white shadow rounded-lg p-4">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Email</th>
              <th className="py-2 px-4 border-b">Role</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2 px-4 border-b">John Doe</td>
              <td className="py-2 px-4 border-b">john@example.com</td>
              <td className="py-2 px-4 border-b">customer</td>
              <td className="py-2 px-4 border-b">
                <button className="bg-blue-500 text-white px-2 py-1 rounded mr-2">Edit</button>
                <button className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
              </td>
            </tr>
            {/* More rows as needed */}
          </tbody>
        </table>
      </div>
    </div>
  );
}