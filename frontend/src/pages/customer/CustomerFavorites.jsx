import React, { useEffect, useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaHeart,
  FaHeartBroken,
  FaStar,
  FaUtensils,
  FaStore,
  FaMapMarkerAlt,
  FaFire,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";

const CustomerFavorites = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [tab, setTab] = useState("restaurants");
  const [restaurantFavorites, setRestaurantFavorites] = useState([]);
  const [menuFavorites, setMenuFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(null);

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

  const handleRemoveRestaurant = async (restaurantId) => {
    try {
      setRemoving(restaurantId);
      await API.delete("/favorites/favorites", {
        data: { userId: user._id, restaurantId },
      });
      setRestaurantFavorites((prev) =>
        prev.filter((r) => r._id !== restaurantId)
      );
    } catch (err) {
      console.error("❌ Failed to remove restaurant:", err);
      alert("Failed to remove from favorites");
    } finally {
      setRemoving(null);
    }
  };

  const handleRemoveMenu = async (menuItemId) => {
    try {
      setRemoving(menuItemId);
      await API.delete("/favorites/favorites/menu", {
        data: { userId: user._id, menuItemId },
      });
      setMenuFavorites((prev) => prev.filter((m) => m._id !== menuItemId));
    } catch (err) {
      console.error("❌ Failed to remove menu item:", err);
      alert("Failed to remove from favorites");
    } finally {
      setRemoving(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading your favorites...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <motion.div
        className="px-4 sm:px-8 md:px-10 lg:px-12 py-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-orange-600 to-pink-600 dark:from-orange-400 dark:to-pink-500 bg-clip-text text-transparent mb-3 flex items-center gap-3">
            <FaHeart className="text-red-500" />
            Your Favorites
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Your saved restaurants and dishes
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-8">
          {[
            {
              value: "restaurants",
              label: "Restaurants",
              icon: FaStore,
              count: restaurantFavorites.length,
            },
            {
              value: "menu",
              label: "Menu Items",
              icon: FaUtensils,
              count: menuFavorites.length,
            },
          ].map((tabItem) => {
            const Icon = tabItem.icon;
            const isActive = tab === tabItem.value;
            return (
              <motion.button
                key={tabItem.value}
                onClick={() => setTab(tabItem.value)}
                className={`relative flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-orange-500 to-pink-600 text-white shadow-lg"
                    : "bg-white dark:bg-slate-900 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-700 hover:border-orange-500"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon />
                <span>{tabItem.label}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    isActive
                      ? "bg-white/20"
                      : "bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400"
                  }`}
                >
                  {tabItem.count}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {tab === "restaurants" ? (
            <motion.div
              key="restaurants"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              {restaurantFavorites.length === 0 ? (
                <EmptyState
                  icon="🏪"
                  title="No Favorite Restaurants"
                  description="Start adding restaurants to your favorites!"
                  actionLabel="Browse Restaurants"
                  onAction={() => navigate("/customer/browse")}
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <AnimatePresence>
                    {restaurantFavorites.map((restaurant, index) => (
                      <RestaurantCard
                        key={restaurant._id}
                        restaurant={restaurant}
                        index={index}
                        onRemove={handleRemoveRestaurant}
                        removing={removing === restaurant._id}
                        navigate={navigate}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              {menuFavorites.length === 0 ? (
                <EmptyState
                  icon="🍽️"
                  title="No Favorite Menu Items"
                  description="Start adding menu items to your favorites!"
                  actionLabel="Browse Restaurants"
                  onAction={() => navigate("/customer/browse")}
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <AnimatePresence>
                    {menuFavorites.map((item, index) => (
                      <MenuItemCard
                        key={item._id}
                        item={item}
                        index={index}
                        onRemove={handleRemoveMenu}
                        removing={removing === item._id}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

/* ========== Restaurant Card ========== */
const RestaurantCard = ({
  restaurant,
  index,
  onRemove,
  removing,
  navigate,
}) => {
  const [expanded, setExpanded] = useState(false);
  const description = restaurant.description || "Delicious food awaits you";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.05 }}
      className="group relative"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <div className="relative rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-orange-200 dark:border-white/10 shadow-md hover:shadow-xl transition-all duration-300 h-[420px] flex flex-col">
        {/* Image */}
        <div
          className="relative h-48 overflow-hidden cursor-pointer"
          onClick={() =>
            navigate(`/customer/menu/restaurant/${restaurant._id}`)
          }
        >
          <img
            src={restaurant.logo || "/QuickBite.png"}
            alt={restaurant.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

          <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-sm text-white text-sm font-bold flex items-center gap-1.5 shadow-lg">
            <FaStar className="text-yellow-400" />
            {restaurant.averageRating?.toFixed(1) || "4.5"}
          </div>

          {restaurant.isPopular && (
            <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold shadow-lg flex items-center gap-1">
              <FaFire /> Popular
            </div>
          )}

          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onRemove(restaurant._id);
            }}
            disabled={removing}
            className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-all"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {removing ? (
              <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <FaHeartBroken className="text-red-500 text-lg" />
            )}
          </motion.button>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col justify-between flex-1">
          <div>
            <h3
              className="text-xl font-bold text-gray-900 dark:text-white mb-2 cursor-pointer hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
              onClick={() =>
                navigate(`/customer/menu/restaurant/${restaurant._id}`)
              }
            >
              {restaurant.name}
            </h3>

            <p
              className={`text-sm text-gray-600 dark:text-gray-400 mb-2 ${
                expanded ? "" : "line-clamp-2"
              }`}
            >
              {description}
            </p>
            {description.length > 80 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-xs text-orange-500 hover:text-orange-600 font-semibold"
              >
                {expanded ? "Show less" : "Show more"}
              </button>
            )}
          </div>

          <motion.button
            onClick={() =>
              navigate(`/customer/menu/restaurant/${restaurant._id}`)
            }
            className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-bold shadow-lg hover:shadow-xl transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            View Menu
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

/* ========== Menu Item Card ========== */
const MenuItemCard = ({ item, index, onRemove, removing }) => {
  const [expanded, setExpanded] = useState(false);
  const description = item.description || "Delicious and tasty";
  const isVeg = item.isVegetarian;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.05 }}
      className="group relative"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <div className="relative rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-orange-200 dark:border-white/10 shadow-md hover:shadow-xl transition-all duration-300 h-[420px] flex flex-col">
        <div className="relative h-48 overflow-hidden">
          <img
            src={item.image || "/QuickBite.png"}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

          <div className="absolute top-3 left-3 flex gap-2">
            {isVeg !== undefined && (
              <div
                className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                  isVeg
                    ? "border-green-500 bg-white"
                    : "border-red-500 bg-white"
                }`}
              >
                <div
                  className={`w-3 h-3 rounded-full ${
                    isVeg ? "bg-green-500" : "bg-red-500"
                  }`}
                ></div>
              </div>
            )}

            {item.category && (
              <span className="px-2 py-1 rounded-lg bg-black/70 backdrop-blur-sm text-white text-xs font-bold">
                {item.category}
              </span>
            )}
          </div>

          <motion.button
            onClick={() => onRemove(item._id)}
            disabled={removing}
            className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-all"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {removing ? (
              <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <FaHeartBroken className="text-red-500 text-lg" />
            )}
          </motion.button>
        </div>

        <div className="p-5 flex flex-col justify-between flex-1">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {item.name}
            </h3>

            <p
              className={`text-sm text-gray-600 dark:text-gray-400 mb-2 ${
                expanded ? "" : "line-clamp-2"
              }`}
            >
              {description}
            </p>
            {description.length > 80 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-xs text-orange-500 hover:text-orange-600 font-semibold"
              >
                {expanded ? "Show less" : "Show more"}
              </button>
            )}
          </div>

          <div className="flex items-center justify-between mt-4">
            <span className="text-2xl font-black bg-gradient-to-r from-orange-600 to-pink-600 dark:from-orange-400 dark:to-pink-500 bg-clip-text text-transparent">
              ₹{item.price}
            </span>
            {item.restaurantId && (
              <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <FaStore /> {item.restaurantId.name || "Restaurant"}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ========== Empty State ========== */
const EmptyState = ({ icon, title, description, actionLabel, onAction }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-20"
    >
      <div className="text-8xl mb-6">{icon}</div>
      <h3 className="text-3xl font-bold mb-3 text-gray-900 dark:text-white">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
        {description}
      </p>
      <motion.button
        onClick={onAction}
        className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-bold shadow-lg hover:shadow-xl transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FaStore />
        {actionLabel}
      </motion.button>
    </motion.div>
  );
};

export default CustomerFavorites;

//old
// import React, { useEffect, useState, useContext } from "react";
// import { FaHeartBroken } from "react-icons/fa";
// import API from "../../api/axios";
// import { AuthContext } from "../../context/AuthContext";

// const CustomerFavorites = () => {
//   const { user } = useContext(AuthContext);
//   const [tab, setTab] = useState("restaurants"); // 'restaurants' or 'menu'
//   const [restaurantFavorites, setRestaurantFavorites] = useState([]);
//   const [menuFavorites, setMenuFavorites] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Fetch both types of favorites
//   useEffect(() => {
//     const fetchFavorites = async () => {
//       try {
//         const [restaurantRes, menuRes] = await Promise.all([
//           API.get(`/favorites/favorites/${user._id}`),
//           API.get(`/favorites/favorites/menu/${user._id}`),
//         ]);

//         setRestaurantFavorites(restaurantRes.data.favorites || []);
//         setMenuFavorites(menuRes.data.favorites || []);
//       } catch (err) {
//         console.error("❌ Error fetching favorites:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (user?._id) fetchFavorites();
//   }, [user?._id]);

//   // Remove restaurant
//   const handleRemoveRestaurant = async (restaurantId) => {
//     try {
//       await API.delete("/favorites/favorites", {
//         data: {
//           userId: user._id,
//           restaurantId,
//         },
//       });

//       setRestaurantFavorites((prev) =>
//         prev.filter((r) => r._id !== restaurantId)
//       );
//     } catch (err) {
//       console.error("❌ Failed to remove restaurant:", err);
//     }
//   };

//   // Remove menu item
//   const handleRemoveMenu = async (menuItemId) => {
//     try {
//       await API.delete("/favorites/favorites/menu", {
//         data: {
//           userId: user._id,
//           menuItemId,
//         },
//       });

//       setMenuFavorites((prev) => prev.filter((m) => m._id !== menuItemId));
//     } catch (err) {
//       console.error("❌ Failed to remove menu item:", err);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="p-6 text-center text-gray-700 dark:text-white">
//         Loading your favorites...
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 text-gray-800 dark:text-white">
//       <h1 className="text-3xl font-bold mb-6">❤️ Your Favorites</h1>

//       {/* Tabs */}
//       <div className="flex gap-4 mb-6">
//         <button
//           className={`px-4 py-2 rounded-md ${
//             tab === "restaurants"
//               ? "bg-primary text-white"
//               : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
//           }`}
//           onClick={() => setTab("restaurants")}
//         >
//           Restaurants
//         </button>
//         <button
//           className={`px-4 py-2 rounded-md ${
//             tab === "menu"
//               ? "bg-primary text-white"
//               : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
//           }`}
//           onClick={() => setTab("menu")}
//         >
//           Menu Items
//         </button>
//       </div>

//       {/* Content */}
//       {tab === "restaurants" ? (
//         restaurantFavorites.length === 0 ? (
//           <p className="text-gray-500 dark:text-gray-400">
//             No favorite restaurants yet.
//           </p>
//         ) : (
//           <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//             {restaurantFavorites.map((restaurant) => (
//               <div
//                 key={restaurant._id}
//                 className="bg-white dark:bg-secondary rounded-xl shadow border dark:border-gray-700 overflow-hidden flex flex-col"
//               >
//                 <img
//                   src={restaurant.logo || "/QuickBite.png"}
//                   alt={restaurant.name}
//                   className="w-full h-40 object-cover"
//                 />
//                 <div className="p-4 flex-1 flex flex-col justify-between">
//                   <div>
//                     <h2 className="text-xl font-semibold mb-1">
//                       {restaurant.name}
//                     </h2>
//                     <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
//                       {restaurant.cuisine || "Cuisine Type"}
//                     </p>
//                     <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
//                       {restaurant.description || "No description"}
//                     </p>
//                     <p className="text-sm text-yellow-500 font-medium mb-4">
//                       ⭐ {restaurant.averageRating?.toFixed(1) || "4.0"} / 5
//                     </p>
//                   </div>
//                   <button
//                     onClick={() => handleRemoveRestaurant(restaurant._id)}
//                     className="mt-auto bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-md flex items-center gap-2 transition"
//                   >
//                     <FaHeartBroken />
//                     Remove
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )
//       ) : menuFavorites.length === 0 ? (
//         <p className="text-gray-500 dark:text-gray-400">
//           No favorite menu items yet.
//         </p>
//       ) : (
//         <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//           {menuFavorites.map((item) => (
//             <div
//               key={item._id}
//               className="bg-white dark:bg-secondary rounded-xl shadow border dark:border-gray-700 overflow-hidden flex flex-col"
//             >
//               <img
//                 src={item.image || "/QuickBite.png"}
//                 alt={item.name}
//                 className="w-full h-40 object-cover"
//               />
//               <div className="p-4 flex-1 flex flex-col justify-between">
//                 <div>
//                   <h2 className="text-xl font-semibold mb-1">{item.name}</h2>
//                   <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
//                     {item.category}
//                   </p>
//                   <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
//                     {item.description || "No description"}
//                   </p>
//                   <p className="text-sm text-green-600 font-medium mb-4">
//                     ₹ {item.price}
//                   </p>
//                 </div>
//                 <button
//                   onClick={() => handleRemoveMenu(item._id)}
//                   className="mt-auto bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-md flex items-center gap-2 transition"
//                 >
//                   <FaHeartBroken />
//                   Remove
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default CustomerFavorites;
