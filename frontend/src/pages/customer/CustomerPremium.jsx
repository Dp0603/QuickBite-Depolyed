import React, { useState } from "react";
import { FaStar, FaTruck, FaTags, FaHeadset, FaCrown } from "react-icons/fa";

const CustomerPremium = () => {
  const [selectedPlan, setSelectedPlan] = useState("monthly");

  const handleSubscribe = () => {
    alert(`🎉 Subscribed to the ${selectedPlan} plan!`);
  };

  return (
    <div className="p-6 text-gray-800 dark:text-white">
      {/* Header Section */}
      <div className="text-center mb-10 animate-fade-in">
        <img
          src="/QuickBite.png"
          alt="QuickBite Premium"
          className="w-20 h-20 mx-auto mb-4"
        />
        <h1 className="text-4xl font-extrabold mb-2 text-primary tracking-tight">
          Go Premium with QuickBite
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
          Unlock a superior ordering experience with fast delivery, exclusive
          discounts, and VIP support.
        </p>
      </div>

      {/* Benefits */}
      <section className="grid md:grid-cols-2 gap-6 mb-12 max-w-5xl mx-auto animate-fade-in">
        <Benefit icon={<FaTruck />} label="Unlimited Free Deliveries" />
        <Benefit icon={<FaTags />} label="Exclusive Member-Only Offers" />
        <Benefit icon={<FaHeadset />} label="24×7 VIP Support Access" />
        <Benefit icon={<FaCrown />} label="Premium Badge on Your Profile" />
      </section>

      {/* Plan Section */}
      <div className="max-w-4xl mx-auto animate-fade-in">
        <h2 className="text-2xl font-semibold text-center mb-6 text-primary">
          Choose Your Premium Plan
        </h2>
        <div className="grid sm:grid-cols-2 gap-6">
          <PlanCard
            title="Monthly Plan"
            price="₹199"
            selected={selectedPlan === "monthly"}
            onSelect={() => setSelectedPlan("monthly")}
          />
          <PlanCard
            title="Yearly Plan"
            price="₹1999"
            highlight="Save 20%"
            selected={selectedPlan === "yearly"}
            onSelect={() => setSelectedPlan("yearly")}
          />
        </div>

        <ul className="mt-8 text-sm text-gray-600 dark:text-gray-400 list-disc pl-6 max-w-xl mx-auto space-y-1">
          <li>No delivery charges, ever.</li>
          <li>Save up to ₹500/month with offers.</li>
          <li>Priority access to new features.</li>
        </ul>

        <div className="text-center mt-10">
          <button
            onClick={handleSubscribe}
            className="bg-gradient-to-r from-primary to-orange-500 hover:brightness-110 text-white font-semibold px-8 py-3 rounded-2xl shadow-md transition-all text-lg"
          >
            Subscribe Now
          </button>
          <p className="text-xs text-gray-500 mt-2 dark:text-gray-400">
            Secure payment powered by Razorpay
          </p>
        </div>
      </div>
    </div>
  );
};

// Benefit box with icon + label
const Benefit = ({ icon, label }) => (
  <div className="flex items-center gap-4 bg-white dark:bg-secondary p-5 rounded-xl shadow-md border dark:border-gray-700 transition hover:scale-[1.02]">
    <div className="text-primary text-3xl">{icon}</div>
    <p className="font-medium text-lg">{label}</p>
  </div>
);

// Premium plan card
const PlanCard = ({ title, price, highlight, selected, onSelect }) => (
  <div
    className={`relative p-6 border rounded-2xl cursor-pointer transition-all shadow-md bg-white dark:bg-secondary hover:scale-[1.02] ${
      selected
        ? "border-primary ring-2 ring-primary"
        : "border-gray-200 dark:border-gray-700"
    }`}
    onClick={onSelect}
  >
    {selected && (
      <div className="absolute -top-3 -right-3 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full shadow-sm">
        Selected
      </div>
    )}
    <div className="flex justify-between items-center mb-2">
      <h3 className="text-xl font-bold text-secondary dark:text-white">
        {title}
      </h3>
      {highlight && (
        <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full">
          {highlight}
        </span>
      )}
    </div>
    <p className="text-4xl font-bold text-primary">{price}</p>
    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
      Full access to premium perks
    </p>
  </div>
);

export default CustomerPremium;
