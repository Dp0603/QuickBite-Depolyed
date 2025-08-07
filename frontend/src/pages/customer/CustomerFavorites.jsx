import React, { useEffect, useState, useContext } from "react";
import { FaHeartBroken } from "react-icons/fa";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";

const CustomerFavorites = () => {
  const { user } = useContext(AuthContext);
  const [tab, setTab] = useState("restaurants"); // 'restaurants' or 'menu'
  const [restaurantFavorites, setRestaurantFavorites] = useState([]);
  const [menuFavorites, setMenuFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch both types of favorites
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const [restaurantRes, menuRes] = await Promise.all([
          API.get(`/favorites/favorites/${user._id}`),
          API.get(`/favorites/favorites/menu/${user._id}`),
        ]);

        setRestaurantFavorites(restaurantRes.data.favorites || []);
        setMenuFavorites(menuRes.data.favorites || []);
      } catch (err) {
        console.error("❌ Error fetching favorites:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) fetchFavorites();
  }, [user?._id]);

  // Remove restaurant
  const handleRemoveRestaurant = async (restaurantId) => {
    try {
      await API.delete("/favorites/favorites", {
        data: {
          userId: user._id,
          restaurantId,
        },
      });

      setRestaurantFavorites((prev) =>
        prev.filter((r) => r._id !== restaurantId)
      );
    } catch (err) {
      console.error("❌ Failed to remove restaurant:", err);
    }
  };

  // Remove menu item
  const handleRemoveMenu = async (menuItemId) => {
    try {
      await API.delete("/favorites/favorites/menu", {
        data: {
          userId: user._id,
          menuItemId,
        },
      });

      setMenuFavorites((prev) => prev.filter((m) => m._id !== menuItemId));
    } catch (err) {
      console.error("❌ Failed to remove menu item:", err);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-700 dark:text-white">
        Loading your favorites...
      </div>
    );
  }

  return (
    <div className="p-6 text-gray-800 dark:text-white">
      <h1 className="text-3xl font-bold mb-6">❤️ Your Favorites</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded-md ${
            tab === "restaurants"
              ? "bg-primary text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
          }`}
          onClick={() => setTab("restaurants")}
        >
          Restaurants
        </button>
        <button
          className={`px-4 py-2 rounded-md ${
            tab === "menu"
              ? "bg-primary text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
          }`}
          onClick={() => setTab("menu")}
        >
          Menu Items
        </button>
      </div>

      {/* Content */}
      {tab === "restaurants" ? (
        restaurantFavorites.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            No favorite restaurants yet.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {restaurantFavorites.map((restaurant) => (
              <div
                key={restaurant._id}
                className="bg-white dark:bg-secondary rounded-xl shadow border dark:border-gray-700 overflow-hidden flex flex-col"
              >
                <img
                  src={restaurant.logo || "/QuickBite.png"}
                  alt={restaurant.name}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="text-xl font-semibold mb-1">
                      {restaurant.name}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      {restaurant.cuisine || "Cuisine Type"}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      {restaurant.description || "No description"}
                    </p>
                    <p className="text-sm text-yellow-500 font-medium mb-4">
                      ⭐ {restaurant.averageRating?.toFixed(1) || "4.0"} / 5
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveRestaurant(restaurant._id)}
                    className="mt-auto bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-md flex items-center gap-2 transition"
                  >
                    <FaHeartBroken />
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : menuFavorites.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          No favorite menu items yet.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {menuFavorites.map((item) => (
            <div
              key={item._id}
              className="bg-white dark:bg-secondary rounded-xl shadow border dark:border-gray-700 overflow-hidden flex flex-col"
            >
              <img
                src={item.image || "/QuickBite.png"}
                alt={item.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-semibold mb-1">{item.name}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    {item.category}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    {item.description || "No description"}
                  </p>
                  <p className="text-sm text-green-600 font-medium mb-4">
                    ₹ {item.price}
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveMenu(item._id)}
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
