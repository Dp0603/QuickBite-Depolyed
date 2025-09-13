import React from "react";
import { motion } from "framer-motion";
import {
  FaTruck,
  FaTags,
  FaHeadset,
  FaStar,
  FaGift,
  FaQuestionCircle,
} from "react-icons/fa";

// Format currency utility (same as in main)
const formatCurrency = (v) => `₹${v.toLocaleString("en-IN")}`;

// Billing toggle UI (optional: can extract to own file)
const BillingToggle = ({ billingPeriod = "yearly", setBillingPeriod }) => (
  <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-full">
    <button
      onClick={() => setBillingPeriod("monthly")}
      className={`px-3 py-1 rounded-full text-sm ${
        billingPeriod === "monthly" ? "bg-white dark:bg-primary/20 shadow" : ""
      }`}
    >
      Monthly
    </button>
    <button
      onClick={() => setBillingPeriod("yearly")}
      className={`px-3 py-1 rounded-full text-sm ${
        billingPeriod === "yearly" ? "bg-white dark:bg-primary/20 shadow" : ""
      }`}
    >
      Yearly
    </button>
  </div>
);

const BenefitTile = ({ icon, title, desc }) => (
  <div className="flex flex-col items-center text-center p-4 bg-white dark:bg-secondary rounded-xl shadow transition hover:scale-[1.03]">
    <div className="text-4xl text-primary mb-2">{icon}</div>
    <div className="font-bold mb-1">{title}</div>
    <div className="text-sm text-gray-600 dark:text-gray-400">{desc}</div>
  </div>
);

const ComparisonTable = () => (
  <div className="mt-12">
    <h2 className="text-2xl font-semibold mb-4">Compare Plans</h2>
    <table className="w-full border">
      <thead>
        <tr>
          <th className="p-2 border">Feature</th>
          <th className="p-2 border">Free</th>
          <th className="p-2 border">Premium</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="p-2 border">Delivery Fee</td>
          <td className="p-2 border">Chargeable</td>
          <td className="p-2 border">Free</td>
        </tr>
        <tr>
          <td className="p-2 border">Support</td>
          <td className="p-2 border">Standard</td>
          <td className="p-2 border">VIP 24×7</td>
        </tr>
      </tbody>
    </table>
  </div>
);

const Testimonials = () => {
  const items = [
    {
      name: "Priya",
      text: "QuickBite Premium has saved me so much on delivery fees!",
    },
    { name: "Ravi", text: "The VIP support is worth every rupee." },
    { name: "Anita", text: "Exclusive discounts make it totally worth it." },
  ];

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-semibold mb-4">What Members Say</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {items.map((t) => (
          <div
            key={t.name}
            className="p-4 bg-white dark:bg-secondary rounded-xl shadow"
          >
            <FaStar className="text-yellow-500 mb-2" />
            <p className="italic">"{t.text}"</p>
            <div className="mt-2 font-bold">- {t.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const FAQ = () => (
  <div className="mt-12">
    <h2 className="text-2xl font-semibold mb-4">FAQs</h2>
    <div>
      <FAQItem
        q="Can I cancel anytime?"
        a="Yes, you can cancel your subscription anytime."
      />
      <FAQItem
        q="Do I get a refund?"
        a="Refunds are only provided if cancellation occurs within 7 days."
      />
    </div>
  </div>
);

const FAQItem = ({ q, a }) => (
  <div className="mb-4">
    <div className="font-bold flex items-center gap-2">
      <FaQuestionCircle /> {q}
    </div>
    <p className="text-sm text-gray-600 dark:text-gray-400 ml-6">{a}</p>
  </div>
);

const CustomerPremiumLanding = ({
  plans,
  billingPeriod,
  setBillingPeriod,
  onSubscribe,
}) => (
  <div className="max-w-6xl mx-auto animate-fade-in">
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl p-8 mb-8 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 text-white shadow-lg"
    >
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6 items-center">
        <div>
          <h1 className="text-4xl font-extrabold mb-2">
            Upgrade to{" "}
            <span className="underline decoration-yellow-300">
              QuickBite Premium
            </span>
          </h1>
          <p className="opacity-90 mb-4">
            Free deliveries, priority support and exclusive partner offers —
            built for frequent food lovers.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => window.scrollTo({ top: 600, behavior: "smooth" })}
              className="bg-white text-black px-5 py-3 rounded-full font-semibold shadow hover:brightness-95"
            >
              Get Premium
            </button>
            <button
              onClick={() => window.location.assign("/customer/offers")}
              className="bg-transparent border border-white px-4 py-3 rounded-full hover:bg-white/10"
            >
              See Offers
            </button>
          </div>
          <div className="mt-4 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <FaStar /> <div className="text-sm">Rated 4.8 by members</div>
            </div>
            <div className="flex items-center gap-2">
              <FaGift /> <div className="text-sm">Free priority deliveries</div>
            </div>
          </div>
        </div>
        <div className="hidden md:block">
          <div className="h-40 rounded-lg bg-white/20 border border-white/10 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold">Premium Illustration</div>
              <div className="text-sm mt-1">
                Happy customers & speedy deliveries
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>

    {/* Benefits */}
    <section className="mb-8">
      <h2 className="text-3xl font-extrabold mb-3">Why upgrade?</h2>
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <BenefitTile
          icon={<FaTruck />}
          title="Unlimited Free Delivery"
          desc="Order as often as you like without delivery fees."
        />
        <BenefitTile
          icon={<FaTags />}
          title="Exclusive Member Discounts"
          desc="Special offers and partner deals."
        />
        <BenefitTile
          icon={<FaHeadset />}
          title="24×7 VIP Support"
          desc="Always-on assistance for any need."
        />
      </div>
    </section>

    {/* Plans */}
    <section className="mb-8" id="plans">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Choose Your Plan</h2>
        <BillingToggle
          billingPeriod={billingPeriod}
          setBillingPeriod={setBillingPeriod}
        />
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <motion.div
            whileHover={{ scale: 1.02 }}
            key={plan.planName}
            className="p-6 border rounded-2xl shadow hover:scale-[1.03] transition cursor-pointer bg-white dark:bg-secondary"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-bold text-primary">
                {plan.planName}
              </h3>
              {plan.tier === "Gold" && billingPeriod === "yearly" && (
                <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                  Most Popular
                </span>
              )}
            </div>
            <div className="text-2xl font-semibold">
              {formatCurrency(plan.price)}
            </div>
            <p className="text-sm text-gray-500 mb-3">
              Valid for {plan.durationInDays} days
            </p>
            <ul className="mb-4 space-y-1 text-sm">
              {plan.perks.map((perk, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="text-green-600">✔</span>
                  <span>{perk}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => onSubscribe(plan)}
              className="w-full px-4 py-2 rounded-lg bg-primary text-white font-semibold hover:brightness-95 transition"
            >
              Subscribe
            </button>
          </motion.div>
        ))}
      </div>
    </section>

    <ComparisonTable />
    <Testimonials />
    <FAQ />
  </div>
);

export default CustomerPremiumLanding;
