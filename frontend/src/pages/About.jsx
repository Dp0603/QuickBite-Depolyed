import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaRocket,
  FaStar,
  FaCreditCard,
  FaGift,
  FaMapMarkedAlt,
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function About() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-white/50 to-white/10 dark:from-slate-900 dark:to-slate-950">
        <section className="max-w-screen-2xl mx-auto px-6 py-16 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-2 items-center">
            <motion.div
              initial={{ x: -40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-6"
            >
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-pink-600">
                About QuickBite
              </h1>
              <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl">
                QuickBite is built to bring the best restaurants to your door —
                fast, fresh and reliable. We partner with local chefs and
                eateries to deliver a premium ordering experience with secure
                payments, live tracking and curated offers.
              </p>

              <div className="grid grid-cols-2 gap-4 mt-6">
                {[
                  { icon: <FaRocket />, title: "Fast Delivery" },
                  { icon: <FaStar />, title: "Top Restaurants" },
                  { icon: <FaCreditCard />, title: "Secure Payment" },
                  { icon: <FaGift />, title: "Rewards & Offers" },
                ].map((f, i) => (
                  <motion.div
                    key={i}
                    initial={{ y: 12, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.12 * i, duration: 0.5, ease: "easeOut" }}
                    whileHover={{ scale: 1.03, rotate: 1 }}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-br from-white/80 dark:from-slate-800/60 border border-white/10 shadow-sm"
                  >
                    <div className="p-2 rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 text-white w-10 h-10 flex items-center justify-center shadow">
                      {f.icon}
                    </div>
                    <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                      {f.title}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 flex gap-3">
                <Link
                  to="/restaurants"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold shadow hover:scale-105 transition"
                >
                  Explore Restaurants
                </Link>
                <Link
                  to="/partner"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 bg-transparent text-gray-800 dark:text-gray-200 hover:bg-white/5 transition"
                >
                  Partner with Us
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                <img
                  src="/about-hero.jpg"
                  alt="Delicious food"
                  className="w-full h-80 object-cover"
                  onError={(e) => (e.target.style.display = "none")}
                />
              </div>

              <div className="mt-5 grid grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-white/80 dark:bg-slate-800/60 border border-white/10 shadow">
                  <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-pink-600">
                    500+
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-300">Restaurants</div>
                </div>
                <div className="p-4 rounded-xl bg-white/80 dark:bg-slate-800/60 border border-white/10 shadow">
                  <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-pink-600">
                    50K+
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-300">Orders</div>
                </div>
                <div className="p-4 rounded-xl bg-white/80 dark:bg-slate-800/60 border border-white/10 shadow">
                  <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-pink-600">
                    4.8★
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-300">Average Rating</div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}