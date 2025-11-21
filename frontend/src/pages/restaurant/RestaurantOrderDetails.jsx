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
  FaRedo,
  FaFire,
  FaHourglassHalf,
  FaUser,
  FaMapMarkerAlt,
  FaClock,
  FaCreditCard,
  FaStickyNote,
  FaPhone,
  FaRupeeSign,
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
        <motion.div className="text-center">
          <motion.div
            className="w-20 h-20 border-4 border-rose-500 border-t-transparent rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-lg text-gray-700 font-semibold">
            Loading order details...
          </p>
        </motion.div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex items-center justify-center">
        <motion.div className="text-center">
          <motion.div
            className="text-8xl mb-4"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ❌
          </motion.div>
          <h2 className="text-3xl font-bold mb-2">Order not found</h2>
          <motion.button
            onClick={() => navigate("/restaurant/orders")}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold shadow-lg"
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
        className="max-w-[1700px] mx-auto px-8 py-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
          <div className="flex items-center gap-4">
            <button
              className="w-14 h-14 rounded-xl bg-white shadow-lg flex items-center justify-center text-xl hover:bg-gray-50"
              onClick={() => navigate("/restaurant/orders")}
            >
              <FaArrowLeft />
            </button>
            <div>
              <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                Order #{order._id.slice(-6).toUpperCase()}
              </h1>
              <p className="text-lg text-gray-700 flex items-center gap-2 mt-1">
                <FaClock />{" "}
                {dayjs(order.createdAt).format("DD MMM YYYY, hh:mm A")}
              </p>
            </div>
          </div>

          <motion.button
            onClick={fetchOrder}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 text-white text-lg font-bold shadow-lg flex items-center gap-2"
          >
            <FaRedo /> Refresh
          </motion.button>
        </div>

        {/* Status Card */}
        <motion.div
          className={`p-8 rounded-2xl text-xl ${statusMeta.bg} border-2 ${statusMeta.border} mb-10 shadow-lg`}
        >
          <div className="flex items-center gap-6">
            <div
              className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${statusMeta.gradient} flex items-center justify-center text-white shadow-xl text-4xl`}
            >
              {statusMeta.icon}
            </div>
            <div>
              <h3 className="text-3xl font-black">
                Order Status: {order.orderStatus}
              </h3>
              <p className="text-lg text-gray-700">
                Last updated: {dayjs(order.updatedAt).format("DD MMM, hh:mm A")}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* CUSTOMER INFO */}
          <InfoCard
            title="Customer Information"
            icon={<FaUser />}
            gradient="from-indigo-500 to-purple-600"
          >
            <div className="space-y-4 text-lg md:text-xl">
              <InfoRow label="Name" value={order.customerId?.name || "N/A"} />
              <InfoRow label="Phone" value={order.customerId?.phone || "N/A"} />
              <InfoRow
                label="Delivery Address"
                value={`${order.deliveryAddress?.addressLine}, ${order.deliveryAddress?.city}, ${order.deliveryAddress?.state} - ${order.deliveryAddress?.pincode}`}
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

          {/* PAYMENT INFO */}
          <InfoCard
            title="Payment Details"
            icon={<FaCreditCard />}
            gradient="from-teal-500 to-emerald-600"
          >
            <div className="space-y-4 text-lg md:text-xl">
              <InfoRow label="Method" value={order.paymentMethod || "N/A"} />
              <InfoRow label="Status" value={order.paymentStatus || "N/A"} />

              {/* TOTAL */}
              <div className="pt-4 border-t border-gray-300">
                <h4 className="text-2xl font-black flex items-center gap-2">
                  <FaRupeeSign /> Total Amount
                </h4>
                <p className="text-5xl md:text-6xl font-black text-rose-600 mt-2">
                  ₹{Number(order.totalAmount).toFixed(2)}
                </p>
              </div>
            </div>
          </InfoCard>
        </div>

        {/* ORDER ITEMS - FULL WIDTH */}
        <InfoCard
          title="Order Items"
          icon={<FaUtensils />}
          gradient="from-rose-500 to-pink-600"
        >
          <div className="space-y-4 text-lg md:text-xl">
            {order.items.map((item, i) => (
              <div
                key={i}
                className="flex justify-between items-center p-5 bg-gray-50 rounded-xl border"
              >
                <div>
                  <h4 className="font-bold text-2xl">
                    {item.menuItemId?.name || item.name}
                  </h4>
                  <p className="text-lg text-gray-700">
                    Quantity:{" "}
                    <span className="font-semibold">{item.quantity}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg text-gray-600">
                    @ ₹{item.price || item.menuItemId?.price}
                  </p>
                  <p className="text-3xl font-black text-rose-600">
                    ₹{(item.price || item.menuItemId?.price) * item.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </InfoCard>

        {/* ACTION BUTTONS */}
        <div className="flex flex-wrap gap-4 mt-10">
          {order.orderStatus === "Pending" && (
            <>
              <ActionButton
                onClick={() => updateStatus("Preparing")}
                gradient="from-emerald-500 to-teal-600"
                icon={<FaCheckCircle />}
                label="Accept Order"
              />
              <ActionButton
                onClick={() => updateStatus("Cancelled")}
                gradient="from-rose-500 to-pink-600"
                icon={<FaTimesCircle />}
                label="Reject Order"
              />
            </>
          )}

          {order.orderStatus === "Preparing" && (
            <ActionButton
              onClick={() => updateStatus("Ready")}
              gradient="from-orange-500 to-red-600"
              icon={<FaFire />}
              label="Mark as Ready"
            />
          )}

          {order.orderStatus === "Ready" && (
            <ActionButton
              onClick={() => updateStatus("Out for Delivery")}
              gradient="from-indigo-500 to-purple-600"
              icon={<FaTruck />}
              label="Out for Delivery"
            />
          )}

          {order.orderStatus === "Out for Delivery" && (
            <ActionButton
              onClick={() => updateStatus("Delivered")}
              gradient="from-emerald-600 to-teal-700"
              icon={<FaCheckCircle />}
              label="Mark as Delivered"
            />
          )}
        </div>
      </motion.div>
    </div>
  );
};

const InfoCard = ({ title, icon, gradient, children }) => (
  <div className="bg-white rounded-2xl shadow-lg border p-8 flex flex-col">
    <div
      className={`p-5 text-white bg-gradient-to-r ${gradient} rounded-xl mb-6 flex items-center gap-3`}
    >
      <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center text-2xl">
        {icon}
      </div>
      <h3 className="text-2xl font-black">{title}</h3>
    </div>
    {children}
  </div>
);

const InfoRow = ({ label, value, icon, highlight }) => (
  <div
    className={`flex justify-between items-start gap-6 ${
      highlight ? "p-4 bg-amber-50 border rounded-xl" : ""
    }`}
  >
    <span className="text-lg md:text-xl text-gray-700 font-semibold flex items-center gap-2">
      {icon && <span className="text-gray-600">{icon}</span>}
      {label}:
    </span>
    <span className="text-lg md:text-xl font-medium text-gray-900 text-right">
      {value}
    </span>
  </div>
);

const ActionButton = ({ onClick, disabled, icon, label, gradient }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-8 py-4 text-xl font-bold rounded-xl flex items-center gap-3 bg-gradient-to-r ${gradient} text-white shadow-lg disabled:opacity-50`}
  >
    {icon} {label}
  </button>
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
