const Payout = require("../models/PayoutModel");
const Restaurant = require("../models/RestaurantModel");
const generatePayoutInvoice = require("../utils/genratePayoutInvoice");

// 💸 Create a new payout (Admin side)
const createPayout = async (req, res) => {
  try {
    const { payeeId, payeeType, payoutAmount } = req.body;

    if (!payeeId || !payeeType || !payoutAmount) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let bankDetails = null;

    // If payee is a restaurant, pull payout settings snapshot
    if (payeeType === "restaurant") {
      const restaurant = await Restaurant.findById(payeeId);
      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }

      if (!restaurant.payoutSettings) {
        return res
          .status(400)
          .json({ message: "Restaurant has no payout settings configured" });
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

    res.status(201).json({ message: "Payout created successfully", payout });
  } catch (err) {
    console.error("❌ createPayout error:", err);
    res.status(500).json({ message: err.message });
  }
};

// 🔁 Update payout status
const updatePayoutStatus = async (req, res) => {
  try {
    const { payoutId } = req.params;
    const { status, referenceId, note } = req.body;

    if (!["pending", "paid", "failed"].includes(status)) {
      return res.status(400).json({ message: "Invalid payout status" });
    }

    const updatedPayout = await Payout.findByIdAndUpdate(
      payoutId,
      { status, referenceId, note, processedAt: new Date() },
      { new: true }
    );

    if (!updatedPayout) {
      return res.status(404).json({ message: "Payout not found" });
    }

    res.status(200).json({
      message: "Payout status updated successfully",
      payout: updatedPayout,
    });
  } catch (err) {
    console.error("❌ updatePayoutStatus error:", err);
    res.status(500).json({ message: err.message });
  }
};

// 👤 Get all payouts for a specific restaurant owner or payee
const getPayoutsByPayee = async (req, res) => {
  try {
    const { payeeId } = req.params; // this is the user's _id

    // ✅ Step 1: Find restaurant owned by this user
    const restaurant = await require("../models/RestaurantModel").findOne({
      owner: payeeId,
    });

    // Build query to match either direct payeeId (delivery agent) or owned restaurant
    const query = {
      $or: [
        { payeeId, payeeType: /delivery/i }, // for delivery partners
        ...(restaurant ? [{ payeeId: restaurant._id }] : []),
      ],
    };

    // ✅ Step 2: Fetch payouts
    const payouts = await Payout.find(query).sort({ createdAt: -1 });

    // ✅ Step 3: Include payout bank info and restaurant info if available
    let bankDetails = null;
    let nextPayoutDate = null;

    if (restaurant) {
      bankDetails = restaurant.payoutSettings || null;

      // Example: compute next payout based on frequency
      if (restaurant.payoutSettings?.payoutFrequency === "weekly") {
        const now = new Date();
        const next = new Date(now.setDate(now.getDate() + (7 - now.getDay())));
        nextPayoutDate = next;
      }
    }

    res.status(200).json({
      message: "Payouts fetched successfully",
      payouts,
      bankDetails,
      nextPayoutDate,
    });
  } catch (err) {
    console.error("❌ getPayoutsByPayee error:", err);
    res.status(500).json({ message: err.message });
  }
};

// 🧾 Get all payouts (Admin dashboard)
const getAllPayouts = async (req, res) => {
  try {
    const payouts = await Payout.find()
      .populate("payeeId", "name email")
      .sort({ createdAt: -1 });
    res
      .status(200)
      .json({ message: "All payouts fetched successfully", payouts });
  } catch (err) {
    console.error("❌ getAllPayouts error:", err);
    res.status(500).json({ message: err.message });
  }
};

// 📄 Generate payout invoice PDF
const getPayoutInvoicePDF = async (req, res) => {
  try {
    const { payoutId } = req.params;
    const payout = await Payout.findById(payoutId).populate(
      "payeeId",
      "name email"
    );

    if (!payout) {
      return res.status(404).json({ message: "Payout not found" });
    }

    await generatePayoutInvoice(payout, res);
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
  getPayoutInvoicePDF,
};
