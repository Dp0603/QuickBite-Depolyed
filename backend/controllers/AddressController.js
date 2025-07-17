const Address = require("../models/AddressModel");

// ➕ Add new address
exports.addAddress = async (req, res) => {
  try {
    const { label, details } = req.body;

    const newAddress = new Address({
      userId: req.user._id,
      label,
      details,
    });

    const saved = await newAddress.save();
    res.status(201).json({ success: true, data: saved });
  } catch (err) {
    res.status(400).json({ success: false, message: "Failed to add address" });
  }
};

// 📥 Get all addresses for current user
exports.getMyAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json({ success: true, data: addresses });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch addresses" });
  }
};

// ❌ Delete address by ID
exports.deleteAddress = async (req, res) => {
  try {
    const address = await Address.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!address) {
      return res
        .status(404)
        .json({ success: false, message: "Address not found" });
    }

    res.status(200).json({ success: true, message: "Address deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to delete address" });
  }
};
