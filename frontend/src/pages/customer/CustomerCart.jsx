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
  const [restaurantId, setRestaurantId] = useState(
    localStorage.getItem("activeRestaurantId") || null
  );
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [availableOffers, setAvailableOffers] = useState([]);
  const [selectedOfferId, setSelectedOfferId] = useState("");

  // 🛒 Fetch Cart Data
  useEffect(() => {
    if (user?._id) {
      if (restaurantId) {
        API.get(`/cart/${user._id}/${restaurantId}`)
          .then((res) => {
            const items = res.data.cart?.items || [];
            setCartItems(items);

            const restId = res.data.cart?.restaurantId?._id;
            if (restId) {
              setRestaurantId(restId);
              localStorage.setItem("activeRestaurantId", restId);
            }
          })
          .catch((err) => {
            console.error("❌ Error fetching cart:", err.response?.data || err);
            if (err.response?.status === 404) setCartItems([]);
          });
      } else {
        API.get(`/cart/${user._id}`)
          .then((res) => {
            const items = res.data.cart?.items || [];
            setCartItems(items);

            const restId = res.data.cart?.restaurantId?._id;
            if (restId) {
              setRestaurantId(restId);
              localStorage.setItem("activeRestaurantId", restId);
            }
          })
          .catch((err) => {
            console.error(
              "❌ Error fetching active cart:",
              err.response?.data || err
            );
            setCartItems([]);
          });
      }
    }
  }, [user, restaurantId]);

  // 🎁 Fetch Offers
  useEffect(() => {
    if (restaurantId) {
      console.log("📡 Fetching offers for restaurant:", restaurantId);

      API.get(`/offers/offers/valid/${restaurantId}`)
        .then((res) => {
          console.log("✅ Offers API Response:", res.data); // full API response
          console.log("📋 Offers Array:", res.data.offers); // only offers array
          res.data.offers.forEach((offer, idx) => {
            console.log(`➡️ Offer[${idx}]`, {
              id: offer._id,
              title: offer.title,
              discountType: offer.discountType,
              discountValue: offer.discountValue,
              maxDiscountAmount: offer.maxDiscountAmount,
              minOrderAmount: offer.minOrderAmount,
              validFrom: offer.validFrom,
              validTill: offer.validTill,
              isActive: offer.isActive,
            });
          });

          setAvailableOffers(res.data.offers);
        })
        .catch((err) => {
          console.error("❌ Error fetching offers:", err.response?.data || err);
          setAvailableOffers([]);
        });
    }
  }, [restaurantId]);

  // ➕ Increment
  const increment = async (id, currentQty, note = "") => {
    await API.post(`/cart/${user._id}/${restaurantId}/item/${id}`, {
      quantity: currentQty + 1,
      note,
    });
    setCartItems((prev) =>
      prev.map((i) =>
        i.menuItem._id === id ? { ...i, quantity: i.quantity + 1 } : i
      )
    );
  };

  // ➖ Decrement
  const decrement = async (id, currentQty, note = "") => {
    if (currentQty === 1) return;
    await API.post(`/cart/${user._id}/${restaurantId}/item/${id}`, {
      quantity: currentQty - 1,
      note,
    });
    setCartItems((prev) =>
      prev.map((i) =>
        i.menuItem._id === id ? { ...i, quantity: i.quantity - 1 } : i
      )
    );
  };

  // ❌ Remove
  const removeItem = async (id) => {
    await API.delete(`/cart/${user._id}/${restaurantId}/item/${id}`);
    setCartItems((prev) => prev.filter((i) => i.menuItem._id !== id));
  };

  // 🧾 Pricing
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.menuItem.price * item.quantity,
    0
  );
  const tax = Math.round(subtotal * 0.08);
  const deliveryFee = subtotal >= 500 ? 0 : 40;
  const totalBeforeDiscount = subtotal + tax + deliveryFee;
  const totalPayable = Number(
    Math.max(totalBeforeDiscount - appliedDiscount, 0).toFixed(2)
  );

  // 🎯 Apply Offer
  const applySelectedOffer = () => {
    const offer = availableOffers.find((o) => o._id === selectedOfferId);
    console.log("🎯 Selected Offer:", offer);

    if (!offer) {
      console.warn("⚠️ No offer selected or offer not found");
      setPromoError("Please select a valid offer.");
      return;
    }

    console.log("💰 Subtotal:", subtotal);
    console.log("📊 Offer conditions:", {
      minOrderAmount: offer.minOrderAmount,
      discountType: offer.discountType,
      discountValue: offer.discountValue,
      maxDiscountAmount: offer.maxDiscountAmount,
    });

    if (subtotal < offer.minOrderAmount) {
      console.warn("🚫 Subtotal too low for this offer");
      setPromoError(`Minimum order ₹${offer.minOrderAmount} required.`);
      return;
    }

    let discount = 0;
    const type = offer.discountType.toUpperCase();

    switch (type) {
      case "FLAT":
        discount = offer.discountValue;
        break;
      case "PERCENT": {
        const percentDiscount = Math.floor(
          (subtotal * offer.discountValue) / 100
        );
        discount = offer.maxDiscountAmount
          ? Math.min(percentDiscount, offer.maxDiscountAmount)
          : percentDiscount;
        break;
      }
      case "UPTO":
        discount = Math.min(offer.discountValue, subtotal);
        break;
      default:
        discount = 0;
    }

    console.log("✅ Final Discount Applied:", discount);
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
                    {offer.discountType.toUpperCase() === "PERCENT"
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
              <span>₹{totalPayable.toFixed(2)}</span>
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
