import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaStar, FaMapMarkerAlt, FaHeart, FaRegHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const cuisines = [
  "All",
  "Indian",
  "Chinese",
  "Italian",
  "Mexican",
  "American",
  "Thai",
  "Other",
];

const CustomerBrowseRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState("");
  const [cuisine, setCuisine] = useState("All");
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  // 🧲 Fetch from backend
  useEffect(() => {
    axios
      .get("/api/restaurant/public/restaurants")
      .then((res) => setRestaurants(res.data.data))
      .catch((err) => console.error("❌ Error fetching restaurants:", err));
  }, []);

  // 💾 Load wishlist from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(saved);
  }, []);

  // 💾 Save wishlist to localStorage
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const filtered = restaurants.filter((r) => {
    const matchCuisine = cuisine === "All" || r.cuisine === cuisine;
    const matchSearch = `${r.restaurantName} ${r.address?.city || ""}`
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchCuisine && matchSearch;
  });

  const toggleWishlist = (id) =>
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );

  return (
    <motion.div
      className="px-4 sm:px-8 md:px-10 lg:px-12 py-8 text-gray-800 dark:text-white"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* 🧭 Heading */}
      <h1 className="text-3xl font-bold mb-2">🍽️ Discover Restaurants</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Find top-rated restaurants near you.
      </p>

      {/* 🔍 Search & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <input
          type="text"
          placeholder="Search restaurants or location..."
          className="bg-white dark:bg-secondary shadow px-4 py-2 rounded-xl w-full sm:w-80 text-sm outline-none text-gray-700 dark:text-white"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="flex flex-wrap gap-2">
          {cuisines.map((c) => (
            <button
              key={c}
              onClick={() => setCuisine(c)}
              className={`px-4 py-1.5 rounded-full text-sm border ${
                cuisine === c
                  ? "bg-primary text-white border-primary"
                  : "bg-white dark:bg-secondary text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-700"
              } transition`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* 🍱 Restaurant Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filtered.length > 0 ? (
          filtered.map((r) => (
            <div
              key={r._id}
              onClick={() => navigate(`/restaurant/${r._id}/menu`)}
              className="cursor-pointer relative bg-white dark:bg-secondary rounded-2xl overflow-hidden shadow hover:shadow-lg transition duration-300 group"
            >
              {/* 🖼️ Image */}
              <img
                src={r.logoUrl || "/QuickBite.png"}
                alt={r.restaurantName}
                className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* 🏷️ Tags */}
              {r.isOpen && (
                <span className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                  Open Now
                </span>
              )}

              {/* ❤️ Wishlist */}
              <div
                className="absolute top-3 right-3 z-10"
                onClick={(e) => {
                  e.stopPropagation(); // prevent redirect
                  toggleWishlist(r._id);
                }}
              >
                {wishlist.includes(r._id) ? (
                  <FaHeart className="text-red-500" />
                ) : (
                  <FaRegHeart className="text-white" />
                )}
              </div>

              {/* 📝 Details Overlay */}
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-4">
                <h3 className="text-lg font-bold text-white">
                  {r.restaurantName}
                </h3>
                <p className="text-sm text-gray-200 flex items-center gap-1">
                  <FaMapMarkerAlt className="text-primary" />
                  {r.address?.city || "Unknown"}
                </p>
                <div className="text-sm text-gray-300">
                  30–40 min • ₹20 {/* Optional: static */}
                </div>
              </div>

              {/* ⭐ Rating */}
              <div className="absolute top-3 right-10 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-lg shadow">
                <FaStar className="inline mr-1" />
                {r.ratings?.toFixed(1) || "4.5"}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400 mt-12 text-center col-span-full">
            No restaurants found.
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default CustomerBrowseRestaurants;
