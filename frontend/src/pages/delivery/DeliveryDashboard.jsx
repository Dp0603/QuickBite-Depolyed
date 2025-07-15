import React from "react";
import { motion } from "framer-motion";
import {
  FaBiking,
  FaRupeeSign,
  FaClock,
  FaMapMarkedAlt,
  FaClipboardList,
} from "react-icons/fa";

const DeliveryDashboard = () => {
  const stats = [
    {
      icon: <FaClipboardList className="text-primary text-2xl mb-2" />,
      label: "Total Deliveries",
      value: 124,
      desc: "All-time record",
    },
    {
      icon: <FaRupeeSign className="text-green-600 text-2xl mb-2" />,
      label: "Earnings Today",
      value: "₹620",
      desc: "Across 6 deliveries",
    },
    {
      icon: <FaClock className="text-yellow-500 text-2xl mb-2" />,
      label: "Avg. Delivery Time",
      value: "27 min",
      desc: "Today’s average",
    },
  ];

  const recentDeliveries = [
    {
      orderId: "ORD1243",
      time: "2:45 PM",
      customer: "Ananya Gupta",
      address: "A-12, Sector 62, Noida",
      status: "Delivered",
    },
    {
      orderId: "ORD1241",
      time: "1:50 PM",
      customer: "Rahul Verma",
      address: "D-55, Connaught Place, Delhi",
      status: "Delivered",
    },
    {
      orderId: "ORD1239",
      time: "12:10 PM",
      customer: "Sneha Tiwari",
      address: "F-92, Indirapuram, Ghaziabad",
      status: "Ongoing",
    },
  ];

  return (
    <motion.div
      className="px-4 sm:px-8 md:px-10 lg:px-12 py-8 text-gray-800 dark:text-white"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* 👋 Welcome */}
      <h2 className="text-3xl font-bold mb-2">Welcome back, Rider! 🛵</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Here’s a snapshot of your delivery performance today.
      </p>

      {/* 📊 Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-secondary rounded-xl p-5 shadow hover:shadow-md transition"
          >
            {stat.icon}
            <h4 className="text-xl font-semibold">{stat.value}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {stat.label}
            </p>
            <p className="text-xs text-gray-400 mt-1">{stat.desc}</p>
          </div>
        ))}
      </div>

      {/* 🗺️ Active Route Highlight */}
      <div className="bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-700 dark:to-blue-600 rounded-xl p-6 flex justify-between items-center mb-10 shadow hover:shadow-lg transition">
        <div className="flex items-center gap-4">
          <FaMapMarkedAlt className="text-blue-800 dark:text-white text-3xl" />
          <div>
            <h2 className="text-lg font-semibold">Next Delivery Assigned</h2>
            <p className="text-sm text-gray-700 dark:text-gray-100">
              Order ID: <strong>ORD1239</strong> • ETA: 15 mins
            </p>
          </div>
        </div>
        <button className="bg-white text-primary font-medium px-4 py-2 rounded-lg shadow hover:bg-gray-100 text-sm">
          View Route
        </button>
      </div>

      {/* 🕒 Recent Deliveries */}
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <FaBiking /> Recent Deliveries
      </h3>
      <div className="grid gap-4">
        {recentDeliveries.map((item, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-secondary rounded-lg shadow p-4 flex justify-between items-center hover:shadow-md transition"
          >
            <div>
              <h4 className="font-medium">
                #{item.orderId} — {item.customer}
              </h4>
              <p className="text-xs text-gray-500">{item.address}</p>
              <p className="text-xs text-gray-400">{item.time}</p>
            </div>
            <div className="text-right text-sm font-semibold">
              <span
                className={`${
                  item.status === "Delivered"
                    ? "text-green-600"
                    : "text-yellow-600"
                }`}
              >
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default DeliveryDashboard;


// import React, { useEffect, useState, useContext } from "react";
// import axios from "axios";
// import { AuthContext } from "../../context/AuthContext";

// const DeliveryDashboard = () => {
//   const { user, token } = useContext(AuthContext);
//   const [orders, setOrders] = useState([]);

//   useEffect(() => {
//     const fetchAssignedOrders = async () => {
//       try {
//         const res = await axios.get(`/api/orders/delivery-agent/${user._id}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setOrders(res.data.data);
//       } catch (err) {
//         console.error("Failed to fetch assigned orders:", err);
//       }
//     };

//     if (user?._id) {
//       fetchAssignedOrders();
//     }
//   }, [user, token]);

//   const handleStatusUpdate = async (orderId, newStatus) => {
//     try {
//       await axios.put(
//         `/api/orders/${orderId}/status`,
//         { status: newStatus },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setOrders((prev) =>
//         prev.map((order) =>
//           order._id === orderId ? { ...order, status: newStatus } : order
//         )
//       );
//     } catch (err) {
//       console.error("Failed to update status:", err);
//     }
//   };

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-4">Assigned Deliveries</h2>
//       <div className="space-y-4">
//         {orders.map((order) => (
//           <div key={order._id} className="bg-white p-4 rounded shadow">
//             <p>
//               <strong>Restaurant:</strong> {order.restaurantId.name}
//             </p>
//             <p>
//               <strong>Address:</strong> {order.deliveryAddress}
//             </p>
//             <p>
//               <strong>Status:</strong> {order.status}
//             </p>
//             <div className="space-x-2 mt-2">
//               {order.status === "Ready for Pickup" && (
//                 <button
//                   onClick={() => handleStatusUpdate(order._id, "Out for Delivery")}
//                   className="bg-blue-500 text-white px-3 py-1 rounded"
//                 >
//                   Picked Up
//                 </button>
//               )}
//               {order.status === "Out for Delivery" && (
//                 <button
//                   onClick={() => handleStatusUpdate(order._id, "Delivered")}
//                   className="bg-green-500 text-white px-3 py-1 rounded"
//                 >
//                   Mark as Delivered
//                 </button>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default DeliveryDashboard;
