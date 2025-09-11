// src/pages/customer/CustomerPremiumPerkItem.jsx
import React from "react";

const CustomerPremiumPerkItem = ({ perk }) => (
  <div className="bg-white dark:bg-secondary p-4 rounded-xl shadow flex items-center gap-3">
    <span className="text-green-600">✔</span>
    <span>{perk}</span>
  </div>
);

export default CustomerPremiumPerkItem;
