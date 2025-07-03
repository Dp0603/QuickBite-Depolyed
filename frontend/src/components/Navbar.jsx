// src/components/Navbar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem("token");

  const isPublicPage = ["/", "/login", "/register"].includes(location.pathname);

  if (!isPublicPage && isLoggedIn) return null;

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-[2px] bg-white/15 dark:bg-black/15 shadow-sm px-6 sm:px-8 py-4 flex justify-between items-center">
      {/* Logo and Brand */}
      <Link
        to="/"
        className="flex items-center gap-2 text-xl font-bold text-primary bg-white/80 dark:bg-gray-900/70 px-3 py-1 rounded-full shadow-sm border border-white/30 dark:border-gray-700 transition"
      >
        <img
          src="/QuickBite.png"
          alt="QuickBite Logo"
          className="w-7 h-7 rounded-full object-cover"
          onError={(e) => (e.target.style.display = "none")}
        />
        QuickBite
      </Link>

      {/* Navigation Links */}
      <div className="flex flex-wrap gap-3">
        {location.pathname === "/" && (
          <>
            <Link
              to="/login"
              className="text-sm font-medium px-3 py-1 rounded-full border border-white/30 dark:border-gray-700 bg-white/80 dark:bg-gray-900/70 text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-800 transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-sm font-medium px-3 py-1 rounded-full border border-white/30 dark:border-gray-700 bg-white/80 dark:bg-gray-900/70 text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-800 transition"
            >
              Register
            </Link>
          </>
        )}

        {location.pathname === "/login" && (
          <>
            <Link
              to="/"
              className="text-sm font-medium px-3 py-1 rounded-full border border-white/30 dark:border-gray-700 bg-white/80 dark:bg-gray-900/70 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              Back to Home
            </Link>
            <Link
              to="/register"
              className="text-sm font-medium px-3 py-1 rounded-full border border-white/30 dark:border-gray-700 bg-white/80 dark:bg-gray-900/70 text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-800 transition"
            >
              Register
            </Link>
          </>
        )}

        {location.pathname === "/register" && (
          <>
            <Link
              to="/"
              className="text-sm font-medium px-3 py-1 rounded-full border border-white/30 dark:border-gray-700 bg-white/80 dark:bg-gray-900/70 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              Back to Home
            </Link>
            <Link
              to="/login"
              className="text-sm font-medium px-3 py-1 rounded-full border border-white/30 dark:border-gray-700 bg-white/80 dark:bg-gray-900/70 text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-800 transition"
            >
              Login
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
