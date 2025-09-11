// src/pages/customer/CustomerPremiumTile.jsx
import React from "react";

const CustomerPremiumTile = ({ icon, title, desc }) => (
  <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-secondary rounded-xl shadow">
    <div className="text-4xl mb-3">{icon}</div>
    <h3 className="font-bold">{title}</h3>
    <p className="text-sm text-gray-600 dark:text-gray-400">{desc}</p>
  </div>
);

export default CustomerPremiumTile;
