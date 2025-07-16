import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const CustomerCheckout = () => {
  const { user, token } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch cart from backend
  useEffect(() => {
    if (!user) return;
    axios
      .get("/api/customer/cart", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setCartItems(res.data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Error fetching cart:", err);
        setCartItems([]);
        setLoading(false);
      });
  }, [user, token]);

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handlePlaceOrder = async () => {
    try {
      const res = await axios.post(
        "/api/customer/orders",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Redirect to success screen with order info
      navigate("/customer/payment-success", {
        state: { order: res.data.data },
      });
    } catch (err) {
      console.error("❌ Error placing order:", err);
      alert("Failed to place order. Please try again.");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

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

        <ul className="text-sm mb-3 space-y-2">
          {cartItems.map((item, index) => (
            <li className="flex justify-between" key={index}>
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>₹{item.price * item.quantity}</span>
            </li>
          ))}
        </ul>

        <div className="flex justify-between font-medium text-lg border-t pt-2">
          <span>Total</span>
          <span>₹{total}</span>
        </div>
      </div>

      <button
        onClick={handlePlaceOrder}
        className="w-full bg-primary hover:bg-orange-600 text-white py-3 rounded-xl font-semibold transition"
      >
        Proceed to Pay
      </button>
    </div>
  );
};

export default CustomerCheckout;
