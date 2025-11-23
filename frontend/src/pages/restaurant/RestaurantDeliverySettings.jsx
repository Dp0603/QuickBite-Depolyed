import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTruck,
  FaShoppingBag,
  FaDollarSign,
  FaShoppingCart,
  FaClock,
  FaMapMarkerAlt,
  FaSave,
  FaCheckCircle,
  FaExclamationTriangle,
  FaToggleOn,
  FaToggleOff,
  FaSpinner,
  FaInfoCircle,
  FaPercentage,
  FaRulerCombined,
  FaBolt,
  FaChartLine,
  FaTimesCircle,
} from "react-icons/fa";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";

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
const StatCard = ({ icon, value, label, gradient, delay, emoji, active }) => (
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

      <p className="text-white/80 font-semibold text-sm mb-1">{label}</p>
      <motion.h4
        className="text-4xl font-black text-white drop-shadow-lg mb-2"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: delay + 0.2, type: "spring" }}
      >
        {value}
      </motion.h4>
      {active !== undefined && (
        <div className="flex items-center gap-2">
          {active ? (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/20 text-white text-xs font-bold">
              <FaCheckCircle />
              Active
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/10 text-white/70 text-xs font-bold">
              <FaTimesCircle />
              Inactive
            </span>
          )}
        </div>
      )}
    </div>
  </motion.div>
);

/* ------------------------------- Input Components ------------------------------- */
const Input = ({ label, name, value, onChange, type = "text", icon, placeholder, suffix }) => (
  <div className="space-y-2">
    <label className="block text-sm font-bold text-gray-700">{label}</label>
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </div>
      )}
      <input
        type={type}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full ${
          icon ? "pl-10" : "pl-4"
        } ${suffix ? "pr-12" : "pr-4"} py-3 rounded-xl border-2 border-gray-300 focus:border-indigo-500 focus:outline-none transition-colors font-medium`}
      />
      {suffix && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">
          {suffix}
        </div>
      )}
    </div>
  </div>
);

const Toggle = ({ label, checked, onChange, description, icon }) => (
  <motion.div
    className="p-5 rounded-xl bg-gradient-to-br from-gray-50 to-slate-50 hover:from-indigo-50 hover:to-purple-50 border-2 border-gray-200 hover:border-indigo-300 transition-all cursor-pointer"
    whileHover={{ scale: 1.02 }}
    onClick={onChange}
  >
    <div className="flex items-start gap-4">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-white shadow-md flex items-center justify-center">
            {icon}
          </div>
          <h4 className="font-black text-gray-900 text-lg">{label}</h4>
        </div>
        {description && (
          <p className="text-sm text-gray-600 ml-13">{description}</p>
        )}
      </div>
      <motion.div
        className="flex-shrink-0"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {checked ? (
          <FaToggleOn className="text-5xl text-emerald-500" />
        ) : (
          <FaToggleOff className="text-5xl text-gray-400" />
        )}
      </motion.div>
    </div>
  </motion.div>
);

/* ------------------------------- Info Card ------------------------------- */
const InfoCard = ({ icon, title, description, color = "blue" }) => {
  const colorClasses = {
    blue: "from-blue-50 to-indigo-50 border-blue-200",
    green: "from-emerald-50 to-teal-50 border-emerald-200",
    amber: "from-amber-50 to-orange-50 border-amber-200",
    purple: "from-purple-50 to-pink-50 border-purple-200",
  };

  return (
    <motion.div
      className={`p-4 rounded-xl bg-gradient-to-br border-2 ${colorClasses[color]}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-start gap-3">
        <div className="text-2xl">{icon}</div>
        <div className="flex-1">
          <p className="font-bold text-gray-900 mb-1">{title}</p>
          <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
        </div>
      </div>
    </motion.div>
  );
};

/* ------------------------------- Main Component ------------------------------- */
const RestaurantDeliverySettings = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toasts, setToasts] = useState([]);

  const [deliveryEnabled, setDeliveryEnabled] = useState(true);
  const [pickupEnabled, setPickupEnabled] = useState(true);
  const [deliveryFee, setDeliveryFee] = useState(5);
  const [minOrder, setMinOrder] = useState(20);
  const [deliveryTime, setDeliveryTime] = useState("30-45 mins");
  const [deliveryRadius, setDeliveryRadius] = useState(5);
  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState(0);

  /* --------------------- Toast System --------------------- */
  const pushToast = (payload) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, ...payload }]);
    setTimeout(() => removeToast(id), 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  /* --------------------- Fetch Settings --------------------- */
  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await API.get("/restaurants/restaurants/settings/me");
      const settings = res.data?.deliverySettings;

      if (settings) {
        setDeliveryEnabled(settings.deliveryEnabled ?? true);
        setPickupEnabled(settings.pickupEnabled ?? true);
        setDeliveryFee(settings.deliveryFee ?? 5);
        setMinOrder(settings.minOrder ?? 20);
        setDeliveryTime(settings.deliveryTime ?? "30-45 mins");
        setDeliveryRadius(settings.deliveryRadius ?? 5);
        setFreeDeliveryThreshold(settings.freeDeliveryThreshold ?? 0);
      }
    } catch (err) {
      console.error("Error fetching delivery settings:", err.response?.data || err.message);
      pushToast({
        type: "error",
        title: "Failed to load settings",
        message: "Please try again later",
        icon: <FaExclamationTriangle />,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchSettings();
    }
  }, [user]);

  /* --------------------- Save Settings --------------------- */
  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await API.put("/restaurants/restaurants/settings/delivery", {
        deliveryEnabled,
        pickupEnabled,
        deliveryFee: Number(deliveryFee),
        minOrder: Number(minOrder),
        deliveryTime,
        deliveryRadius: Number(deliveryRadius),
        freeDeliveryThreshold: Number(freeDeliveryThreshold),
      });

      pushToast({
        type: "success",
        title: "Settings Saved",
        message: "Delivery settings updated successfully",
        icon: <FaCheckCircle />,
      });

      // Refresh settings
      await fetchSettings();
    } catch (err) {
      console.error("Failed to save settings:", err.response?.data || err.message);
      pushToast({
        type: "error",
        title: "Save Failed",
        message: err.response?.data?.message || "Failed to update settings",
        icon: <FaExclamationTriangle />,
      });
    } finally {
      setSaving(false);
    }
  };

  const statCards = [
    {
      icon: <FaTruck />,
      value: deliveryEnabled ? "Active" : "Inactive",
      label: "Delivery Service",
      gradient: "from-blue-500 to-cyan-600",
      emoji: "🚚",
      active: deliveryEnabled,
    },
    {
      icon: <FaShoppingBag />,
      value: pickupEnabled ? "Active" : "Inactive",
      label: "Pickup Service",
      gradient: "from-emerald-500 to-teal-600",
      emoji: "🛍️",
      active: pickupEnabled,
    },
    {
      icon: <FaDollarSign />,
      value: `₹${deliveryFee}`,
      label: "Delivery Fee",
      gradient: "from-amber-500 to-orange-600",
      emoji: "💰",
    },
    {
      icon: <FaClock />,
      value: deliveryTime,
      label: "Delivery Time",
      gradient: "from-purple-500 to-pink-600",
      emoji: "⏰",
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
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-600"></div>
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
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <motion.div
                  className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-3xl"
                  animate={{ x: [0, 10, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  🚚
                </motion.div>
                <div>
                  <h1 className="text-4xl font-black text-white drop-shadow-lg">
                    Delivery Settings
                  </h1>
                  <p className="text-white/90 text-sm font-medium mt-1">
                    Configure delivery options and fees for your restaurant
                  </p>
                </div>
              </div>
            </motion.div>
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
                  active={stat.active}
                />
              ))}
        </div>

        {/* Loading State */}
        {loading ? (
          <LoadingState />
        ) : (
          <div className="space-y-8">
            {/* Info Banner */}
            <InfoCard
              icon="💡"
              title="Delivery Configuration"
              description="Enable or disable delivery services, set fees, and configure delivery options to match your restaurant's capabilities"
              color="blue"
            />

            {/* Service Toggles */}
            <motion.div
              className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="p-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                <h3 className="text-2xl font-black flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                    <FaBolt />
                  </div>
                  Service Options
                </h3>
              </div>

              <div className="p-6 space-y-4">
                <Toggle
                  label="Enable Delivery Service"
                  checked={deliveryEnabled}
                  onChange={() => setDeliveryEnabled(!deliveryEnabled)}
                  description="Allow customers to get food delivered to their location"
                  icon={<FaTruck className="text-blue-500" />}
                />

                <Toggle
                  label="Enable Pickup Service"
                  checked={pickupEnabled}
                  onChange={() => setPickupEnabled(!pickupEnabled)}
                  description="Allow customers to pick up orders from your restaurant"
                  icon={<FaShoppingBag className="text-emerald-500" />}
                />
              </div>
            </motion.div>

            {/* Delivery Configuration */}
            <motion.div
              className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="p-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
                <h3 className="text-2xl font-black flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                    <FaTruck />
                  </div>
                  Delivery Configuration
                </h3>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Delivery Fee"
                    name="deliveryFee"
                    value={deliveryFee}
                    onChange={(e) => setDeliveryFee(e.target.value)}
                    type="number"
                    icon={<FaDollarSign />}
                    placeholder="5"
                    suffix="₹"
                  />

                  <Input
                    label="Minimum Order Amount"
                    name="minOrder"
                    value={minOrder}
                    onChange={(e) => setMinOrder(e.target.value)}
                    type="number"
                    icon={<FaShoppingCart />}
                    placeholder="20"
                    suffix="₹"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Delivery Radius"
                    name="deliveryRadius"
                    value={deliveryRadius}
                    onChange={(e) => setDeliveryRadius(e.target.value)}
                    type="number"
                    icon={<FaMapMarkerAlt />}
                    placeholder="5"
                    suffix="km"
                  />

                  <Input
                    label="Estimated Delivery Time"
                    name="deliveryTime"
                    value={deliveryTime}
                    onChange={(e) => setDeliveryTime(e.target.value)}
                    type="text"
                    icon={<FaClock />}
                    placeholder="30-45 mins"
                  />
                </div>

                <Input
                  label="Free Delivery Threshold (Optional)"
                  name="freeDeliveryThreshold"
                  value={freeDeliveryThreshold}
                  onChange={(e) => setFreeDeliveryThreshold(e.target.value)}
                  type="number"
                  icon={<FaPercentage />}
                  placeholder="0 (disabled)"
                  suffix="₹"
                />

                <div className="p-4 rounded-xl bg-amber-50 border-2 border-amber-200">
                  <div className="flex items-start gap-3">
                    <FaInfoCircle className="text-amber-500 text-xl mt-0.5" />
                    <div className="text-sm text-amber-700">
                      <p className="font-bold mb-1">Free Delivery Info:</p>
                      <p>
                        Set a minimum order value for free delivery. Leave at 0 to disable free delivery.
                        Example: Set ₹500 to offer free delivery on orders above ₹500.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Save Button */}
            <motion.div
              className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <motion.button
                onClick={handleSave}
                disabled={saving}
                className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                whileHover={{ scale: saving ? 1 : 1.02 }}
                whileTap={{ scale: saving ? 1 : 0.98 }}
              >
                {saving ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Saving Settings...
                  </>
                ) : (
                  <>
                    <FaSave />
                    Save Delivery Settings
                  </>
                )}
              </motion.button>
            </motion.div>

            {/* Insights */}
            <motion.div
              className="p-6 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white shadow-2xl relative overflow-hidden"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
            >
              <motion.div
                className="absolute inset-0 opacity-20"
                animate={{
                  background: [
                    "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.8) 0%, transparent 50%)",
                    "radial-gradient(circle at 80% 50%, rgba(255,255,255,0.8) 0%, transparent 50%)",
                    "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.8) 0%, transparent 50%)",
                  ],
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />

              <div className="relative z-10">
                <h3 className="text-2xl font-black mb-4 flex items-center gap-2">
                  <FaChartLine />
                  Delivery Insights
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                    <p className="text-white/80 text-sm font-semibold mb-1">
                      Coverage Area
                    </p>
                    <p className="text-3xl font-black">
                      {deliveryRadius} km
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                    <p className="text-white/80 text-sm font-semibold mb-1">
                      Min. Order
                    </p>
                    <p className="text-3xl font-black">₹{minOrder}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                    <p className="text-white/80 text-sm font-semibold mb-1">
                      Avg. Delivery
                    </p>
                    <p className="text-3xl font-black">{deliveryTime}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
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
      <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
      <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full"></div>
    </motion.div>
    <p className="text-gray-600 font-semibold">Loading delivery settings...</p>
  </div>
);

export default RestaurantDeliverySettings;

// import React, { useState, useEffect, useContext } from "react";
// import { FaCog, FaDollarSign, FaShoppingCart, FaClock } from "react-icons/fa";
// import API from "../../api/axios"; // ✅ use the global axios instance
// import { AuthContext } from "../../context/AuthContext"; // ✅ get logged-in restaurant

// const RestaurantDeliverySettings = () => {
//   const { user } = useContext(AuthContext);
//   const [deliveryEnabled, setDeliveryEnabled] = useState(true);
//   const [pickupEnabled, setPickupEnabled] = useState(true);
//   const [deliveryFee, setDeliveryFee] = useState(5);
//   const [minOrder, setMinOrder] = useState(20);
//   const [deliveryTime, setDeliveryTime] = useState("30-45 mins");

//   // 🔄 Fetch current delivery settings on mount
//   const fetchSettings = async () => {
//     try {
//       const res = await API.get("/restaurants/restaurants/settings/me");
//       const settings = res.data?.deliverySettings; // ✅ match backend response

//       if (settings) {
//         setDeliveryEnabled(settings.deliveryEnabled ?? true);
//         setPickupEnabled(settings.pickupEnabled ?? true);
//         setDeliveryFee(settings.deliveryFee ?? 5);
//         setMinOrder(settings.minOrder ?? 20);
//         setDeliveryTime(settings.deliveryTime ?? "30-45 mins");
//       }
//     } catch (err) {
//       console.error(
//         "❌ Error fetching delivery settings:",
//         err.response?.data || err.message
//       );
//     }
//   };

//   useEffect(() => {
//     if (user?._id) {
//       fetchSettings();
//     }
//   }, [user]);

//   // ✏️ Save delivery settings
//   const handleSave = async () => {
//     try {
//       const res = await API.put("/restaurants/restaurants/settings/delivery", {
//         deliveryEnabled,
//         pickupEnabled,
//         deliveryFee,
//         minOrder,
//         deliveryTime,
//       });

//       alert("✅ Delivery settings saved successfully!");
//       console.log("Response:", res.data);
//     } catch (err) {
//       console.error(
//         "❌ Failed to save settings:",
//         err.response?.data || err.message
//       );
//       alert("❌ Failed to save settings.");
//     }
//   };

//   return (
//     <div className="p-6 text-gray-800 dark:text-white bg-white dark:bg-secondary rounded-xl shadow">
//       <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
//         <FaCog className="text-blue-500" />
//         Delivery Settings
//       </h2>

//       {/* Enable Toggles */}
//       <div className="grid md:grid-cols-2 gap-6">
//         <div className="flex items-center gap-3">
//           <input
//             type="checkbox"
//             checked={deliveryEnabled}
//             onChange={() => setDeliveryEnabled(!deliveryEnabled)}
//             className="w-5 h-5 accent-blue-600"
//           />
//           <label className="font-medium">Enable Delivery</label>
//         </div>

//         <div className="flex items-center gap-3">
//           <input
//             type="checkbox"
//             checked={pickupEnabled}
//             onChange={() => setPickupEnabled(!pickupEnabled)}
//             className="w-5 h-5 accent-blue-600"
//           />
//           <label className="font-medium">Enable Pickup</label>
//         </div>
//       </div>

//       {/* Numeric Inputs */}
//       <div className="mt-6 grid md:grid-cols-2 gap-6">
//         <div>
//           <label className="block text-sm font-medium mb-1 flex items-center gap-2">
//             <FaDollarSign className="text-green-600" /> Delivery Fee ($)
//           </label>
//           <input
//             type="number"
//             value={deliveryFee}
//             onChange={(e) => setDeliveryFee(Number(e.target.value))}
//             className="w-full border rounded px-3 py-2 text-gray-800 dark:text-black"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium mb-1 flex items-center gap-2">
//             <FaShoppingCart className="text-orange-600" /> Minimum Order Amount
//             ($)
//           </label>
//           <input
//             type="number"
//             value={minOrder}
//             onChange={(e) => setMinOrder(Number(e.target.value))}
//             className="w-full border rounded px-3 py-2 text-gray-800 dark:text-black"
//           />
//         </div>
//       </div>

//       {/* Delivery Time */}
//       <div className="mt-6">
//         <label className="block text-sm font-medium mb-1 flex items-center gap-2">
//           <FaClock className="text-purple-600" /> Estimated Delivery Time
//         </label>
//         <input
//           type="text"
//           value={deliveryTime}
//           onChange={(e) => setDeliveryTime(e.target.value)}
//           className="w-full border rounded px-3 py-2 text-gray-800 dark:text-black"
//           placeholder="e.g., 30-45 mins"
//         />
//       </div>

//       {/* Save Button */}
//       <div className="mt-8">
//         <button
//           onClick={handleSave}
//           className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
//         >
//           Save Settings
//         </button>
//       </div>
//     </div>
//   );
// };

// export default RestaurantDeliverySettings;
