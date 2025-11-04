import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaUserShield,
  FaLock,
  FaDatabase,
  FaShareAlt,
  FaCookie,
  FaShieldAlt,
  FaEnvelope,
  FaFileContract,
  FaExclamationTriangle,
} from "react-icons/fa";
import Navbar from "../components/Navbar";

export default function PrivacyPolicy() {
  const sections = [
    {
      id: "intro",
      icon: FaUserShield,
      title: "1. Introduction",
      content: [
        'QuickBite ("we", "us", or "our") is committed to protecting your privacy and personal information.',
        "This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our services.",
        "By using QuickBite, you consent to the data practices described in this policy.",
      ],
    },
    {
      id: "collection",
      icon: FaDatabase,
      title: "2. Information We Collect",
      content: [
        "Personal Information: Name, email address, phone number, delivery address, and payment information.",
        "Order Information: Details about your orders, restaurant preferences, and order history.",
        "Device Information: IP address, browser type, device identifiers, and operating system.",
        "Location Data: GPS coordinates or approximate location to facilitate delivery services.",
        "Usage Data: How you interact with our app, including pages viewed and features used.",
      ],
    },
    {
      id: "usage",
      icon: FaShieldAlt,
      title: "3. How We Use Your Information",
      content: [
        "To process and deliver your food orders efficiently.",
        "To communicate with you about orders, promotions, and service updates.",
        "To improve our services and develop new features based on user behavior.",
        "To prevent fraud and ensure platform security.",
        "To personalize your experience with tailored recommendations.",
        "To comply with legal obligations and resolve disputes.",
      ],
    },
    {
      id: "sharing",
      icon: FaShareAlt,
      title: "4. Information Sharing",
      content: [
        "Restaurant Partners: We share your order details and delivery address with restaurants.",
        "Delivery Personnel: Delivery agents receive your name, address, and phone number.",
        "Payment Processors: Encrypted payment information is shared with secure payment gateways.",
        "Service Providers: Third-party services that help us operate our platform (analytics, hosting).",
        "Legal Requirements: When required by law or to protect our rights and safety.",
        "We do not sell your personal information to third parties for marketing purposes.",
      ],
    },
    {
      id: "cookies",
      icon: FaCookie,
      title: "5. Cookies and Tracking",
      content: [
        "We use cookies and similar technologies to enhance your experience.",
        "Essential Cookies: Required for basic functionality like authentication and session management.",
        "Analytics Cookies: Help us understand how users interact with our platform.",
        "Advertising Cookies: Used to deliver relevant ads and measure campaign effectiveness.",
        "You can control cookies through your browser settings, but disabling them may affect functionality.",
      ],
    },
    {
      id: "security",
      icon: FaLock,
      title: "6. Data Security",
      content: [
        "We implement industry-standard security measures to protect your information.",
        "All data transmission is encrypted using SSL/TLS protocols.",
        "Payment information is processed through PCI-DSS compliant payment gateways.",
        "Access to personal data is restricted to authorized personnel only.",
        "Regular security audits and vulnerability assessments are conducted.",
        "Despite our efforts, no method of transmission over the internet is 100% secure.",
      ],
    },
    {
      id: "retention",
      icon: FaDatabase,
      title: "7. Data Retention",
      content: [
        "We retain your personal information as long as your account is active.",
        "Order history is maintained for accounting and customer service purposes.",
        "After account deletion, some information may be retained as required by law.",
        "You can request deletion of your data by contacting customer support.",
        "Backup copies may persist for a limited time in our disaster recovery systems.",
      ],
    },
    {
      id: "rights",
      icon: FaUserShield,
      title: "8. Your Privacy Rights",
      content: [
        "Access: Request a copy of the personal information we hold about you.",
        "Correction: Update or correct inaccurate information in your account.",
        "Deletion: Request deletion of your account and associated data.",
        "Opt-Out: Unsubscribe from marketing emails or push notifications.",
        "Data Portability: Receive your data in a structured, machine-readable format.",
        "Complaint: Lodge a complaint with relevant data protection authorities.",
      ],
    },
    {
      id: "children",
      icon: FaExclamationTriangle,
      title: "9. Children's Privacy",
      content: [
        "Our services are not intended for individuals under 18 years of age.",
        "We do not knowingly collect information from children.",
        "If we become aware of data collected from minors, we will delete it promptly.",
        "Parents or guardians should monitor their children's online activities.",
      ],
    },
    {
      id: "international",
      icon: FaShareAlt,
      title: "10. International Data Transfers",
      content: [
        "Your information may be transferred and stored in countries outside India.",
        "We ensure appropriate safeguards are in place for international transfers.",
        "By using our services, you consent to such transfers.",
      ],
    },
    {
      id: "thirdparty",
      icon: FaShareAlt,
      title: "11. Third-Party Links",
      content: [
        "Our platform may contain links to third-party websites or services.",
        "We are not responsible for the privacy practices of these external sites.",
        "We encourage you to review the privacy policies of any third-party services.",
      ],
    },
    {
      id: "updates",
      icon: FaFileContract,
      title: "12. Policy Updates",
      content: [
        "We may update this Privacy Policy from time to time.",
        "Significant changes will be communicated via email or app notifications.",
        "Continued use of our services after updates constitutes acceptance of changes.",
        'The "Last Updated" date at the top indicates when changes were made.',
      ],
    },
    {
      id: "contact",
      icon: FaEnvelope,
      title: "13. Contact Us",
      content: [
        "For privacy-related questions or to exercise your rights, contact us at:",
        "Email: privacy@quickbite.com",
        "Phone: +91 12345 67890",
        "Address: 123 Food Street, Surat, Gujarat, India",
        "Data Protection Officer: dpo@quickbite.com",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <Navbar />

      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-400/10 dark:bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400/10 dark:bg-blue-500/20 rounded-full blur-3xl animate-pulse"
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
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 shadow-lg shadow-purple-500/30 mb-6">
              <FaUserShield className="text-white text-3xl" />
            </div>
            <h1 className="text-5xl sm:text-6xl font-black mb-4">
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
                Privacy Policy
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Your privacy matters to us. Learn how we protect your information.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              Last Updated: January 1, 2025
            </p>
          </motion.div>

          {/* Important Notice */}
          <motion.div
            className="mb-12 p-6 rounded-2xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-500/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-start gap-4">
              <FaLock className="text-purple-500 text-2xl mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-lg text-purple-700 dark:text-purple-300 mb-2">
                  Your Data is Protected
                </h3>
                <p className="text-purple-600 dark:text-purple-400 text-sm leading-relaxed">
                  We use industry-standard encryption and security measures to
                  protect your personal information. Your data is never sold to
                  third parties for marketing purposes.
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
                className="p-8 rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-purple-200 dark:border-white/10 shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white flex-shrink-0">
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
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 flex-shrink-0"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Quick Links */}
          <motion.div
            className="mt-12 p-8 rounded-3xl bg-gradient-to-br from-purple-500 to-blue-600 text-white shadow-2xl shadow-purple-500/30"
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
                  Questions about privacy?
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
              to="/"
              className="inline-flex items-center gap-2 px-10 py-5 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white font-bold text-lg shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
            >
              <FaUserShield />
              <span>I Understand</span>
            </Link>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
