import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FaHome, FaUtensils, FaSadTear } from "react-icons/fa";
import { motion } from "framer-motion";

const NotFound = () => {
  return (
    <div
      className="relative flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-gray-900 dark:text-white px-6 md:px-8 lg:px-10 overflow-hidden text-center"
      role="alert"
      aria-label="404 Page Not Found"
    >
      {/* SEO Meta */}
      <Helmet>
        <title>404 | Page Not Found - QuickBite</title>
        <meta
          name="description"
          content="Oops! The page you're looking for doesn't exist on QuickBite."
        />
      </Helmet>

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

        {/* Floating food emojis */}
        {["🍕", "🍔", "🌮", "🍜", "🍱", "🥗"].map((emoji, i) => (
          <motion.div
            key={i}
            className="absolute text-6xl opacity-20"
            style={{
              top: `${Math.random() * 60 + 10}%`,
              left: `${Math.random() * 60 + 10}%`,
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          >
            {emoji}
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 max-w-2xl flex flex-col items-center justify-center">
        {/* Animated 404 with icon */}
        <motion.div
          className="relative mb-8 flex flex-col items-center justify-center"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
        >
          <div className="relative inline-block">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/30 to-pink-500/30 rounded-full blur-3xl"></div>

            {/* 404 Text */}
            <h1 className="relative text-9xl md:text-[12rem] font-black bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 dark:from-orange-400 dark:via-pink-500 dark:to-purple-500 bg-clip-text text-transparent">
              404
            </h1>

            {/* Sad food icon */}
            <motion.div
              className="absolute -top-8 -right-8 md:-top-12 md:-right-12 text-6xl md:text-8xl"
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              🍔
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
            <FaSadTear className="text-4xl text-orange-500 dark:text-orange-400 animate-bounce" />
            <h2 className="text-3xl md:text-4xl font-bold">
              Oops! Page Not Found
            </h2>
          </div>

          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-lg mx-auto leading-relaxed">
            Looks like this page took a wrong turn on the delivery route! The
            page you're looking for doesn't exist or the link is broken.
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-100 to-pink-100 dark:from-orange-500/20 dark:to-pink-500/20 border border-orange-300 dark:border-orange-500/30">
            <span className="text-sm font-semibold text-orange-700 dark:text-orange-300">
              Error Code: 404
            </span>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <Link
            to="/"
            className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-bold shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/50 transition-all duration-300 hover:scale-105 flex items-center gap-2 relative overflow-hidden"
          >
            <FaHome className="relative z-10 group-hover:scale-110 transition-transform" />
            <span className="relative z-10">Back to Home</span>
            <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>

          <Link
            to="/customer"
            className="group px-8 py-4 rounded-2xl border-2 border-orange-500/30 dark:border-white/20 hover:bg-orange-50 dark:hover:bg-white/10 font-bold transition-all duration-300 backdrop-blur-sm hover:scale-105 hover:border-orange-500 dark:hover:border-white/40 flex items-center gap-2"
          >
            <FaUtensils className="group-hover:scale-110 transition-transform" />
            <span>Browse Restaurants</span>
          </Link>
        </motion.div>

        {/* Helpful Links */}
        <motion.div
          className="mt-12 pt-8 border-t border-gray-300 dark:border-gray-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Maybe these links can help you find what you're looking for:
          </p>
          <div className="flex flex-wrap gap-3 justify-center items-center text-center">
            {[
              { to: "/", label: "Home" },
              { to: "/customer", label: "Restaurants" },
              { to: "/login", label: "Login" },
              { to: "/register", label: "Register" },
            ].map((link, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + i * 0.1 }}
              >
                <Link
                  to={link.to}
                  className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-orange-200 dark:border-white/10 hover:border-orange-500 dark:hover:border-white/30 text-sm font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg inline-block"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Fun Fact */}
        <motion.div
          className="mt-8 p-6 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-orange-200 dark:border-white/10 shadow-lg text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-2xl">💡</span>
            <h3 className="text-lg font-bold text-orange-600 dark:text-orange-400">
              Fun Fact
            </h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 max-w-md mx-auto leading-relaxed">
            Did you know? The first online food delivery service was launched in
            1995! Now let's get you back on track to order some delicious food!
            🍕
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;

// old
// import React from "react";
// import { Link } from "react-router-dom";
// import { Helmet } from "react-helmet-async";

// const NotFound = () => {
//   return (
//     <div
//       className="flex flex-col items-center justify-center h-screen bg-accent text-secondary text-center px-4 animate-fade-in"
//       role="alert"
//       aria-label="404 Page Not Found"
//     >
//       {/* SEO Meta */}
//       <Helmet>
//         <title>404 | Page Not Found - QuickBite</title>
//         <meta
//           name="description"
//           content="Oops! The page you're looking for doesn't exist on QuickBite."
//         />
//       </Helmet>

//       <h1 className="text-6xl font-bold mb-4">404</h1>
//       <p className="text-lg mb-6 max-w-md">
//         Sorry, the page you're looking for doesn't exist or the link is broken.
//       </p>
//       <Link
//         to="/"
//         className="px-6 py-2 bg-primary text-white rounded-xl hover:bg-orange-600 transition"
//       >
//         Back to Home
//       </Link>
//     </div>
//   );
// };

// export default NotFound;
