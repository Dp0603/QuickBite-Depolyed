import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaStar,
  FaClock,
  FaPlus,
  FaMinus,
  FaHeart,
  FaRegHeart,
  FaShoppingCart,
  FaFire,
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

  // Floating Cart Visibility State
  const [showCart, setShowCart] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    let timeout;
    const handleScroll = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        const currentScroll = window.scrollY;
        if (currentScroll > lastScrollY + 10) setShowCart(false);
        else if (currentScroll < lastScrollY - 10) setShowCart(true);
        setLastScrollY(currentScroll);
      }, 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

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

  const isAvailable = restaurant?.isOnline && restaurant?.status === "approved";

  const handleAdd = (itemId) => {
    if (!isAvailable) return alert("Restaurant is offline right now.");
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

  const handleRemove = async (itemId) => {
    if (!isAvailable) return;
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

  if (loading)
    return (
      <div className="flex justify-center items-center h-80 text-gray-600 dark:text-gray-300 text-xl font-semibold animate-pulse">
        Loading menu...
      </div>
    );

  // Calculate totals
  let totalItems = 0;
  let subtotal = 0;
  Object.values(globalCart).forEach((restCart) =>
    Object.values(restCart).forEach(({ quantity, item }) => {
      totalItems += quantity;
      subtotal += item.price * quantity;
    })
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-gray-800 dark:text-white px-6 py-8">
      {/* ===== Restaurant Info ===== */}
      {restaurant && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          exit={{ opacity: 0, y: 20 }}
          className="max-w-5xl mx-auto mb-10 p-6 rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-lg border border-orange-200 dark:border-white/10 relative"
        >
          {!isAvailable && (
            <span className="absolute top-3 right-3 px-3 py-1 text-sm bg-red-500 text-white rounded-full shadow">
              Offline
            </span>
          )}
          <div className="flex flex-col md:flex-row items-center gap-6">
            <img
              src={restaurant.logo || "/QuickBite.png"}
              alt={restaurant.name}
              className={`w-28 h-28 rounded-2xl object-cover shadow-lg ${
                !isAvailable ? "opacity-50" : ""
              }`}
            />
            <div className="flex-1">
              <h1 className="text-4xl font-black mb-1 bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                {restaurant.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-3">
                {restaurant.description || "Delicious dishes available."}
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="flex items-center gap-2 text-yellow-600">
                  <FaStar /> {restaurant.averageRating || "4.2"}
                </span>
                <span className="flex items-center gap-2 text-orange-500">
                  <FaClock /> {restaurant.deliveryTimeEstimate || "30 mins"}
                </span>
                <span className="text-gray-500">₹40 Delivery Fee</span>
              </div>
              <motion.button
                onClick={toggleFavorite}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`mt-4 px-4 py-2 rounded-full font-semibold transition-all ${
                  isFavorite
                    ? "bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-md hover:shadow-lg"
                    : "bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-orange-400"
                }`}
              >
                {isFavorite ? "❤️ Favorited" : "🤍 Add to Favorites"}
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}

      {/* ===== Menu Grid ===== */}
      <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.length > 0 ? (
          menuItems.map((item, i) => {
            const inCart = cart[item._id];
            const isFav = favoriteMenuItems.includes(item._id);
            return (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`relative p-5 rounded-2xl border border-orange-200 dark:border-white/10 bg-white dark:bg-slate-900 shadow-md hover:shadow-xl transition-all group ${
                  !isAvailable ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <div className="relative overflow-hidden rounded-xl mb-3">
                  <img
                    src={item.image || "/QuickBite.png"}
                    alt={item.name}
                    className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <motion.button
                    onClick={() => toggleMenuItemFavorite(item._id)}
                    whileTap={{ scale: 0.9 }}
                    className="absolute top-2 right-2 text-xl p-2 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-md shadow-md hover:scale-110 transition"
                  >
                    {isFav ? (
                      <FaHeart className="text-red-500" />
                    ) : (
                      <FaRegHeart className="text-gray-500" />
                    )}
                  </motion.button>
                </div>

                <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                  {item.description || "No description available."}
                </p>

                <div className="flex justify-between items-center">
                  <span className="text-xl font-extrabold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                    ₹{item.price}
                  </span>

                  {inCart ? (
                    <div className="flex items-center gap-2">
                      <motion.button
                        onClick={() => handleRemove(item._id)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600"
                      >
                        <FaMinus />
                      </motion.button>

                      <span className="font-semibold">{inCart.quantity}</span>

                      <motion.button
                        onClick={() => handleAdd(item._id)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-pink-600 text-white flex items-center justify-center shadow-md hover:shadow-lg"
                      >
                        <FaPlus />
                      </motion.button>
                    </div>
                  ) : (
                    <motion.button
                      onClick={() => handleAdd(item._id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-5 py-2 rounded-full bg-gradient-to-r from-orange-500 to-pink-600 text-white font-semibold shadow-md hover:shadow-lg"
                    >
                      Add
                    </motion.button>
                  )}
                </div>
              </motion.div>
            );
          })
        ) : (
          <p className="col-span-full text-center text-gray-500 dark:text-gray-400">
            No menu items available.
          </p>
        )}
      </div>

      {/* ===== Floating Cart ===== */}
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{
              y: showCart ? 0 : 100,
              opacity: showCart ? 1 : 0,
            }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 12 }}
            className="fixed bottom-6 left-0 w-screen flex justify-center z-[9999] pointer-events-none w-full"
          >
            <div
              className="pointer-events-auto flex items-center justify-between gap-4 px-4 sm:px-6 py-2.5 sm:py-3
 
                   bg-gradient-to-r from-orange-500 to-pink-600 
                   text-white rounded-full shadow-[0_8px_24px_rgba(255,87,34,0.4)] 
                   backdrop-blur-md border border-white/20
                   w-fit min-w-[260px] sm:min-w-[340px] md:min-w-[420px]
                   max-w-[90vw]"
            >
              <span className="font-semibold flex items-center gap-2 text-sm sm:text-base">
                <FaShoppingCart className="text-lg sm:text-xl" />
                {totalItems} item{totalItems > 1 ? "s" : ""} | ₹
                {subtotal.toFixed(2)}
              </span>

              <motion.button
                onClick={() => navigate("/customer/cart")}
                title="Go to your cart"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-orange-600 font-semibold sm:font-bold px-4 sm:px-5 py-1.5 sm:py-2 
                     rounded-full shadow-md hover:shadow-lg transition 
                     flex items-center gap-2 text-sm sm:text-base"
              >
                View Cart
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== Clear Cart Modal ===== */}
      <AnimatePresence>
        {showClearCartModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 max-w-sm w-full text-center"
            >
              <FaFire className="text-5xl text-orange-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-2">Clear existing cart?</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                You have items from another restaurant. Clear it and add this
                item?
              </p>

              <div className="flex justify-center gap-4">
                <motion.button
                  onClick={confirmClearCart}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold shadow hover:shadow-lg"
                >
                  Yes
                </motion.button>

                <motion.button
                  onClick={cancelClearCart}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  No
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomerRestaurantMenu;

//old
//import React, { useEffect, useState, useContext } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   FaStar,
//   FaClock,
//   FaPlus,
//   FaMinus,
//   FaHeart,
//   FaRegHeart,
// } from "react-icons/fa";
// import API from "../../api/axios";
// import { AuthContext } from "../../context/AuthContext";

// const CustomerRestaurantMenu = () => {
//   const { id: restaurantId } = useParams();
//   const { user } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const [restaurant, setRestaurant] = useState(null);
//   const [menuItems, setMenuItems] = useState([]);
//   const [cart, setCart] = useState({});
//   const [globalCart, setGlobalCart] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [isFavorite, setIsFavorite] = useState(false);
//   const [favoriteMenuItems, setFavoriteMenuItems] = useState([]);
//   const [showClearCartModal, setShowClearCartModal] = useState(false);
//   const [pendingItem, setPendingItem] = useState(null);

//   // Fetch restaurant & menu
//   useEffect(() => {
//     const fetchRestaurantAndMenu = async () => {
//       try {
//         const [resRestaurant, resMenu] = await Promise.all([
//           API.get(`/restaurants/restaurants/${restaurantId}`),
//           API.get(`/menu/restaurant/${restaurantId}/menu`),
//         ]);
//         setRestaurant(resRestaurant.data.restaurant);
//         setMenuItems(resMenu.data.menu || []);
//       } catch (err) {
//         console.error("❌ Failed to fetch restaurant or menu:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     if (restaurantId) fetchRestaurantAndMenu();
//   }, [restaurantId]);

//   // Fetch favorites
//   useEffect(() => {
//     const fetchFavorites = async () => {
//       if (!user?._id) return;
//       try {
//         const [resRestaurants, resMenuItems] = await Promise.all([
//           API.get(`/favorites/favorites/${user._id}`),
//           API.get(`/favorites/favorites/menu/${user._id}`),
//         ]);
//         setIsFavorite(
//           resRestaurants.data.favorites.some((r) => r._id === restaurantId)
//         );
//         setFavoriteMenuItems(resMenuItems.data.favorites.map((m) => m._id));
//       } catch (err) {
//         console.error("❌ Error fetching favorites:", err);
//       }
//     };
//     fetchFavorites();
//   }, [user?._id, restaurantId]);

//   // Fetch cart for current restaurant
//   const fetchCart = async () => {
//     if (!user?._id) return;
//     try {
//       const res = await API.get(`/cart/${user._id}/${restaurantId}`);
//       const cartItems = res.data.cart?.items || [];
//       const newCart = {};
//       cartItems.forEach((item) => {
//         newCart[item.menuItem._id] = {
//           quantity: item.quantity,
//           item: item.menuItem,
//         };
//       });
//       setCart(newCart);
//       setGlobalCart((prev) => ({ ...prev, [restaurantId]: newCart }));
//     } catch {
//       setCart({});
//       setGlobalCart((prev) => ({ ...prev, [restaurantId]: {} }));
//     }
//   };

//   // Fetch global active cart for floating total
//   const fetchActiveCart = async () => {
//     if (!user?._id) return;
//     try {
//       const res = await API.get(`/cart/${user._id}`);
//       const activeCart = res.data.cart?.items || [];
//       const newGlobalCart = {};
//       if (activeCart.length > 0) {
//         const restId = res.data.cart.restaurantId._id;
//         const cartMap = {};
//         activeCart.forEach((item) => {
//           cartMap[item.menuItem._id] = {
//             quantity: item.quantity,
//             item: item.menuItem,
//           };
//         });
//         newGlobalCart[restId] = cartMap;
//       }
//       setGlobalCart(newGlobalCart);
//     } catch {
//       setGlobalCart({});
//     }
//   };

//   useEffect(() => {
//     fetchCart();
//     fetchActiveCart();
//   }, [user?._id, restaurantId]);

//   // Check if restaurant is online
//   const isAvailable = restaurant?.isOnline && restaurant?.status === "approved";

//   // Add item
//   const handleAdd = (itemId) => {
//     if (!isAvailable) {
//       alert("This restaurant is currently offline. You cannot add items.");
//       return;
//     }
//     if (!user?._id) return alert("Please login to add to cart.");
//     addItemToCart(itemId, false);
//   };

//   const addItemToCart = async (itemId, clearOldCart) => {
//     try {
//       const quantity = (cart[itemId]?.quantity || 0) + 1;
//       await API.post(`/cart/${user._id}/${restaurantId}/item/${itemId}`, {
//         quantity,
//         clearOldCart,
//       });
//       fetchCart();
//       fetchActiveCart();
//     } catch (err) {
//       if (
//         err.response?.status === 400 &&
//         err.response?.data?.message?.includes("another restaurant")
//       ) {
//         setPendingItem(itemId);
//         setShowClearCartModal(true);
//       } else {
//         console.error("❌ Error adding to cart:", err.response?.data || err);
//       }
//     }
//   };

//   const confirmClearCart = async () => {
//     if (!pendingItem) return;
//     await addItemToCart(pendingItem, true);
//     setPendingItem(null);
//     setShowClearCartModal(false);
//   };

//   const cancelClearCart = () => {
//     setPendingItem(null);
//     setShowClearCartModal(false);
//   };

//   // Remove item
//   const handleRemove = async (itemId) => {
//     if (!isAvailable) return;
//     const currentQty = cart[itemId]?.quantity || 0;
//     if (currentQty <= 0) return;

//     try {
//       if (currentQty > 1) {
//         await API.post(`/cart/${user._id}/${restaurantId}/item/${itemId}`, {
//           quantity: currentQty - 1,
//         });
//       } else {
//         await API.delete(`/cart/${user._id}/${restaurantId}/item/${itemId}`);
//       }
//       fetchCart();
//       fetchActiveCart();
//     } catch {
//       fetchCart();
//       fetchActiveCart();
//     }
//   };

//   // Toggle favorites
//   const toggleFavorite = async () => {
//     if (!user?._id) return alert("Please login to use favorites.");
//     try {
//       if (isFavorite) {
//         await API.delete("/favorites/favorites", {
//           data: { userId: user._id, restaurantId },
//         });
//       } else {
//         await API.post("/favorites/favorites", {
//           userId: user._id,
//           restaurantId,
//         });
//       }
//       setIsFavorite((prev) => !prev);
//     } catch {}
//   };

//   const toggleMenuItemFavorite = async (menuItemId) => {
//     if (!user?._id) return alert("Please login to use favorites.");
//     try {
//       const isFav = favoriteMenuItems.includes(menuItemId);
//       if (isFav) {
//         await API.delete("/favorites/favorites/menu", {
//           data: { userId: user._id, menuItemId },
//         });
//         setFavoriteMenuItems((prev) => prev.filter((id) => id !== menuItemId));
//       } else {
//         await API.post("/favorites/favorites/menu", {
//           userId: user._id,
//           menuItemId,
//         });
//         setFavoriteMenuItems((prev) => [...prev, menuItemId]);
//       }
//     } catch {}
//   };

//   if (loading) return <div className="p-6 text-center">Loading...</div>;

//   // Calculate global cart totals
//   let totalItems = 0;
//   let subtotal = 0;
//   Object.values(globalCart).forEach((restCart) =>
//     Object.values(restCart).forEach(({ quantity, item }) => {
//       totalItems += quantity;
//       subtotal += item.price * quantity;
//     })
//   );

//   return (
//     <div className="p-6 text-gray-800 dark:text-white max-w-6xl mx-auto">
//       {/* Restaurant Info */}
//       {restaurant && (
//         <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-10 relative">
//           {!isAvailable && (
//             <span className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm z-10 shadow">
//               Offline
//             </span>
//           )}
//           <img
//             src={restaurant.logo || "/QuickBite.png"}
//             alt="Logo"
//             className={`w-28 h-28 rounded-xl object-cover shadow-md ${
//               !isAvailable ? "opacity-50" : ""
//             }`}
//           />
//           <div className="text-center md:text-left">
//             <h1 className="text-3xl font-bold mb-1">{restaurant.name}</h1>
//             <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
//               {restaurant.description || "Delicious dishes available."}
//             </p>
//             <div className="flex flex-wrap justify-center md:justify-start gap-3 text-sm">
//               <span className="flex items-center gap-1 text-green-600 font-medium">
//                 <FaStar /> {restaurant.averageRating || "4.2"}
//               </span>
//               <span className="flex items-center gap-1 text-yellow-600 font-medium">
//                 <FaClock /> {restaurant.deliveryTimeEstimate || "30 mins"}
//               </span>
//               <span className="text-gray-400">₹40 Delivery Fee</span>
//             </div>
//             <div className="mt-3">
//               <button
//                 onClick={toggleFavorite}
//                 className={`text-sm font-medium px-3 py-1 rounded-full border transition ${
//                   isFavorite
//                     ? "bg-red-100 text-red-600 border-red-300 hover:bg-red-200"
//                     : "bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200"
//                 }`}
//               >
//                 {isFavorite
//                   ? "❤️ Remove from Favorites"
//                   : "🤍 Add to Favorites"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Menu Items */}
//       <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {menuItems.length ? (
//           menuItems.map((item) => (
//             <div
//               key={item._id}
//               className={`p-4 bg-white dark:bg-secondary rounded-xl shadow-sm hover:shadow-md transition border dark:border-gray-700 flex flex-col relative ${
//                 !isAvailable ? "opacity-50 cursor-not-allowed" : ""
//               }`}
//             >
//               <div className="relative">
//                 <img
//                   src={item.image || "/QuickBite.png"}
//                   alt={item.name}
//                   className="w-full h-36 object-cover rounded-md mb-3"
//                 />
//                 <button
//                   onClick={() => toggleMenuItemFavorite(item._id)}
//                   className="absolute top-2 right-2 text-xl text-red-500 hover:scale-110 transition"
//                 >
//                   {favoriteMenuItems.includes(item._id) ? (
//                     <FaHeart />
//                   ) : (
//                     <FaRegHeart />
//                   )}
//                 </button>
//               </div>
//               <div className="flex-1">
//                 <h3 className="text-lg font-semibold">{item.name}</h3>
//                 <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
//                   {item.description || "No description available."}
//                 </p>
//               </div>
//               <div className="flex justify-between items-center mt-4">
//                 <span className="text-primary text-lg font-bold">
//                   ₹{item.price}
//                 </span>
//                 {cart[item._id] ? (
//                   <div className="flex items-center gap-2">
//                     <button
//                       onClick={() => handleRemove(item._id)}
//                       className="w-8 h-8 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-white rounded-full hover:bg-gray-300 dark:hover:bg-gray-500"
//                       disabled={!isAvailable}
//                     >
//                       <FaMinus />
//                     </button>
//                     <span className="font-medium">
//                       {cart[item._id]?.quantity}
//                     </span>
//                     <button
//                       onClick={() => handleAdd(item._id)}
//                       className="w-8 h-8 bg-primary text-white rounded-full hover:bg-orange-600"
//                       disabled={!isAvailable}
//                     >
//                       <FaPlus />
//                     </button>
//                   </div>
//                 ) : (
//                   <button
//                     onClick={() => handleAdd(item._id)}
//                     className="bg-primary hover:bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-medium transition"
//                     disabled={!isAvailable}
//                   >
//                     Add
//                   </button>
//                 )}
//               </div>
//             </div>
//           ))
//         ) : (
//           <p className="col-span-full text-center text-gray-500 dark:text-gray-400 mt-4">
//             No menu items available.
//           </p>
//         )}
//       </div>

//       {/* Floating Cart */}
//       {totalItems > 0 && (
//         <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-primary text-white shadow-lg px-6 py-3 rounded-full flex items-center gap-6 z-50">
//           <span>
//             🛒 {totalItems} item{totalItems > 1 ? "s" : ""} | ₹
//             {subtotal.toFixed(2)}
//           </span>
//           <button
//             onClick={() => navigate("/customer/cart")}
//             className="bg-white text-primary px-4 py-2 rounded-full text-sm font-semibold hover:bg-gray-100 transition"
//           >
//             View Cart
//           </button>
//         </div>
//       )}

//       {/* Clear Cart Modal */}
//       {showClearCartModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full shadow-lg text-center">
//             <p className="text-gray-800 dark:text-white mb-4">
//               You have items in another restaurant's cart. Do you want to clear
//               it and add this item?
//             </p>
//             <div className="flex justify-center gap-4">
//               <button
//                 onClick={confirmClearCart}
//                 className="bg-primary text-white px-4 py-2 rounded hover:bg-orange-600"
//               >
//                 Yes
//               </button>
//               <button
//                 onClick={cancelClearCart}
//                 className="bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white px-4 py-2 rounded hover:bg-gray-400"
//               >
//                 No
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CustomerRestaurantMenu;
