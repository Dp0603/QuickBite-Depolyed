import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaTruck,
  FaUtensils,
  FaBox,
  FaEye,
  FaFire,
  FaHourglassHalf,
  FaBell,
  FaUser,
  FaMapMarkerAlt,
  FaClock,
  FaRupeeSign,
} from "react-icons/fa";
import API from "../../api/axios";
import dayjs from "dayjs";

const getStatusMeta = (status) => {
  const s = status?.toLowerCase() || "";

  if (s === "delivered")
    return {
      icon: <FaCheckCircle />,
      bg: "bg-emerald-50",
      border: "border-emerald-300",
      text: "text-emerald-700",
      gradient: "from-emerald-500 to-teal-600",
    };
  if (s === "preparing")
    return {
      icon: <FaUtensils />,
      bg: "bg-blue-50",
      border: "border-blue-300",
      text: "text-blue-700",
      gradient: "from-blue-500 to-cyan-600",
    };
  if (s === "ready")
    return {
      icon: <FaFire />,
      bg: "bg-orange-50",
      border: "border-orange-300",
      text: "text-orange-700",
      gradient: "from-orange-500 to-red-600",
    };
  if (s === "pending")
    return {
      icon: <FaHourglassHalf />,
      bg: "bg-amber-50",
      border: "border-amber-300",
      text: "text-amber-700",
      gradient: "from-amber-500 to-orange-600",
    };
  if (s === "out for delivery")
    return {
      icon: <FaTruck />,
      bg: "bg-indigo-50",
      border: "border-indigo-300",
      text: "text-indigo-700",
      gradient: "from-indigo-500 to-purple-600",
    };
  return {
    icon: <FaTimesCircle />,
    bg: "bg-red-50",
    border: "border-red-300",
    text: "text-red-700",
    gradient: "from-red-500 to-rose-600",
  };
};

const RestaurantOrderCard = ({ order, setOrders, delay = 0 }) => {
  const navigate = useNavigate();
  const [updating, setUpdating] = useState(false);
  const statusMeta = getStatusMeta(order.orderStatus);

  const updateStatus = async (status) => {
    setUpdating(true);
    try {
      const res = await API.put(`/orders/orders/status/${order._id}`, {
        orderStatus: status,
      });
      setOrders((prev) =>
        prev.map((o) => (o._id === order._id ? res.data.order : o))
      );
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Error updating order status");
    } finally {
      setUpdating(false);
    }
  };

  const isPast = ["Delivered", "Cancelled"].includes(order.orderStatus);

  return (
    <motion.div
      className={`p-6 rounded-2xl bg-white border-2 ${
        isPast ? "border-gray-200" : statusMeta.border
      } shadow-lg hover:shadow-xl transition-all min-h-[360px] flex flex-col`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ y: -4 }}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div
              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${statusMeta.gradient} flex items-center justify-center text-white shadow-md`}
            >
              {statusMeta.icon}
            </div>
            <div>
              <h3 className="font-black text-lg text-gray-900 leading-tight">
                #{order._id.slice(-6).toUpperCase()}
              </h3>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <FaClock className="text-gray-400" />
                {dayjs(order.createdAt).format("DD MMM, hh:mm A")}
              </p>
            </div>
          </div>
        </div>

        <span
          className={`px-4 py-2 rounded-xl border-2 ${statusMeta.bg} ${statusMeta.border} ${statusMeta.text} font-bold text-sm shadow-md flex items-center gap-2`}
        >
          {statusMeta.icon}
          {order.orderStatus}
        </span>
      </div>

      {/* Customer Info */}
      {!isPast && (
        <div className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-slate-50 border border-gray-200 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <FaUser className="text-gray-500" />
            <span className="font-bold text-gray-900">
              {order.customerId?.name || "Customer"}
            </span>
          </div>
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <FaMapMarkerAlt className="text-rose-500 mt-0.5 flex-shrink-0" />
            <span className="line-clamp-2">
              {order.deliveryAddress?.addressLine},{" "}
              {order.deliveryAddress?.city}
            </span>
          </div>
        </div>
      )}

      {/* Items */}
      <div className="mb-4 flex-grow">
        <h4 className="font-bold text-sm text-gray-700 mb-2 flex items-center gap-2">
          <FaUtensils className="text-orange-500" />
          Items Ordered
        </h4>
        <div className="space-y-1">
          {order.items.slice(0, 3).map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="text-gray-700">
                {item.menuItemId?.name || item.name}{" "}
                <span className="text-gray-500">× {item.quantity}</span>
              </span>
              <span className="font-semibold text-gray-900">
                ₹{(item.price || item.menuItemId?.price || 0) * item.quantity}
              </span>
            </div>
          ))}
          {order.items.length > 3 && (
            <p className="text-xs text-gray-500 italic">
              +{order.items.length - 3} more item(s)
            </p>
          )}
        </div>
      </div>

      {/* Total */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-br from-rose-50 to-pink-50 border-2 border-rose-200 mb-4">
        <span className="font-bold text-gray-700 flex items-center gap-2">
          <FaRupeeSign className="text-rose-600" />
          Total Amount
        </span>
        <span className="text-2xl font-black text-rose-700">
          ₹{order.totalAmount}
        </span>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        {order.orderStatus === "Pending" && (
          <>
            <ActionButton
              onClick={() => updateStatus("Preparing")}
              disabled={updating}
              icon={<FaCheckCircle />}
              label="Accept"
              gradient="from-emerald-500 to-teal-600"
            />
            <ActionButton
              onClick={() => updateStatus("Cancelled")}
              disabled={updating}
              icon={<FaTimesCircle />}
              label="Reject"
              gradient="from-rose-500 to-pink-600"
            />
          </>
        )}

        {order.orderStatus === "Preparing" && (
          <ActionButton
            onClick={() => updateStatus("Ready")}
            disabled={updating}
            icon={<FaFire />}
            label="Mark Ready"
            gradient="from-orange-500 to-red-600"
          />
        )}

        {order.orderStatus === "Ready" && (
          <ActionButton
            onClick={() => updateStatus("Out for Delivery")}
            disabled={updating}
            icon={<FaTruck />}
            label="Out for Delivery"
            gradient="from-indigo-500 to-purple-600"
          />
        )}

        {order.orderStatus === "Out for Delivery" && (
          <ActionButton
            onClick={() => updateStatus("Delivered")}
            disabled={updating}
            icon={<FaBox />}
            label="Mark Delivered"
            gradient="from-emerald-600 to-teal-700"
          />
        )}

        <motion.button
          onClick={() => navigate(`/restaurant/orders/${order._id}`)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-all border-2 border-gray-300"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FaEye /> View Details
        </motion.button>
      </div>
    </motion.div>
  );
};

const ActionButton = ({ onClick, disabled, icon, label, gradient }) => (
  <motion.button
    onClick={onClick}
    disabled={disabled}
    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r ${gradient} text-white font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
    whileHover={{ scale: disabled ? 1 : 1.05 }}
    whileTap={{ scale: disabled ? 1 : 0.95 }}
  >
    {icon} {label}
  </motion.button>
);

export default RestaurantOrderCard;

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   FaCheckCircle,
//   FaTimesCircle,
//   FaTruck,
//   FaUtensils,
//   FaBox,
//   FaEye,
// } from "react-icons/fa";
// import API from "../../api/axios";

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

// const RestaurantOrderCard = ({ order, past = false, setOrders }) => {
//   const navigate = useNavigate();
//   const [updating, setUpdating] = useState(false);

//   const updateStatus = async (status) => {
//     setUpdating(true);
//     try {
//       const res = await API.put(`/orders/orders/status/${order._id}`, {
//         orderStatus: status,
//       });
//       setOrders((prev) =>
//         prev.map((o) => (o._id === order._id ? res.data.order : o))
//       );
//     } catch (err) {
//       console.error("Failed to update status:", err);
//       alert("Error updating order status");
//     } finally {
//       setUpdating(false);
//     }
//   };

//   return (
//     <div
//       className={`rounded-xl border dark:border-gray-700 shadow-sm hover:shadow-md transition p-5 bg-white dark:bg-secondary ${
//         !past ? "border-blue-400" : ""
//       }`}
//     >
//       {/* Header */}
//       <div className="flex justify-between items-center mb-3">
//         <h3 className="text-lg font-semibold">Order #{order._id.slice(-5)}</h3>
//         <span className="text-sm text-gray-500">
//           {new Date(order.createdAt).toLocaleString()}
//         </span>
//       </div>

//       {/* Customer Info */}
//       {!past && (
//         <>
//           <p className="text-sm text-gray-700 dark:text-gray-300">
//             👤 <strong>{order.customerId?.name || "Customer"}</strong>
//           </p>
//           <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
//             📍 {order.deliveryAddress?.addressLine},{" "}
//             {order.deliveryAddress?.city}
//           </p>
//         </>
//       )}

//       {/* Items */}
//       <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
//         <strong>Items:</strong>{" "}
//         {order.items
//           .map((i) => `${i.menuItemId?.name || i.name} × ${i.quantity}`)
//           .join(", ")}
//       </p>
//       <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
//         Total: ₹{order.totalAmount}
//       </p>

//       {/* Status */}
//       <span
//         className={`inline-block text-xs px-3 py-1 rounded-full font-medium mb-3 ${getStatusColor(
//           order.orderStatus
//         )}`}
//       >
//         {order.orderStatus}
//       </span>

//       {/* Actions */}
//       <div className="flex flex-wrap gap-2">
//         {!past && order.orderStatus === "Pending" && (
//           <>
//             <button
//               onClick={() => updateStatus("Preparing")}
//               disabled={updating}
//               className="flex items-center gap-2 text-sm font-medium bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition disabled:opacity-50"
//             >
//               <FaCheckCircle /> Accept
//             </button>
//             <button
//               onClick={() => updateStatus("Cancelled")}
//               disabled={updating}
//               className="flex items-center gap-2 text-sm font-medium bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-md transition disabled:opacity-50"
//             >
//               <FaTimesCircle /> Reject
//             </button>
//           </>
//         )}

//         {order.orderStatus === "Preparing" && (
//           <button
//             onClick={() => updateStatus("Ready")}
//             disabled={updating}
//             className="flex items-center gap-2 text-sm font-medium bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md transition disabled:opacity-50"
//           >
//             <FaUtensils /> Mark Ready
//           </button>
//         )}

//         {order.orderStatus === "Ready" && (
//           <button
//             onClick={() => updateStatus("Out for Delivery")}
//             disabled={updating}
//             className="flex items-center gap-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition disabled:opacity-50"
//           >
//             <FaTruck /> Out for Delivery
//           </button>
//         )}

//         {order.orderStatus === "Out for Delivery" && (
//           <button
//             onClick={() => updateStatus("Delivered")}
//             disabled={updating}
//             className="flex items-center gap-2 text-sm font-medium bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md transition disabled:opacity-50"
//           >
//             <FaBox /> Mark Delivered
//           </button>
//         )}

//         {/* View details button */}
//         <button
//           onClick={() => navigate(`/restaurant/orders/${order._id}`)}
//           className="flex items-center gap-2 text-sm font-medium bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition"
//         >
//           <FaEye /> View
//         </button>
//       </div>
//     </div>
//   );
// };

// export default RestaurantOrderCard;
