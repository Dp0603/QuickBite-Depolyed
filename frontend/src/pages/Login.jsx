import React, { useState, useEffect, useContext } from "react";
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
} from "react-icons/fa6";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { loginUser } from "../api/axios"; // ✅ Centralized login API call

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const toast = useToast();
  const navigate = useNavigate();

  // 🌙 Load theme from local storage
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    setDarkMode(storedTheme === "dark");
  }, []);

  // 🌗 Toggle theme on darkMode change
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // 🔐 Submit login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { token, user } = await loginUser({ email, password });

      login(token, user); // Save token + user in context
      toast.success("Login successful");

      switch (user.role) {
        case "admin":
          navigate("/admin");
          break;
        case "restaurant":
          navigate("/restaurant");
          break;
        case "delivery":
          navigate("/delivery");
          break;
        default:
          navigate("/customer");
      }
    } catch (err) {
      const msg =
        err.response?.data?.message || "Login failed. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    toast.info(`Redirecting to ${provider} login...`);
    // Optional: Add logic for social login redirection here
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Navbar />

      <div
        className="fixed top-0 left-0 w-full h-full bg-cover bg-center z-[-2]"
        style={{
          backgroundImage: "url('/QuickBite1.jpg')",
          filter: "blur(6px) brightness(0.7)",
        }}
      />
      <div className="absolute inset-0 bg-black/30 z-[-1]" />

      <div className="pt-20 min-h-screen grid grid-cols-1 md:grid-cols-2 gap-2 bg-transparent relative transition-colors duration-500">
        <button
          className="absolute top-5 right-5 z-50 text-primary dark:text-white text-xl"
          onClick={() => setDarkMode((prev) => !prev)}
          aria-label="Toggle dark mode"
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>

        {/* Left Panel */}
        <motion.div
          className="hidden md:flex items-center justify-center p-10"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center max-w-md space-y-6 bg-orange-100/30 dark:bg-orange-400/10 backdrop-blur-md rounded-xl p-6 shadow-md text-gray-900 dark:text-white border border-orange-200/50 dark:border-orange-400/30">
            <img
              src="/QuickBite.png"
              alt="QuickBite Logo"
              className="mx-auto w-24 h-24 rounded-full shadow-lg"
              onError={(e) => (e.target.style.display = "none")}
            />
            <h1 className="text-4xl font-extrabold tracking-tight">
              Welcome to QuickBite
            </h1>
            <p className="text-lg">
              Fast. Delicious. At your doorstep. Sign in and satisfy your
              cravings.
            </p>
            <img
              src="/QuickBite2.jpg"
              alt="Delicious food"
              className="rounded-xl shadow-xl"
              onError={(e) => (e.target.style.display = "none")}
            />
          </div>
        </motion.div>

        {/* Right Panel */}
        <motion.div
          className="flex items-center justify-center p-8"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="w-full max-w-md bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-center text-secondary dark:text-white mb-6">
              Login to <span className="text-primary">QuickBite</span>
            </h2>

            {/* Social Logins */}
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              {[
                { icon: <FaGoogle />, provider: "Google", color: "#DB4437" },
                { icon: <FaApple />, provider: "Apple", color: "#000000" },
                { icon: <FaXTwitter />, provider: "Twitter", color: "#1DA1F2" },
                {
                  icon: <FaMicrosoft />,
                  provider: "Microsoft",
                  color: "#2F2F2F",
                },
              ].map(({ icon, provider, color }) => (
                <button
                  key={provider}
                  type="button"
                  onClick={() => handleSocialLogin(provider)}
                  className="flex items-center gap-2 px-4 py-2 rounded-md text-white"
                  style={{ backgroundColor: color }}
                >
                  {icon} {provider}
                </button>
              ))}
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-secondary dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-secondary dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                  placeholder="you@example.com"
                />
              </div>

              <div className="relative">
                <label className="block text-secondary dark:text-gray-300 mb-1">
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-secondary dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute top-9 right-3 text-gray-500 dark:text-gray-300"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-opacity-90 text-white font-semibold py-2 rounded-md transition"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <p className="mt-4 text-center text-sm text-secondary dark:text-gray-300">
              Don’t have an account?{" "}
              <Link
                to="/register"
                className="text-primary hover:underline font-medium"
              >
                Register
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
