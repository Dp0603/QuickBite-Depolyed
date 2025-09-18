const Offer = require("../models/OfferModel");

// 🎁 Create new offer
const createOffer = async (req, res) => {
  try {
    const { restaurantId, validFrom, validTill, promoCode } = req.body;

    if (!restaurantId)
      return res.status(400).json({ message: "Restaurant ID is required." });
    if (new Date(validFrom) > new Date(validTill))
      return res
        .status(400)
        .json({ message: "validFrom cannot be after validTill." });

    if (promoCode) req.body.promoCode = promoCode.toUpperCase().trim();

    const offer = await Offer.create({ ...req.body, restaurantId });

    res.status(201).json({ message: "Offer created successfully.", offer });
  } catch (err) {
    if (err.name === "ValidationError")
      return res.status(400).json({ message: err.message });
    if (err.code === 11000 && err.keyPattern?.promoCode)
      return res.status(400).json({ message: "Promo code already exists." });
    console.error("❌ createOffer error:", err);
    res.status(500).json({ message: err.message });
  }
};

// 📦 Get all offers for a restaurant (admin/owner)
const getOffersByRestaurant = async (req, res) => {
  try {
    const offers = await Offer.find({ restaurantId: req.params.restaurantId });
    res.status(200).json({ message: "Offers fetched successfully", offers });
  } catch (err) {
    console.error("❌ getOffersByRestaurant error:", err);
    res.status(500).json({ message: err.message });
  }
};

// 🔍 Get single offer by ID
const getOfferById = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) return res.status(404).json({ message: "Offer not found" });
    res.status(200).json({ message: "Offer fetched successfully", offer });
  } catch (err) {
    console.error("❌ getOfferById error:", err);
    res.status(500).json({ message: err.message });
  }
};

// 🔁 Update offer
const updateOffer = async (req, res) => {
  try {
    const { validFrom, validTill, promoCode } = req.body;
    if (validFrom && validTill && new Date(validFrom) > new Date(validTill))
      return res
        .status(400)
        .json({ message: "validFrom cannot be after validTill." });

    if (promoCode) req.body.promoCode = promoCode.toUpperCase().trim();

    const updatedOffer = await Offer.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedOffer)
      return res.status(404).json({ message: "Offer not found." });

    res
      .status(200)
      .json({ message: "Offer updated successfully.", offer: updatedOffer });
  } catch (err) {
    if (err.name === "ValidationError")
      return res.status(400).json({ message: err.message });
    if (err.code === 11000 && err.keyPattern?.promoCode)
      return res.status(400).json({ message: "Promo code already exists." });
    console.error("❌ updateOffer error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ❌ Delete offer
const deleteOffer = async (req, res) => {
  try {
    const deleted = await Offer.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Offer not found" });
    res.status(200).json({ message: "Offer deleted successfully" });
  } catch (err) {
    console.error("❌ deleteOffer error:", err);
    res.status(500).json({ message: err.message });
  }
};

// 📅 Get active & valid offers for customer
const getValidOffersForCustomer = async (req, res) => {
  try {
    const now = new Date();
    const offers = await Offer.find({
      restaurantId: req.params.restaurantId,
      isActive: true,
      validFrom: { $lte: now },
      validTill: { $gte: now },
    });

    res
      .status(200)
      .json({ message: "Valid offers fetched successfully", offers });
  } catch (err) {
    console.error("❌ getValidOffersForCustomer error:", err);
    res.status(500).json({ message: err.message });
  }
};

// 🔄 Toggle offer active status
const toggleOfferStatus = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) return res.status(404).json({ message: "Offer not found" });

    offer.isActive = !offer.isActive;
    await offer.save();

    res
      .status(200)
      .json({
        message: `Offer is now ${offer.isActive ? "active" : "inactive"}`,
        offer,
      });
  } catch (err) {
    console.error("❌ toggleOfferStatus error:", err);
    res.status(500).json({ message: err.message });
  }
};

// 🎟️ Validate and fetch offer by promo code
const getOfferByPromoCode = async (req, res) => {
  try {
    const { promoCode, restaurantId } = req.query;
    if (!promoCode)
      return res.status(400).json({ message: "Promo code is required" });

    const now = new Date();
    const offer = await Offer.findOne({
      promoCode: promoCode.toUpperCase().trim(),
      restaurantId,
      isActive: true,
      validFrom: { $lte: now },
      validTill: { $gte: now },
    });

    if (!offer)
      return res.status(404).json({ message: "Invalid or expired promo code" });

    res.status(200).json({ message: "Promo code applied successfully", offer });
  } catch (err) {
    console.error("❌ getOfferByPromoCode error:", err);
    res.status(500).json({ message: err.message });
  }
};

// 🌐 Fetch all offers (global + restaurant), split active vs expired
const getAllOffersForCustomer = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const query = restaurantId ? { restaurantId } : {};
    const now = new Date();

    const offers = await Offer.find(query).populate("restaurantId", "name");

    const activeOffers = offers.filter(
      (offer) =>
        offer.isActive && offer.validFrom <= now && offer.validTill >= now
    );
    const expiredOffers = offers.filter((offer) => offer.validTill < now);

    res
      .status(200)
      .json({
        message: "All offers fetched successfully",
        activeOffers,
        expiredOffers,
      });
  } catch (err) {
    console.error("❌ getAllOffersForCustomer error:", err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createOffer,
  getOffersByRestaurant,
  getOfferById,
  updateOffer,
  deleteOffer,
  getValidOffersForCustomer,
  toggleOfferStatus,
  getOfferByPromoCode,
  getAllOffersForCustomer,
};
