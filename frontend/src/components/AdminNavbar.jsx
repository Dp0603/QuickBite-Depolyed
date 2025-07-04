import React from "react";
import { Link } from "react-router-dom";

export default function AdminNavbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white dark:bg-gray-900 shadow px-8 py-4 flex justify-between items-center">
      <Link to="/admin" className="text-2xl font-bold text-primary">
        QuickBite Admin
      </Link>
      <div className="space-x-4">
        <Link to="/admin" className="text-primary font-medium hover:underline">Dashboard</Link>
        <Link to="/admin/users" className="text-primary font-medium hover:underline">Users</Link>
        <Link to="/admin/restaurants" className="text-primary font-medium hover:underline">Restaurants</Link>
        <Link to="/admin/analytics" className="text-primary font-medium hover:underline">Analytics</Link>
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}
          className="text-red-500 font-medium hover:underline"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}