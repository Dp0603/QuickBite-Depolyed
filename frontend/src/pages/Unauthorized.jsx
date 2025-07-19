import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

const Unauthorized = () => {
  return (
    <div
      className="flex flex-col items-center justify-center h-screen bg-accent text-secondary text-center px-4 animate-fade-in"
      role="alert"
      aria-label="Unauthorized Access"
    >
      {/* SEO Meta */}
      <Helmet>
        <title>403 | Unauthorized - QuickBite</title>
        <meta
          name="description"
          content="You do not have permission to access this page on QuickBite."
        />
      </Helmet>

      <h1 className="text-5xl font-bold mb-4">🚫 Unauthorized</h1>
      <p className="text-lg mb-6 max-w-md">
        You don’t have permission to view this page. Please log in with an
        authorized account or go back to the homepage.
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
