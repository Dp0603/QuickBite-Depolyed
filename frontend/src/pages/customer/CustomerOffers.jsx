import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTicketAlt,
  FaClipboard,
  FaCalendarTimes,
  FaChevronLeft,
  FaChevronRight,
  FaStore,
  FaGlobe,
  FaFire,
  FaClock,
  FaCheckCircle,
  FaPercent,
  FaTag,
} from "react-icons/fa";
import API from "../../api/axios";

const CustomerOffers = () => {
  const [offers, setOffers] = useState([]);
  const [filter, setFilter] = useState("all");
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch offers
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true);
        const res = await API.get("/offers/offers/all");
        const allOffers = [...res.data.activeOffers, ...res.data.expiredOffers];
        setOffers(allOffers);
      } catch (err) {
        console.error("Failed to fetch offers:", err.message);
        setOffers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setFeaturedIndex(
        (prev) => (prev + 1) % Math.max(1, featuredOffers.length)
      );
    }, 5000);
    return () => clearInterval(timer);
  }, [offers]);

  // Apply filter logic
  const filteredOffers = offers.filter((o) => {
    const now = new Date();
    const start = new Date(o.validFrom);
    const end = new Date(o.validTill);

    const isActive = o.isActive && start <= now && end >= now;
    const isExpired = end < now || !o.isActive;
    const isUpcoming = start > now;

    if (filter === "all") return true;
    if (filter === "active") return isActive;
    if (filter === "expired") return isExpired;
    if (filter === "upcoming") return isUpcoming;
    return true;
  });

  const globalOffers = filteredOffers.filter((o) => !o.restaurantId);
  const restaurantOffers = filteredOffers.filter((o) => o.restaurantId);

  const featuredOffers = filteredOffers.slice(0, 3);

  const handlePrev = () => {
    setFeaturedIndex((prev) =>
      prev === 0 ? featuredOffers.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setFeaturedIndex((prev) =>
      prev === featuredOffers.length - 1 ? 0 : prev + 1
    );
  };

  // Count offers by status
  const counts = {
    all: offers.length,
    active: offers.filter((o) => {
      const now = new Date();
      return (
        o.isActive &&
        new Date(o.validFrom) <= now &&
        new Date(o.validTill) >= now
      );
    }).length,
    expired: offers.filter(
      (o) => new Date(o.validTill) < new Date() || !o.isActive
    ).length,
    upcoming: offers.filter((o) => new Date(o.validFrom) > new Date()).length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading offers...</p>
        </motion.div>
      </div>
    );
  }

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
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-orange-600 to-pink-600 dark:from-orange-400 dark:to-pink-500 bg-clip-text text-transparent mb-3 flex items-center gap-3">
            <FaTicketAlt className="text-orange-500" />
            Offers & Discounts
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Save more with exclusive deals and promo codes
          </p>
        </div>

        {/* Featured Carousel */}
        {featuredOffers.length > 0 && (
          <FeaturedCarousel
            offers={featuredOffers}
            currentIndex={featuredIndex}
            onPrev={handlePrev}
            onNext={handleNext}
            setIndex={setFeaturedIndex}
          />
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          {[
            { value: "all", label: "All Offers", icon: FaTag },
            { value: "active", label: "Active", icon: FaCheckCircle },
            { value: "expired", label: "Expired", icon: FaCalendarTimes },
            { value: "upcoming", label: "Upcoming", icon: FaClock },
          ].map((f) => {
            const Icon = f.icon;
            const isActive = filter === f.value;
            return (
              <motion.button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`relative flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-orange-500 to-pink-600 text-white shadow-lg"
                    : "bg-white dark:bg-slate-900 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-700 hover:border-orange-500"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon />
                <span>{f.label}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    isActive
                      ? "bg-white/20"
                      : "bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400"
                  }`}
                >
                  {counts[f.value]}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Global Offers */}
        <OfferSection
          title="Global Offers"
          offers={globalOffers}
          type="global"
          icon={FaGlobe}
        />

        {/* Restaurant Offers */}
        <OfferSection
          title="Restaurant Offers"
          offers={restaurantOffers}
          type="restaurant"
          icon={FaStore}
        />
      </motion.div>
    </div>
  );
};

/* ========== Featured Carousel ========== */
const FeaturedCarousel = ({
  offers,
  currentIndex,
  onPrev,
  onNext,
  setIndex,
}) => {
  const offer = offers[currentIndex];
  const isExpired = !offer.isActive || new Date(offer.validTill) < new Date();

  const handleCopy = () => {
    if (offer.promoCode) {
      navigator.clipboard.writeText(offer.promoCode);
      alert(`✅ Copied: ${offer.promoCode}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="relative mb-10"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-3xl blur-2xl opacity-50"></div>

      <div className="relative overflow-hidden rounded-3xl shadow-2xl border border-orange-200 dark:border-white/10">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-pink-600 to-purple-600"></div>
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&w=1600&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>

        {/* Content */}
        <div className="relative z-10 p-8 md:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="text-white"
            >
              {/* Featured Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-4">
                <FaFire className="text-yellow-300" />
                <span className="font-bold">Featured Offer</span>
              </div>

              <h3 className="text-3xl md:text-4xl font-black mb-3 drop-shadow-lg">
                {offer.title}
              </h3>

              {offer.restaurantId && (
                <p className="text-white/90 mb-2 flex items-center gap-2">
                  <FaStore />
                  {offer.restaurantId.name}
                </p>
              )}

              {offer.minOrderAmount && (
                <p className="text-white/90 mb-4">
                  Minimum order ₹{offer.minOrderAmount}
                </p>
              )}

              {/* Discount Display */}
              {offer.discountValue && (
                <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 mb-6">
                  <FaPercent className="text-yellow-300 text-2xl" />
                  <div>
                    <div className="text-sm text-white/80">Save up to</div>
                    <div className="text-3xl font-black">
                      {offer.discountType.toUpperCase() === "FLAT"
                        ? `₹${offer.discountValue}`
                        : `${offer.discountValue}%`}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-4">
                {offer.promoCode && !isExpired && (
                  <motion.button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-orange-600 font-bold shadow-lg hover:shadow-xl transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaClipboard />
                    Copy Code: {offer.promoCode}
                  </motion.button>
                )}
                <span className="text-white/80 flex items-center gap-2">
                  <FaClock />
                  Expires: {new Date(offer.validTill).toLocaleDateString()}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="absolute right-8 top-1/2 -translate-y-1/2 flex gap-3">
            <motion.button
              onClick={onPrev}
              className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-all"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaChevronLeft />
            </motion.button>
            <motion.button
              onClick={onNext}
              className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-all"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaChevronRight />
            </motion.button>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {offers.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === currentIndex ? "bg-white w-8" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ========== Offer Section ========== */
const OfferSection = ({ title, offers, type, icon: Icon }) => {
  if (!offers.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h2 className="text-3xl font-black bg-gradient-to-r from-orange-600 to-pink-600 dark:from-orange-400 dark:to-pink-500 bg-clip-text text-transparent mb-6 flex items-center gap-3">
          <Icon className="text-orange-500" />
          {title}
        </h2>
        <div className="text-center py-12 rounded-3xl bg-white dark:bg-slate-900 border border-orange-200 dark:border-white/10 shadow-md">
          <div className="text-6xl mb-4">🎫</div>
          <p className="text-gray-500 dark:text-gray-400">
            No {title.toLowerCase()} available
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-10"
    >
      <h2 className="text-3xl font-black bg-gradient-to-r from-orange-600 to-pink-600 dark:from-orange-400 dark:to-pink-500 bg-clip-text text-transparent mb-6 flex items-center gap-3">
        <Icon className="text-orange-500" />
        {title}
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {offers.map((offer, index) => (
            <OfferCard
              key={offer._id}
              offer={offer}
              type={type}
              index={index}
            />
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

/* ========== Offer Card ========== */
const OfferCard = ({ offer, type, index }) => {
  const now = new Date();
  const start = new Date(offer.validFrom);
  const end = new Date(offer.validTill);

  const isActive = offer.isActive && start <= now && end >= now;
  const isExpired = end < now || !offer.isActive;
  const isUpcoming = start > now;

  const handleCopy = () => {
    if (offer.promoCode) {
      navigator.clipboard.writeText(offer.promoCode);
      alert(`✅ Copied: ${offer.promoCode}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.05 }}
      className={`group relative ${isExpired ? "opacity-60" : ""}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <div
        className={`relative p-6 rounded-3xl border shadow-md hover:shadow-xl transition-all duration-300 ${
          type === "global"
            ? "bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 border-yellow-300 dark:border-yellow-600/30"
            : "bg-white dark:bg-slate-900 border-orange-200 dark:border-white/10"
        }`}
      >
        {/* Status Badges */}
        <div className="flex items-center justify-between mb-4">
          {type === "global" ? (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold shadow-md">
              <FaGlobe /> Global
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-500 to-pink-600 text-white text-xs font-bold shadow-md">
              <FaStore /> {offer.restaurantId?.name || "Restaurant"}
            </span>
          )}

          {isExpired && (
            <div className="text-red-500 text-xl">
              <FaCalendarTimes />
            </div>
          )}

          {isUpcoming && (
            <span className="px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold">
              Coming Soon
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
          {offer.title}
        </h3>

        {/* Discount Badge */}
        {offer.discountValue && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-500/30 mb-4">
            <FaPercent className="text-green-600 dark:text-green-400" />
            <span className="font-bold text-green-700 dark:text-green-300">
              {offer.discountType.toUpperCase() === "FLAT"
                ? `₹${offer.discountValue} OFF`
                : `${offer.discountValue}% OFF`}
            </span>
          </div>
        )}

        {/* Min Order */}
        {offer.minOrderAmount && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Minimum order: ₹{offer.minOrderAmount}
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          {offer.promoCode && isActive ? (
            <motion.button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-bold shadow-md hover:shadow-lg transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaClipboard />
              Copy Code
            </motion.button>
          ) : isExpired ? (
            <span className="text-sm font-semibold text-red-600 dark:text-red-400">
              Expired
            </span>
          ) : isUpcoming ? (
            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
              Starting Soon
            </span>
          ) : null}

          <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <FaClock />
            {isUpcoming ? start.toLocaleDateString() : end.toLocaleDateString()}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default CustomerOffers;
