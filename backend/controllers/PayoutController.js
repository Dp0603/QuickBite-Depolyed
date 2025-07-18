const Payout = require("../models/PayoutModel");

// 💸 Create a new payout (Admin side)
const createPayout = async (req, res) => {
  try {
    const payout = await Payout.create(req.body);
    res.status(201).json({ message: "Payout created", payout });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔁 Update payout status (Pending -> Processed/Failed)
const updatePayoutStatus = async (req, res) => {
  try {
    const { payoutId } = req.params;
    const { status, referenceId, note } = req.body;

    const updatedPayout = await Payout.findByIdAndUpdate(
      payoutId,
      { status, referenceId, note },
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

// 👤 Get payouts for a specific payee (restaurant/delivery agent)
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

module.exports = {
  createPayout,
  updatePayoutStatus,
  getPayoutsByPayee,
  getAllPayouts,
};
