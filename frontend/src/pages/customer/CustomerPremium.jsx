import React, { useState, useEffect, useContext } from "react";
import {
  FaTruck,
  FaTags,
  FaHeadset,
  FaCrown,
  FaGift,
  FaStar,
  FaQuestionCircle,
  FaTimes,
} from "react-icons/fa";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import moment from "moment";

// ------------------ PLANS ------------------
const PLANS = [
  {
    planName: "Gold Monthly",
    price: 199,
    durationInDays: 30,
    perks: ["Unlimited Free Deliveries", "Exclusive Discounts", "VIP Support"],
  },
  {
    planName: "Gold Yearly",
    price: 1999,
    durationInDays: 365,
    perks: ["Unlimited Free Deliveries", "Exclusive Discounts", "VIP Support"],
  },
  {
    planName: "Platinum",
    price: 4999,
    durationInDays: 365,
    perks: [
      "Unlimited Free Deliveries",
      "Exclusive Discounts",
      "VIP Support",
      "Free Priority Deliveries",
    ],
  },
  {
    planName: "Diamond",
    price: 9999,
    durationInDays: 365,
    perks: [
      "All Platinum Perks",
      "Dedicated Account Manager",
      "Early Access to Features",
    ],
  },
];

// ------------------ MAIN COMPONENT ------------------
const CustomerPremium = () => {
  const [planInfo, setPlanInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUpgradePage, setShowUpgradePage] = useState(false);
  const { token, user } = useContext(AuthContext);

  // Fetch subscription plan
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
    } catch (err) {
      setPlanInfo(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id && token) fetchPlan();
    // eslint-disable-next-line
  }, [user?._id, token]);

  // Razorpay payment handler
  const handlePayment = async (planDetails) => {
    try {
      const { data } = await API.post(
        "/payment/create-premium-order",
        { amount: planDetails.price },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { razorpayOrderId, amount, currency } = data;

      const options = {
        key: "rzp_test_GDBH9Rf7wvZ3R6",
        amount: amount * 100,
        currency,
        name: "QuickBite Premium",
        description: `${planDetails.planName} Plan Subscription`,
        order_id: razorpayOrderId,
        handler: async function (response) {
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
          } catch {
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },
        theme: { color: "#F59E0B" },
      };

      if (!window.Razorpay) {
        alert(
          "Payment SDK not loaded. Ensure Razorpay script is included in index.html."
        );
        return;
      }

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch {
      alert("Payment failed. Please try again.");
    }
  };

  const handleCancelSubscription = async () => {
    if (!planInfo?._id || !token) return alert("No active subscription found.");
    if (!window.confirm("Are you sure you want to cancel your subscription?"))
      return;
    try {
      setLoading(true);
      await API.delete(`/premium/subscriptions/${planInfo._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Subscription cancelled successfully.");
      setPlanInfo(null);
    } catch {
      alert("Failed to cancel subscription. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isSubscriptionActive = (endDate) =>
    endDate ? moment().isBefore(moment(endDate).endOf("day")) : false;

  if (loading) return <LoadingSpinner />;

  if (!user?._id)
    return (
      <div className="text-center text-red-600 mt-10">
        ⚠️ User not authenticated. Please login.
      </div>
    );

  const subscriptionActive = planInfo && isSubscriptionActive(planInfo.endDate);
  const subscriptionExpired = planInfo && !subscriptionActive;

  return (
    <div className="p-6 text-gray-800 dark:text-white min-h-[80vh]">
      {subscriptionActive ? (
        <PremiumMemberView
          planInfo={planInfo}
          onCancel={handleCancelSubscription}
          onUpgrade={() => setShowUpgradePage(true)}
          user={user}
          isExpiredView={false}
        />
      ) : subscriptionExpired ? (
        <PremiumMemberView
          planInfo={planInfo}
          onCancel={() => setShowUpgradePage(true)}
          onUpgrade={() => setShowUpgradePage(true)}
          user={user}
          isExpiredView={true}
        />
      ) : (
        <PremiumLandingPage
          plans={PLANS}
          onSubscribe={(plan) => handlePayment(plan)}
        />
      )}

      {showUpgradePage && (
        <UpgradePage
          currentPlan={planInfo}
          plans={PLANS}
          onClose={() => setShowUpgradePage(false)}
          onSelectPlan={(plan) => handlePayment(plan)}
        />
      )}
    </div>
  );
};

// ------------------ UPGRADE PAGE ------------------
const UpgradePage = ({ currentPlan, plans, onSelectPlan, onClose }) => (
  <div className="fixed inset-0 z-50 bg-black/60 flex justify-center items-center overflow-auto transition-all">
    <div className="bg-white dark:bg-secondary rounded-2xl p-8 max-w-4xl w-full shadow-2xl border dark:border-gray-700">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Upgrade Your Plan
        </h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-900 dark:hover:text-white text-xl"
          aria-label="Close upgrade modal"
        >
          <FaTimes />
        </button>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        {plans.map((plan) => {
          const isCurrent =
            currentPlan?.planName?.toLowerCase() ===
            plan.planName.toLowerCase();

          return (
            <div
              key={plan.planName}
              className={`relative p-6 border rounded-2xl shadow-md transition-all duration-200 ${
                isCurrent
                  ? "border-green-600 bg-green-50 dark:bg-green-900/20"
                  : "border-gray-200 dark:border-gray-700 dark:bg-secondary"
              }`}
            >
              <div className="absolute top-3 right-3">
                {isCurrent && (
                  <span className="bg-green-500 text-white px-3 py-1 text-xs rounded-full font-semibold shadow">
                    Current Plan
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold mb-1 text-primary">
                {plan.planName}
              </h3>
              <div className="text-2xl font-semibold mb-1">₹{plan.price}</div>
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
                onClick={() => !isCurrent && onSelectPlan(plan)}
                disabled={isCurrent}
                className={`w-full px-4 py-2 rounded-lg font-semibold transition ${
                  isCurrent
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-primary text-white hover:brightness-95"
                }`}
              >
                {isCurrent ? "Current Plan" : `Upgrade to ${plan.planName}`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);

// ------------------ LANDING PAGE ------------------
const PremiumLandingPage = ({ plans, onSubscribe }) => (
  <div className="max-w-6xl mx-auto animate-fade-in">
    <h1 className="text-4xl font-extrabold text-center mb-8">
      Upgrade to <span className="text-primary">QuickBite Premium</span>
    </h1>
    <section className="grid md:grid-cols-3 gap-6 mb-12">
      <Benefit
        icon={<FaTruck />}
        title="Unlimited Free Delivery"
        desc="Order as often as you like without delivery fees."
      />
      <Benefit
        icon={<FaTags />}
        title="Exclusive Member Discounts"
        desc="Special offers and priority deals."
      />
      <Benefit
        icon={<FaHeadset />}
        title="24×7 VIP Support"
        desc="Always-on assistance for any need."
      />
    </section>
    <section className="mb-12">
      <h2 className="text-2xl font-semibold mb-4">Choose Your Plan</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.planName}
            className="p-6 border rounded-2xl shadow hover:scale-[1.03] transition cursor-pointer bg-white dark:bg-secondary"
          >
            <h3 className="text-xl font-bold text-primary">{plan.planName}</h3>
            <div className="text-2xl font-semibold">₹{plan.price}</div>
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
          </div>
        ))}
      </div>
    </section>
    <ComparisonTable />
    <Testimonials />
    <FAQ />
    <FloatingCTA onClick={() => onSubscribe(plans[0])} />
  </div>
);

// ------------------ OTHER COMPONENTS ------------------
const PremiumMemberView = ({
  planInfo,
  onCancel,
  onUpgrade,
  user,
  isExpiredView,
}) => {
  const start = moment(planInfo?.startDate || moment());
  const end = moment(planInfo?.endDate || moment().add(30, "days"));
  const now = moment();

  const startOfDay = start.clone().startOf("day");
  const endOfDay = end.clone().endOf("day");

  const totalMs = Math.max(1, endOfDay.valueOf() - startOfDay.valueOf());
  const elapsedMs = isExpiredView
    ? totalMs
    : Math.max(0, Math.min(now.valueOf() - startOfDay.valueOf(), totalMs));
  const progressPercent = Math.min(
    100,
    Math.round((elapsedMs / totalMs) * 100)
  );

  const remainingMs = Math.max(0, endOfDay.valueOf() - now.valueOf());
  const remainingDays = Math.ceil(remainingMs / (24 * 60 * 60 * 1000));
  const totalDays = Math.ceil(totalMs / (24 * 60 * 60 * 1000));

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div
        className={`bg-gradient-to-r ${
          isExpiredView
            ? "from-red-100 to-red-200 dark:from-red-900 dark:to-red-800"
            : "from-yellow-100 to-white dark:from-yellow-800 dark:to-secondary"
        } rounded-2xl p-8 shadow-lg mb-6 border dark:border-gray-700 transition-all`}
      >
        <div className="flex items-center gap-4 mb-3">
          <div className="rounded-full bg-yellow-300 dark:bg-yellow-700 p-3 text-yellow-900 dark:text-yellow-100 shadow-md ring-4 ring-yellow-200/40">
            <FaCrown className="text-3xl" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold">
              {isExpiredView ? "⚠️ Your plan has expired" : "🎉 You're a"}{" "}
              <span className="text-primary">{planInfo.planName}</span> member
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Welcome back, {user?.name || "Valued Member"} — enjoy your premium
              perks.
            </p>
          </div>
        </div>
        <div className="mt-5 grid md:grid-cols-2 gap-4 items-center">
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">
              Valid till
            </div>
            <div className="text-xl font-bold mb-1">
              {moment(planInfo.endDate).format("MMMM Do, YYYY")}
            </div>
            {!isExpiredView && (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {remainingDays} day{remainingDays !== 1 ? "s" : ""} left
              </div>
            )}
            <div className="mt-4">
              <div
                className="relative h-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
                role="progressbar"
                aria-valuenow={progressPercent}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className={`absolute inset-0 h-full ${
                    isExpiredView
                      ? "bg-red-400"
                      : "bg-gradient-to-r from-yellow-400 to-orange-500"
                  } transition-all duration-700`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                <span>{startOfDay.format("Do MMM, YYYY")}</span>
                <span>{endOfDay.format("Do MMM, YYYY")}</span>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {progressPercent}% used — {totalDays} day
                {totalDays !== 1 ? "s" : ""} total
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <QuickPerkButton
              icon={<FaTruck />}
              label="Order with Free Delivery"
            />
            <QuickPerkButton icon={<FaHeadset />} label="Contact VIP Support" />
            <QuickPerkButton icon={<FaTags />} label="View Exclusive Offers" />
          </div>
        </div>
        <div className="mt-7 flex flex-wrap gap-3">
          <button
            onClick={onCancel}
            className={`px-4 py-2 rounded-lg font-semibold shadow transition ${
              isExpiredView
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"
            } text-white`}
          >
            {isExpiredView ? "Renew Subscription" : "Cancel Subscription"}
          </button>
          <button
            onClick={onUpgrade}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold shadow transition"
          >
            Upgrade Plan
          </button>
          <button
            onClick={() =>
              alert("Feature coming soon: Add to cart with premium perks")
            }
            className="bg-primary hover:brightness-95 text-white px-4 py-2 rounded-lg font-semibold shadow transition"
          >
            Use Your Perks
          </button>
        </div>
      </div>
      <section className="grid md:grid-cols-3 gap-6">
        <PerkCard
          title="Unlimited Free Deliveries"
          desc="No delivery charges on all orders."
          icon={<FaTruck />}
        />
        <PerkCard
          title="Member Offers"
          desc="Exclusive discounts and early access to promotions."
          icon={<FaTags />}
        />
        <PerkCard
          title="24×7 VIP Support"
          desc="Priority support line for any order issues."
          icon={<FaHeadset />}
        />
      </section>
    </div>
  );
};

const QuickPerkButton = ({ icon, label }) => (
  <button className="flex items-center gap-3 px-4 py-2 bg-white dark:bg-primary/10 rounded-lg border dark:border-gray-700 shadow-sm hover:shadow-md transition">
    <div className="text-primary text-lg">{icon}</div>
    <div className="text-sm font-medium">{label}</div>
  </button>
);

const Benefit = ({ icon, title, desc }) => (
  <div className="flex flex-col items-center text-center p-4 bg-white dark:bg-secondary rounded-xl shadow">
    <div className="text-4xl text-primary mb-3">{icon}</div>
    <h3 className="font-bold">{title}</h3>
    <p className="text-sm text-gray-600 dark:text-gray-400">{desc}</p>
  </div>
);

const PerkCard = ({ icon, title, desc }) => (
  <div className="bg-white dark:bg-secondary p-4 rounded-xl shadow-md border dark:border-gray-700 flex gap-4 items-start hover:scale-[1.02] transition-transform">
    <div className="text-3xl text-primary">{icon}</div>
    <div>
      <div className="font-semibold">{title}</div>
      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
        {desc}
      </div>
    </div>
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

const Testimonials = () => (
  <div className="mt-12">
    <h2 className="text-2xl font-semibold mb-4">What Members Say</h2>
    <div className="grid md:grid-cols-3 gap-6">
      <Testimonial
        name="Priya"
        text="QuickBite Premium has saved me so much on delivery fees!"
      />
      <Testimonial name="Ravi" text="The VIP support is worth every rupee." />
      <Testimonial
        name="Anita"
        text="Exclusive discounts make it totally worth it."
      />
    </div>
  </div>
);

const Testimonial = ({ name, text }) => (
  <div className="p-4 bg-white dark:bg-secondary rounded-xl shadow">
    <FaStar className="text-yellow-500 mb-2" />
    <p className="italic">"{text}"</p>
    <div className="mt-2 font-bold">- {name}</div>
  </div>
);

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

const FloatingCTA = ({ onClick }) => (
  <button
    onClick={onClick}
    className="fixed bottom-6 right-6 bg-primary text-white px-5 py-3 rounded-full shadow-lg hover:brightness-95 flex items-center gap-2"
  >
    <FaGift /> Get Premium
  </button>
);

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-[60vh]">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary"></div>
  </div>
);

export default CustomerPremium;
