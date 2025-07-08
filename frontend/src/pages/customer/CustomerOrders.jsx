import React from "react";
import { useNavigate } from "react-router-dom";
import { FaRedoAlt, FaFileInvoice, FaMapMarkedAlt } from "react-icons/fa";

const dummyOrders = [
  {
    id: "ORD12345",
    restaurant: "Pizza Palace",
    date: "2025-07-07",
    status: "Preparing",
    items: ["Margherita Pizza", "Garlic Bread"],
    total: 499,
  },
  {
    id: "ORD12344",
    restaurant: "Sushi World",
    date: "2025-06-30",
    status: "Delivered",
    items: ["Sushi Rolls", "Miso Soup"],
    total: 649,
  },
  {
    id: "ORD12343",
    restaurant: "Burger Barn",
    date: "2025-06-25",
    status: "Cancelled",
    items: ["Cheese Burger", "Fries"],
    total: 299,
  },
];

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
  const navigate = useNavigate();

  const activeOrders = dummyOrders.filter(
    (order) => order.status !== "Delivered" && order.status !== "Cancelled"
  );
  const pastOrders = dummyOrders.filter(
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
                key={order.id}
                className="rounded-xl border dark:border-gray-700 shadow-sm hover:shadow-md transition p-5 bg-white dark:bg-secondary"
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold">{order.restaurant}</h3>
                  <span className="text-sm text-gray-500">{order.date}</span>
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
                  <strong>Items:</strong> {order.items.join(", ")}
                </p>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-4">
                  Total: ₹{order.total}
                </p>

                <button
                  onClick={() => navigate(`/customer/track-order/${order.id}`)}
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
                key={order.id}
                className="rounded-xl border dark:border-gray-700 shadow-sm hover:shadow-md transition p-5 bg-white dark:bg-secondary"
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold">{order.restaurant}</h3>
                  <span className="text-sm text-gray-500">{order.date}</span>
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
                  <strong>Items:</strong> {order.items.join(", ")}
                </p>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-4">
                  Total: ₹{order.total}
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
