// src/pages/customer/CustomerPremiumMember.jsx
import React from "react";
import moment from "moment";
import CustomerPremiumPerkItem from "./CustomerPremiumPerkItems";
import CustomerPremiumSavingsCard from "./CustomerPremiumSavingCard";

const CustomerPremiumMember = ({ planInfo, user }) => {
  // Days remaining until plan ends
  const remainingDays = moment(planInfo.endDate).diff(moment(), "days");

  // ✅ Ensure perks is always an array to avoid errors
  const perksArray = Array.isArray(planInfo.perks) ? planInfo.perks : [];

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">
        🎉 You’re a {planInfo.planName} member
      </h2>

      <p className="text-gray-600 dark:text-gray-300">
        Valid till {moment(planInfo.endDate).format("Do MMMM, YYYY")} (
        {remainingDays} days left)
      </p>

      <div className="grid md:grid-cols-3 gap-6 mt-6">
        {perksArray.map((perk, index) => (
          <CustomerPremiumPerkItem key={index} perk={perk} />
        ))}
      </div>

      <div className="mt-6">
        <CustomerPremiumSavingsCard savedAmount={planInfo.totalSavings || 0} />
      </div>
    </div>
  );
};

export default CustomerPremiumMember;
