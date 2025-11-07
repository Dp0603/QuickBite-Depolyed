import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaTimesCircle,
  FaHome,
  FaRedoAlt,
  FaExclamationTriangle,
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

const CustomerPaymentFailure = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(false);

  const {
    reason = "The payment was cancelled or failed unexpectedly.",
    amount = 0,
  } = location.state || {};

  useEffect(() => {
    // Optional: short confetti burst in red tones for animation contrast
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      className="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-rose-50 via-white to-red-50 dark:from-slate-950 dark:via-rose-950 dark:to-slate-950 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Red Glow Blobs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-red-400/20 dark:bg-red-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div
        className="absolute bottom-20 right-10 w-96 h-96 bg-rose-400/20 dark:bg-rose-600/20 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className="absolute top-1/2 left-1/2 w-64 h-64 bg-red-300/10 dark:bg-red-500/10 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "2s" }}
      ></div>

      {/* Optional Red Confetti Burst */}
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={250}
          gravity={0.3}
          colors={["#ef4444", "#f87171", "#fb7185", "#dc2626"]}
        />
      )}

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-3xl w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border border-red-200 dark:border-white/10 mx-4"
      >
        {/* Glow layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-rose-600/10 rounded-3xl blur-xl opacity-60"></div>

        {/* Header */}
        <div className="relative text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
            transition={{
              delay: 0.2,
              type: "tween",
              stiffness: 180,
              damping: 12,
            }}
            className="relative inline-block mb-6"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-rose-600 rounded-full blur-2xl opacity-50 animate-pulse"></div>
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center mx-auto shadow-2xl">
              <FaTimesCircle className="text-white text-5xl" />
            </div>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-5xl font-black mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <span className="bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 dark:from-red-400 dark:via-rose-500 dark:to-pink-500 bg-clip-text text-transparent">
              Payment Failed
            </span>
          </motion.h1>

          <motion.p
            className="text-lg text-gray-600 dark:text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {reason}
          </motion.p>
        </div>

        {/* Details */}
        <div className="relative bg-gray-50/70 dark:bg-gray-800/60 rounded-2xl p-6 text-sm border border-gray-200 dark:border-gray-700 shadow-inner mb-8">
          <p className="flex items-center justify-between text-gray-700 dark:text-gray-300 font-semibold mb-2">
            <span>Amount:</span>
            <span className="text-red-600 dark:text-red-400 font-bold">
              ₹{Number(amount).toFixed(2)}
            </span>
          </p>
          <div className="mt-3 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
            <FaExclamationTriangle className="text-red-500" />
            No payment was made. Please review your order and try again.
          </div>
        </div>

        {/* Action Buttons */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Button
            onClick={() => navigate("/customer/cart")}
            icon={<FaRedoAlt />}
            text="Try Again"
            colors="from-red-500 to-rose-600"
          />
          <Button
            onClick={() => navigate("/customer")}
            icon={<FaHome />}
            text="Back Home"
            outline
          />
        </motion.div>
      </motion.div>
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
        ? "border-2 border-red-500/30 dark:border-white/20 hover:bg-red-50 dark:hover:bg-white/10 text-gray-800 dark:text-white"
        : `bg-gradient-to-r ${colors} hover:brightness-110 text-white`
    }`}
  >
    {icon} {text}
  </motion.button>
);

export default CustomerPaymentFailure;

//old
// import React from "react";
// import { FaTimesCircle } from "react-icons/fa";
// import { useNavigate, useLocation } from "react-router-dom";

// const CustomerPaymentFailure = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const {
//     reason = "The payment was cancelled or failed unexpectedly.",
//     amount = 0,
//     restaurantId = null,
//   } = location.state || {};

//   return (
//     <div className="min-h-[85vh] flex items-center justify-center px-4 text-gray-800 dark:text-white">
//       <div className="bg-white dark:bg-secondary p-8 rounded-2xl shadow-lg border dark:border-gray-700 max-w-2xl w-full animate-fade-in">
//         <div className="text-center">
//           <FaTimesCircle className="text-red-500 text-5xl mb-4 mx-auto" />
//           <h1 className="text-3xl font-bold mb-1">Payment Failed</h1>
//           <p className="text-gray-600 dark:text-gray-400 mb-6">{reason}</p>
//         </div>

//         <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-sm border dark:border-gray-600">
//           <p className="mb-2">
//             <strong>Amount:</strong> ₹{Number(amount).toFixed(2)}
//           </p>
//           <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
//             ⚠️ No payment was made. You can go back to your cart to update your
//             order.
//           </p>
//         </div>

//         <div className="flex flex-col sm:flex-row gap-3 mt-6">
//           <button
//             onClick={() => navigate("/customer/cart")}
//             className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-2 rounded-xl transition font-semibold"
//           >
//             🛒 Back to Cart
//           </button>
//           <button
//             onClick={() => navigate("/customer")}
//             className="w-full bg-primary hover:bg-orange-600 text-white py-2 rounded-xl transition font-semibold"
//           >
//             🏠 Home
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CustomerPaymentFailure;
