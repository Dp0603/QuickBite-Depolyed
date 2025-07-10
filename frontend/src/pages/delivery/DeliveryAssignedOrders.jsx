import React from "react";
import { FaClock, FaMapMarkerAlt, FaStore } from "react-icons/fa";

const dummyOrders = [
  {
    id: "ORD1234",
    restaurant: "Spice Villa",
    customer: "Riya Sharma",
    address: "12 MG Road, Delhi",
    time: "2:40 PM",
    status: "Picked Up",
  },
  {
    id: "ORD1235",
    restaurant: "Burger Bros",
    customer: "Ankit Mehra",
    address: "55 Connaught Place, Delhi",
    time: "2:55 PM",
    status: "Pending Pickup",
  },
];

const statusBadge = (status) => {
  switch (status) {
    case "Picked Up":
      return "bg-blue-100 text-blue-700";
    case "Pending Pickup":
      return "bg-yellow-100 text-yellow-700";
    case "Delivered":
      return "bg-green-100 text-green-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const DeliveryAssignedOrders = () => {
  return (
    <div className="p-6 text-gray-800 dark:text-white">
      <h2 className="text-2xl font-bold mb-6">📦 Assigned Deliveries</h2>

      <div className="space-y-5">
        {dummyOrders.map((order) => (
          <div
            key={order.id}
            className="bg-white dark:bg-secondary rounded-xl shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
          >
            {/* LEFT SIDE */}
            <div className="space-y-2">
              <p className="text-sm text-gray-400 font-mono tracking-wide">
                Order ID: <span className="text-gray-600">#{order.id}</span>
              </p>

              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FaStore className="text-primary" />
                {order.restaurant}
              </h3>

              <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <p>
                  <span className="font-medium">Customer:</span>{" "}
                  {order.customer}
                </p>
                <p className="flex items-start gap-2">
                  <FaMapMarkerAlt className="mt-0.5 text-orange-500 shrink-0" />
                  <span className="line-clamp-2">{order.address}</span>
                </p>
                <p className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                  <FaClock />
                  ETA: {order.time}
                </p>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="text-right ml-auto md:ml-0">
              <span
                className={`inline-block text-xs sm:text-sm font-semibold px-3 py-1 rounded-full capitalize ${statusBadge(
                  order.status
                )}`}
              >
                {order.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeliveryAssignedOrders;
