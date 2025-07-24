import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors">
      {/* SEO Meta Tags */}
      <Helmet>
        <title>QuickBite | Order Food Online</title>
        <meta
          name="description"
          content="Get food delivered from top-rated restaurants at your doorstep. Try QuickBite now!"
        />
      </Helmet>

      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <header className="relative w-full bg-primary text-white min-h-[80vh] py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent opacity-90" />
        <div className="relative z-10 max-w-screen-2xl mx-auto w-full px-4 sm:px-6 lg:px-12 flex flex-col lg:flex-row justify-between items-center gap-10">
          <div className="lg:w-1/2">
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 leading-tight">
              Hungry? Let us deliver happiness.
            </h1>
            <p className="text-lg sm:text-xl mb-6">
              Order from top-rated restaurants, delivered hot and fresh to your
              door.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/login"
                className="bg-white text-primary px-6 py-3 rounded-full font-semibold shadow hover:bg-gray-200 transition"
              >
                Get Started
              </Link>
              <Link
                to="/customer"
                className="border border-white text-white px-6 py-3 rounded-full hover:bg-white hover:text-primary transition"
              >
                Browse as Guest
              </Link>
            </div>
          </div>
          <div className="lg:w-1/2">
            <img
              src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=80"
              alt="Delicious food on a plate"
              loading="lazy"
              decoding="async"
              className="rounded-xl shadow-xl w-full object-cover"
            />
          </div>
        </div>
      </header>

      {/* How It Works */}
      <section className="w-full bg-white dark:bg-gray-800 py-16 px-4 sm:px-6 lg:px-12">
        <div className="max-w-screen-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12 text-secondary">
            How It Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                icon: "🍽️",
                title: "Choose Restaurant",
                desc: "Browse top-rated eateries in your area.",
              },
              {
                icon: "🛒",
                title: "Place Your Order",
                desc: "Customize your meal and checkout easily.",
              },
              {
                icon: "🚚",
                title: "Track & Enjoy",
                desc: "Follow your delivery in real-time.",
              },
            ].map((step, i) => (
              <div
                key={i}
                className="bg-gray-100 dark:bg-gray-900 p-8 rounded-xl shadow hover:shadow-lg transition"
              >
                <div
                  className="text-5xl mb-4"
                  role="img"
                  aria-label={step.title}
                >
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-primary">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Restaurants */}
      <section className="w-full bg-gray-100 dark:bg-gray-800 py-16 px-4 sm:px-6 lg:px-12">
        <div className="max-w-screen-2xl mx-auto">
          <h2 className="text-3xl font-bold text-secondary mb-12 text-center">
            Popular Restaurants
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Urban Bites",
                types: "Fast Food, Burgers",
                rating: "4.5",
                img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80",
              },
              {
                name: "Spice Villa",
                types: "Indian, Curry",
                rating: "4.7",
                img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=600&q=80",
              },
              {
                name: "Green Bowl",
                types: "Healthy, Vegan",
                rating: "4.6",
                img: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=600&q=80",
              },
            ].map((r, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden hover:scale-[1.02] hover:shadow-xl hover:brightness-105 transition"
              >
                <img
                  src={r.img}
                  alt={`${r.name} preview`}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-48 object-cover"
                />
                <div className="p-6 text-center">
                  <h3 className="text-xl font-semibold text-primary">
                    {r.name}
                  </h3>
                  <p className="text-secondary dark:text-gray-300">{r.types}</p>
                  <span className="text-gray-500 text-sm">⭐ {r.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 py-10 w-full">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4 md:mb-0 text-center md:text-left">
            © {new Date().getFullYear()} QuickBite. All rights reserved.
          </p>
          <div className="flex gap-4 justify-center md:justify-end">
            {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map(
              (Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary transition"
                  aria-label={`Social ${i}`}
                >
                  <Icon size={18} />
                </a>
              )
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
