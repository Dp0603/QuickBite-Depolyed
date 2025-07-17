import React, { useEffect, useState, useContext } from "react";
import { FaMapMarkerAlt, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";

const CustomerAddressBook = () => {
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState("");
  const [label, setLabel] = useState("");
  const { token } = useContext(AuthContext);

  // ✅ Fetch Addresses
  const fetchAddresses = async () => {
    try {
      const res = await API.get("/customer/addresses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAddresses(res.data.data);
    } catch (err) {
      console.error("Failed to load addresses", err);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  // ➕ Add New Address
  const handleAddAddress = async () => {
    if (!newAddress || !label) return alert("Please fill both fields.");
    try {
      const res = await API.post(
        "/customer/address",
        { label, details: newAddress },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAddresses((prev) => [res.data.data, ...prev]);
      setNewAddress("");
      setLabel("");
    } catch (err) {
      alert("Failed to add address");
      console.error(err);
    }
  };

  // ❌ Delete Address
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this address?"))
      return;
    try {
      await API.delete(`/customer/address/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAddresses((prev) => prev.filter((addr) => addr._id !== id));
    } catch (err) {
      alert("Failed to delete address");
      console.error(err);
    }
  };

  return (
    <div className="p-6 text-gray-800 dark:text-white">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <FaMapMarkerAlt className="text-primary" /> Saved Addresses
      </h1>

      {/* Address List */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        {addresses.map((addr) => (
          <div
            key={addr._id}
            className={`p-5 bg-white dark:bg-secondary border rounded-xl shadow flex flex-col justify-between ${
              addr.isDefault
                ? "border-primary ring-2 ring-primary"
                : "border-gray-200 dark:border-gray-700"
            }`}
          >
            <div>
              <h3 className="font-semibold text-lg mb-1">{addr.label}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {addr.details}
              </p>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                className="flex items-center gap-2 text-sm bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-white px-3 py-1.5 rounded-md transition"
                onClick={() => alert("Edit functionality coming soon!")}
              >
                <FaEdit /> Edit
              </button>
              <button
                className="flex items-center gap-2 text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md transition"
                onClick={() => handleDelete(addr._id)}
              >
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Address */}
      <div className="max-w-xl mx-auto p-6 bg-white dark:bg-secondary rounded-xl shadow border dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FaPlus className="text-primary" /> Add New Address
        </h2>
        <input
          type="text"
          placeholder="Label (e.g., Home, Office)"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="w-full px-4 py-2 mb-3 border rounded-md dark:bg-gray-800 dark:text-white dark:border-gray-600 text-sm"
        />
        <textarea
          placeholder="Enter full address"
          value={newAddress}
          onChange={(e) => setNewAddress(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded-md dark:bg-gray-800 dark:text-white dark:border-gray-600 text-sm"
          rows="3"
        />
        <button
          onClick={handleAddAddress}
          className="w-full bg-primary hover:bg-orange-600 text-white font-medium py-2 rounded-md transition text-sm"
        >
          Save Address
        </button>
      </div>
    </div>
  );
};

export default CustomerAddressBook;
