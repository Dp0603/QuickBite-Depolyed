import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-primary text-white py-16 px-4 text-center rounded-lg shadow mb-10">
        <h1 className="text-5xl font-extrabold mb-4">Welcome to QuickBite</h1>
        <p className="text-xl mb-8">
          Order food from your favorite restaurants and get it delivered fast!
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/login"
            className="inline-block bg-white text-primary font-semibold px-8 py-3 rounded shadow hover:bg-accent hover:text-white transition"
          >
            Get Started
          </Link>
          <Link
            to="/customer"
            className="inline-block bg-accent text-secondary font-semibold px-8 py-3 rounded shadow hover:bg-white hover:text-primary transition"
          >
            Browse as Guest
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-4xl mx-auto mb-12">
        <h2 className="text-2xl font-bold text-secondary mb-6 text-center">
          How It Works
        </h2>
        <div className="flex flex-col md:flex-row justify-center gap-8">
          <div className="flex-1 bg-white rounded-lg shadow p-6">
            <span className="text-3xl font-bold text-primary">1</span>
            <h4 className="font-semibold mt-2 mb-1">Browse Restaurants</h4>
            <p className="text-gray-600">
              Find your favorite food from top-rated restaurants.
            </p>
          </div>
          <div className="flex-1 bg-white rounded-lg shadow p-6">
            <span className="text-3xl font-bold text-primary">2</span>
            <h4 className="font-semibold mt-2 mb-1">Place Your Order</h4>
            <p className="text-gray-600">
              Add items to your cart and checkout securely.
            </p>
          </div>
          <div className="flex-1 bg-white rounded-lg shadow p-6">
            <span className="text-3xl font-bold text-primary">3</span>
            <h4 className="font-semibold mt-2 mb-1">Track Delivery</h4>
            <p className="text-gray-600">
              Get real-time updates until your food arrives.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Restaurants */}
      <section className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-secondary mb-6">
          Popular Restaurants
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sample Restaurant Card */}
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center hover:scale-105 transition cursor-pointer">
            <img
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80"
              alt="Restaurant"
              className="w-32 h-32 object-cover rounded-full mb-4"
            />
            <h3 className="text-lg font-semibold text-primary mb-2">
              Urban Bites
            </h3>
            <p className="text-secondary mb-2">Fast Food, Burgers, Fries</p>
            <span className="text-sm text-gray-500">⭐ 4.5</span>
          </div>
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center hover:scale-105 transition cursor-pointer">
            <img
              src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=400&q=80"
              alt="Restaurant"
              className="w-32 h-32 object-cover rounded-full mb-4"
            />
            <h3 className="text-lg font-semibold text-primary mb-2">
              Spice Villa
            </h3>
            <p className="text-secondary mb-2">Indian, Curry, Tandoori</p>
            <span className="text-sm text-gray-500">⭐ 4.7</span>
          </div>
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center hover:scale-105 transition cursor-pointer">
            <img
              src="https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80"
              alt="Restaurant"
              className="w-32 h-32 object-cover rounded-full mb-4"
            />
            <h3 className="text-lg font-semibold text-primary mb-2">
              Green Bowl
            </h3>
            <p className="text-secondary mb-2">Healthy, Salads, Vegan</p>
            <span className="text-sm text-gray-500">⭐ 4.6</span>
          </div>
        </div>
      </section>
    </div>
  );
}