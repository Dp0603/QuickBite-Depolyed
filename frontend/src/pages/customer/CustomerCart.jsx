import React, { useEffect, useState, useContext } from "react";
import Lottie from "lottie-react";
import EmptyCartLottie from "../../assets/lottie icons/Shopping cart.json";
import CartItem from "./CustomerCartItems";
import { AuthContext } from "../../context/AuthContext";
import API from "../../api/axios";

const CustomerCart = () => {
  const { user } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [promoCode, setPromoCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");

  // 🔄 Fetch cart from backend
  useEffect(() => {
    if (user?._id) {
      API.get(`/cart/${user._id}`)
        .then((res) => {
          const items = res.data.data?.items || [];
          setCartItems(items);
        })
        .catch((err) => {
          if (err.response?.status === 404) {
            console.log("🛒 Cart not found. Likely new user.");
            setCartItems([]);
          } else {
            console.error("❌ Error fetching cart:", err);
          }
        });
    }
  }, [user]);

  // ➕ Increment
  const increment = async (id) => {
    const item = cartItems.find((i) => i.foodId._id === id);
    await API.put("/cart/update", {
      userId: user._id,
      foodId: id,
      quantity: item.quantity + 1,
    });
    setCartItems((prev) =>
      prev.map((i) =>
        i.foodId._id === id ? { ...i, quantity: i.quantity + 1 } : i
      )
    );
  };

  // ➖ Decrement
  const decrement = async (id) => {
    const item = cartItems.find((i) => i.foodId._id === id);
    if (item.quantity === 1) return;

    await API.put("/cart/update", {
      userId: user._id,
      foodId: id,
      quantity: item.quantity - 1,
    });
    setCartItems((prev) =>
      prev.map((i) =>
        i.foodId._id === id ? { ...i, quantity: i.quantity - 1 } : i
      )
    );
  };

  // ❌ Remove
  const removeItem = async (id) => {
    await API.delete("/cart/remove", {
      data: { userId: user._id, foodId: id },
    });
    setCartItems((prev) => prev.filter((i) => i.foodId._id !== id));
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.foodId.price * item.quantity,
    0
  );
  const tax = Math.round(subtotal * 0.08);
  const deliveryFee = subtotal >= 500 ? 0 : 40;
  const totalBeforeDiscount = subtotal + tax + deliveryFee;
  const totalPayable = totalBeforeDiscount - appliedDiscount;

  const validCoupons = { SAVE5: 0.05, WELCOME10: 0.1 };

  const applyPromo = () => {
    const discountPercent = validCoupons[promoCode.toUpperCase()];
    if (!promoCode.trim()) return setPromoError("Please enter a promo code.");

    if (discountPercent) {
      setAppliedDiscount(Math.floor(subtotal * discountPercent));
      setPromoError("");
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
          <div className="md:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <CartItem
                key={item.foodId._id}
                item={{
                  id: item.foodId._id,
                  name: item.foodId.name,
                  price: item.foodId.price,
                  quantity: item.quantity,
                  image: item.foodId.image,
                }}
                increment={increment}
                decrement={decrement}
                removeItem={removeItem}
              />
            ))}
          </div>

          {/* Order Summary */}
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
            {promoError && <p className="text-red-500 text-sm">{promoError}</p>}
            {appliedDiscount > 0 && (
              <p className="text-green-600 text-sm">
                Discount applied: ₹{appliedDiscount}
              </p>
            )}

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
                  {subtotal >= 500 && (
                    <span className="text-green-600">(Free)</span>
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
