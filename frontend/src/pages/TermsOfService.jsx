import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaFileContract,
  FaShieldAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaGavel,
  FaUserShield,
  FaEnvelope,
} from "react-icons/fa";
import Navbar from "../components/Navbar";

export default function TermsOfService() {
  const sections = [
    {
      id: "acceptance",
      icon: FaCheckCircle,
      title: "1. Acceptance of Terms",
      content: [
        "By accessing and using QuickBite's services, you accept and agree to be bound by these Terms of Service.",
        "If you do not agree to these terms, you should not use our services.",
        "We reserve the right to update these terms at any time, and your continued use constitutes acceptance of any changes.",
      ],
    },
    {
      id: "account",
      icon: FaUserShield,
      title: "2. User Accounts",
      content: [
        "You must be at least 18 years old to create an account and use our services.",
        "You are responsible for maintaining the confidentiality of your account credentials.",
        "You agree to provide accurate, current, and complete information during registration.",
        "You must notify us immediately of any unauthorized use of your account.",
        "We reserve the right to suspend or terminate accounts that violate these terms.",
      ],
    },
    {
      id: "orders",
      icon: FaShieldAlt,
      title: "3. Ordering and Delivery",
      content: [
        "All orders are subject to availability and acceptance by the restaurant partner.",
        "Prices are set by restaurant partners and may change without notice.",
        "Delivery times are estimates and may vary due to factors beyond our control.",
        "You are responsible for providing accurate delivery information.",
        "We are not liable for delays caused by weather, traffic, or other external factors.",
      ],
    },
    {
      id: "payment",
      icon: FaGavel,
      title: "4. Payment Terms",
      content: [
        "Payment must be made in full at the time of order placement.",
        "We accept major credit cards, debit cards, and digital payment methods.",
        "All transactions are processed securely through encrypted payment gateways.",
        "Service fees and delivery charges are clearly displayed before order confirmation.",
        "Promotional codes and discounts are subject to specific terms and conditions.",
      ],
    },
    {
      id: "cancellation",
      icon: FaExclamationTriangle,
      title: "5. Cancellations and Refunds",
      content: [
        "Orders can be cancelled within 2 minutes of placement for a full refund.",
        "After preparation begins, cancellations may not be possible or may incur charges.",
        "Refunds for cancelled orders will be processed within 5-7 business days.",
        "Issues with food quality should be reported within 24 hours of delivery.",
        "For detailed refund procedures, please refer to our Refund Policy.",
      ],
    },
    {
      id: "conduct",
      icon: FaUserShield,
      title: "6. User Conduct",
      content: [
        "You agree not to use our services for any unlawful or prohibited purposes.",
        "Abusive behavior toward restaurant staff or delivery personnel is strictly prohibited.",
        "Fraudulent activities, including payment disputes without valid reason, may result in account termination.",
        "You may not reverse engineer, copy, or distribute any part of our platform.",
      ],
    },
    {
      id: "intellectual",
      icon: FaShieldAlt,
      title: "7. Intellectual Property",
      content: [
        "All content on QuickBite, including logos, text, and images, is our property or licensed to us.",
        "You may not use our trademarks, service marks, or copyrighted materials without permission.",
        "Restaurant partners retain rights to their menu items, images, and brand materials.",
      ],
    },
    {
      id: "liability",
      icon: FaExclamationTriangle,
      title: "8. Limitation of Liability",
      content: [
        "QuickBite acts as an intermediary between customers and restaurant partners.",
        "We are not responsible for food quality, preparation, or allergic reactions.",
        "Our liability is limited to the value of your order in cases of service failure.",
        "We are not liable for indirect, incidental, or consequential damages.",
      ],
    },
    {
      id: "privacy",
      icon: FaUserShield,
      title: "9. Privacy and Data Protection",
      content: [
        "Your use of QuickBite is also governed by our Privacy Policy.",
        "We collect and use personal information in accordance with applicable data protection laws.",
        "You consent to our collection and use of your information as described in our Privacy Policy.",
      ],
    },
    {
      id: "termination",
      icon: FaGavel,
      title: "10. Termination",
      content: [
        "We may suspend or terminate your account for violations of these terms.",
        "You may close your account at any time by contacting customer support.",
        "Upon termination, all rights granted to you will immediately cease.",
        "Sections that by their nature should survive termination will remain in effect.",
      ],
    },
    {
      id: "governing",
      icon: FaGavel,
      title: "11. Governing Law",
      content: [
        "These terms are governed by the laws of India.",
        "Any disputes shall be subject to the exclusive jurisdiction of courts in Surat, Gujarat.",
        "If any provision is found unenforceable, the remaining provisions will continue in effect.",
      ],
    },
    {
      id: "contact",
      icon: FaEnvelope,
      title: "12. Contact Information",
      content: [
        "For questions about these Terms of Service, please contact us at:",
        "Email: legal@quickbite.com",
        "Phone: +91 12345 67890",
        "Address: 123 Food Street, Surat, Gujarat, India",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <Navbar />

      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-orange-400/10 dark:bg-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-pink-400/10 dark:bg-pink-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <main className="relative z-10 pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-6">
          {/* Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 shadow-lg shadow-blue-500/30 mb-6">
              <FaFileContract className="text-white text-3xl" />
            </div>
            <h1 className="text-5xl sm:text-6xl font-black mb-4">
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
                Terms of Service
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Please read these terms carefully before using QuickBite
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              Last Updated: January 1, 2025
            </p>
          </motion.div>

          {/* Important Notice */}
          <motion.div
            className="mb-12 p-6 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-500/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-start gap-4">
              <FaShieldAlt className="text-blue-500 text-2xl mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-lg text-blue-700 dark:text-blue-300 mb-2">
                  Important Notice
                </h3>
                <p className="text-blue-600 dark:text-blue-400 text-sm leading-relaxed">
                  By using QuickBite's services, you agree to be bound by these
                  Terms of Service. Please read them carefully. If you have any
                  questions, feel free to contact our support team.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Content Sections */}
          <div className="space-y-8">
            {sections.map((section, index) => (
              <motion.div
                key={section.id}
                id={section.id}
                className="p-8 rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-orange-200 dark:border-white/10 shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center text-white flex-shrink-0">
                    <section.icon className="text-xl" />
                  </div>
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                    {section.title}
                  </h2>
                </div>
                <ul className="space-y-3 ml-16">
                  {section.content.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-gray-600 dark:text-gray-300 leading-relaxed"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Quick Links */}
          <motion.div
            className="mt-12 p-8 rounded-3xl bg-gradient-to-br from-orange-500 to-pink-600 text-white shadow-2xl shadow-orange-500/30"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-black mb-6">Related Documents</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <Link
                to="/privacy"
                className="p-6 rounded-2xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 hover:scale-105"
              >
                <FaUserShield className="text-3xl mb-3" />
                <h4 className="font-bold mb-2">Privacy Policy</h4>
                <p className="text-sm text-white/80">
                  How we protect your data
                </p>
              </Link>
              <Link
                to="/refund"
                className="p-6 rounded-2xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 hover:scale-105"
              >
                <FaExclamationTriangle className="text-3xl mb-3" />
                <h4 className="font-bold mb-2">Refund Policy</h4>
                <p className="text-sm text-white/80">Cancellations & refunds</p>
              </Link>
              <Link
                to="/contact"
                className="p-6 rounded-2xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 hover:scale-105"
              >
                <FaEnvelope className="text-3xl mb-3" />
                <h4 className="font-bold mb-2">Contact Us</h4>
                <p className="text-sm text-white/80">
                  Have questions? Reach out
                </p>
              </Link>
            </div>
          </motion.div>

          {/* Acceptance Button */}
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-10 py-5 rounded-2xl bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-bold text-lg shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/50 transition-all duration-300 hover:scale-105"
            >
              <FaCheckCircle />
              <span>I Understand & Accept</span>
            </Link>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
