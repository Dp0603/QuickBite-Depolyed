import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

const CustomerPaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const order = location.state?.order;

  console.log("✅ Received Order:", order); // 👈 Debug order object

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 text-gray-800 dark:text-white">
      <div className="bg-white dark:bg-secondary p-8 rounded-2xl shadow-md border dark:border-gray-700 max-w-lg w-full text-center animate-fade-in">
        {/* ✅ Success Icon */}
        <FaCheckCircle className="text-green-500 text-5xl mb-4 mx-auto" />

        {/* ✅ Message */}
        <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Thank you for your order. Your food is being prepared and will be
          delivered soon.
        </p>

        {/* ✅ Order Summary */}
        {order ? (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 text-left text-sm mb-6 border dark:border-gray-700">
            <p>
              <strong>Order ID:</strong> {order.orderId || order._id || "N/A"}
            </p>
            <p className="mt-2">
              <strong>Items:</strong>
            </p>

            {Array.isArray(order.items) && order.items.length > 0 ? (
              <ul className="list-disc pl-5 mt-1 mb-2 text-gray-600 dark:text-gray-300">
                {order.items.map((item, index) => (
                  <li key={index}>
                    {item.name || item.title || "Item"} × {item.quantity ?? 1} =
                    ₹
                    {(
                      Number(item.price || 0) * Number(item.quantity || 1)
                    ).toFixed(2)}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No items found in order.
              </p>
            )}

            <p>
              <strong>Total:</strong> ₹{Number(order.total || 0).toFixed(2)}
            </p>
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Order summary not available.
          </p>
        )}

        {/* ✅ Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate("/customer/orders")}
            className="w-full bg-primary hover:bg-orange-600 text-white py-2 rounded-xl transition font-semibold"
          >
            View My Orders
          </button>
          <button
            onClick={() => navigate("/customer")}
            className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-2 rounded-xl transition font-semibold"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerPaymentSuccess;
