import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUtensils,
  FaRupeeSign,
  FaClock,
  FaChartLine,
  FaStar,
  FaCheckCircle,
  FaFire,
  FaHourglassHalf,
  FaTimesCircle,
  FaBell,
  FaArrowUp,
  FaArrowDown,
  FaConciergeBell,
  FaChevronRight,
  FaAward,
} from "react-icons/fa";
import {
  motion,
  useMotionValue,
  animate,
  AnimatePresence,
} from "framer-motion";
import API from "../../api/axios";

import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);

/* -------------------------------------------------------------- */
/* UTILS */
/* -------------------------------------------------------------- */

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
  }, [to, duration]);
  return Math.round(val);
};

const currency = (n) =>
  typeof n === "number"
    ? n.toLocaleString("en-IN", { maximumFractionDigits: 0 })
    : n;

/* -------------------------------------------------------------- */
/* MAIN DASHBOARD */
/* -------------------------------------------------------------- */

const RestaurantDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const greeting = useTimeGreeting();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await API.get("/restaurants/restaurants/me");
        setRestaurant(profileRes.data.restaurant);

        if (profileRes.data.restaurant?.status === "approved") {
          const orderRes = await API.get(
            `/orders/orders/restaurant/${profileRes.data.restaurant._id}`
          );
          setOrders(orderRes.data.orders || []);
        }
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  /* -------------------------------------------------------------- */
  /* STATS */
  /* -------------------------------------------------------------- */

  const todayOrders = useMemo(
    () =>
      orders.filter((order) =>
        dayjs(order.createdAt).isAfter(dayjs().startOf("day"))
      ),
    [orders]
  );

  const earnings = useMemo(
    () => todayOrders.reduce((sum, o) => sum + (o.subtotal || 0), 0),
    [todayOrders]
  );

  const avgPrepTime = useMemo(() => {
    if (!todayOrders.length) return 0;
    return Math.round(
      todayOrders.reduce((sum, o) => {
        const created = dayjs(o.createdAt);
        const updated = dayjs(o.updatedAt);
        return sum + updated.diff(created, "minute");
      }, 0) / todayOrders.length
    );
  }, [todayOrders]);

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.subtotal || 0), 0);
  const avgRating = restaurant?.averageRating || 4.5;

  const yesterdayOrders = orders.filter((o) =>
    dayjs(o.createdAt).isBetween(
      dayjs().subtract(1, "day").startOf("day"),
      dayjs().subtract(1, "day").endOf("day")
    )
  );

  const growthPercentage = yesterdayOrders.length
    ? Math.round(
        ((todayOrders.length - yesterdayOrders.length) /
          yesterdayOrders.length) *
          100
      )
    : 0;

  const todayCount = useCountUp(todayOrders.length);
  const earningCount = useCountUp(earnings);
  const revenueCount = useCountUp(totalRevenue);

  const pendingOrders = todayOrders.filter(
    (o) => !["delivered", "cancelled"].includes(o.status?.toLowerCase())
  ).length;

  /* -------------------------------------------------------------- */
  /* TOP DISHES */
  /* -------------------------------------------------------------- */

  const topDishes = useMemo(() => {
    const map = {};
    todayOrders.forEach((o) =>
      o.items.forEach(({ menuItemId, quantity }) => {
        if (!menuItemId) return;
        const name = menuItemId.name;
        const price = menuItemId.price || 0;
        if (!map[name])
          map[name] = { count: 0, price, image: menuItemId.image };
        map[name].count += quantity;
      })
    );

    return Object.entries(map)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 6)
      .map(([name, data]) => ({
        name,
        orders: data.count,
        price: data.price,
        revenue: data.price * data.count,
        image: data.image,
      }));
  }, [todayOrders]);

  /* -------------------------------------------------------------- */
  /* RECENT ORDERS (R4 Enhanced) */
  /* -------------------------------------------------------------- */

  const RecentOrders = ({ recentOrders, statusMeta }) => {
    // Convert raw backend orders → UI-friendly format
    const formatted = recentOrders.map((o) => {
      const items = o.items || [];
      const first = items[0]?.menuItemId || {}; // first menu item

      return {
        image: first.image,
        name: first.name || "Order",
        customer: o.customerName || o.userName || "Customer",
        date: dayjs(o.createdAt).format("DD MMM"),
        time: dayjs(o.createdAt).format("hh:mm A"),
        itemsCount: items.length,
        amount: o.subtotal || 0,
        status: o.orderStatus,
        raw: o, // keep raw order if you need deeper details later
      };
    });

    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-3xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <FaClock className="text-white" />
            </div>
            Recent Orders
          </h3>

          <button
            onClick={() => navigate("/restaurant/orders")}
            className="px-4 py-2 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-700 font-semibold flex items-center gap-2 transition"
          >
            View All
            <FaChevronRight className="text-xs" />
          </button>
        </div>

        {formatted.length === 0 ? (
          <div className="p-12 bg-white rounded-xl shadow-md text-center border border-gray-200">
            <div className="text-6xl mb-3">📦</div>
            <p>No recent orders.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {formatted.map((o, i) => (
              <OrderCard
                key={i}
                order={o}
                meta={statusMeta(o.status)}
                delay={i * 0.08}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  /* -------------------------------------------------------------- */
  /* STATUS HANDLERS */
  /* -------------------------------------------------------------- */

  const statusMeta = (s = "") => {
    s = s.toLowerCase();
    if (s === "delivered")
      return {
        icon: <FaCheckCircle />,
        bg: "bg-emerald-50",
        border: "border-emerald-300",
        text: "text-emerald-700",
      };
    if (s === "preparing")
      return {
        icon: <FaUtensils />,
        bg: "bg-blue-50",
        border: "border-blue-300",
        text: "text-blue-700",
      };
    if (s === "ready")
      return {
        icon: <FaFire />,
        bg: "bg-orange-50",
        border: "border-orange-300",
        text: "text-orange-700",
      };
    if (s === "pending")
      return {
        icon: <FaHourglassHalf />,
        bg: "bg-amber-50",
        border: "border-amber-300",
        text: "text-amber-700",
      };
    if (s === "out for delivery")
      return {
        icon: <FaBell />,
        bg: "bg-indigo-50",
        border: "border-indigo-300",
        text: "text-indigo-700",
      };
    return {
      icon: <FaTimesCircle />,
      bg: "bg-red-50",
      border: "border-red-300",
      text: "text-red-700",
    };
  };

  /* -------------------------------------------------------------- */
  /* LOADING / STATUS SCREEN */
  /* -------------------------------------------------------------- */

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
        <div className="w-16 h-16 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  if (!restaurant)
    return (
      <StatusScreen
        icon="⚠️"
        title="No Profile Found"
        message="Create your restaurant profile to view dashboard."
      />
    );

  if (restaurant.status === "pending")
    return (
      <StatusScreen
        icon="⏳"
        title="Waiting for approval"
        message="Your account is under admin review."
      />
    );

  if (restaurant.status === "rejected")
    return (
      <StatusScreen
        icon="❌"
        title="Application Rejected"
        message="Please contact support for more information."
      />
    );

  /* -------------------------------------------------------------- */
  /* MAIN UI */
  /* -------------------------------------------------------------- */

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      <motion.div
        className="px-4 sm:px-8 md:px-10 lg:px-12 py-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <HeroSection
          greeting={greeting}
          restaurant={restaurant}
          todayOrders={todayOrders.length}
          avgRating={avgRating}
          pendingOrders={pendingOrders}
        />

        {/* ROW 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          <MetricGrid
            todayCount={todayCount}
            earningCount={earningCount}
            avgPrepTime={avgPrepTime}
            avgRating={avgRating}
            growthPercentage={growthPercentage}
          />
          <RevenueCard totalRevenue={revenueCount} totalOrders={totalOrders} />
        </div>

        {/* ROW 2 */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-10">
          <div className="xl:col-span-2">
            <TopDishes topDishes={topDishes} />
          </div>
          <QuickInsights
            pending={pendingOrders}
            delivered={
              todayOrders.filter((o) => o.status === "Delivered").length
            }
            rating={avgRating}
          />
        </div>

        {/* RECENT ORDERS */}
        <RecentOrders recentOrders={orders} statusMeta={statusMeta} />
      </motion.div>
    </div>
  );
};

/* -------------------------------------------------------------- */
/* COMPONENTS */
/* -------------------------------------------------------------- */

const StatusScreen = ({ icon, title, message }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 p-6">
    <motion.div
      className="text-center max-w-md"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="text-7xl mb-3">{icon}</div>
      <h2 className="text-3xl font-bold mb-2 text-gray-800">{title}</h2>
      <p className="text-gray-600">{message}</p>
    </motion.div>
  </div>
);

/* -------------------------------------------------------------- */
/* HERO — CINEMATIC PREMIUM */
/* -------------------------------------------------------------- */

const HeroSection = ({
  greeting,
  restaurant,
  todayOrders,
  avgRating,
  pendingOrders,
}) => {
  return (
    <div className="relative overflow-hidden rounded-3xl shadow-2xl border border-orange-200 mb-12">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-600/70 via-red-600/60 to-pink-700/70"></div>

      {/* HBG-4 — Premium Photo */}
      <img
        src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80"
        className="absolute inset-0 w-full h-full object-cover opacity-40"
        alt="Kitchen"
      />

      <div className="relative z-10 p-8 md:p-12 flex flex-col lg:flex-row justify-between items-start gap-8">
        {/* LEFT */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="inline-flex items-center gap-3 mb-4 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
            <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center text-2xl">
              👨‍🍳
            </div>
            <span className="text-white/90 font-semibold">
              {restaurant?.name}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-white drop-shadow-lg">
            Good {greeting}, Chef!
          </h1>
          <p className="text-white/90 mt-3 text-lg">
            Your kitchen is creating culinary perfection ✨
          </p>
        </motion.div>

        {/* RIGHT — HERO CARDS */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex gap-4 flex-wrap"
        >
          <HeroMini
            label="Orders Today"
            value={todayOrders}
            icon={<FaConciergeBell />}
            grad="from-teal-500 to-emerald-600"
          />
          <HeroMini
            label="Rating"
            value={avgRating.toFixed(1)}
            icon={<FaStar />}
            grad="from-amber-500 to-orange-600"
          />
          {pendingOrders > 0 && (
            <HeroMini
              label="Pending"
              value={pendingOrders}
              icon={<FaBell />}
              grad="from-red-500 to-rose-600"
              pulse
            />
          )}
        </motion.div>
      </div>
    </div>
  );
};

const HeroMini = ({ label, value, icon, grad, pulse }) => (
  <div
    className={`px-6 py-4 rounded-2xl bg-white/90 backdrop-blur-xl shadow-xl min-w-[150px] border border-white/50 ${
      pulse ? "animate-pulse" : ""
    }`}
  >
    <div className="flex items-center gap-2 mb-2">
      <div
        className={`w-8 h-8 rounded-lg bg-gradient-to-br ${grad} flex items-center justify-center text-white`}
      >
        {icon}
      </div>
      <span className="text-xs text-gray-600 font-bold uppercase tracking-wide">
        {label}
      </span>
    </div>
    <p className="text-3xl font-black bg-gradient-to-br text-transparent bg-clip-text from-black to-gray-700">
      {value}
    </p>
  </div>
);

/* -------------------------------------------------------------- */
/* METRIC CARDS */
const MetricGrid = ({
  todayCount,
  earningCount,
  avgPrepTime,
  avgRating,
  growthPercentage,
}) => (
  <div className="grid grid-cols-2 gap-4">
    <MetricCard
      icon={<FaUtensils />}
      value={todayCount}
      label="Orders Today"
      color="teal"
      trend={growthPercentage}
      delay={0.1}
    />
    <MetricCard
      icon={<FaRupeeSign />}
      value={`₹${currency(earningCount)}`}
      label="Today's Revenue"
      color="rose"
      delay={0.2}
    />
    <MetricCard
      icon={<FaClock />}
      value={`${avgPrepTime}m`}
      label="Prep Time"
      color="indigo"
      delay={0.3}
    />
    <MetricCard
      icon={<FaStar />}
      value={avgRating.toFixed(1)}
      label="Rating"
      color="amber"
      delay={0.4}
    />
  </div>
);

const MetricCard = ({ icon, value, label, color, delay, trend }) => {
  const c = {
    teal: {
      g: "from-teal-500 to-emerald-600",
      bg: "from-teal-50 to-emerald-50",
      text: "text-teal-700",
      border: "border-teal-200",
    },
    rose: {
      g: "from-rose-500 to-pink-600",
      bg: "from-rose-50 to-pink-50",
      text: "text-rose-700",
      border: "border-rose-200",
    },
    amber: {
      g: "from-amber-500 to-orange-600",
      bg: "from-amber-50 to-orange-50",
      text: "text-amber-700",
      border: "border-amber-200",
    },
    indigo: {
      g: "from-indigo-500 to-purple-600",
      bg: "from-indigo-50 to-purple-50",
      text: "text-indigo-700",
      border: "border-indigo-200",
    },
  };

  return (
    <motion.div
      className={`p-6 rounded-2xl bg-gradient-to-br ${c[color].bg} border ${c[color].border} shadow-lg`}
      initial={{ opacity: 0, scale: 0.93 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      whileHover={{ scale: 1.03, y: -3 }}
    >
      <div
        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c[color].g} flex items-center justify-center text-white text-xl mb-3`}
      >
        {icon}
      </div>

      <h3 className={`text-3xl font-black ${c[color].text}`}>{value}</h3>
      <p className="text-sm text-gray-500 font-medium mt-0.5">{label}</p>

      {trend !== undefined && (
        <div
          className={`flex items-center gap-1 text-xs font-bold mt-2 ${
            trend >= 0 ? "text-emerald-700" : "text-red-600"
          }`}
        >
          {trend >= 0 ? <FaArrowUp /> : <FaArrowDown />}
          {Math.abs(trend)}% vs yesterday
        </div>
      )}
    </motion.div>
  );
};

/* -------------------------------------------------------------- */
/* REVENUE */
const RevenueCard = ({ totalRevenue, totalOrders }) => {
  const avgOrder = totalOrders ? Math.round(totalRevenue / totalOrders) : 0;

  return (
    <motion.div
      className="p-8 rounded-2xl bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-600 shadow-xl border border-purple-400/40 text-white"
      initial={{ opacity: 0, x: 25 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-black flex items-center gap-2">
          <FaChartLine />
          Revenue Overview
        </h3>
        <span className="px-3 py-1 bg-white/20 rounded-full text-xs tracking-wide">
          ALL TIME
        </span>
      </div>

      <p className="text-5xl font-black drop-shadow-lg mb-4">
        ₹{currency(totalRevenue)}
      </p>

      <div className="grid grid-cols-2 gap-4 mt-4 border-t border-white/20 pt-4">
        <div className="p-4 bg-white/10 rounded-xl backdrop-blur-md">
          <p className="text-xs text-purple-200">Total Orders</p>
          <p className="text-2xl font-black">{currency(totalOrders)}</p>
        </div>
        <div className="p-4 bg-white/10 rounded-xl backdrop-blur-md">
          <p className="text-xs text-purple-200">Avg Value</p>
          <p className="text-2xl font-black">₹{currency(avgOrder)}</p>
        </div>
      </div>
    </motion.div>
  );
};

/* -------------------------------------------------------------- */
/* TOP DISHES */
const TopDishes = ({ topDishes }) => (
  <div>
    <h3 className="text-3xl font-black bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-6 flex items-center gap-3">
      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg">
        <FaFire className="text-white" />
      </div>
      Today's Best Sellers
    </h3>

    {topDishes.length === 0 ? (
      <div className="p-12 bg-white rounded-xl shadow-md text-center border border-gray-200">
        <div className="text-6xl mb-3">🍽️</div>
        <p>No dishes yet today.</p>
      </div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {topDishes.map((d, i) => (
          <DishCard key={i} dish={d} rank={i + 1} />
        ))}
      </div>
    )}
  </div>
);

const DishCard = ({ dish, rank }) => {
  const medal =
    rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : null;

  return (
    <motion.div
      className="relative bg-white rounded-2xl border border-gray-200 shadow hover:shadow-xl overflow-hidden"
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
    >
      {medal && (
        <div className="absolute top-3 left-3 text-3xl drop-shadow-xl">
          {medal}
        </div>
      )}

      <div className="h-44 overflow-hidden bg-gray-100">
        {dish.image ? (
          <img
            src={dish.image}
            className="w-full h-full object-cover hover:scale-110 transition"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">
            🍽️
          </div>
        )}
      </div>

      <div className="p-4">
        <h4 className="font-bold text-gray-800 mb-1 truncate">{dish.name}</h4>

        <div className="flex justify-between mt-2">
          <div>
            <p className="text-xs text-gray-500">Orders</p>
            <p className="text-xl font-black text-teal-700">{dish.orders}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Revenue</p>
            <p className="text-xl font-black text-rose-700">
              ₹{currency(dish.revenue)}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* -------------------------------------------------------------- */
/* QUICK INSIGHTS */
const QuickInsights = ({ pending, delivered, rating }) => (
  <motion.div
    className="p-6 rounded-2xl bg-white shadow-xl border border-gray-200"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <h3 className="text-xl font-black mb-4 flex items-center gap-2">
      <FaAward className="text-amber-500" /> Quick Insights
    </h3>

    <div className="space-y-4">
      <InsightBox
        title="Delivered Today"
        value={delivered}
        icon={<FaCheckCircle />}
        color="emerald"
      />
      <InsightBox
        title="Pending Orders"
        value={pending}
        icon={<FaHourglassHalf />}
        color="amber"
      />
      <InsightBox
        title="Rating"
        value={`${rating.toFixed(1)} / 5`}
        icon={<FaStar />}
        color="rose"
      />
    </div>
  </motion.div>
);

const InsightBox = ({ title, value, icon, color }) => {
  const colorMap = {
    emerald: "from-emerald-50 to-teal-50 border-emerald-200 text-emerald-700",
    amber: "from-amber-50 to-orange-50 border-amber-200 text-amber-700",
    rose: "from-rose-50 to-pink-50 border-rose-200 text-rose-700",
  };
  return (
    <div
      className={`p-4 rounded-xl bg-gradient-to-br ${colorMap[color]} border`}
    >
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold">{title}</span>
        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
          {icon}
        </div>
      </div>
      <p className="text-3xl font-black">{value}</p>
    </div>
  );
};

/* -------------------------------------------------------------- */
/* RECENT ORDERS — R4 PREMIUM */
const RecentOrders = ({ recentOrders, statusMeta }) => (
  <div>
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-3xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
          <FaClock className="text-white" />
        </div>
        Recent Orders
      </h3>

      <button
        onClick={() => navigate("/restaurant/orders")}
        className="px-4 py-2 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-700 font-semibold flex items-center gap-2 transition"
      >
        View All
        <FaChevronRight className="text-xs" />
      </button>
    </div>

    {recentOrders.length === 0 ? (
      <div className="p-12 bg-white rounded-xl shadow-md text-center border border-gray-200">
        <div className="text-6xl mb-3">📦</div>
        <p>No recent orders.</p>
      </div>
    ) : (
      <div className="space-y-4">
        {recentOrders.map((o, i) => (
          <OrderCard
            key={i}
            order={o}
            meta={statusMeta(o.status)}
            delay={i * 0.08}
          />
        ))}
      </div>
    )}
  </div>
);

const OrderCard = ({ order, meta, delay }) => (
  <motion.div
    className={`p-5 bg-white rounded-2xl border ${meta.border} hover:shadow-xl transition flex items-center gap-4`}
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    whileHover={{ y: -2 }}
  >
    {/* IMAGE */}
    <div className="w-20 h-20 rounded-xl border border-gray-200 overflow-hidden bg-gray-100 flex-shrink-0">
      {order.image ? (
        <img src={order.image} className="w-full h-full object-cover" alt="" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-4xl">
          🍽️
        </div>
      )}
    </div>

    {/* DETAILS */}
    <div className="flex-1 min-w-0">
      <h4 className="text-lg font-bold text-gray-800 truncate">{order.name}</h4>
      <p className="text-sm text-gray-500">{order.customer}</p>

      <div className="flex items-center gap-3 text-xs text-gray-500 mt-2">
        <span className="px-2 py-1 rounded bg-gray-100 font-medium">
          {order.date}
        </span>
        <span>•</span>
        <span>{order.time}</span>
        <span>•</span>
        <span className="font-medium">{order.itemsCount} items</span>
      </div>
    </div>

    {/* AMOUNT + STATUS */}
    <div className="text-right flex-shrink-0 space-y-2">
      <p className="text-2xl font-black text-gray-800">
        ₹{currency(order.amount)}
      </p>

      <span
        className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-xl border ${meta.bg} ${meta.text} font-bold text-xs shadow-sm`}
      >
        {meta.icon}
        {order.status}
      </span>
    </div>
  </motion.div>
);

export default RestaurantDashboard;

// import React, { useEffect, useState } from "react";
// import {
//   FaUtensils,
//   FaRupeeSign,
//   FaClock,
//   FaChartLine,
//   FaStar,
//   FaCheckCircle,
// } from "react-icons/fa";
// import { motion } from "framer-motion";
// import API from "../../api/axios";
// import dayjs from "dayjs";

// const RestaurantDashboard = () => {
//   const [orders, setOrders] = useState([]);
//   const [restaurant, setRestaurant] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // 📌 Fetch restaurant profile & orders
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // get my profile
//         const profileRes = await API.get("/restaurants/restaurants/me");
//         setRestaurant(profileRes.data.restaurant);

//         // only fetch orders if approved
//         if (profileRes.data.restaurant?.status === "approved") {
//           const orderRes = await API.get(
//             `/orders/orders/restaurant/${profileRes.data.restaurant._id}`
//           );
//           console.log("Orders API response:", orderRes.data);
//           setOrders(orderRes.data.orders || []);
//         }
//       } catch (err) {
//         console.error("Failed to fetch dashboard data", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   if (loading) return <div className="p-8">Loading...</div>;

//   // 🟠 Status checks
//   if (!restaurant) {
//     return (
//       <div className="flex flex-col items-center justify-center h-screen text-center">
//         <h2 className="text-2xl font-bold text-gray-600">
//           ⚠️ No profile found
//         </h2>
//         <p className="text-gray-500 mt-2">
//           Please create your restaurant profile to access the dashboard.
//         </p>
//       </div>
//     );
//   }

//   if (restaurant.status === "pending") {
//     return (
//       <div className="flex flex-col items-center justify-center h-screen text-center">
//         <h2 className="text-2xl font-bold text-orange-600">
//           ⏳ Waiting for Approval
//         </h2>
//         <p className="text-gray-500 mt-2">
//           Your account is under review. Once approved by admin, you’ll get full
//           access.
//         </p>
//       </div>
//     );
//   }

//   if (restaurant.status === "rejected") {
//     return (
//       <div className="flex flex-col items-center justify-center h-screen text-center">
//         <h2 className="text-2xl font-bold text-red-600">
//           ❌ Application Rejected
//         </h2>
//         <p className="text-gray-500 mt-2">
//           Your registration was not approved. Please contact support for more
//           info.
//         </p>
//       </div>
//     );
//   }

//   // ✅ Compute stats only if approved
//   const todayOrders = orders.filter((order) =>
//     dayjs(order.createdAt).isAfter(dayjs().startOf("day"))
//   );

//   const earnings = todayOrders.reduce(
//     (sum, order) => sum + (order.subtotal || 0),
//     0
//   );

//   const avgPrepTime =
//     todayOrders.length > 0
//       ? Math.round(
//           todayOrders.reduce((sum, o) => {
//             const created = dayjs(o.createdAt);
//             const updated = dayjs(o.updatedAt);
//             return sum + updated.diff(created, "minute");
//           }, 0) / todayOrders.length
//         )
//       : 0;

//   // 🔥 Top Dishes with image support
//   const topDishes = (() => {
//     const map = {};
//     todayOrders.forEach((order) =>
//       order.items.forEach(({ menuItemId, quantity }) => {
//         if (!menuItemId) return;
//         const name = menuItemId.name || "Unknown Dish";
//         const image = menuItemId.image || null;

//         if (!map[name]) {
//           map[name] = { count: 0, image };
//         }
//         map[name].count += quantity;
//       })
//     );
//     return Object.entries(map)
//       .sort((a, b) => b[1].count - a[1].count)
//       .slice(0, 3)
//       .map(([name, data]) => ({
//         name,
//         orders: data.count,
//         image: data.image,
//       }));
//   })();

//   // 🕒 Recent Orders
//   const recentOrders = [...orders]
//     .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
//     .slice(0, 5)
//     .map((order) => ({
//       customer: order.customerId?.name || "Customer",
//       dish: order.items?.[0]?.menuItemId?.name || "Dish",
//       image: order.items?.[0]?.menuItemId?.image || null,
//       time: dayjs(order.createdAt).format("h:mm A"),
//       status: order.status,
//     }));

//   const stats = [
//     {
//       label: "Today’s Orders",
//       value: todayOrders.length,
//       icon: <FaUtensils className="text-orange-500 text-xl" />,
//     },
//     {
//       label: "Earnings",
//       value: `₹${earnings}`,
//       icon: <FaRupeeSign className="text-green-500 text-xl" />,
//     },
//     {
//       label: "Avg Prep Time",
//       value: `${avgPrepTime} mins`,
//       icon: <FaClock className="text-blue-500 text-xl" />,
//     },
//   ];

//   return (
//     <motion.div
//       className="px-6 py-8 text-gray-800 dark:text-white"
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.3 }}
//     >
//       {/* 👋 Welcome */}
//       <h2 className="text-3xl font-bold mb-2">
//         Welcome back, {restaurant.name || "Chef"}! 👨‍🍳
//       </h2>
//       <p className="text-gray-600 dark:text-gray-400 mb-6">
//         Here's how your kitchen is performing today.
//       </p>

//       {/* 📊 Summary Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
//         {stats.map((stat, idx) => (
//           <div
//             key={idx}
//             className="bg-white dark:bg-secondary rounded-xl p-5 shadow hover:shadow-md flex items-center gap-4"
//           >
//             <div>{stat.icon}</div>
//             <div>
//               <h4 className="text-xl font-semibold">{stat.value}</h4>
//               <p className="text-sm text-gray-500">{stat.label}</p>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* 🔥 Top Selling Dishes */}
//       <div className="mb-10">
//         <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
//           <FaChartLine /> Top Selling Dishes
//         </h3>

//         {topDishes.length === 0 ? (
//           <div className="text-gray-500 dark:text-gray-300 text-sm">
//             No orders yet to determine top selling dishes.
//           </div>
//         ) : (
//           <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
//             {topDishes.map((dish, i) => (
//               <div
//                 key={i}
//                 className="bg-white dark:bg-secondary p-4 rounded-xl shadow hover:shadow-md"
//               >
//                 <div className="h-24 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center mb-3 overflow-hidden">
//                   {dish.image ? (
//                     <img
//                       src={dish.image}
//                       alt={dish.name}
//                       className="h-full w-full object-cover"
//                     />
//                   ) : (
//                     <span className="text-sm text-gray-400">No Image</span>
//                   )}
//                 </div>
//                 <h4 className="font-semibold">{dish.name}</h4>
//                 <p className="text-sm text-gray-500 dark:text-gray-300">
//                   {dish.orders} orders
//                 </p>
//                 <div className="flex items-center mt-1 text-yellow-500 text-sm">
//                   <FaStar className="mr-1" /> 4.{8 - i}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* 🕒 Recent Orders */}
//       <div>
//         <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
//           <FaCheckCircle /> Recent Orders
//         </h3>

//         {recentOrders.length === 0 ? (
//           <div className="text-gray-500 dark:text-gray-300 text-sm">
//             No recent orders found.
//           </div>
//         ) : (
//           <div className="grid gap-4">
//             {recentOrders.map((order, i) => (
//               <div
//                 key={i}
//                 className="bg-white dark:bg-secondary rounded-lg shadow p-4 flex justify-between items-center hover:shadow-md"
//               >
//                 <div className="flex items-center gap-3">
//                   {order.image ? (
//                     <img
//                       src={order.image}
//                       alt={order.dish}
//                       className="w-12 h-12 object-cover rounded"
//                     />
//                   ) : (
//                     <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center text-xs text-gray-400">
//                       No Img
//                     </div>
//                   )}
//                   <div>
//                     <h4 className="font-medium">{order.dish}</h4>
//                     <p className="text-xs text-gray-500">
//                       {order.customer} • {order.time}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="text-right">
//                   <span
//                     className={`text-sm font-medium ${
//                       order.status === "Delivered"
//                         ? "text-green-600"
//                         : order.status === "Preparing"
//                         ? "text-yellow-600"
//                         : "text-red-500"
//                     }`}
//                   >
//                     {order.status}
//                   </span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </motion.div>
//   );
// };

// export default RestaurantDashboard;
