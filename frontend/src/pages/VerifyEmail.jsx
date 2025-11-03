import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  FaEnvelope,
  FaCheckCircle,
  FaTimesCircle,
  FaShieldAlt,
  FaArrowRight,
  FaExclamationTriangle,
} from "react-icons/fa";
import { motion } from "framer-motion";

const VerifyEmail = () => {
  const { token } = useParams();
  const [message, setMessage] = useState(null);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    setClicked(true);
    setLoading(true);
    try {
      const res = await axios.get(`/api/auth/verify-email/${token}`);
      setMessage(res.data.message || "Email verified successfully!");
      setVerified(true);
    } catch (err) {
      setError(true);
      setMessage(err.response?.data?.message || "Invalid or expired token");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-4 overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-orange-400/20 dark:bg-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-pink-400/20 dark:bg-pink-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-400/10 dark:bg-purple-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-orange-200 dark:border-white/10">
          {/* Icon Header */}
          <motion.div
            className="flex justify-center mb-8"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <div
              className={`relative w-24 h-24 rounded-2xl ${
                verified
                  ? "bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/30"
                  : error
                  ? "bg-gradient-to-br from-red-500 to-orange-600 shadow-lg shadow-red-500/30"
                  : "bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/30"
              } flex items-center justify-center`}
            >
              {loading ? (
                <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : verified ? (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <FaCheckCircle className="text-white text-5xl" />
                </motion.div>
              ) : error ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <FaTimesCircle className="text-white text-5xl" />
                </motion.div>
              ) : (
                <FaEnvelope className="text-white text-5xl" />
              )}

              {/* Badge */}
              {!loading && (
                <motion.div
                  className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white dark:bg-slate-800 border-2 border-current flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {verified ? (
                    <span className="text-green-500">✓</span>
                  ) : error ? (
                    <span className="text-red-500">✕</span>
                  ) : (
                    <FaShieldAlt className="text-blue-500 text-xs" />
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-3xl font-black text-center mb-3">
              <span className="bg-gradient-to-r from-orange-600 to-pink-600 dark:from-orange-400 dark:to-pink-500 bg-clip-text text-transparent">
                {verified
                  ? "Email Verified!"
                  : error
                  ? "Verification Failed"
                  : "Verify Your Email"}
              </span>
            </h2>
          </motion.div>

          {/* Content */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {/* Before Clicking */}
            {!clicked && (
              <>
                <p className="text-center text-gray-600 dark:text-gray-300">
                  Click the button below to verify your QuickBite account and
                  start your food journey!
                </p>

                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-500/30">
                  <div className="flex items-start gap-3">
                    <FaShieldAlt className="text-blue-500 text-xl mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-700 dark:text-blue-300">
                      <p className="font-semibold mb-1">Secure Verification</p>
                      <p>
                        This link is unique to your account and will expire
                        after verification.
                      </p>
                    </div>
                  </div>
                </div>

                <motion.button
                  onClick={handleVerify}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-bold shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/50 transition-all duration-300 flex items-center justify-center gap-2 group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaCheckCircle className="group-hover:scale-110 transition-transform" />
                  <span>Verify Email</span>
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </>
            )}

            {/* After Clicking - Loading */}
            {clicked && loading && (
              <div className="text-center py-8">
                <div className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-500/30">
                  <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-blue-700 dark:text-blue-300 font-semibold">
                    Verifying your email...
                  </span>
                </div>
              </div>
            )}

            {/* Success State */}
            {clicked && !loading && verified && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <div className="p-6 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-500/30 mb-6">
                  <div className="flex items-start gap-3 mb-4">
                    <FaCheckCircle className="text-green-500 text-2xl mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-green-700 dark:text-green-300 text-lg mb-1">
                        Success!
                      </h3>
                      <p className="text-green-600 dark:text-green-400 text-sm">
                        {message}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-green-700 dark:text-green-300">
                    <div className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span>Your account is now active</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span>You can now login to QuickBite</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span>Start ordering delicious food!</span>
                    </div>
                  </div>
                </div>

                <Link
                  to="/login"
                  className="block w-full py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/50 transition-all duration-300 text-center group"
                >
                  <span className="inline-flex items-center gap-2">
                    Continue to Login
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </motion.div>
            )}

            {/* Error State */}
            {clicked && !loading && error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <div className="p-6 rounded-2xl bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border border-red-200 dark:border-red-500/30 mb-6">
                  <div className="flex items-start gap-3 mb-4">
                    <FaExclamationTriangle className="text-red-500 text-2xl mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-red-700 dark:text-red-300 text-lg mb-1">
                        Verification Failed
                      </h3>
                      <p className="text-red-600 dark:text-red-400 text-sm">
                        {message}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-red-700 dark:text-red-300">
                    <p className="font-semibold">Possible reasons:</p>
                    <div className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>The verification link has expired</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>The link has already been used</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>Invalid or corrupted token</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <Link
                    to="/register"
                    className="block w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-bold shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/50 transition-all duration-300 text-center"
                  >
                    Register Again
                  </Link>

                  <Link
                    to="/login"
                    className="block w-full py-4 rounded-xl border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 font-bold transition-all duration-300 text-center"
                  >
                    Back to Login
                  </Link>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Footer Info */}
          {!clicked && (
            <motion.div
              className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Need help?{" "}
                <Link
                  to="/"
                  className="text-orange-600 dark:text-orange-400 hover:underline font-semibold"
                >
                  Contact Support
                </Link>
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;


// old
// // import React, { useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import axios from "axios";

// const VerifyEmail = () => {
//   const { token } = useParams();
//   const [message, setMessage] = useState(null);
//   const [verified, setVerified] = useState(false);
//   const [error, setError] = useState(false);
//   const [clicked, setClicked] = useState(false);

//   const handleVerify = async () => {
//     setClicked(true);
//     try {
//       const res = await axios.get(`/api/auth/verify-email/${token}`);
//       setMessage(res.data.message || "Email verified!");
//       setVerified(true);
//     } catch (err) {
//       setError(true);
//       setMessage(err.response?.data?.message || "Invalid or expired token");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-orange-50 dark:bg-gray-900 px-4">
//       <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-xl text-center w-full max-w-md space-y-5">
//         <h2 className="text-2xl font-bold text-primary">
//           {verified ? "✅ Email Verified" : "🔐 Verify Your Email"}
//         </h2>

//         {!clicked && (
//           <>
//             <p className="text-secondary dark:text-gray-300">
//               Click below to verify your account
//             </p>
//             <button
//               onClick={handleVerify}
//               className="mt-4 px-6 py-2 bg-primary text-white rounded-md hover:bg-orange-600 transition"
//             >
//               Click to Verify Email
//             </button>
//           </>
//         )}

//         {clicked && (
//           <div>
//             <p
//               className={`mt-4 text-lg font-medium ${
//                 error ? "text-red-500" : "text-green-600"
//               }`}
//             >
//               {message}
//             </p>

//             <Link
//               to="/login"
//               className="inline-block mt-6 px-5 py-2 bg-primary text-white rounded-lg hover:bg-orange-600"
//             >
//               Go to Login
//             </Link>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default VerifyEmail;
