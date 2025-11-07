import React, { useState, useEffect, useContext, useMemo } from "react";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import CustomerPremiumLanding from "./CustomerPremiumLanding";
import CustomerPremiumMember from "./CustomerPremiumMember";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTimes,
  FaCrown,
  FaGem,
  FaStar,
  FaCheckCircle,
  FaFire,
  FaBolt,
  FaShieldAlt,
  FaExclamationTriangle,
} from "react-icons/fa";

// Base plan data
const PLANS_BASE = [
  {
    planName: "Gold",
    tier: "Gold",
    monthlyPrice: 199,
    yearlyPrice: 1999,
    durationMonthly: 30,
    durationYearly: 365,
    perks: ["Unlimited Free Deliveries", "Exclusive Discounts", "VIP Support"],
  },
  {
    planName: "Platinum",
    tier: "Platinum",
    monthlyPrice: 499,
    yearlyPrice: 4999,
    durationMonthly: 30,
    durationYearly: 365,
    perks: [
      "Unlimited Free Deliveries",
      "Exclusive Discounts",
      "VIP Support",
      "Free Priority Deliveries",
    ],
  },
  {
    planName: "Diamond",
    tier: "Diamond",
    monthlyPrice: 999,
    yearlyPrice: 9999,
    durationMonthly: 30,
    durationYearly: 365,
    perks: [
      "All Platinum Perks",
      "Dedicated Account Manager",
      "Early Access to Features",
    ],
  },
];

// Format currency utility
const formatCurrency = (v) => `₹${v.toLocaleString("en-IN")}`;

const CustomerPremium = () => {
  const [planInfo, setPlanInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUpgradePage, setShowUpgradePage] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState("yearly");
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Dynamically build plans (by billingPeriod)
  const PLANS = useMemo(
    () =>
      PLANS_BASE.map((p) => ({
        ...p,
        price: billingPeriod === "yearly" ? p.yearlyPrice : p.monthlyPrice,
        durationInDays:
          billingPeriod === "yearly" ? p.durationYearly : p.durationMonthly,
      })),
    [billingPeriod]
  );

  // Fetch user's current subscription
  const fetchPlan = async () => {
    if (!user?._id || !token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await API.get(`/premium/subscriptions`, {
        params: { subscriberType: "User", subscriberId: user._id },
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.subscriptions?.length > 0) {
        setPlanInfo(res.data.subscriptions[0]);
      } else {
        setPlanInfo(null);
      }
    } catch {
      setPlanInfo(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id && token) fetchPlan();
  }, [user?._id, token]);

  // Razorpay payment handler
  const handlePayment = async (planDetails) => {
    if (!user?._id || !token) return alert("User not authenticated.");
    try {
      const { data } = await API.post(
        "/payment/create-premium-order",
        { amount: planDetails.price },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const { razorpayOrderId, amount, currency } = data;

      if (!window.Razorpay) {
        return alert(
          "Payment SDK not loaded. Ensure Razorpay script is included in index.html."
        );
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: amount * 100,
        currency,
        name: "QuickBite Premium",
        description: `${planDetails.planName} Plan Subscription`,
        order_id: razorpayOrderId,
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },
        theme: { color: "#F59E0B" },
        handler: async (response) => {
          try {
            await API.post(
              "/payment/verify-premium-payment",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                subscriptionData: {
                  subscriberId: user._id,
                  subscriberType: "User",
                  planName: planDetails.planName,
                  price: planDetails.price,
                  durationInDays: planDetails.durationInDays,
                  startDate: new Date(),
                  endDate: new Date(
                    Date.now() +
                      planDetails.durationInDays * 24 * 60 * 60 * 1000
                  ),
                },
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("🎉 Subscription successful!");
            fetchPlan();
            setShowUpgradePage(false);
          } catch (err) {
            alert("Payment verification failed. Please contact support.");
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert("Payment failed. Please try again.");
    }
  };

  const handleCancelSubscription = async () => {
    if (!planInfo?._id || !token) return alert("No active subscription found.");
    try {
      setLoading(true);
      await API.delete(`/premium/subscriptions/${planInfo._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Subscription cancelled successfully.");
      setPlanInfo(null);
      setShowCancelModal(false);
    } catch {
      alert("Failed to cancel subscription. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isSubscriptionActive = (endDate) =>
    endDate ? moment().isBefore(moment(endDate).endOf("day")) : false;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="relative inline-block mb-4">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-pink-600 rounded-full blur-2xl opacity-50 animate-pulse"></div>
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center shadow-2xl">
              <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Loading Premium...
          </p>
        </motion.div>
      </div>
    );
  }

  if (!user?._id) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center p-8 rounded-3xl bg-white dark:bg-slate-900 border border-orange-200 dark:border-white/10 shadow-xl max-w-md"
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center mx-auto mb-4">
            <FaExclamationTriangle className="text-white text-3xl" />
          </div>
          <h3 className="text-2xl font-bold text-red-600 mb-2">
            Authentication Required
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Please login to access Premium features
          </p>
          <motion.button
            onClick={() => navigate("/login")}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-bold shadow-lg hover:shadow-xl transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Login Now
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const subscriptionActive = planInfo && isSubscriptionActive(planInfo.endDate);
  const subscriptionExpired = planInfo && !subscriptionActive;
  const savedAmount = planInfo?.totalSavings || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="px-4 sm:px-8 md:px-10 lg:px-12 py-8">
        {subscriptionActive ? (
          <CustomerPremiumMember
            planInfo={planInfo}
            onCancel={() => setShowCancelModal(true)}
            onUpgrade={() => setShowUpgradePage(true)}
            user={user}
            isExpiredView={false}
            savedAmount={savedAmount}
          />
        ) : subscriptionExpired ? (
          <CustomerPremiumMember
            planInfo={planInfo}
            onCancel={() => setShowUpgradePage(true)}
            onUpgrade={() => setShowUpgradePage(true)}
            user={user}
            isExpiredView={true}
            savedAmount={savedAmount}
          />
        ) : (
          <CustomerPremiumLanding
            plans={PLANS}
            billingPeriod={billingPeriod}
            setBillingPeriod={setBillingPeriod}
            onSubscribe={handlePayment}
          />
        )}

        {/* Upgrade modal */}
        <AnimatePresence>
          {showUpgradePage && (
            <UpgradePage
              currentPlan={planInfo}
              plans={PLANS}
              billingPeriod={billingPeriod}
              onClose={() => setShowUpgradePage(false)}
              onSelectPlan={handlePayment}
            />
          )}
        </AnimatePresence>

        {/* Cancel confirmation modal */}
        <AnimatePresence>
          {showCancelModal && (
            <CancelModal
              planInfo={planInfo}
              onClose={() => setShowCancelModal(false)}
              onConfirm={handleCancelSubscription}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CustomerPremium;

/* ========== UpgradePage Modal ========== */
const UpgradePage = ({
  currentPlan,
  plans,
  billingPeriod,
  onSelectPlan,
  onClose,
}) => {
  const mostPopular = "Gold";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-start overflow-auto py-10 px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 50 }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-6xl w-full shadow-2xl border border-orange-200 dark:border-white/10"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-3xl font-black bg-gradient-to-r from-orange-600 to-pink-600 dark:from-orange-400 dark:to-pink-500 bg-clip-text text-transparent flex items-center gap-3">
              <FaCrown className="text-yellow-500" />
              Choose Your Plan
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Unlock premium benefits and save more
            </p>
          </div>
          <motion.button
            onClick={onClose}
            className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaTimes className="text-xl" />
          </motion.button>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, index) => {
            const isCurrent =
              currentPlan?.planName?.toLowerCase() ===
              plan.planName.toLowerCase();

            const showPopular =
              plan.tier === mostPopular && billingPeriod === "yearly";

            const monthlyEquivalent =
              plan.monthlyPrice * (billingPeriod === "yearly" ? 12 : 1);
            const savings = Math.max(0, monthlyEquivalent - plan.price);

            return (
              <motion.div
                key={plan.planName}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative flex flex-col h-full"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div
                  className={`relative flex flex-col justify-between p-6 rounded-3xl bg-white dark:bg-slate-900 border shadow-md hover:shadow-xl transition-all duration-300 h-full ${
                    showPopular
                      ? "border-yellow-500 ring-2 ring-yellow-500/30"
                      : "border-orange-200 dark:border-white/10"
                  }`}
                >
                  {/* Popular Badge */}
                  {showPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold shadow-lg">
                        <FaFire /> Most Popular
                      </span>
                    </div>
                  )}

                  {/* Header + Price + Perks */}
                  <div>
                    <div className="flex items-center gap-3 mb-4 pt-2">
                      <PlanTierIcon tier={plan.tier} />
                      <h3 className="text-2xl font-black bg-gradient-to-r from-orange-600 to-pink-600 dark:from-orange-400 dark:to-pink-500 bg-clip-text text-transparent">
                        {plan.planName}
                      </h3>
                    </div>

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

                    <ul className="space-y-3">
                      {plan.perks.map((perk, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * i }}
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
                  </div>

                  {/* CTA Button — sticks to bottom */}
                  <motion.button
                    onClick={() => onSelectPlan(plan)}
                    disabled={isCurrent}
                    className={`w-full mt-6 py-4 rounded-xl font-bold transition-all shadow-lg ${
                      isCurrent
                        ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white hover:shadow-xl"
                    }`}
                    whileHover={{ scale: isCurrent ? 1 : 1.05 }}
                    whileTap={{ scale: isCurrent ? 1 : 0.95 }}
                  >
                    {isCurrent ? "Current Plan" : `Get ${plan.planName}`}
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ========== Plan Tier Icons ========== */
const PlanTierIcon = ({ tier }) => {
  const configs = {
    Gold: {
      icon: FaCrown,
      gradient: "from-yellow-400 to-orange-500",
      shadow: "shadow-yellow-500/30",
    },
    Platinum: {
      icon: FaGem,
      gradient: "from-slate-400 to-gray-600",
      shadow: "shadow-slate-500/30",
    },
    Diamond: {
      icon: FaStar,
      gradient: "from-cyan-400 to-blue-600",
      shadow: "shadow-cyan-500/30",
    },
  };

  const config = configs[tier] || configs.Gold;
  const Icon = config.icon;

  return (
    <div
      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center text-white shadow-lg ${config.shadow}`}
    >
      <Icon className="text-xl" />
    </div>
  );
};

/* ========== Cancel Modal ========== */
const CancelModal = ({ planInfo, onClose, onConfirm }) => {
  const perks = Array.isArray(planInfo?.perks) ? planInfo.perks : [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-lg w-full shadow-2xl border border-orange-200 dark:border-white/10"
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center mb-4">
              <FaExclamationTriangle className="text-white text-3xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Cancel Subscription?
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              You will lose all the benefits of your{" "}
              <span className="font-bold text-orange-600 dark:text-orange-400">
                {planInfo?.planName}
              </span>{" "}
              membership.
            </p>
          </div>
          <motion.button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaTimes />
          </motion.button>
        </div>

        {/* Benefits You'll Lose */}
        <div className="mb-6">
          <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <FaShieldAlt className="text-orange-500" />
            Benefits You'll Lose:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {perks.map((perk, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30"
              >
                <p className="text-sm text-red-700 dark:text-red-300 font-semibold">
                  {perk}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <motion.button
            onClick={onClose}
            className="flex-1 px-6 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-bold shadow-lg hover:shadow-xl transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Keep Benefits
          </motion.button>
          <motion.button
            onClick={onConfirm}
            className="flex-1 px-6 py-4 rounded-xl border-2 border-red-500 text-red-600 dark:text-red-400 font-bold hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Cancel Subscription
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// import React, { useState, useEffect, useContext, useMemo } from "react";
// import {
//   FaTruck,
//   FaTags,
//   FaHeadset,
//   FaCrown,
//   FaGift,
//   FaStar,
//   FaQuestionCircle,
//   FaTimes,
// } from "react-icons/fa";
// import { motion } from "framer-motion";
// import CountUp from "react-countup";
// import { useNavigate } from "react-router-dom";
// import API from "../../api/axios";
// import { AuthContext } from "../../context/AuthContext";
// import moment from "moment";

// const PLANS_BASE = [
//   {
//     planName: "Gold",
//     tier: "Gold",
//     monthlyPrice: 199,
//     yearlyPrice: 1999,
//     durationMonthly: 30,
//     durationYearly: 365,
//     perks: ["Unlimited Free Deliveries", "Exclusive Discounts", "VIP Support"],
//   },
//   {
//     planName: "Platinum",
//     tier: "Platinum",
//     monthlyPrice: 499,
//     yearlyPrice: 4999,
//     durationMonthly: 30,
//     durationYearly: 365,
//     perks: [
//       "Unlimited Free Deliveries",
//       "Exclusive Discounts",
//       "VIP Support",
//       "Free Priority Deliveries",
//     ],
//   },
//   {
//     planName: "Diamond",
//     tier: "Diamond",
//     monthlyPrice: 999,
//     yearlyPrice: 9999,
//     durationMonthly: 30,
//     durationYearly: 365,
//     perks: [
//       "All Platinum Perks",
//       "Dedicated Account Manager",
//       "Early Access to Features",
//     ],
//   },
// ];

// const formatCurrency = (v) => `₹${v.toLocaleString("en-IN")}`;

// /* ------------------ MAIN COMPONENT ------------------ */
// const CustomerPremium = () => {
//   const [planInfo, setPlanInfo] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [showUpgradePage, setShowUpgradePage] = useState(false);
//   const { token, user } = useContext(AuthContext);
//   const [billingPeriod, setBillingPeriod] = useState("yearly"); // "monthly" | "yearly"
//   const [showCancelModal, setShowCancelModal] = useState(false);
//   const navigate = useNavigate();

//   // Derived plans data (with price based on billingPeriod)
//   const PLANS = useMemo(
//     () =>
//       PLANS_BASE.map((p) => ({
//         ...p,
//         price: billingPeriod === "yearly" ? p.yearlyPrice : p.monthlyPrice,
//         durationInDays:
//           billingPeriod === "yearly" ? p.durationYearly : p.durationMonthly,
//       })),
//     [billingPeriod]
//   );

//   // Fetch subscription plan
//   const fetchPlan = async () => {
//     if (!user?._id || !token) {
//       setLoading(false);
//       return;
//     }
//     setLoading(true);
//     try {
//       const res = await API.get(`/premium/subscriptions`, {
//         params: { subscriberType: "User", subscriberId: user._id },
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (res.data?.subscriptions?.length > 0) {
//         setPlanInfo(res.data.subscriptions[0]);
//       } else {
//         setPlanInfo(null);
//       }
//     } catch (err) {
//       setPlanInfo(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (user?._id && token) fetchPlan();
//     // eslint-disable-next-line
//   }, [user?._id, token]);

//   // Razorpay payment handler (keeps your original flow, but uses env key)
//   const handlePayment = async (planDetails) => {
//     if (!user?._id || !token) return alert("User not authenticated.");

//     try {
//       // 1️⃣ Create Razorpay order on backend
//       const { data } = await API.post(
//         "/payment/create-premium-order",
//         { amount: planDetails.price }, // price in rupees
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       const { razorpayOrderId, amount, currency } = data;

//       if (!window.Razorpay) {
//         return alert(
//           "Payment SDK not loaded. Ensure Razorpay script is included in index.html."
//         );
//       }

//       const options = {
//         key: import.meta.env.VITE_RAZORPAY_KEY_ID,
//         amount: amount * 100, // convert rupees → paise
//         currency,
//         name: "QuickBite Premium",
//         description: `${planDetails.planName} Plan Subscription`,
//         order_id: razorpayOrderId,
//         prefill: {
//           name: user?.name || "",
//           email: user?.email || "",
//         },
//         theme: { color: "#F59E0B" },
//         handler: async (response) => {
//           try {
//             // 2️⃣ Verify payment with backend
//             await API.post(
//               "/payment/verify-premium-payment",
//               {
//                 razorpay_order_id: response.razorpay_order_id,
//                 razorpay_payment_id: response.razorpay_payment_id,
//                 razorpay_signature: response.razorpay_signature,
//                 subscriptionData: {
//                   subscriberId: user._id,
//                   subscriberType: "User",
//                   planName: planDetails.planName,
//                   price: planDetails.price,
//                   durationInDays: planDetails.durationInDays,
//                   startDate: new Date(),
//                   endDate: new Date(
//                     Date.now() +
//                       planDetails.durationInDays * 24 * 60 * 60 * 1000
//                   ),
//                 },
//               },
//               { headers: { Authorization: `Bearer ${token}` } }
//             );

//             alert("🎉 Subscription successful!");
//             fetchPlan();
//             setShowUpgradePage(false);
//           } catch (err) {
//             console.error("Payment verification failed:", err);
//             alert("Payment verification failed. Please contact support.");
//           }
//         },
//       };

//       // 3️⃣ Open Razorpay checkout
//       const rzp = new window.Razorpay(options);
//       rzp.open();
//     } catch (err) {
//       console.error("Payment initialization failed:", err);
//       alert("Payment failed. Please try again.");
//     }
//   };

//   const handleCancelSubscription = async () => {
//     if (!planInfo?._id || !token) return alert("No active subscription found.");
//     try {
//       setLoading(true);
//       await API.delete(`/premium/subscriptions/${planInfo._id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       alert("Subscription cancelled successfully.");
//       setPlanInfo(null);
//       setShowCancelModal(false);
//     } catch {
//       alert("Failed to cancel subscription. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const isSubscriptionActive = (endDate) =>
//     endDate ? moment().isBefore(moment(endDate).endOf("day")) : false;

//   if (loading) return <LoadingSpinner />;

//   if (!user?._id)
//     return (
//       <div className="text-center text-red-600 mt-10">
//         ⚠️ User not authenticated. Please login.
//       </div>
//     );

//   const subscriptionActive = planInfo && isSubscriptionActive(planInfo.endDate);
//   const subscriptionExpired = planInfo && !subscriptionActive;

//   const savedAmount = planInfo?.totalSavings || 0;

//   return (
//     <div className="p-6 text-gray-800 dark:text-white min-h-[80vh]">
//       {/* HERO */}
//       <motion.section
//         initial={{ opacity: 0, y: 10 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="rounded-2xl p-8 mb-8 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 text-white shadow-lg"
//       >
//         <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6 items-center">
//           <div>
//             <h1 className="text-4xl font-extrabold mb-2">
//               Upgrade to{" "}
//               <span className="underline decoration-yellow-300">
//                 QuickBite Premium
//               </span>
//             </h1>
//             <p className="opacity-90 mb-4">
//               Free deliveries, priority support and exclusive partner offers —
//               built for frequent food lovers.
//             </p>
//             <div className="flex gap-3">
//               <button
//                 onClick={() => setShowUpgradePage(true)}
//                 className="bg-white text-black px-5 py-3 rounded-full font-semibold shadow hover:brightness-95"
//               >
//                 Get Premium
//               </button>
//               <button
//                 onClick={() => navigate("/customer/offers")}
//                 className="bg-transparent border border-white px-4 py-3 rounded-full hover:bg-white/10"
//               >
//                 See Offers
//               </button>
//             </div>
//             <div className="mt-4 flex items-center gap-4">
//               <div className="flex items-center gap-2">
//                 <FaStar /> <div className="text-sm">Rated 4.8 by members</div>
//               </div>
//               <div className="flex items-center gap-2">
//                 <FaGift />{" "}
//                 <div className="text-sm">Free priority deliveries</div>
//               </div>
//             </div>
//           </div>
//           <div className="hidden md:block">
//             {/* Placeholder illustration — you can replace with Lottie or image */}
//             <div className="h-40 rounded-lg bg-white/20 border border-white/10 flex items-center justify-center">
//               <div className="text-center">
//                 <div className="text-2xl font-bold">Premium Illustration</div>
//                 <div className="text-sm mt-1">
//                   Happy customers & speedy deliveries
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </motion.section>

//       {/* BODY */}
//       {subscriptionActive ? (
//         <PremiumMemberView
//           planInfo={planInfo}
//           onCancel={() => setShowCancelModal(true)}
//           onUpgrade={() => setShowUpgradePage(true)}
//           user={user}
//           isExpiredView={false}
//           savedAmount={savedAmount}
//         />
//       ) : subscriptionExpired ? (
//         <PremiumMemberView
//           planInfo={planInfo}
//           onCancel={() => setShowUpgradePage(true)}
//           onUpgrade={() => setShowUpgradePage(true)}
//           user={user}
//           isExpiredView={true}
//           savedAmount={savedAmount}
//         />
//       ) : (
//         <PremiumLandingPage
//           plans={PLANS}
//           billingPeriod={billingPeriod}
//           setBillingPeriod={setBillingPeriod}
//           onSubscribe={(plan) => handlePayment(plan)}
//         />
//       )}

//       {/* Upgrade modal */}
//       {showUpgradePage && (
//         <UpgradePage
//           currentPlan={planInfo}
//           plans={PLANS}
//           billingPeriod={billingPeriod}
//           onClose={() => setShowUpgradePage(false)}
//           onSelectPlan={(plan) => handlePayment(plan)}
//         />
//       )}

//       {/* Cancel confirmation modal */}
//       {showCancelModal && (
//         <CancelModal
//           planInfo={planInfo}
//           onClose={() => setShowCancelModal(false)}
//           onConfirm={handleCancelSubscription}
//         />
//       )}

//       {/* Sticky mobile CTA */}
//       <StickyBottomBar
//         onUpgrade={() => setShowUpgradePage(true)}
//         plans={PLANS}
//       />
//     </div>
//   );
// };

// /* ------------------ UPGRADE PAGE ------------------ */
// const UpgradePage = ({
//   currentPlan,
//   plans,
//   billingPeriod,
//   onSelectPlan,
//   onClose,
// }) => {
//   // Mark Gold Yearly as most popular for ribbon
//   const mostPopular = "Gold";
//   return (
//     <div className="fixed inset-0 z-50 bg-black/60 flex justify-center items-start overflow-auto py-10">
//       <motion.div
//         initial={{ scale: 0.98, opacity: 0 }}
//         animate={{ scale: 1, opacity: 1 }}
//         transition={{ duration: 0.18 }}
//         className="bg-white dark:bg-secondary rounded-2xl p-6 max-w-5xl w-full shadow-2xl border dark:border-gray-700"
//       >
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
//             Choose a Plan
//           </h2>
//           <button
//             onClick={onClose}
//             className="text-gray-500 hover:text-gray-900"
//           >
//             <FaTimes />
//           </button>
//         </div>

//         <div className="flex items-center gap-4 mb-4">
//           <BillingToggle />
//           <div className="text-sm text-gray-500">
//             Toggle between monthly and yearly pricing
//           </div>
//         </div>

//         <div className="grid md:grid-cols-3 gap-6">
//           {plans.map((plan) => {
//             const isCurrent =
//               currentPlan?.planName?.toLowerCase() ===
//               plan.planName.toLowerCase();

//             const showPopular =
//               plan.tier === mostPopular && billingPeriod === "yearly";

//             // savings example: compare to monthly * 12
//             const monthlyEquivalent =
//               plan.monthlyPrice * (billingPeriod === "yearly" ? 12 : 1);
//             const savings = Math.max(0, monthlyEquivalent - plan.price);

//             return (
//               <motion.div
//                 key={plan.planName}
//                 whileHover={{ scale: 1.03 }}
//                 className={`relative p-6 border rounded-2xl shadow-md transition-all duration-200 bg-gradient-to-br from-white to-gray-50 dark:bg-secondary dark:border-gray-700`}
//               >
//                 {showPopular && (
//                   <span className="absolute top-3 left-3 bg-primary text-white text-xs px-2 py-1 rounded-full font-semibold shadow">
//                     Most Popular
//                   </span>
//                 )}

//                 <div className="flex items-center gap-3 mb-3">
//                   <PlanTierIcon tier={plan.tier} />
//                   <h3 className="text-xl font-bold text-primary">
//                     {plan.planName}
//                   </h3>
//                 </div>

//                 <div className="text-2xl font-semibold mb-1">
//                   {formatCurrency(plan.price)}
//                 </div>
//                 <p className="text-sm text-gray-500 mb-2">
//                   Valid for {plan.durationInDays} days
//                 </p>

//                 {savings > 0 && (
//                   <div className="text-sm text-green-600 mb-2">
//                     Save {formatCurrency(savings)} vs monthly
//                   </div>
//                 )}

//                 <ul className="mb-4 space-y-1 text-sm">
//                   {plan.perks.map((perk, i) => (
//                     <li key={i} className="flex items-center gap-2">
//                       <span className="text-green-600">✔</span>
//                       <span>{perk}</span>
//                     </li>
//                   ))}
//                 </ul>

//                 <button
//                   onClick={() => onSelectPlan(plan)}
//                   disabled={isCurrent}
//                   className={`w-full px-4 py-2 rounded-lg font-semibold transition ${
//                     isCurrent
//                       ? "bg-gray-400 text-white cursor-not-allowed"
//                       : "bg-primary text-white hover:brightness-95"
//                   }`}
//                 >
//                   {isCurrent ? "Current Plan" : `Get ${plan.planName}`}
//                 </button>
//               </motion.div>
//             );
//           })}
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// /* ------------------ LANDING PAGE ------------------ */
// const PremiumLandingPage = ({
//   plans,
//   billingPeriod,
//   setBillingPeriod,
//   onSubscribe,
// }) => {
//   return (
//     <div className="max-w-6xl mx-auto animate-fade-in">
//       <section className="mb-8">
//         <h2 className="text-3xl font-extrabold mb-3">Why upgrade?</h2>
//         <div className="grid md:grid-cols-3 gap-6 mb-6">
//           <Benefit
//             icon={<FaTruck />}
//             title="Unlimited Free Delivery"
//             desc="Order as often as you like without delivery fees."
//           />
//           <Benefit
//             icon={<FaTags />}
//             title="Exclusive Member Discounts"
//             desc="Special offers and partner deals."
//           />
//           <Benefit
//             icon={<FaHeadset />}
//             title="24×7 VIP Support"
//             desc="Always-on assistance for any need."
//           />
//         </div>
//       </section>

//       <section className="mb-8">
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-2xl font-semibold">Choose Your Plan</h2>
//           <div className="flex items-center gap-3">
//             <BillingToggle
//               billingPeriod={billingPeriod}
//               setBillingPeriod={setBillingPeriod}
//             />
//           </div>
//         </div>

//         <div className="grid md:grid-cols-3 gap-6">
//           {plans.map((plan) => (
//             <motion.div
//               whileHover={{ scale: 1.02 }}
//               key={plan.planName}
//               className="p-6 border rounded-2xl shadow hover:scale-[1.03] transition cursor-pointer bg-white dark:bg-secondary"
//             >
//               <div className="flex justify-between items-start mb-2">
//                 <h3 className="text-xl font-bold text-primary">
//                   {plan.planName}
//                 </h3>
//                 {plan.tier === "Gold" && billingPeriod === "yearly" && (
//                   <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
//                     Most Popular
//                   </span>
//                 )}
//               </div>
//               <div className="text-2xl font-semibold">
//                 {formatCurrency(plan.price)}
//               </div>
//               <p className="text-sm text-gray-500 mb-3">
//                 Valid for {plan.durationInDays} days
//               </p>
//               <ul className="mb-4 space-y-1 text-sm">
//                 {plan.perks.map((perk, i) => (
//                   <li key={i} className="flex items-center gap-2">
//                     <span className="text-green-600">✔</span>
//                     <span>{perk}</span>
//                   </li>
//                 ))}
//               </ul>
//               <button
//                 onClick={() => onSubscribe(plan)}
//                 className="w-full px-4 py-2 rounded-lg bg-primary text-white font-semibold hover:brightness-95 transition"
//               >
//                 Subscribe
//               </button>
//             </motion.div>
//           ))}
//         </div>
//       </section>

//       <ComparisonTable />
//       <Testimonials />
//       <FAQ />
//     </div>
//   );
// };

// /* ------------------ MEMBER VIEW ------------------ */
// const PremiumMemberView = ({
//   planInfo,
//   onCancel,
//   onUpgrade,
//   user,
//   isExpiredView,
//   savedAmount,
// }) => {
//   const start = moment(planInfo?.startDate || moment());
//   const end = moment(planInfo?.endDate || moment().add(30, "days"));
//   const now = moment();

//   const startOfDay = start.clone().startOf("day");
//   const endOfDay = end.clone().endOf("day");

//   const totalMs = Math.max(1, endOfDay.valueOf() - startOfDay.valueOf());
//   const elapsedMs = isExpiredView
//     ? totalMs
//     : Math.max(0, Math.min(now.valueOf() - startOfDay.valueOf(), totalMs));
//   const progressPercent = Math.min(
//     100,
//     Math.round((elapsedMs / totalMs) * 100)
//   );

//   const remainingMs = Math.max(0, endOfDay.valueOf() - now.valueOf());
//   const remainingDays = Math.ceil(remainingMs / (24 * 60 * 60 * 1000));
//   const totalDays = Math.ceil(totalMs / (24 * 60 * 60 * 1000));

//   return (
//     <div className="max-w-6xl mx-auto animate-fade-in">
//       <motion.div
//         layout
//         transition={{ duration: 0.35 }}
//         className={`bg-gradient-to-r ${
//           isExpiredView
//             ? "from-red-100 to-red-200 dark:from-red-900 dark:to-red-800"
//             : "from-yellow-100 to-white dark:from-yellow-800 dark:to-secondary"
//         } rounded-2xl p-8 shadow-lg mb-6 border dark:border-gray-700`}
//       >
//         <div className="flex items-center gap-4 mb-3">
//           <div className="rounded-full bg-yellow-300 dark:bg-yellow-700 p-3 text-yellow-900 dark:text-yellow-100 shadow-md ring-4 ring-yellow-200/40">
//             <FaCrown className="text-3xl" />
//           </div>
//           <div>
//             <h2 className="text-2xl font-extrabold">
//               {isExpiredView ? "⚠️ Your plan has expired" : "🎉 You're a"}{" "}
//               <span className="text-primary">{planInfo.planName}</span> member
//             </h2>
//             <p className="text-sm text-gray-600 dark:text-gray-300">
//               Welcome back, {user?.name || "Valued Member"} — enjoy your premium
//               perks.
//             </p>
//           </div>
//         </div>

//         <div className="mt-5 grid md:grid-cols-2 gap-4 items-center">
//           <div>
//             <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">
//               Valid till
//             </div>
//             <div className="text-xl font-bold mb-1">
//               {moment(planInfo.endDate).format("MMMM Do, YYYY")}
//             </div>
//             {!isExpiredView && (
//               <div className="text-sm text-gray-500 dark:text-gray-400">
//                 {remainingDays} day{remainingDays !== 1 ? "s" : ""} left
//               </div>
//             )}

//             <div className="mt-4">
//               <div
//                 className="relative h-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
//                 role="progressbar"
//                 aria-valuenow={progressPercent}
//                 aria-valuemin={0}
//                 aria-valuemax={100}
//               >
//                 <motion.div
//                   className={`${
//                     isExpiredView
//                       ? "bg-red-400"
//                       : "bg-gradient-to-r from-yellow-400 to-orange-500"
//                   } absolute inset-0 h-full`}
//                   initial={{ width: 0 }}
//                   animate={{ width: `${progressPercent}%` }}
//                   transition={{ duration: 0.9 }}
//                 />
//               </div>
//               <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
//                 <span>{startOfDay.format("Do MMM, YYYY")}</span>
//                 <span>{endOfDay.format("Do MMM, YYYY")}</span>
//               </div>

//               <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//                 {progressPercent}% used — {totalDays} day
//                 {totalDays !== 1 ? "s" : ""} total
//               </div>
//             </div>
//           </div>

//           <div className="flex flex-col gap-3">
//             <QuickPerkButton
//               icon={<FaTruck />}
//               label="Order with Free Delivery"
//               to="/customer/restaurants"
//             />
//             <QuickPerkButton
//               icon={<FaHeadset />}
//               label="Contact VIP Support"
//               onClick={() => alert("Opening VIP support - coming soon")}
//             />
//             <QuickPerkButton
//               icon={<FaTags />}
//               label="View Exclusive Offers"
//               to="/customer/offers"
//             />
//           </div>
//         </div>

//         <div className="mt-7 flex flex-wrap gap-3">
//           <button
//             onClick={onCancel}
//             className={`px-4 py-2 rounded-lg font-semibold shadow transition ${
//               isExpiredView
//                 ? "bg-green-600 hover:bg-green-700"
//                 : "bg-red-600 hover:bg-red-700"
//             } text-white`}
//           >
//             {isExpiredView ? "Renew Subscription" : "Cancel Subscription"}
//           </button>
//           <button
//             onClick={onUpgrade}
//             className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold shadow transition"
//           >
//             Upgrade Plan
//           </button>
//           <button
//             onClick={() =>
//               alert("Feature coming soon: Add to cart with premium perks")
//             }
//             className="bg-primary hover:brightness-95 text-white px-4 py-2 rounded-lg font-semibold shadow transition"
//           >
//             Use Your Perks
//           </button>
//         </div>
//       </motion.div>

//       <section className="grid md:grid-cols-3 gap-6">
//         <PerkCard
//           title="Unlimited Free Deliveries"
//           desc="No delivery charges on all orders."
//           icon={<FaTruck />}
//         />
//         <PerkCard
//           title="Member Offers"
//           desc="Exclusive discounts and early access to promotions."
//           icon={<FaTags />}
//         />
//         <PerkCard
//           title="24×7 VIP Support"
//           desc="Priority support line for any order issues."
//           icon={<FaHeadset />}
//         />
//       </section>

//       <div className="mt-8 flex gap-6 items-center">
//         <div className="bg-white dark:bg-secondary p-4 rounded-lg shadow">
//           <div className="text-sm text-gray-500">You’ve saved</div>
//           <div className="text-2xl font-bold">
//             <CountUp
//               end={savedAmount}
//               duration={1.6}
//               separator=","
//               prefix="₹"
//             />
//           </div>
//           <div className="text-sm text-gray-400">since joining Premium</div>
//         </div>

//         <div className="p-4 rounded-lg border dark:border-gray-700 bg-white dark:bg-secondary">
//           <div className="text-sm text-gray-500">Membership</div>
//           <div className="flex items-center gap-2">
//             <FaCrown className="text-yellow-500" />
//             <div className="font-semibold">{planInfo.planName}</div>
//             <div className="text-xs text-gray-400">• Premium</div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// /* ------------------ small UI building blocks ------------------ */
// const QuickPerkButton = ({ icon, label, to, onClick }) => {
//   const navigate = useNavigate();
//   return (
//     <button
//       onClick={() => {
//         if (onClick) return onClick();
//         if (to) return navigate(to);
//       }}
//       className="flex items-center gap-3 px-4 py-2 bg-white dark:bg-primary/10 rounded-lg border dark:border-gray-700 shadow-sm hover:shadow-md transition"
//     >
//       <div className="text-primary text-lg">{icon}</div>
//       <div className="text-sm font-medium">{label}</div>
//     </button>
//   );
// };

// const Benefit = ({ icon, title, desc }) => (
//   <div className="flex flex-col items-center text-center p-4 bg-white dark:bg-secondary rounded-xl shadow">
//     <div className="text-4xl text-primary mb-3">{icon}</div>
//     <h3 className="font-bold">{title}</h3>
//     <p className="text-sm text-gray-600 dark:text-gray-400">{desc}</p>
//   </div>
// );

// const PerkCard = ({ icon, title, desc }) => (
//   <div className="bg-white dark:bg-secondary p-4 rounded-xl shadow-md border dark:border-gray-700 flex gap-4 items-start hover:scale-[1.02] transition-transform">
//     <div className="text-3xl text-primary">{icon}</div>
//     <div>
//       <div className="font-semibold">{title}</div>
//       <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
//         {desc}
//       </div>
//     </div>
//   </div>
// );

// const PlanTierIcon = ({ tier }) => {
//   if (tier === "Gold") return <FaCrown className="text-yellow-500" />;
//   if (tier === "Platinum") return <FaCrown className="text-slate-400" />;
//   if (tier === "Diamond") return <FaCrown className="text-indigo-400" />;
//   return <FaCrown />;
// };

// /* ------------------ Comparison, Testimonials, FAQ ------------------ */
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

// /* ------------------ Cancel modal (reinforce value) ------------------ */
// const CancelModal = ({ planInfo, onClose, onConfirm }) => {
//   const perks = Array.isArray(planInfo?.perks) ? planInfo.perks : [];

//   return (
//     <div className="fixed inset-0 z-60 bg-black/50 flex items-center justify-center p-4">
//       <motion.div
//         initial={{ y: 10, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         className="bg-white dark:bg-secondary rounded-2xl p-6 max-w-lg w-full shadow-lg border dark:border-gray-700"
//       >
//         <div className="flex justify-between items-start gap-4">
//           <div>
//             <h3 className="text-xl font-bold">
//               Are you sure you want to cancel?
//             </h3>
//             <p className="text-sm text-gray-600 mt-1">
//               You will lose the benefits of your {planInfo?.planName}{" "}
//               membership.
//             </p>
//           </div>
//           <button onClick={onClose} className="text-gray-500">
//             <FaTimes />
//           </button>
//         </div>

//         <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
//           {perks.map((p, i) => (
//             <div key={i} className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
//               <div className="text-sm">{p}</div>
//             </div>
//           ))}
//         </div>

//         <div className="mt-6 flex gap-3 justify-end">
//           <button onClick={onClose} className="px-4 py-2 rounded-lg border">
//             Keep Benefits
//           </button>
//           <button
//             onClick={onConfirm}
//             className="px-4 py-2 rounded-lg bg-red-600 text-white"
//           >
//             Cancel Subscription
//           </button>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// /* ------------------ Mobile sticky CTA ------------------ */
// const StickyBottomBar = ({ plans, onUpgrade }) => {
//   const popular = plans.find((p) => p.tier === "Gold") || plans[0];
//   return (
//     <div className="fixed bottom-4 left-4 right-4 md:hidden z-50">
//       <div className="bg-white dark:bg-secondary px-4 py-3 rounded-full shadow-lg flex items-center justify-between gap-3">
//         <div>
//           <div className="text-xs text-gray-500">Most Popular</div>
//           <div className="font-semibold">
//             {popular.planName} • {formatCurrency(popular.price)}
//           </div>
//         </div>
//         <div>
//           <button
//             onClick={onUpgrade}
//             className="bg-primary text-white px-4 py-2 rounded-full"
//           >
//             Upgrade Now
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// /* ------------------ Billing toggle ------------------ */
// const BillingToggle = ({ billingPeriod = "yearly", setBillingPeriod }) => {
//   // If setBillingPeriod provided, use it; else no-op local toggle (used inside modal)
//   const [local, setLocal] = useState(billingPeriod);
//   useEffect(() => setLocal(billingPeriod), [billingPeriod]);

//   const toggle = () => {
//     const next = local === "yearly" ? "monthly" : "yearly";
//     setLocal(next);
//     if (setBillingPeriod) setBillingPeriod(next);
//   };

//   return (
//     <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-full">
//       <button
//         onClick={() => {
//           setLocal("monthly");
//           if (setBillingPeriod) setBillingPeriod("monthly");
//         }}
//         className={`px-3 py-1 rounded-full text-sm ${
//           local === "monthly" ? "bg-white dark:bg-primary/20 shadow" : ""
//         }`}
//       >
//         Monthly
//       </button>
//       <button
//         onClick={() => {
//           setLocal("yearly");
//           if (setBillingPeriod) setBillingPeriod("yearly");
//         }}
//         className={`px-3 py-1 rounded-full text-sm ${
//           local === "yearly" ? "bg-white dark:bg-primary/20 shadow" : ""
//         }`}
//       >
//         Yearly
//       </button>
//     </div>
//   );
// };

// const LoadingSpinner = () => (
//   <div className="flex justify-center items-center h-[60vh]">
//     <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary"></div>
//   </div>
// );

// export default CustomerPremium;

// src/pages/customer/CustomerPremium.jsx
// import React, { useState, useEffect, useContext, useMemo } from "react";
// import moment from "moment";
// import { useNavigate } from "react-router-dom";
// import API from "../../api/axios";
// import { AuthContext } from "../../context/AuthContext";
// import CustomerPremiumLanding from "./CustomerPremiumLanding";
// import CustomerPremiumMember from "./CustomerPremiumMember";

// const PLANS_BASE = [
//   {
//     planName: "Gold",
//     tier: "Gold",
//     monthlyPrice: 199,
//     yearlyPrice: 1999,
//     durationMonthly: 30,
//     durationYearly: 365,
//     perks: ["Unlimited Free Deliveries", "Exclusive Discounts", "VIP Support"],
//   },
//   {
//     planName: "Platinum",
//     tier: "Platinum",
//     monthlyPrice: 499,
//     yearlyPrice: 4999,
//     durationMonthly: 30,
//     durationYearly: 365,
//     perks: [
//       "Unlimited Free Deliveries",
//       "Exclusive Discounts",
//       "VIP Support",
//       "Free Priority Deliveries",
//     ],
//   },
//   {
//     planName: "Diamond",
//     tier: "Diamond",
//     monthlyPrice: 999,
//     yearlyPrice: 9999,
//     durationMonthly: 30,
//     durationYearly: 365,
//     perks: [
//       "All Platinum Perks",
//       "Dedicated Account Manager",
//       "Early Access to Features",
//     ],
//   },
// ];

// const CustomerPremium = () => {
//   const { token, user } = useContext(AuthContext);
//   const [planInfo, setPlanInfo] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [billingPeriod, setBillingPeriod] = useState("yearly");
//   const navigate = useNavigate();

//   const PLANS = useMemo(
//     () =>
//       PLANS_BASE.map((p) => ({
//         ...p,
//         price: billingPeriod === "yearly" ? p.yearlyPrice : p.monthlyPrice,
//         durationInDays:
//           billingPeriod === "yearly" ? p.durationYearly : p.durationMonthly,
//       })),
//     [billingPeriod]
//   );

//   const fetchPlan = async () => {
//     if (!user?._id || !token) {
//       setLoading(false);
//       return;
//     }
//     setLoading(true);
//     try {
//       const res = await API.get(`/premium/subscriptions`, {
//         params: { subscriberType: "User", subscriberId: user._id },
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setPlanInfo(res.data?.subscriptions?.[0] || null);
//     } catch {
//       setPlanInfo(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (user?._id && token) fetchPlan();
//   }, [user?._id, token]);

//   // 👇 either blank screen or message instead of spinner
//   if (loading)
//     return (
//       <div className="text-center text-gray-500 py-10">
//         Loading your Premium data…
//       </div>
//     );

//   const subscriptionActive =
//     planInfo && moment().isBefore(moment(planInfo.endDate).endOf("day"));

//   return (
//     <div className="p-6 text-gray-800 dark:text-white min-h-[80vh]">
//       {subscriptionActive ? (
//         <CustomerPremiumMember planInfo={planInfo} user={user} />
//       ) : (
//         <CustomerPremiumLanding
//           plans={PLANS}
//           billingPeriod={billingPeriod}
//           setBillingPeriod={setBillingPeriod}
//         />
//       )}
//     </div>
//   );
// };

// export default CustomerPremium;
