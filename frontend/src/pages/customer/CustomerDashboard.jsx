import React, { useEffect, useState, useContext } from "react";
import {
  FaCrown,
  FaStar,
  FaShoppingCart,
  FaClock,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import API from "../../api/axios";

const CustomerDashboard = () => {
  const { user, token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const navigate = useNavigate();

  // 🔄 Fetch Orders
  useEffect(() => {
    if (user?._id) {
      API.get(`/orders/customer/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => setOrders(res.data.data.slice(0, 3)))
        .catch((err) =>
          console.error(
            "❌ Failed to fetch orders:",
            err.response?.data?.message
          )
        );
    }
  }, [user]);

  // 🔄 Fetch Reviews
  useEffect(() => {
    API.get("/reviews/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        const reviews = res.data.data;
        if (reviews.length) {
          const avg =
            reviews.reduce((a, b) => a + b.rating, 0) / reviews.length;
          setAverageRating(avg.toFixed(1));
        }
      })
      .catch((err) =>
        console.error(
          "❌ Failed to fetch reviews:",
          err.response?.data?.message
        )
      );
  }, []);

  // 🔄 Fetch Restaurants
  useEffect(() => {
    API.get("/restaurant/public/restaurants")
      .then((res) => {
        const top = res.data.data
          .sort((a, b) => b.ratings - a.ratings)
          .slice(0, 3);
        setRecommended(top);
      })
      .catch((err) =>
        console.error(
          "❌ Failed to fetch restaurants:",
          err.response?.data?.message
        )
      );
  }, []);

  return (
    <motion.div
      className="px-4 sm:px-8 md:px-10 lg:px-12 py-8 text-gray-800 dark:text-white"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* 👋 Welcome */}
      <h2 className="text-3xl font-bold mb-2">
        Welcome back, {user?.name?.split(" ")[0] || "Foodie"} 👋
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Here’s what’s cooking in your QuickBite world.
      </p>

      {/* 📊 Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white dark:bg-secondary rounded-xl p-5 shadow hover:shadow-md">
          <FaShoppingCart className="text-2xl text-primary mb-2" />
          <h4 className="text-xl font-semibold">{orders.length} Orders</h4>
          <p className="text-sm text-gray-500">Last 3 Orders</p>
        </div>
        <div className="bg-white dark:bg-secondary rounded-xl p-5 shadow hover:shadow-md">
          <FaCrown className="text-2xl text-yellow-500 mb-2" />
          <h4 className="text-xl font-semibold">₹4,150 Saved</h4>
          <p className="text-sm text-gray-500">Using Premium</p>
        </div>
        <div className="bg-white dark:bg-secondary rounded-xl p-5 shadow hover:shadow-md">
          <FaStar className="text-2xl text-yellow-400 mb-2" />
          <h4 className="text-xl font-semibold">
            {averageRating || "0.0"} Rating
          </h4>
          <p className="text-sm text-gray-500">From your reviews</p>
        </div>
      </div>

      {/* 🏅 Premium Membership */}
      <div className="bg-gradient-to-r from-orange-100 to-orange-200 dark:from-orange-600 dark:to-orange-500 rounded-xl p-6 flex justify-between items-center mb-10 shadow hover:shadow-lg transition">
        <div className="flex items-center gap-4">
          <FaCrown className="text-yellow-600 text-3xl" />
          <div>
            <h2 className="text-lg font-semibold">Premium Membership Active</h2>
            <p className="text-sm text-gray-700 dark:text-gray-200">
              Valid till: March 2025
            </p>
          </div>
        </div>
        <button
          className="bg-white text-primary font-medium px-4 py-2 rounded-lg shadow hover:bg-gray-100"
          onClick={() => navigate("/premium-benefits")}
        >
          View Benefits
        </button>
      </div>

      {/* 🍽️ Recommended Restaurants */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">🍽️ Recommended Restaurants</h3>
          <button
            onClick={() => navigate("/customer/browse")}
            className="text-primary hover:underline text-sm font-medium"
          >
            View All →
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {recommended.map((res) => (
            <div
              key={res._id}
              onClick={() => navigate(`/restaurant/${res._id}/menu`)}
              className="cursor-pointer bg-white dark:bg-secondary p-4 rounded-xl shadow hover:shadow-md transition"
            >
              <img
                src={res.logoUrl || "/QuickBite.png"}
                alt={res.restaurantName}
                className="h-24 w-full object-cover rounded mb-3"
              />
              <h4 className="font-semibold">{res.restaurantName}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-300 flex items-center gap-1">
                <FaMapMarkerAlt /> {res.address?.city || "Unknown"} • ₹20
                Delivery
              </p>
              <div className="flex items-center mt-1 text-yellow-500 text-sm">
                <FaStar className="mr-1" /> {res.ratings?.toFixed(1) || "4.5"}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🕒 Recent Orders */}
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <FaClock /> Recent Orders
      </h3>
      <div className="grid gap-4">
        {orders.length === 0 ? (
          <p className="text-sm text-gray-500">
            You haven't placed any orders yet.
          </p>
        ) : (
          orders.map((order, i) => (
            <div
              key={i}
              className="bg-white dark:bg-secondary rounded-lg shadow p-4 flex justify-between items-center hover:shadow-md"
            >
              <div>
                <h4 className="font-medium truncate max-w-[260px]">
                  {order.items.map((i) => i.menuItemId?.name).join(", ")}
                </h4>
                <p className="text-xs text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">₹{order.totalAmount}</p>
                <span
                  className={`text-sm font-medium ${
                    order.status === "Delivered"
                      ? "text-green-600"
                      : order.status === "Pending"
                      ? "text-yellow-600"
                      : order.status === "Cancelled"
                      ? "text-red-500"
                      : "text-blue-500"
                  }`}
                >
                  {order.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default CustomerDashboard;
