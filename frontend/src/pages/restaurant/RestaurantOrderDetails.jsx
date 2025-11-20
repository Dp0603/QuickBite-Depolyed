import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../../api/axios";
import dayjs from "dayjs";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaTimesCircle,
  FaTruck,
  FaUtensils,
  FaBox,
  FaRedo,
  FaFire,
  FaHourglassHalf,
  FaUser,
  FaMapMarkerAlt,
  FaClock,
  FaRupeeSign,
  FaCreditCard,
  FaStickyNote,
  FaPhone,
} from "react-icons/fa";

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

const RestaurantOrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchOrder = async () => {
    if (!orderId) return;
    setLoading(true);
    try {
      const res = await API.get(`/orders/orders/${orderId}`);
      setOrder(res.data.order);
    } catch (err) {
      console.error("Error fetching order:", err);
      alert("Failed to fetch order details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const updateStatus = async (status) => {
    if (!order) return;
    setUpdating(true);
    try {
      const res = await API.put(`/orders/orders/status/${order._id}`, {
        orderStatus: status,
      });
      setOrder(res.data.order);
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Error updating order status");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.div
            className="w-16 h-16 border-4 border-rose-500 border-t-transparent rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-gray-600 font-semibold">
            Loading order details...
          </p>
        </motion.div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.div
            className="text-8xl mb-4"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ❌
          </motion.div>
          <h2 className="text-2xl font-bold mb-2">Order not found</h2>
          <motion.button
            onClick={() => navigate("/restaurant/orders")}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaArrowLeft className="inline mr-2" /> Back to Orders
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const statusMeta = getStatusMeta(order.orderStatus);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-8 py-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <motion.div
          className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-4">
            <motion.button
              onClick={() => navigate("/restaurant/orders")}
              className="w-12 h-12 rounded-xl bg-white shadow-lg flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-all"
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaArrowLeft />
            </motion.button>
            <div>
              <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                Order #{order._id.slice(-6).toUpperCase()}
              </h1>
              <p className="text-gray-600 flex items-center gap-2 mt-1">
                <FaClock />
                {dayjs(order.createdAt).format("DD MMM YYYY, hh:mm A")}
              </p>
            </div>
          </div>

          <motion.button
            onClick={fetchOrder}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-bold shadow-lg flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{ rotate: updating ? 360 : 0 }}
              transition={{
                duration: 1,
                repeat: updating ? Infinity : 0,
                ease: "linear",
              }}
            >
              <FaRedo />
            </motion.div>
            Refresh
          </motion.button>
        </motion.div>

        {/* Status Card */}
        <motion.div
          className={`p-6 rounded-2xl ${statusMeta.bg} border-2 ${statusMeta.border} mb-8 shadow-lg`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.01 }}
        >
          <div className="flex items-center gap-4">
            <motion.div
              className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${statusMeta.gradient} flex items-center justify-center text-white shadow-xl text-2xl`}
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {statusMeta.icon}
            </motion.div>
            <div className="flex-1">
              <h3 className="text-2xl font-black text-gray-900 mb-1">
                Order Status: {order.orderStatus}
              </h3>
              <p className="text-sm text-gray-600">
                Last updated: {dayjs(order.updatedAt).format("DD MMM, hh:mm A")}
              </p>
            </div>
          </div>
        </motion.div>

        {/* 2×2 Grid Layout - FIXED & ALIGNED */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, staggerChildren: 0.1 }}
        >
          {/* Customer Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <InfoCard
              title="Customer Information"
              icon={<FaUser />}
              gradient="from-indigo-500 to-purple-600"
            >
              <div className="space-y-3">
                <InfoRow label="Name" value={order.customerId?.name || "N/A"} />
                <InfoRow
                  label="Phone"
                  value={order.customerId?.phone || "N/A"}
                  icon={<FaPhone />}
                />
                <InfoRow
                  label="Delivery Address"
                  value={`${order.deliveryAddress?.addressLine}, ${order.deliveryAddress?.city}, ${order.deliveryAddress?.state} - ${order.deliveryAddress?.pincode}`}
                  icon={<FaMapMarkerAlt />}
                />
                {order.customerNote && (
                  <InfoRow
                    label="Special Note"
                    value={order.customerNote}
                    icon={<FaStickyNote />}
                    highlight
                  />
                )}
              </div>
            </InfoCard>
          </motion.div>

          {/* Payment Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <InfoCard
              title="Payment Details"
              icon={<FaCreditCard />}
              gradient="from-teal-500 to-emerald-600"
            >
              <div className="space-y-3">
                <InfoRow label="Method" value={order.paymentMethod || "N/A"} />
                <InfoRow label="Status" value={order.paymentStatus || "N/A"} />
                {order.subtotal && (
                  <InfoRow label="Subtotal" value={`₹${order.subtotal}`} />
                )}
                {order.deliveryFee && (
                  <InfoRow label="Delivery" value={`₹${order.deliveryFee}`} />
                )}
                {order.discount && (
                  <InfoRow
                    label="Discount"
                    value={`-₹${order.discount}`}
                    highlight
                  />
                )}
              </div>
            </InfoCard>
          </motion.div>

          {/* Order Items */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <InfoCard
              title="Order Items"
              icon={<FaUtensils />}
              gradient="from-rose-500 to-pink-600"
            >
              <div className="space-y-3">
                {order.items.map((item, i) => (
                  <motion.div
                    key={i}
                    className="flex justify-between items-center p-4 bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl border border-gray-200 hover:shadow-md transition-all"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                  >
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900">
                        {item.menuItemId?.name || item.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Quantity:{" "}
                        <span className="font-bold">{item.quantity}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        @ ₹{item.price || item.menuItemId?.price}
                      </p>
                      <p className="text-lg font-black text-rose-700">
                        ₹
                        {(item.price || item.menuItemId?.price) * item.quantity}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </InfoCard>
          </motion.div>

          {/* Total Amount Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
          >
            <motion.div
              className="h-full p-8 rounded-2xl bg-gradient-to-br from-rose-600 via-pink-600 to-purple-600 text-white shadow-2xl relative overflow-hidden"
              whileHover={{ scale: 1.02 }}
            >
              {/* Animated Background */}
              <motion.div
                className="absolute inset-0 opacity-20"
                animate={{
                  background: [
                    "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.8) 0%, transparent 50%)",
                    "radial-gradient(circle at 80% 50%, rgba(255,255,255,0.8) 0%, transparent 50%)",
                    "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.8) 0%, transparent 50%)",
                  ],
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <motion.div
                    className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/30"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <FaRupeeSign className="text-2xl" />
                  </motion.div>
                  <h3 className="text-xl font-black">Total Amount</h3>
                </div>
                <motion.p
                  className="text-6xl font-black drop-shadow-lg mb-4"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1, type: "spring", stiffness: 200 }}
                >
                  ₹{Number(order.totalAmount).toFixed(2)}
                </motion.p>
                <div className="pt-4 border-t border-white/30">
                  <p className="text-white/80 text-sm">
                    Payment:{" "}
                    <span className="font-bold">{order.paymentMethod}</span>
                  </p>
                  <p className="text-white/80 text-sm mt-1">
                    Status:{" "}
                    <span className="font-bold">{order.paymentStatus}</span>
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-wrap gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          {order.orderStatus === "Pending" && (
            <>
              <ActionButton
                onClick={() => updateStatus("Preparing")}
                disabled={updating}
                icon={<FaCheckCircle />}
                label="Accept Order"
                gradient="from-emerald-500 to-teal-600"
              />
              <ActionButton
                onClick={() => updateStatus("Cancelled")}
                disabled={updating}
                icon={<FaTimesCircle />}
                label="Reject Order"
                gradient="from-rose-500 to-pink-600"
              />
            </>
          )}

          {order.orderStatus === "Preparing" && (
            <ActionButton
              onClick={() => updateStatus("Ready")}
              disabled={updating}
              icon={<FaFire />}
              label="Mark as Ready"
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
              label="Mark as Delivered"
              gradient="from-emerald-600 to-teal-700"
            />
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

const InfoCard = ({ title, icon, gradient, children }) => (
  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden h-full flex flex-col">
    <motion.div
      className={`p-5 flex items-center bg-gradient-to-r ${gradient} text-white`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3 className="font-black text-lg flex items-center gap-2">
        <motion.div
          className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-sm"
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
        >
          {icon}
        </motion.div>
        {title}
      </h3>
    </motion.div>
    <div className="p-6 flex-1">{children}</div>
  </div>
);

const InfoRow = ({ label, value, icon, highlight }) => (
  <motion.div
    className={`flex justify-between items-start gap-4 ${
      highlight ? "p-3 bg-amber-50 border border-amber-200 rounded-xl" : ""
    }`}
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    whileHover={{ x: 4 }}
  >
    <span className="text-sm text-gray-600 font-semibold flex items-center gap-2">
      {icon && <span className="text-gray-500">{icon}</span>}
      {label}:
    </span>
    <span
      className={`text-sm text-right flex-1 ${
        highlight ? "text-amber-800 font-bold" : "text-gray-900 font-medium"
      }`}
    >
      {value}
    </span>
  </motion.div>
);

const ActionButton = ({ onClick, disabled, icon, label, gradient }) => (
  <motion.button
    onClick={onClick}
    disabled={disabled}
    className={`flex items-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r ${gradient} text-white font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
    whileHover={{ scale: disabled ? 1 : 1.05, y: disabled ? 0 : -2 }}
    whileTap={{ scale: disabled ? 1 : 0.95 }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
  >
    {icon} {label}
  </motion.button>
);

export default RestaurantOrderDetails;
// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import API from "../../api/axios";
// import {
//   FaArrowLeft,
//   FaCheckCircle,
//   FaTimesCircle,
//   FaTruck,
//   FaUtensils,
//   FaBox,
//   FaRedo,
// } from "react-icons/fa";

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

// const RestaurantOrderDetails = () => {
//   const { orderId } = useParams();
//   const navigate = useNavigate();
//   const [order, setOrder] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const fetchOrder = async () => {
//     if (!orderId) return;
//     setLoading(true);
//     try {
//       const res = await API.get(`/orders/orders/${orderId}`);
//       setOrder(res.data.order);
//     } catch (err) {
//       console.error("Error fetching order details:", err);
//       alert("Failed to fetch order details");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrder();
//   }, [orderId]);

//   const updateStatus = async (status) => {
//     if (!order) return;
//     try {
//       const res = await API.put(`/orders/orders/status/${order._id}`, {
//         orderStatus: status,
//       });
//       setOrder(res.data.order);
//     } catch (err) {
//       console.error("Failed to update status:", err);
//       alert("Error updating order status");
//     }
//   };

//   if (loading || !order)
//     return <p className="p-6 text-center">Loading order details...</p>;

//   return (
//     <div className="max-w-4xl mx-auto px-4 py-10 text-gray-800 dark:text-white">
//       <h1 className="text-3xl font-bold mb-6">📄 Order Details</h1>

//       {/* Customer Info */}
//       <div className="bg-white dark:bg-secondary shadow rounded-lg p-6 mb-6">
//         <p>
//           <strong>Customer:</strong> {order.customerId?.name}
//         </p>
//         <p>
//           <strong>Address:</strong> {order.deliveryAddress?.fullAddress}
//         </p>
//         <p>
//           <strong>Status:</strong>{" "}
//           <span
//             className={`inline-block px-3 py-1 rounded-full ${getStatusColor(
//               order.orderStatus
//             )}`}
//           >
//             {order.orderStatus}
//           </span>
//         </p>
//         {order.customerNote && (
//           <p className="text-sm italic text-gray-500 dark:text-gray-400 mt-2">
//             Note: {order.customerNote}
//           </p>
//         )}
//         {order.paymentStatus && (
//           <p className="mt-2">
//             <strong>Payment:</strong> {order.paymentStatus} (
//             {order.paymentMethod})
//           </p>
//         )}
//       </div>

//       {/* Items Ordered */}
//       <div className="bg-white dark:bg-secondary shadow rounded-lg p-6 mb-6">
//         <h2 className="text-xl font-semibold mb-4">🍽 Items Ordered</h2>
//         <ul className="divide-y divide-gray-200 dark:divide-gray-600">
//           {order.items.map((item) => (
//             <li key={item._id} className="py-2 flex justify-between">
//               <span>
//                 {item.menuItemId?.name || item.name} × {item.quantity}
//               </span>
//               <span>₹{(item.price || item.menuItemId?.price).toFixed(2)}</span>
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* Total */}
//       <div className="bg-white dark:bg-secondary shadow rounded-lg p-6 mb-6 flex justify-between font-bold text-lg">
//         <span>Total:</span>
//         <span>₹{Number(order.totalAmount).toFixed(2)}</span>
//       </div>

//       {/* Actions */}
//       <div className="flex flex-wrap gap-3 mb-6">
//         {/* Status update buttons */}
//         {order.orderStatus === "Pending" && (
//           <>
//             <button
//               onClick={() => updateStatus("Preparing")}
//               className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
//             >
//               <FaCheckCircle /> Accept
//             </button>
//             <button
//               onClick={() => updateStatus("Cancelled")}
//               className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-md"
//             >
//               <FaTimesCircle /> Reject
//             </button>
//           </>
//         )}

//         {order.orderStatus === "Preparing" && (
//           <button
//             onClick={() => updateStatus("Ready")}
//             className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md"
//           >
//             <FaUtensils /> Mark Ready
//           </button>
//         )}

//         {order.orderStatus === "Ready" && (
//           <button
//             onClick={() => updateStatus("Out for Delivery")}
//             className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
//           >
//             <FaTruck /> Out for Delivery
//           </button>
//         )}

//         {order.orderStatus === "Out for Delivery" && (
//           <button
//             onClick={() => updateStatus("Delivered")}
//             className="flex items-center gap-2 px-4 py-2 bg-green-700 hover:bg-green-800 text-white rounded-md"
//           >
//             <FaBox /> Mark Delivered
//           </button>
//         )}

//         {/* Refresh */}
//         <button
//           onClick={fetchOrder}
//           className="flex items-center gap-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md"
//         >
//           <FaRedo /> Refresh
//         </button>

//         {/* Back */}
//         <button
//           onClick={() => navigate("/restaurant/orders")}
//           className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition"
//         >
//           <FaArrowLeft /> Back
//         </button>
//       </div>
//     </div>
//   );
// };

// export default RestaurantOrderDetails;
