import React from "react";
import { motion } from "framer-motion";
import moment from "moment";
import CountUp from "react-countup";
import {
  FaCrown,
  FaTruck,
  FaTags,
  FaHeadset,
  FaGift,
  FaBolt,
  FaFire,
  FaCheckCircle,
  FaExclamationCircle,
  FaArrowRight,
  FaStar,
  FaCalendarAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// Perk Card Component
const PerkCard = ({ icon, title, desc, gradient, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="group relative h-full"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

    <div className="relative h-full min-h-[240px] flex flex-col justify-between p-6 rounded-3xl bg-white dark:bg-slate-900 border border-orange-200 dark:border-white/10 shadow-md hover:shadow-xl transition-all duration-300">
      <div className="flex flex-col flex-1 items-start gap-4">
        <div
          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-110 transition-transform flex-shrink-0`}
        >
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">
            {title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {desc}
          </p>
        </div>
      </div>
    </div>
  </motion.div>
);

// Quick Action Button
const QuickPerkButton = ({ icon, label, to, onClick, gradient }) => {
  const navigate = useNavigate();
  return (
    <motion.button
      onClick={() => {
        if (onClick) return onClick();
        if (to) return navigate(to);
      }}
      className={`flex items-center justify-between gap-3 px-5 py-4 rounded-2xl bg-gradient-to-r ${gradient} text-white font-semibold shadow-lg hover:shadow-xl transition-all group`}
      whileHover={{ scale: 1.02, x: 5 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center gap-3">
        <div className="text-2xl">{icon}</div>
        <span>{label}</span>
      </div>
      <FaArrowRight className="opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
    </motion.button>
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
    <div className="max-w-7xl mx-auto">
      {/* Status Banner */}
      {isExpiredView && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-5 rounded-3xl bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-xl"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <FaExclamationCircle className="text-2xl" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg">Your Premium has expired</h3>
              <p className="text-white/90 text-sm">
                Renew now to continue enjoying exclusive benefits
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Membership Card */}
      <motion.div
        layout
        transition={{ duration: 0.4 }}
        className="relative mb-8 overflow-hidden rounded-3xl shadow-2xl border border-orange-200 dark:border-white/10"
      >
        {/* Background */}
        <div
          className={`absolute inset-0 ${
            isExpiredView
              ? "bg-gradient-to-br from-red-500 via-pink-600 to-red-500"
              : "bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-600"
          }`}
        ></div>
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?auto=format&fit=crop&w=1600&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>

        {/* Content */}
        <div className="relative z-10 p-8 md:p-10 text-white">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
            <div className="flex items-start gap-4">
              <motion.div
                className="relative"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                <div className="absolute inset-0 bg-white rounded-2xl blur-xl opacity-50"></div>
                <div className="relative w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center ring-4 ring-white/30">
                  <FaCrown className="text-4xl text-yellow-300" />
                </div>
              </motion.div>

              <div>
                <motion.h2
                  className="text-3xl md:text-4xl font-black mb-2 drop-shadow-lg"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                >
                  {isExpiredView ? (
                    <>Plan Expired</>
                  ) : (
                    <>
                      Welcome,{" "}
                      <span className="text-yellow-300">
                        {planInfo.planName}
                      </span>{" "}
                      Member!
                    </>
                  )}
                </motion.h2>
                <p className="text-white/90 text-lg">
                  {isExpiredView
                    ? "Your premium benefits have ended"
                    : `Hi ${
                        user?.name || "Valued Member"
                      }, enjoy your exclusive perks! 🎉`}
                </p>
              </div>
            </div>

            {/* Savings Badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="self-start px-6 py-4 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg"
            >
              <div className="text-sm text-white/80 mb-1">Total Savings</div>
              <div className="text-3xl font-black flex items-baseline gap-2">
                ₹<CountUp end={savedAmount} duration={1.6} separator="," />
              </div>
            </motion.div>
          </div>

          {/* Progress Section */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <FaCalendarAlt className="text-2xl text-white/80" />
                <div>
                  <div className="text-sm text-white/80">Valid Until</div>
                  <div className="text-2xl font-bold">
                    {moment(planInfo.endDate).format("MMMM Do, YYYY")}
                  </div>
                </div>
              </div>

              {!isExpiredView && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30">
                  <FaBolt className="text-yellow-300" />
                  <span className="font-bold">
                    {remainingDays} day{remainingDays !== 1 ? "s" : ""}{" "}
                    remaining
                  </span>
                </div>
              )}

              {/* Progress Bar */}
              <div className="mt-6">
                <div className="relative h-5 w-full bg-white/20 rounded-full overflow-hidden backdrop-blur-sm ring-2 ring-white/30">
                  <motion.div
                    className={`absolute inset-0 h-full ${
                      isExpiredView
                        ? "bg-gradient-to-r from-red-400 to-red-600"
                        : "bg-gradient-to-r from-yellow-300 to-white"
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
                <div className="flex justify-between text-sm text-white/80 mt-3">
                  <span>{startOfDay.format("MMM Do")}</span>
                  <span className="font-bold">{progressPercent}%</span>
                  <span>{endOfDay.format("MMM Do")}</span>
                </div>
              </div>
            </div>

            {/* Right: Quick Actions */}
            <div className="space-y-3">
              <QuickPerkButton
                icon={<FaTruck />}
                label="Free Delivery Orders"
                to="/customer/browse"
                gradient="from-blue-500 to-cyan-600"
              />
              <QuickPerkButton
                icon={<FaTags />}
                label="Exclusive Offers"
                to="/customer/offers"
                gradient="from-purple-500 to-pink-600"
              />
              <QuickPerkButton
                icon={<FaHeadset />}
                label="VIP Support"
                onClick={() => alert("Opening VIP support")}
                gradient="from-orange-500 to-pink-600"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            {isExpiredView ? (
              <motion.button
                onClick={onCancel}
                className="flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-orange-600 font-bold shadow-lg hover:shadow-xl transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaFire />
                Renew Subscription
              </motion.button>
            ) : (
              <motion.button
                onClick={onCancel}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold hover:bg-white/30 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cancel Subscription
              </motion.button>
            )}

            <motion.button
              onClick={onUpgrade}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold hover:bg-white/30 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaCrown />
              Upgrade Plan
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* ✅ Benefits Section (Equal Height Fixed) */}
      <div className="mb-8">
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-black bg-gradient-to-r from-orange-600 to-pink-600 dark:from-orange-400 dark:to-pink-500 bg-clip-text text-transparent mb-6 flex items-center gap-3"
        >
          <FaStar className="text-yellow-500" />
          Your Premium Benefits
        </motion.h3>

        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          <PerkCard
            icon={<FaTruck />}
            title="Unlimited Free Delivery"
            desc="No delivery charges on all orders. Save on every meal!"
            gradient="from-blue-500 to-cyan-600"
            delay={0.1}
          />
          <PerkCard
            icon={<FaTags />}
            title="Exclusive Member Offers"
            desc="Special discounts and early access to promotions."
            gradient="from-purple-500 to-pink-600"
            delay={0.2}
          />
          <PerkCard
            icon={<FaHeadset />}
            title="24×7 VIP Support"
            desc="Priority support line for any order issues."
            gradient="from-orange-500 to-pink-600"
            delay={0.3}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6 items-stretch">
        {/* Total Savings */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="relative group h-full"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          <div className="relative h-full min-h-[230px] flex flex-col justify-between p-6 rounded-3xl bg-white dark:bg-slate-900 border border-orange-200 dark:border-white/10 shadow-md hover:shadow-xl transition-all duration-300">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-2xl shadow-lg">
                  <FaGift />
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Total Savings
                  </div>
                  <div className="text-3xl font-black bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-500 bg-clip-text text-transparent">
                    ₹<CountUp end={savedAmount} duration={1.6} separator="," />
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                You've saved this much since joining Premium!
              </p>
            </div>
          </div>
        </motion.div>

        {/* Membership Tier */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="relative group h-full"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          <div className="relative h-full min-h-[230px] flex flex-col justify-between p-6 rounded-3xl bg-white dark:bg-slate-900 border border-orange-200 dark:border-white/10 shadow-md hover:shadow-xl transition-all duration-300">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white text-2xl shadow-lg">
                  <FaCrown />
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Membership Tier
                  </div>
                  <div className="text-2xl font-black text-gray-900 dark:text-white">
                    {planInfo.planName}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-500 text-sm" />
                  ))}
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  Premium Member
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Days Active */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="relative group h-full"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          <div className="relative h-full min-h-[230px] flex flex-col justify-between p-6 rounded-3xl bg-white dark:bg-slate-900 border border-orange-200 dark:border-white/10 shadow-md hover:shadow-xl transition-all duration-300">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white text-2xl shadow-lg">
                  <FaCalendarAlt />
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {isExpiredView ? "Was Active For" : "Days Remaining"}
                  </div>
                  <div className="text-3xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-500 bg-clip-text text-transparent">
                    {isExpiredView ? totalDays : remainingDays}
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isExpiredView
                  ? "Your membership duration"
                  : `Out of ${totalDays} total days`}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CustomerPremiumMember;

//old
// import React from "react";
// import { motion } from "framer-motion";
// import moment from "moment";
// import CountUp from "react-countup";
// import { FaCrown, FaTruck, FaTags, FaHeadset } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";

// // Reusable PerkCard component
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

// // Reusable QuickPerkButton component
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

// const CustomerPremiumMember = ({
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
//       {/* Membership Card */}
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

//         {/* Progress */}
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

//           {/* Quick Actions */}
//           <div className="flex flex-col gap-3">
//             <QuickPerkButton
//               icon={<FaTruck />}
//               label="Order with Free Delivery"
//               to="/customer/browse"
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

//         {/* Buttons */}
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

//       {/* Perks */}
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

//       {/* Savings and Membership details */}
//       <div className="mt-8 flex gap-6 items-center flex-wrap">
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

// export default CustomerPremiumMember;
