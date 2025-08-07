import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { FaStar, FaMapMarkerAlt, FaHeart, FaRegHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext"; // ✅ Global auth context
import API from "../../api/axios"; // ✅ Custom Axios with token

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
  const { user } = useContext(AuthContext); // ✅ use global context
  const userId = user?._id;
  const navigate = useNavigate();

  const [restaurants, setRestaurants] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [search, setSearch] = useState("");
  const [cuisine, setCuisine] = useState("All");

  // 🍽️ Fetch all restaurants
  useEffect(() => {
    API.get("/restaurants/restaurants")
      .then((res) => setRestaurants(res.data.restaurants))
      .catch((err) => console.error("❌ Error fetching restaurants:", err));
  }, []);

  // ❤️ Fetch user's favorite restaurant IDs
  useEffect(() => {
    if (!userId) return;

    API.get(`/favorites/favorites/${userId}`)
      .then((res) => {
        const ids = res.data.favorites.map((r) => r._id);
        setWishlist(ids);
      })
      .catch((err) => console.error("❌ Error fetching favorites:", err));
  }, [userId]);

  // ❤️ Toggle favorite
  const toggleWishlist = async (restaurantId) => {
    if (!userId) {
      alert("Please log in to use favorites.");
      return;
    }

    const isFavorited = wishlist.includes(restaurantId);

    try {
      if (isFavorited) {
        await API.delete("/favorites/favorites", {
          data: { userId, restaurantId },
        });
        setWishlist((prev) => prev.filter((id) => id !== restaurantId));
      } else {
        await API.post("/favorites/favorites", { userId, restaurantId });
        setWishlist((prev) => [...prev, restaurantId]);
      }
    } catch (err) {
      console.error("❌ Error updating favorites:", err);
    }
  };

  // 🔎 Filter logic
  const filtered = restaurants.filter((r) => {
    const matchCuisine = cuisine === "All" || r.cuisineType?.includes(cuisine);
    const matchSearch = `${r.name} ${r.addressId?.city || ""}`
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchCuisine && matchSearch;
  });

  return (
    <motion.div
      className="px-4 sm:px-8 md:px-10 lg:px-12 py-8 text-gray-800 dark:text-white"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* 🧭 Header */}
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
              onClick={() => navigate(`/customer/menu/restaurant/${r._id}`)}
              className="cursor-pointer relative bg-white dark:bg-secondary rounded-xl overflow-hidden shadow-md hover:shadow-lg transition group"
            >
              <div className="h-48 w-full overflow-hidden">
                <img
                  src={r.logo || "/QuickBite.png"}
                  alt={r.name}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {r.isOpen && (
                <span className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs shadow-md">
                  Open Now
                </span>
              )}

              {/* ❤️ Favorite Button */}
              <div
                className="absolute top-3 right-3 z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWishlist(r._id);
                }}
              >
                {wishlist.includes(r._id) ? (
                  <FaHeart className="text-red-500 text-lg" />
                ) : (
                  <FaRegHeart className="text-white text-lg" />
                )}
              </div>

              <div className="p-4">
                <h3 className="text-lg font-semibold truncate text-gray-800 dark:text-white">
                  {r.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-300 flex items-center gap-1 mt-1 truncate">
                  <FaMapMarkerAlt className="text-primary" />
                  {r.addressId?.addressLine || "Unknown"}
                  {r.addressId?.city || "Unknown"}
                </p>

                <div className="flex justify-between items-center mt-3 text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    {r.deliveryTimeEstimate || "30–40 min"} • ₹20
                  </span>
                  <span className="flex items-center gap-1 bg-yellow-400 text-black px-2 py-0.5 rounded-full text-xs font-bold shadow">
                    <FaStar />
                    {r.averageRating?.toFixed(1) || "4.5"}
                  </span>
                </div>
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
