import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  FaHome,
  FaLock,
  FaShieldAlt,
  FaExclamationTriangle,
  FaSignInAlt,
  FaUserShield,
  FaQuestionCircle,
} from "react-icons/fa";
import { motion } from "framer-motion";

const Unauthorized = () => {
  const floatingEmojis = [
    { emoji: "🔒", top: "18%", left: "12%" },
    { emoji: "🚫", top: "38%", left: "78%" },
    { emoji: "⚠️", top: "68%", left: "22%" },
    { emoji: "🔐", top: "62%", left: "58%" },
  ];

  return (
    <div
      className="relative flex flex-col items-center justify-start min-h-screen pt-28 md:pt- lg:pt-40 bg-gradient-to-br from-red-50 via-orange-50 to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-gray-900 dark:text-white px-4 overflow-hidden"
      role="alert"
      aria-label="Unauthorized Access"
      aria-live="assertive"
    >
      {/* SEO Meta */}
      <Helmet>
        <title>403 | Unauthorized - QuickBite</title>
        <meta
          name="description"
          content="You do not have permission to access this page on QuickBite."
        />
        <link rel="canonical" href="https://quickbite.com/403" />
      </Helmet>

      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-red-400/20 dark:bg-red-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-orange-400/20 dark:bg-orange-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-400/10 dark:bg-pink-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>

        {floatingEmojis.map((item, i) => (
          <motion.div
            key={i}
            className="absolute text-5xl md:text-6xl opacity-20 select-none"
            style={{ top: item.top, left: item.left }}
            animate={{ y: [0, -25, 0], rotate: [0, 10, -10, 0] }}
            transition={{
              duration: 3.2 + i * 0.4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {item.emoji}
          </motion.div>
        ))}
      </div>

      {/* Main Section */}
      <div className="relative z-10 max-w-2xl text-center">
        <motion.div
          className="relative mb-8"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
          whileHover={{ scale: 1.02, rotate: 2 }}
        >
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/30 to-orange-500/30 rounded-full blur-3xl"></div>

            <h1 className="relative text-8xl md:text-[10rem] lg:text-[12rem] font-black bg-gradient-to-r from-red-600 via-orange-600 to-pink-600 dark:from-red-400 dark:via-orange-500 dark:to-pink-500 bg-clip-text text-transparent leading-none">
              403
            </h1>

            <motion.div
              className="absolute -top-8 -right-8 md:-top-10 md:-right-12"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, -5, 5, 0],
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shadow-lg shadow-red-500/30">
                <FaLock className="text-white text-4xl md:text-5xl" />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Message */}
        <motion.div
          className="space-y-4 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <FaExclamationTriangle className="text-4xl text-red-500 dark:text-red-400 animate-bounce" />
            <h2 className="text-3xl md:text-4xl font-bold">Access Denied</h2>
          </div>

          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-lg mx-auto leading-relaxed">
            You don’t have permission to access this page. This area is
            restricted to authorized users only.
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-100 to-orange-100 dark:from-red-500/20 dark:to-orange-500/20 border border-red-300 dark:border-red-500/30">
            <FaShieldAlt className="text-red-600 dark:text-red-400" />
            <span className="text-sm font-semibold text-red-700 dark:text-red-300">
              Error Code: 403 Forbidden
            </span>
          </div>
        </motion.div>

        {/* Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <Link
            to="/"
            className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-bold shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/50 transition-all duration-300 hover:scale-105 flex items-center gap-2"
          >
            <FaHome className="group-hover:scale-110 transition-transform" />
            <span>Go to Home</span>
          </Link>

          <Link
            to="/login"
            className="group px-8 py-4 rounded-2xl border-2 border-orange-500/30 dark:border-white/20 hover:bg-orange-50 dark:hover:bg-white/10 font-bold transition-all duration-300 backdrop-blur-sm hover:scale-105 flex items-center gap-2"
          >
            <FaSignInAlt className="group-hover:scale-110 transition-transform" />
            <span>Login</span>
          </Link>
        </motion.div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 flex items-start gap-4">
            <div className="text-3xl text-blue-600">
              <FaUserShield />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Need Access?</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Login with your authorized account to access this page.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 flex items-start gap-4">
            <div className="text-3xl text-purple-600">
              <FaShieldAlt />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Security First</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                This page is protected to ensure data security.
              </p>
            </div>
          </div>
        </div>

        {/* Why Section */}
        <div className="bg-red-50 dark:bg-red-500/10 p-6 rounded-2xl border border-red-200 dark:border-red-500/20 mb-12 text-left">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">🤔</span>
            <h3 className="font-semibold text-lg">Why am I seeing this?</h3>
          </div>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
            <li>• You’re not logged in with the required permissions</li>
            <li>• Your account role doesn’t have access to this resource</li>
            <li>
              • You need to be a restaurant owner, admin, or delivery agent
            </li>
          </ul>
        </div>

        {/* Footer Links */}
        <div className="text-center text-gray-600 dark:text-gray-400 text-sm pb-12 md:pb-16">
          <p className="mb-4">Looking for something else?</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/"
              className="px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-slate-800 transition"
            >
              Home
            </Link>
            <Link
              to="/browse"
              className="px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-slate-800 transition"
            >
              Browse Food
            </Link>
            <Link
              to="/partner"
              className="px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-slate-800 transition"
            >
              Become a Partner
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-slate-800 transition"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;


// old
// import React from "react";
// import { Link } from "react-router-dom";
// import { Helmet } from "react-helmet-async";

// const Unauthorized = () => {
//   return (
//     <div
//       className="flex flex-col items-center justify-center h-screen bg-accent text-secondary text-center px-4 animate-fade-in"
//       role="alert"
//       aria-label="Unauthorized Access"
//     >
//       {/* SEO Meta */}
//       <Helmet>
//         <title>403 | Unauthorized - QuickBite</title>
//         <meta
//           name="description"
//           content="You do not have permission to access this page on QuickBite."
//         />
//       </Helmet>

//       <h1 className="text-5xl font-bold mb-4">🚫 Unauthorized</h1>
//       <p className="text-lg mb-6 max-w-md">
//         You don’t have permission to view this page. Please log in with an
//         authorized account or go back to the homepage.
//       </p>
//       <Link
//         to="/"
//         className="px-6 py-2 bg-primary text-white rounded-xl hover:bg-orange-600 transition"
//       >
//         Go to Home
//       </Link>
//     </div>
//   );
// };

// export default Unauthorized;
