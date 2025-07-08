import React, { useState } from "react";
import Lottie from "lottie-react";
import EmptyCartLottie from "../../assets/lottie icons/Shopping cart.json";
import CartItem from "../customer/CustomerCartItems"; // Adjust path if needed

const dummyCart = [
  {
    id: 1,
    name: "Cheesy Margherita Pizza",
    price: 299,
    quantity: 2,
    image: "/QuickBite.png",
  },
  {
    id: 2,
    name: "Spicy Ramen Bowl",
    price: 349,
    quantity: 1,
    image: "/QuickBite.png",
  },
];

const CustomerCart = () => {
  const [cartItems, setCartItems] = useState(dummyCart);
  const [promoCode, setPromoCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");

  const increment = (id) =>
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );

  const decrement = (id) =>
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );

  const removeItem = (id) =>
    setCartItems((prev) => prev.filter((item) => item.id !== id));

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const tax = Math.round(subtotal * 0.08);
  const deliveryFee = subtotal >= 500 ? 0 : 40;
  const totalBeforeDiscount = subtotal + tax + deliveryFee;
  const totalPayable = totalBeforeDiscount - appliedDiscount;

  const validCoupons = {
    SAVE5: 0.05,
    WELCOME10: 0.1,
  };

  const applyPromo = () => {
    const discountPercent = validCoupons[promoCode.toUpperCase()];
    if (!promoCode.trim()) {
      setPromoError("Please enter a promo code.");
      return;
    }
    if (discountPercent) {
      const discountAmount = Math.floor(subtotal * discountPercent);
      setAppliedDiscount(discountAmount);
      setPromoError("");
      setPromoCode(promoCode.toUpperCase());
    } else {
      setAppliedDiscount(0);
      setPromoError("Invalid promo code");
    }
  };

  return (
    <div className="px-4 sm:px-8 md:px-10 lg:px-12 py-10 text-gray-800 dark:text-white">
      <h1 className="text-3xl font-bold mb-2">🛒 Shopping Cart</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Manage your selected dishes before you checkout.
      </p>

      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center mt-20 text-center text-gray-500 dark:text-gray-400">
          <Lottie
            animationData={EmptyCartLottie}
            loop
            autoplay
            style={{ width: 200, height: 200 }}
          />
          <p className="text-xl font-medium">Oops! Your cart is empty.</p>
          <p className="text-sm mt-2">
            Add some delicious meals to get started!
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-10">
          {/* 🛍️ Cart Items */}
          <div className="md:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                increment={increment}
                decrement={decrement}
                removeItem={removeItem}
              />
            ))}
          </div>

          {/* 📦 Order Summary */}
          <div className="bg-white dark:bg-secondary p-6 rounded-2xl shadow sticky top-24 h-fit space-y-5">
            <h3 className="text-xl font-bold mb-4 border-b pb-2 border-gray-200 dark:border-gray-600">
              🧾 Order Summary
            </h3>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Enter promo code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="flex-1 px-3 py-2 border dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:bg-gray-800 dark:text-white"
              />
              <button
                onClick={applyPromo}
                className="bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-600 transition"
              >
                Apply
              </button>
            </div>
            {promoError && (
              <p className="text-red-500 text-sm" role="alert">
                {promoError}
              </p>
            )}
            {appliedDiscount > 0 && (
              <p className="text-green-600 text-sm">
                Discount applied: ₹{appliedDiscount}
              </p>
            )}

            <div className="space-y-2 text-sm pt-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">
                  Subtotal
                </span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">
                  Tax (8%)
                </span>
                <span>₹{tax}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">
                  Delivery Fee
                  {subtotal >= 500 && (
                    <span className="ml-1 text-green-600 text-xs font-medium">
                      (Free)
                    </span>
                  )}
                </span>
                <span>₹{deliveryFee}</span>
              </div>
              {appliedDiscount > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">
                    Discount
                  </span>
                  <span className="text-green-600">–₹{appliedDiscount}</span>
                </div>
              )}
            </div>

            <hr className="border-gray-200 dark:border-gray-600" />

            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>₹{totalPayable}</span>
            </div>

            <button className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-orange-600 transition font-semibold text-sm mt-4 shadow-sm">
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerCart;
