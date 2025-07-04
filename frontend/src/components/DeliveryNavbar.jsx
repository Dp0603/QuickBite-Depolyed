import React from "react";
import { Link } from "react-router-dom";

export default function DeliveryNavbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white dark:bg-gray-900 shadow px-8 py-4 flex justify-between items-center">
      <Link to="/delivery" className="text-2xl font-bold text-primary">
        QuickBite Delivery
      </Link>
      <div className="space-x-4">
        <Link to="/delivery" className="text-primary font-medium hover:underline">Dashboard</Link>
        <Link to="/delivery/orders" className="text-primary font-medium hover:underline">My Deliveries</Link>
        <Link to="/delivery/profile" className="text-primary font-medium hover:underline">Profile</Link>
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