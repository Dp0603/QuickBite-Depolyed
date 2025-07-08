import React, { useState } from "react";
import { FaTicketAlt, FaClipboard, FaCalendarTimes } from "react-icons/fa";

const dummyOffers = [
  {
    id: 1,
    title: "20% off on all orders",
    code: "SAVE20",
    description: "Valid on orders above ₹300",
    expiry: "2025-12-31",
    active: true,
  },
  {
    id: 2,
    title: "Free Delivery",
    code: "FREEDEL",
    description: "Unlimited free delivery",
    expiry: "2025-07-31",
    active: true,
  },
  {
    id: 3,
    title: "15% off (Expired)",
    code: "OLD15",
    description: "Expired offer",
    expiry: "2025-01-31",
    active: false,
  },
];

const CustomerOffers = () => {
  const [filter, setFilter] = useState("all");

  const filteredOffers = dummyOffers.filter((o) =>
    filter === "all" ? true : filter === "active" ? o.active : !o.active
  );

  return (
    <div className="p-6 text-gray-800 dark:text-white">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <FaTicketAlt className="text-primary" /> Offers & Discounts
      </h1>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        {["all", "active", "expired"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg transition ${
              filter === f
                ? "bg-primary text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {filteredOffers.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          No {filter === "all" ? "" : filter + " "} offers available.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOffers.map((offer) => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </div>
      )}
    </div>
  );
};

const OfferCard = ({ offer }) => {
  const isExpired = !offer.active;
  const handleCopy = () => {
    navigator.clipboard.writeText(offer.code);
    alert(`Copied code: ${offer.code}`);
  };

  return (
    <div
      className={`relative p-6 border rounded-xl shadow-md transition transform hover:scale-[1.02] bg-white dark:bg-secondary border-gray-200 dark:border-gray-700 ${
        isExpired ? "opacity-60" : ""
      }`}
    >
      {isExpired && (
        <div className="absolute top-3 right-3 text-red-500">
          <FaCalendarTimes />
        </div>
      )}
      <h3 className="text-xl font-semibold mb-2">{offer.title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        {offer.description}
      </p>
      <div className="flex items-center justify-between">
        {isExpired ? (
          <span className="text-sm italic text-gray-500">Expired</span>
        ) : (
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md text-sm transition hover:bg-orange-600"
          >
            <FaClipboard />
            Copy Code
          </button>
        )}
        <span className="text-sm text-gray-500">Expires: {offer.expiry}</span>
      </div>
    </div>
  );
};

export default CustomerOffers;
