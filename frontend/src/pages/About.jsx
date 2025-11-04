import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaRocket,
  FaStar,
  FaCreditCard,
  FaGift,
  FaHeart,
  FaUsers,
  FaShieldAlt,
  FaTrophy,
  FaArrowRight,
  FaCheckCircle,
  FaQuoteLeft,
} from "react-icons/fa";

export default function About() {
  const features = [
    { icon: FaRocket, title: "Fast Delivery", desc: "Under 30 minutes" },
    { icon: FaStar, title: "Top Restaurants", desc: "500+ partners" },
    { icon: FaCreditCard, title: "Secure Payment", desc: "SSL encrypted" },
    { icon: FaGift, title: "Rewards & Offers", desc: "Exclusive deals" },
  ];

  const stats = [
    { value: "500+", label: "Restaurants", icon: FaStar },
    { value: "50K+", label: "Happy Customers", icon: FaUsers },
    { value: "4.8★", label: "Average Rating", icon: FaTrophy },
  ];

  const values = [
    {
      icon: FaHeart,
      title: "Customer First",
      desc: "Your satisfaction is our top priority. We go the extra mile to ensure every order is perfect.",
      color: "from-red-500 to-pink-600",
    },
    {
      icon: FaShieldAlt,
      title: "Quality Assured",
      desc: "We partner only with the best restaurants that meet our strict quality standards.",
      color: "from-blue-500 to-cyan-600",
    },
    {
      icon: FaRocket,
      title: "Innovation Driven",
      desc: "We leverage cutting-edge technology to provide the fastest and most reliable service.",
      color: "from-purple-500 to-pink-600",
    },
  ];

  const timeline = [
    {
      year: "2020",
      title: "Founded",
      desc: "QuickBite started with a mission to revolutionize food delivery",
    },
    {
      year: "2021",
      title: "100 Partners",
      desc: "Reached 100 restaurant partnerships across major cities",
    },
    {
      year: "2023",
      title: "50K Orders",
      desc: "Delivered our 50,000th order and expanded to 10 cities",
    },
    {
      year: "2025",
      title: "Going Global",
      desc: "Expanding internationally with 500+ restaurant partners",
    },
  ];

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
        {/* Hero Section */}
        <section className="max-w-screen-2xl mx-auto px-6 py-16">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-8"
            >
              <div>
                <motion.div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-100 to-pink-100 dark:from-orange-500/20 dark:to-pink-500/20 border border-orange-300 dark:border-orange-500/30 backdrop-blur-sm mb-6"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <FaHeart className="text-orange-500 dark:text-orange-400" />
                  <span className="text-sm font-semibold text-orange-700 dark:text-orange-300">
                    Our Story
                  </span>
                </motion.div>

                <h1 className="text-5xl md:text-6xl font-black leading-tight mb-6">
                  <span className="bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 dark:from-orange-400 dark:via-pink-500 dark:to-purple-500 bg-clip-text text-transparent">
                    About QuickBite
                  </span>
                </h1>

                <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
                  QuickBite is built to bring the best restaurants to your door
                  — fast, fresh and reliable. We partner with local chefs and
                  eateries to deliver a premium ordering experience with secure
                  payments, live tracking and curated offers.
                </p>
              </div>

              {/* Feature Grid */}
              <div className="grid grid-cols-2 gap-4">
                {features.map((f, i) => (
                  <motion.div
                    key={i}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="p-5 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-orange-200 dark:border-white/10 shadow-lg group cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center text-white mb-3 shadow-lg group-hover:scale-110 transition-transform">
                      <f.icon className="text-xl" />
                    </div>
                    <div className="text-base font-bold text-gray-900 dark:text-white mb-1">
                      {f.title}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {f.desc}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/customer"
                  className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-bold shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/50 transition-all duration-300 hover:scale-105 flex items-center gap-2"
                >
                  <span>Explore Restaurants</span>
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/partner"
                  className="px-8 py-4 rounded-2xl border-2 border-orange-500/30 dark:border-white/20 hover:bg-orange-50 dark:hover:bg-white/10 font-bold transition-all duration-300 hover:scale-105 hover:border-orange-500 dark:hover:border-white/40"
                >
                  Partner with Us
                </Link>
              </div>
            </motion.div>

            {/* Right Side - Image & Stats */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative"
            >
              {/* Main Image */}
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/30 to-pink-500/30 rounded-3xl blur-3xl"></div>
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-orange-200 dark:border-white/10">
                  <img
                    src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=80"
                    alt="Delicious food"
                    className="w-full h-96 object-cover hover:scale-110 transition-transform duration-700"
                  />
                </div>

                {/* Floating Badge */}
                <motion.div
                  className="absolute -bottom-6 -left-6 px-6 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-orange-200 dark:border-white/20 backdrop-blur-xl shadow-2xl"
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-2xl">
                      ✓
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white">
                        Trusted Partner
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Since 2020
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4">
                {stats.map((stat, i) => (
                  <motion.div
                    key={i}
                    className="p-5 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-orange-200 dark:border-white/10 shadow-lg text-center hover:scale-105 transition-transform cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <stat.icon className="text-3xl text-orange-500 mx-auto mb-2" />
                    <div className="text-2xl font-black bg-gradient-to-r from-orange-600 to-pink-600 dark:from-orange-400 dark:to-pink-500 bg-clip-text text-transparent">
                      {stat.value}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Our Values Section */}
        <section className="max-w-screen-2xl mx-auto px-6 py-20">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl sm:text-5xl font-black mb-4">
              <span className="bg-gradient-to-r from-orange-600 to-pink-600 dark:from-orange-400 dark:to-pink-500 bg-clip-text text-transparent">
                Our Core Values
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              The principles that drive everything we do
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, i) => (
              <motion.div
                key={i}
                className="group relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                whileHover={{ y: -10 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative p-8 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-orange-200 dark:border-white/10 shadow-lg">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${value.color} flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all`}
                  >
                    <value.icon className="text-3xl" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {value.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Timeline Section */}
        <section className="max-w-screen-2xl mx-auto px-6 py-20">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl sm:text-5xl font-black mb-4">
              <span className="bg-gradient-to-r from-orange-600 to-pink-600 dark:from-orange-400 dark:to-pink-500 bg-clip-text text-transparent">
                Our Journey
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              From a small startup to a food delivery leader
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-500 to-pink-600 hidden lg:block"></div>

            <div className="space-y-12">
              {timeline.map((item, i) => (
                <motion.div
                  key={i}
                  className={`flex flex-col lg:flex-row items-center gap-8 ${
                    i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                  }`}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                >
                  <div
                    className="flex-1 text-center lg:text-right"
                    style={{ textAlign: i % 2 === 0 ? "right" : "left" }}
                  >
                    <div className="inline-block p-6 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-orange-200 dark:border-white/10 shadow-lg hover:scale-105 transition-transform">
                      <div className="text-3xl font-black bg-gradient-to-r from-orange-600 to-pink-600 dark:from-orange-400 dark:to-pink-500 bg-clip-text text-transparent mb-2">
                        {item.year}
                      </div>
                      <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center text-white font-bold shadow-lg z-10 flex-shrink-0">
                    <FaCheckCircle />
                  </div>

                  <div className="flex-1"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonial Section */}
        <section className="max-w-screen-2xl mx-auto px-6 py-20">
          <motion.div
            className="p-12 rounded-3xl bg-gradient-to-br from-orange-500 to-pink-600 text-white shadow-2xl shadow-orange-500/30 relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>

            <div className="relative z-10 max-w-3xl mx-auto text-center">
              <FaQuoteLeft className="text-5xl mx-auto mb-6 opacity-50" />
              <p className="text-2xl md:text-3xl font-bold mb-8 leading-relaxed">
                "QuickBite has transformed how we order food. Fast, reliable,
                and the food always arrives hot. Best food delivery service
                we've ever used!"
              </p>
              <div className="flex items-center justify-center gap-4">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-3xl">
                  👤
                </div>
                <div className="text-left">
                  <div className="font-bold text-lg">Sarah Johnson</div>
                  <div className="text-white/80">Regular Customer</div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* CTA Section */}
        <section className="max-w-screen-2xl mx-auto px-6 py-20">
          <motion.div
            className="text-center p-12 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-orange-200 dark:border-white/10 shadow-2xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-black mb-4">
              <span className="bg-gradient-to-r from-orange-600 to-pink-600 dark:from-orange-400 dark:to-pink-500 bg-clip-text text-transparent">
                Ready to Get Started?
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Join thousands of happy customers ordering delicious food every
              day
            </p>
            <Link
              to="/customer"
              className="inline-flex items-center gap-2 px-10 py-5 rounded-2xl bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-bold text-lg shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/50 transition-all duration-300 hover:scale-105"
            >
              <span>Start Ordering Now</span>
              <FaArrowRight />
            </Link>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
