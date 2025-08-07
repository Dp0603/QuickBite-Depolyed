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
  const [menuLoaded, setMenuLoaded] = useState(false);
  const [cartLoaded, setCartLoaded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteMenuItems, setFavoriteMenuItems] = useState([]); // 🍽️ Menu item favorites

  // 🍴 Fetch Restaurant & Menu
  useEffect(() => {
    const fetchRestaurantAndMenu = async () => {
      try {
        const [resRestaurant, resMenu] = await Promise.all([
          API.get(`/restaurants/restaurant/public/${restaurantId}`),
          API.get(`/menu/restaurant/${restaurantId}`),
        ]);
        setRestaurant(resRestaurant.data.restaurant);
        setMenuItems(resMenu.data.menu || []);
        setMenuLoaded(true);
      } catch (err) {
        console.error("❌ Failed to fetch restaurant or menu:", err);
      } finally {
        setLoading(false);
      }
    };

    if (restaurantId) fetchRestaurantAndMenu();
  }, [restaurantId]);

  // 📥 Check if restaurant is in user's favorites
  useEffect(() => {
    const checkIfFavorite = async () => {
      if (!user?._id) return;

      try {
        const res = await API.get(`/favorites/favorites/${user._id}`);
        const favoriteIds = res.data.favorites.map((r) => r._id);
        setIsFavorite(favoriteIds.includes(restaurantId));
      } catch (err) {
        console.error("❌ Error fetching favorites:", err);
      }
    };

    checkIfFavorite();
  }, [user?._id, restaurantId]);

  // 🍽️ Fetch user's favorite menu items
  useEffect(() => {
    const fetchFavoriteMenuItems = async () => {
      if (!user?._id) return;
      try {
        const res = await API.get(`/favorites/favorites/menu/${user._id}`);
        const menuItemIds = res.data.favorites.map((m) => m._id);
        setFavoriteMenuItems(menuItemIds);
      } catch (err) {
        console.error("❌ Error fetching favorite menu items:", err);
      }
    };

    fetchFavoriteMenuItems();
  }, [user?._id]);

  // ❤️ Toggle favorite for restaurant
  const toggleFavorite = async () => {
    if (!user?._id) {
      alert("Please login to use favorites.");
      return;
    }

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

  // ❤️ Toggle favorite for a menu item
  const toggleMenuItemFavorite = async (menuItemId) => {
    if (!user?._id) {
      alert("Please login to use favorites.");
      return;
    }

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

  // 🛒 Fetch Cart AFTER Menu is Loaded
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await API.get(`/cart/${user._id}`);
        const cartItems = res.data.cart.items || [];

        const newCart = {};
        cartItems.forEach((item) => {
          const matchedItem = menuItems.find((m) => m._id === item.menuItemId);
          if (matchedItem) {
            newCart[item.menuItemId] = {
              quantity: item.quantity,
              item: matchedItem,
            };
          }
        });

        setCart(newCart);
        setCartLoaded(true);
      } catch (err) {
        console.error("❌ Failed to fetch cart:", err.response?.data || err);
      }
    };

    if (user?._id && menuLoaded) {
      fetchCart();
    }
  }, [user?._id, menuLoaded, location.pathname]);

  // ➕ Add to Cart
  const handleAdd = async (itemId) => {
    try {
      const quantity = (cart[itemId]?.quantity || 0) + 1;

      await API.post("/cart", {
        userId: user._id,
        restaurantId,
        menuItemId: itemId,
        quantity,
      });

      const item = menuItems.find((m) => m._id === itemId);
      if (!item) return;

      setCart((prev) => ({
        ...prev,
        [itemId]: {
          quantity,
          item,
        },
      }));
    } catch (err) {
      console.error("❌ Error adding to cart:", err.response?.data || err);
    }
  };

  // ➖ Remove from Cart
  const handleRemove = async (itemId) => {
    try {
      const currentQty = cart[itemId]?.quantity || 0;
      const newQty = currentQty - 1;

      if (newQty > 0) {
        await API.post("/cart", {
          userId: user._id,
          restaurantId,
          menuItemId: itemId,
          quantity: newQty,
        });
      } else {
        await API.delete("/cart/item", {
          data: {
            userId: user._id,
            menuItemId: itemId,
          },
        });
      }

      setCart((prev) => {
        const updated = { ...prev };
        if (newQty > 0) {
          updated[itemId] = {
            ...updated[itemId],
            quantity: newQty,
          };
        } else {
          delete updated[itemId];
        }
        return updated;
      });
    } catch (err) {
      console.error("❌ Error removing from cart:", err.response?.data || err);
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
            {/* ❤️ Favorite Toggle Button */}
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
                {/* ❤️ Menu Item Favorite Icon */}
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
      {menuLoaded &&
        cartLoaded &&
        Object.keys(cart).length > 0 &&
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
