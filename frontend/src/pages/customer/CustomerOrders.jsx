import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext"; // ✅ Adjust path if needed
import API from "../../api/axios";
import {
  FaRedoAlt,
  FaFileInvoice,
  FaMapMarkedAlt,
  FaEye,
} from "react-icons/fa"; // 👈 FaEye for view button

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

const CustomerOrders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?._id) {
      API.get(`/orders/orders/customer/${user._id}`)
        .then((res) => setOrders(res.data.orders))
        .catch((err) =>
          console.error("❌ Error fetching customer orders:", err)
        );
    }
  }, [user]);

  const activeOrders = orders.filter(
    (order) =>
      order.orderStatus !== "Delivered" && order.orderStatus !== "Cancelled"
  );

  const pastOrders = orders.filter(
    (order) =>
      order.orderStatus === "Delivered" || order.orderStatus === "Cancelled"
  );

  const downloadInvoice = (orderId) => {
    if (!orderId) return;
    window.open(`/api/payment/invoice/${orderId}`, "_blank");
  };

  const handleReorder = async (order) => {
    try {
      // Clear existing cart (optional, or enforce same restaurant rule)
      await API.delete(`/cart/${user._id}`);

      // Re-add each item from past order to cart
      for (const item of order.items) {
        await API.post("/cart", {
          userId: user._id,
          restaurantId: order.restaurantId._id,
          menuItemId: item.menuItemId._id,
          quantity: item.quantity,
          note: item.note || "",
        });
      }

      // Navigate to cart
      navigate("/customer/cart");
    } catch (err) {
      console.error("Error during reorder:", err);
      alert("Failed to reorder. Please try again.");
    }
  };

  return (
    <div className="px-4 md:px-10 py-8 text-gray-800 dark:text-white">
      <h1 className="text-3xl font-bold mb-6">🛒 Your Orders</h1>

      {/* Active Orders */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">🟢 Active Orders</h2>
        {activeOrders.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            You currently have no active orders.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {activeOrders.map((order) => (
              <div
                key={order._id}
                className="rounded-xl border dark:border-gray-700 shadow-sm hover:shadow-md transition p-5 bg-white dark:bg-secondary"
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold">
                    {order.restaurantId?.name || "Restaurant"}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(
                      order.orderStatus
                    )}`}
                  >
                    {order.orderStatus}
                  </span>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                  <strong>Items:</strong>{" "}
                  {order.items
                    .map(
                      (i) => `${i.menuItemId?.name || "Item"} × ${i.quantity}`
                    )
                    .join(", ")}
                </p>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-4">
                  Total: ₹{order.totalAmount}
                </p>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() =>
                      navigate(`/customer/track-order/${order._id}`)
                    }
                    className="flex items-center gap-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
                  >
                    <FaMapMarkedAlt />
                    Track Order
                  </button>

                  <button
                    onClick={() =>
                      navigate(`/customer/order-details/${order._id}`)
                    }
                    className="flex items-center gap-2 text-sm font-medium bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition"
                  >
                    <FaEye />
                    View Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Past Orders */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">📦 Past Orders</h2>
        {pastOrders.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            No past orders found.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {pastOrders.map((order) => (
              <div
                key={order._id}
                className="rounded-xl border dark:border-gray-700 shadow-sm hover:shadow-md transition p-5 bg-white dark:bg-secondary"
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold">
                    {order.restaurantId?.name || "Restaurant"}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${getStatusColor(
                      order.orderStatus
                    )}`}
                  >
                    {order.orderStatus}
                  </span>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                  <strong>Items:</strong>{" "}
                  {order.items
                    .map(
                      (i) => `${i.menuItemId?.name || "Item"} × ${i.quantity}`
                    )
                    .join(", ")}
                </p>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-4">
                  Total: ₹{order.totalAmount}
                </p>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => handleReorder(order)}
                    className="flex items-center gap-2 text-sm font-medium bg-primary hover:bg-orange-600 text-white px-4 py-2 rounded-md transition"
                  >
                    <FaRedoAlt />
                    Reorder
                  </button>
                  <button
                    onClick={() => downloadInvoice(order._id)}
                    className="flex items-center gap-2 text-sm font-medium bg-green-100 dark:bg-green-700 text-green-800 dark:text-white px-4 py-2 rounded-md hover:bg-green-200 dark:hover:bg-green-600 transition"
                  >
                    <FaFileInvoice />
                    Download Invoice
                  </button>

                  <button
                    onClick={() =>
                      navigate(`/customer/order-details/${order._id}`)
                    }
                    className="flex items-center gap-2 text-sm font-medium bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition"
                  >
                    <FaEye />
                    View Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default CustomerOrders;
