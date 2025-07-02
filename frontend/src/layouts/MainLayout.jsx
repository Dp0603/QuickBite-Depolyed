import React from "react";
import { Link } from "react-router-dom";

export default function MainLayout({ children }) {
  return (
    <div className="w-full min-h-screen bg-gray-100">
      <nav className="flex items-center justify-between px-8 py-4 bg-white shadow">
        <Link to="/" className="text-2xl font-bold text-black">
          QuickBite
        </Link>
        <div className="space-x-4">
          <Link
            to="/login"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Register
          </Link>
        </div>
      </nav>
      <main className="flex justify-center items-center py-10 text-black">
        {children}
      </main>
    </div>
  );
}
