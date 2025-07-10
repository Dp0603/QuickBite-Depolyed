import React from "react";
import { FaMotorcycle, FaMapMarkerAlt } from "react-icons/fa";

const orders = [
  {
    id: "ORD-1024",
    customer: "Ananya Gupta",
    dish: "Butter Chicken x1",
    deliveryStatus: "Out for Delivery",
    address: "A-12, Sector 62, Noida",
    time: "Jul 9, 2025 - 1:40 PM",
    rider: "Ravi Kumar",
    contact: "+91 9876543210",
  },
  {
    id: "ORD-1025",
    customer: "Rahul Verma",
    dish: "Veg Thali x2",
    deliveryStatus: "Picked Up",
    address: "D-56, Connaught Place, Delhi",
    time: "Jul 9, 2025 - 1:20 PM",
    rider: "Nisha Singh",
    contact: "+91 9876500001",
  },
  {
    id: "ORD-1026",
    customer: "Sneha Tiwari",
    dish: "Paneer Tikka x1",
    deliveryStatus: "Preparing",
    address: "F-92, Indirapuram, Ghaziabad",
    time: "Jul 9, 2025 - 12:50 PM",
    rider: "-",
    contact: "-",
  },
];

const statusBadge = {
  Preparing: "bg-yellow-100 text-yellow-600",
  "Picked Up": "bg-blue-100 text-blue-600",
  "Out for Delivery": "bg-purple-100 text-purple-700",
  Delivered: "bg-green-100 text-green-600",
  default: "bg-gray-100 text-gray-500",
};

const DeliveryCard = ({ order }) => {
  const badgeStyle =
    statusBadge[order.deliveryStatus] || statusBadge["default"];

  return (
    <div className="bg-white dark:bg-secondary rounded-xl shadow hover:shadow-lg transition p-5 flex flex-col md:flex-row justify-between gap-4">
      {/* Left Section */}
      <div className="flex-1 space-y-1">
        <h3 className="text-lg font-semibold">
          Order <span className="text-primary font-bold">#{order.id}</span> —{" "}
          <span className="text-gray-700 dark:text-gray-300">{order.dish}</span>
        </h3>

        <p className="text-sm text-gray-600 dark:text-gray-300">
          Customer: <strong>{order.customer}</strong>
        </p>

        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
          <FaMapMarkerAlt className="text-orange-500" />
          {order.address}
        </p>

        <p className="text-xs text-gray-400">{order.time}</p>
      </div>

      {/* Right Section */}
      <div className="md:text-right text-sm">
        <span
          className={`inline-block px-3 py-1 rounded-full font-medium text-sm ${badgeStyle}`}
        >
          {order.deliveryStatus}
        </span>

        {order.rider !== "-" ? (
          <div className="mt-2 text-gray-600 dark:text-gray-300 space-y-1">
            <p>
              Rider: <strong>{order.rider}</strong>
            </p>
            <p>
              Contact:{" "}
              <a
                href={`tel:${order.contact}`}
                className="text-blue-600 hover:underline"
                aria-label={`Call ${order.rider}`}
                rel="noopener noreferrer"
              >
                {order.contact}
              </a>
            </p>
          </div>
        ) : (
          <p className="mt-2 text-gray-400 italic">No rider assigned</p>
        )}
      </div>
    </div>
  );
};

const RestaurantDeliveryStatus = () => {
  return (
    <div className="p-6 text-gray-800 dark:text-white">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <FaMotorcycle className="text-orange-500" />
        Delivery Status / Dispatch
      </h2>

      <div className="grid gap-5">
        {orders.map((order) => (
          <DeliveryCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
};

export default RestaurantDeliveryStatus;
