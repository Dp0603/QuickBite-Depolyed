import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaCheckCircle,
  FaDownload,
  FaHome,
  FaClipboardList,
  FaCrown,
  FaGift,
  FaTruck,
  FaPercent,
  FaClock,
  FaReceipt,
  FaShare,
  FaFire,
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

const CustomerPaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const order = location.state?.order;
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const downloadInvoice = () => {
    if (!order?._id) return;
    window.open(`/api/payment/invoice/${order._id}`, "_blank");
  };

  const shareOrder = async () => {
    const text = `🎉 Just ordered from QuickBite! Order #${order?._id?.slice(
      -6
    )}`;
    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      navigator.clipboard.writeText(text);
      alert("Order details copied to clipboard!");
    }
  };

  const formatDateTime = (isoDate) => {
    const d = new Date(isoDate);
    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const estimatedDelivery = () => {
    if (!order?.createdAt) return "30–40 mins";
    const orderTime = new Date(order.createdAt);
    const deliveryTime = new Date(orderTime.getTime() + 35 * 60000);
    return deliveryTime.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Confetti */}
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={450}
          gravity={0.25}
        />
      )}

      {/* Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-orange-400/20 dark:bg-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-pink-400/20 dark:bg-pink-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-green-400/10 dark:bg-green-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-8">
        <motion.div
          className="w-full max-w-5xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <motion.div
            className="text-center mb-10"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.2,
              type: "spring",
              stiffness: 200,
              damping: 15,
            }}
          >
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full blur-2xl opacity-50 animate-pulse"></div>
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto shadow-2xl">
                <FaCheckCircle className="text-white text-5xl" />
              </div>
            </div>

            <motion.h1
              className="text-4xl md:text-5xl font-black mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 dark:from-green-400 dark:via-emerald-500 dark:to-teal-500 bg-clip-text text-transparent">
                Payment Successful!
              </span>
            </motion.h1>
            <motion.p
              className="text-lg text-gray-600 dark:text-gray-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Your order has been confirmed! We're preparing your delicious meal
              🍽️
            </motion.p>

            {/* Estimated Delivery */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
              className="inline-flex items-center gap-2 px-6 py-3 mt-4 rounded-xl bg-gradient-to-r from-orange-100 to-pink-100 dark:from-orange-500/20 dark:to-pink-500/20 border border-orange-300 dark:border-orange-500/30"
            >
              <FaClock className="text-orange-600 dark:text-orange-400" />
              <span className="font-bold text-orange-700 dark:text-orange-300">
                Estimated Delivery: {estimatedDelivery()}
              </span>
            </motion.div>
          </motion.div>

          {/* Grid Layout */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Order Details */}
            <motion.div
              className="lg:col-span-2 space-y-6"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              {/* Order Info */}
              <div className="relative p-6 rounded-3xl bg-white dark:bg-slate-900 border border-orange-200 dark:border-white/10 shadow-xl backdrop-blur-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-pink-500/10 rounded-3xl blur-xl opacity-40"></div>
                <div className="relative">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center text-white shadow-md">
                      <FaReceipt />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white">
                      Order Details
                    </h3>
                  </div>

                  {/* Order Info Content */}
                  {order && (
                    <div className="space-y-5">
                      {/* ID + Time */}
                      <div className="grid md:grid-cols-2 gap-4">
                        {[
                          [
                            "Order ID",
                            `#${order._id?.slice(-8).toUpperCase()}`,
                          ],
                          ["Order Time", formatDateTime(order.createdAt)],
                        ].map(([label, value], i) => (
                          <div
                            key={i}
                            className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                          >
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                              {label}
                            </p>
                            <p className="font-bold text-gray-900 dark:text-white text-sm">
                              {value}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Payment Status + Method */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-4 flex items-center justify-between rounded-2xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-600/40">
                          <span className="text-sm font-semibold text-green-700 dark:text-green-300">
                            Payment Status
                          </span>
                          <span className="px-3 py-1 rounded-full bg-green-500 text-white text-xs font-bold flex items-center gap-1">
                            <FaCheckCircle /> {order.paymentStatus}
                          </span>
                        </div>
                        <div className="p-4 flex items-center justify-between rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-600/40">
                          <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                            Payment Method
                          </span>
                          <span className="px-3 py-1 rounded-full bg-blue-500 text-white text-xs font-bold">
                            {order.paymentMethod}
                          </span>
                        </div>
                      </div>

                      {/* Premium Benefits */}
                      {order.premiumApplied && order.premiumBreakdown && (
                        <div className="p-5 rounded-2xl bg-gradient-to-r from-yellow-400/20 via-amber-500/20 to-orange-500/20 dark:from-yellow-600/20 dark:to-orange-700/20 border border-yellow-300 dark:border-yellow-600/30">
                          <div className="flex items-center gap-2 mb-3">
                            <FaCrown className="text-yellow-500 text-xl" />
                            <h4 className="font-bold text-yellow-700 dark:text-yellow-300">
                              Premium Benefits Applied
                            </h4>
                          </div>
                          <div className="space-y-2">
                            {order.premiumBreakdown.freeDelivery > 0 && (
                              <div className="flex justify-between text-yellow-700 dark:text-yellow-300">
                                <span className="flex items-center gap-2">
                                  <FaTruck className="text-yellow-500" />
                                  Free Delivery
                                </span>
                                <span>
                                  ₹
                                  {order.premiumBreakdown.freeDelivery.toFixed(
                                    0
                                  )}
                                </span>
                              </div>
                            )}
                            {order.premiumBreakdown.extraDiscount > 0 && (
                              <div className="flex justify-between text-yellow-700 dark:text-yellow-300">
                                <span className="flex items-center gap-2">
                                  <FaPercent className="text-yellow-500" />
                                  Extra Discount
                                </span>
                                <span>
                                  ₹
                                  {order.premiumBreakdown.extraDiscount.toFixed(
                                    0
                                  )}
                                </span>
                              </div>
                            )}
                            {order.premiumBreakdown.cashback > 0 && (
                              <div className="flex justify-between text-yellow-700 dark:text-yellow-300">
                                <span className="flex items-center gap-2">
                                  <FaGift className="text-yellow-500" />
                                  Cashback
                                </span>
                                <span>
                                  ₹{order.premiumBreakdown.cashback.toFixed(0)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Items Ordered */}
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                          <FaFire className="text-orange-500" /> Items Ordered
                        </h4>
                        <div className="space-y-3">
                          {order.items.map((item, i) => (
                            <div
                              key={i}
                              className="flex justify-between items-center p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-pink-600 text-white flex items-center justify-center font-bold">
                                  {item.quantity}×
                                </div>
                                <span>{item.name}</span>
                              </div>
                              <span className="font-bold bg-gradient-to-r from-orange-600 to-pink-600 dark:from-orange-400 dark:to-pink-500 bg-clip-text text-transparent">
                                ₹{(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Right: Billing Summary */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="sticky top-24 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-orange-200 dark:border-white/10 shadow-xl backdrop-blur-xl">
                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                  Bill Summary
                </h3>

                {order && (
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-gray-700 dark:text-gray-300">
                      <span>Subtotal</span>
                      <span className="font-semibold">
                        ₹{order.subtotal?.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-700 dark:text-gray-300">
                      <span>Tax</span>
                      <span className="font-semibold">
                        ₹{order.tax?.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-700 dark:text-gray-300">
                      <span>Delivery Fee</span>
                      <span className="font-semibold">
                        ₹{order.deliveryFee?.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-green-600 dark:text-green-400 font-semibold">
                      <span>Discount</span>
                      <span>–₹{order.discount?.toFixed(2)}</span>
                    </div>

                    {order.premiumApplied && order.savings > 0 && (
                      <div className="flex justify-between text-yellow-600 dark:text-yellow-400 font-semibold">
                        <span className="flex items-center gap-1">
                          <FaCrown className="text-sm" /> Premium Savings
                        </span>
                        <span>₹{order.savings?.toFixed(2)}</span>
                      </div>
                    )}

                    <hr className="my-3 border-gray-300 dark:border-gray-700" />

                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-900 dark:text-white">
                        Total Paid
                      </span>
                      <span className="text-2xl font-black bg-gradient-to-r from-orange-600 to-pink-600 dark:from-orange-400 dark:to-pink-500 bg-clip-text text-transparent">
                        ₹{order.totalAmount?.toFixed(2)}
                      </span>
                    </div>

                    {(order.discount > 0 || order.savings > 0) && (
                      <div className="mt-4 p-3 rounded-xl bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-600/30 text-center">
                        <div className="text-xs text-green-600 dark:text-green-400 font-semibold">
                          You Saved
                        </div>
                        <div className="text-2xl font-black text-green-600 dark:text-green-400">
                          ₹
                          {(
                            (order.discount || 0) + (order.savings || 0)
                          ).toFixed(2)}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Buttons */}
          <motion.div
            className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Button
              onClick={downloadInvoice}
              icon={<FaDownload />}
              text="Download Invoice"
              colors="from-green-500 to-emerald-600"
            />
            <Button
              onClick={shareOrder}
              icon={<FaShare />}
              text="Share"
              colors="from-blue-500 to-cyan-600"
            />
            <Button
              onClick={() => navigate("/customer/orders")}
              icon={<FaClipboardList />}
              text="My Orders"
              colors="from-orange-500 to-pink-600"
            />
            <Button
              onClick={() => navigate("/customer")}
              icon={<FaHome />}
              text="Back Home"
              outline
            />
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const Button = ({ onClick, icon, text, colors, outline }) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className={`flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold transition-all shadow-lg ${
      outline
        ? "border-2 border-orange-500/30 dark:border-white/20 hover:bg-orange-50 dark:hover:bg-white/10 text-gray-800 dark:text-white"
        : `bg-gradient-to-r ${colors} hover:brightness-110 text-white`
    }`}
  >
    {icon} {text}
  </motion.button>
);

export default CustomerPaymentSuccess;

//old 
// import React from "react";
// import { FaCheckCircle } from "react-icons/fa";
// import { useNavigate, useLocation } from "react-router-dom";

// const CustomerPaymentSuccess = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const order = location.state?.order;

//   const downloadInvoice = () => {
//     if (!order?._id) return;
//     window.open(`/api/payment/invoice/${order._id}`, "_blank");
//   };

//   const formatDateTime = (isoDate) => {
//     const d = new Date(isoDate);
//     return d.toLocaleString("en-IN", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   return (
//     <div className="min-h-[85vh] flex items-center justify-center px-4 text-gray-800 dark:text-white">
//       <div className="bg-white dark:bg-secondary p-8 rounded-2xl shadow-lg border dark:border-gray-700 max-w-2xl w-full animate-fade-in">
//         <div className="text-center">
//           <FaCheckCircle className="text-green-500 text-5xl mb-4 mx-auto" />
//           <h1 className="text-3xl font-bold mb-1">Payment Successful!</h1>
//           <p className="text-gray-600 dark:text-gray-400 mb-6">
//             Your order has been placed. We’re preparing your delicious food! 🍽️
//           </p>
//         </div>

//         {order && (
//           <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-sm border dark:border-gray-600">
//             {/* Order Info */}
//             <div className="grid md:grid-cols-2 gap-4 mb-4">
//               <div>
//                 <p>
//                   <strong>Order ID:</strong> {order._id}
//                 </p>
//                 <p>
//                   <strong>Order Time:</strong> {formatDateTime(order.createdAt)}
//                 </p>
//               </div>
//               <div>
//                 <p>
//                   <strong>Payment Status:</strong> {order.paymentStatus}
//                 </p>
//                 <p>
//                   <strong>Payment Method:</strong> {order.paymentMethod}
//                 </p>
//               </div>
//             </div>

//             {/* Premium Benefits */}
//             {order.premiumApplied && order.premiumBreakdown && (
//               <div className="mb-4 p-3 bg-green-50 dark:bg-green-900 rounded text-sm">
//                 <h4 className="font-semibold text-green-800 dark:text-green-300">
//                   💎 Premium Benefits Applied:
//                 </h4>
//                 {order.premiumBreakdown.freeDelivery > 0 && (
//                   <p className="text-green-600 dark:text-green-300">
//                     Free Delivery: ₹
//                     {order.premiumBreakdown.freeDelivery.toFixed(0)}
//                   </p>
//                 )}
//                 {order.premiumBreakdown.extraDiscount > 0 && (
//                   <p className="text-green-600 dark:text-green-300">
//                     Extra Discount: ₹
//                     {order.premiumBreakdown.extraDiscount.toFixed(0)}
//                   </p>
//                 )}
//                 {order.premiumBreakdown.cashback > 0 && (
//                   <p className="text-green-600 dark:text-green-300">
//                     Cashback Eligible: ₹
//                     {order.premiumBreakdown.cashback.toFixed(0)}
//                   </p>
//                 )}
//               </div>
//             )}

//             {/* Items Ordered */}
//             <div className="mb-4">
//               <p className="font-semibold mb-2">Items Ordered:</p>
//               {order.items.map((item, index) => (
//                 <p key={index} className="text-gray-700 dark:text-gray-300">
//                   {item.name || "Item"} × {item.quantity} = ₹
//                   {(item.price * item.quantity).toFixed(2)}
//                 </p>
//               ))}
//             </div>

//             <hr className="my-4 border-gray-300 dark:border-gray-700" />

//             {/* Billing */}
//             <div className="grid grid-cols-2 text-sm gap-1">
//               <span>Subtotal:</span>
//               <span className="text-right">
//                 ₹{order.subtotal?.toFixed(2) || "0.00"}
//               </span>
//               <span>Tax:</span>
//               <span className="text-right">
//                 ₹{order.tax?.toFixed(2) || "0.00"}
//               </span>
//               <span>Delivery Fee:</span>
//               <span className="text-right">
//                 ₹{order.deliveryFee?.toFixed(2) || "0.00"}
//               </span>
//               <span>Discount:</span>
//               <span className="text-right text-green-600">
//                 –₹{order.discount?.toFixed(2) || "0.00"}
//               </span>

//               {/* Premium Savings */}
//               {order.premiumApplied && (
//                 <>
//                   <span>Premium Savings:</span>
//                   <span className="text-right text-green-600">
//                     ₹{order.savings?.toFixed(2)}
//                   </span>
//                 </>
//               )}

//               <span className="font-semibold">Total Paid:</span>
//               <span className="text-right font-semibold">
//                 ₹{order.totalAmount?.toFixed(2)}
//               </span>
//             </div>
//           </div>
//         )}

//         {/* Action Buttons */}
//         <div className="flex flex-col sm:flex-row gap-3 mt-6">
//           <button
//             onClick={downloadInvoice}
//             className="w-full bg-green-100 dark:bg-green-700 hover:bg-green-200 dark:hover:bg-green-600 text-green-800 dark:text-white py-2 rounded-xl transition font-semibold"
//           >
//             📄 Download Invoice
//           </button>

//           <button
//             onClick={() => navigate("/customer/orders")}
//             className="w-full bg-primary hover:bg-orange-600 text-white py-2 rounded-xl transition font-semibold"
//           >
//             View My Orders
//           </button>

//           <button
//             onClick={() => navigate("/customer")}
//             className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-2 rounded-xl transition font-semibold"
//           >
//             Back to Home
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CustomerPaymentSuccess;
