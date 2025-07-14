import React, { useEffect, useState, useRef } from "react";
import {
  FaClock,
  FaTruck,
  FaCheckCircle,
  FaUtensils,
  FaArrowRight,
  FaSearch,
} from "react-icons/fa";
import API from "../../api/axios";

const statusColors = {
  Preparing: "text-yellow-600 bg-yellow-100",
  Ready: "text-blue-600 bg-blue-100",
  "Out for Delivery": "text-purple-600 bg-purple-100",
  Delivered: "text-green-600 bg-green-100",
};

const nextStatus = {
  Preparing: "Ready",
  Ready: "Out for Delivery",
  "Out for Delivery": "Delivered",
  Delivered: "Delivered",
};

const RestaurantOrders = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const audioRef = useRef(null);

  const fetchOrders = async () => {
    try {
      const res = await API.get("/restaurant/orders");
      setOrders(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, currentStatus) => {
    const newStatus = nextStatus[currentStatus];
    try {
      await API.put(`/restaurant/orders/${orderId}`, { status: newStatus });
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
      // 🔊 Play success sound
      audioRef.current?.play();
    } catch (err) {
      console.error("Failed to update order status:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // 🧠 Grouping orders
  const groupedOrders = {
    Preparing: [],
    Ready: [],
    "Out for Delivery": [],
    Delivered: [],
  };

  orders
    .filter((o) =>
      o.customerId?.name?.toLowerCase().includes(search.toLowerCase())
    )
    .forEach((order) => {
      if (groupedOrders[order.status]) {
        groupedOrders[order.status].push(order);
      }
    });

  const renderSection = (status, icon) => (
    <div className="mb-10">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        {icon}
        {status} Orders
      </h3>

      {groupedOrders[status].length === 0 ? (
        <p className="text-gray-500 text-sm">No orders in this status.</p>
      ) : (
        <div className="grid gap-4">
          {groupedOrders[status].map((order) => (
            <div
              key={order._id}
              className="bg-white dark:bg-secondary rounded-lg p-4 shadow hover:shadow-md transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">
                    #{order._id.slice(-5)} •{" "}
                    {new Date(order.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 italic">
                    👤 {order.customerId?.name || "Customer"}
                  </p>
                  <ul className="text-sm text-gray-600 dark:text-gray-300 list-disc ml-4 mt-1">
                    {order.items.map((item, idx) => (
                      <li key={idx}>
                        {item.menuItemId?.name || "Item"} x {item.quantity}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-2 text-sm text-gray-500">
                    Total: <strong>₹{order.totalAmount}</strong>
                  </p>
                </div>

                <div className="text-right">
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      statusColors[order.status]
                    }`}
                  >
                    {order.status}
                  </span>

                  {order.status !== "Delivered" && (
                    <button
                      onClick={() => updateStatus(order._id, order.status)}
                      className="mt-2 flex items-center gap-1 bg-primary text-white text-xs px-3 py-1 rounded hover:bg-orange-600 transition"
                    >
                      <FaArrowRight />
                      Mark as {nextStatus[order.status]}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6 text-gray-800 dark:text-white">
      <h2 className="text-2xl font-bold mb-6">📦 Manage Orders</h2>

      {/* 🔍 Search by Customer */}
      <div className="mb-6 flex items-center gap-2 max-w-md">
        <FaSearch />
        <input
          type="text"
          placeholder="Search by customer name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-600"
        />
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Loading orders...</p>
      ) : (
        <>
          {renderSection("Preparing", <FaUtensils />)}
          {renderSection("Ready", <FaCheckCircle />)}
          {renderSection("Out for Delivery", <FaTruck />)}
          {renderSection("Delivered", <FaClock />)}
        </>
      )}

      {/* 🔊 Hidden Audio Element */}
      <audio ref={audioRef} src="/sounds/update.mp3" preload="auto" />
    </div>
  );
};

export default RestaurantOrders;
