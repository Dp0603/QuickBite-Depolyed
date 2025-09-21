import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import { FaArrowLeft, FaDownload } from "react-icons/fa";

const formatPrice = (value) => `₹${Number(value || 0).toFixed(2)}`;

const CustomerOrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (!user || !orderId) return;

    const fetchOrder = async () => {
      try {
        const res = await API.get(`/orders/orders/${orderId}`);
        setOrder(res.data.order);
      } catch (err) {
        console.error("❌ Failed to fetch order details:", err);
      }
    };

    fetchOrder();
  }, [orderId, user]);

  const downloadInvoice = () => {
    if (!order?._id) return;
    window.open(`/api/payment/invoice/${order._id}`, "_blank");
  };

  if (!order) {
    return (
      <div className="px-4 py-10 text-center text-gray-600 dark:text-gray-300">
        Loading order details...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 text-gray-800 dark:text-white">
      <h1 className="text-3xl font-bold mb-6">📄 Order Details</h1>

      {/* Order Summary */}
      <div className="bg-white dark:bg-secondary rounded-lg shadow p-6 mb-8">
        <div className="mb-4">
          <p className="text-sm text-gray-500">Order ID:</p>
          <p className="text-lg font-semibold">{order._id}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Order Date:</p>
            <p>{new Date(order.createdAt).toLocaleString()}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Status:</p>
            <p className="font-medium">{order.orderStatus}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Payment:</p>
            <p className="font-medium">
              {order.paymentStatus} via {order.paymentMethod}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Restaurant:</p>
            <p className="font-medium">{order.restaurantId?.name || "N/A"}</p>
          </div>
        </div>
      </div>

      {/* Items Ordered */}
      <div className="bg-white dark:bg-secondary rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">🍽️ Items Ordered</h2>
        <ul className="divide-y divide-gray-200 dark:divide-gray-600">
          {order.items.map((item) => (
            <li key={item._id || item.menuItemId?._id} className="py-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">
                    {item.menuItemId?.name || item.name} × {item.quantity}
                  </p>
                  {item.note && (
                    <p className="text-xs text-gray-500 italic">
                      Note: {item.note}
                    </p>
                  )}
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-200">
                  {formatPrice(item.price || item.menuItemId?.price)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Billing Section */}
      <div className="bg-white dark:bg-secondary rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">💰 Billing</h2>
        <div className="space-y-2">
          {/* Subtotal */}
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>

          {/* Tax */}
          <div className="flex justify-between">
            <span>Tax:</span>
            <span>{formatPrice(order.tax)}</span>
          </div>

          {/* Delivery Fee */}
          <div className="flex justify-between">
            <span>
              Delivery Fee
              {order.premiumApplied && order.premiumBreakdown.freeDelivery > 0
                ? ` (₹${order.premiumBreakdown.freeDelivery} saved with Premium)`
                : ""}
              :
            </span>
            <span>
              {order.premiumApplied && order.premiumBreakdown.freeDelivery > 0
                ? "Free"
                : formatPrice(order.deliveryFee)}
            </span>
          </div>

          {/* Discount */}
          {order.discount > 0 && (
            <div className="flex justify-between text-green-600 font-medium">
              <span>Discount:</span>
              <span>-{formatPrice(order.discount)}</span>
            </div>
          )}

          {/* Extra Premium Savings (if any other perks like extraDiscount) */}
          {order.premiumApplied && order.premiumBreakdown.extraDiscount > 0 && (
            <div className="flex justify-between text-yellow-700 dark:text-yellow-400 font-medium">
              <span>Premium Extra Discount:</span>
              <span>-{formatPrice(order.premiumBreakdown.extraDiscount)}</span>
            </div>
          )}

          <hr className="border-t dark:border-gray-600 my-2" />

          {/* Total */}
          <div className="flex justify-between font-bold text-lg">
            <span>Total:</span>
            <span>{formatPrice(order.totalAmount)}</span>
          </div>
        </div>
      </div>

      {/* Delivery Info */}
      <div className="bg-white dark:bg-secondary rounded-lg shadow p-6 mb-10">
        <h2 className="text-xl font-semibold mb-4">🚚 Delivery</h2>
        <p>
          <span className="text-sm text-gray-500">Status: </span>
          <span className="font-medium">
            {order.deliveryDetails?.deliveryStatus || order.orderStatus}
          </span>
        </p>
        {order.deliveryDetails?.deliveryAgentId && (
          <p>
            <span className="text-sm text-gray-500">Delivery Agent: </span>
            <span className="font-medium">
              {order.deliveryDetails.deliveryAgentId.name || "Assigned"}
            </span>
          </p>
        )}
        {order.deliveryDetails?.deliveryTime && (
          <p>
            <span className="text-sm text-gray-500">Expected Delivery: </span>
            <span className="font-medium">
              {new Date(order.deliveryDetails.deliveryTime).toLocaleString()}
            </span>
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => navigate("/customer/orders")}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          <FaArrowLeft /> Back to Orders
        </button>

        <button
          onClick={downloadInvoice}
          className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-700 text-green-800 dark:text-white rounded-md font-medium hover:bg-green-200 dark:hover:bg-green-600 transition"
        >
          <FaDownload /> Download Invoice
        </button>
      </div>
    </div>
  );
};

export default CustomerOrderDetails;
