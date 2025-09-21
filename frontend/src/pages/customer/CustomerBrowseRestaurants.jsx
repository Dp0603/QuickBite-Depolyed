import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import {
  FaStar,
  FaMapMarkerAlt,
  FaHeart,
  FaRegHeart,
  FaClock,
  FaUtensils,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import API from "../../api/axios";

const cuisinesList = [
  "Indian",
  "Chinese",
  "Italian",
  "Mexican",
  "American",
  "Thai",
  "Other",
];

const sortOptions = [
  { label: "Rating (High to Low)", value: "ratingDesc" },
  { label: "Rating (Low to High)", value: "ratingAsc" },
  { label: "Delivery Time (Fastest)", value: "timeAsc" },
  { label: "Delivery Time (Slowest)", value: "timeDesc" },
];

const PAGE_SIZE = 9;

const SkeletonCard = () => (
  <div className="bg-white dark:bg-secondary rounded-xl shadow-md animate-pulse h-72" />
);

const CustomerBrowseRestaurants = () => {
  const { user } = useContext(AuthContext);
  const userId = user?._id;
  const navigate = useNavigate();

  const [restaurants, setRestaurants] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingWishlist, setLoadingWishlist] = useState(false);
  const [updatingFav, setUpdatingFav] = useState(false);

  // Fetch restaurants
  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      try {
        const res = await API.get("/restaurants/restaurants");
        setRestaurants(res.data.restaurants);
      } catch (err) {
        console.error("❌ Error fetching restaurants:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  // Fetch wishlist
  useEffect(() => {
    if (!userId) return;
    setLoadingWishlist(true);
    API.get(`/favorites/favorites/${userId}`)
      .then((res) => {
        const ids = res.data.favorites.map((r) => r._id);
        setWishlist(ids);
      })
      .catch((err) => console.error("❌ Error fetching favorites:", err))
      .finally(() => setLoadingWishlist(false));
  }, [userId]);

  // Toggle cuisine multi-select
  const toggleCuisine = (cuisine) => {
    setPage(1);
    setSelectedCuisines((prev) =>
      prev.includes(cuisine)
        ? prev.filter((c) => c !== cuisine)
        : [...prev, cuisine]
    );
  };

  // Parse delivery time string to minutes
  const parseDeliveryTime = (str) => {
    if (!str) return null;
    const match = str.match(/(\d+)/g);
    if (!match) return null;
    return match.length >= 2
      ? (parseInt(match[0]) + parseInt(match[1])) / 2
      : parseInt(match[0]);
  };

  // Sort restaurants
  const sortRestaurants = (list) => {
    switch (sortBy) {
      case "ratingDesc":
        return [...list].sort(
          (a, b) => (b.averageRating || 0) - (a.averageRating || 0)
        );
      case "ratingAsc":
        return [...list].sort(
          (a, b) => (a.averageRating || 0) - (b.averageRating || 0)
        );
      case "timeAsc":
        return [...list].sort(
          (a, b) =>
            (a.deliveryTimeEstimateNum || 999) -
            (b.deliveryTimeEstimateNum || 999)
        );
      case "timeDesc":
        return [...list].sort(
          (a, b) =>
            (b.deliveryTimeEstimateNum || 0) - (a.deliveryTimeEstimateNum || 0)
        );
      default:
        return list;
    }
  };

  // Prepare filtered and paginated restaurants
  let filtered = restaurants
    .filter((r) => {
      if (selectedCuisines.length > 0) {
        if (!r.cuisineType) return false;
        if (!selectedCuisines.some((c) => r.cuisineType.includes(c)))
          return false;
      }
      const searchStr = `${r.name} ${r.addressId?.city || ""}`.toLowerCase();
      return searchStr.includes(search.toLowerCase());
    })
    .map((r) => ({
      ...r,
      deliveryTimeEstimateNum: parseDeliveryTime(r.deliveryTimeEstimate),
    }));

  filtered = sortRestaurants(filtered);

  const paginated = filtered.slice(0, PAGE_SIZE * page);
  const hasMore = paginated.length < filtered.length;

  // Toggle wishlist
  const toggleWishlist = async (restaurantId) => {
    if (!userId) {
      alert("Please log in to use favorites.");
      return;
    }
    if (!restaurantId) return;
    if (updatingFav) return;

    setUpdatingFav(true);
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
    } finally {
      setUpdatingFav(false);
    }
  };

  return (
    <motion.div
      className="px-4 sm:px-8 md:px-10 lg:px-12 py-8 text-gray-800 dark:text-white"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="text-3xl font-bold mb-2">🍽️ Discover Restaurants</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Find top-rated restaurants near you.
      </p>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <input
          type="text"
          placeholder="Search restaurants or location..."
          className="bg-white dark:bg-secondary shadow px-4 py-2 rounded-xl w-full sm:w-80 text-sm outline-none text-gray-700 dark:text-white"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          aria-label="Search restaurants or location"
        />

        <div className="flex flex-wrap gap-2 max-w-full sm:max-w-md overflow-x-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
          {cuisinesList.map((c) => {
            const isSelected = selectedCuisines.includes(c);
            return (
              <button
                key={c}
                onClick={() => toggleCuisine(c)}
                className={`px-4 py-1.5 rounded-full text-sm border whitespace-nowrap ${
                  isSelected
                    ? "bg-primary text-white border-primary"
                    : "bg-white dark:bg-secondary text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-700"
                } transition focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                aria-pressed={isSelected}
              >
                {c}
              </button>
            );
          })}
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-white dark:bg-secondary shadow px-4 py-2 rounded-xl text-sm text-gray-700 dark:text-white outline-none"
          aria-label="Sort restaurants"
        >
          <option value="">Sort by</option>
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Restaurant Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <SkeletonCard key={i} />
          ))
        ) : paginated.length > 0 ? (
          paginated.map((r) => {
            const isAvailable = r.isOnline && r.status === "approved";

            return (
              <motion.div
                key={r._id}
                onClick={() =>
                  isAvailable && navigate(`/customer/menu/restaurant/${r._id}`)
                }
                className={`cursor-pointer relative bg-white dark:bg-secondary rounded-xl overflow-hidden shadow-md hover:shadow-lg transition group ${
                  !isAvailable ? "opacity-50 cursor-not-allowed" : ""
                }`}
                tabIndex={0}
                role="button"
                aria-label={`View menu for ${r.name}`}
              >
                <div className="h-48 w-full overflow-hidden relative">
                  <img
                    src={r.logo || "/QuickBite.png"}
                    alt={r.name}
                    loading="lazy"
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Badges */}
                  {!isAvailable && (
                    <span className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs shadow-md">
                      Offline
                    </span>
                  )}
                  {r.isPopular && (
                    <span className="absolute top-3 right-3 bg-yellow-400 text-black px-2 py-1 rounded-full text-xs shadow-md mr-10">
                      Popular
                    </span>
                  )}

                  {/* Favorite button */}
                  <motion.div
                    className="absolute top-3 right-3 z-10"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!updatingFav) toggleWishlist(r._id);
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={
                      wishlist.includes(r._id)
                        ? `Remove ${r.name} from favorites`
                        : `Add ${r.name} to favorites`
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.stopPropagation();
                        if (!updatingFav) toggleWishlist(r._id);
                      }
                    }}
                  >
                    {wishlist.includes(r._id) ? (
                      <motion.div
                        key="filled"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                        }}
                        className="text-red-500 text-lg"
                      >
                        <FaHeart />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="empty"
                        initial={{ scale: 1 }}
                        animate={{ scale: 1 }}
                        whileHover={{ scale: 1.3, color: "#f59e0b" }}
                        className="text-white text-lg drop-shadow-md"
                      >
                        <FaRegHeart />
                      </motion.div>
                    )}
                  </motion.div>
                </div>

                <div className="p-4">
                  <h3
                    className="text-lg font-semibold truncate text-gray-800 dark:text-white"
                    title={r.name}
                  >
                    {r.name}
                  </h3>

                  <p
                    className="text-sm text-gray-500 dark:text-gray-300 flex items-center gap-1 mt-1 truncate"
                    title={`${r.addressId?.addressLine || "Unknown"}, ${
                      r.addressId?.city || "Unknown"
                    }`}
                  >
                    <FaMapMarkerAlt className="text-primary" />
                    {r.addressId?.addressLine || "Unknown"},{" "}
                    {r.addressId?.city || "Unknown"}
                  </p>

                  {r.topReview && (
                    <blockquote
                      className="mt-2 text-xs italic text-gray-600 dark:text-gray-400 line-clamp-2"
                      title={r.topReview.comment}
                    >
                      “{r.topReview.comment}”
                    </blockquote>
                  )}

                  <div className="flex justify-between items-center mt-3 text-sm">
                    <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <FaClock />
                      {r.deliveryTimeEstimate || "30–40 min"}
                      <FaUtensils className="ml-3" />
                      ₹20 delivery
                    </span>
                    <span className="flex items-center gap-1 bg-yellow-400 text-black px-2 py-0.5 rounded-full text-xs font-bold shadow">
                      <FaStar />
                      {r.averageRating?.toFixed(1) || "4.5"}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })
        ) : (
          <p className="text-gray-500 dark:text-gray-400 mt-12 text-center col-span-full">
            No restaurants found.
          </p>
        )}
      </div>

      {hasMore && !loading && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setPage((prev) => prev + 1)}
            className="px-6 py-2 bg-primary text-white rounded-xl shadow hover:bg-primary-dark transition focus:outline-none focus:ring-4 focus:ring-yellow-400"
          >
            Load More
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default CustomerBrowseRestaurants;
