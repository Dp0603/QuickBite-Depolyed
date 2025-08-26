const Payout = require("../models/PayoutModel");
const Restaurant = require("../models/RestaurantModel");
const generatePayoutInvoice = require("../utils/genratePayoutInvoice"); // 👈 import

// 💸 Create a new payout (Admin side)
const createPayout = async (req, res) => {
  try {
    const { payeeId, payeeType, payoutAmount } = req.body;

    let bankDetails = null;

    // If payee is restaurant → pull snapshot of payout settings
    if (payeeType === "restaurant") {
      const restaurant = await Restaurant.findById(payeeId);
      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }

      bankDetails = {
        method: restaurant.payoutSettings.preferredMethod,
        bankAccount: restaurant.payoutSettings.bankAccount,
        ifsc: restaurant.payoutSettings.ifsc,
        upiId: restaurant.payoutSettings.upiId,
      };
    }

    const payout = await Payout.create({
      payeeId,
      payeeType,
      payoutAmount,
      status: "pending",
      bankDetails,
    });

    res.status(201).json({ message: "Payout created", payout });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔁 Update payout status
const updatePayoutStatus = async (req, res) => {
  try {
    const { payoutId } = req.params;
    const { status, referenceId, note } = req.body;

    const updatedPayout = await Payout.findByIdAndUpdate(
      payoutId,
      { status, referenceId, note, processedAt: new Date() },
      { new: true }
    );

    if (!updatedPayout) {
      return res.status(404).json({ message: "Payout not found" });
    }

    res
      .status(200)
      .json({ message: "Payout status updated", payout: updatedPayout });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 👤 Get payouts for a specific payee
const getPayoutsByPayee = async (req, res) => {
  try {
    const { payeeId } = req.params;
    const payouts = await Payout.find({ payeeId }).sort({ createdAt: -1 });
    res.status(200).json({ message: "Payouts fetched", payouts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🧾 Get all payouts (Admin dashboard)
const getAllPayouts = async (req, res) => {
  try {
    const payouts = await Payout.find().sort({ createdAt: -1 });
    res.status(200).json({ message: "All payouts fetched", payouts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📄 Generate payout invoice PDF
const getPayoutInvoicePDF = async (req, res) => {
  try {
    const { payoutId } = req.params;
    const payout = await Payout.findById(payoutId);

    if (!payout) {
      return res.status(404).json({ message: "Payout not found" });
    }

    generatePayoutInvoice(payout, res);
  } catch (err) {
    console.error("❌ Payout Invoice Error:", err);
    res.status(500).json({ message: "Failed to generate payout invoice" });
  }
};

module.exports = {
  createPayout,
  updatePayoutStatus,
  getPayoutsByPayee,
  getAllPayouts,
  getPayoutInvoicePDF, // 👈 added export
};
