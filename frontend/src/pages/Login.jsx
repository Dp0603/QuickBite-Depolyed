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

// new
// import React, { useState, useEffect, useContext } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   FaEye,
//   FaEyeSlash,
//   FaGoogle,
//   FaApple,
//   FaXTwitter,
//   FaMicrosoft,
//   FaMoon,
//   FaSun,
//   FaArrowRight,
//   FaEnvelope,
//   FaLock,
//   FaRocket,
//   FaBolt,
//   FaHeart,
// } from "react-icons/fa6";
// import { FaShieldAlt } from "react-icons/fa";
// import { motion } from "framer-motion";
// import Navbar from "../components/Navbar";
// import { AuthContext } from "../context/AuthContext";
// import { useToast } from "../context/ToastContext";
// import { loginUser } from "../api/axios";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [darkMode, setDarkMode] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const { login } = useContext(AuthContext);
//   const toast = useToast();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const storedTheme = localStorage.getItem("theme");
//     setDarkMode(storedTheme === "dark");
//   }, []);

//   useEffect(() => {
//     document.documentElement.classList.toggle("dark", darkMode);
//     localStorage.setItem("theme", darkMode ? "dark" : "light");
//   }, [darkMode]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const { token, user } = await loginUser({ email, password });
//       login(token, user);
//       toast.success("Login successful");

//       switch (user.role) {
//         case "admin":
//           navigate("/admin");
//           break;
//         case "restaurant":
//           navigate("/restaurant");
//           break;
//         case "delivery":
//           navigate("/delivery");
//           break;
//         default:
//           navigate("/customer");
//       }
//     } catch (err) {
//       const msg =
//         err.response?.data?.message || "Login failed. Please try again.";
//       toast.error(msg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSocialLogin = (provider) => {
//     toast.info(`Redirecting to ${provider} login...`);
//   };

//   return (
//     <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
//       <Navbar />

//       {/* Animated Background Elements */}
//       <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
//         <div className="absolute top-20 left-10 w-96 h-96 bg-orange-400/20 dark:bg-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
//         <div
//           className="absolute bottom-20 right-10 w-96 h-96 bg-pink-400/20 dark:bg-pink-500/20 rounded-full blur-3xl animate-pulse"
//           style={{ animationDelay: "1s" }}
//         ></div>
//         <div
//           className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-400/10 dark:bg-purple-500/10 rounded-full blur-3xl animate-pulse"
//           style={{ animationDelay: "2s" }}
//         ></div>
//       </div>

//       {/* Grid Container */}
//       <div className="relative z-10 pt-20 min-h-screen grid grid-cols-1 md:grid-cols-2 items-stretch transition-colors duration-500">
//         {/* Dark Mode Toggle */}
//         <motion.button
//           className="absolute top-24 right-8 z-50 w-12 h-12 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-orange-200 dark:border-white/10 flex items-center justify-center text-orange-600 dark:text-orange-400 shadow-lg hover:scale-110 transition-all duration-300"
//           onClick={() => setDarkMode((prev) => !prev)}
//           aria-label="Toggle dark mode"
//           whileHover={{ rotate: 180 }}
//           whileTap={{ scale: 0.9 }}
//         >
//           {darkMode ? (
//             <FaSun className="text-xl" />
//           ) : (
//             <FaMoon className="text-xl" />
//           )}
//         </motion.button>

//         {/* Left Side */}
//         <motion.div
//           className="hidden md:flex flex-col items-center justify-center p-10 relative h-full w-full"
//           initial={{ x: -100, opacity: 0 }}
//           animate={{ x: 0, opacity: 1 }}
//           transition={{ duration: 0.8 }}
//         >
//           <div className="relative w-full h-full flex flex-col justify-center">
//             <div className="absolute inset-0 bg-gradient-to-br from-orange-500/30 to-pink-500/30 rounded-3xl blur-3xl animate-pulse"></div>

//             <div className="relative space-y-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border border-orange-200 dark:border-white/10 flex-grow flex flex-col justify-between">
//               {/* Logo */}
//               <motion.div
//                 className="flex justify-center"
//                 animate={{ y: [0, -10, 0] }}
//                 transition={{
//                   duration: 2,
//                   repeat: Infinity,
//                   ease: "easeInOut",
//                 }}
//               >
//                 <div className="relative">
//                   <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-pink-600 rounded-3xl blur-xl opacity-50"></div>
//                   <img
//                     src="/QuickBite.png"
//                     alt="QuickBite Logo"
//                     className="relative w-28 h-28 rounded-3xl shadow-2xl border-4 border-white dark:border-slate-800"
//                     onError={(e) => (e.target.style.display = "none")}
//                   />
//                   <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-orange-500 to-pink-600 rounded-full flex items-center justify-center animate-bounce">
//                     <FaRocket className="text-white text-xs" />
//                   </div>
//                 </div>
//               </motion.div>

//               {/* Heading */}
//               <div className="text-center space-y-4">
//                 <h1 className="text-5xl font-black bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 dark:from-orange-400 dark:via-pink-500 dark:to-purple-500 bg-clip-text text-transparent">
//                   Welcome Back!
//                 </h1>
//                 <p className="text-lg text-gray-600 dark:text-gray-300">
//                   Fast. Delicious. At your doorstep. Sign in and satisfy your
//                   cravings! 🍔✨
//                 </p>
//               </div>

//               {/* Features */}
//               <div className="grid grid-cols-2 gap-4">
//                 {[
//                   {
//                     icon: <FaBolt />,
//                     text: "Lightning Fast",
//                     color: "from-yellow-500 to-orange-500",
//                   },
//                   {
//                     icon: <FaShieldAlt />,
//                     text: "100% Secure",
//                     color: "from-green-500 to-emerald-500",
//                   },
//                   {
//                     icon: <FaHeart />,
//                     text: "Best Quality",
//                     color: "from-pink-500 to-red-500",
//                   },
//                   {
//                     icon: <FaRocket />,
//                     text: "Quick Delivery",
//                     color: "from-blue-500 to-purple-500",
//                   },
//                 ].map((feature, i) => (
//                   <motion.div
//                     key={i}
//                     className="p-4 rounded-2xl bg-gradient-to-br from-orange-100 to-pink-100 dark:from-orange-500/20 dark:to-pink-500/20 border border-orange-200 dark:border-orange-500/30 text-center"
//                     whileHover={{ scale: 1.05, rotate: 2 }}
//                   >
//                     <div
//                       className={`text-2xl mb-2 inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${feature.color} text-white shadow-lg`}
//                     >
//                       {feature.icon}
//                     </div>
//                     <div className="text-sm font-bold text-gray-800 dark:text-gray-200">
//                       {feature.text}
//                     </div>
//                   </motion.div>
//                 ))}
//               </div>

//               <img
//                 src="/QuickBite2.jpg"
//                 alt="Delicious food"
//                 className="rounded-2xl shadow-xl border border-orange-200 dark:border-white/10 hover:scale-105 transition-transform duration-500"
//                 onError={(e) => (e.target.style.display = "none")}
//               />

//               {/* Stats */}
//               <div className="grid grid-cols-3 gap-4 pt-4">
//                 {[
//                   { value: "500+", label: "Restaurants" },
//                   { value: "50K+", label: "Orders" },
//                   { value: "4.8★", label: "Rating" },
//                 ].map((stat, i) => (
//                   <div key={i} className="text-center">
//                     <div className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 dark:from-orange-400 dark:to-pink-500 bg-clip-text text-transparent">
//                       {stat.value}
//                     </div>
//                     <div className="text-xs text-gray-600 dark:text-gray-400">
//                       {stat.label}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </motion.div>

//         {/* Right Side */}
//         <motion.div
//           className="flex items-center justify-center p-8 h-full w-full"
//           initial={{ x: 100, opacity: 0 }}
//           animate={{ x: 0, opacity: 1 }}
//           transition={{ duration: 0.8 }}
//         >
//           <div className="w-full max-w-md flex flex-col h-full justify-center">
//             <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-orange-200 dark:border-white/10">
//               {/* Header */}
//               <div className="text-center mb-8">
//                 <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-pink-600 shadow-lg shadow-orange-500/30 mb-4">
//                   <FaRocket className="text-white text-2xl" />
//                 </div>
//                 <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
//                   Welcome Back
//                 </h2>
//                 <p className="text-gray-600 dark:text-gray-400">
//                   Login to continue your food journey!
//                 </p>
//               </div>

//               {/* Social Login */}
//               <div className="grid grid-cols-2 gap-3 mb-6">
//                 {[
//                   {
//                     icon: FaGoogle,
//                     name: "Google",
//                     color: "bg-[#DB4437] hover:bg-[#c33d30]",
//                   },
//                   {
//                     icon: FaApple,
//                     name: "Apple",
//                     color: "bg-black hover:bg-gray-900",
//                   },
//                   {
//                     icon: FaXTwitter,
//                     name: "Twitter",
//                     color: "bg-[#1DA1F2] hover:bg-[#0d8ddb]",
//                   },
//                   {
//                     icon: FaMicrosoft,
//                     name: "Microsoft",
//                     color: "bg-[#2F2F2F] hover:bg-[#1f1f1f]",
//                   },
//                 ].map((social, i) => (
//                   <motion.button
//                     key={i}
//                     type="button"
//                     onClick={() => handleSocialLogin(social.name)}
//                     className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-white ${social.color} shadow-md hover:shadow-xl transition-all duration-300`}
//                     whileHover={{ scale: 1.05 }}
//                   >
//                     <social.icon />
//                     <span className="text-sm font-semibold">{social.name}</span>
//                   </motion.button>
//                 ))}
//               </div>

//               {/* Divider */}
//               <div className="relative my-6">
//                 <div className="absolute inset-0 flex items-center">
//                   <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
//                 </div>
//                 <div className="relative flex justify-center text-sm">
//                   <span className="px-4 bg-white dark:bg-slate-900 text-gray-500 dark:text-gray-400 font-semibold">
//                     Or login with email
//                   </span>
//                 </div>
//               </div>

//               {/* Form */}
//               <form onSubmit={handleSubmit} className="space-y-5">
//                 <div className="relative group">
//                   <label className="block text-gray-700 dark:text-gray-300 mb-2 font-semibold text-sm">
//                     Email Address
//                   </label>
//                   <div className="relative">
//                     <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-orange-500" />
//                     <input
//                       type="email"
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
//                       required
//                       placeholder="you@example.com"
//                     />
//                   </div>
//                 </div>

//                 <div className="relative group">
//                   <label className="block text-gray-700 dark:text-gray-300 mb-2 font-semibold text-sm">
//                     Password
//                   </label>
//                   <div className="relative">
//                     <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-orange-500" />
//                     <input
//                       type={showPassword ? "text" : "password"}
//                       value={password}
//                       onChange={(e) => setPassword(e.target.value)}
//                       className="w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
//                       required
//                       placeholder="••••••••"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowPassword((prev) => !prev)}
//                       className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500"
//                     >
//                       {showPassword ? <FaEyeSlash /> : <FaEye />}
//                     </button>
//                   </div>
//                 </div>

//                 <div className="text-right">
//                   <Link
//                     to="/forgot-password"
//                     className="text-sm text-orange-600 dark:text-orange-400 hover:text-pink-600 font-semibold hover:underline"
//                   >
//                     Forgot Password?
//                   </Link>
//                 </div>

//                 <motion.button
//                   type="submit"
//                   disabled={loading}
//                   className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
//                   whileHover={{ scale: loading ? 1 : 1.02 }}
//                 >
//                   {loading ? (
//                     <>
//                       <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                       <span>Logging in...</span>
//                     </>
//                   ) : (
//                     <>
//                       <span>Login</span>
//                       <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
//                     </>
//                   )}
//                 </motion.button>
//               </form>

//               <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
//                 Don’t have an account?{" "}
//                 <Link
//                   to="/register"
//                   className="text-orange-600 dark:text-orange-400 hover:text-pink-600 font-bold hover:underline"
//                 >
//                   Register here
//                 </Link>
//               </p>
//             </div>

//             <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
//               <FaShieldAlt className="text-green-500" />
//               <span>Secured with 256-bit SSL encryption</span>
//             </div>
//           </div>
//         </motion.div>
//       </div>
//     </div>
//   );
// }
