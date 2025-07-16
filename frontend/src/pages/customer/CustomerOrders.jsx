import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext"; // ✅ Adjust path as needed
import API from "../../api/axios"; // ✅ Axios instance with base URL and token
import { FaRedoAlt, FaFileInvoice, FaMapMarkedAlt } from "react-icons/fa";

const getStatusColor = (status) => {
  switch (status) {
    case "Preparing":
      return "bg-yellow-100 text-yellow-700";
    case "Out for Delivery":
      return "bg-blue-100 text-blue-700";
    case "Delivered":
      return "bg-green-100 text-green-700";
    case "Cancelled":
      return "bg-red-100 text-red-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const CustomerOrders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?._id) {
      API.get(`/orders/customer/${user._id}`)
        .then((res) => setOrders(res.data.data))
        .catch((err) =>
          console.error("❌ Error fetching customer orders:", err)
        );
    }
  }, [user]);

  const activeOrders = orders.filter(
    (order) => order.status !== "Delivered" && order.status !== "Cancelled"
  );

  const pastOrders = orders.filter(
    (order) => order.status === "Delivered" || order.status === "Cancelled"
  );

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
                      order.status
                    )}`}
                  >
                    {order.status}
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

                <button
                  onClick={() => navigate(`/customer/track-order/${order._id}`)}
                  className="flex items-center gap-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
                >
                  <FaMapMarkedAlt />
                  Track Order
                </button>
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
                    className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
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
                    onClick={() => alert("Reordering not implemented yet")}
                    className="flex items-center gap-2 text-sm font-medium bg-primary hover:bg-orange-600 text-white px-4 py-2 rounded-md transition"
                  >
                    <FaRedoAlt />
                    Reorder
                  </button>
                  <button
                    onClick={() => alert("Invoice not available yet")}
                    className="flex items-center gap-2 text-sm font-medium bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-md transition"
                  >
                    <FaFileInvoice />
                    View Invoice
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
