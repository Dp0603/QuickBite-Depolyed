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
} from "react-icons/fa6";
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
      toast.success("Account created successfully!");
      navigate("/customer");
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
    <div className="relative min-h-screen overflow-hidden">
      <Navbar />

      {/* Background */}
      <div
        className="fixed top-0 left-0 w-full h-full bg-cover bg-center"
        style={{
          zIndex: -2,
          backgroundImage: "url('/QuickBite1.jpg')",
          filter: "blur(6px) brightness(0.7)",
        }}
      />
      <div className="absolute inset-0 bg-black/30 z-[-1]" />

      <div className="pt-20 min-h-screen grid grid-cols-1 md:grid-cols-2 bg-transparent dark:bg-transparent relative transition-colors duration-500">
        {/* Dark mode toggle */}
        <button
          className="absolute top-5 right-5 z-50 text-primary dark:text-white text-xl"
          onClick={() => setDarkMode((prev) => !prev)}
          aria-label="Toggle dark mode"
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>

        {/* Branding */}
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
              Join QuickBite Today
            </h1>
            <p className="text-lg">
              Register to order delicious food from your favorite restaurants.
            </p>
            <img
              src="/QuickBite2.jpg"
              alt="Delicious food"
              className="rounded-xl shadow-xl"
              onError={(e) => (e.target.style.display = "none")}
            />
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          className="flex items-center justify-center p-8"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="w-full max-w-md bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-center text-secondary dark:text-white mb-6">
              Create your <span className="text-primary">QuickBite</span>{" "}
              account
            </h2>

            {/* Social login */}
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              <button
                type="button"
                onClick={() => handleSocialLogin("Google")}
                className="flex items-center gap-2 px-4 py-2 rounded-md text-white bg-[#DB4437] hover:bg-[#c33d30] shadow-md hover:shadow-lg transition"
              >
                <FaGoogle /> Google
              </button>
              <button
                type="button"
                onClick={() => handleSocialLogin("Apple")}
                className="flex items-center gap-2 px-4 py-2 rounded-md text-white bg-black hover:bg-gray-900 shadow-md hover:shadow-lg transition"
              >
                <FaApple /> Apple
              </button>
              <button
                type="button"
                onClick={() => handleSocialLogin("Twitter")}
                className="flex items-center gap-2 px-4 py-2 rounded-md text-white bg-[#1DA1F2] hover:bg-[#0d8ddb] shadow-md hover:shadow-lg transition"
              >
                <FaXTwitter /> Twitter
              </button>
              <button
                type="button"
                onClick={() => handleSocialLogin("Microsoft")}
                className="flex items-center gap-2 px-4 py-2 rounded-md text-white bg-[#2F2F2F] hover:bg-[#1f1f1f] shadow-md hover:shadow-lg transition"
              >
                <FaMicrosoft /> Microsoft
              </button>
            </div>

            {/* Register Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-secondary dark:text-gray-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-secondary dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                  placeholder="John Doe"
                />
              </div>

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
                {loading ? "Creating account..." : "Sign Up"}
              </button>
            </form>

            <p className="mt-4 text-center text-sm text-secondary dark:text-gray-300">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary hover:underline font-medium"
              >
                Login
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
