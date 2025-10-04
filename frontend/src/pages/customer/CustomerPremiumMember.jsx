import React from "react";
import { motion } from "framer-motion";
import moment from "moment";
import CountUp from "react-countup";
import { FaCrown, FaTruck, FaTags, FaHeadset } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// Reusable PerkCard component
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

// Reusable QuickPerkButton component
const QuickPerkButton = ({ icon, label, to, onClick }) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => {
        if (onClick) return onClick();
        if (to) return navigate(to);
      }}
      className="flex items-center gap-3 px-4 py-2 bg-white dark:bg-primary/10 rounded-lg border dark:border-gray-700 shadow-sm hover:shadow-md transition"
    >
      <div className="text-primary text-lg">{icon}</div>
      <div className="text-sm font-medium">{label}</div>
    </button>
  );
};

const CustomerPremiumMember = ({
  planInfo,
  onCancel,
  onUpgrade,
  user,
  isExpiredView,
  savedAmount,
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
      {/* Membership Card */}
      <motion.div
        layout
        transition={{ duration: 0.35 }}
        className={`bg-gradient-to-r ${
          isExpiredView
            ? "from-red-100 to-red-200 dark:from-red-900 dark:to-red-800"
            : "from-yellow-100 to-white dark:from-yellow-800 dark:to-secondary"
        } rounded-2xl p-8 shadow-lg mb-6 border dark:border-gray-700`}
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

        {/* Progress */}
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
                <motion.div
                  className={`${
                    isExpiredView
                      ? "bg-red-400"
                      : "bg-gradient-to-r from-yellow-400 to-orange-500"
                  } absolute inset-0 h-full`}
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.9 }}
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

          {/* Quick Actions */}
          <div className="flex flex-col gap-3">
            <QuickPerkButton
              icon={<FaTruck />}
              label="Order with Free Delivery"
              to="/customer/browse"
            />
            <QuickPerkButton
              icon={<FaHeadset />}
              label="Contact VIP Support"
              onClick={() => alert("Opening VIP support - coming soon")}
            />
            <QuickPerkButton
              icon={<FaTags />}
              label="View Exclusive Offers"
              to="/customer/offers"
            />
          </div>
        </div>

        {/* Buttons */}
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
      </motion.div>

      {/* Perks */}
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

      {/* Savings and Membership details */}
      <div className="mt-8 flex gap-6 items-center flex-wrap">
        <div className="bg-white dark:bg-secondary p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500">You’ve saved</div>
          <div className="text-2xl font-bold">
            <CountUp
              end={savedAmount}
              duration={1.6}
              separator=","
              prefix="₹"
            />
          </div>
          <div className="text-sm text-gray-400">since joining Premium</div>
        </div>
        <div className="p-4 rounded-lg border dark:border-gray-700 bg-white dark:bg-secondary">
          <div className="text-sm text-gray-500">Membership</div>
          <div className="flex items-center gap-2">
            <FaCrown className="text-yellow-500" />
            <div className="font-semibold">{planInfo.planName}</div>
            <div className="text-xs text-gray-400">• Premium</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerPremiumMember;
