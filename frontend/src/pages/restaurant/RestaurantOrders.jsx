import React, { useState } from "react";
import {
  FaClock,
  FaTruck,
  FaCheckCircle,
  FaUtensils,
  FaArrowRight,
} from "react-icons/fa";

const dummyOrders = [
  {
    id: "ORD1001",
    time: "10:30 AM",
    status: "Preparing",
    items: ["Paneer Butter Masala", "2 Butter Naan"],
    total: "₹480",
  },
  {
    id: "ORD1002",
    time: "10:45 AM",
    status: "Ready",
    items: ["Veg Biryani", "Raita"],
    total: "₹320",
  },
  {
    id: "ORD1003",
    time: "11:00 AM",
    status: "Out for Delivery",
    items: ["Chicken Wrap", "Coke"],
    total: "₹250",
  },
];

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
  const [orders, setOrders] = useState(dummyOrders);

  const updateStatus = (index) => {
    setOrders((prev) => {
      const updated = [...prev];
      updated[index].status =
        nextStatus[updated[index].status] || updated[index].status;
      return updated;
    });
  };

  const groupedOrders = {
    Preparing: [],
    Ready: [],
    "Out for Delivery": [],
    Delivered: [],
  };

  orders.forEach((order, index) => {
    groupedOrders[order.status].push({ ...order, index });
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
              key={order.id}
              className="bg-white dark:bg-secondary rounded-lg p-4 shadow hover:shadow-md transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">
                    #{order.id} • {order.time}
                  </p>
                  <ul className="text-sm text-gray-600 dark:text-gray-300 list-disc ml-4 mt-1">
                    {order.items.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                  <p className="mt-2 text-sm text-gray-500">
                    Total: <strong>{order.total}</strong>
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
                      onClick={() => updateStatus(order.index)}
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
      {renderSection("Preparing", <FaUtensils />)}
      {renderSection("Ready", <FaCheckCircle />)}
      {renderSection("Out for Delivery", <FaTruck />)}
      {renderSection("Delivered", <FaClock />)}
    </div>
  );
};

export default RestaurantOrders;
