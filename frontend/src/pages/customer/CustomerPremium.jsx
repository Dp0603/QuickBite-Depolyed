import React, { useState, useEffect, useContext } from "react";
import {
  FaTruck,
  FaTags,
  FaHeadset,
  FaCrown,
  FaCheckCircle,
} from "react-icons/fa";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import moment from "moment";

const CustomerPremium = () => {
  const [selectedPlan, setSelectedPlan] = useState("monthly");
  const [planInfo, setPlanInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token, user } = useContext(AuthContext);

  // Fetch subscription status
  const fetchPlan = async () => {
    if (!user?._id) return;
    setLoading(true);
    try {
      const res = await API.get(`/premium/subscriptions`, {
        params: {
          subscriberType: "User",
          subscriberId: user._id,
        },
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

  // Subscribe user
  const handleSubscribe = async () => {
    if (!user?._id) return alert("User not found.");

    try {
      const planDetails =
        selectedPlan === "monthly"
          ? { planName: "Gold", price: 199, durationInDays: 30 }
          : { planName: "Gold", price: 1999, durationInDays: 365 };

      // 1. Create Razorpay order on backend for premium subscription
      const { data } = await API.post(
        "/payment/create-premium-order",
        { amount: planDetails.price },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { razorpayOrderId, amount, currency } = data;

      // 2. Razorpay checkout options
      const options = {
        key: "rzp_test_GDBH9Rf7wvZ3R6", // replace with your key or env variable
        amount: amount * 100, // paise
        currency,
        name: "QuickBite Premium",
        description: `${planDetails.planName} Plan Subscription`,
        order_id: razorpayOrderId,
        handler: async function (response) {
          try {
            // 3. Verify payment & create subscription on backend
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
            fetchPlan(); // refresh subscription info
          } catch (err) {
            console.error("Payment verification failed", err);
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: "#F37254",
        },
      };

      // 4. Open Razorpay checkout
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Subscription initiation failed", err);
      alert("Subscription failed to start. Please try again.");
    }
  };

  // Cancel subscription handler
  const handleCancelSubscription = async () => {
    if (!planInfo?._id) return alert("No active subscription found.");

    if (!window.confirm("Are you sure you want to cancel your subscription?"))
      return;

    try {
      await API.delete(`/premium/subscriptions/${planInfo._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Subscription cancelled successfully.");
      setPlanInfo(null);
    } catch (err) {
      console.error("Failed to cancel subscription:", err);
      alert("Failed to cancel subscription. Please try again.");
    }
  };

  useEffect(() => {
    fetchPlan();
  }, [user?._id]);

  return (
    <div className="p-6 text-gray-800 dark:text-white">
      {/* Header */}
      <div className="text-center mb-10">
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

      {/* Current Subscription */}
      {loading ? (
        <div className="text-center">Checking subscription...</div>
      ) : planInfo ? (
        <>
          <div className="max-w-xl mx-auto bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 p-4 mb-4 rounded-lg flex items-center justify-between shadow">
            <div className="flex items-center gap-3">
              <FaCheckCircle className="text-xl text-green-500" />
              <span className="font-semibold">
                You're a <b>{planInfo.planName}</b> Premium Member <br />
                Valid till: {moment(planInfo.endDate).format("MMMM Do, YYYY")}
              </span>
            </div>
          </div>

          {/* Cancel Subscription Button */}
          <div className="text-center mb-8">
            <button
              onClick={handleCancelSubscription}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition"
            >
              Cancel Subscription
            </button>
          </div>
        </>
      ) : null}

      {/* Benefits */}
      <section className="grid md:grid-cols-2 gap-6 mb-12 max-w-5xl mx-auto">
        <Benefit icon={<FaTruck />} label="Unlimited Free Deliveries" />
        <Benefit icon={<FaTags />} label="Exclusive Member-Only Offers" />
        <Benefit icon={<FaHeadset />} label="24×7 VIP Support Access" />
        <Benefit icon={<FaCrown />} label="Premium Badge on Your Profile" />
      </section>

      {/* Subscription Plans */}
      {!planInfo && !loading && (
        <div className="max-w-4xl mx-auto">
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
              disabled={!!planInfo}
              className={`${
                planInfo ? "opacity-50 cursor-not-allowed" : ""
              } bg-gradient-to-r from-primary to-orange-500 hover:brightness-110 text-white font-semibold px-8 py-3 rounded-2xl shadow-md transition-all text-lg`}
            >
              Subscribe Now
            </button>
            <p className="text-xs text-gray-500 mt-2 dark:text-gray-400">
              Secure payment integration coming soon
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// Benefit Component
const Benefit = ({ icon, label }) => (
  <div className="flex items-center gap-4 bg-white dark:bg-secondary p-5 rounded-xl shadow-md border dark:border-gray-700">
    <div className="text-primary text-3xl">{icon}</div>
    <p className="font-medium text-lg">{label}</p>
  </div>
);

// Plan Card Component
const PlanCard = ({ title, price, highlight, selected, onSelect }) => (
  <div
    className={`relative p-6 border rounded-2xl cursor-pointer transition-all shadow-md bg-white dark:bg-secondary ${
      selected
        ? "border-primary ring-2 ring-primary"
        : "border-gray-200 dark:border-gray-700"
    }`}
    onClick={onSelect}
  >
    {selected && (
      <div className="absolute -top-3 -right-3 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
        Selected
      </div>
    )}
    <div className="flex justify-between items-center mb-2">
      <h3 className="text-xl font-bold">{title}</h3>
      {highlight && (
        <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full">
          {highlight}
        </span>
      )}
    </div>
    <p className="text-4xl font-bold text-primary">{price}</p>
    <p className="text-sm text-gray-500 mt-2">Full access to premium perks</p>
  </div>
);

export default CustomerPremium;
