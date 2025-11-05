import React, {
  useEffect,
  useState,
  useContext,
  useMemo,
  useCallback,
  useRef,
} from "react";
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
  FaFire,
  FaGift,
} from "react-icons/fa";
import {
  motion,
  useMotionValue,
  animate,
  AnimatePresence,
} from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import API from "../../api/axios";

/* ----------------------------- Utilities ---------------------------- */
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
      duration: Math.max(duration, 0.5),
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setVal(v),
    });
    return () => controls.stop();
  }, [to, duration, mv]);
  return Math.round(val);
};

const currency = (n) =>
  typeof n === "number"
    ? n.toLocaleString("en-IN", { maximumFractionDigits: 0 })
    : n;

/* ------------------------------- Main Dashboard ------------------------------ */
const CustomerDashboard = () => {
  const { user, token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [premium, setPremium] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const greeting = useTimeGreeting();
  const railRef = useRef(null);

  /* Fetch all data concurrently */
  useEffect(() => {
    if (!user?._id || !token) return;

    const endpoints = [
      API.get(`/orders/orders/customer/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      API.get(`/reviews/me`, { headers: { Authorization: `Bearer ${token}` } }),
      API.get(`/restaurants/restaurants`),
      API.get(`/premium/subscriptions`, {
        params: { subscriberId: user._id, subscriberType: "User" },
        headers: { Authorization: `Bearer ${token}` },
      }),
    ];

    Promise.all(endpoints)
      .then(([ordersRes, reviewsRes, restaurantsRes, premiumRes]) => {
        const ordersData = ordersRes.data?.orders || [];
        setOrders(ordersData);
        setLoading(false);

        const reviews = Array.isArray(reviewsRes.data) ? reviewsRes.data : [];
        if (reviews.length) {
          const avg =
            reviews.reduce((s, r) => s + (r?.rating || 0), 0) / reviews.length;
          setAverageRating(Number(avg.toFixed(1)));
        }

        const restaurants = restaurantsRes.data?.restaurants || [];
        const top = restaurants
          .slice()
          .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
          .slice(0, 12);
        setRecommended(top);

        const subs = premiumRes.data?.subscriptions || [];
        if (subs.length) {
          const sub = subs[0];
          let endDateObj = null;
          if (sub.endDate) {
            endDateObj = sub.endDate.$date
              ? new Date(sub.endDate.$date)
              : new Date(sub.endDate);
          }
          setPremium({
            ...sub,
            totalSavings: sub.totalSavings || 0,
            endDate: endDateObj,
          });
        } else {
          const totalSavingsFromOrders = ordersData
            .filter((o) => o.premiumApplied)
            .reduce((sum, o) => sum + (o.savings || 0), 0);
          if (totalSavingsFromOrders > 0) {
            setPremium({
              isActive: true,
              planName: "Premium",
              totalSavings: totalSavingsFromOrders,
              endDate: null,
            });
          }
        }
      })
      .catch(() => setLoading(false));
  }, [user, token]);

  /* Animated Numbers */
  const ordersCount = useCountUp(orders.length, 0.9);
  const savingsCount = useCountUp(premium?.totalSavings || 0, 1);
  const ratingCount = useMemo(
    () => (averageRating ? averageRating.toFixed(1) : "0.0"),
    [averageRating]
  );

  const activeOrder = orders.find(
    (o) =>
      o.status && !["delivered", "cancelled"].includes(o.status.toLowerCase())
  );

  const lastOrderSaving = useMemo(() => {
    const lastOrder = orders[0];
    return lastOrder?.premiumApplied && lastOrder?.savings > 0
      ? lastOrder.savings
      : 0;
  }, [orders]);

  const scrollCarousel = useCallback((dir) => {
    railRef.current?.scrollBy({ left: dir * 300, behavior: "smooth" });
  }, []);

  /* UI */
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <motion.div
        className="px-4 sm:px-8 md:px-10 lg:px-12 py-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Hero */}
        <HeroSection
          greeting={greeting}
          user={user}
          orders={orders}
          activeOrder={activeOrder}
          navigate={navigate}
        />

        {/* Premium */}
        {premium?.isActive && <PremiumBanner premium={premium} />}

        {/* Last Order Saving */}
        {lastOrderSaving > 0 && (
          <SavingsBanner lastOrderSaving={lastOrderSaving} />
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <StatsCard
            icon={<FaShoppingCart />}
            title={`${ordersCount} Orders`}
            subtitle="Total orders placed"
            gradient="from-blue-500 to-cyan-600"
            onClick={() => navigate("/customer/orders")}
            delay={0.5}
          />
          <StatsCard
            icon={<FaCrown />}
            title={`₹${currency(savingsCount)}`}
            subtitle="Saved with Premium"
            gradient="from-yellow-500 to-orange-600"
            onClick={() => navigate("/customer/premium")}
            delay={0.6}
          />
          <StatsCard
            icon={<FaStar />}
            title={`${ratingCount} ★`}
            subtitle="Your average rating"
            gradient="from-pink-500 to-rose-600"
            onClick={() => navigate("/customer/reviews")}
            delay={0.7}
          />
        </div>

        {/* Recommended */}
        <RecommendedSection
          recommended={recommended}
          scrollCarousel={scrollCarousel}
          railRef={railRef}
          navigate={navigate}
        />

        {/* Orders */}
        <RecentOrders orders={orders} loading={loading} navigate={navigate} />
      </motion.div>
    </div>
  );
};

/* ------------------------------- Components ------------------------------- */
const HeroSection = ({ greeting, user, orders, activeOrder, navigate }) => (
  <div className="relative overflow-hidden rounded-3xl shadow-2xl mb-8 border border-orange-200 dark:border-white/10">
    <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-pink-600 to-purple-600"></div>
    <div
      className="absolute inset-0 opacity-20"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    ></div>

    <div className="relative z-10 p-8 md:p-10 text-white">
      <motion.h2
        className="text-3xl md:text-4xl font-black mb-2 drop-shadow-lg"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
      >
        Good {greeting}, {user?.name?.split(" ")[0] || "Foodie"}! 👋
      </motion.h2>
      <p className="text-white/90 text-lg">
        Ready for your next delicious meal?
      </p>

      <div className="flex gap-3 mt-6 flex-wrap">
        <motion.button
          onClick={() => navigate("/customer/browse")}
          className="flex items-center gap-2 bg-white text-orange-600 px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
        >
          <FaSearch /> Explore Food
        </motion.button>
        {orders.length > 0 && (
          <motion.button
            onClick={() =>
              navigate(`/restaurant/${orders[0].restaurantId?._id}/menu`)
            }
            className="flex items-center gap-2 bg-white/90 text-gray-800 px-6 py-3 rounded-xl font-semibold shadow-lg hover:bg-white hover:scale-105 transition-all"
          >
            <FaRedo /> Reorder
          </motion.button>
        )}
        {activeOrder && (
          <motion.button
            onClick={() => navigate(`/order/${activeOrder._id}`)}
            className="flex items-center gap-2 bg-white/90 text-gray-800 px-6 py-3 rounded-xl font-semibold shadow-lg hover:bg-white hover:scale-105 transition-all"
          >
            <FaTruck /> Track Order
          </motion.button>
        )}
      </div>
    </div>
  </div>
);

const PremiumBanner = ({ premium }) => (
  <motion.div
    className="mb-8 relative overflow-hidden p-6 rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 dark:from-yellow-600 dark:via-amber-700 dark:to-orange-700 shadow-lg border border-yellow-300 dark:border-yellow-600"
    initial={{ scale: 0.95, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent blur-xl animate-pulse"></div>
    <div className="relative flex items-start gap-4">
      <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
        <FaCrown className="text-white text-3xl" />
      </div>
      <div className="flex-1 text-white">
        <h3 className="font-black text-xl mb-1 flex items-center gap-2">
          Premium Member
          <span className="px-3 py-1 rounded-full bg-white/20 text-sm">
            {premium.planName}
          </span>
        </h3>
        <p className="text-white/90 mb-2">
          Valid till{" "}
          {premium?.endDate
            ? new Date(premium.endDate).toLocaleDateString("en-IN")
            : "N/A"}
        </p>
        <div className="flex items-center gap-2 font-bold text-2xl">
          <FaGift className="text-white/80" />₹{currency(premium.totalSavings)}{" "}
          <span className="text-sm font-normal text-white/80">
            saved so far!
          </span>
        </div>
      </div>
    </div>
  </motion.div>
);

const SavingsBanner = ({ lastOrderSaving }) => (
  <motion.div
    className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-500/30 px-6 py-4 rounded-2xl mb-8 shadow-lg"
    initial={{ x: -20, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
  >
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center text-white text-xl">
        💎
      </div>
      <div>
        <p className="font-bold text-green-700 dark:text-green-300 text-lg">
          You saved ₹{lastOrderSaving} on your last order!
        </p>
        <p className="text-sm text-green-600 dark:text-green-400">
          Keep ordering to unlock more savings
        </p>
      </div>
    </div>
  </motion.div>
);

const StatsCard = ({ icon, title, subtitle, gradient, onClick, delay }) => (
  <motion.div
    onClick={onClick}
    className="group relative cursor-pointer"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    whileHover={{ scale: 1.03, y: -3 }}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

    {/* ↓ Reduced padding (height smaller) */}
    <div className="relative p-4 rounded-3xl bg-white dark:bg-slate-900 border border-orange-200 dark:border-white/10 shadow-md hover:shadow-lg transition-all duration-300">
      <div className="flex items-center gap-3">
        <div
          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-xl shadow-md group-hover:scale-110 transition-transform`}
        >
          {icon}
        </div>
        <div className="flex-1">
          <h4 className="text-xl font-black text-gray-900 dark:text-white leading-snug">
            {title}
          </h4>
          <p className="text-xs text-gray-600 dark:text-gray-400">{subtitle}</p>
        </div>
      </div>
    </div>
  </motion.div>
);

const RecommendedSection = ({
  recommended,
  scrollCarousel,
  railRef,
  navigate,
}) => (
  <div className="mb-12">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-3xl font-black bg-gradient-to-r from-orange-600 to-pink-600 dark:from-orange-400 dark:to-pink-500 bg-clip-text text-transparent flex items-center gap-3">
        <FaFire className="text-orange-500" />
        Recommended for You
      </h3>
      <motion.button
        onClick={() => navigate("/customer/browse")}
        className="text-orange-600 dark:text-orange-400 hover:underline font-semibold flex items-center gap-2"
        whileHover={{ x: 5 }}
      >
        View All <FaChevronRight className="text-sm" />
      </motion.button>
    </div>

    <div className="relative">
      {/* Hide arrows on mobile */}
      <motion.button
        onClick={() => scrollCarousel(-1)}
        className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white dark:bg-slate-800 shadow-lg rounded-full z-10 items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-orange-500 hover:text-white transition-all"
        whileHover={{ scale: 1.1 }}
      >
        <FaChevronLeft />
      </motion.button>
      <motion.button
        onClick={() => scrollCarousel(1)}
        className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white dark:bg-slate-800 shadow-lg rounded-full z-10 items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-orange-500 hover:text-white transition-all"
        whileHover={{ scale: 1.1 }}
      >
        <FaChevronRight />
      </motion.button>

      <div
        ref={railRef}
        className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
      >
        <AnimatePresence>
          {recommended.map((res, i) => (
            <RestaurantCard
              key={res._id}
              restaurant={res}
              navigate={navigate}
              delay={i * 0.05}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  </div>
);

const RestaurantCard = ({ restaurant, navigate, delay }) => (
  <motion.div
    onClick={() => navigate(`/restaurant/${restaurant._id}/menu`)}
    className="group min-w-[280px] snap-start rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-orange-200 dark:border-white/10 shadow-md hover:shadow-xl cursor-pointer transition-all duration-300 flex flex-col justify-between"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay }}
    whileHover={{ y: -6 }}
  >
    {/* Image */}
    <div className="relative h-44 overflow-hidden">
      <img
        src={restaurant.logo || "/QuickBite.png"}
        alt={restaurant.name}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
      <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-sm text-white text-sm font-bold flex items-center gap-1.5 shadow-lg">
        <FaStar className="text-yellow-400" />
        {restaurant.averageRating?.toFixed(1) || "4.5"}
      </div>
      {restaurant.discount && (
        <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-500 to-pink-600 text-white text-sm font-bold shadow-lg">
          {restaurant.discount}% OFF
        </div>
      )}
    </div>

    {/* Content */}
    <div className="p-4 flex flex-col flex-1 justify-between">
      <div>
        <h4 className="font-bold text-base mb-1 text-gray-900 dark:text-white truncate">
          {restaurant.name}
        </h4>
        <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-2 leading-tight">
          <FaMapMarkerAlt className="text-orange-500 text-sm" />
          {restaurant.addressId?.city || "Unknown"} • ₹20 Delivery
        </p>
      </div>
    </div>
  </motion.div>
);

const RecentOrders = ({ orders, loading, navigate }) => (
  <div>
    <h3 className="text-3xl font-black bg-gradient-to-r from-orange-600 to-pink-600 dark:from-orange-400 dark:to-pink-500 bg-clip-text text-transparent mb-6 flex items-center gap-3">
      <FaClock className="text-orange-500" />
      Recent Orders
    </h3>

    {loading ? (
      <div className="text-center py-12">
        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading orders...</p>
      </div>
    ) : orders.length === 0 ? (
      <motion.div
        className="text-center p-12 bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-orange-200 dark:border-white/10"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div className="text-8xl mb-4">🍽️</div>
        <h4 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
          No Orders Yet
        </h4>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Start your food journey with QuickBite!
        </p>
        <motion.button
          onClick={() => navigate("/customer/browse")}
          className="px-8 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold shadow-lg hover:shadow-xl transition-all"
          whileHover={{ scale: 1.05 }}
        >
          Start Ordering
        </motion.button>
      </motion.div>
    ) : (
      <div className="space-y-4">
        <AnimatePresence>
          {orders.slice(0, 5).map((order, i) => (
            <OrderCard key={i} order={order} delay={i * 0.1} />
          ))}
        </AnimatePresence>
      </div>
    )}
  </div>
);

const OrderCard = ({ order, delay }) => {
  const status = (order.status || "").toLowerCase();
  const meta = getStatusMeta(status);
  return (
    <motion.div
      className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-orange-200 dark:border-white/10 shadow-md hover:shadow-lg transition-all"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ x: 4 }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h4 className="font-bold text-lg mb-2 text-gray-900 dark:text-white truncate">
            {Array.isArray(order.items)
              ? order.items.map((it) => it?.menuItemId?.name).join(", ")
              : "Order"}
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            {new Date(order.createdAt).toLocaleDateString("en-IN")}
          </p>
          {order.premiumApplied && order.savings > 0 && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-500/30">
              <span className="text-2xl">💎</span>
              <span className="text-sm font-bold text-green-700 dark:text-green-300">
                Saved ₹{order.savings}
              </span>
            </div>
          )}
        </div>
        <div className="text-right">
          <p className="text-2xl font-black text-gray-900 dark:text-white mb-2">
            ₹{currency(order.totalAmount)}
          </p>
          <span
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${meta.bg} font-bold text-sm shadow-md`}
          >
            {meta.icon}
            {capitalize(order.status)}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

function getStatusMeta(status = "") {
  if (status === "delivered")
    return {
      icon: <FaCheckCircle />,
      bg: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
    };
  if (status === "pending")
    return {
      icon: <FaHourglassHalf />,
      bg: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400",
    };
  if (status === "cancelled")
    return {
      icon: <FaTimesCircle />,
      bg: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
    };
  return {
    icon: <FaClock />,
    bg: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
  };
}

const capitalize = (s) =>
  typeof s === "string" ? s.charAt(0).toUpperCase() + s.slice(1) : s;

export default CustomerDashboard;
