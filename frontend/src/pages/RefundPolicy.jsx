import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaMoneyBillWave,
  FaUndo,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationCircle,
  FaEnvelope,
  FaFileContract,
  FaUserShield,
  FaShieldAlt,
} from "react-icons/fa";
import Navbar from "../components/Navbar";

export default function RefundPolicy() {
  const sections = [
    {
      id: "overview",
      icon: FaMoneyBillWave,
      title: "1. Refund Policy Overview",
      content: [
        "At QuickBite, we strive to ensure your complete satisfaction with every order.",
        "This Refund Policy outlines the conditions under which refunds are provided.",
        "All refund requests are subject to verification and approval.",
      ],
    },
    {
      id: "cancellation",
      icon: FaUndo,
      title: "2. Order Cancellation",
      content: [
        "You can cancel your order within 2 minutes of placement for a full refund.",
        "Once the restaurant begins preparing your order, cancellation may not be possible.",
        "If cancellation is allowed after preparation starts, a cancellation fee may apply.",
        "The restaurant reserves the right to decline cancellation requests.",
      ],
    },
    {
      id: "eligible",
      icon: FaCheckCircle,
      title: "3. Refund Eligibility",
      content: [
        "Order not delivered: Full refund if your order is not delivered within the estimated time.",
        "Wrong items: Refund or replacement if you receive incorrect items.",
        "Quality issues: Refund if food quality is significantly below standard.",
        "Missing items: Partial refund for missing items in your order.",
        "Damaged packaging: Refund if packaging is severely damaged affecting food safety.",
      ],
    },
    {
      id: "ineligible",
      icon: FaTimesCircle,
      title: "4. Non-Refundable Situations",
      content: [
        "Change of mind after order preparation has begun.",
        "Minor taste or preference differences (not quality issues).",
        "Delays caused by incorrect delivery information provided by you.",
        "Inability to receive delivery due to unavailability at the provided address.",
        "Orders where you've already consumed the food.",
        "Promotional discounts or coupon codes (these are non-refundable).",
      ],
    },
    {
      id: "process",
      icon: FaClock,
      title: "5. Refund Process",
      content: [
        "Contact our customer support within 24 hours of delivery to report issues.",
        "Provide your order number and a description of the problem.",
        "Upload photos of the issue if applicable (damaged items, wrong order, etc.).",
        "Our team will review your request within 24-48 hours.",
        "Approved refunds are processed within 5-7 business days.",
        "You'll receive a confirmation email once the refund is initiated.",
      ],
    },
    {
      id: "timeline",
      icon: FaClock,
      title: "6. Refund Timeline",
      content: [
        "Credit/Debit Cards: 5-7 business days from approval.",
        "Digital Wallets: 2-3 business days from approval.",
        "Bank Transfers: 7-10 business days from approval.",
        "QuickBite Wallet: Instant credit upon approval (can be used for future orders).",
        "Refund times depend on your bank's processing schedule.",
      ],
    },
    {
      id: "partial",
      icon: FaMoneyBillWave,
      title: "7. Partial Refunds",
      content: [
        "Partial refunds are issued for missing items or incomplete orders.",
        "The refund amount is proportional to the missing/affected items.",
        "Delivery fees may not be refunded for partial order issues.",
        "If a replacement is offered and accepted, no refund will be provided.",
      ],
    },
    {
      id: "delivery",
      icon: FaExclamationCircle,
      title: "8. Delivery Fee Refunds",
      content: [
        "Delivery fees are refunded only if the order is cancelled before preparation.",
        "If delivery is significantly delayed (more than 60 minutes past ETA), delivery fees may be refunded.",
        "Delivery fees are not refunded for quality issues or missing items.",
      ],
    },
    {
      id: "promocodes",
      icon: FaTimesCircle,
      title: "9. Promotional Codes & Discounts",
      content: [
        "Promotional codes and discounts are non-refundable.",
        "If an order is cancelled or refunded, the promotional code is not re-credited.",
        "Cashback or rewards points are forfeited if a refund is issued.",
      ],
    },
    {
      id: "disputes",
      icon: FaShieldAlt,
      title: "10. Dispute Resolution",
      content: [
        "If you disagree with a refund decision, you can escalate to our senior support team.",
        "Provide additional evidence or context for review.",
        "Our decisions are based on order details, delivery data, and restaurant reports.",
        "Final decisions are made within 7 business days of escalation.",
      ],
    },
    {
      id: "fraud",
      icon: FaExclamationCircle,
      title: "11. Fraudulent Refund Requests",
      content: [
        "Repeated fraudulent refund claims may result in account suspension.",
        "We monitor refund patterns to detect abuse of our refund policy.",
        "False claims of non-delivery or quality issues may lead to account termination.",
        "Legal action may be taken against users who abuse the refund system.",
      ],
    },
    {
      id: "restaurant",
      icon: FaCheckCircle,
      title: "12. Restaurant Partner Responsibility",
      content: [
        "Restaurants are responsible for food quality and order accuracy.",
        "Refunds for quality issues are processed after consultation with the restaurant.",
        "In cases of repeated complaints against a restaurant, we may remove them from our platform.",
      ],
    },
    {
      id: "contact",
      icon: FaEnvelope,
      title: "13. Contact for Refunds",
      content: [
        "To request a refund or report an issue:",
        "Email: refunds@quickbite.com",
        "Phone: +91 12345 67890",
        "In-App Support: Use the 'Help' section in your order history",
        "Live Chat: Available 24/7 on our website and app",
      ],
    },
  ];

  const refundTimeline = [
    {
      step: "Report Issue",
      time: "Within 24 hours",
      icon: FaExclamationCircle,
    },
    { step: "Review", time: "24-48 hours", icon: FaClock },
    { step: "Approval", time: "2-3 days", icon: FaCheckCircle },
    { step: "Refund", time: "5-7 days", icon: FaMoneyBillWave },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <Navbar />

      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-green-400/10 dark:bg-green-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-400/10 dark:bg-emerald-500/20 rounded-full blur-3xl animate-pulse"
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
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/30 mb-6">
              <FaMoneyBillWave className="text-white text-3xl" />
            </div>
            <h1 className="text-5xl sm:text-6xl font-black mb-4">
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                Refund Policy
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Learn about our cancellation and refund procedures
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              Last Updated: January 1, 2025
            </p>
          </motion.div>

          {/* Important Notice */}
          <motion.div
            className="mb-12 p-6 rounded-2xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-500/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-start gap-4">
              <FaCheckCircle className="text-green-500 text-2xl mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-lg text-green-700 dark:text-green-300 mb-2">
                  Quick Refund Info
                </h3>
                <p className="text-green-600 dark:text-green-400 text-sm leading-relaxed">
                  Cancel within 2 minutes for instant refund. Report issues
                  within 24 hours of delivery. Approved refunds are processed in
                  5-7 business days.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Refund Timeline */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-black text-center mb-8 text-gray-900 dark:text-white">
              Refund Process Timeline
            </h2>
            <div className="grid md:grid-cols-4 gap-4">
              {refundTimeline.map((item, i) => (
                <motion.div
                  key={i}
                  className="p-6 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-green-200 dark:border-white/10 shadow-lg text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <item.icon className="text-4xl text-green-500 mx-auto mb-3" />
                  <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">
                    {item.step}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {item.time}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Content Sections */}
          <div className="space-y-8">
            {sections.map((section, index) => (
              <motion.div
                key={section.id}
                id={section.id}
                className="p-8 rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-green-200 dark:border-white/10 shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white flex-shrink-0">
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
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Quick Links */}
          <motion.div
            className="mt-12 p-8 rounded-3xl bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-2xl shadow-green-500/30"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-black mb-6">Related Documents</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <Link
                to="/terms"
                className="p-6 rounded-2xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 hover:scale-105"
              >
                <FaFileContract className="text-3xl mb-3" />
                <h4 className="font-bold mb-2">Terms of Service</h4>
                <p className="text-sm text-white/80">Our terms & conditions</p>
              </Link>
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
                to="/contact"
                className="p-6 rounded-2xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 hover:scale-105"
              >
                <FaEnvelope className="text-3xl mb-3" />
                <h4 className="font-bold mb-2">Contact Support</h4>
                <p className="text-sm text-white/80">
                  Need help with a refund?
                </p>
              </Link>
            </div>
          </motion.div>

          {/* Action Button */}
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-10 py-5 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-lg shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/50 transition-all duration-300 hover:scale-105"
            >
              <FaEnvelope />
              <span>Request a Refund</span>
            </Link>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
