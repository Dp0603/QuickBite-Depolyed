import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

const CustomerPaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const order = location.state?.order;

  const downloadInvoice = () => {
    if (!order?._id) return;
    window.open(`/api/payment/invoice/${order._id}`, "_blank");
  };

  const formatDateTime = (isoDate) => {
    const d = new Date(isoDate);
    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 text-gray-800 dark:text-white">
      <div className="bg-white dark:bg-secondary p-8 rounded-2xl shadow-lg border dark:border-gray-700 max-w-2xl w-full animate-fade-in">
        <div className="text-center">
          <FaCheckCircle className="text-green-500 text-5xl mb-4 mx-auto" />
          <h1 className="text-3xl font-bold mb-1">Payment Successful!</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Your order has been placed. We’re preparing your delicious food! 🍽️
          </p>
        </div>

        {order && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-sm border dark:border-gray-600">
            {/* Order Info */}
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <p>
                  <strong>Order ID:</strong> {order._id}
                </p>
                <p>
                  <strong>Order Time:</strong> {formatDateTime(order.createdAt)}
                </p>
              </div>
              <div>
                <p>
                  <strong>Payment Status:</strong> {order.paymentStatus}
                </p>
                <p>
                  <strong>Payment Method:</strong> {order.paymentMethod}
                </p>
              </div>
            </div>

            {/* Premium Benefits */}
            {order.premiumApplied && order.premiumBreakdown && (
              <div className="mb-4 p-3 bg-green-50 dark:bg-green-900 rounded text-sm">
                <h4 className="font-semibold text-green-800 dark:text-green-300">
                  💎 Premium Benefits Applied:
                </h4>
                {order.premiumBreakdown.freeDelivery > 0 && (
                  <p className="text-green-600 dark:text-green-300">
                    Free Delivery: ₹
                    {order.premiumBreakdown.freeDelivery.toFixed(0)}
                  </p>
                )}
                {order.premiumBreakdown.extraDiscount > 0 && (
                  <p className="text-green-600 dark:text-green-300">
                    Extra Discount: ₹
                    {order.premiumBreakdown.extraDiscount.toFixed(0)}
                  </p>
                )}
                {order.premiumBreakdown.cashback > 0 && (
                  <p className="text-green-600 dark:text-green-300">
                    Cashback Eligible: ₹
                    {order.premiumBreakdown.cashback.toFixed(0)}
                  </p>
                )}
              </div>
            )}

            {/* Items Ordered */}
            <div className="mb-4">
              <p className="font-semibold mb-2">Items Ordered:</p>
              {order.items.map((item, index) => (
                <p key={index} className="text-gray-700 dark:text-gray-300">
                  {item.name || "Item"} × {item.quantity} = ₹
                  {(item.price * item.quantity).toFixed(2)}
                </p>
              ))}
            </div>

            <hr className="my-4 border-gray-300 dark:border-gray-700" />

            {/* Billing */}
            <div className="grid grid-cols-2 text-sm gap-1">
              <span>Subtotal:</span>
              <span className="text-right">
                ₹{order.subtotal?.toFixed(2) || "0.00"}
              </span>
              <span>Tax:</span>
              <span className="text-right">
                ₹{order.tax?.toFixed(2) || "0.00"}
              </span>
              <span>Delivery Fee:</span>
              <span className="text-right">
                ₹{order.deliveryFee?.toFixed(2) || "0.00"}
              </span>
              <span>Discount:</span>
              <span className="text-right text-green-600">
                –₹{order.discount?.toFixed(2) || "0.00"}
              </span>

              {/* Premium Savings */}
              {order.premiumApplied && (
                <>
                  <span>Premium Savings:</span>
                  <span className="text-right text-green-600">
                    ₹{order.savings?.toFixed(2)}
                  </span>
                </>
              )}

              <span className="font-semibold">Total Paid:</span>
              <span className="text-right font-semibold">
                ₹{order.totalAmount?.toFixed(2)}
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <button
            onClick={downloadInvoice}
            className="w-full bg-green-100 dark:bg-green-700 hover:bg-green-200 dark:hover:bg-green-600 text-green-800 dark:text-white py-2 rounded-xl transition font-semibold"
          >
            📄 Download Invoice
          </button>

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
