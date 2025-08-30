import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  FaStar,
  FaClock,
  FaPlus,
  FaMinus,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";

const CustomerRestaurantMenu = () => {
  const { id: restaurantId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState({});
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteMenuItems, setFavoriteMenuItems] = useState([]);

  // 🍴 Fetch Restaurant & Menu
  useEffect(() => {
    const fetchRestaurantAndMenu = async () => {
      try {
        const [resRestaurant, resMenu] = await Promise.all([
          API.get(`/restaurants/restaurants/${restaurantId}`),
          API.get(`/menu/restaurant/${restaurantId}/menu`),
        ]);

        setRestaurant(resRestaurant.data.restaurant);
        setMenuItems(resMenu.data.menu || []);
      } catch (err) {
        console.error("❌ Failed to fetch restaurant or menu:", err);
      } finally {
        setLoading(false);
      }
    };

    if (restaurantId) fetchRestaurantAndMenu();
  }, [restaurantId]);

  // 📥 Fetch favorites
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user?._id) return;
      try {
        const [resRestaurants, resMenuItems] = await Promise.all([
          API.get(`/favorites/favorites/${user._id}`),
          API.get(`/favorites/favorites/menu/${user._id}`),
        ]);

        const favoriteRestaurantIds = resRestaurants.data.favorites.map(
          (r) => r._id
        );
        setIsFavorite(favoriteRestaurantIds.includes(restaurantId));

        const menuItemIds = resMenuItems.data.favorites.map((m) => m._id);
        setFavoriteMenuItems(menuItemIds);
      } catch (err) {
        console.error("❌ Error fetching favorites:", err);
      }
    };

    fetchFavorites();
  }, [user?._id, restaurantId]);

  // 🛒 Fetch Cart
  const fetchCart = async () => {
    if (!user?._id) return;

    try {
      const res = await API.get(`/cart/${user._id}/${restaurantId}`);
      const cartItems = res.data.cart.items || [];
      const newCart = {};

      cartItems.forEach((item) => {
        newCart[item.menuItem._id] = {
          quantity: item.quantity,
          item: item.menuItem,
        };
      });

      setCart(newCart);
    } catch (err) {
      console.error("❌ Failed to fetch cart:", err.response?.data || err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user?._id, restaurantId]);

  // ✅ Handle Add to Cart with restaurant switch check
  const handleAdd = async (itemId) => {
    if (!user?._id) return alert("Please login to add to cart.");

    // Check if cart has items from another restaurant
    const cartRestaurants = Object.values(cart).map((c) => c.item.restaurantId);
    if (cartRestaurants.length && !cartRestaurants.includes(restaurantId)) {
      if (
        !window.confirm(
          "Switching restaurants will clear your current cart. Proceed?"
        )
      ) {
        return;
      }
      // Clear previous cart
      try {
        await API.delete(`/cart/${user._id}/${cartRestaurants[0]}`);
        setCart({});
      } catch (err) {
        console.error(
          "❌ Failed to clear old cart:",
          err.response?.data || err
        );
        return;
      }
    }

    try {
      const quantity = (cart[itemId]?.quantity || 0) + 1;

      await API.post(`/cart/${user._id}/${restaurantId}/item/${itemId}`, {
        quantity,
      });
      fetchCart();
    } catch (err) {
      console.error("❌ Error adding to cart:", err.response?.data || err);
    }
  };

  const handleRemove = async (itemId) => {
    try {
      const currentQty = cart[itemId]?.quantity || 0;
      const newQty = currentQty - 1;

      if (newQty > 0) {
        await API.post(`/cart/${user._id}/${restaurantId}/item/${itemId}`, {
          quantity: newQty,
        });
      } else {
        await API.delete(`/cart/${user._id}/${restaurantId}/item/${itemId}`);
      }

      fetchCart();
    } catch (err) {
      console.error("❌ Error removing from cart:", err.response?.data || err);
    }
  };

  // ❤️ Toggle restaurant favorite
  const toggleFavorite = async () => {
    if (!user?._id) return alert("Please login to use favorites.");
    try {
      if (isFavorite) {
        await API.delete("/favorites/favorites", {
          data: { userId: user._id, restaurantId },
        });
      } else {
        await API.post("/favorites/favorites", {
          userId: user._id,
          restaurantId,
        });
      }
      setIsFavorite((prev) => !prev);
    } catch (err) {
      console.error("❌ Failed to toggle favorite:", err.response?.data || err);
    }
  };

  // ❤️ Toggle menu item favorite
  const toggleMenuItemFavorite = async (menuItemId) => {
    if (!user?._id) return alert("Please login to use favorites.");
    try {
      const isFav = favoriteMenuItems.includes(menuItemId);
      if (isFav) {
        await API.delete("/favorites/favorites/menu", {
          data: { userId: user._id, menuItemId },
        });
        setFavoriteMenuItems((prev) => prev.filter((id) => id !== menuItemId));
      } else {
        await API.post("/favorites/favorites/menu", {
          userId: user._id,
          menuItemId,
        });
        setFavoriteMenuItems((prev) => [...prev, menuItemId]);
      }
    } catch (err) {
      console.error(
        "❌ Failed to toggle menu item favorite:",
        err.response?.data || err
      );
    }
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="p-6 text-gray-800 dark:text-white max-w-6xl mx-auto">
      {/* 🍽️ Restaurant Info */}
      {restaurant && (
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-10">
          <img
            src={restaurant.logo || "/QuickBite.png"}
            alt="Logo"
            className="w-28 h-28 rounded-xl object-cover shadow-md"
          />
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold mb-1">{restaurant.name}</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
              {restaurant.description || "Delicious dishes available."}
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3 text-sm">
              <span className="flex items-center gap-1 text-green-600 font-medium">
                <FaStar /> {restaurant.averageRating || "4.2"}
              </span>
              <span className="flex items-center gap-1 text-yellow-600 font-medium">
                <FaClock /> {restaurant.deliveryTimeEstimate || "30 mins"}
              </span>
              <span className="text-gray-400">₹40 Delivery Fee</span>
            </div>
            <div className="mt-3">
              <button
                onClick={toggleFavorite}
                className={`text-sm font-medium px-3 py-1 rounded-full border transition ${
                  isFavorite
                    ? "bg-red-100 text-red-600 border-red-300 hover:bg-red-200"
                    : "bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200"
                }`}
              >
                {isFavorite
                  ? "❤️ Remove from Favorites"
                  : "🤍 Add to Favorites"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🧾 Menu Items */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.length ? (
          menuItems.map((item) => (
            <div
              key={item._id}
              className="p-4 bg-white dark:bg-secondary rounded-xl shadow-sm hover:shadow-md transition border dark:border-gray-700 flex flex-col"
            >
              <div className="relative">
                <img
                  src={item.image || "/QuickBite.png"}
                  alt={item.name}
                  className="w-full h-36 object-cover rounded-md mb-3"
                />
                <button
                  onClick={() => toggleMenuItemFavorite(item._id)}
                  className="absolute top-2 right-2 text-xl text-red-500 hover:scale-110 transition"
                >
                  {favoriteMenuItems.includes(item._id) ? (
                    <FaHeart />
                  ) : (
                    <FaRegHeart />
                  )}
                </button>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                  {item.description || "No description available."}
                </p>
              </div>
              <div className="flex justify-between items-center mt-4">
                <span className="text-primary text-lg font-bold">
                  ₹{item.price}
                </span>
                {cart[item._id] ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRemove(item._id)}
                      className="w-8 h-8 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-white rounded-full hover:bg-gray-300 dark:hover:bg-gray-500"
                    >
                      <FaMinus />
                    </button>
                    <span className="font-medium">
                      {cart[item._id]?.quantity}
                    </span>
                    <button
                      onClick={() => handleAdd(item._id)}
                      className="w-8 h-8 bg-primary text-white rounded-full hover:bg-orange-600"
                    >
                      <FaPlus />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleAdd(item._id)}
                    className="bg-primary hover:bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-medium transition"
                  >
                    Add
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500 dark:text-gray-400 mt-4">
            No menu items available.
          </p>
        )}
      </div>

      {/* 🛒 Floating Cart Summary */}
      {Object.keys(cart).length > 0 &&
        (() => {
          let totalItems = 0;
          let subtotal = 0;
          for (const { quantity, item } of Object.values(cart)) {
            totalItems += quantity;
            subtotal += item.price * quantity;
          }
          return (
            totalItems > 0 && (
              <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-primary text-white shadow-lg px-6 py-3 rounded-full flex items-center gap-6 z-50">
                <span>
                  🛒 {totalItems} item{totalItems > 1 ? "s" : ""} | ₹
                  {subtotal.toFixed(2)}
                </span>
                <button
                  onClick={() => navigate("/customer/cart")}
                  className="bg-white text-primary px-4 py-2 rounded-full text-sm font-semibold hover:bg-gray-100 transition"
                >
                  View Cart
                </button>
              </div>
            )
          );
        })()}
    </div>
  );
};

export default CustomerRestaurantMenu;
