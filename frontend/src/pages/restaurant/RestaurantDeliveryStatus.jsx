import React from "react";
import { FaMotorcycle, FaMapMarkerAlt, FaCheckCircle } from "react-icons/fa";

const RestaurantDeliveryStatus = () => {
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

  const getStatusColor = (status) => {
    switch (status) {
      case "Preparing":
        return "text-yellow-500";
      case "Picked Up":
        return "text-blue-500";
      case "Out for Delivery":
        return "text-purple-600";
      case "Delivered":
        return "text-green-600";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="p-6 text-gray-800 dark:text-white">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <FaMotorcycle className="text-orange-500" />
        Delivery Status / Dispatch
      </h2>

      <div className="grid gap-5">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white dark:bg-secondary rounded-xl shadow-md p-5 flex flex-col md:flex-row justify-between gap-4"
          >
            <div className="flex-1 space-y-1">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Order{" "}
                <span className="text-primary font-bold">#{order.id}</span> —{" "}
                <span className="text-gray-700 dark:text-gray-300">
                  {order.dish}
                </span>
              </h3>

              <p className="text-sm text-gray-500">
                Customer: <strong>{order.customer}</strong>
              </p>

              <p className="text-sm text-gray-500 flex items-center gap-1">
                <FaMapMarkerAlt className="text-orange-500" />
                {order.address}
              </p>

              <p className="text-sm text-gray-400">{order.time}</p>
            </div>

            <div className="md:text-right text-sm">
              <p
                className={`font-semibold text-base ${getStatusColor(
                  order.deliveryStatus
                )}`}
              >
                {order.deliveryStatus}
              </p>

              {order.rider !== "-" ? (
                <div className="mt-2 text-gray-600 dark:text-gray-300">
                  <p>
                    Rider: <strong>{order.rider}</strong>
                  </p>
                  <p>
                    Contact:{" "}
                    <a
                      href={`tel:${order.contact}`}
                      className="text-blue-600 hover:underline"
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
        ))}
      </div>
    </div>
  );
};

export default RestaurantDeliveryStatus;
