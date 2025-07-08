import React, { useState } from "react";
import { FaMapMarkerAlt, FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const initialAddresses = [
  {
    id: 1,
    label: "Home",
    details: "123 Main Street, Delhi, India",
    isDefault: true,
  },
  {
    id: 2,
    label: "Work",
    details: "456 Office Park, Bangalore, India",
    isDefault: false,
  },
];

const CustomerAddressBook = () => {
  const [addresses, setAddresses] = useState(initialAddresses);
  const [newAddress, setNewAddress] = useState("");
  const [label, setLabel] = useState("");

  const handleAddAddress = () => {
    if (!newAddress || !label) return alert("Please fill both fields.");

    const newEntry = {
      id: Date.now(),
      label,
      details: newAddress,
      isDefault: false,
    };
    setAddresses((prev) => [...prev, newEntry]);
    setNewAddress("");
    setLabel("");
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      setAddresses(addresses.filter((addr) => addr.id !== id));
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
            key={addr.id}
            className={`p-5 bg-white dark:bg-secondary border rounded-xl shadow flex flex-col justify-between ${
              addr.isDefault ? "border-primary ring-2 ring-primary" : "border-gray-200 dark:border-gray-700"
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
                onClick={() => handleDelete(addr.id)}
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
