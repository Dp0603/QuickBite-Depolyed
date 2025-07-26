import React, { useEffect, useState, useContext } from "react";
import Lottie from "lottie-react";
import EmptyCartLottie from "../../assets/lottie icons/Shopping cart.json";
import CartItem from "./CustomerCartItems";
import { AuthContext } from "../../context/AuthContext";
import API from "../../api/axios";

const CustomerCart = () => {
  const { user } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [restaurantId, setRestaurantId] = useState(null);
  const [promoCode, setPromoCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");

  // 🛒 Fetch Cart Data
  useEffect(() => {
    if (user?._id) {
      API.get(`/cart/${user._id}`)
        .then((res) => {
          const items = res.data.cart?.items || [];
          setCartItems(items);
          setRestaurantId(res.data.cart?.restaurantId?._id);
        })
        .catch((err) => {
          if (err.response?.status === 404) setCartItems([]);
          else console.error("Error fetching cart:", err);
        });
    }
  }, [user]);

  // ➕ Increase Quantity
  const increment = async (id, currentQty, note = "") => {
    await API.post("/cart", {
      userId: user._id,
      restaurantId,
      menuItemId: id,
      quantity: currentQty + 1,
      note,
    });
    setCartItems((prev) =>
      prev.map((i) =>
        i.menuItem._id === id ? { ...i, quantity: i.quantity + 1 } : i
      )
    );
  };

  // ➖ Decrease Quantity
  const decrement = async (id, currentQty, note = "") => {
    if (currentQty === 1) return;
    await API.post("/cart", {
      userId: user._id,
      restaurantId,
      menuItemId: id,
      quantity: currentQty - 1,
      note,
    });
    setCartItems((prev) =>
      prev.map((i) =>
        i.menuItem._id === id ? { ...i, quantity: i.quantity - 1 } : i
      )
    );
  };

  // ❌ Remove Item
  const removeItem = async (id) => {
    await API.delete("/cart/item", {
      data: { userId: user._id, menuItemId: id },
    });
    setCartItems((prev) => prev.filter((i) => i.menuItem._id !== id));
  };

  // 🧾 Price Calculations
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.menuItem.price * item.quantity,
    0
  );
  const tax = Math.round(subtotal * 0.08);
  const deliveryFee = subtotal >= 500 ? 0 : 40;
  const totalBeforeDiscount = subtotal + tax + deliveryFee;
  const totalPayable = totalBeforeDiscount - appliedDiscount;

  // 🎟️ Promo Code Logic
  const validCoupons = { SAVE5: 0.05, WELCOME10: 0.1 };
  const applyPromo = () => {
    const discountPercent = validCoupons[promoCode.trim().toUpperCase()];
    if (!promoCode.trim()) {
      return setPromoError("Please enter a promo code.");
    }
    if (discountPercent) {
      setAppliedDiscount(Math.floor(subtotal * discountPercent));
      setPromoError("");
    } else {
      setAppliedDiscount(0);
      setPromoError("Invalid promo code.");
    }
  };

  return (
    <div className="px-4 md:px-10 py-10 text-gray-800 dark:text-white">
      <h1 className="text-3xl font-bold mb-2">🛒 Your Cart</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Review and manage your selected items.
      </p>

      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center text-center text-gray-500 mt-16">
          <Lottie
            animationData={EmptyCartLottie}
            loop
            autoplay
            style={{ width: 200, height: 200 }}
          />
          <p className="text-xl font-medium">Oops! Your cart is empty.</p>
          <p className="text-sm mt-2">Start adding tasty dishes!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-10">
          {/* 🧺 Cart Items */}
          <div className="md:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <CartItem
                key={item.menuItem._id}
                item={{
                  id: item.menuItem._id,
                  name: item.menuItem.name,
                  price: item.menuItem.price,
                  quantity: item.quantity,
                  image: item.menuItem.image,
                  note: item.note,
                }}
                increment={() =>
                  increment(item.menuItem._id, item.quantity, item.note)
                }
                decrement={() =>
                  decrement(item.menuItem._id, item.quantity, item.note)
                }
                removeItem={() => removeItem(item.menuItem._id)}
              />
            ))}
          </div>

          {/* 💳 Summary Box */}
          <div className="bg-white dark:bg-secondary p-6 rounded-xl shadow-md sticky top-24 h-fit space-y-5">
            <h3 className="text-xl font-bold border-b pb-2">
              🧾 Order Summary
            </h3>

            {/* Promo Input */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter promo code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="flex-1 px-3 py-2 border dark:border-gray-600 rounded-lg text-sm dark:bg-gray-800 dark:text-white"
              />
              <button
                onClick={applyPromo}
                className="bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-600 transition"
              >
                Apply
              </button>
            </div>

            {/* Promo Messages */}
            {promoError && <p className="text-red-500 text-sm">{promoError}</p>}
            {appliedDiscount > 0 && (
              <p className="text-green-600 text-sm">
                Discount Applied: ₹{appliedDiscount}
              </p>
            )}

            {/* Price Breakdown */}
            <div className="space-y-2 text-sm pt-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (8%)</span>
                <span>₹{tax}</span>
              </div>
              <div className="flex justify-between">
                <span>
                  Delivery Fee{" "}
                  {deliveryFee === 0 && (
                    <span className="text-green-600 text-xs">(Free)</span>
                  )}
                </span>
                <span>₹{deliveryFee}</span>
              </div>
              {appliedDiscount > 0 && (
                <div className="flex justify-between">
                  <span>Discount</span>
                  <span className="text-green-600">–₹{appliedDiscount}</span>
                </div>
              )}
            </div>

            <hr className="border-gray-200 dark:border-gray-600" />

            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>₹{totalPayable}</span>
            </div>

            <button className="w-full bg-primary text-white py-3 rounded-lg hover:bg-orange-600 transition font-semibold mt-4">
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerCart;
