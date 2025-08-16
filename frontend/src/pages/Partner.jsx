// src/pages/Partner.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navbar from "../components/Navbar";

export default function Partner() {
  return (
    <div className="min-h-screen flex flex-col bg-accent dark:bg-secondary text-secondary dark:text-accent transition-colors">
      {/* SEO */}
      <Helmet>
        <title>QuickBite | Partner with Us</title>
        <meta
          name="description"
          content="Join QuickBite as a restaurant partner and grow your business."
        />
      </Helmet>

      {/* Navbar */}
      <Navbar />

      {/* Hero */}
      <header className="relative w-full bg-primary text-white min-h-[70vh] py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent opacity-90" />
        <div className="relative z-10 max-w-screen-2xl mx-auto w-full px-4 sm:px-6 lg:px-12 flex flex-col lg:flex-row justify-between items-center gap-10">
          <div className="lg:w-1/2">
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 leading-tight">
              Partner with QuickBite & Grow Your Restaurant
            </h1>
            <p className="text-lg sm:text-xl mb-6">
              Join hundreds of top restaurants delivering delicious food to
              thousands of customers daily. Full control over your menu and
              orders.
            </p>
            <Link
              to="/partner/join"
              className="bg-accent text-primary px-6 py-3 rounded-full font-semibold shadow-brand hover:shadow-brand-lg transition"
            >
              Get Started
            </Link>
          </div>
          <div className="lg:w-1/2">
            <img
              src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=80"
              alt="Restaurant onboarding illustration"
              loading="lazy"
              decoding="async"
              className="rounded-xl shadow-brand-lg w-full object-cover"
            />
          </div>
        </div>
      </header>

      {/* Why Partner */}
      <section className="w-full bg-white dark:bg-secondary py-16 px-4 sm:px-6 lg:px-12">
        <div className="max-w-screen-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12 text-primary">
            Why Partner with QuickBite
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                icon: "💼",
                title: "Expand Your Reach",
                desc: "Get your restaurant in front of thousands of hungry customers.",
              },
              {
                icon: "📈",
                title: "Grow Revenue",
                desc: "Increase sales through online orders and optimized delivery management.",
              },
              {
                icon: "⚡",
                title: "Full Control",
                desc: "Manage your menu, prices, and orders easily from your dashboard.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-accent dark:bg-secondary p-8 rounded-xl shadow-brand hover:shadow-brand-lg transition"
              >
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-primary">
                  {item.title}
                </h3>
                <p className="text-secondary dark:text-accent">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="w-full bg-accent dark:bg-secondary py-16 px-4 sm:px-6 lg:px-12">
        <div className="max-w-screen-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12 text-primary">
            Onboarding in 3 Simple Steps
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                icon: "📝",
                title: "Sign Up",
                desc: "Provide your restaurant and owner details.",
              },
              {
                icon: "📄",
                title: "Verify",
                desc: "Upload licenses, FSSAI, PAN, and bank details.",
              },
              {
                icon: "🚀",
                title: "Start Receiving Orders",
                desc: "Get approved and go live on QuickBite.",
              },
            ].map((step, i) => (
              <div
                key={i}
                className="bg-white dark:bg-secondary p-8 rounded-xl shadow-brand hover:shadow-brand-lg transition"
              >
                <div className="text-5xl mb-4">{step.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-primary">
                  {step.title}
                </h3>
                <p className="text-secondary dark:text-accent">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full bg-primary text-white py-16 px-4 sm:px-6 lg:px-12 text-center">
        <h2 className="text-3xl font-bold mb-6">
          Ready to Grow Your Restaurant?
        </h2>
        <Link
          to="/partner/join"
          className="bg-accent text-primary px-8 py-4 rounded-full font-semibold shadow-brand hover:shadow-brand-lg transition"
        >
          Get Started Now
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-secondary py-10 w-full">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12 flex flex-col md:flex-row justify-between items-center">
          <p className="text-secondary dark:text-accent mb-4 md:mb-0 text-center md:text-left">
            © {new Date().getFullYear()} QuickBite. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
