import React from "react";
import { Link } from "react-router-dom";

export default function RestaurantNavbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white dark:bg-gray-900 shadow px-8 py-4 flex justify-between items-center">
      <Link to="/restaurant" className="text-2xl font-bold text-primary">
        QuickBite Restaurant
      </Link>
      <div className="space-x-4">
        <Link to="/restaurant" className="text-primary font-medium hover:underline">Dashboard</Link>
        <Link to="/restaurant/menu" className="text-primary font-medium hover:underline">Menu</Link>
        <Link to="/restaurant/orders" className="text-primary font-medium hover:underline">Orders</Link>
        <Link to="/restaurant/profile" className="text-primary font-medium hover:underline">Profile</Link>
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