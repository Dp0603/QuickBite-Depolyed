import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState({});
  const [globalCart, setGlobalCart] = useState({});
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteMenuItems, setFavoriteMenuItems] = useState([]);
  const [showClearCartModal, setShowClearCartModal] = useState(false);
  const [pendingItem, setPendingItem] = useState(null);

  // Fetch restaurant & menu
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

  // Fetch favorites
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user?._id) return;
      try {
        const [resRestaurants, resMenuItems] = await Promise.all([
          API.get(`/favorites/favorites/${user._id}`),
          API.get(`/favorites/favorites/menu/${user._id}`),
        ]);
        setIsFavorite(
          resRestaurants.data.favorites.some((r) => r._id === restaurantId)
        );
        setFavoriteMenuItems(resMenuItems.data.favorites.map((m) => m._id));
      } catch (err) {
        console.error("❌ Error fetching favorites:", err);
      }
    };
    fetchFavorites();
  }, [user?._id, restaurantId]);

  // Fetch cart for current restaurant
  const fetchCart = async () => {
    if (!user?._id) return;
    try {
      const res = await API.get(`/cart/${user._id}/${restaurantId}`);
      const cartItems = res.data.cart?.items || [];
      const newCart = {};
      cartItems.forEach((item) => {
        newCart[item.menuItem._id] = {
          quantity: item.quantity,
          item: item.menuItem,
        };
      });
      setCart(newCart);
      setGlobalCart((prev) => ({ ...prev, [restaurantId]: newCart }));
    } catch {
      setCart({});
      setGlobalCart((prev) => ({ ...prev, [restaurantId]: {} }));
    }
  };

  // Fetch global active cart for floating total
  const fetchActiveCart = async () => {
    if (!user?._id) return;
    try {
      const res = await API.get(`/cart/${user._id}`);
      const activeCart = res.data.cart?.items || [];
      const newGlobalCart = {};
      if (activeCart.length > 0) {
        const restId = res.data.cart.restaurantId._id;
        const cartMap = {};
        activeCart.forEach((item) => {
          cartMap[item.menuItem._id] = {
            quantity: item.quantity,
            item: item.menuItem,
          };
        });
        newGlobalCart[restId] = cartMap;
      }
      setGlobalCart(newGlobalCart);
    } catch {
      setGlobalCart({});
    }
  };

  useEffect(() => {
    fetchCart();
    fetchActiveCart();
  }, [user?._id, restaurantId]);

  // Add item
  const handleAdd = (itemId) => {
    if (!user?._id) return alert("Please login to add to cart.");
    addItemToCart(itemId, false);
  };

  const addItemToCart = async (itemId, clearOldCart) => {
    try {
      const quantity = (cart[itemId]?.quantity || 0) + 1;
      await API.post(`/cart/${user._id}/${restaurantId}/item/${itemId}`, {
        quantity,
        clearOldCart,
      });
      fetchCart();
      fetchActiveCart();
    } catch (err) {
      if (
        err.response?.status === 400 &&
        err.response?.data?.message?.includes("another restaurant")
      ) {
        setPendingItem(itemId);
        setShowClearCartModal(true);
      } else {
        console.error("❌ Error adding to cart:", err.response?.data || err);
      }
    }
  };

  const confirmClearCart = async () => {
    if (!pendingItem) return;
    await addItemToCart(pendingItem, true);
    setPendingItem(null);
    setShowClearCartModal(false);
  };

  const cancelClearCart = () => {
    setPendingItem(null);
    setShowClearCartModal(false);
  };

  // Remove item
  const handleRemove = async (itemId) => {
    const currentQty = cart[itemId]?.quantity || 0;
    if (currentQty <= 0) return;

    try {
      if (currentQty > 1) {
        await API.post(`/cart/${user._id}/${restaurantId}/item/${itemId}`, {
          quantity: currentQty - 1,
        });
      } else {
        await API.delete(`/cart/${user._id}/${restaurantId}/item/${itemId}`);
      }
      fetchCart();
      fetchActiveCart();
    } catch {
      fetchCart();
      fetchActiveCart();
    }
  };

  // Toggle favorites
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
    } catch {}
  };

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
    } catch {}
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  // Calculate global cart totals
  let totalItems = 0;
  let subtotal = 0;
  Object.values(globalCart).forEach((restCart) =>
    Object.values(restCart).forEach(({ quantity, item }) => {
      totalItems += quantity;
      subtotal += item.price * quantity;
    })
  );

  return (
    <div className="p-6 text-gray-800 dark:text-white max-w-6xl mx-auto">
      {/* Restaurant Info */}
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

      {/* Menu Items */}
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

      {/* Floating Cart (always shows if global cart has items) */}
      {totalItems > 0 && (
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
      )}

      {/* Clear Cart Modal */}
      {showClearCartModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full shadow-lg text-center">
            <p className="text-gray-800 dark:text-white mb-4">
              You have items in another restaurant's cart. Do you want to clear
              it and add this item?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmClearCart}
                className="bg-primary text-white px-4 py-2 rounded hover:bg-orange-600"
              >
                Yes
              </button>
              <button
                onClick={cancelClearCart}
                className="bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white px-4 py-2 rounded hover:bg-gray-400"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerRestaurantMenu;
