import React, { useEffect, useState } from "react";
import { FaTicketAlt, FaClipboard, FaCalendarTimes } from "react-icons/fa";
import API from "../../api/axios"; // ✅ using axios instance

const CustomerOffers = () => {
  const [offers, setOffers] = useState([]);
  const [filter, setFilter] = useState("all");

  // 🔁 Fetch offers on mount
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await API.get("/offers/public");
        setOffers(res.data.data);
      } catch (err) {
        console.error("❌ Failed to fetch offers:", err.message);
        // fallback dummy data (optional)
        setOffers([
          {
            id: 1,
            title: "Dummy 20% Off",
            discount: "20%",
            minOrder: 300,
            validity: "2025-12-31",
            status: true,
          },
        ]);
      }
    };
    fetchOffers();
  }, []);

  // 🔍 Filter by active/expired
  const filteredOffers = offers.filter((o) =>
    filter === "all"
      ? true
      : filter === "active"
      ? o.status && new Date(o.validity) >= new Date()
      : !o.status || new Date(o.validity) < new Date()
  );

  return (
    <div className="p-6 text-gray-800 dark:text-white">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <FaTicketAlt className="text-primary" /> Offers & Discounts
      </h1>

      {/* 🔘 Filters */}
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

      {/* 📦 Offers */}
      {filteredOffers.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          No {filter === "all" ? "" : filter + " "} offers available.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOffers.map((offer) => (
            <OfferCard key={offer._id || offer.id} offer={offer} />
          ))}
        </div>
      )}
    </div>
  );
};

// 📦 Single Offer Card
const OfferCard = ({ offer }) => {
  const isExpired = !offer.status || new Date(offer.validity) < new Date();

  const handleCopy = () => {
    navigator.clipboard.writeText(offer.discount);
    alert(`Copied: ${offer.discount}`);
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
        Min order ₹{offer.minOrder}
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
        <span className="text-sm text-gray-500">
          Expires: {new Date(offer.validity).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};

export default CustomerOffers;
