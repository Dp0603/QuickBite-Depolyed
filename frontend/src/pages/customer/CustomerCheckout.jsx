import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import API from "../../api/axios"; // ✅ use centralized axios instance

const CustomerCheckout = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [placingOrder, setPlacingOrder] = useState(false);

  const {
    cartItems = [],
    subtotal = 0,
    tax = 0,
    deliveryFee = 0,
    appliedDiscount = 0,
    totalPayable = 0,
    selectedOfferId = null,
    offer = null,
    restaurantId = null,
  } = location.state || {};
  console.log("🚀 Received restaurantId in Checkout page:", restaurantId);

  useEffect(() => {
    if (!location.state || cartItems.length === 0) {
      navigate("/cart");
    }
  }, [location.state, cartItems, navigate]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async () => {
    if (placingOrder) return;
    setPlacingOrder(true);

    console.log("🛒 Starting order placement process...");

    try {
      const isRazorpayLoaded = await loadRazorpayScript();
      if (!isRazorpayLoaded) {
        alert("❌ Razorpay failed to load.");
        console.log("🚫 Razorpay script load failed.");
        setPlacingOrder(false);
        return;
      }

      console.log("✅ Razorpay script loaded.");

      // Create Razorpay order on backend
      console.log("📡 Creating Razorpay order...");
      const roundedAmount = Math.round(Number(totalPayable) * 100); // Convert to paise (integer)
      const razorpayOrderRes = await API.post("/payment/create-order", {
        amount: roundedAmount / 100, // Send back in ₹ (2 decimal places)
      });

      console.log("✅ Razorpay order response:", razorpayOrderRes.data);

      const { razorpayOrderId, amount } = razorpayOrderRes.data;

      const options = {
        key: "rzp_test_GDBH9Rf7wvZ3R6", // 🔑 Test key
        amount: amount * 100,
        currency: "INR",
        name: "QuickBite",
        description: "Food Order Payment",
        order_id: razorpayOrderId,
        handler: async function (response) {
          console.log("💸 Payment successful:", response);

          console.log("🧪 First cart item:", cartItems[0]);

          const payload = {
            customerId: user._id,
            restaurantId,
            items: cartItems.map((item) => ({
              menuItemId: item.menuItemId || item.id || item._id,
              name: item.name,
              price: item.price,
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
            paymentDetails: {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            },
          };
          console.log("📦 Final Payload to backend:", payload);

          console.log("📦 Sending order to backend:", payload);

          try {
            const res = await API.post("/payment/verify-signature", payload);
            console.log("✅ Order created successfully:", res.data);

            navigate("/customer/payment-success", {
              state: { order: res.data.order },
            });
          } catch (err) {
            console.error(
              "❌ Order creation error:",
              err.response?.data || err.message
            );
            alert("Order creation failed after payment.");
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: "9999999999",
        },
        notes: {
          address: "QuickBite - Test Payment",
        },
        theme: {
          color: "#f97316",
        },
      };

      console.log("🚀 Opening Razorpay modal...");
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error("❌ Payment initiation failed:", err);
      alert("Something went wrong while starting the payment.");
    } finally {
      setPlacingOrder(false);
      console.log("🛑 Finished order placement attempt.");
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
