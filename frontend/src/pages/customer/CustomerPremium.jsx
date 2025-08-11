// src/components/premium/CustomerPremium.jsx
import React, { useState, useEffect, useContext, useMemo } from "react";
import {
  FaTruck,
  FaTags,
  FaHeadset,
  FaCrown,
  FaHeart,
  FaQuestionCircle,
  FaGift,
  FaStar,
} from "react-icons/fa";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import moment from "moment";

/**
 * CustomerPremium
 * Full component with:
 * - PremiumMemberView (for active subscribers)
 * - PremiumLandingPage (for non-members)
 * - Testimonials, FAQ, Comparison table, FloatingCTA
 * - Razorpay payment flow
 * - Accessibility tweaks & null-safe date handling
 */

const CustomerPremium = () => {
  const [selectedPlan, setSelectedPlan] = useState("monthly");
  const [planInfo, setPlanInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token, user } = useContext(AuthContext);

  const fetchPlan = async () => {
    if (!user?._id) {
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
      console.error("Failed to fetch subscription:", err);
      setPlanInfo(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id]);

  const handleSubscribe = async () => {
    if (!user?._id) return alert("User not found.");
    try {
      const planDetails =
        selectedPlan === "monthly"
          ? { planName: "Gold", price: 199, durationInDays: 30 }
          : { planName: "Gold", price: 1999, durationInDays: 365 };

      const { data } = await API.post(
        "/payment/create-premium-order",
        { amount: planDetails.price },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { razorpayOrderId, amount, currency } = data;

      const options = {
        key: "rzp_test_GDBH9Rf7wvZ3R6", // unchanged
        amount: amount * 100, // unchanged
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
          } catch (err) {
            console.error("Payment verification failed", err);
            alert(
              "Payment verification failed. If the amount was deducted, please contact support with your payment ID."
            );
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
          "Payment SDK not loaded. Please ensure Razorpay script is added to your index.html."
        );
        return;
      }
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Subscription initiation failed", err);
      alert("Subscription failed to start. Please try again.");
    }
  };

  const handleCancelSubscription = async () => {
    if (!planInfo?._id) return alert("No active subscription found.");
    if (!window.confirm("Are you sure you want to cancel your subscription?"))
      return;

    try {
      setLoading(true);
      await API.delete(`/premium/subscriptions/${planInfo._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Subscription cancelled successfully.");
      setPlanInfo(null);
    } catch (err) {
      console.error("Failed to cancel subscription:", err);
      alert("Failed to cancel subscription. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 text-gray-800 dark:text-white min-h-[80vh]">
      {loading ? (
        <LoadingSpinner />
      ) : planInfo ? (
        <PremiumMemberView
          planInfo={planInfo}
          onCancel={handleCancelSubscription}
          user={user}
        />
      ) : (
        <PremiumLandingPage
          selectedPlan={selectedPlan}
          setSelectedPlan={setSelectedPlan}
          onSubscribe={handleSubscribe}
          user={user}
        />
      )}
    </div>
  );
};

/* ===========================
   Premium Member View
   =========================== */
const PremiumMemberView = ({ planInfo, onCancel, user }) => {
  const start = planInfo?.startDate ? moment(planInfo.startDate) : moment();
  const end = planInfo?.endDate
    ? moment(planInfo.endDate)
    : moment().add(30, "days");
  const now = moment();

  const startOfDay = start.clone().startOf("day");
  const endOfDay = end.clone().endOf("day");

  const totalMs = Math.max(1, endOfDay.valueOf() - startOfDay.valueOf());
  const elapsedMs = Math.max(
    0,
    Math.min(now.valueOf() - startOfDay.valueOf(), totalMs)
  );

  const progressPercent = Math.min(
    100,
    Math.max(0, Math.round((elapsedMs / totalMs) * 100))
  );

  const remainingMs = Math.max(0, endOfDay.valueOf() - now.valueOf());
  const remainingDays = Math.ceil(remainingMs / (24 * 60 * 60 * 1000));
  const totalDays = Math.ceil(totalMs / (24 * 60 * 60 * 1000));

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      {/* Membership card */}
      <div className="bg-gradient-to-r from-yellow-100 to-white dark:from-yellow-800 dark:to-secondary rounded-2xl p-6 shadow-md mb-6 border">
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-yellow-200 dark:bg-yellow-700 p-3 text-yellow-800 dark:text-yellow-100 shadow-md ring-4 ring-yellow-200/40">
            <FaCrown className="text-2xl" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold">
              🎉 You're a{" "}
              <span className="text-primary">{planInfo.planName}</span> member
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Welcome back, {user?.name || "Valued Member"} — enjoy your premium
              perks.
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-6 grid md:grid-cols-2 gap-4 items-center">
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              Valid till
            </div>
            <div className="text-xl font-bold">
              {planInfo.endDate
                ? moment(planInfo.endDate).format("MMMM Do, YYYY")
                : "N/A"}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {remainingDays} day{remainingDays !== 1 ? "s" : ""} left
            </div>

            <div className="mt-4">
              <div
                className="relative h-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
                role="progressbar"
                aria-valuenow={progressPercent}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="absolute inset-0 h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-700"
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

          {/* Quick actions */}
          <div className="flex flex-col gap-3">
            <QuickPerkButton
              icon={<FaTruck />}
              label="Order with Free Delivery"
            />
            <QuickPerkButton icon={<FaHeadset />} label="Contact VIP Support" />
            <QuickPerkButton icon={<FaTags />} label="View Exclusive Offers" />
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={onCancel}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold shadow"
          >
            Cancel Subscription
          </button>
          <button
            onClick={() =>
              alert("Feature coming soon: Add to cart with premium perks")
            }
            className="bg-primary hover:brightness-95 text-white px-4 py-2 rounded-lg font-semibold shadow"
          >
            Use Your Perks
          </button>
        </div>
      </div>

      {/* Perk cards */}
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

/* ===========================
   Landing Page (non-members)
   =========================== */
const PremiumLandingPage = ({ selectedPlan, setSelectedPlan, onSubscribe }) => (
  <div className="max-w-6xl mx-auto animate-fade-in">
    <h1 className="text-4xl font-bold text-center mb-8">
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
      <div className="flex gap-4" role="radiogroup" aria-label="Premium plans">
        <PlanCard
          label="Monthly"
          price="₹199"
          desc="Billed every month"
          selected={selectedPlan === "monthly"}
          onSelect={() => setSelectedPlan("monthly")}
        />
        <PlanCard
          label="Yearly"
          price="₹1999"
          desc="Billed once a year"
          selected={selectedPlan === "yearly"}
          onSelect={() => setSelectedPlan("yearly")}
        />
      </div>
      <button
        onClick={onSubscribe}
        className="mt-6 bg-primary hover:brightness-95 text-white px-6 py-3 rounded-lg font-semibold shadow"
      >
        Subscribe Now
      </button>
    </section>

    <ComparisonTable />
    <Testimonials />
    <FAQ />
    <FloatingCTA onClick={onSubscribe} />
  </div>
);

/* ===========================
   UI Helpers
   =========================== */
const QuickPerkButton = ({ icon, label }) => (
  <button className="flex items-center gap-3 px-4 py-2 bg-white dark:bg-primary/10 rounded-lg border dark:border-gray-700 shadow-sm hover:shadow-md transition">
    <div className="text-primary text-lg">{icon}</div>
    <div className="text-sm font-medium">{label}</div>
  </button>
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

const Benefit = ({ icon, title, desc }) => (
  <div className="flex flex-col items-center text-center p-4 bg-white dark:bg-secondary rounded-xl shadow">
    <div className="text-4xl text-primary mb-3">{icon}</div>
    <h3 className="font-bold">{title}</h3>
    <p className="text-sm text-gray-600 dark:text-gray-400">{desc}</p>
  </div>
);

const PlanCard = ({ label, price, desc, selected, onSelect }) => (
  <div
    tabIndex={0}
    role="radio"
    aria-checked={selected}
    className={`flex-1 p-6 border rounded-xl cursor-pointer ${
      selected
        ? "border-primary bg-primary/10"
        : "border-gray-300 dark:border-gray-700"
    }`}
    onClick={onSelect}
    onKeyDown={(e) => e.key === "Enter" && onSelect()}
  >
    <h3 className="text-xl font-bold">{label}</h3>
    <div className="text-2xl">{price}</div>
    <p className="text-sm text-gray-600 dark:text-gray-400">{desc}</p>
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
