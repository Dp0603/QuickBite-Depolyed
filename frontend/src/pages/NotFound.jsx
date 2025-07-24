import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const NotFound = () => {
  return (
    <div
      className="flex flex-col items-center justify-center h-screen bg-accent text-secondary text-center px-4 animate-fade-in"
      role="alert"
      aria-label="404 Page Not Found"
    >
      {/* SEO Meta */}
      <Helmet>
        <title>404 | Page Not Found - QuickBite</title>
        <meta
          name="description"
          content="Oops! The page you're looking for doesn't exist on QuickBite."
        />
      </Helmet>

      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-lg mb-6 max-w-md">
        Sorry, the page you're looking for doesn't exist or the link is broken.
      </p>
      <Link
        to="/"
        className="px-6 py-2 bg-primary text-white rounded-xl hover:bg-orange-600 transition"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
