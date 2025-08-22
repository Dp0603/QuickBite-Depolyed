import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import API from "../../api/axios";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaTruck,
  FaUtensils,
  FaBox,
} from "react-icons/fa";

const getStatusColor = (status) => {
  switch (status) {
    case "Pending":
      return "bg-slate-200 text-slate-800 border border-slate-300";
    case "Preparing":
      return "bg-yellow-100 text-yellow-800 border border-yellow-300";
    case "Ready":
      return "bg-orange-100 text-orange-800 border border-orange-300";
    case "Out for Delivery":
      return "bg-sky-100 text-sky-800 border border-sky-300";
    case "Delivered":
      return "bg-green-100 text-green-800 border border-green-300";
    case "Cancelled":
      return "bg-rose-100 text-rose-800 border border-rose-300";
    default:
      return "bg-gray-100 text-gray-700 border border-gray-300";
  }
};

const RestaurantOrders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch restaurant orders
  useEffect(() => {
    if (user?._id) {
      console.log("📡 Fetching orders for restaurant:", user._id);
      API.get(`/orders/orders/restaurant/${user._id}`)
        .then((res) => {
          console.log("✅ Orders fetched:", res.data.orders);
          setOrders(res.data.orders);
        })
        .catch((err) => {
          console.error("❌ Error fetching restaurant orders:", err);
        })
        .finally(() => {
          console.log("⏳ Finished fetching orders");
          setLoading(false);
        });
    } else {
      console.warn("⚠️ No restaurant user found in AuthContext");
    }
  }, [user]);

  // Split active vs past orders
  const activeOrders = orders.filter(
    (order) =>
      order.orderStatus !== "Delivered" && order.orderStatus !== "Cancelled"
  );
  const pastOrders = orders.filter(
    (order) =>
      order.orderStatus === "Delivered" || order.orderStatus === "Cancelled"
  );

  console.log("📊 Active Orders:", activeOrders);
  console.log("📦 Past Orders:", pastOrders);

  // Update order status
  const updateStatus = async (orderId, status) => {
    console.log(`🔄 Updating order ${orderId} to status:`, status);
    try {
      const res = await API.put(`/orders/orders/status/${orderId}`, {
        orderStatus: status,
      });
      console.log("✅ Status updated successfully:", res.data.order);

      setOrders((prev) => {
        const updated = prev.map((o) =>
          o._id === orderId ? res.data.order : o
        );
        console.log("📋 Updated orders state:", updated);
        return updated;
      });
    } catch (err) {
      console.error("❌ Failed to update status:", err);
      alert("Failed to update order status");
    }
  };

  if (loading) {
    console.log("⏳ Loading state active");
    return <p className="px-4 py-6">⏳ Loading orders...</p>;
  }

  console.log("🎨 Rendering RestaurantOrders component");

  return (
    <div className="px-4 md:px-10 py-8 text-gray-800 dark:text-white">
      <h1 className="text-3xl font-bold mb-6">📦 Restaurant Orders</h1>

      {/* Active Orders */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">🟢 Active Orders</h2>
        {activeOrders.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            No active orders right now.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {activeOrders.map((order) => {
              console.log("🟢 Rendering active order:", order);
              return (
                <div
                  key={order._id}
                  className="rounded-xl border dark:border-gray-700 shadow-sm hover:shadow-md transition p-5 bg-white dark:bg-secondary"
                >
                  {/* Header */}
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold">
                      Order #{order._id.slice(-5)}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleString()}
                    </span>
                  </div>

                  {/* Customer Info */}
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    👤 <strong>{order.customerId?.name || "Customer"}</strong>
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    📍 {order.deliveryAddress?.addressLine},{" "}
                    {order.deliveryAddress?.city}
                  </p>

                  {/* Items */}
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                    <strong>Items:</strong>{" "}
                    {order.items
                      .map(
                        (i) => `${i.menuItemId?.name || i.name} × ${i.quantity}`
                      )
                      .join(", ")}
                  </p>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Total: ₹{order.totalAmount}
                  </p>

                  {/* Status */}
                  <span
                    className={`inline-block text-xs px-3 py-1 rounded-full font-medium mb-3 ${getStatusColor(
                      order.orderStatus
                    )}`}
                  >
                    {order.orderStatus}
                  </span>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    {order.orderStatus === "Pending" && (
                      <>
                        <button
                          onClick={() => updateStatus(order._id, "Preparing")}
                          className="flex items-center gap-2 text-sm font-medium bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition"
                        >
                          <FaCheckCircle /> Accept
                        </button>
                        <button
                          onClick={() => updateStatus(order._id, "Cancelled")}
                          className="flex items-center gap-2 text-sm font-medium bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-md transition"
                        >
                          <FaTimesCircle /> Reject
                        </button>
                      </>
                    )}

                    {order.orderStatus === "Preparing" && (
                      <button
                        onClick={() => updateStatus(order._id, "Ready")}
                        className="flex items-center gap-2 text-sm font-medium bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md transition"
                      >
                        <FaUtensils /> Mark Ready
                      </button>
                    )}

                    {order.orderStatus === "Ready" && (
                      <button
                        onClick={() =>
                          updateStatus(order._id, "Out for Delivery")
                        }
                        className="flex items-center gap-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
                      >
                        <FaTruck /> Out for Delivery
                      </button>
                    )}

                    {order.orderStatus === "Out for Delivery" && (
                      <button
                        onClick={() => updateStatus(order._id, "Delivered")}
                        className="flex items-center gap-2 text-sm font-medium bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md transition"
                      >
                        <FaBox /> Mark Delivered
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Past Orders */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">📦 Past Orders</h2>
        {pastOrders.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No past orders.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {pastOrders.map((order) => {
              console.log("📦 Rendering past order:", order);
              return (
                <div
                  key={order._id}
                  className="rounded-xl border dark:border-gray-700 shadow-sm hover:shadow-md transition p-5 bg-white dark:bg-secondary"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold">
                      Order #{order._id.slice(-5)}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    👤 {order.customerId?.name || "Customer"}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    📍 {order.deliveryAddress?.addressLine},{" "}
                    {order.deliveryAddress?.city}
                  </p>
                  <span
                    className={`inline-block text-xs px-3 py-1 rounded-full font-medium capitalize ${getStatusColor(
                      order.orderStatus
                    )}`}
                  >
                    {order.orderStatus}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default RestaurantOrders;
