const Offer = require("../models/OfferModel");

// 🔃 GET offers for the logged-in restaurant
const getOffers = async (req, res) => {
  try {
    const offers = await Offer.find({ restaurantId: req.user.id });
    res.status(200).json({ message: "Offers fetched", data: offers });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ➕ CREATE new offer
const createOffer = async (req, res) => {
  try {
    const newOffer = await Offer.create({
      ...req.body,
      restaurantId: req.user.id,
    });
    res.status(201).json({ message: "Offer created", data: newOffer });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔁 UPDATE offer
const updateOffer = async (req, res) => {
  try {
    const updated = await Offer.findOneAndUpdate(
      { _id: req.params.id, restaurantId: req.user.id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Offer not found" });
    res.status(200).json({ message: "Offer updated", data: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ❌ DELETE offer
const deleteOffer = async (req, res) => {
  try {
    await Offer.findOneAndDelete({
      _id: req.params.id,
      restaurantId: req.user.id,
    });
    res.status(200).json({ message: "Offer deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getOffers, createOffer, updateOffer, deleteOffer };
