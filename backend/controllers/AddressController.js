const Address = require("../models/AddressModel");

// ➕ Add a new address (User or Restaurant)
const addAddress = async (req, res) => {
  try {
    const newAddress = await Address.create(req.body);

    res.status(201).json({
      message: "Address added successfully",
      address: newAddress,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📦 Get all addresses for a specific entity (User or Restaurant)
const getAddressesByEntity = async (req, res) => {
  try {
    const { entityId, entityType } = req.params;

    const addresses = await Address.find({ entityId, entityType });

    res.status(200).json({
      message: `${entityType} addresses fetched successfully`,
      addresses,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📄 Get single address by ID
const getAddressById = async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);
    if (!address) return res.status(404).json({ message: "Address not found" });

    res.status(200).json({
      message: "Address fetched successfully",
      address,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✏️ Update address
const updateAddress = async (req, res) => {
  try {
    const updated = await Address.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updated) return res.status(404).json({ message: "Address not found" });

    res.status(200).json({
      message: "Address updated successfully",
      address: updated,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🗑️ Delete address
const deleteAddress = async (req, res) => {
  try {
    const deleted = await Address.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Address not found" });

    res.status(200).json({ message: "Address deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🌟 Set address as default
const setDefaultAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const address = await Address.findById(id);
    if (!address) return res.status(404).json({ message: "Address not found" });

    // Reset existing defaults
    await Address.updateMany(
      { entityId: address.entityId, entityType: address.entityType },
      { $set: { isDefault: false } }
    );

    // Set current one as default
    address.isDefault = true;
    await address.save();

    res.status(200).json({
      message: "Default address set successfully",
      address,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  addAddress,
  getAddressesByEntity,
  getAddressById,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
};
