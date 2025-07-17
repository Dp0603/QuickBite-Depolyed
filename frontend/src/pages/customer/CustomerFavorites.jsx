import React, { useEffect, useState, useContext } from "react";
import { FaHeartBroken } from "react-icons/fa";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";

const CustomerFavorites = () => {
  const { token } = useContext(AuthContext);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch favorites from backend
  const fetchFavorites = async () => {
    try {
      const res = await API.get("/favorites", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavorites(res.data.data);
    } catch (err) {
      console.error("❌ Failed to fetch favorites:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  // Remove from favorites
  const handleRemove = async (restaurantId) => {
    try {
      await API.delete(`/favorites/${restaurantId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavorites((prev) =>
        prev.filter((fav) => fav.restaurant._id !== restaurantId)
      );
    } catch (err) {
      console.error("❌ Failed to remove favorite:", err);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-gray-700 dark:text-white text-center">
        Loading your favorites...
      </div>
    );
  }

  return (
    <div className="p-6 text-gray-800 dark:text-white">
      <h1 className="text-3xl font-bold mb-6">❤️ Your Favorites</h1>

      {favorites.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          No favorites saved yet.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((fav) => (
            <div
              key={fav.restaurant._id}
              className="bg-white dark:bg-secondary rounded-xl shadow border dark:border-gray-700 overflow-hidden flex flex-col"
            >
              <img
                src={fav.restaurant.logoUrl || "/QuickBite.png"}
                alt={fav.restaurant.restaurantName}
                className="w-full h-40 object-cover"
              />
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-semibold mb-1">
                    {fav.restaurant.restaurantName}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    {fav.restaurant.cuisineType || "Cuisine"}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    {fav.restaurant.description || "No description"}
                  </p>
                  <p className="text-sm text-yellow-500 font-medium mb-4">
                    ⭐ {fav.restaurant.ratings?.toFixed(1) || "0.0"} / 5
                  </p>
                </div>

                <button
                  onClick={() => handleRemove(fav.restaurant._id)}
                  className="mt-auto bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-md flex items-center gap-2 transition"
                >
                  <FaHeartBroken />
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerFavorites;
