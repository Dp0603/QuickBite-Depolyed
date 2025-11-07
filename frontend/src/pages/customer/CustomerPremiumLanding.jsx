import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTruck,
  FaTags,
  FaHeadset,
  FaStar,
  FaGift,
  FaQuestionCircle,
  FaCrown,
  FaBolt,
  FaCheckCircle,
  FaFire,
  FaRocket,
  FaChevronDown,
  FaChevronUp,
  FaArrowRight,
  FaShieldAlt,
} from "react-icons/fa";

// Format currency utility
const formatCurrency = (v) => `₹${v.toLocaleString("en-IN")}`;

// Billing Toggle
const BillingToggle = ({ billingPeriod = "yearly", setBillingPeriod }) => (
  <div className="inline-flex items-center gap-1 bg-white dark:bg-slate-900 p-1.5 rounded-2xl shadow-lg border-2 border-orange-200 dark:border-white/10">
    <motion.button
      onClick={() => setBillingPeriod("monthly")}
      className={`relative px-6 py-2.5 rounded-xl font-bold transition-all ${
        billingPeriod === "monthly"
          ? "text-white"
          : "text-gray-700 dark:text-gray-300"
      }`}
      whileTap={{ scale: 0.95 }}
    >
      {billingPeriod === "monthly" && (
        <motion.div
          layoutId="billingBg"
          className="absolute inset-0 bg-gradient-to-r from-orange-500 to-pink-600 rounded-xl"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
      <span className="relative z-10">Monthly</span>
    </motion.button>
    <motion.button
      onClick={() => setBillingPeriod("yearly")}
      className={`relative px-6 py-2.5 rounded-xl font-bold transition-all ${
        billingPeriod === "yearly"
          ? "text-white"
          : "text-gray-700 dark:text-gray-300"
      }`}
      whileTap={{ scale: 0.95 }}
    >
      {billingPeriod === "yearly" && (
        <motion.div
          layoutId="billingBg"
          className="absolute inset-0 bg-gradient-to-r from-orange-500 to-pink-600 rounded-xl"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
      <span className="relative z-10 flex items-center gap-2">
        Yearly
        <span className="px-2 py-0.5 rounded-full bg-green-500 text-white text-xs">
          Save 20%
        </span>
      </span>
    </motion.button>
  </div>
);

// Benefit Tile
const BenefitTile = ({ icon, title, desc, gradient, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="group relative"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

    <div className="relative p-6 rounded-3xl bg-white dark:bg-slate-900 border border-orange-200 dark:border-white/10 shadow-md hover:shadow-xl transition-all duration-300">
      <div className="flex flex-col items-center text-center">
        <div
          className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-3xl mb-4 shadow-lg group-hover:scale-110 transition-transform`}
        >
          {icon}
        </div>
        <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">
          {title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{desc}</p>
      </div>
    </div>
  </motion.div>
);

// Plan Card
const PlanCard = ({ plan, onSubscribe, billingPeriod, index }) => {
  const isPopular = plan.tier === "Gold" && billingPeriod === "yearly";

  const monthlyEquivalent =
    plan.monthlyPrice * (billingPeriod === "yearly" ? 12 : 1);
  const savings = Math.max(0, monthlyEquivalent - plan.price);

  const tierConfig = {
    Gold: {
      icon: FaCrown,
      gradient: "from-yellow-400 to-orange-500",
      shadow: "shadow-yellow-500/30",
    },
    Platinum: {
      icon: FaFire,
      gradient: "from-slate-400 to-gray-600",
      shadow: "shadow-slate-500/30",
    },
    Diamond: {
      icon: FaStar,
      gradient: "from-cyan-400 to-blue-600",
      shadow: "shadow-cyan-500/30",
    },
  };

  const config = tierConfig[plan.tier] || tierConfig.Gold;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative h-full"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <div
        className={`relative flex flex-col h-full p-6 rounded-3xl bg-white dark:bg-slate-900 border shadow-md hover:shadow-xl transition-all duration-300 ${
          isPopular
            ? "border-yellow-500 ring-2 ring-yellow-500/30 scale-105"
            : "border-orange-200 dark:border-white/10"
        }`}
      >
        {/* Popular Badge */}
        {isPopular && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold shadow-lg">
              <FaFire /> Most Popular
            </span>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center gap-3 mb-4 pt-2">
          <div
            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center text-white shadow-lg ${config.shadow}`}
          >
            <Icon className="text-xl" />
          </div>
          <h3 className="text-2xl font-black bg-gradient-to-r from-orange-600 to-pink-600 dark:from-orange-400 dark:to-pink-500 bg-clip-text text-transparent">
            {plan.planName}
          </h3>
        </div>

        {/* Price */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-gray-900 dark:text-white">
              {formatCurrency(plan.price)}
            </span>
            <span className="text-gray-500 dark:text-gray-400">
              /{billingPeriod === "yearly" ? "year" : "month"}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Valid for {plan.durationInDays} days
          </p>
        </div>

        {/* Savings Badge */}
        {savings > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="mb-4 p-3 rounded-xl bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-500/30"
          >
            <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
              <FaBolt className="text-green-600 dark:text-green-400" />
              <span className="font-bold text-sm">
                Save {formatCurrency(savings)}
              </span>
            </div>
          </motion.div>
        )}

        {/* Perks */}
        <ul className="mb-6 space-y-3 flex-grow">
          {plan.perks.map((perk, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i + index * 0.1 }}
              className="flex items-start gap-3"
            >
              <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <FaCheckCircle className="text-green-600 dark:text-green-400 text-xs" />
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {perk}
              </span>
            </motion.li>
          ))}
        </ul>

        {/* CTA Button stays at bottom */}
        <motion.button
          onClick={() => onSubscribe(plan)}
          className="mt-auto w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Subscribe Now
          <FaArrowRight />
        </motion.button>
      </div>
    </motion.div>
  );
};

// Comparison Table
const ComparisonTable = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.5 }}
    className="relative"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-50"></div>

    <div className="relative p-6 rounded-3xl bg-white dark:bg-slate-900 border border-orange-200 dark:border-white/10 shadow-xl overflow-hidden">
      <h2 className="text-3xl font-black bg-gradient-to-r from-orange-600 to-pink-600 dark:from-orange-400 dark:to-pink-500 bg-clip-text text-transparent mb-6">
        Compare Plans
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200 dark:border-gray-700">
              <th className="text-left p-4 font-bold text-gray-900 dark:text-white">
                Feature
              </th>
              <th className="text-center p-4 font-bold text-gray-900 dark:text-white">
                Free
              </th>
              <th className="text-center p-4 font-bold bg-gradient-to-r from-orange-600 to-pink-600 dark:from-orange-400 dark:to-pink-500 bg-clip-text text-transparent">
                Premium
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              {
                feature: "Delivery Fee",
                free: "₹40 per order",
                premium: "FREE",
              },
              { feature: "Support", free: "Standard", premium: "VIP 24×7" },
              {
                feature: "Discounts",
                free: "Public offers",
                premium: "Exclusive",
              },
              { feature: "Priority Delivery", free: "❌", premium: "✅" },
              { feature: "Cashback", free: "❌", premium: "✅" },
            ].map((row, i) => (
              <motion.tr
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <td className="p-4 font-semibold text-gray-700 dark:text-gray-300">
                  {row.feature}
                </td>
                <td className="p-4 text-center text-gray-600 dark:text-gray-400">
                  {row.free}
                </td>
                <td className="p-4 text-center font-bold text-green-600 dark:text-green-400">
                  {row.premium}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </motion.div>
);

// Testimonials
const Testimonials = () => {
  const items = [
    {
      name: "Priya Sharma",
      text: "QuickBite Premium has saved me so much on delivery fees! Best investment ever.",
      rating: 5,
      avatar: "https://i.pravatar.cc/100?img=1",
    },
    {
      name: "Ravi Kumar",
      text: "The VIP support is worth every rupee. They solve issues instantly!",
      rating: 5,
      avatar: "https://i.pravatar.cc/100?img=12",
    },
    {
      name: "Anita Desai",
      text: "Exclusive discounts make it totally worth it. I order guilt-free now!",
      rating: 5,
      avatar: "https://i.pravatar.cc/100?img=5",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <h2 className="text-3xl font-black bg-gradient-to-r from-orange-600 to-pink-600 dark:from-orange-400 dark:to-pink-500 bg-clip-text text-transparent mb-6 flex items-center gap-3">
        <FaStar className="text-yellow-500" />
        What Members Say
      </h2>
      <div className="grid md:grid-cols-3 gap-6">
        {items.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * i }}
            className="group relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="relative p-6 rounded-3xl bg-white dark:bg-slate-900 border border-orange-200 dark:border-white/10 shadow-md hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-1 mb-3">
                {[...Array(t.rating)].map((_, i) => (
                  <FaStar key={i} className="text-yellow-500" />
                ))}
              </div>
              <p className="italic text-gray-700 dark:text-gray-300 mb-4">
                "{t.text}"
              </p>
              <div className="flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-12 h-12 rounded-full border-2 border-orange-200 dark:border-white/10"
                />
                <div>
                  <div className="font-bold text-gray-900 dark:text-white">
                    {t.name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Premium Member
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// FAQ Item
const FAQItem = ({ q, a, index }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="mb-4"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left p-5 rounded-2xl bg-white dark:bg-slate-900 border border-orange-200 dark:border-white/10 shadow-md hover:shadow-lg transition-all flex items-center justify-between group"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center text-white flex-shrink-0">
            <FaQuestionCircle />
          </div>
          <span className="font-bold text-gray-900 dark:text-white">{q}</span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-orange-500"
        >
          <FaChevronDown />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-5 ml-11 text-gray-600 dark:text-gray-400">
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// FAQ Section
const FAQ = () => {
  const faqs = [
    {
      q: "Can I cancel anytime?",
      a: "Yes, you can cancel your subscription anytime from your account settings. Your benefits will continue until the end of your current billing period.",
    },
    {
      q: "Do I get a refund if I cancel?",
      a: "Refunds are only provided if cancellation occurs within 7 days of purchase and you haven't used any premium benefits.",
    },
    {
      q: "How does free delivery work?",
      a: "Once you subscribe to Premium, all delivery fees are automatically waived on every order. No minimum order value required!",
    },
    {
      q: "Can I share my Premium benefits?",
      a: "Premium benefits are linked to your account and cannot be shared. Each user needs their own subscription.",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
    >
      <h2 className="text-3xl font-black bg-gradient-to-r from-orange-600 to-pink-600 dark:from-orange-400 dark:to-pink-500 bg-clip-text text-transparent mb-6">
        Frequently Asked Questions
      </h2>
      <div>
        {faqs.map((faq, i) => (
          <FAQItem key={i} q={faq.q} a={faq.a} index={i} />
        ))}
      </div>
    </motion.div>
  );
};

// Main Component
const CustomerPremiumLanding = ({
  plans,
  billingPeriod,
  setBillingPeriod,
  onSubscribe,
}) => {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative mb-12 overflow-hidden rounded-3xl shadow-2xl border border-orange-200 dark:border-white/10"
      >
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-pink-600 to-purple-600"></div>
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>

        {/* Content */}
        <div className="relative z-10 p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-white">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-6"
              >
                <FaRocket className="text-yellow-300" />
                <span className="font-bold">Unlock Premium Benefits</span>
              </motion.div>

              <h1 className="text-5xl md:text-6xl font-black mb-4 drop-shadow-lg">
                Upgrade to{" "}
                <span className="bg-gradient-to-r from-yellow-300 to-white bg-clip-text text-transparent">
                  QuickBite Premium
                </span>
              </h1>
              <p className="text-xl text-white/90 mb-6 leading-relaxed">
                Free deliveries, priority support and exclusive partner offers —
                built for frequent food lovers.
              </p>

              <div className="flex flex-wrap gap-4 mb-6">
                <motion.button
                  onClick={() =>
                    document
                      .getElementById("plans")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-orange-600 font-bold shadow-lg hover:shadow-xl transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Premium
                  <FaArrowRight />
                </motion.button>
                <motion.button
                  onClick={() => (window.location.href = "/customer/offers")}
                  className="flex items-center gap-2 px-8 py-4 rounded-xl bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white font-bold hover:bg-white/30 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaTags />
                  See Offers
                </motion.button>
              </div>

              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <FaStar className="text-yellow-300" />
                  <span className="font-semibold">Rated 4.8 by members</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaShieldAlt className="text-green-300" />
                  <span className="font-semibold">30-day guarantee</span>
                </div>
              </div>
            </div>

            {/* Illustration */}
            <div className="hidden md:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-white rounded-3xl blur-2xl opacity-20"></div>
                <div className="relative p-8 rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20">
                  <div className="text-center text-white">
                    <div className="text-8xl mb-4">👑</div>
                    <div className="text-2xl font-bold mb-2">
                      Join 10,000+ Members
                    </div>
                    <div className="text-white/80">
                      Enjoying premium benefits daily
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Benefits */}
      <section className="mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-black bg-gradient-to-r from-orange-600 to-pink-600 dark:from-orange-400 dark:to-pink-500 bg-clip-text text-transparent mb-8"
        >
          Why Upgrade to Premium?
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-6">
          <BenefitTile
            icon={<FaTruck />}
            title="Unlimited Free Delivery"
            desc="Order as often as you like without delivery fees. Save on every order!"
            gradient="from-blue-500 to-cyan-600"
            delay={0.1}
          />
          <BenefitTile
            icon={<FaTags />}
            title="Exclusive Member Discounts"
            desc="Special offers and partner deals available only to Premium members."
            gradient="from-purple-500 to-pink-600"
            delay={0.2}
          />
          <BenefitTile
            icon={<FaHeadset />}
            title="24×7 VIP Support"
            desc="Always-on assistance for any need. Your satisfaction is our priority."
            gradient="from-orange-500 to-pink-600"
            delay={0.3}
          />
        </div>
      </section>

      {/* Plans */}
      <section className="mb-12" id="plans">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <h2 className="text-4xl font-black bg-gradient-to-r from-orange-600 to-pink-600 dark:from-orange-400 dark:to-pink-500 bg-clip-text text-transparent">
            Choose Your Plan
          </h2>
          <BillingToggle
            billingPeriod={billingPeriod}
            setBillingPeriod={setBillingPeriod}
          />
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <PlanCard
              key={plan.planName}
              plan={plan}
              onSubscribe={onSubscribe}
              billingPeriod={billingPeriod}
              index={i}
            />
          ))}
        </div>
      </section>

      {/* Comparison Table */}
      <section className="mb-12">
        <ComparisonTable />
      </section>

      {/* Testimonials */}
      <section className="mb-12">
        <Testimonials />
      </section>

      {/* FAQ */}
      <section className="mb-12">
        <FAQ />
      </section>
    </div>
  );
};

export default CustomerPremiumLanding;

//old
// import React from "react";
// import { motion } from "framer-motion";
// import {
//   FaTruck,
//   FaTags,
//   FaHeadset,
//   FaStar,
//   FaGift,
//   FaQuestionCircle,
// } from "react-icons/fa";

// // Format currency utility (same as in main)
// const formatCurrency = (v) => `₹${v.toLocaleString("en-IN")}`;

// // Billing toggle UI (optional: can extract to own file)
// const BillingToggle = ({ billingPeriod = "yearly", setBillingPeriod }) => (
//   <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-full">
//     <button
//       onClick={() => setBillingPeriod("monthly")}
//       className={`px-3 py-1 rounded-full text-sm ${
//         billingPeriod === "monthly" ? "bg-white dark:bg-primary/20 shadow" : ""
//       }`}
//     >
//       Monthly
//     </button>
//     <button
//       onClick={() => setBillingPeriod("yearly")}
//       className={`px-3 py-1 rounded-full text-sm ${
//         billingPeriod === "yearly" ? "bg-white dark:bg-primary/20 shadow" : ""
//       }`}
//     >
//       Yearly
//     </button>
//   </div>
// );

// const BenefitTile = ({ icon, title, desc }) => (
//   <div className="flex flex-col items-center text-center p-4 bg-white dark:bg-secondary rounded-xl shadow transition hover:scale-[1.03]">
//     <div className="text-4xl text-primary mb-2">{icon}</div>
//     <div className="font-bold mb-1">{title}</div>
//     <div className="text-sm text-gray-600 dark:text-gray-400">{desc}</div>
//   </div>
// );

// const ComparisonTable = () => (
//   <div className="mt-12">
//     <h2 className="text-2xl font-semibold mb-4">Compare Plans</h2>
//     <table className="w-full border">
//       <thead>
//         <tr>
//           <th className="p-2 border">Feature</th>
//           <th className="p-2 border">Free</th>
//           <th className="p-2 border">Premium</th>
//         </tr>
//       </thead>
//       <tbody>
//         <tr>
//           <td className="p-2 border">Delivery Fee</td>
//           <td className="p-2 border">Chargeable</td>
//           <td className="p-2 border">Free</td>
//         </tr>
//         <tr>
//           <td className="p-2 border">Support</td>
//           <td className="p-2 border">Standard</td>
//           <td className="p-2 border">VIP 24×7</td>
//         </tr>
//       </tbody>
//     </table>
//   </div>
// );

// const Testimonials = () => {
//   const items = [
//     {
//       name: "Priya",
//       text: "QuickBite Premium has saved me so much on delivery fees!",
//     },
//     { name: "Ravi", text: "The VIP support is worth every rupee." },
//     { name: "Anita", text: "Exclusive discounts make it totally worth it." },
//   ];

//   return (
//     <div className="mt-12">
//       <h2 className="text-2xl font-semibold mb-4">What Members Say</h2>
//       <div className="grid md:grid-cols-3 gap-6">
//         {items.map((t) => (
//           <div
//             key={t.name}
//             className="p-4 bg-white dark:bg-secondary rounded-xl shadow"
//           >
//             <FaStar className="text-yellow-500 mb-2" />
//             <p className="italic">"{t.text}"</p>
//             <div className="mt-2 font-bold">- {t.name}</div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// const FAQ = () => (
//   <div className="mt-12">
//     <h2 className="text-2xl font-semibold mb-4">FAQs</h2>
//     <div>
//       <FAQItem
//         q="Can I cancel anytime?"
//         a="Yes, you can cancel your subscription anytime."
//       />
//       <FAQItem
//         q="Do I get a refund?"
//         a="Refunds are only provided if cancellation occurs within 7 days."
//       />
//     </div>
//   </div>
// );

// const FAQItem = ({ q, a }) => (
//   <div className="mb-4">
//     <div className="font-bold flex items-center gap-2">
//       <FaQuestionCircle /> {q}
//     </div>
//     <p className="text-sm text-gray-600 dark:text-gray-400 ml-6">{a}</p>
//   </div>
// );

// const CustomerPremiumLanding = ({
//   plans,
//   billingPeriod,
//   setBillingPeriod,
//   onSubscribe,
// }) => (
//   <div className="max-w-6xl mx-auto animate-fade-in">
//     <motion.section
//       initial={{ opacity: 0, y: 10 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//       className="rounded-2xl p-8 mb-8 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 text-white shadow-lg"
//     >
//       <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6 items-center">
//         <div>
//           <h1 className="text-4xl font-extrabold mb-2">
//             Upgrade to{" "}
//             <span className="underline decoration-yellow-300">
//               QuickBite Premium
//             </span>
//           </h1>
//           <p className="opacity-90 mb-4">
//             Free deliveries, priority support and exclusive partner offers —
//             built for frequent food lovers.
//           </p>
//           <div className="flex gap-3">
//             <button
//               onClick={() => window.scrollTo({ top: 600, behavior: "smooth" })}
//               className="bg-white text-black px-5 py-3 rounded-full font-semibold shadow hover:brightness-95"
//             >
//               Get Premium
//             </button>
//             <button
//               onClick={() => window.location.assign("/customer/offers")}
//               className="bg-transparent border border-white px-4 py-3 rounded-full hover:bg-white/10"
//             >
//               See Offers
//             </button>
//           </div>
//           <div className="mt-4 flex items-center gap-4">
//             <div className="flex items-center gap-2">
//               <FaStar /> <div className="text-sm">Rated 4.8 by members</div>
//             </div>
//             <div className="flex items-center gap-2">
//               <FaGift /> <div className="text-sm">Free priority deliveries</div>
//             </div>
//           </div>
//         </div>
//         <div className="hidden md:block">
//           <div className="h-40 rounded-lg bg-white/20 border border-white/10 flex items-center justify-center">
//             <div className="text-center">
//               <div className="text-2xl font-bold">Premium Illustration</div>
//               <div className="text-sm mt-1">
//                 Happy customers & speedy deliveries
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </motion.section>

//     {/* Benefits */}
//     <section className="mb-8">
//       <h2 className="text-3xl font-extrabold mb-3">Why upgrade?</h2>
//       <div className="grid md:grid-cols-3 gap-6 mb-6">
//         <BenefitTile
//           icon={<FaTruck />}
//           title="Unlimited Free Delivery"
//           desc="Order as often as you like without delivery fees."
//         />
//         <BenefitTile
//           icon={<FaTags />}
//           title="Exclusive Member Discounts"
//           desc="Special offers and partner deals."
//         />
//         <BenefitTile
//           icon={<FaHeadset />}
//           title="24×7 VIP Support"
//           desc="Always-on assistance for any need."
//         />
//       </div>
//     </section>

//     {/* Plans */}
//     <section className="mb-8" id="plans">
//       <div className="flex items-center justify-between mb-4">
//         <h2 className="text-2xl font-semibold">Choose Your Plan</h2>
//         <BillingToggle
//           billingPeriod={billingPeriod}
//           setBillingPeriod={setBillingPeriod}
//         />
//       </div>
//       <div className="grid md:grid-cols-3 gap-6">
//         {plans.map((plan) => (
//           <motion.div
//             whileHover={{ scale: 1.02 }}
//             key={plan.planName}
//             className="p-6 border rounded-2xl shadow hover:scale-[1.03] transition cursor-pointer bg-white dark:bg-secondary"
//           >
//             <div className="flex justify-between items-start mb-2">
//               <h3 className="text-xl font-bold text-primary">
//                 {plan.planName}
//               </h3>
//               {plan.tier === "Gold" && billingPeriod === "yearly" && (
//                 <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
//                   Most Popular
//                 </span>
//               )}
//             </div>
//             <div className="text-2xl font-semibold">
//               {formatCurrency(plan.price)}
//             </div>
//             <p className="text-sm text-gray-500 mb-3">
//               Valid for {plan.durationInDays} days
//             </p>
//             <ul className="mb-4 space-y-1 text-sm">
//               {plan.perks.map((perk, i) => (
//                 <li key={i} className="flex items-center gap-2">
//                   <span className="text-green-600">✔</span>
//                   <span>{perk}</span>
//                 </li>
//               ))}
//             </ul>
//             <button
//               onClick={() => onSubscribe(plan)}
//               className="w-full px-4 py-2 rounded-lg bg-primary text-white font-semibold hover:brightness-95 transition"
//             >
//               Subscribe
//             </button>
//           </motion.div>
//         ))}
//       </div>
//     </section>

//     <ComparisonTable />
//     <Testimonials />
//     <FAQ />
//   </div>
// );

// export default CustomerPremiumLanding;
