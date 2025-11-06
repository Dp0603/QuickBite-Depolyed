import React, { useEffect, useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaShoppingCart,
  FaTrash,
  FaPlus,
  FaMinus,
  FaTag,
  FaCrown,
  FaGift,
  FaArrowRight,
  FaCheckCircle,
  FaTruck,
  FaPercent,
  FaFire,
  FaClock,
  FaStore,
  FaTimes,
  FaArrowLeft,
} from "react-icons/fa";
import Lottie from "lottie-react";
import EmptyCartLottie from "../../assets/lottie icons/Shopping cart.json";
import { AuthContext } from "../../context/AuthContext";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";

const CustomerCart = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [restaurantId, setRestaurantId] = useState(null);
  const [restaurantName, setRestaurantName] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [availableOffers, setAvailableOffers] = useState([]);
  const [selectedOfferId, setSelectedOfferId] = useState("");
  const [premiumSummary, setPremiumSummary] = useState({
    freeDelivery: false,
    extraDiscount: 0,
    cashback: 0,
    totalSavings: 0,
  });

  // Fetch cart
  const fetchCart = async () => {
    if (!user?._id) return;
    try {
      const res = await API.get(`/cart/${user._id}`);
      const items = res.data.cart?.items || [];
      setCartItems(items);

      const restId = res.data.cart?.restaurantId?._id || null;
      const restName = res.data.cart?.restaurantId?.name || "";
      setRestaurantId(restId);
      setRestaurantName(restName);

      const premium = res.data.cart?.premiumSummary || {
        freeDelivery: false,
        extraDiscount: 0,
        cashback: 0,
        totalSavings: 0,
      };
      setPremiumSummary(premium);
    } catch (err) {
      console.error("❌ Error fetching cart:", err.response?.data || err);
      setCartItems([]);
      setRestaurantId(null);
      setRestaurantName("");
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

  // Fetch offers
  useEffect(() => {
    if (restaurantId) {
      API.get(`/offers/offers/valid/${restaurantId}`)
        .then((res) => setAvailableOffers(res.data.offers || []))
        .catch((err) => {
          console.error("❌ Error fetching offers:", err.response?.data || err);
          setAvailableOffers([]);
        });
    } else {
      setAvailableOffers([]);
    }
  }, [restaurantId]);

  // Increment
  const increment = async (id, currentQty, note = "") => {
    await API.post(`/cart/${user._id}/${restaurantId}/item/${id}`, {
      quantity: currentQty + 1,
      note,
      applyPremium: true,
    });
    fetchCart();
  };

  // Decrement
  const decrement = async (id, currentQty, note = "") => {
    if (currentQty === 1) return;
    await API.post(`/cart/${user._id}/${restaurantId}/item/${id}`, {
      quantity: currentQty - 1,
      note,
      applyPremium: true,
    });
    fetchCart();
  };

  // Remove
  const removeItem = async (id) => {
    await API.delete(`/cart/${user._id}/${restaurantId}/item/${id}`);
    fetchCart();
  };

  // Pricing
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.menuItem.price * item.quantity,
    0
  );

  const tax = parseFloat((subtotal * 0.08).toFixed(2));
  const baseDeliveryFee = subtotal >= 500 ? 0 : 40;
  const deliveryFee = premiumSummary.freeDelivery ? 0 : baseDeliveryFee;

  const premiumExtraDiscount = premiumSummary.extraDiscount
    ? parseFloat(((subtotal * premiumSummary.extraDiscount) / 100).toFixed(2))
    : 0;

  const totalBeforeDiscount = subtotal + tax + deliveryFee;
  const totalPayable = Math.max(
    totalBeforeDiscount - appliedDiscount - premiumExtraDiscount,
    0
  ).toFixed(2);

  // Total items count
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Free delivery progress
  const freeDeliveryThreshold = 500;
  const amountToFreeDelivery = Math.max(freeDeliveryThreshold - subtotal, 0);
  const deliveryProgress = Math.min(
    (subtotal / freeDeliveryThreshold) * 100,
    100
  );

  // Apply offer
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <motion.div
        className="px-4 sm:px-8 md:px-10 lg:px-12 py-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-orange-600 to-pink-600 dark:from-orange-400 dark:to-pink-500 bg-clip-text text-transparent flex items-center gap-3">
              <FaShoppingCart className="text-orange-500" />
              Your Cart
            </h1>
            {cartItems.length > 0 && (
              <motion.button
                onClick={() => navigate("/customer/browse")}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border-2 border-orange-200 dark:border-white/10 text-gray-700 dark:text-gray-300 font-semibold hover:border-orange-500 transition-all shadow-md"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaArrowLeft className="text-sm" />
                Continue Shopping
              </motion.button>
            )}
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            {cartItems.length > 0
              ? `${totalItems} item${totalItems > 1 ? "s" : ""} from ${
                  restaurantName || "your restaurant"
                }`
              : "Review and manage your selected items"}
          </p>
        </div>

        {cartItems.length === 0 ? (
          /* Empty State */
          <motion.div
            className="flex flex-col items-center justify-center text-center py-20"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-full blur-3xl"></div>
              <Lottie
                animationData={EmptyCartLottie}
                loop
                autoplay
                style={{ width: 280, height: 280 }}
                className="relative"
              />
            </div>
            <h3 className="text-3xl font-bold mb-3 text-gray-900 dark:text-white mt-6">
              Your cart is empty
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
              Start adding delicious items to get started!
            </p>
            <motion.button
              onClick={() => navigate("/customer/browse")}
              className="flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-bold shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaFire /> Browse Restaurants
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {/* Restaurant Info */}
              {restaurantName && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-orange-200 dark:border-white/10 shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center text-white shadow-md">
                      <FaStore />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Ordering from
                      </p>
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                        {restaurantName}
                      </h3>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Free Delivery Progress */}
              {!premiumSummary.freeDelivery &&
                subtotal < freeDeliveryThreshold && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-500/30 shadow-md"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <FaTruck className="text-green-600 dark:text-green-400" />
                        <span className="font-semibold text-green-700 dark:text-green-300">
                          Add ₹{amountToFreeDelivery} for FREE delivery
                        </span>
                      </div>
                      <span className="text-sm font-bold text-green-600 dark:text-green-400">
                        {deliveryProgress.toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-green-200 dark:bg-green-900/50 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-600"
                        initial={{ width: 0 }}
                        animate={{ width: `${deliveryProgress}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      />
                    </div>
                  </motion.div>
                )}

              {/* Cart Items */}
              <div className="space-y-4">
                <AnimatePresence>
                  {cartItems.map((item, index) => (
                    <CartItemCard
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
                      index={index}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <OrderSummary
                  subtotal={subtotal}
                  tax={tax}
                  deliveryFee={deliveryFee}
                  baseDeliveryFee={baseDeliveryFee}
                  appliedDiscount={appliedDiscount}
                  premiumExtraDiscount={premiumExtraDiscount}
                  premiumSummary={premiumSummary}
                  totalPayable={totalPayable}
                  availableOffers={availableOffers}
                  selectedOfferId={selectedOfferId}
                  setSelectedOfferId={setSelectedOfferId}
                  applySelectedOffer={applySelectedOffer}
                  promoError={promoError}
                  setPromoError={setPromoError}
                  setAppliedDiscount={setAppliedDiscount}
                  restaurantId={restaurantId}
                  cartItems={cartItems}
                  navigate={navigate}
                  totalItems={totalItems}
                />
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

/* ========== Cart Item Card ========== */
const CartItemCard = ({ item, increment, decrement, removeItem, index }) => {
  const itemTotal = (item.price * item.quantity).toFixed(2);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20, height: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group relative"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <div className="relative p-5 rounded-3xl bg-white dark:bg-slate-900 border border-orange-200 dark:border-white/10 shadow-md hover:shadow-xl transition-all duration-300">
        <div className="flex gap-5">
          {/* Image */}
          <div className="relative w-28 h-28 rounded-2xl overflow-hidden flex-shrink-0">
            <img
              src={item.image || "/QuickBite.png"}
              alt={item.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            {/* Quantity Badge */}
            <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gradient-to-r from-orange-500 to-pink-600 text-white flex items-center justify-center text-xs font-bold shadow-lg">
              {item.quantity}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                {item.name}
              </h4>
              {item.note && (
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 px-3 py-1.5 rounded-lg bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/30 inline-block">
                  📝 {item.note}
                </p>
              )}
              <div className="flex items-baseline gap-2 mt-2">
                <p className="text-lg font-semibold text-gray-600 dark:text-gray-400">
                  ₹{item.price} × {item.quantity}
                </p>
                <p className="text-2xl font-black bg-gradient-to-r from-orange-600 to-pink-600 dark:from-orange-400 dark:to-pink-500 bg-clip-text text-transparent">
                  = ₹{itemTotal}
                </p>
              </div>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-3">
                <motion.button
                  onClick={decrement}
                  disabled={item.quantity === 1}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                    item.quantity === 1
                      ? "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                      : "bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-500/30"
                  }`}
                  whileHover={{ scale: item.quantity === 1 ? 1 : 1.1 }}
                  whileTap={{ scale: item.quantity === 1 ? 1 : 0.9 }}
                >
                  <FaMinus className="text-sm" />
                </motion.button>

                <span className="text-lg font-bold text-gray-900 dark:text-white w-8 text-center">
                  {item.quantity}
                </span>

                <motion.button
                  onClick={increment}
                  className="w-9 h-9 rounded-xl bg-gradient-to-r from-orange-500 to-pink-600 text-white flex items-center justify-center shadow-md hover:shadow-lg transition-all"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaPlus className="text-sm" />
                </motion.button>
              </div>

              <motion.button
                onClick={removeItem}
                className="w-9 h-9 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center hover:bg-red-200 dark:hover:bg-red-900/50 transition-all"
                whileHover={{ scale: 1.1, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaTrash className="text-sm" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ========== Order Summary ========== */
const OrderSummary = ({
  subtotal,
  tax,
  deliveryFee,
  baseDeliveryFee,
  appliedDiscount,
  premiumExtraDiscount,
  premiumSummary,
  totalPayable,
  availableOffers,
  selectedOfferId,
  setSelectedOfferId,
  applySelectedOffer,
  promoError,
  setPromoError,
  setAppliedDiscount,
  restaurantId,
  cartItems,
  navigate,
  totalItems,
}) => {
  const hasPremiumBenefits =
    premiumExtraDiscount > 0 ||
    (premiumSummary.freeDelivery && subtotal < 500) ||
    (premiumSummary.cashback || 0) > 0;

  // Calculate estimated delivery time
  const estimatedTime = "25-35 min";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="relative"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-3xl blur-2xl opacity-50"></div>

      <div className="relative p-6 rounded-3xl bg-white dark:bg-slate-900 border border-orange-200 dark:border-white/10 shadow-xl space-y-5">
        {/* Header */}
        <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center text-white shadow-md">
              <FaShoppingCart />
            </div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white">
              Order Summary
            </h3>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <FaClock className="text-orange-500" />
            <span>Estimated delivery: {estimatedTime}</span>
          </div>
        </div>

        {/* Premium Benefits */}
        {hasPremiumBenefits && (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative overflow-hidden p-4 rounded-2xl bg-gradient-to-r from-yellow-400/20 via-amber-500/20 to-orange-500/20 dark:from-yellow-600/20 dark:via-amber-700/20 dark:to-orange-700/20 border border-yellow-300 dark:border-yellow-600/30"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-400/10 rounded-full blur-2xl"></div>
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <FaCrown className="text-yellow-500 text-xl" />
                <h4 className="font-bold text-yellow-700 dark:text-yellow-300">
                  Premium Benefits
                </h4>
              </div>
              <div className="space-y-2 text-sm">
                {premiumSummary.freeDelivery && subtotal < 500 && (
                  <div className="flex items-center justify-between text-yellow-700 dark:text-yellow-300">
                    <div className="flex items-center gap-2">
                      <FaTruck className="text-yellow-500" />
                      <span>Free Delivery</span>
                    </div>
                    <span className="font-bold">₹{baseDeliveryFee}</span>
                  </div>
                )}
                {premiumExtraDiscount > 0 && (
                  <div className="flex items-center justify-between text-yellow-700 dark:text-yellow-300">
                    <div className="flex items-center gap-2">
                      <FaPercent className="text-yellow-500" />
                      <span>Extra Discount</span>
                    </div>
                    <span className="font-bold">₹{premiumExtraDiscount}</span>
                  </div>
                )}
                {(premiumSummary.cashback || 0) > 0 && (
                  <div className="flex items-center justify-between text-yellow-700 dark:text-yellow-300">
                    <div className="flex items-center gap-2">
                      <FaGift className="text-yellow-500" />
                      <span>Cashback</span>
                    </div>
                    <span className="font-bold">
                      ₹{Math.round(premiumSummary.cashback)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Offers Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaTag className="text-orange-500" />
              <h4 className="font-bold text-gray-900 dark:text-white">
                Apply Offer
              </h4>
            </div>
            {availableOffers.length > 0 && (
              <span className="px-2 py-1 rounded-full bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-bold">
                {availableOffers.length} available
              </span>
            )}
          </div>

          <select
            value={selectedOfferId}
            onChange={(e) => {
              setSelectedOfferId(e.target.value);
              setPromoError("");
              setAppliedDiscount(0);
            }}
            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all"
          >
            <option value="">Select an offer</option>
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

          <motion.button
            onClick={applySelectedOffer}
            disabled={!selectedOfferId}
            className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
              selectedOfferId
                ? "bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white shadow-lg hover:shadow-xl"
                : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            }`}
            whileHover={{ scale: selectedOfferId ? 1.02 : 1 }}
            whileTap={{ scale: selectedOfferId ? 0.98 : 1 }}
          >
            <FaCheckCircle />
            Apply Offer
          </motion.button>

          <AnimatePresence mode="wait">
            {promoError && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30"
              >
                <p className="text-red-600 dark:text-red-400 text-sm font-semibold flex items-center gap-2">
                  <FaTimes className="flex-shrink-0" /> {promoError}
                </p>
              </motion.div>
            )}

            {appliedDiscount > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, height: 0 }}
                animate={{ opacity: 1, scale: 1, height: "auto" }}
                exit={{ opacity: 0, scale: 0.95, height: 0 }}
                className="p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-500/30"
              >
                <p className="text-green-600 dark:text-green-400 text-sm font-bold flex items-center gap-2">
                  <FaCheckCircle className="flex-shrink-0" /> Offer Applied: ₹
                  {appliedDiscount} saved!
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Price Breakdown */}
        <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between text-gray-700 dark:text-gray-300">
            <span>
              Subtotal ({totalItems} item{totalItems > 1 ? "s" : ""})
            </span>
            <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-700 dark:text-gray-300">
            <span>Tax (8%)</span>
            <span className="font-semibold">₹{tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-700 dark:text-gray-300">
            <span className="flex items-center gap-2">
              Delivery Fee
              {deliveryFee === 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-bold"
                >
                  FREE
                </motion.span>
              )}
            </span>
            <span className="font-semibold">
              {deliveryFee === 0 ? (
                <span className="line-through text-gray-400">
                  ₹{baseDeliveryFee.toFixed(2)}
                </span>
              ) : (
                `₹${deliveryFee.toFixed(2)}`
              )}
            </span>
          </div>

          {(appliedDiscount > 0 || premiumExtraDiscount > 0) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="flex justify-between text-green-600 dark:text-green-400 font-semibold"
            >
              <span>Total Discount</span>
              <span>
                –₹{(appliedDiscount + premiumExtraDiscount).toFixed(2)}
              </span>
            </motion.div>
          )}

          {(premiumSummary.cashback || 0) > 0 && (
            <div className="flex justify-between text-yellow-600 dark:text-yellow-400 font-semibold">
              <span className="flex items-center gap-1">
                <FaGift /> Cashback
              </span>
              <span>₹{Math.round(premiumSummary.cashback)}</span>
            </div>
          )}
        </div>

        {/* Total */}
        <div className="pt-4 border-t-2 border-gray-300 dark:border-gray-600">
          <div className="flex justify-between items-center mb-5">
            <div>
              <span className="text-sm text-gray-600 dark:text-gray-400 block mb-1">
                Total Payable
              </span>
              <span className="text-3xl font-black bg-gradient-to-r from-orange-600 to-pink-600 dark:from-orange-400 dark:to-pink-500 bg-clip-text text-transparent">
                ₹{totalPayable}
              </span>
            </div>
            {(appliedDiscount > 0 || premiumExtraDiscount > 0) && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                className="px-3 py-2 rounded-xl bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-500/30"
              >
                <div className="text-xs text-green-600 dark:text-green-400 font-semibold">
                  You saved
                </div>
                <div className="text-lg font-black text-green-600 dark:text-green-400">
                  ₹{(appliedDiscount + premiumExtraDiscount).toFixed(2)}
                </div>
              </motion.div>
            )}
          </div>

          <motion.button
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
            className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg ${
              restaurantId
                ? "bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white hover:shadow-xl"
                : "bg-gray-400 text-white cursor-not-allowed opacity-50"
            }`}
            whileHover={{ scale: restaurantId ? 1.02 : 1 }}
            whileTap={{ scale: restaurantId ? 0.98 : 1 }}
          >
            Proceed to Checkout
            <FaArrowRight />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default CustomerCart;

//old
// import React, { useEffect, useState, useContext } from "react";
// import Lottie from "lottie-react";
// import EmptyCartLottie from "../../assets/lottie icons/Shopping cart.json";
// import CartItem from "./CustomerCartItems";
// import { AuthContext } from "../../context/AuthContext";
// import API from "../../api/axios";
// import { useNavigate } from "react-router-dom";

// const CustomerCart = () => {
//   const { user } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const [cartItems, setCartItems] = useState([]);
//   const [restaurantId, setRestaurantId] = useState(null);
//   const [appliedDiscount, setAppliedDiscount] = useState(0);
//   const [promoError, setPromoError] = useState("");
//   const [availableOffers, setAvailableOffers] = useState([]);
//   const [selectedOfferId, setSelectedOfferId] = useState("");
//   const [premiumSummary, setPremiumSummary] = useState({
//     freeDelivery: false,
//     extraDiscount: 0, // percentage
//     cashback: 0,
//     totalSavings: 0,
//   });

//   // 🔄 Fetch latest active cart
//   const fetchCart = async () => {
//     if (!user?._id) return;
//     try {
//       const res = await API.get(`/cart/${user._id}`);
//       const items = res.data.cart?.items || [];
//       setCartItems(items);

//       const restId = res.data.cart?.restaurantId?._id || null;
//       setRestaurantId(restId);

//       // ✅ Premium benefits (safe fallback)
//       const premium = res.data.cart?.premiumSummary || {
//         freeDelivery: false,
//         extraDiscount: 0,
//         cashback: 0,
//         totalSavings: 0,
//       };
//       setPremiumSummary(premium);
//     } catch (err) {
//       console.error(
//         "❌ Error fetching active cart:",
//         err.response?.data || err
//       );
//       setCartItems([]);
//       setRestaurantId(null);
//       setPremiumSummary({
//         freeDelivery: false,
//         extraDiscount: 0,
//         cashback: 0,
//         totalSavings: 0,
//       });
//     }
//   };

//   useEffect(() => {
//     fetchCart();
//   }, [user]);

//   // 🎁 Fetch Offers
//   useEffect(() => {
//     if (restaurantId) {
//       API.get(`/offers/offers/valid/${restaurantId}`)
//         .then((res) => {
//           setAvailableOffers(res.data.offers || []);
//         })
//         .catch((err) => {
//           console.error("❌ Error fetching offers:", err.response?.data || err);
//           setAvailableOffers([]);
//         });
//     } else {
//       setAvailableOffers([]);
//     }
//   }, [restaurantId]);

//   // ➕ Increment
//   const increment = async (id, currentQty, note = "") => {
//     await API.post(`/cart/${user._id}/${restaurantId}/item/${id}`, {
//       quantity: currentQty + 1,
//       note,
//       applyPremium: true,
//     });
//     fetchCart();
//   };

//   // ➖ Decrement
//   const decrement = async (id, currentQty, note = "") => {
//     if (currentQty === 1) return;
//     await API.post(`/cart/${user._id}/${restaurantId}/item/${id}`, {
//       quantity: currentQty - 1,
//       note,
//       applyPremium: true,
//     });
//     fetchCart();
//   };

//   // ❌ Remove
//   const removeItem = async (id) => {
//     await API.delete(`/cart/${user._id}/${restaurantId}/item/${id}`);
//     fetchCart();
//   };

//   // 🧾 Pricing
//   const subtotal = cartItems.reduce(
//     (acc, item) => acc + item.menuItem.price * item.quantity,
//     0
//   );

//   const tax = parseFloat((subtotal * 0.08).toFixed(2));

//   // ✅ Delivery Fee
//   const baseDeliveryFee = subtotal >= 500 ? 0 : 40;
//   const deliveryFee = premiumSummary.freeDelivery ? 0 : baseDeliveryFee;

//   // ✅ Premium Extra Discount (percentage of subtotal)
//   const premiumExtraDiscount = premiumSummary.extraDiscount
//     ? parseFloat(((subtotal * premiumSummary.extraDiscount) / 100).toFixed(2))
//     : 0;

//   const totalBeforeDiscount = subtotal + tax + deliveryFee;

//   const totalPayable = Math.max(
//     totalBeforeDiscount - appliedDiscount - premiumExtraDiscount,
//     0
//   ).toFixed(2);

//   // 🎯 Apply Offer
//   const applySelectedOffer = () => {
//     const offer = availableOffers.find((o) => o._id === selectedOfferId);
//     if (!offer) {
//       setPromoError("Please select a valid offer.");
//       return;
//     }

//     if (subtotal < offer.minOrderAmount) {
//       setPromoError(`Minimum order ₹${offer.minOrderAmount} required.`);
//       return;
//     }

//     let discount = 0;
//     const type = offer.discountType.toUpperCase();

//     switch (type) {
//       case "FLAT":
//         discount = offer.discountValue;
//         break;
//       case "PERCENT":
//       case "UPTO": {
//         const percentDiscount = Math.floor(
//           (subtotal * offer.discountValue) / 100
//         );
//         discount = offer.maxDiscountAmount
//           ? Math.min(percentDiscount, offer.maxDiscountAmount)
//           : percentDiscount;
//         break;
//       }
//       default:
//         discount = 0;
//     }

//     setAppliedDiscount(discount);
//     setPromoError("");
//   };

//   return (
//     <div className="px-4 md:px-10 py-10 text-gray-800 dark:text-white">
//       <h1 className="text-3xl font-bold mb-2">🛒 Your Cart</h1>
//       <p className="text-gray-600 dark:text-gray-400 mb-6">
//         Review and manage your selected items.
//       </p>

//       {cartItems.length === 0 ? (
//         <div className="flex flex-col items-center text-center text-gray-500 mt-16">
//           <Lottie
//             animationData={EmptyCartLottie}
//             loop
//             autoplay
//             style={{ width: 200, height: 200 }}
//           />
//           <p className="text-xl font-medium">Oops! Your cart is empty.</p>
//           <p className="text-sm mt-2">Start adding tasty dishes!</p>
//         </div>
//       ) : (
//         <div className="grid md:grid-cols-3 gap-10">
//           {/* Items */}
//           <div className="md:col-span-2 space-y-6">
//             {cartItems.map((item) => (
//               <CartItem
//                 key={item.menuItem._id}
//                 item={{
//                   id: item.menuItem._id,
//                   name: item.menuItem.name,
//                   price: item.menuItem.price,
//                   quantity: item.quantity,
//                   image: item.menuItem.image,
//                   note: item.note,
//                 }}
//                 increment={() =>
//                   increment(item.menuItem._id, item.quantity, item.note)
//                 }
//                 decrement={() =>
//                   decrement(item.menuItem._id, item.quantity, item.note)
//                 }
//                 removeItem={() => removeItem(item.menuItem._id)}
//               />
//             ))}
//           </div>

//           {/* Summary */}
//           <div className="bg-white dark:bg-secondary p-6 rounded-xl shadow-md sticky top-24 h-fit space-y-5">
//             <h3 className="text-xl font-bold border-b pb-2">
//               🧾 Order Summary
//             </h3>

//             {/* Premium Summary */}
//             {premiumSummary &&
//               (premiumExtraDiscount > 0 ||
//                 (premiumSummary.freeDelivery && subtotal < 500) ||
//                 (premiumSummary.cashback || 0) > 0) && (
//                 <div className="mb-2 p-2 bg-green-50 dark:bg-green-900 rounded">
//                   <h4 className="font-semibold text-green-800 dark:text-green-300">
//                     💎 Premium Benefits Applied:
//                   </h4>
//                   {premiumSummary.freeDelivery && subtotal < 500 && (
//                     <p className="text-green-600 dark:text-green-300">
//                       Free Delivery: ₹{baseDeliveryFee}
//                     </p>
//                   )}
//                   {premiumExtraDiscount > 0 && (
//                     <p className="text-green-600 dark:text-green-300">
//                       Extra Discount: ₹{premiumExtraDiscount}
//                     </p>
//                   )}
//                   {(premiumSummary.cashback || 0) > 0 && (
//                     <p className="text-green-600 dark:text-green-300">
//                       Cashback Eligible: ₹{Math.round(premiumSummary.cashback)}
//                     </p>
//                   )}
//                 </div>
//               )}

//             {/* Offers */}
//             <div className="flex gap-2">
//               <select
//                 value={selectedOfferId}
//                 onChange={(e) => {
//                   setSelectedOfferId(e.target.value);
//                   setPromoError("");
//                   setAppliedDiscount(0);
//                 }}
//                 className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg text-sm dark:bg-gray-800 dark:text-white"
//               >
//                 <option value="">Select an Offer</option>
//                 {availableOffers.map((offer) => (
//                   <option key={offer._id} value={offer._id}>
//                     {offer.title} ({offer.discountType}) -{" "}
//                     {offer.discountType.toUpperCase() === "PERCENT" ||
//                     offer.discountType.toUpperCase() === "UPTO"
//                       ? `${offer.discountValue}%`
//                       : `₹${offer.discountValue}`}
//                   </option>
//                 ))}
//               </select>
//               <button
//                 onClick={applySelectedOffer}
//                 disabled={!selectedOfferId}
//                 className={`${
//                   selectedOfferId
//                     ? "bg-primary hover:bg-orange-600"
//                     : "bg-gray-400"
//                 } text-white px-4 py-2 rounded-lg text-sm transition mt-2 w-full`}
//               >
//                 Apply Offer
//               </button>
//             </div>

//             {promoError && <p className="text-red-500 text-sm">{promoError}</p>}
//             {appliedDiscount > 0 && (
//               <p className="text-green-600 text-sm">
//                 Discount Applied: ₹{appliedDiscount}
//               </p>
//             )}

//             {/* Price Breakdown */}
//             <div className="space-y-2 text-sm pt-2">
//               <div className="flex justify-between">
//                 <span>Subtotal</span>
//                 <span>₹{subtotal.toFixed(2)}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Tax (8%)</span>
//                 <span>₹{tax.toFixed(2)}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span>
//                   Delivery Fee{" "}
//                   {deliveryFee === 0 && (
//                     <span className="text-green-600 text-xs">(Free)</span>
//                   )}
//                 </span>
//                 <span>₹{deliveryFee.toFixed(2)}</span>
//               </div>
//               {(appliedDiscount > 0 || premiumExtraDiscount > 0) && (
//                 <div className="flex justify-between">
//                   <span>Discount</span>
//                   <span className="text-green-600">
//                     –₹{(appliedDiscount + premiumExtraDiscount).toFixed(2)}
//                   </span>
//                 </div>
//               )}
//               {(premiumSummary.cashback || 0) > 0 && (
//                 <div className="flex justify-between">
//                   <span>Cashback (eligible)</span>
//                   <span className="text-green-600">
//                     ₹{Math.round(premiumSummary.cashback)}
//                   </span>
//                 </div>
//               )}
//             </div>

//             <hr className="border-gray-200 dark:border-gray-600" />
//             <div className="flex justify-between font-semibold text-lg">
//               <span>Total</span>
//               <span>₹{totalPayable}</span>
//             </div>

//             <button
//               onClick={() => {
//                 navigate("/customer/checkout", {
//                   state: {
//                     cartItems: cartItems.map((item) => ({
//                       id: item.menuItem._id,
//                       name: item.menuItem.name,
//                       price: item.menuItem.price,
//                       quantity: item.quantity,
//                       note: item.note || "",
//                     })),
//                     subtotal,
//                     tax,
//                     deliveryFee,
//                     appliedDiscount,
//                     totalPayable,
//                     selectedOfferId,
//                     offer:
//                       availableOffers.find((o) => o._id === selectedOfferId) ||
//                       null,
//                     restaurantId,
//                     premiumSummary,
//                   },
//                 });
//               }}
//               disabled={!restaurantId}
//               className={`w-full py-3 rounded-lg font-semibold mt-4 transition ${
//                 restaurantId
//                   ? "bg-primary text-white hover:bg-orange-600"
//                   : "bg-gray-400 text-white cursor-not-allowed"
//               }`}
//             >
//               Proceed to Checkout
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CustomerCart;
