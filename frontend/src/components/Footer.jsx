import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaHeart,
} from "react-icons/fa";
import { motion } from "framer-motion";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      Icon: FaFacebookF,
      label: "Facebook",
      href: "https://facebook.com/quickbite",
      color: "hover:bg-[#1877F2]",
    },
    {
      Icon: FaTwitter,
      label: "Twitter",
      href: "https://twitter.com/quickbite",
      color: "hover:bg-[#1DA1F2]",
    },
    {
      Icon: FaInstagram,
      label: "Instagram",
      href: "https://instagram.com/quickbite",
      color: "hover:bg-gradient-to-br hover:from-[#E4405F] hover:to-[#F77737]",
    },
    {
      Icon: FaLinkedinIn,
      label: "LinkedIn",
      href: "https://linkedin.com/company/quickbite",
      color: "hover:bg-[#0077B5]",
    },
  ];

  const quickLinks = [
    { to: "/about", label: "About Us" },
    { to: "/restaurants", label: "Restaurants" },
    { to: "/partner", label: "Become a Partner" },
    { to: "/contact", label: "Contact" },
  ];

  const legalLinks = [
    { to: "/terms", label: "Terms of Service" },
    { to: "/privacy", label: "Privacy Policy" },
    { to: "/refund", label: "Refund Policy" },
  ];

  return (
    <footer
      aria-label="QuickBite Website Footer"
      className="relative bg-gradient-to-b from-white/60 to-white/30 dark:from-slate-900/80 dark:to-slate-950/95 border-t border-white/20 dark:border-white/10 backdrop-blur-sm overflow-hidden"
    >
      {/* Gradient Glow Line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 opacity-30 blur-sm"></div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-orange-500/10 dark:bg-orange-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-pink-500/10 dark:bg-pink-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-screen-2xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-pink-600 rounded-xl blur-md opacity-50"></div>
                <img
                  src="/QuickBite.png"
                  alt="QuickBite Logo"
                  className="relative w-12 h-12 rounded-xl object-cover shadow-lg border-2 border-white/20 dark:border-white/10"
                  onError={(e) => {
                    e.target.style.display = "none";
                    const fallback = document.createElement("span");
                    fallback.textContent = "QuickBite";
                    fallback.className =
                      "text-lg font-semibold text-orange-600";
                    e.target.parentNode.appendChild(fallback);
                  }}
                />
              </div>
              <h2 className="text-2xl font-black bg-gradient-to-r from-orange-600 to-pink-600 dark:from-orange-400 dark:to-pink-500 bg-clip-text text-transparent">
                QuickBite
              </h2>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Delivering happiness, one meal at a time. Order from your favorite
              restaurants and enjoy delicious food at your doorstep.
            </p>

            <div className="flex gap-3">
              {socialLinks.map(({ Icon, label, href, color }, i) => (
                <motion.a
                  key={i}
                  href={href}
                  aria-label={`Visit QuickBite on ${label}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 flex items-center justify-center rounded-xl bg-white/40 dark:bg-white/10 text-gray-800 dark:text-gray-200 ${color} hover:text-white transition-all duration-300 shadow-sm hover:shadow-lg hover:scale-110`}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon size={16} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <FooterColumn title="Quick Links" links={quickLinks} />

          {/* Legal */}
          <FooterColumn title="Legal" links={legalLinks} />

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:support@quickbite.com"
                  aria-label="Email QuickBite support"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors inline-flex items-center gap-2 group"
                >
                  <FaEnvelope className="text-orange-500 group-hover:scale-110 transition-transform" />
                  support@quickbite.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+911234567890"
                  aria-label="Call QuickBite support"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors inline-flex items-center gap-2 group"
                >
                  <FaPhone className="text-orange-500 group-hover:scale-110 transition-transform" />
                  +91 12345 67890
                </a>
              </li>
              <li className="text-sm text-gray-600 dark:text-gray-400 inline-flex items-start gap-2">
                <FaMapMarkerAlt className="text-orange-500 mt-1 flex-shrink-0" />
                <span>123 Food Street, Ahmedabad, Gujarat, India</span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="pt-8 border-t border-gray-200 dark:border-gray-800"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center md:text-left">
              © {currentYear} QuickBite. All rights reserved.
            </p>

            <motion.div
              className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <span>Made with</span>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <FaHeart className="text-red-500" />
              </motion.div>
              <span>for food lovers</span>
            </motion.div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-500">
                We accept:
              </span>
              <div className="flex gap-2">
                {["💳", "🏦", "📱", "💰"].map((emoji, i) => (
                  <motion.span
                    key={i}
                    className="text-xl opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {emoji}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}

// ✅ Reusable FooterColumn Component
function FooterColumn({ title, links }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        {title}
      </h3>
      <ul className="space-y-3">
        {links.map((link, i) => (
          <li key={i}>
            <Link
              to={link.to}
              aria-label={`Navigate to ${link.label}`}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors inline-flex items-center gap-2 group"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

// import React from "react";
// import {
//   FaFacebookF,
//   FaTwitter,
//   FaInstagram,
//   FaLinkedinIn,
// } from "react-icons/fa";

// export default function Footer() {
//   return (
//     <footer className="bg-gradient-to-b from-white/60 to-white/30 dark:from-slate-900/80 dark:to-slate-900/95 py-10 w-full mt-12 border-t border-transparent">
//       <div className="max-w-screen-2xl mx-auto px-6 sm:px-8 lg:px-12">
//         {/* Top divider with soft glow */}
//         <div className="h-0.5 rounded-full bg-gradient-to-r from-orange-300/60 via-pink-300/40 to-purple-400/30 mb-8 shadow-sm" />

//         <div className="bg-white/60 dark:bg-slate-900/70 backdrop-blur-sm border border-white/20 dark:border-white/6 rounded-2xl shadow-lg px-6 py-8 flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
//           {/* Brand */}
//           <div className="flex items-start gap-4 w-full md:w-1/3">
//             <div className="relative flex-shrink-0">
//               <img
//                 src="/QuickBite.png"
//                 alt="QuickBite Logo"
//                 className="w-12 h-12 rounded-lg object-cover shadow-md border-2 border-white dark:border-slate-800"
//                 onError={(e) => {
//                   e.target.style.display = "none";
//                   const fallback = document.getElementById("fallback-logo");
//                   if (fallback) fallback.style.display = "inline";
//                 }}
//               />
//               <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center shadow-sm">
//                 <svg width="12" height="12" viewBox="0 0 24 24" className="text-white fill-current">
//                   <path d="M12 2l3 7h7l-5.5 4 2 7L12 17l-6.5 3 2-7L2 9h7z" />
//                 </svg>
//               </div>
//             </div>

//             <div>
//               <span
//                 id="fallback-logo"
//                 className="hidden text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-pink-600"
//               >
//                 QuickBite
//               </span>
//               <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
//                 Fast. Fresh. Everywhere. Order from top restaurants near you.
//               </p>
//               <div className="mt-3 flex gap-2">
//                 <a
//                   href="/partner"
//                   className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full bg-gradient-to-r from-orange-100 to-pink-100 dark:from-orange-700/20 dark:to-pink-700/20 border border-white/30 dark:border-white/6 text-orange-700 dark:text-orange-200 hover:scale-105 transition"
//                 >
//                   Partner with Us
//                 </a>
//                 <a
//                   href="/contact"
//                   className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full border border-white/10 bg-transparent text-sm text-gray-700 dark:text-gray-200 hover:bg-white/5 transition"
//                 >
//                   Contact
//                 </a>
//               </div>
//             </div>
//           </div>

//           {/* Links */}
//           <div className="w-full md:w-1/3 grid grid-cols-2 gap-4 text-sm">
//             <div>
//               <h5 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2">
//                 Explore
//               </h5>
//               <ul className="space-y-2">
//                 <li>
//                   <a href="/" className="text-gray-700 dark:text-gray-200 hover:text-primary transition">
//                     Home
//                   </a>
//                 </li>
//                 <li>
//                   <a href="/restaurants" className="text-gray-700 dark:text-gray-200 hover:text-primary transition">
//                     Restaurants
//                   </a>
//                 </li>
//                 <li>
//                   <a href="/offers" className="text-gray-700 dark:text-gray-200 hover:text-primary transition">
//                     Rewards & Offers
//                   </a>
//                 </li>
//               </ul>
//             </div>

//             <div>
//               <h5 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2">
//                 Company
//               </h5>
//               <ul className="space-y-2">
//                 <li>
//                   <a href="/about" className="text-gray-700 dark:text-gray-200 hover:text-primary transition">
//                     About Us
//                   </a>
//                 </li>
//                 <li>
//                   <a href="/help" className="text-gray-700 dark:text-gray-200 hover:text-primary transition">
//                     Help & Support
//                   </a>
//                 </li>
//                 <li>
//                   <a href="/terms" className="text-gray-700 dark:text-gray-200 hover:text-primary transition">
//                     Terms & Privacy
//                   </a>
//                 </li>
//               </ul>
//             </div>
//           </div>

//           {/* Social + Copyright */}
//           <div className="w-full md:w-1/3 flex flex-col items-center md:items-end gap-4">
//             <div className="flex gap-3">
//               {[{
//                 href: "#",
//                 label: "Facebook",
//                 icon: <FaFacebookF size={14} />
//               },{
//                 href: "#",
//                 label: "Twitter",
//                 icon: <FaTwitter size={14} />
//               },{
//                 href: "#",
//                 label: "Instagram",
//                 icon: <FaInstagram size={14} />
//               },{
//                 href: "#",
//                 label: "LinkedIn",
//                 icon: <FaLinkedinIn size={14} />
//               }].map((s, i) => (
//                 <a
//                   key={i}
//                   href={s.href}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   aria-label={s.label}
//                   className="w-10 h-10 rounded-full flex items-center justify-center bg-white/20 dark:bg-white/6 hover:bg-gradient-to-br from-orange-500 to-pink-500 text-gray-800 dark:text-white hover:text-white transition transform hover:scale-105 shadow-sm"
//                 >
//                   {s.icon}
//                 </a>
//               ))}
//             </div>

//             <p className="text-xs text-gray-500 dark:text-gray-400 text-center md:text-right">
//               © {new Date().getFullYear()} QuickBite. All rights reserved.
//             </p>
//           </div>
//         </div>

//         {/* Bottom micro-note */}
//         <div className="mt-6 text-center text-xs text-gray-400">
//           Built with care • Secure payments via integrated gateways • Images and
//           assets may be cached for performance.
//         </div>
//       </div>
//     </footer>
//   );
// }
