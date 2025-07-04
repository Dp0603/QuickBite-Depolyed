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
    <footer className="bg-white dark:bg-gray-900 py-8 w-full border-t border-gray-100 dark:border-gray-800 mt-12">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12 flex flex-col md:flex-row justify-between items-center">
        {/* Logo + Brand */}
        <div className="flex items-center gap-2 mb-4 md:mb-0">
          <img
            src="/QuickBite.png"
            alt="QuickBite Logo"
            className="w-8 h-8 rounded-full object-cover"
            onError={(e) => {
              e.target.style.display = "none";
              const fallback = document.getElementById("fallback-logo");
              if (fallback) fallback.style.display = "inline";
            }}
          />
          <span
            id="fallback-logo"
            className="hidden text-lg font-bold text-primary dark:text-orange-300"
          >
            QuickBite
          </span>
        </div>

        {/* Copyright */}
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 md:mb-0 text-center md:text-left">
          © {new Date().getFullYear()} QuickBite. All rights reserved.
        </p>

        {/* Social Links */}
        <div className="flex gap-4 justify-center md:justify-end">
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 dark:text-gray-400 hover:text-primary transition"
            aria-label="Facebook"
          >
            <FaFacebookF size={18} />
          </a>
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 dark:text-gray-400 hover:text-primary transition"
            aria-label="Twitter"
          >
            <FaTwitter size={18} />
          </a>
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 dark:text-gray-400 hover:text-primary transition"
            aria-label="Instagram"
          >
            <FaInstagram size={18} />
          </a>
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 dark:text-gray-400 hover:text-primary transition"
            aria-label="LinkedIn"
          >
            <FaLinkedinIn size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
}
