import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaStar, FaMapMarkerAlt, FaHeart, FaRegHeart } from "react-icons/fa";

// 🥡 Dummy restaurant data
const dummyRestaurants = [
  {
    id: 1,
    name: "Spice Symphony",
    cuisine: "Indian",
    location: "MG Road",
    deliveryTime: "30–40 min",
    deliveryFee: "₹20",
    rating: 4.8,
    openNow: true,
    isTopRated: true,
    image: "/QuickBite.png", // 👈 relative to public/
  },
  {
    id: 2,
    name: "Dragon Bowl",
    cuisine: "Chinese",
    location: "BTM Layout",
    deliveryTime: "25–35 min",
    deliveryFee: "₹25",
    rating: 4.6,
    openNow: false,
    isTopRated: false,
    image: "/QuickBite.png",
  },
  {
    id: 3,
    name: "Pizza Paradise",
    cuisine: "Fast Food",
    location: "Koramangala",
    deliveryTime: "20–30 min",
    deliveryFee: "₹10",
    rating: 4.5,
    openNow: true,
    isTopRated: true,
    image: "/QuickBite.png",
  },
  {
    id: 4,
    name: "Sushi Central",
    cuisine: "Japanese",
    location: "Indiranagar",
    deliveryTime: "35–45 min",
    deliveryFee: "₹30",
    rating: 4.9,
    openNow: true,
    isTopRated: false,
    image: "/QuickBite.png",
  },
];

const cuisines = ["All", "Indian", "Chinese", "Fast Food", "Japanese"];

const CustomerBrowseRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState("");
  const [cuisine, setCuisine] = useState("All");
  const [wishlist, setWishlist] = useState([]);

  // Load dummy data
  useEffect(() => {
    setRestaurants(dummyRestaurants);
  }, []);

  // Filtered list
  const filtered = restaurants.filter((r) => {
    const matchCuisine = cuisine === "All" || r.cuisine === cuisine;
    const matchSearch = `${r.name} ${r.location}`
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchCuisine && matchSearch;
  });

  // Wishlist toggler
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
              key={r.id}
              className="relative bg-white dark:bg-secondary rounded-2xl overflow-hidden shadow hover:shadow-lg transition duration-300 group"
            >
              {/* 🖼️ Image */}
              <img
                src={r.image}
                alt={r.name}
                className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* 🏷️ Tags */}
              {r.openNow && (
                <span className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                  Open Now
                </span>
              )}
              {r.isTopRated && (
                <span className="absolute top-3 left-24 bg-blue-600 text-white px-2 py-1 rounded-full text-xs">
                  Top Rated
                </span>
              )}

              {/* ❤️ Wishlist */}
              <div
                className="absolute top-3 right-3 cursor-pointer"
                onClick={() => toggleWishlist(r.id)}
              >
                {wishlist.includes(r.id) ? (
                  <FaHeart className="text-red-500" />
                ) : (
                  <FaRegHeart className="text-white" />
                )}
              </div>

              {/* 📝 Details Overlay */}
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-4">
                <h3 className="text-lg font-bold text-white">{r.name}</h3>
                <p className="text-sm text-gray-200 flex items-center gap-1">
                  <FaMapMarkerAlt className="text-primary" />
                  {r.location}
                </p>
                <div className="text-sm text-gray-300">
                  {r.deliveryTime} • {r.deliveryFee}
                </div>
              </div>

              {/* ⭐ Rating */}
              <div className="absolute top-3 right-10 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-lg shadow">
                <FaStar className="inline mr-1" />
                {r.rating}
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
