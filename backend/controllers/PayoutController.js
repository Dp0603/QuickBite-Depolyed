const Payout = require("../models/PayoutModel");

// ➕ Create a payout
const createPayout = async (req, res) => {
  try {
    const payout = await Payout.create(req.body);
    res.status(201).json({ message: "Payout created", data: payout });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📦 Get all payouts (admin)
const getAllPayouts = async (req, res) => {
  try {
    const payouts = await Payout.find()
      .populate("userId", "name email")
      .populate("orders", "totalAmount status createdAt");
    res.status(200).json({ message: "All payouts", data: payouts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🧍 Get payouts by user (restaurant or delivery)
const getUserPayouts = async (req, res) => {
  try {
    const { userId } = req.params;
    const payouts = await Payout.find({ userId })
      .sort({ createdAt: -1 })
      .populate("orders", "totalAmount createdAt status");
    res.status(200).json({ message: "User payouts", data: payouts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✏️ Mark payout as paid
const markPayoutPaid = async (req, res) => {
  try {
    const payout = await Payout.findByIdAndUpdate(
      req.params.id,
      {
        status: "Paid",
        paidAt: new Date(),
      },
      { new: true }
    );
    res.status(200).json({ message: "Payout marked as paid", data: payout });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createPayout,
  getAllPayouts,
  getUserPayouts,
  markPayoutPaid,
};
