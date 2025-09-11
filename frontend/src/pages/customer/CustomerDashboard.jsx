import React, { useEffect, useState, useContext, useMemo, useRef } from "react";
import {
  FaCrown,
  FaStar,
  FaShoppingCart,
  FaClock,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaHourglassHalf,
  FaTimesCircle,
  FaSearch,
  FaRedo,
  FaTruck,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { motion, useMotionValue, animate } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import API from "../../api/axios";

/* ----------------------------- Small Utilities ---------------------------- */
const useTimeGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Morning";
  if (h < 18) return "Afternoon";
  return "Evening";
};

const useCountUp = (to = 0, duration = 0.8) => {
  const mv = useMotionValue(0);
  const [val, setVal] = useState(0);
  useEffect(() => {
    const controls = animate(mv, to, {
      duration,
      ease: "easeOut",
      onUpdate: (v) => setVal(v),
    });
    return () => controls.stop();
  }, [to]);
  return Math.round(val);
};

const currency = (n) =>
  typeof n === "number"
    ? n.toLocaleString("en-IN", { maximumFractionDigits: 0 })
    : n;

/* ------------------------------- Main Screen ------------------------------ */
const CustomerDashboard = () => {
  const { user, token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [premium, setPremium] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const greeting = useTimeGreeting();

  // Fetch Orders
  useEffect(() => {
    if (user?._id) {
      API.get(`/orders/orders/customer/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          setOrders(res.data.orders || []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [user, token]);

  // Fetch Reviews
  useEffect(() => {
    API.get(`/reviews/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        const reviews = Array.isArray(res.data) ? res.data : [];
        if (reviews.length) {
          const avg =
            reviews.reduce((sum, r) => sum + (r?.rating || 0), 0) /
            reviews.length;
          setAverageRating(Number(avg.toFixed(1)));
        }
      })
      .catch(() => {});
  }, [token]);

  // Fetch Restaurants
  useEffect(() => {
    API.get(`/restaurants/restaurants`)
      .then((res) => {
        const list = res.data?.restaurants || [];
        const top = list
          .slice()
          .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
          .slice(0, 12);
        setRecommended(top);
      })
      .catch(() => {});
  }, []);

  // Fetch Premium
  useEffect(() => {
    if (user?._id) {
      API.get(`/premium/subscriptions`, {
        params: { subscriberId: user._id, subscriberType: "Customer" },
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          const subs = res.data?.subscriptions || [];
          if (subs.length) setPremium(subs[0]);
        })
        .catch(() => {});
    }
  }, [user, token]);

  /* --------------------------- Numbers to Animate -------------------------- */
  const ordersCount = useCountUp(orders.length, 0.9);
  const savingsCount = useCountUp(premium?.totalSavings || 0, 1);
  const ratingCount = useMemo(
    () => (averageRating ? averageRating.toFixed(1) : "0.0"),
    [averageRating]
  );

  /* ------------------------ Active Order --------------------- */
  const activeOrder = orders.find(
    (o) =>
      o.status &&
      o.status.toLowerCase() !== "delivered" &&
      o.status.toLowerCase() !== "cancelled"
  );

  /* ------------------------ Carousel Scroll --------------------- */
  const railRef = useRef(null);
  const scrollCarousel = (dir) => {
    if (railRef.current) {
      railRef.current.scrollBy({ left: dir * 300, behavior: "smooth" });
    }
  };

  return (
    <motion.div
      className="px-4 sm:px-8 md:px-10 lg:px-12 py-8 text-gray-800 dark:text-white"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/* HERO */}
      <div className="relative overflow-hidden rounded-2xl shadow-brand-lg mb-8">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(120deg, rgba(0,0,0,0.65), rgba(0,0,0,0.25)), url('/hero/food-banner.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative z-10 p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow">
            Good {greeting}, {user?.name?.split(" ")[0] || "Foodie"} 👋
          </h2>
          <p className="text-white/90 mt-1">
            Your daily taste of <span className="font-semibold">QuickBite</span>
          </p>

          {/* Quick Actions */}
          <div className="flex gap-3 mt-5 flex-wrap">
            <button
              onClick={() => navigate("/customer/browse")}
              className="flex items-center gap-2 bg-white text-primary px-4 py-2 rounded-lg font-semibold shadow hover:bg-gray-50"
            >
              <FaSearch /> Search Food
            </button>
            {orders.length > 0 && (
              <button
                onClick={() =>
                  navigate(`/restaurant/${orders[0].restaurantId?._id}/menu`)
                }
                className="flex items-center gap-2 bg-white text-primary px-4 py-2 rounded-lg font-semibold shadow hover:bg-gray-50"
              >
                <FaRedo /> Reorder Last
              </button>
            )}
            {activeOrder && (
              <button
                onClick={() => navigate(`/order/${activeOrder._id}`)}
                className="flex items-center gap-2 bg-white text-primary px-4 py-2 rounded-lg font-semibold shadow hover:bg-gray-50"
              >
                <FaTruck /> Track Current Order
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Current Order Tracker */}
      {activeOrder && (
        <div className="mb-8 p-4 bg-primary/10 rounded-xl shadow">
          <h4 className="font-semibold flex items-center gap-2">
            <FaTruck /> Your order is on the way!
          </h4>
          <p className="text-sm mt-1">
            {activeOrder.items.map((it) => it?.menuItemId?.name).join(", ")}
          </p>
          <div className="mt-3 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div className="bg-primary h-2 w-2/3"></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            ETA:{" "}
            {new Date(activeOrder.estimatedDelivery).toLocaleTimeString(
              "en-IN"
            )}
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
        <GradientTile onClick={() => navigate("/customer/orders")}>
          <TileContent
            icon={<FaShoppingCart className="text-primary text-xl" />}
            title={`${ordersCount} Orders`}
            subtitle="Last orders"
          />
        </GradientTile>
        <GradientTile onClick={() => navigate("/customer/premium")}>
          <TileContent
            icon={<FaCrown className="text-yellow-500 text-xl" />}
            title={`₹${currency(savingsCount)} Saved`}
            subtitle="Using Premium"
          />
        </GradientTile>
        <GradientTile onClick={() => navigate("/customer/reviews")}>
          <TileContent
            icon={<FaStar className="text-yellow-400 text-xl" />}
            title={`${ratingCount} Rating`}
            subtitle="From your reviews"
          />
        </GradientTile>
      </div>

      {/* Recommended */}
      <div className="mb-12 relative">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">🍽️ Recommended for You</h3>
          <button
            onClick={() => navigate("/customer/browse")}
            className="text-primary hover:underline text-sm font-medium"
          >
            View All →
          </button>
        </div>
        <button
          onClick={() => scrollCarousel(-1)}
          className="absolute -left-4 top-1/3 bg-white shadow p-2 rounded-full z-10"
        >
          <FaChevronLeft />
        </button>
        <button
          onClick={() => scrollCarousel(1)}
          className="absolute -right-4 top-1/3 bg-white shadow p-2 rounded-full z-10"
        >
          <FaChevronRight />
        </button>
        <div
          ref={railRef}
          className="flex gap-5 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory"
        >
          {recommended.map((res) => (
            <motion.div
              key={res._id}
              whileHover={{ scale: 1.03 }}
              onClick={() => navigate(`/restaurant/${res._id}/menu`)}
              className="min-w-[260px] snap-start rounded-xl shadow hover:shadow-brand cursor-pointer bg-white dark:bg-secondary overflow-hidden"
            >
              <div className="relative h-40">
                <img
                  src={res.logo || "/QuickBite.png"}
                  alt={res.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <FaStar className="text-yellow-300" />
                  {res.averageRating?.toFixed(1) || "4.5"}
                </div>
                {res.discount && (
                  <div className="absolute bottom-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
                    {res.discount}% OFF
                  </div>
                )}
              </div>
              <div className="p-4">
                <h4 className="font-semibold truncate">{res.name}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-300 flex items-center gap-1">
                  <FaMapMarkerAlt />
                  {res.addressId?.city || "Unknown"} • ₹20 Delivery
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Orders */}
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <FaClock /> Recent Orders
      </h3>
      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <div className="text-center p-6 bg-gray-50 dark:bg-secondary rounded-lg shadow">
          <img
            src="/empty-orders.png"
            alt="No Orders"
            className="mx-auto w-32 h-32 mb-3"
          />
          <p className="text-gray-500 mb-2">
            You haven't placed any orders yet.
          </p>
          <button
            onClick={() => navigate("/customer/browse")}
            className="bg-primary text-white px-4 py-2 rounded-lg"
          >
            Start Ordering
          </button>
        </div>
      ) : (
        <div className="relative pl-6">
          <div className="absolute left-3 top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary/60 to-orange-400/60 rounded-full" />
          <div className="grid gap-5">
            {orders.slice(0, 5).map((order, i) => {
              const status = (order.status || "").toLowerCase();
              const { icon, color } = getStatusMeta(status);
              return (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.01 }}
                  className="relative bg-white dark:bg-secondary rounded-xl shadow p-4 hover:shadow-brand"
                >
                  <span
                    className={`absolute -left-[7px] top-5 inline-flex h-3.5 w-3.5 rounded-full ${color} ring-4 ring-white dark:ring-secondary ${
                      status === "pending" ? "animate-pulseDot" : ""
                    }`}
                  />
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-semibold truncate max-w-[320px]">
                        {order.items
                          .map((it) => it?.menuItemId?.name)
                          .join(", ")}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(order.createdAt).toLocaleDateString("en-IN")}
                      </p>

                      {/* Premium Savings per order */}
                      {order.premiumApplied && order.savings > 0 && (
                        <p className="text-green-600 text-xs mt-1">
                          💎 Saved ₹{order.savings}{" "}
                          {order.premiumBreakdown?.freeDelivery > 0 &&
                            `(Free Delivery: ₹${order.premiumBreakdown.freeDelivery})`}
                          {order.premiumBreakdown?.extraDiscount > 0 &&
                            `(Extra Discount: ₹${order.premiumBreakdown.extraDiscount})`}
                          {order.premiumBreakdown?.cashback > 0 &&
                            `(Cashback: ₹${order.premiumBreakdown.cashback})`}
                        </p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-semibold">
                        ₹{currency(order.totalAmount)}
                      </p>
                      <span
                        className={`inline-flex items-center gap-1 text-sm font-medium ${color.replace(
                          "bg-",
                          "text-"
                        )}`}
                      >
                        {icon} {capitalize(order.status)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
};

/* --------------------------------- Parts --------------------------------- */
const GradientTile = ({ children, onClick }) => (
  <div
    onClick={onClick}
    className="cursor-pointer p-[1px] rounded-2xl bg-gradient-to-br from-primary/40 via-orange-300/50 to-yellow-300/60 shadow-brand"
  >
    <div className="bg-white/80 dark:bg-secondary/80 backdrop-blur-lg rounded-2xl p-5 h-full">
      {children}
    </div>
  </div>
);

const TileContent = ({ icon, title, subtitle }) => (
  <div className="flex items-center gap-3">
    <div className="p-3 bg-primary/10 rounded-xl">{icon}</div>
    <div>
      <h4 className="text-lg font-semibold">{title}</h4>
      <p className="text-sm opacity-70">{subtitle}</p>
    </div>
  </div>
);

function getStatusMeta(status = "") {
  if (status === "delivered")
    return { icon: <FaCheckCircle />, color: "bg-green-500" };
  if (status === "pending")
    return { icon: <FaHourglassHalf />, color: "bg-yellow-500" };
  if (status === "cancelled")
    return { icon: <FaTimesCircle />, color: "bg-red-500" };
  return { icon: <FaClock />, color: "bg-blue-500" };
}

const capitalize = (s) =>
  typeof s === "string" ? s.charAt(0).toUpperCase() + s.slice(1) : s;

export default CustomerDashboard;
