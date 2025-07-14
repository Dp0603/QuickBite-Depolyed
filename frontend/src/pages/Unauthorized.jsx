import React from "react";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-accent text-secondary animate-fade-in">
      <h1 className="text-5xl font-bold mb-4">🚫 Unauthorized</h1>
      <p className="text-lg mb-6">
        You do not have permission to access this page.
      </p>
      <Link
        to="/"
        className="px-6 py-2 bg-primary text-white rounded-xl hover:bg-orange-600 transition"
      >
        Go to Home
      </Link>
    </div>
  );
};

export default Unauthorized;
