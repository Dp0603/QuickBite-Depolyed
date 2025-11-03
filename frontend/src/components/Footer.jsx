// src/components/Footer.jsx
import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-white/60 to-white/30 dark:from-slate-900/80 dark:to-slate-950/95 border-t border-white/20 dark:border-white/10 py-10 backdrop-blur-sm">
      {/* Gradient Glow Line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 opacity-30 blur-sm"></div>

      <div className="max-w-screen-2xl mx-auto px-6 sm:px-8 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <img
            src="/QuickBite.png"
            alt="QuickBite Logo"
            className="w-10 h-10 rounded-lg object-cover shadow-md border border-white/20 dark:border-white/10"
            onError={(e) => (e.target.style.display = "none")}
          />
          <h2 className="text-xl font-extrabold bg-gradient-to-r from-orange-600 to-pink-600 dark:from-orange-400 dark:to-pink-500 bg-clip-text text-transparent">
            QuickBite
          </h2>
        </div>

        {/* Links */}
        <nav className="flex flex-wrap justify-center md:justify-end gap-4 text-sm text-gray-700 dark:text-gray-300">
          <a
            href="/about"
            className="hover:text-orange-500 dark:hover:text-orange-400 transition"
          >
            About
          </a>
          <a
            href="/restaurants"
            className="hover:text-orange-500 dark:hover:text-orange-400 transition"
          >
            Restaurants
          </a>
          <a
            href="/partner"
            className="hover:text-orange-500 dark:hover:text-orange-400 transition"
          >
            Partner
          </a>
          <a
            href="/contact"
            className="hover:text-orange-500 dark:hover:text-orange-400 transition"
          >
            Contact
          </a>
        </nav>

        {/* Social Icons */}
        <div className="flex gap-3">
          {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map(
            (Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label={`Social ${i}`}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/40 dark:bg-white/10 text-gray-800 dark:text-gray-200 hover:bg-gradient-to-br hover:from-orange-500 hover:to-pink-600 hover:text-white transition-all duration-300 hover:scale-110 hover:-rotate-6 shadow-sm"
              >
                <Icon size={14} />
              </a>
            )
          )}
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} QuickBite — Made with ❤️ for food lovers.
      </div>
    </footer>
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
