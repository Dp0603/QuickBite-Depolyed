import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaApple,
  FaXTwitter,
  FaMicrosoft,
  FaMoon,
  FaSun,
  FaArrowRight,
  FaUserPlus,
  FaEnvelope,
  FaLock,
  FaUser,
} from "react-icons/fa6";
import { LuSparkles } from "react-icons/lu";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../context/ToastContext";
import Navbar from "../components/Navbar";

export default function Register() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    setDarkMode(storedTheme === "dark");
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await register(name, email, password);
      toast.success(
        "Account created! Please verify your email before logging in!"
      );
      navigate("/login");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    toast.info(`Redirecting to ${provider} signup...`);
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/QuickBite2.jpg')",
      }}
    >
      {/* Overlay gradient for readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50/90 via-pink-50/90 to-purple-50/90 dark:from-slate-950/90 dark:via-slate-900/90 dark:to-slate-950/90"></div>

      <Navbar />

      {/* Animated Background Effects */}
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

      {/* Page Content */}
      <div className="relative z-10 pt-20 min-h-screen grid grid-cols-1 md:grid-cols-2 place-items-center px-6 lg:px-20 gap-10 transition-colors duration-500">
        {/* Dark mode toggle */}
        <motion.button
          className="absolute top-24 right-8 z-50 w-12 h-12 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-orange-200 dark:border-white/10 flex items-center justify-center text-orange-600 dark:text-orange-400 shadow-lg hover:scale-110 transition-all duration-300"
          onClick={() => setDarkMode((prev) => !prev)}
          aria-label="Toggle dark mode"
          whileHover={{ rotate: 180 }}
          whileTap={{ scale: 0.9 }}
        >
          {darkMode ? (
            <FaSun className="text-xl" />
          ) : (
            <FaMoon className="text-xl" />
          )}
        </motion.button>

        {/* LEFT SIDE */}
        <motion.div
          className="flex items-center justify-center h-full"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative w-full max-w-lg h-full flex flex-col justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/30 to-pink-500/30 rounded-3xl blur-3xl animate-pulse"></div>

            <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border border-orange-200 dark:border-white/10 flex flex-col justify-between h-full">
              <motion.div
                className="flex justify-center"
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-pink-600 rounded-3xl blur-xl opacity-50"></div>
                  <img
                    src="/QuickBite.png"
                    alt="QuickBite Logo"
                    className="relative w-28 h-28 rounded-3xl shadow-2xl border-4 border-white dark:border-slate-800"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-orange-500 to-pink-600 rounded-full flex items-center justify-center animate-bounce">
                    <LuSparkles className="text-white text-xs" />
                  </div>
                </div>
              </motion.div>

              <div className="text-center space-y-4">
                <h1 className="text-5xl font-black">
                  <span className="bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 dark:from-orange-400 dark:via-pink-500 dark:to-purple-500 bg-clip-text text-transparent">
                    Join QuickBite
                  </span>
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  Register to order delicious food from your favorite
                  restaurants and join thousands of happy customers! 🍔✨
                </p>
              </div>

              {/* Feature badges */}
              <div className="grid grid-cols-2 gap-4 mt-8">
                {[
                  { icon: "🚀", text: "Fast Delivery" },
                  { icon: "⭐", text: "Top Restaurants" },
                  { icon: "💳", text: "Secure Payment" },
                  { icon: "🎁", text: "Rewards & Offers" },
                ].map((feature, i) => (
                  <motion.div
                    key={i}
                    className="p-4 rounded-2xl bg-gradient-to-br from-orange-100 to-pink-100 dark:from-orange-500/20 dark:to-pink-500/20 border border-orange-200 dark:border-orange-500/30 text-center"
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 + 0.5 }}
                  >
                    <div className="text-3xl mb-2">{feature.icon}</div>
                    <div className="text-sm font-bold text-gray-800 dark:text-gray-200">
                      {feature.text}
                    </div>
                  </motion.div>
                ))}
              </div>

              <img
                src="/QuickBite2.jpg"
                alt="Delicious food"
                className="rounded-2xl shadow-xl border border-orange-200 dark:border-white/10 hover:scale-105 transition-transform duration-500 mt-8"
                onError={(e) => (e.target.style.display = "none")}
              />
            </div>
          </div>
        </motion.div>

        {/* RIGHT SIDE */}
        <motion.div
          className="flex items-center justify-center h-full"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="w-full max-w-lg h-full flex flex-col justify-center">
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-orange-200 dark:border-white/10 flex flex-col justify-between h-full">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-pink-600 shadow-lg shadow-orange-500/30 mb-4">
                  <FaUserPlus className="text-white text-2xl" />
                </div>
                <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
                  Create Account
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Join the QuickBite family today!
                </p>
              </div>

              {/* Social Login */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  {
                    icon: FaGoogle,
                    name: "Google",
                    color: "bg-[#DB4437] hover:bg-[#c33d30]",
                  },
                  {
                    icon: FaApple,
                    name: "Apple",
                    color: "bg-black hover:bg-gray-900",
                  },
                  {
                    icon: FaXTwitter,
                    name: "Twitter",
                    color: "bg-[#1DA1F2] hover:bg-[#0d8ddb]",
                  },
                  {
                    icon: FaMicrosoft,
                    name: "Microsoft",
                    color: "bg-[#2F2F2F] hover:bg-[#1f1f1f]",
                  },
                ].map((social, i) => (
                  <motion.button
                    key={i}
                    type="button"
                    onClick={() => handleSocialLogin(social.name)}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-white ${social.color} shadow-md hover:shadow-xl transition-all duration-300`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <social.icon />
                    <span className="text-sm font-semibold">{social.name}</span>
                  </motion.button>
                ))}
              </div>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white dark:bg-slate-900 text-gray-500 dark:text-gray-400 font-semibold">
                    Or register with email
                  </span>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div className="relative group">
                  <label className="block text-gray-700 dark:text-gray-300 mb-2 font-semibold text-sm">
                    Full Name
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-orange-500 transition-colors" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-orange-500 dark:focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all duration-300"
                      required
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="relative group">
                  <label className="block text-gray-700 dark:text-gray-300 mb-2 font-semibold text-sm">
                    Email Address
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-orange-500 transition-colors" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-orange-500 dark:focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all duration-300"
                      required
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="relative group">
                  <label className="block text-gray-700 dark:text-gray-300 mb-2 font-semibold text-sm">
                    Password
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-orange-500 transition-colors" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-orange-500 dark:focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all duration-300"
                      required
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-bold shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/50 transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <span className="relative z-10">Sign Up</span>
                      <FaArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform" />
                      <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </>
                  )}
                </motion.button>
              </form>

              {/* Login Link */}
              <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-orange-600 dark:text-orange-400 hover:text-pink-600 dark:hover:text-pink-400 font-bold hover:underline transition-colors"
                >
                  Login here
                </Link>
              </p>

              <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-6 px-4">
                By signing up, you agree to our{" "}
                <a href="#" className="text-orange-600 hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-orange-600 hover:underline">
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
