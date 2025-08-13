import React, { useEffect, useState } from "react";
import {
  FaTicketAlt,
  FaClipboard,
  FaCalendarTimes,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import API from "../../api/axios"; // ✅ your axios instance

const CustomerOffers = () => {
  const [offers, setOffers] = useState([]);
  const [filter, setFilter] = useState("all");
  const [featuredIndex, setFeaturedIndex] = useState(0);

  // Fetch offers from test route
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await API.get("/offers/test-mixed");
        setOffers(res.data.offers);
      } catch (err) {
        console.error("Failed to fetch offers:", err.message);
        setOffers([]);
      }
    };
    fetchOffers();
  }, []);

  const filteredOffers = offers.filter((o) => {
    const isExpired = !o.isActive || new Date(o.validTill) < new Date();
    return filter === "all"
      ? true
      : filter === "active"
      ? !isExpired
      : isExpired;
  });

  const globalOffers = filteredOffers.filter((o) => !o.restaurantId);
  const restaurantOffers = filteredOffers.filter((o) => o.restaurantId);

  // Featured carousel: top 3 offers
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

  return (
    <div className="p-6 max-w-7xl mx-auto text-gray-800 dark:text-white">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
        <FaTicketAlt className="text-primary text-4xl" /> Offers & Discounts
      </h1>

      {/* Featured Carousel */}
      {featuredOffers.length > 0 && (
        <FeaturedCarousel
          offers={featuredOffers}
          currentIndex={featuredIndex}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}

      {/* Filters */}
      <div className="flex gap-3 my-8">
        {["all", "active", "expired"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-5 py-2 font-medium rounded-full transition duration-300 ${
              filter === f
                ? "bg-primary text-white shadow-lg"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Global Offers */}
      <OfferSection title="Global Offers" offers={globalOffers} type="global" />

      {/* Restaurant Offers */}
      <OfferSection
        title="Restaurant Offers"
        offers={restaurantOffers}
        type="restaurant"
      />
    </div>
  );
};

// Featured Carousel Component
const FeaturedCarousel = ({ offers, currentIndex, onPrev, onNext }) => {
  const offer = offers[currentIndex];
  const isExpired = !offer.isActive || new Date(offer.validTill) < new Date();

  const handleCopy = () => {
    if (offer.promoCode) {
      navigator.clipboard.writeText(offer.promoCode);
      alert(`Copied: ${offer.promoCode}`);
    }
  };

  return (
    <div className="relative mb-10">
      <div className="bg-gradient-to-r from-primary/20 to-primary/10 dark:from-primary-dark/30 dark:to-primary-dark/10 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between shadow-lg">
        <div className="flex-1">
          <h3 className="text-2xl sm:text-3xl font-bold mb-2">{offer.title}</h3>
          {offer.restaurantId && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Restaurant: {offer.restaurantId.name}
            </p>
          )}
          {offer.minOrderAmount && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Minimum order ₹{offer.minOrderAmount}
            </p>
          )}
          <div className="flex items-center gap-4">
            {offer.promoCode && !isExpired && (
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg shadow hover:bg-orange-600 transition"
              >
                <FaClipboard /> Copy Code
              </button>
            )}
            <span className="text-sm text-gray-500">
              Expires: {new Date(offer.validTill).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-4 mt-4 sm:mt-0">
          <button
            onClick={onPrev}
            className="bg-white dark:bg-gray-800 p-2 rounded-full shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <FaChevronLeft />
          </button>
          <button
            onClick={onNext}
            className="bg-white dark:bg-gray-800 p-2 rounded-full shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

// Offer Section Component
const OfferSection = ({ title, offers, type }) => {
  if (!offers.length)
    return (
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        No {title.toLowerCase()} available.
      </p>
    );

  return (
    <div className="mb-10">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {offers.map((offer) => (
          <OfferCard key={offer._id} offer={offer} type={type} />
        ))}
      </div>
    </div>
  );
};

// Single Offer Card Component
const OfferCard = ({ offer, type }) => {
  const now = new Date();
  const isExpired = !offer.isActive || new Date(offer.validTill) < now;

  const handleCopy = () => {
    if (offer.promoCode) {
      navigator.clipboard.writeText(offer.promoCode);
      alert(`Copied: ${offer.promoCode}`);
    }
  };

  return (
    <div
      className={`relative p-6 rounded-2xl shadow-md border transition transform hover:scale-[1.03] hover:shadow-xl ${
        isExpired ? "opacity-60" : ""
      } ${
        type === "global"
          ? "bg-gradient-to-r from-yellow-100 to-yellow-200 dark:from-yellow-700 dark:to-yellow-800 border-yellow-300"
          : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
      }`}
    >
      {/* Badge */}
      {type === "global" ? (
        <span className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-semibold uppercase shadow">
          Global
        </span>
      ) : (
        <span className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold uppercase shadow">
          {offer.restaurantId?.name || "Restaurant"}
        </span>
      )}

      {isExpired && (
        <div className="absolute top-4 right-4 text-red-500 text-xl">
          <FaCalendarTimes />
        </div>
      )}

      <h3 className="text-xl font-bold mt-6 mb-2">{offer.title}</h3>
      {offer.minOrderAmount && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Minimum order ₹{offer.minOrderAmount}
        </p>
      )}

      <div className="flex items-center justify-between mt-4">
        {offer.promoCode && !isExpired ? (
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium shadow hover:bg-orange-600 transition"
          >
            <FaClipboard /> Copy Code
          </button>
        ) : isExpired ? (
          <span className="text-sm italic text-gray-500">Expired</span>
        ) : null}

        <span className="text-sm text-gray-500">
          Expires: {new Date(offer.validTill).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};

export default CustomerOffers;
