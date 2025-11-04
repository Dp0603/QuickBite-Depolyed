import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaCheckCircle,
  FaExclamationCircle,
  FaClock,
  FaHeadset,
  FaComments,
  FaUser,
} from "react-icons/fa";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleChange = (e) =>
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setLoading(true);

    try {
      // Hook this up to your backend help/support endpoint
      await new Promise((r) => setTimeout(r, 1500)); // demo
      setStatus({
        type: "success",
        msg: "Message sent successfully! We'll get back to you shortly.",
      });
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus({
        type: "error",
        msg: "Failed to send message. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: FaPhoneAlt,
      title: "Phone",
      value: "+91 12345 67890",
      link: "tel:+911234567890",
      color: "from-orange-500 to-pink-600",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      textColor: "text-orange-600 dark:text-orange-400",
    },
    {
      icon: FaEnvelope,
      title: "Email",
      value: "support@quickbite.com",
      link: "mailto:support@quickbite.com",
      color: "from-pink-500 to-purple-600",
      bgColor: "bg-pink-50 dark:bg-pink-900/20",
      textColor: "text-pink-600 dark:text-pink-400",
    },
    {
      icon: FaMapMarkerAlt,
      title: "Office",
      value: "123 Food Street, Surat, Gujarat, India",
      link: "#",
      color: "from-purple-500 to-blue-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      textColor: "text-purple-600 dark:text-purple-400",
    },
  ];

  const features = [
    {
      icon: FaClock,
      text: "24/7 Support",
      desc: "We're here whenever you need us",
    },
    {
      icon: FaHeadset,
      text: "Quick Response",
      desc: "Average reply time: 2 hours",
    },
    {
      icon: FaComments,
      text: "Live Chat",
      desc: "Get instant help from our team",
    },
  ];

  const InputField = ({ icon: Icon, ...props }) => (
    <div className="relative group">
      <Icon className="absolute left-4 top-4 text-gray-400 group-hover:text-orange-500 transition-colors" />
      {props.as === "textarea" ? (
        <textarea
          {...props}
          className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-orange-500 dark:focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all duration-300 resize-none"
        />
      ) : (
        <input
          {...props}
          className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-orange-500 dark:focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all duration-300"
        />
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">

      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-orange-400/10 dark:bg-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-pink-400/10 dark:bg-pink-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-400/5 dark:bg-purple-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <main className="relative z-10 pt-24 pb-16">
        <section className="max-w-screen-2xl mx-auto px-6">
          {/* Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-pink-600 shadow-lg shadow-orange-500/30 mb-6">
              <FaHeadset className="text-white text-3xl" />
            </div>
            <h1 className="text-5xl sm:text-6xl font-black mb-4">
              <span className="bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 dark:from-orange-400 dark:via-pink-500 dark:to-purple-500 bg-clip-text text-transparent">
                Get in Touch
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Have questions or feedback? We'd love to hear from you. Send us a
              message and we'll respond as soon as possible.
            </p>
          </motion.div>

          {/* Features Bar */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {features.map((feature, i) => (
              <motion.div
                key={i}
                className="p-6 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-orange-200 dark:border-white/10 shadow-lg text-center"
                whileHover={{ y: -5 }}
                style={{ animation: `fadeIn 0.6s ease-out ${i * 100}ms` }}
              >
                <feature.icon className="text-4xl text-orange-500 mx-auto mb-3" />
                <h3 className="font-bold text-lg mb-1 text-gray-900 dark:text-white">
                  {feature.text}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid gap-12 lg:grid-cols-2 items-start">
            {/* Left Side - Contact Info */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl font-black mb-4">
                  <span className="bg-gradient-to-r from-orange-600 to-pink-600 dark:from-orange-400 dark:to-pink-500 bg-clip-text text-transparent">
                    Contact Information
                  </span>
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Reach out to us through any of these channels. Our support
                  team is available 24/7 to assist you with any questions or
                  concerns.
                </p>
              </div>

              <div className="space-y-4">
                {contactInfo.map((item, i) => (
                  <motion.a
                    key={i}
                    href={item.link}
                    className="group relative block"
                    whileHover={{ x: 5 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 from-orange-500/10 to-pink-500/10 rounded-2xl blur-xl transition-opacity duration-500"></div>
                    <div className="relative flex items-start gap-4 p-6 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-orange-200 dark:border-white/10 shadow-lg hover:shadow-2xl transition-all duration-300">
                      <div
                        className={`p-4 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg flex-shrink-0`}
                      >
                        <item.icon className="text-white text-xl" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                          {item.title}
                        </div>
                        <div
                          className={`text-lg font-semibold ${item.textColor}`}
                        >
                          {item.value}
                        </div>
                      </div>
                    </div>
                  </motion.a>
                ))}
              </div>

              {/* Map Preview (Optional) */}
              <motion.div
                className="rounded-2xl overflow-hidden border border-orange-200 dark:border-white/10 shadow-lg h-64 bg-gray-200 dark:bg-gray-800"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                  <div className="text-center">
                    <FaMapMarkerAlt className="text-5xl mx-auto mb-2 text-orange-500" />
                    <p className="text-sm">Map Integration</p>
                    <p className="text-xs">Add Google Maps embed here</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Side - Contact Form */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-orange-200 dark:border-white/10">
                <h3 className="text-2xl font-black mb-6 text-gray-900 dark:text-white">
                  Send us a Message
                </h3>

                {/* Status Message */}
                <AnimatePresence>
                  {status && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      exit={{ opacity: 0, y: -10, height: 0 }}
                      className="mb-6 overflow-hidden"
                    >
                      <div
                        className={`p-4 rounded-xl flex items-start gap-3 ${
                          status.type === "success"
                            ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-500/30"
                            : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30"
                        }`}
                      >
                        {status.type === "success" ? (
                          <FaCheckCircle className="text-green-500 text-xl mt-0.5 flex-shrink-0" />
                        ) : (
                          <FaExclamationCircle className="text-red-500 text-xl mt-0.5 flex-shrink-0" />
                        )}
                        <div>
                          <p
                            className={`font-semibold ${
                              status.type === "success"
                                ? "text-green-700 dark:text-green-300"
                                : "text-red-700 dark:text-red-300"
                            }`}
                          >
                            {status.type === "success" ? "Success!" : "Error"}
                          </p>
                          <p
                            className={`text-sm ${
                              status.type === "success"
                                ? "text-green-600 dark:text-green-400"
                                : "text-red-600 dark:text-red-400"
                            }`}
                          >
                            {status.msg}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2 font-semibold text-sm">
                      Your Name
                    </label>
                    <InputField
                      icon={FaUser}
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2 font-semibold text-sm">
                      Email Address
                    </label>
                    <InputField
                      icon={FaEnvelope}
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2 font-semibold text-sm">
                      Message
                    </label>
                    <InputField
                      icon={FaComments}
                      as="textarea"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={6}
                      placeholder="How can we help you?"
                      required
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-bold shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/50 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <FaPaperPlane className="group-hover:translate-x-1 transition-transform" />
                        <span>Send Message</span>
                      </>
                    )}
                  </motion.button>

                  <p className="text-xs text-center text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1">
                    <FaClock />
                    We typically respond within 24 hours
                  </p>
                </form>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
