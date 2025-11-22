import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaMotorcycle,
  FaCog,
  FaChevronDown,
  FaChevronUp,
  FaTruck,
  FaMapMarkedAlt,
  FaClock,
  FaCheckCircle,
} from "react-icons/fa";
import RestaurantDeliverySettings from "./RestaurantDeliverySettings";
import RestaurantDeliveryStatus from "./RestaurantDeliveryStatus";

const RestaurantDelivery = () => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
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
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600"></div>
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          />

          {/* Animated circles */}
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
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    🚚
                  </motion.div>
                  <div>
                    <h1 className="text-4xl font-black text-white drop-shadow-lg">
                      Delivery Management
                    </h1>
                    <p className="text-white/90 text-sm font-medium mt-1">
                      Manage your delivery settings and track live status
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.button
                onClick={() => setShowSettings(!showSettings)}
                className="px-8 py-4 rounded-xl bg-white/95 backdrop-blur-xl shadow-2xl font-bold text-indigo-600 hover:bg-white transition-all flex items-center gap-3 border border-white/50"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <FaCog
                  className={`transition-transform ${
                    showSettings ? "rotate-180" : ""
                  }`}
                />
                {showSettings ? "Hide Settings" : "Configure Settings"}
                {showSettings ? <FaChevronUp /> : <FaChevronDown />}
              </motion.button>
            </div>

            {/* Quick Stats */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <StatCard
                icon={<FaMotorcycle />}
                label="Delivery Mode"
                gradient="from-emerald-500 to-teal-600"
              />
              <StatCard
                icon={<FaTruck />}
                label="Active Deliveries"
                gradient="from-blue-500 to-cyan-600"
              />
              <StatCard
                icon={<FaMapMarkedAlt />}
                label="Coverage Area"
                gradient="from-rose-500 to-pink-600"
              />
              <StatCard
                icon={<FaClock />}
                label="Avg Delivery Time"
                gradient="from-amber-500 to-orange-600"
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Live Status Section */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-2">
              <motion.div
                className="w-3 h-3 rounded-full bg-emerald-500 shadow-lg"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [1, 0.8, 1],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <h2 className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Live Delivery Status
              </h2>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
          >
            <RestaurantDeliveryStatus />
          </motion.div>
        </motion.div>

        {/* Settings Section - Collapsible */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden mb-8"
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="p-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-b-2 border-indigo-400">
                  <h2 className="text-2xl font-black flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <FaCog />
                    </div>
                    Delivery Configuration
                  </h2>
                  <p className="text-white/80 text-sm mt-2">
                    Customize your delivery zones, fees, and timing
                  </p>
                </div>

                <div className="p-6">
                  <RestaurantDeliverySettings />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Info Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <InfoCard
            icon={<FaCheckCircle />}
            title="Seamless Integration"
            description="Delivery settings apply automatically to all new orders"
            gradient="from-emerald-500 to-teal-600"
          />
          <InfoCard
            icon={<FaMapMarkedAlt />}
            title="Zone-Based Pricing"
            description="Set different delivery fees for different areas"
            gradient="from-blue-500 to-cyan-600"
          />
          <InfoCard
            icon={<FaClock />}
            title="Real-Time Tracking"
            description="Monitor all active deliveries in one place"
            gradient="from-rose-500 to-pink-600"
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

/* ------------------------------- Sub Components ------------------------------- */

const StatCard = ({ icon, label, gradient }) => (
  <motion.div
    className="px-5 py-4 rounded-xl bg-white/90 backdrop-blur-md shadow-lg border border-white/50"
    whileHover={{ scale: 1.05, y: -2 }}
  >
    <div className="flex items-center gap-3">
      <div
        className={`w-10 h-10 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-md`}
      >
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-600 font-semibold">{label}</p>
        <p className="text-lg font-black text-gray-800">--</p>
      </div>
    </div>
  </motion.div>
);

const InfoCard = ({ icon, title, description, gradient }) => (
  <motion.div
    className="p-6 rounded-2xl bg-white shadow-lg border-2 border-gray-200 hover:border-indigo-300 transition-all"
    whileHover={{ y: -4, scale: 1.02 }}
  >
    <div className="flex items-start gap-4">
      <div
        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-xl shadow-lg flex-shrink-0`}
      >
        {icon}
      </div>
      <div>
        <h3 className="font-black text-lg text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
      </div>
    </div>
  </motion.div>
);

export default RestaurantDelivery;


// // src/pages/restaurant/RestaurantDelivery.jsx
// import React, { useState } from "react";
// import { FaCog, FaMotorcycle } from "react-icons/fa";
// import RestaurantDeliverySettings from "./RestaurantDeliverySettings";
// import RestaurantDeliveryStatus from "./RestaurantDeliveryStatus";

// const RestaurantDelivery = () => {
//   const [showSettings, setShowSettings] = useState(false);

//   return (
//     <div className="p-6 text-gray-800 dark:text-white">
//       {/* Page Title */}
//       <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
//         <FaMotorcycle className="text-orange-500" />
//         Delivery Management
//       </h1>

//       {/* Status Section - always visible */}
//       <section className="mb-8">
//         <h2 className="text-xl font-semibold mb-3">📡 Live Status</h2>
//         <RestaurantDeliveryStatus />
//       </section>

//       {/* Toggle Settings */}
//       <div className="mb-6">
//         <button
//           onClick={() => setShowSettings(!showSettings)}
//           className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg shadow transition"
//         >
//           <FaCog />
//           {showSettings
//             ? "Hide Delivery Settings"
//             : "Configure Delivery Settings"}
//         </button>
//       </div>

//       {/* Settings Section - toggled */}
//       {showSettings && (
//         <section>
//           <RestaurantDeliverySettings />
//         </section>
//       )}
//     </div>
//   );
// };

// export default RestaurantDelivery;
