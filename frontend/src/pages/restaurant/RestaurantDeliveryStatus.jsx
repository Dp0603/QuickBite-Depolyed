import React, { useEffect, useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaMotorcycle,
  FaMapMarkerAlt,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaUser,
  FaPhone,
  FaShoppingBag,
  FaChevronDown,
  FaChevronUp,
  FaMapMarked,
  FaSpinner,
  FaFilter,
  FaCalendarAlt,
  FaRupeeSign,
  FaBell,
  FaStore,
  FaTruck,
  FaBox,
  FaRoute,
  FaSync,
} from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import API from "../../api/axios";
import MiniMap from "../../components/MiniMap";

/* ------------------------------- Toast Component ------------------------------- */
const Toast = ({ toasts, remove }) => (
  <div className="fixed z-[9999] top-6 right-6 flex flex-col gap-3 max-w-md">
    <AnimatePresence>
      {toasts.map((t) => (
        <motion.div
          key={t.id}
          initial={{ opacity: 0, x: 100, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 100, scale: 0.8 }}
          className={`flex items-start gap-3 p-4 rounded-xl shadow-2xl text-white backdrop-blur-md border ${
            t.type === "success"
              ? "bg-emerald-500/95 border-emerald-400"
              : t.type === "error"
              ? "bg-red-500/95 border-red-400"
              : "bg-blue-500/95 border-blue-400"
          }`}
        >
          <div className="pt-0.5 text-xl">{t.icon}</div>
          <div className="flex-1">
            <div className="font-bold text-sm">{t.title}</div>
            {t.message && (
              <div className="text-xs opacity-90 mt-1">{t.message}</div>
            )}
          </div>
          <motion.button
            onClick={() => remove(t.id)}
            className="opacity-80 hover:opacity-100 font-bold text-lg"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            ✕
          </motion.button>
        </motion.div>
      ))}
    </AnimatePresence>
  </div>
);

/* ------------------------------- Stat Card ------------------------------- */
const StatCard = ({ icon, value, label, gradient, delay, emoji }) => (
  <motion.div
    className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer"
    initial={{ opacity: 0, scale: 0.9, y: 20 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ delay, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
    whileHover={{ scale: 1.03, y: -5 }}
  >
    <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`}></div>

    <motion.div
      className="absolute inset-0 opacity-10"
      animate={{
        backgroundPosition: ["0% 0%", "100% 100%"],
      }}
      transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
      style={{
        backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
        backgroundSize: "30px 30px",
      }}
    />

    <div className="relative z-10 p-6">
      <div className="flex items-start justify-between mb-4">
        <motion.div
          className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-2xl shadow-lg border border-white/30"
          whileHover={{ rotate: 360, scale: 1.1 }}
          transition={{ duration: 0.6 }}
        >
          {icon}
        </motion.div>
        {emoji && <div className="text-3xl">{emoji}</div>}
      </div>

      <motion.h4
        className="text-4xl font-black text-white drop-shadow-lg mb-2"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: delay + 0.2, type: "spring" }}
      >
        {value}
      </motion.h4>
      <p className="text-white/80 font-semibold text-sm">{label}</p>
    </div>
  </motion.div>
);

/* ------------------------------- Filter Tab ------------------------------- */
const FilterTab = ({ active, onClick, label, count, icon }) => (
  <motion.button
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
      active
        ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg"
        : "bg-white text-gray-700 hover:bg-gray-50 shadow-md"
    }`}
    whileHover={{ scale: active ? 1 : 1.05, y: active ? 0 : -2 }}
    whileTap={{ scale: 0.95 }}
  >
    {icon}
    {label}
    {count > 0 && (
      <span
        className={`px-2 py-0.5 rounded-full text-xs font-black ${
          active ? "bg-white/20" : "bg-gray-200 text-gray-700"
        }`}
      >
        {count}
      </span>
    )}
  </motion.button>
);

/* ------------------------------- Status Badge ------------------------------- */
const StatusBadge = ({ status }) => {
  const statusConfig = {
    Pending: {
      bg: "bg-gray-100 text-gray-700",
      icon: <FaClock />,
      label: "Pending",
    },
    Preparing: {
      bg: "bg-yellow-100 text-yellow-700",
      icon: <FaBox />,
      label: "Preparing",
    },
    "Ready for Pickup": {
      bg: "bg-orange-100 text-orange-700",
      icon: <FaStore />,
      label: "Ready for Pickup",
    },
    "Out for Delivery": {
      bg: "bg-purple-100 text-purple-700",
      icon: <FaMotorcycle />,
      label: "Out for Delivery",
    },
    Delivered: {
      bg: "bg-emerald-100 text-emerald-700",
      icon: <FaCheckCircle />,
      label: "Delivered",
    },
    Cancelled: {
      bg: "bg-red-100 text-red-700",
      icon: <FaTimesCircle />,
      label: "Cancelled",
    },
  };

  const config = statusConfig[status] || statusConfig.Pending;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${config.bg}`}
    >
      {config.icon}
      {config.label}
    </span>
  );
};

/* ------------------------------- Order Card ------------------------------- */
const OrderCard = ({ order, onStatusChange, index }) => {
  const [expanded, setExpanded] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const getDishSummary = (items) => {
    if (!items?.length) return "No items";
    const mapped = items.map(
      (item) => `${item.menuItemId?.name || "Item"} x${item.quantity}`
    );
    if (mapped.length > 3) {
      return mapped.slice(0, 3).join(", ") + `, +${mapped.length - 3} more`;
    }
    return mapped.join(", ");
  };

  const getStatusActions = () => {
    switch (order.status) {
      case "Preparing":
        return (
          <ActionButton
            onClick={() => onStatusChange(order._id, "Ready for Pickup")}
            icon={<FaStore />}
            label="Mark Ready for Pickup"
            color="blue"
          />
        );
      case "Ready for Pickup":
        return (
          <ActionButton
            onClick={() => onStatusChange(order._id, "Out for Delivery")}
            icon={<FaMotorcycle />}
            label="Dispatch for Delivery"
            color="purple"
          />
        );
      case "Out for Delivery":
        return (
          <ActionButton
            onClick={() => onStatusChange(order._id, "Delivered")}
            icon={<FaCheckCircle />}
            label="Mark Delivered"
            color="green"
          />
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-200 overflow-hidden"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.01 }}
    >
      {/* Header */}
      <div className="p-5 bg-gradient-to-r from-gray-50 to-slate-50 border-b border-gray-200">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                #{order._id.slice(-4).toUpperCase()}
              </div>
              <div>
                <h3 className="font-black text-gray-900 text-lg">
                  Order #{order._id.slice(-6).toUpperCase()}
                </h3>
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <FaCalendarAlt className="text-xs" />
                  {new Date(order.createdAt).toLocaleString("en-IN", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-700 font-medium flex items-center gap-2">
              <FaUser className="text-blue-500" />
              {order.customerId?.name || "Guest"}
            </p>

            <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
              <FaMapMarkerAlt className="text-red-500" />
              {order.deliveryAddress || "No address"}
            </p>
          </div>

          <div className="text-right">
            <StatusBadge status={order.status} />
            <div className="mt-2 text-right">
              <p className="text-2xl font-black text-emerald-600">
                ₹{(order.totalAmount || 0).toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 space-y-4">
        {/* Dishes Summary */}
        <div>
          <p className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
            <FaShoppingBag className="text-orange-500" />
            Order Items
          </p>
          <p className="text-sm text-gray-600">{getDishSummary(order.items)}</p>
          {order.items?.length > 3 && (
            <motion.button
              onClick={() => setExpanded(!expanded)}
              className="text-xs text-indigo-600 font-bold mt-2 flex items-center gap-1 hover:text-indigo-700"
              whileHover={{ x: 2 }}
            >
              {expanded ? (
                <>
                  <FaChevronUp />
                  Show Less
                </>
              ) : (
                <>
                  <FaChevronDown />
                  Show All Items
                </>
              )}
            </motion.button>
          )}

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-3 space-y-2"
              >
                {order.items?.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center p-3 rounded-lg bg-gray-50"
                  >
                    <span className="text-sm font-medium text-gray-700">
                      {item.menuItemId?.name || "Item"}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-500">
                        x{item.quantity}
                      </span>
                      <span className="text-sm font-bold text-gray-900">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Rider Info */}
        {order.riderId ? (
          <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {order.riderId.name?.charAt(0).toUpperCase() || "R"}
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900 mb-1">
                  Delivery Partner
                </p>
                <p className="text-sm text-gray-700 font-semibold">
                  {order.riderId.name}
                </p>
                <a
                  href={`tel:${order.riderId.phone}`}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 mt-1"
                >
                  <FaPhone className="text-xs" />
                  {order.riderId.phone}
                </a>
              </div>
              <FaMotorcycle className="text-3xl text-purple-500" />
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-gray-50 border-2 border-gray-200">
            <p className="text-sm text-gray-500 italic text-center">
              No delivery partner assigned yet
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          {getStatusActions()}

          {order.status === "Out for Delivery" &&
            order.riderId?.location?.lat &&
            order.riderId?.location?.lng && (
              <ActionButton
                onClick={() => setShowMap(!showMap)}
                icon={<FaMapMarked />}
                label={showMap ? "Hide Map" : "Track Delivery"}
                color="green"
                outline
              />
            )}
        </div>

        {/* Map */}
        <AnimatePresence>
          {showMap &&
            order.riderId?.location?.lat &&
            order.riderId?.location?.lng && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden rounded-xl border-2 border-emerald-200"
              >
                <MiniMap
                  lat={order.riderId.location.lat}
                  lng={order.riderId.location.lng}
                  riderName={order.riderId.name}
                />
              </motion.div>
            )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

/* ------------------------------- Action Button ------------------------------- */
const ActionButton = ({
  onClick,
  icon,
  label,
  color = "blue",
  outline = false,
}) => {
  const colorClasses = {
    blue: outline
      ? "border-2 border-blue-500 text-blue-600 hover:bg-blue-50"
      : "bg-gradient-to-r from-blue-500 to-cyan-600 text-white hover:shadow-lg",
    purple: outline
      ? "border-2 border-purple-500 text-purple-600 hover:bg-purple-50"
      : "bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:shadow-lg",
    green: outline
      ? "border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50"
      : "bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:shadow-lg",
  };

  return (
    <motion.button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm shadow-md transition-all ${colorClasses[color]}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {icon}
      {label}
    </motion.button>
  );
};

/* ------------------------------- Main Component ------------------------------- */
const RestaurantDeliveryStatus = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [toasts, setToasts] = useState([]);

  /* --------------------- Toast System --------------------- */
  const pushToast = (payload) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, ...payload }]);
    setTimeout(() => removeToast(id), 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  /* --------------------- Fetch Orders --------------------- */
  const fetchOrders = async (showRefreshing = false) => {
    if (showRefreshing) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const res = await API.get(`/orders/orders/restaurant/${user._id}`);
      setOrders(res.data.data || []);
    } catch (err) {
      console.error(
        "Error fetching orders:",
        err.response?.data || err.message
      );
      pushToast({
        type: "error",
        title: "Failed to fetch orders",
        message: "Please try again later",
        icon: <FaExclamationTriangle />,
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchOrders();
      const interval = setInterval(() => fetchOrders(true), 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  /* --------------------- Update Status --------------------- */
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await API.put(`/orders/orders/status/${orderId}`, { status: newStatus });

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );

      pushToast({
        type: "success",
        title: "Status Updated",
        message: `Order status changed to ${newStatus}`,
        icon: <FaCheckCircle />,
      });
    } catch (err) {
      console.error(
        "Failed to update status:",
        err.response?.data || err.message
      );
      pushToast({
        type: "error",
        title: "Update Failed",
        message: "Failed to update order status",
        icon: <FaExclamationTriangle />,
      });
    }
  };

  /* --------------------- Filter Orders --------------------- */
  const filteredOrders =
    filter === "All"
      ? orders
      : orders.filter((order) => order.status === filter);

  /* --------------------- Stats Calculation --------------------- */
  const totalOrders = orders.length;
  const activeDeliveries = orders.filter(
    (o) => o.status === "Out for Delivery"
  ).length;
  const preparing = orders.filter((o) => o.status === "Preparing").length;
  const readyForPickup = orders.filter(
    (o) => o.status === "Ready for Pickup"
  ).length;

  const filterTabs = [
    {
      label: "All Orders",
      value: "All",
      icon: <FaShoppingBag />,
      count: totalOrders,
    },
    {
      label: "Preparing",
      value: "Preparing",
      icon: <FaBox />,
      count: preparing,
    },
    {
      label: "Ready",
      value: "Ready for Pickup",
      icon: <FaStore />,
      count: readyForPickup,
    },
    {
      label: "Out for Delivery",
      value: "Out for Delivery",
      icon: <FaMotorcycle />,
      count: activeDeliveries,
    },
    {
      label: "Delivered",
      value: "Delivered",
      icon: <FaCheckCircle />,
      count: orders.filter((o) => o.status === "Delivered").length,
    },
  ];

  const statCards = [
    {
      icon: <FaShoppingBag />,
      value: totalOrders.toString(),
      label: "Total Orders",
      gradient: "from-blue-500 to-cyan-600",
      emoji: "📦",
    },
    {
      icon: <FaMotorcycle />,
      value: activeDeliveries.toString(),
      label: "Active Deliveries",
      gradient: "from-purple-500 to-pink-600",
      emoji: "🛵",
    },
    {
      icon: <FaBox />,
      value: preparing.toString(),
      label: "Preparing",
      gradient: "from-amber-500 to-orange-600",
      emoji: "👨‍🍳",
    },
    {
      icon: <FaStore />,
      value: readyForPickup.toString(),
      label: "Ready for Pickup",
      gradient: "from-emerald-500 to-teal-600",
      emoji: "✅",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      <Toast toasts={toasts} remove={removeToast} />

      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-8 py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Premium Header */}
        <motion.div
          className="relative overflow-hidden rounded-3xl mb-8 shadow-2xl border border-rose-200"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-600 to-red-600"></div>
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          />

          <motion.div
            className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], x: [0, 20, 0] }}
            transition={{ duration: 8, repeat: Infinity }}
          />

          <div className="relative z-10 p-8 md:p-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <motion.div
                    className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-3xl"
                    animate={{ x: [0, 5, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    🛵
                  </motion.div>
                  <div>
                    <h1 className="text-4xl font-black text-white drop-shadow-lg">
                      Delivery Status
                    </h1>
                    <p className="text-white/90 text-sm font-medium mt-1 flex items-center gap-2">
                      <FaRoute />
                      Track and manage your delivery orders
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.button
                onClick={() => fetchOrders(true)}
                disabled={refreshing}
                className="px-6 py-3 rounded-xl bg-white text-purple-600 font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 w-fit disabled:opacity-50"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: refreshing ? 1 : 1.05 }}
                whileTap={{ scale: refreshing ? 1 : 0.95 }}
              >
                <FaSync className={refreshing ? "animate-spin" : ""} />
                {refreshing ? "Refreshing..." : "Refresh"}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="h-40 rounded-2xl bg-white shadow-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.4, 0.6, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              ))
            : statCards.map((stat, i) => (
                <StatCard
                  key={i}
                  icon={stat.icon}
                  value={stat.value}
                  label={stat.label}
                  gradient={stat.gradient}
                  delay={i * 0.1}
                  emoji={stat.emoji}
                />
              ))}
        </div>

        {/* Filter Tabs */}
        <motion.div
          className="flex flex-wrap gap-3 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {filterTabs.map((tab) => (
            <FilterTab
              key={tab.value}
              active={filter === tab.value}
              onClick={() => setFilter(tab.value)}
              label={tab.label}
              count={tab.count}
              icon={tab.icon}
            />
          ))}
        </motion.div>

        {/* Orders List */}
        <AnimatePresence mode="wait">
          {loading ? (
            <LoadingState key="loading" />
          ) : filteredOrders.length === 0 ? (
            <EmptyState
              key="empty"
              filter={filter}
              onReset={() => setFilter("All")}
            />
          ) : (
            <motion.div
              key="orders"
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {filteredOrders.map((order, index) => (
                <OrderCard
                  key={order._id}
                  order={order}
                  onStatusChange={handleStatusChange}
                  index={index}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Auto-refresh indicator */}
        {!loading && (
          <motion.div
            className="mt-8 p-4 rounded-xl bg-blue-50 border-2 border-blue-200 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex items-center justify-center gap-2 text-sm text-blue-700">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <FaBell className="text-blue-500" />
              </motion.div>
              <span className="font-bold">
                Auto-refreshing every 30 seconds to keep orders up-to-date
              </span>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

/* ------------------------------- Sub Components ------------------------------- */

const LoadingState = () => (
  <div className="flex flex-col items-center justify-center py-20">
    <motion.div
      className="relative w-16 h-16 mb-4"
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
    >
      <div className="absolute inset-0 border-4 border-purple-200 rounded-full"></div>
      <div className="absolute inset-0 border-4 border-purple-600 border-t-transparent rounded-full"></div>
    </motion.div>
    <p className="text-gray-600 font-semibold">Loading delivery orders...</p>
  </div>
);

const EmptyState = ({ filter, onReset }) => (
  <motion.div
    className="flex flex-col items-center justify-center py-20 text-center"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
  >
    <motion.div
      className="text-8xl mb-4"
      animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      🛵
    </motion.div>
    <h4 className="text-2xl font-black text-gray-800 mb-2">
      {filter === "All" ? "No Orders Yet" : `No ${filter} Orders`}
    </h4>
    <p className="text-gray-500 text-lg mb-6">
      {filter === "All"
        ? "Delivery orders will appear here once customers start ordering"
        : `No orders with status "${filter}" at the moment`}
    </p>
    {filter !== "All" && (
      <motion.button
        onClick={onReset}
        className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold shadow-lg hover:shadow-xl transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        View All Orders
      </motion.button>
    )}
  </motion.div>
);

export default RestaurantDeliveryStatus;


// // src/pages/restaurant/RestaurantDeliveryStatus.jsx
// import React, { useEffect, useState, useContext } from "react";
// import { FaMotorcycle, FaMapMarkerAlt } from "react-icons/fa";
// import { AuthContext } from "../../context/AuthContext";
// import API from "../../api/axios"; // ✅ use global axios instance
// import MiniMap from "../../components/MiniMap";

// const statusBadge = {
//   Pending: "bg-gray-100 text-gray-600",
//   Preparing: "bg-yellow-100 text-yellow-600",
//   "Ready for Pickup": "bg-orange-100 text-orange-600",
//   "Out for Delivery": "bg-purple-100 text-purple-700",
//   Delivered: "bg-green-100 text-green-600",
//   Cancelled: "bg-red-100 text-red-600",
//   default: "bg-gray-200 text-gray-500",
// };

// const RestaurantDeliveryStatus = () => {
//   const { user } = useContext(AuthContext);
//   const [orders, setOrders] = useState([]);
//   const [filter, setFilter] = useState("All");
//   const [visibleMapOrderId, setVisibleMapOrderId] = useState(null);

//   // 🔄 Fetch restaurant's orders
//   const fetchOrders = async () => {
//     try {
//       const res = await API.get(`/orders/orders/restaurant/${user._id}`); // ✅ matches backend
//       setOrders(res.data.data || []);
//     } catch (err) {
//       console.error(
//         "❌ Error fetching orders:",
//         err.response?.data || err.message
//       );
//     }
//   };

//   useEffect(() => {
//     if (user?._id) {
//       fetchOrders();
//       const interval = setInterval(fetchOrders, 30000); // Auto-refresh every 30 sec
//       return () => clearInterval(interval);
//     }
//   }, [user]);

//   // ✏️ Update order status
//   const handleStatusChange = async (orderId, newStatus) => {
//     try {
//       await API.put(`/orders/orders/status/${orderId}`, { status: newStatus });

//       setOrders((prevOrders) =>
//         prevOrders.map((order) =>
//           order._id === orderId ? { ...order, status: newStatus } : order
//         )
//       );
//     } catch (err) {
//       console.error(
//         "❌ Failed to update order status:",
//         err.response?.data || err.message
//       );
//     }
//   };

//   // Filtered orders
//   const filteredOrders =
//     filter === "All"
//       ? orders
//       : orders.filter((order) => order.status === filter);

//   // 📌 Format dish summary nicely
//   const getDishSummary = (items) => {
//     if (!items?.length) return "No items";
//     const mapped = items.map(
//       (item) => `${item.menuItemId?.name || "Item"} x${item.quantity}`
//     );
//     if (mapped.length > 3) {
//       return mapped.slice(0, 3).join(", ") + `, +${mapped.length - 3} more`;
//     }
//     return mapped.join(", ");
//   };

//   return (
//     <div className="p-6 text-gray-800 dark:text-white">
//       <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
//         <FaMotorcycle className="text-orange-500" />
//         Delivery Status / Dispatch
//       </h2>

//       {/* 📊 Filter dropdown */}
//       <div className="mb-6">
//         <label className="font-medium mr-2">Filter by Status:</label>
//         <select
//           value={filter}
//           onChange={(e) => setFilter(e.target.value)}
//           className="border px-3 py-1 rounded text-sm"
//         >
//           <option value="All">All</option>
//           <option value="Preparing">Preparing</option>
//           <option value="Ready for Pickup">Ready for Pickup</option>
//           <option value="Out for Delivery">Out for Delivery</option>
//           <option value="Delivered">Delivered</option>
//           <option value="Cancelled">Cancelled</option>
//         </select>
//       </div>

//       {filteredOrders.length === 0 ? (
//         <p className="text-gray-500 dark:text-gray-400">
//           No delivery orders found.
//         </p>
//       ) : (
//         <div className="grid gap-5">
//           {filteredOrders.map((order) => {
//             const badgeStyle =
//               statusBadge[order.status] || statusBadge["default"];
//             const dishSummary = getDishSummary(order.items);

//             return (
//               <div
//                 key={order._id}
//                 className="bg-white dark:bg-secondary rounded-xl shadow hover:shadow-lg transition p-5 flex flex-col md:flex-row justify-between gap-4"
//               >
//                 {/* Left side */}
//                 <div className="flex-1 space-y-1">
//                   <h3 className="text-lg font-semibold">
//                     Order{" "}
//                     <span className="text-primary font-bold">
//                       #{order._id.slice(-6).toUpperCase()}
//                     </span>{" "}
//                     —{" "}
//                     <span className="text-gray-700 dark:text-gray-300">
//                       {dishSummary}
//                     </span>
//                   </h3>
//                   <p className="text-sm text-gray-600 dark:text-gray-300">
//                     Customer: <strong>{order.customerId?.name || "N/A"}</strong>
//                   </p>
//                   <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
//                     <FaMapMarkerAlt className="text-orange-500" />
//                     {order.deliveryAddress}
//                   </p>
//                   <p className="text-xs text-gray-400">
//                     {new Date(order.createdAt).toLocaleString()}
//                   </p>
//                 </div>

//                 {/* Right side */}
//                 <div className="md:text-right text-sm">
//                   <span
//                     className={`inline-block px-3 py-1 rounded-full font-medium text-sm ${badgeStyle}`}
//                   >
//                     {order.status}
//                   </span>

//                   {/* Status actions */}
//                   {order.status === "Preparing" && (
//                     <button
//                       onClick={() =>
//                         handleStatusChange(order._id, "Ready for Pickup")
//                       }
//                       className="mt-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
//                     >
//                       Mark as Ready for Pickup
//                     </button>
//                   )}

//                   {order.status === "Ready for Pickup" && (
//                     <button
//                       onClick={() =>
//                         handleStatusChange(order._id, "Out for Delivery")
//                       }
//                       className="mt-2 bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
//                     >
//                       Mark as Out for Delivery
//                     </button>
//                   )}

//                   {order.status === "Out for Delivery" && (
//                     <button
//                       onClick={() => handleStatusChange(order._id, "Delivered")}
//                       className="mt-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
//                     >
//                       Mark as Delivered
//                     </button>
//                   )}

//                   {/* Rider Info */}
//                   {order.riderId ? (
//                     <div className="mt-2 text-gray-600 dark:text-gray-300 space-y-1">
//                       <p>
//                         Rider: <strong>{order.riderId.name}</strong>
//                       </p>
//                       <p>
//                         Contact:{" "}
//                         <a
//                           href={`tel:${order.riderId.phone}`}
//                           className="text-blue-600 hover:underline"
//                         >
//                           {order.riderId.phone}
//                         </a>
//                       </p>
//                     </div>
//                   ) : (
//                     <p className="mt-2 text-gray-400 italic">
//                       No rider assigned
//                     </p>
//                   )}

//                   {/* 🗺️ Track Order */}
//                   {order.status === "Out for Delivery" && (
//                     <div className="mt-3">
//                       {order.riderId?.location?.lat &&
//                       order.riderId?.location?.lng ? (
//                         <>
//                           <button
//                             onClick={() =>
//                               setVisibleMapOrderId(
//                                 visibleMapOrderId === order._id
//                                   ? null
//                                   : order._id
//                               )
//                             }
//                             className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
//                           >
//                             {visibleMapOrderId === order._id
//                               ? "Hide Map"
//                               : "Track Order"}
//                           </button>

//                           {visibleMapOrderId === order._id && (
//                             <div className="mt-2">
//                               <MiniMap
//                                 lat={order.riderId.location.lat}
//                                 lng={order.riderId.location.lng}
//                                 riderName={order.riderId.name}
//                               />
//                             </div>
//                           )}
//                         </>
//                       ) : (
//                         <p className="text-gray-400 italic">
//                           Rider location not available
//                         </p>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// };

// export default RestaurantDeliveryStatus;
