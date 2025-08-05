import React from "react";
import { FaTimesCircle } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

const CustomerPaymentFailure = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    reason = "The payment was cancelled or failed unexpectedly.",
    amount = 0,
    restaurantId = null,
  } = location.state || {};

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 text-gray-800 dark:text-white">
      <div className="bg-white dark:bg-secondary p-8 rounded-2xl shadow-lg border dark:border-gray-700 max-w-2xl w-full animate-fade-in">
        <div className="text-center">
          <FaTimesCircle className="text-red-500 text-5xl mb-4 mx-auto" />
          <h1 className="text-3xl font-bold mb-1">Payment Failed</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{reason}</p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-sm border dark:border-gray-600">
          <p className="mb-2">
            <strong>Amount:</strong> ₹{Number(amount).toFixed(2)}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            ⚠️ No payment was made. You can go back to your cart to update your
            order.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <button
            onClick={() => navigate("/customer/cart")}
            className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-2 rounded-xl transition font-semibold"
          >
            🛒 Back to Cart
          </button>
          <button
            onClick={() => navigate("/customer")}
            className="w-full bg-primary hover:bg-orange-600 text-white py-2 rounded-xl transition font-semibold"
          >
            🏠 Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerPaymentFailure;
