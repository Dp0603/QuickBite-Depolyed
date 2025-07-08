import React from "react";

const CustomerCheckout = () => {
  return (
    <div className="p-6 text-gray-800 dark:text-white max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🧾 Checkout</h1>

      {/* Address Section */}
      <div className="bg-white dark:bg-secondary p-5 rounded-xl shadow border dark:border-gray-700 mb-6">
        <h2 className="text-xl font-semibold mb-3">📍 Delivery Address</h2>
        <p>123, MG Road, Bengaluru</p>
        <p>Phone: +91 98765 43210</p>
      </div>

      {/* Payment Section */}
      <div className="bg-white dark:bg-secondary p-5 rounded-xl shadow border dark:border-gray-700 mb-6">
        <h2 className="text-xl font-semibold mb-3">💳 Payment Method</h2>
        <p>Razorpay (UPI/Card/Wallet)</p>
      </div>

      {/* Order Summary */}
      <div className="bg-white dark:bg-secondary p-5 rounded-xl shadow border dark:border-gray-700 mb-6">
        <h2 className="text-xl font-semibold mb-3">🧂 Order Summary</h2>
        <ul className="text-sm mb-3">
          <li className="flex justify-between">
            <span>Margherita Pizza × 1</span>
            <span>₹299</span>
          </li>
          <li className="flex justify-between">
            <span>Garlic Bread × 1</span>
            <span>₹99</span>
          </li>
        </ul>
        <div className="flex justify-between font-medium">
          <span>Total</span>
          <span>₹398</span>
        </div>
      </div>

      <button className="w-full bg-primary hover:bg-orange-600 text-white py-3 rounded-xl font-semibold transition">
        Proceed to Pay
      </button>
    </div>
  );
};

export default CustomerCheckout;
