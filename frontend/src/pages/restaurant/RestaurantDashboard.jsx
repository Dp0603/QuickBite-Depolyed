import React, { useEffect, useState } from "react";
import {
  FaUtensils,
  FaRupeeSign,
  FaClock,
  FaChartLine,
  FaStar,
  FaCheckCircle,
} from "react-icons/fa";
import { motion } from "framer-motion";
import API from "../../api/axios";
import dayjs from "dayjs";

const RestaurantDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  // 📌 Fetch restaurant profile & orders
  useEffect(() => {
    const fetchData = async () => {
      try {
        // get my profile
        const profileRes = await API.get("/restaurants/restaurants/me");
        setRestaurant(profileRes.data.restaurant);

        // only fetch orders if approved
        if (profileRes.data.restaurant?.status === "approved") {
          const orderRes = await API.get(
            `/orders/orders/restaurant/${profileRes.data.restaurant._id}`
          );
          console.log("Orders API response:", orderRes.data);
          setOrders(orderRes.data.orders || []);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;

  // 🟠 Status checks
  if (!restaurant) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <h2 className="text-2xl font-bold text-gray-600">
          ⚠️ No profile found
        </h2>
        <p className="text-gray-500 mt-2">
          Please create your restaurant profile to access the dashboard.
        </p>
      </div>
    );
  }

  if (restaurant.status === "pending") {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <h2 className="text-2xl font-bold text-orange-600">
          ⏳ Waiting for Approval
        </h2>
        <p className="text-gray-500 mt-2">
          Your account is under review. Once approved by admin, you’ll get full
          access.
        </p>
      </div>
    );
  }

  if (restaurant.status === "rejected") {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <h2 className="text-2xl font-bold text-red-600">
          ❌ Application Rejected
        </h2>
        <p className="text-gray-500 mt-2">
          Your registration was not approved. Please contact support for more
          info.
        </p>
      </div>
    );
  }

  // ✅ Compute stats only if approved
  const todayOrders = orders.filter((order) =>
    dayjs(order.createdAt).isAfter(dayjs().startOf("day"))
  );

  const earnings = todayOrders.reduce(
    (sum, order) => sum + (order.subtotal || 0),
    0
  );

  const avgPrepTime =
    todayOrders.length > 0
      ? Math.round(
          todayOrders.reduce((sum, o) => {
            const created = dayjs(o.createdAt);
            const updated = dayjs(o.updatedAt);
            return sum + updated.diff(created, "minute");
          }, 0) / todayOrders.length
        )
      : 0;

  // 🔥 Top Dishes with image support
  const topDishes = (() => {
    const map = {};
    todayOrders.forEach((order) =>
      order.items.forEach(({ menuItemId, quantity }) => {
        if (!menuItemId) return;
        const name = menuItemId.name || "Unknown Dish";
        const image = menuItemId.image || null;

        if (!map[name]) {
          map[name] = { count: 0, image };
        }
        map[name].count += quantity;
      })
    );
    return Object.entries(map)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 3)
      .map(([name, data]) => ({
        name,
        orders: data.count,
        image: data.image,
      }));
  })();

  // 🕒 Recent Orders
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)
    .map((order) => ({
      customer: order.customerId?.name || "Customer",
      dish: order.items?.[0]?.menuItemId?.name || "Dish",
      image: order.items?.[0]?.menuItemId?.image || null,
      time: dayjs(order.createdAt).format("h:mm A"),
      status: order.status,
    }));

  const stats = [
    {
      label: "Today’s Orders",
      value: todayOrders.length,
      icon: <FaUtensils className="text-orange-500 text-xl" />,
    },
    {
      label: "Earnings",
      value: `₹${earnings}`,
      icon: <FaRupeeSign className="text-green-500 text-xl" />,
    },
    {
      label: "Avg Prep Time",
      value: `${avgPrepTime} mins`,
      icon: <FaClock className="text-blue-500 text-xl" />,
    },
  ];

  return (
    <motion.div
      className="px-6 py-8 text-gray-800 dark:text-white"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* 👋 Welcome */}
      <h2 className="text-3xl font-bold mb-2">
        Welcome back, {restaurant.name || "Chef"}! 👨‍🍳
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Here's how your kitchen is performing today.
      </p>

      {/* 📊 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-secondary rounded-xl p-5 shadow hover:shadow-md flex items-center gap-4"
          >
            <div>{stat.icon}</div>
            <div>
              <h4 className="text-xl font-semibold">{stat.value}</h4>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 🔥 Top Selling Dishes */}
      <div className="mb-10">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FaChartLine /> Top Selling Dishes
        </h3>

        {topDishes.length === 0 ? (
          <div className="text-gray-500 dark:text-gray-300 text-sm">
            No orders yet to determine top selling dishes.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {topDishes.map((dish, i) => (
              <div
                key={i}
                className="bg-white dark:bg-secondary p-4 rounded-xl shadow hover:shadow-md"
              >
                <div className="h-24 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center mb-3 overflow-hidden">
                  {dish.image ? (
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-sm text-gray-400">No Image</span>
                  )}
                </div>
                <h4 className="font-semibold">{dish.name}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-300">
                  {dish.orders} orders
                </p>
                <div className="flex items-center mt-1 text-yellow-500 text-sm">
                  <FaStar className="mr-1" /> 4.{8 - i}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🕒 Recent Orders */}
      <div>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FaCheckCircle /> Recent Orders
        </h3>

        {recentOrders.length === 0 ? (
          <div className="text-gray-500 dark:text-gray-300 text-sm">
            No recent orders found.
          </div>
        ) : (
          <div className="grid gap-4">
            {recentOrders.map((order, i) => (
              <div
                key={i}
                className="bg-white dark:bg-secondary rounded-lg shadow p-4 flex justify-between items-center hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  {order.image ? (
                    <img
                      src={order.image}
                      alt={order.dish}
                      className="w-12 h-12 object-cover rounded"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center text-xs text-gray-400">
                      No Img
                    </div>
                  )}
                  <div>
                    <h4 className="font-medium">{order.dish}</h4>
                    <p className="text-xs text-gray-500">
                      {order.customer} • {order.time}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`text-sm font-medium ${
                      order.status === "Delivered"
                        ? "text-green-600"
                        : order.status === "Preparing"
                        ? "text-yellow-600"
                        : "text-red-500"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default RestaurantDashboard;
