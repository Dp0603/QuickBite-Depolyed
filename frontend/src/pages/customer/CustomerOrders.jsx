import React, { useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import API from "../../api/axios";
import {
  FaRedoAlt,
  FaFileInvoice,
  FaMapMarkedAlt,
  FaEye,
  FaBoxOpen,
  FaClock,
} from "react-icons/fa";

// 🔹 Utility: Dynamic order status color
const getStatusColor = (status) => {
  switch (status) {
    case "Pending":
      return "bg-slate-100 text-slate-800 border border-slate-200";
    case "Preparing":
      return "bg-yellow-100 text-yellow-800 border border-yellow-200";
    case "Ready":
      return "bg-orange-100 text-orange-800 border border-orange-200";
    case "Out for Delivery":
      return "bg-sky-100 text-sky-800 border border-sky-200";
    case "Delivered":
      return "bg-green-100 text-green-800 border border-green-200";
    case "Cancelled":
      return "bg-rose-100 text-rose-800 border border-rose-200";
    default:
      return "bg-gray-100 text-gray-700 border border-gray-200";
  }
};

const CustomerOrders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  // 🔹 Fetch Orders
  useEffect(() => {
    if (!user?._id) return;
    const fetchOrders = async () => {
      try {
        const res = await API.get(`/orders/orders/customer/${user._id}`);
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error("❌ Error fetching customer orders:", err);
      }
    };
    fetchOrders();
  }, [user]);

  // 🔹 Split Orders
  const activeOrders = orders.filter(
    (o) => o.orderStatus !== "Delivered" && o.orderStatus !== "Cancelled"
  );
  const pastOrders = orders.filter(
    (o) => o.orderStatus === "Delivered" || o.orderStatus === "Cancelled"
  );

  // 🔹 Download Invoice
  const downloadInvoice = (id) =>
    id && window.open(`/api/payment/invoice/${id}`, "_blank");

  // 🔹 Reorder
  const handleReorder = async (order) => {
    try {
      const res = await API.post(`/cart/reorder/${user._id}/${order._id}`);
      if (res.data?.cart) navigate("/customer/cart");
      else alert("Some items are unavailable to reorder.");
    } catch (err) {
      console.error("❌ Error during reorder:", err);
      alert("Failed to reorder. Please try again.");
    }
  };

  // 🔹 Order Card UI
  const renderOrderCard = (order, index) => (
    <motion.div
      key={order._id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
      className="relative rounded-2xl border border-orange-200 dark:border-white/10 shadow-lg hover:shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 transition-all"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-pink-500/10 rounded-2xl blur-xl opacity-40"></div>
      <div className="relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FaBoxOpen className="text-orange-500" />
            {order.restaurantId?.name || "Restaurant"}
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <FaClock />{" "}
            {new Date(order.createdAt).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>

        {/* Status */}
        <span
          className={`inline-block text-xs px-3 py-1 mb-3 rounded-full font-semibold ${getStatusColor(
            order.orderStatus
          )}`}
        >
          {order.orderStatus}
        </span>

        {/* Items */}
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
          <strong>Items:</strong>{" "}
          {order.items
            .map((i) => `${i.menuItemId?.name || "Item"} × ${i.quantity}`)
            .join(", ")}
        </p>

        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
          Total: ₹{order.totalAmount.toFixed(2)}
        </p>

        {/* Premium info */}
        {order.premiumApplied && (
          <div className="mb-3">
            <p className="text-sm text-green-700 dark:text-green-400 font-semibold">
              💎 Saved ₹{order.savings} with Premium
            </p>
            <span className="text-xs px-2 py-1 bg-yellow-200 text-yellow-800 rounded-full">
              Premium Applied
            </span>
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-wrap gap-3 mt-4">
          <Button
            text="Track Order"
            icon={<FaMapMarkedAlt />}
            color="from-blue-500 to-sky-600"
            onClick={() => navigate(`/customer/track-order/${order._id}`)}
          />
          <Button
            text="View Order"
            icon={<FaEye />}
            color="from-gray-500 to-gray-600"
            onClick={() => navigate(`/customer/order-details/${order._id}`)}
          />
          <Button
            text="Reorder"
            icon={<FaRedoAlt />}
            color="from-orange-500 to-pink-600"
            onClick={() => handleReorder(order)}
          />
          <Button
            text="Invoice"
            icon={<FaFileInvoice />}
            color="from-green-500 to-emerald-600"
            onClick={() => downloadInvoice(order._id)}
          />
          {order.orderStatus === "Delivered" && (
            <Button
              text="Review"
              icon="⭐"
              color="from-yellow-500 to-amber-600"
              onClick={() =>
                navigate(
                  `/customer/review/${order._id}?restaurant=${order.restaurantId._id}`
                )
              }
            />
          )}
        </div>
      </div>
    </motion.div>
  );

  return (
    <motion.div
      className="px-4 md:px-10 py-10 bg-gradient-to-br from-orange-50 via-white to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 min-h-screen text-gray-800 dark:text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="max-w-6xl mx-auto">
        <motion.h1
          className="text-4xl font-black mb-10 bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-2"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          🛍️ Your Orders
        </motion.h1>

        {/* Active Orders */}
        <section className="mb-14">
          <h2 className="text-2xl font-semibold mb-5 flex items-center gap-2">
            🟢 Active Orders
          </h2>
          {activeOrders.length === 0 ? (
            <EmptyState text="You currently have no active orders." />
          ) : (
            <div className="grid gap-8 md:grid-cols-2">
              {activeOrders.map(renderOrderCard)}
            </div>
          )}
        </section>

        {/* Past Orders */}
        <section>
          <h2 className="text-2xl font-semibold mb-5 flex items-center gap-2">
            📦 Past Orders
          </h2>
          {pastOrders.length === 0 ? (
            <EmptyState text="No past orders found." />
          ) : (
            <div className="grid gap-8 md:grid-cols-2">
              {pastOrders.map(renderOrderCard)}
            </div>
          )}
        </section>
      </div>
    </motion.div>
  );
};

// 🔹 Reusable Button
const Button = ({ text, icon, color, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`flex items-center gap-2 text-sm font-semibold bg-gradient-to-r ${color} text-white px-4 py-2 rounded-xl shadow-md hover:shadow-lg transition-all`}
  >
    {icon} {text}
  </motion.button>
);

// 🔹 Empty state for sections
const EmptyState = ({ text }) => (
  <div className="text-gray-500 dark:text-gray-400 italic text-center py-10">
    {text}
  </div>
);

export default CustomerOrders;

//old
// import React, { useEffect, useState, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import { AuthContext } from "../../context/AuthContext";
// import API from "../../api/axios";
// import {
//   FaRedoAlt,
//   FaFileInvoice,
//   FaMapMarkedAlt,
//   FaEye,
// } from "react-icons/fa";

// // 🔹 Utility function to get status color
// const getStatusColor = (status) => {
//   switch (status) {
//     case "Pending":
//       return "bg-slate-200 text-slate-800 border border-slate-300";
//     case "Preparing":
//       return "bg-yellow-100 text-yellow-800 border border-yellow-300";
//     case "Ready":
//       return "bg-orange-100 text-orange-800 border border-orange-300";
//     case "Out for Delivery":
//       return "bg-sky-100 text-sky-800 border border-sky-300";
//     case "Delivered":
//       return "bg-green-100 text-green-800 border border-green-300";
//     case "Cancelled":
//       return "bg-rose-100 text-rose-800 border border-rose-300";
//     default:
//       return "bg-gray-100 text-gray-700 border border-gray-300";
//   }
// };

// const CustomerOrders = () => {
//   const { user } = useContext(AuthContext);
//   const [orders, setOrders] = useState([]);
//   const navigate = useNavigate();

//   // 🔹 Fetch customer orders
//   useEffect(() => {
//     if (!user?._id) return;
//     const fetchOrders = async () => {
//       try {
//         const res = await API.get(`/orders/orders/customer/${user._id}`);
//         setOrders(res.data.orders || []);
//       } catch (err) {
//         console.error("❌ Error fetching customer orders:", err);
//       }
//     };
//     fetchOrders();
//   }, [user]);

//   // 🔹 Split active vs past orders
//   const activeOrders = orders.filter(
//     (order) =>
//       order.orderStatus !== "Delivered" && order.orderStatus !== "Cancelled"
//   );

//   const pastOrders = orders.filter(
//     (order) =>
//       order.orderStatus === "Delivered" || order.orderStatus === "Cancelled"
//   );

//   // 🔹 Download invoice
//   const downloadInvoice = (orderId) => {
//     if (!orderId) return;
//     window.open(`/api/payment/invoice/${orderId}`, "_blank");
//   };

//   // 🔹 Reorder functionality
//   const handleReorder = async (order) => {
//     try {
//       const res = await API.post(`/cart/reorder/${user._id}/${order._id}`);
//       if (res.data?.cart) {
//         navigate("/customer/cart");
//       } else {
//         alert("Some items are not available to reorder.");
//       }
//     } catch (err) {
//       console.error("❌ Error during reorder:", err);
//       alert("Failed to reorder. Please try again.");
//     }
//   };

//   // 🔹 Render single order card
//   const renderOrderCard = (order) => (
//     <div
//       key={order._id}
//       className="rounded-xl border dark:border-gray-700 shadow-sm hover:shadow-md transition p-5 bg-white dark:bg-secondary"
//     >
//       <div className="flex justify-between items-center mb-3">
//         <h3 className="text-lg font-semibold">
//           {order.restaurantId?.name || "Restaurant"}
//         </h3>
//         <span className="text-sm text-gray-500">
//           {new Date(order.createdAt).toLocaleDateString()}
//         </span>
//       </div>

//       <div className="flex items-center gap-2 mb-1">
//         <span
//           className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(
//             order.orderStatus
//           )}`}
//         >
//           {order.orderStatus}
//         </span>
//       </div>

//       <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
//         <strong>Items:</strong>{" "}
//         {order.items
//           .map((i) => `${i.menuItemId?.name || "Item"} × ${i.quantity}`)
//           .join(", ")}
//       </p>

//       <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
//         Total: ₹{order.totalAmount}
//       </p>

//       {/* 🔹 Show premium savings if applicable */}
//       {order.premiumApplied && (
//         <>
//           <p className="text-sm text-green-700 dark:text-green-400 font-medium mb-1">
//             You saved ₹{order.savings} with Premium!
//           </p>
//           <span className="inline-block px-2 py-1 text-xs bg-yellow-200 text-yellow-800 rounded-full mb-2">
//             Premium Applied
//           </span>
//         </>
//       )}

//       <div className="flex flex-wrap gap-3">
//         <button
//           onClick={() => navigate(`/customer/track-order/${order._id}`)}
//           className="flex items-center gap-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
//         >
//           <FaMapMarkedAlt /> Track Order
//         </button>

//         <button
//           onClick={() => navigate(`/customer/order-details/${order._id}`)}
//           className="flex items-center gap-2 text-sm font-medium bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition"
//         >
//           <FaEye /> View Order
//         </button>

//         <button
//           onClick={() => handleReorder(order)}
//           className="flex items-center gap-2 text-sm font-medium bg-primary hover:bg-orange-600 text-white px-4 py-2 rounded-md transition"
//         >
//           <FaRedoAlt /> Reorder
//         </button>

//         <button
//           onClick={() => downloadInvoice(order._id)}
//           className="flex items-center gap-2 text-sm font-medium bg-green-100 dark:bg-green-700 text-green-800 dark:text-white px-4 py-2 rounded-md hover:bg-green-200 dark:hover:bg-green-600 transition"
//         >
//           <FaFileInvoice /> Download Invoice
//         </button>

//         {order.orderStatus === "Delivered" && (
//           <button
//             onClick={() =>
//               navigate(
//                 `/customer/review/${order._id}?restaurant=${order.restaurantId._id}`
//               )
//             }
//             className="flex items-center gap-2 text-sm font-medium bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md transition"
//           >
//             ⭐ Leave Review
//           </button>
//         )}
//       </div>
//     </div>
//   );

//   return (
//     <div className="px-4 md:px-10 py-8 text-gray-800 dark:text-white">
//       <h1 className="text-3xl font-bold mb-6">🛒 Your Orders</h1>

//       {/* 🔹 Active Orders */}
//       <section className="mb-12">
//         <h2 className="text-2xl font-semibold mb-4">🟢 Active Orders</h2>
//         {activeOrders.length === 0 ? (
//           <p className="text-gray-500 dark:text-gray-400">
//             You currently have no active orders.
//           </p>
//         ) : (
//           <div className="grid gap-6 md:grid-cols-2">
//             {activeOrders.map(renderOrderCard)}
//           </div>
//         )}
//       </section>

//       {/* 🔹 Past Orders */}
//       <section>
//         <h2 className="text-2xl font-semibold mb-4">📦 Past Orders</h2>
//         {pastOrders.length === 0 ? (
//           <p className="text-gray-500 dark:text-gray-400">
//             No past orders found.
//           </p>
//         ) : (
//           <div className="grid gap-6 md:grid-cols-2">
//             {pastOrders.map(renderOrderCard)}
//           </div>
//         )}
//       </section>
//     </div>
//   );
// };

// export default CustomerOrders;
