import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaSun, FaMoon, FaBars, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const location = useLocation();
  const pathname = location.pathname;
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Load and apply theme
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    setDarkMode(storedTheme === "dark");
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const NavLink = ({ to, label, variant = "default", mobile = false }) => {
    const isActive = pathname === to;

    const variants = {
      default:
        "bg-white/80 dark:bg-slate-800/80 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700",
      primary:
        "bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white shadow-lg shadow-orange-500/30",
      secondary:
        "border-2 border-orange-500/30 dark:border-white/20 hover:bg-orange-50 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300",
    };

    const baseClasses = mobile
      ? "block w-full text-left px-6 py-3 rounded-xl font-semibold transition-all duration-300"
      : "px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 hover:scale-105";

    return (
      <Link
        to={to}
        className={`${baseClasses} ${variants[variant]} ${
          isActive
            ? "ring-2 ring-orange-500 ring-offset-2 dark:ring-offset-slate-900"
            : ""
        }`}
        onClick={() => mobile && setMobileMenuOpen(false)}
      >
        {label}
      </Link>
    );
  };

  // ✅ Manual page-based link logic
  const getNavLinks = () => {
    if (pathname === "/") {
      return [
        { to: "/login", label: "Login", variant: "secondary" },
        { to: "/register", label: "Register", variant: "secondary" },
        { to: "/partner", label: "Partner with Us", variant: "primary" },
      ];
    }

    if (pathname === "/login") {
      return [
        { to: "/register", label: "Register", variant: "secondary" },
        { to: "/", label: "Home", variant: "default" },
        { to: "/partner", label: "Partner with Us", variant: "primary" },
      ];
    }

    if (pathname === "/register") {
      return [
        { to: "/login", label: "Login", variant: "secondary" },
        { to: "/", label: "Home", variant: "default" },
        { to: "/partner", label: "Partner with Us", variant: "primary" },
      ];
    }

    if (pathname === "/partner") {
      return [
        { to: "/", label: "Home", variant: "default" },
        { to: "/login", label: "Login", variant: "secondary" },
        { to: "/register", label: "Register", variant: "secondary" },
      ];
    }

    if (pathname === "/about" || pathname === "/contact") {
      return [
        { to: "/", label: "Home", variant: "default" },
        { to: "/login", label: "Login", variant: "secondary" },
        { to: "/register", label: "Register", variant: "secondary" },
      ];
    }

    // For other routes (like dashboard)
    return [];
  };

  const links = getNavLinks();

  return (
    <>
      {/* Navbar */}
      <motion.nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-lg border-b border-orange-200 dark:border-white/10"
            : "bg-white/60 dark:bg-slate-900/60 backdrop-blur-md"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      >
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-pink-600 rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <img
                  src="/QuickBite.png"
                  alt="QuickBite Logo"
                  className="relative w-10 h-10 rounded-xl object-cover shadow-lg border-2 border-white/20 dark:border-white/10 group-hover:scale-110 transition-transform"
                  onError={(e) => (e.target.style.display = "none")}
                />
              </div>
              <span className="text-2xl font-black bg-gradient-to-r from-orange-600 to-pink-600 dark:from-orange-400 dark:to-pink-500 bg-clip-text text-transparent">
                QuickBite
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-3">
              {links.map((link, i) => (
                <NavLink
                  key={i}
                  to={link.to}
                  label={link.label}
                  variant={link.variant}
                />
              ))}

              {/* Dark Mode Toggle */}
              <motion.button
                onClick={() => setDarkMode(!darkMode)}
                className="w-11 h-11 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-all shadow-sm border border-gray-200 dark:border-white/10"
                whileHover={{ scale: 1.05, rotate: 15 }}
                whileTap={{ scale: 0.95 }}
              >
                {darkMode ? (
                  <FaSun className="text-lg" />
                ) : (
                  <FaMoon className="text-lg" />
                )}
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex lg:hidden items-center gap-3">
              <motion.button
                onClick={() => setDarkMode(!darkMode)}
                className="w-10 h-10 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm flex items-center justify-center text-gray-700 dark:text-gray-300"
                whileTap={{ scale: 0.9 }}
              >
                {darkMode ? <FaSun /> : <FaMoon />}
              </motion.button>

              <motion.button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="w-10 h-10 rounded-xl bg-gradient-to-r from-orange-500 to-pink-600 text-white flex items-center justify-center shadow-lg shadow-orange-500/30"
                whileTap={{ scale: 0.9 }}
              >
                {mobileMenuOpen ? <FaTimes /> : <FaBars />}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              className="absolute top-20 right-6 left-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-orange-200 dark:border-white/10 p-6 space-y-3"
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {links.map((link, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <NavLink
                    to={link.to}
                    label={link.label}
                    variant={link.variant}
                    mobile
                  />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-20"></div>
    </>
  );
}

//old
// // src/components/Navbar.jsx
// import React from "react";
// import { Link, useLocation } from "react-router-dom";

// export default function Navbar() {
//   const location = useLocation();
//   const isLoggedIn = !!localStorage.getItem("token");

//   const isPublicPage = ["/", "/login", "/register"].includes(location.pathname);

//   if (!isPublicPage && isLoggedIn) return null;

//   return (
//     <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-[2px] bg-white/15 dark:bg-black/15 shadow-sm px-6 sm:px-8 py-4 flex justify-between items-center">
//       {/* Logo and Brand */}
//       <Link
//         to="/"
//         className="flex items-center gap-2 text-xl font-bold text-primary bg-white/80 dark:bg-gray-900/70 px-3 py-1 rounded-full shadow-sm border border-white/30 dark:border-gray-700 transition"
//       >
//         <img
//           src="/QuickBite.png"
//           alt="QuickBite Logo"
//           className="w-7 h-7 rounded-full object-cover"
//           onError={(e) => (e.target.style.display = "none")}
//         />
//         QuickBite
//       </Link>

//       {/* Navigation Links */}
//       <div className="flex flex-wrap gap-3 items-center">
//         {/* Partner Link - always visible on public pages */}
//         {isPublicPage && (
//           <Link
//             to="/partner"
//             className="text-sm font-medium px-3 py-1 rounded-full border border-white/30 dark:border-gray-700 bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 hover:bg-yellow-200 dark:hover:bg-yellow-700 transition"
//           >
//             Partner with Us
//           </Link>
//         )}

//         {/* Existing Links */}
//         {location.pathname === "/" && (
//           <>
//             <Link
//               to="/login"
//               className="text-sm font-medium px-3 py-1 rounded-full border border-white/30 dark:border-gray-700 bg-white/80 dark:bg-gray-900/70 text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-800 transition"
//             >
//               Login
//             </Link>
//             <Link
//               to="/register"
//               className="text-sm font-medium px-3 py-1 rounded-full border border-white/30 dark:border-gray-700 bg-white/80 dark:bg-gray-900/70 text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-800 transition"
//             >
//               Register
//             </Link>
//           </>
//         )}

//         {location.pathname === "/login" && (
//           <>
//             <Link
//               to="/"
//               className="text-sm font-medium px-3 py-1 rounded-full border border-white/30 dark:border-gray-700 bg-white/80 dark:bg-gray-900/70 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
//             >
//               Back to Home
//             </Link>
//             <Link
//               to="/register"
//               className="text-sm font-medium px-3 py-1 rounded-full border border-white/30 dark:border-gray-700 bg-white/80 dark:bg-gray-900/70 text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-800 transition"
//             >
//               Register
//             </Link>
//           </>
//         )}

//         {location.pathname === "/register" && (
//           <>
//             <Link
//               to="/"
//               className="text-sm font-medium px-3 py-1 rounded-full border border-white/30 dark:border-gray-700 bg-white/80 dark:bg-gray-900/70 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
//             >
//               Back to Home
//             </Link>
//             <Link
//               to="/login"
//               className="text-sm font-medium px-3 py-1 rounded-full border border-white/30 dark:border-gray-700 bg-white/80 dark:bg-gray-900/70 text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-800 transition"
//             >
//               Login
//             </Link>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// }
