const Offer = require("../models/OfferModel");

// 🎁 Test controller: returns both global and restaurant-specific offers
const getTestMixedOffers = async (req, res) => {
  try {
    const now = new Date();

    // Fetch all active offers
    const offers = await Offer.find({
      isActive: true,
      validFrom: { $lte: now },
      validTill: { $gte: now },
    }).populate("restaurantId", "name"); // include restaurant name

    res.status(200).json({
      message: "Test mixed offers fetched successfully",
      offers,
    });
  } catch (err) {
    console.error("Test offers fetch error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getTestMixedOffers };
