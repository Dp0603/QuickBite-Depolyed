// src/pages/customer/CustomerPremiumLanding.jsx
import React from "react";
import CustomerPremiumTile from "./CustomerPremiumTile";

const CustomerPremiumLanding = ({ plans, billingPeriod, setBillingPeriod }) => {
  return (
    <div className="max-w-6xl mx-auto">
      <section className="mb-8">
        <h2 className="text-3xl font-extrabold mb-3">Why upgrade?</h2>
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <CustomerPremiumTile
            icon="🚚"
            title="Unlimited Free Delivery"
            desc="Order as often as you like without delivery fees."
          />
          <CustomerPremiumTile
            icon="🎁"
            title="Exclusive Discounts"
            desc="Special offers and partner deals."
          />
          <CustomerPremiumTile
            icon="📞"
            title="24×7 VIP Support"
            desc="Always-on assistance for any need."
          />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Choose Your Plan</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.planName}
              className="p-6 border rounded-2xl shadow bg-white dark:bg-secondary"
            >
              <h3 className="text-xl font-bold">{plan.planName}</h3>
              <div className="text-2xl font-semibold mt-1">₹{plan.price}</div>
              <p className="text-sm text-gray-500">
                Valid for {plan.durationInDays} days
              </p>
              <ul className="mb-4 space-y-1 text-sm mt-2">
                {plan.perks.map((perk, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-green-600">✔</span>
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full px-4 py-2 rounded-lg bg-primary text-white font-semibold hover:brightness-95 transition">
                Subscribe
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default CustomerPremiumLanding;
