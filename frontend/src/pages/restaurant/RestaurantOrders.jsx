import React, { useEffect, useState, useContext, useMemo } from "react";
import { AuthContext } from "../../context/AuthContext";
import API from "../../api/axios";
import RestaurantOrderCard from "./RestaurantOrderCard";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaConciergeBell,
  FaSearch,
  FaRedo,
  FaCheckCircle,
  FaUtensils,
  FaFire,
  FaTruck,
  FaTimesCircle,
  FaHourglassHalf,
  FaFilter,
} from "react-icons/fa";

const RestaurantOrders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async (showRefresh = false) => {
    if (!user?.restaurantId) return;
    if (showRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await API.get(
        `/orders/orders/restaurant/${user.restaurantId}`
      );
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error("❌ Error fetching orders:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  // Filter by tab
  const filteredOrders = useMemo(() => {
    let filtered = orders;

    // Tab filter
    if (activeTab !== "all") {
      filtered = filtered.filter(
        (o) => o.orderStatus?.toLowerCase() === activeTab.toLowerCase()
      );
    }

    // Search filter
    if (search) {
      filtered = filtered.filter((o) => {
        const searchStr = `${o._id} ${o.customerId?.name || ""} ${o.items
          ?.map((i) => i.menuItemId?.name || i.name)
          .join(" ")}`.toLowerCase();
        return searchStr.includes(search.toLowerCase());
      });
    }

    // Sort by newest first
    return filtered.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [orders, activeTab, search]);

  // Count by status
  const counts = useMemo(() => {
    return {
      all: orders.length,
      pending: orders.filter((o) => o.orderStatus === "Pending").length,
      preparing: orders.filter((o) => o.orderStatus === "Preparing").length,
      ready: orders.filter((o) => o.orderStatus === "Ready").length,
      "out for delivery": orders.filter(
        (o) => o.orderStatus === "Out for Delivery"
      ).length,
      delivered: orders.filter((o) => o.orderStatus === "Delivered").length,
      cancelled: orders.filter((o) => o.orderStatus === "Cancelled").length,
    };
  }, [orders]);

  const tabs = [
    {
      key: "all",
      label: "All Orders",
      icon: <FaConciergeBell />,
      color: "gray",
    },
    {
      key: "pending",
      label: "Pending",
      icon: <FaHourglassHalf />,
      color: "amber",
    },
    {
      key: "preparing",
      label: "Preparing",
      icon: <FaUtensils />,
      color: "blue",
    },
    { key: "ready", label: "Ready", icon: <FaFire />, color: "orange" },
    {
      key: "out for delivery",
      label: "Out for Delivery",
      icon: <FaTruck />,
      color: "indigo",
    },
    {
      key: "delivered",
      label: "Delivered",
      icon: <FaCheckCircle />,
      color: "emerald",
    },
    {
      key: "cancelled",
      label: "Cancelled",
      icon: <FaTimesCircle />,
      color: "rose",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      <motion.div
        className="px-4 sm:px-8 md:px-10 lg:px-12 py-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-3 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg">
              <FaConciergeBell className="text-white text-xl" />
            </div>
            Restaurant Orders
          </h1>
          <p className="text-gray-600 text-lg">
            Manage and track all your incoming orders
          </p>
        </div>

        {/* Search & Refresh */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-4 top-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order ID, customer, or items..."
              className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-2xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 transition-all shadow-lg"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <motion.button
            onClick={() => fetchOrders(true)}
            disabled={refreshing}
            className="px-6 py-4 rounded-2xl border-2 border-transparent bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaRedo className={refreshing ? "animate-spin" : ""} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </motion.button>
        </div>

        {/* Tabs */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex gap-3 pb-2 min-w-max">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key;
              const count = counts[tab.key];

              return (
                <motion.button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-5 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                    isActive
                      ? `bg-gradient-to-r ${getTabGradient(
                          tab.color
                        )} text-white shadow-lg`
                      : "bg-white text-gray-700 border-2 border-gray-200 hover:border-rose-300"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {tab.icon}
                  {tab.label}
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-bold leading-none ${
                      isActive ? "bg-white/30" : "bg-gray-100"
                    }`}
                  >
                    {count}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Results count */}
        {search && (
          <div className="mb-4 text-sm text-gray-600">
            {filteredOrders.length} order
            {filteredOrders.length !== 1 ? "s" : ""} found
          </div>
        )}

        {/* Orders Grid */}
        {filteredOrders.length === 0 ? (
          <motion.div
            className="text-center p-12 bg-white rounded-3xl shadow-lg border border-gray-200"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="text-8xl mb-4">📦</div>
            <h3 className="text-2xl font-bold mb-2 text-gray-900">
              {search ? "No matching orders" : "No orders yet"}
            </h3>
            <p className="text-gray-600 mb-6">
              {search
                ? "Try adjusting your search query"
                : "New orders will appear here"}
            </p>
            {search && (
              <motion.button
                onClick={() => setSearch("")}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold shadow-lg hover:shadow-xl transition-all"
                whileHover={{ scale: 1.05 }}
              >
                Clear Search
              </motion.button>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredOrders.map((order, index) => (
                <RestaurantOrderCard
                  key={order._id}
                  order={order}
                  setOrders={setOrders}
                  delay={index * 0.05}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </div>
  );
};

const getTabGradient = (color) => {
  const gradients = {
    gray: "from-gray-500 to-slate-600",
    amber: "from-amber-500 to-orange-600",
    blue: "from-blue-500 to-cyan-600",
    orange: "from-orange-500 to-red-600",
    indigo: "from-indigo-500 to-purple-600",
    emerald: "from-emerald-500 to-teal-600",
    rose: "from-rose-500 to-pink-600",
  };
  return gradients[color] || gradients.gray;
};

export default RestaurantOrders;

// import React, { useEffect, useState, useContext } from "react";
// import { AuthContext } from "../../context/AuthContext";
// import API from "../../api/axios";
// import RestaurantOrderCard from "./RestaurantOrderCard";

// const RestaurantOrders = () => {
//   const { user } = useContext(AuthContext);
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchOrders = async () => {
//     if (!user?.restaurantId) return; // 👈 use restaurantId
//     setLoading(true);
//     try {
//       console.log("🔎 Logged in user object:", user);
//       const res = await API.get(
//         `/orders/orders/restaurant/${user.restaurantId}`
//       ); // 👈 fixed
//       console.log("📦 Orders API response:", res.data);
//       setOrders(res.data.orders);
//     } catch (err) {
//       console.error("❌ Error fetching restaurant orders:", err);
//       alert("Failed to fetch orders. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, [user]);

//   const activeOrders = orders.filter(
//     (o) => o.orderStatus !== "Delivered" && o.orderStatus !== "Cancelled"
//   );
//   const pastOrders = orders.filter(
//     (o) => o.orderStatus === "Delivered" || o.orderStatus === "Cancelled"
//   );

//   if (loading)
//     return <p className="p-6 text-center">⏳ Loading restaurant orders...</p>;

//   return (
//     <div className="px-4 md:px-10 py-8 text-gray-800 dark:text-white">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold">📦 Restaurant Orders</h1>
//         <button
//           onClick={fetchOrders}
//           className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
//         >
//           🔄 Refresh Orders
//         </button>
//       </div>

//       {/* Active Orders */}
//       <section className="mb-12">
//         <h2 className="text-2xl font-semibold mb-4">🟢 Active Orders</h2>
//         {activeOrders.length === 0 ? (
//           <p className="text-gray-500">No active orders currently.</p>
//         ) : (
//           <div className="grid gap-6 md:grid-cols-2">
//             {activeOrders.map((order) => (
//               <RestaurantOrderCard
//                 key={order._id}
//                 order={order}
//                 setOrders={setOrders}
//               />
//             ))}
//           </div>
//         )}
//       </section>

//       {/* Past Orders */}
//       <section>
//         <h2 className="text-2xl font-semibold mb-4">📦 Past Orders</h2>
//         {pastOrders.length === 0 ? (
//           <p className="text-gray-500">No past orders.</p>
//         ) : (
//           <div className="grid gap-6 md:grid-cols-2">
//             {pastOrders.map((order) => (
//               <RestaurantOrderCard
//                 key={order._id}
//                 order={order}
//                 past
//                 setOrders={setOrders}
//               />
//             ))}
//           </div>
//         )}
//       </section>
//     </div>
//   );
// };

// export default RestaurantOrders;
