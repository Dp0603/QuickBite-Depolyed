// src/pages/customer/CustomerPremiumSavingsCard.jsx
import React from "react";
import CountUp from "react-countup";

const CustomerPremiumSavingsCard = ({ savedAmount = 0 }) => (
  <div className="bg-white dark:bg-secondary p-4 rounded-xl shadow">
    <div className="text-sm text-gray-500">You’ve saved</div>
    <div className="text-2xl font-bold">
      <CountUp end={savedAmount} duration={1.6} separator="," prefix="₹" />
    </div>
    <div className="text-sm text-gray-400">since joining Premium</div>
  </div>
);

export default CustomerPremiumSavingsCard;
