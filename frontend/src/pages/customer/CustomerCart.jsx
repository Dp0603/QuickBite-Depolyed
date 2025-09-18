import React, { useEffect, useState, useContext } from "react";
import Lottie from "lottie-react";
import EmptyCartLottie from "../../assets/lottie icons/Shopping cart.json";
import CartItem from "./CustomerCartItems";
import { AuthContext } from "../../context/AuthContext";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";

const CustomerCart = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [restaurantId, setRestaurantId] = useState(null);
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [availableOffers, setAvailableOffers] = useState([]);
  const [selectedOfferId, setSelectedOfferId] = useState("");
  const [premiumSummary, setPremiumSummary] = useState({
    freeDelivery: false,
    extraDiscount: 0, // percentage
    cashback: 0,
    totalSavings: 0,
  });

  // 🔄 Fetch latest active cart
  const fetchCart = async () => {
    if (!user?._id) return;
    try {
      const res = await API.get(`/cart/${user._id}`);
      const items = res.data.cart?.items || [];
      setCartItems(items);

      const restId = res.data.cart?.restaurantId?._id || null;
      setRestaurantId(restId);

      // ✅ Premium benefits (safe fallback)
      const premium = res.data.cart?.premiumSummary || {
        freeDelivery: false,
        extraDiscount: 0,
        cashback: 0,
        totalSavings: 0,
      };
      setPremiumSummary(premium);
    } catch (err) {
      console.error(
        "❌ Error fetching active cart:",
        err.response?.data || err
      );
      setCartItems([]);
      setRestaurantId(null);
      setPremiumSummary({
        freeDelivery: false,
        extraDiscount: 0,
        cashback: 0,
        totalSavings: 0,
      });
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  // 🎁 Fetch Offers
  useEffect(() => {
    if (restaurantId) {
      API.get(`/offers/offers/valid/${restaurantId}`)
        .then((res) => {
          setAvailableOffers(res.data.offers || []);
        })
        .catch((err) => {
          console.error("❌ Error fetching offers:", err.response?.data || err);
          setAvailableOffers([]);
        });
    } else {
      setAvailableOffers([]);
    }
  }, [restaurantId]);

  // ➕ Increment
  const increment = async (id, currentQty, note = "") => {
    await API.post(`/cart/${user._id}/${restaurantId}/item/${id}`, {
      quantity: currentQty + 1,
      note,
      applyPremium: true,
    });
    fetchCart();
  };

  // ➖ Decrement
  const decrement = async (id, currentQty, note = "") => {
    if (currentQty === 1) return;
    await API.post(`/cart/${user._id}/${restaurantId}/item/${id}`, {
      quantity: currentQty - 1,
      note,
      applyPremium: true,
    });
    fetchCart();
  };

  // ❌ Remove
  const removeItem = async (id) => {
    await API.delete(`/cart/${user._id}/${restaurantId}/item/${id}`);
    fetchCart();
  };

  // 🧾 Pricing
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.menuItem.price * item.quantity,
    0
  );

  const tax = parseFloat((subtotal * 0.08).toFixed(2));

  // ✅ Delivery Fee
  const baseDeliveryFee = subtotal >= 500 ? 0 : 40;
  const deliveryFee = premiumSummary.freeDelivery ? 0 : baseDeliveryFee;

  // ✅ Premium Extra Discount (percentage of subtotal)
  const premiumExtraDiscount = premiumSummary.extraDiscount
    ? parseFloat(((subtotal * premiumSummary.extraDiscount) / 100).toFixed(2))
    : 0;

  const totalBeforeDiscount = subtotal + tax + deliveryFee;

  const totalPayable = Math.max(
    totalBeforeDiscount - appliedDiscount - premiumExtraDiscount,
    0
  ).toFixed(2);

  // 🎯 Apply Offer
  const applySelectedOffer = () => {
    const offer = availableOffers.find((o) => o._id === selectedOfferId);
    if (!offer) {
      setPromoError("Please select a valid offer.");
      return;
    }

    if (subtotal < offer.minOrderAmount) {
      setPromoError(`Minimum order ₹${offer.minOrderAmount} required.`);
      return;
    }

    let discount = 0;
    const type = offer.discountType.toUpperCase();

    switch (type) {
      case "FLAT":
        discount = offer.discountValue;
        break;
      case "PERCENT":
      case "UPTO": {
        const percentDiscount = Math.floor(
          (subtotal * offer.discountValue) / 100
        );
        discount = offer.maxDiscountAmount
          ? Math.min(percentDiscount, offer.maxDiscountAmount)
          : percentDiscount;
        break;
      }
      default:
        discount = 0;
    }

    setAppliedDiscount(discount);
    setPromoError("");
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
          {/* Items */}
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

          {/* Summary */}
          <div className="bg-white dark:bg-secondary p-6 rounded-xl shadow-md sticky top-24 h-fit space-y-5">
            <h3 className="text-xl font-bold border-b pb-2">
              🧾 Order Summary
            </h3>

            {/* Premium Summary */}
            {premiumSummary &&
              (premiumExtraDiscount > 0 ||
                (premiumSummary.freeDelivery && subtotal < 500) ||
                (premiumSummary.cashback || 0) > 0) && (
                <div className="mb-2 p-2 bg-green-50 dark:bg-green-900 rounded">
                  <h4 className="font-semibold text-green-800 dark:text-green-300">
                    💎 Premium Benefits Applied:
                  </h4>
                  {premiumSummary.freeDelivery && subtotal < 500 && (
                    <p className="text-green-600 dark:text-green-300">
                      Free Delivery: ₹{baseDeliveryFee}
                    </p>
                  )}
                  {premiumExtraDiscount > 0 && (
                    <p className="text-green-600 dark:text-green-300">
                      Extra Discount: ₹{premiumExtraDiscount}
                    </p>
                  )}
                  {(premiumSummary.cashback || 0) > 0 && (
                    <p className="text-green-600 dark:text-green-300">
                      Cashback Eligible: ₹{Math.round(premiumSummary.cashback)}
                    </p>
                  )}
                </div>
              )}

            {/* Offers */}
            <div className="flex gap-2">
              <select
                value={selectedOfferId}
                onChange={(e) => {
                  setSelectedOfferId(e.target.value);
                  setPromoError("");
                  setAppliedDiscount(0);
                }}
                className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg text-sm dark:bg-gray-800 dark:text-white"
              >
                <option value="">Select an Offer</option>
                {availableOffers.map((offer) => (
                  <option key={offer._id} value={offer._id}>
                    {offer.title} ({offer.discountType}) -{" "}
                    {offer.discountType.toUpperCase() === "PERCENT" ||
                    offer.discountType.toUpperCase() === "UPTO"
                      ? `${offer.discountValue}%`
                      : `₹${offer.discountValue}`}
                  </option>
                ))}
              </select>
              <button
                onClick={applySelectedOffer}
                disabled={!selectedOfferId}
                className={`${
                  selectedOfferId
                    ? "bg-primary hover:bg-orange-600"
                    : "bg-gray-400"
                } text-white px-4 py-2 rounded-lg text-sm transition mt-2 w-full`}
              >
                Apply Offer
              </button>
            </div>

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
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (8%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>
                  Delivery Fee{" "}
                  {deliveryFee === 0 && (
                    <span className="text-green-600 text-xs">(Free)</span>
                  )}
                </span>
                <span>₹{deliveryFee.toFixed(2)}</span>
              </div>
              {(appliedDiscount > 0 || premiumExtraDiscount > 0) && (
                <div className="flex justify-between">
                  <span>Discount</span>
                  <span className="text-green-600">
                    –₹{(appliedDiscount + premiumExtraDiscount).toFixed(2)}
                  </span>
                </div>
              )}
              {(premiumSummary.cashback || 0) > 0 && (
                <div className="flex justify-between">
                  <span>Cashback (eligible)</span>
                  <span className="text-green-600">
                    ₹{Math.round(premiumSummary.cashback)}
                  </span>
                </div>
              )}
            </div>

            <hr className="border-gray-200 dark:border-gray-600" />
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>₹{totalPayable}</span>
            </div>

            <button
              onClick={() => {
                navigate("/customer/checkout", {
                  state: {
                    cartItems: cartItems.map((item) => ({
                      id: item.menuItem._id,
                      name: item.menuItem.name,
                      price: item.menuItem.price,
                      quantity: item.quantity,
                      note: item.note || "",
                    })),
                    subtotal,
                    tax,
                    deliveryFee,
                    appliedDiscount,
                    totalPayable,
                    selectedOfferId,
                    offer:
                      availableOffers.find((o) => o._id === selectedOfferId) ||
                      null,
                    restaurantId,
                    premiumSummary,
                  },
                });
              }}
              disabled={!restaurantId}
              className={`w-full py-3 rounded-lg font-semibold mt-4 transition ${
                restaurantId
                  ? "bg-primary text-white hover:bg-orange-600"
                  : "bg-gray-400 text-white cursor-not-allowed"
              }`}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerCart;
