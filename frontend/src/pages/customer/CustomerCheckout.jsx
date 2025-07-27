import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const CustomerCheckout = () => {
  const { user, token } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [placingOrder, setPlacingOrder] = useState(false);

  // ✅ Destructure data passed from Cart page
  const {
    cartItems = [],
    subtotal = 0,
    tax = 0,
    deliveryFee = 0,
    appliedDiscount = 0,
    totalPayable = 0,
    selectedOfferId = null,
    offer = null,
  } = location.state || {};

  // 🔒 Redirect if no data passed (e.g. user refreshed the page)
  useEffect(() => {
    if (!location.state || cartItems.length === 0) {
      navigate("/cart");
    }
  }, [location.state, cartItems, navigate]);

  // 🧾 Place Order
  const handlePlaceOrder = async () => {
    if (placingOrder) return;
    setPlacingOrder(true);

    try {
      const payload = {
        customerId: user._id,
        restaurantId: cartItems[0]?.restaurantId || null,
        items: cartItems.map((item) => ({
          menuItemId: item.menuItemId || item.id || item._id,
          quantity: item.quantity,
          note: item.note || "",
        })),
        subtotal,
        tax,
        deliveryFee,
        discount: appliedDiscount,
        totalAmount: totalPayable,
        offerId: selectedOfferId || null,
        paymentMethod: "Razorpay",
      };

      const res = await axios.post("/api/customer/orders", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      navigate("/customer/payment-success", {
        state: { order: res.data.order },
      });
    } catch (err) {
      console.error("❌ Error placing order:", err);
      alert("Failed to place order. Please try again.");
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="p-6 text-gray-800 dark:text-white max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🧾 Checkout</h1>

      {/* 📍 Delivery Address */}
      <div className="bg-white dark:bg-secondary p-5 rounded-xl shadow border dark:border-gray-700 mb-6">
        <h2 className="text-xl font-semibold mb-3">📍 Delivery Address</h2>
        <p>123, MG Road, Bengaluru</p>
        <p>Phone: +91 98765 43210</p>
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          🚚 Estimated Delivery: 30–40 mins
        </div>
      </div>

      {/* 💳 Payment Method */}
      <div className="bg-white dark:bg-secondary p-5 rounded-xl shadow border dark:border-gray-700 mb-6">
        <h2 className="text-xl font-semibold mb-3">💳 Payment Method</h2>
        <p>Razorpay (UPI / Card / Wallet)</p>
      </div>

      {/* 🧂 Order Summary */}
      <div className="bg-white dark:bg-secondary p-5 rounded-xl shadow border dark:border-gray-700 mb-6">
        <h2 className="text-xl font-semibold mb-3">🧂 Order Summary</h2>

        {offer && (
          <div className="text-sm text-green-700 dark:text-green-400 mb-2">
            🏷️ Offer Applied: <strong>{offer.title}</strong>
          </div>
        )}

        <ul className="text-sm mb-3 space-y-2">
          {cartItems.map((item, index) => (
            <li className="flex justify-between" key={index}>
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>₹{(item.price * item.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>

        {/* 💰 Breakdown */}
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span>₹{tax}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Fee</span>
            <span>₹{deliveryFee}</span>
          </div>
          {appliedDiscount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>–₹{appliedDiscount}</span>
            </div>
          )}
        </div>

        <hr className="my-2 border-gray-300 dark:border-gray-600" />

        <div className="flex justify-between font-medium text-lg">
          <span>Total Payable</span>
          <span>₹{totalPayable}</span>
        </div>
      </div>

      {/* ✅ Pay Button */}
      <button
        onClick={handlePlaceOrder}
        disabled={placingOrder}
        className="w-full bg-primary hover:bg-orange-600 text-white py-3 rounded-xl font-semibold transition disabled:opacity-60"
      >
        {placingOrder ? "Placing Order..." : "Proceed to Pay"}
      </button>
    </div>
  );
};

export default CustomerCheckout;
