import React from "react";

export default function AdminViewReports() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-red-800">View Reports</h2>
      <p className="mb-4 text-gray-700">Review reported issues and take action.</p>
      {/* Reports Table Placeholder */}
      <div className="bg-white shadow rounded-lg p-4">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Report ID</th>
              <th className="py-2 px-4 border-b">Type</th>
              <th className="py-2 px-4 border-b">Details</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2 px-4 border-b">RPT-001</td>
              <td className="py-2 px-4 border-b">Order Issue</td>
              <td className="py-2 px-4 border-b">Late delivery reported by user.</td>
              <td className="py-2 px-4 border-b">Open</td>
              <td className="py-2 px-4 border-b">
                <button className="bg-blue-500 text-white px-2 py-1 rounded mr-2">Resolve</button>
                <button className="bg-gray-500 text-white px-2 py-1 rounded">Ignore</button>
              </td>
            </tr>
            {/* More rows as needed */}
          </tbody>
        </table>
      </div>
    </div>
  );
}