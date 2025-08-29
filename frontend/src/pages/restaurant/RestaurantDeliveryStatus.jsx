// src/pages/restaurant/RestaurantDeliveryStatus.jsx
import React, { useEffect, useState, useContext } from "react";
import { FaMotorcycle, FaMapMarkerAlt } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import API from "../../api/axios"; // ✅ use global axios instance
import MiniMap from "../../components/MiniMap";

const statusBadge = {
  Pending: "bg-gray-100 text-gray-600",
  Preparing: "bg-yellow-100 text-yellow-600",
  "Ready for Pickup": "bg-orange-100 text-orange-600",
  "Out for Delivery": "bg-purple-100 text-purple-700",
  Delivered: "bg-green-100 text-green-600",
  Cancelled: "bg-red-100 text-red-600",
  default: "bg-gray-200 text-gray-500",
};

const RestaurantDeliveryStatus = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("All");
  const [visibleMapOrderId, setVisibleMapOrderId] = useState(null);

  // 🔄 Fetch restaurant's orders
  const fetchOrders = async () => {
    try {
      const res = await API.get(`/orders/orders/restaurant/${user._id}`); // ✅ matches backend
      setOrders(res.data.data || []);
    } catch (err) {
      console.error(
        "❌ Error fetching orders:",
        err.response?.data || err.message
      );
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchOrders();
      const interval = setInterval(fetchOrders, 30000); // Auto-refresh every 30 sec
      return () => clearInterval(interval);
    }
  }, [user]);

  // ✏️ Update order status
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await API.put(`/orders/orders/status/${orderId}`, { status: newStatus });

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      console.error(
        "❌ Failed to update order status:",
        err.response?.data || err.message
      );
    }
  };

  // Filtered orders
  const filteredOrders =
    filter === "All"
      ? orders
      : orders.filter((order) => order.status === filter);

  // 📌 Format dish summary nicely
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

  return (
    <div className="p-6 text-gray-800 dark:text-white">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <FaMotorcycle className="text-orange-500" />
        Delivery Status / Dispatch
      </h2>

      {/* 📊 Filter dropdown */}
      <div className="mb-6">
        <label className="font-medium mr-2">Filter by Status:</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border px-3 py-1 rounded text-sm"
        >
          <option value="All">All</option>
          <option value="Preparing">Preparing</option>
          <option value="Ready for Pickup">Ready for Pickup</option>
          <option value="Out for Delivery">Out for Delivery</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {filteredOrders.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          No delivery orders found.
        </p>
      ) : (
        <div className="grid gap-5">
          {filteredOrders.map((order) => {
            const badgeStyle =
              statusBadge[order.status] || statusBadge["default"];
            const dishSummary = getDishSummary(order.items);

            return (
              <div
                key={order._id}
                className="bg-white dark:bg-secondary rounded-xl shadow hover:shadow-lg transition p-5 flex flex-col md:flex-row justify-between gap-4"
              >
                {/* Left side */}
                <div className="flex-1 space-y-1">
                  <h3 className="text-lg font-semibold">
                    Order{" "}
                    <span className="text-primary font-bold">
                      #{order._id.slice(-6).toUpperCase()}
                    </span>{" "}
                    —{" "}
                    <span className="text-gray-700 dark:text-gray-300">
                      {dishSummary}
                    </span>
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Customer: <strong>{order.customerId?.name || "N/A"}</strong>
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <FaMapMarkerAlt className="text-orange-500" />
                    {order.deliveryAddress}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>

                {/* Right side */}
                <div className="md:text-right text-sm">
                  <span
                    className={`inline-block px-3 py-1 rounded-full font-medium text-sm ${badgeStyle}`}
                  >
                    {order.status}
                  </span>

                  {/* Status actions */}
                  {order.status === "Preparing" && (
                    <button
                      onClick={() =>
                        handleStatusChange(order._id, "Ready for Pickup")
                      }
                      className="mt-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      Mark as Ready for Pickup
                    </button>
                  )}

                  {order.status === "Ready for Pickup" && (
                    <button
                      onClick={() =>
                        handleStatusChange(order._id, "Out for Delivery")
                      }
                      className="mt-2 bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
                    >
                      Mark as Out for Delivery
                    </button>
                  )}

                  {order.status === "Out for Delivery" && (
                    <button
                      onClick={() => handleStatusChange(order._id, "Delivered")}
                      className="mt-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Mark as Delivered
                    </button>
                  )}

                  {/* Rider Info */}
                  {order.riderId ? (
                    <div className="mt-2 text-gray-600 dark:text-gray-300 space-y-1">
                      <p>
                        Rider: <strong>{order.riderId.name}</strong>
                      </p>
                      <p>
                        Contact:{" "}
                        <a
                          href={`tel:${order.riderId.phone}`}
                          className="text-blue-600 hover:underline"
                        >
                          {order.riderId.phone}
                        </a>
                      </p>
                    </div>
                  ) : (
                    <p className="mt-2 text-gray-400 italic">
                      No rider assigned
                    </p>
                  )}

                  {/* 🗺️ Track Order */}
                  {order.status === "Out for Delivery" && (
                    <div className="mt-3">
                      {order.riderId?.location?.lat &&
                      order.riderId?.location?.lng ? (
                        <>
                          <button
                            onClick={() =>
                              setVisibleMapOrderId(
                                visibleMapOrderId === order._id
                                  ? null
                                  : order._id
                              )
                            }
                            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                          >
                            {visibleMapOrderId === order._id
                              ? "Hide Map"
                              : "Track Order"}
                          </button>

                          {visibleMapOrderId === order._id && (
                            <div className="mt-2">
                              <MiniMap
                                lat={order.riderId.location.lat}
                                lng={order.riderId.location.lng}
                                riderName={order.riderId.name}
                              />
                            </div>
                          )}
                        </>
                      ) : (
                        <p className="text-gray-400 italic">
                          Rider location not available
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RestaurantDeliveryStatus;
