import React, { useState } from "react";
import { FaEdit, FaTrash, FaToggleOn, FaToggleOff } from "react-icons/fa";

const RestaurantOffersManager = () => {
  const [offers, setOffers] = useState([
    {
      id: 1,
      title: "Get 20% Off on Orders Above ₹299",
      discount: "20%",
      minOrder: 299,
      status: true,
      validity: "2025-07-31",
    },
    {
      id: 2,
      title: "Flat ₹100 Off on Weekend Orders",
      discount: "₹100",
      minOrder: 499,
      status: false,
      validity: "2025-08-15",
    },
  ]);

  const [newOffer, setNewOffer] = useState({
    title: "",
    discount: "",
    minOrder: "",
    validity: "",
  });

  const handleToggleStatus = (id) => {
    setOffers((prev) =>
      prev.map((offer) =>
        offer.id === id ? { ...offer, status: !offer.status } : offer
      )
    );
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this offer?")) {
      setOffers((prev) => prev.filter((offer) => offer.id !== id));
    }
  };

  const handleAddOffer = () => {
    const { title, discount, minOrder, validity } = newOffer;
    if (!title || !discount || !minOrder || !validity) {
      alert("Please fill all fields.");
      return;
    }

    setOffers((prev) => [
      ...prev,
      { ...newOffer, id: Date.now(), status: true },
    ]);

    setNewOffer({ title: "", discount: "", minOrder: "", validity: "" });
  };

  return (
    <div className="p-6 text-gray-800 dark:text-white">
      <h2 className="text-2xl font-bold mb-6">🎉 Manage Offers</h2>

      {/* Create Offer Section */}
      <div className="bg-white dark:bg-secondary p-5 rounded-xl shadow mb-8">
        <h3 className="text-lg font-semibold mb-4">Add New Offer</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Offer Title"
            value={newOffer.title}
            onChange={(e) =>
              setNewOffer({ ...newOffer, title: e.target.value })
            }
            className="input-style"
          />
          <input
            type="text"
            placeholder="Discount (e.g. 20%, ₹100)"
            value={newOffer.discount}
            onChange={(e) =>
              setNewOffer({ ...newOffer, discount: e.target.value })
            }
            className="input-style"
          />
          <input
            type="number"
            placeholder="Minimum Order ₹"
            value={newOffer.minOrder}
            onChange={(e) =>
              setNewOffer({ ...newOffer, minOrder: e.target.value })
            }
            className="input-style"
          />
          <input
            type="date"
            value={newOffer.validity}
            onChange={(e) =>
              setNewOffer({ ...newOffer, validity: e.target.value })
            }
            className="input-style"
          />
        </div>
        <button
          onClick={handleAddOffer}
          className="mt-4 bg-primary text-white px-5 py-2 rounded hover:bg-orange-600 transition"
        >
          ➕ Add Offer
        </button>
      </div>

      {/* Offer List */}
      <div className="bg-white dark:bg-secondary p-5 rounded-xl shadow">
        <h3 className="text-lg font-semibold mb-4">Current & Past Offers</h3>
        {offers.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            No offers added yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm table-auto border-collapse">
              <thead>
                <tr className="text-left border-b dark:border-gray-700">
                  <th className="p-2">Title</th>
                  <th className="p-2">Discount</th>
                  <th className="p-2">Min Order</th>
                  <th className="p-2">Validity</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {offers.map((offer) => (
                  <tr
                    key={offer.id}
                    className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="p-2">{offer.title}</td>
                    <td className="p-2">{offer.discount}</td>
                    <td className="p-2">₹{offer.minOrder}</td>
                    <td className="p-2">
                      {new Date(offer.validity).toLocaleDateString()}
                    </td>
                    <td className="p-2">
                      <button
                        onClick={() => handleToggleStatus(offer.id)}
                        className="text-xl"
                        title="Toggle Status"
                      >
                        {offer.status ? (
                          <FaToggleOn className="text-green-500" />
                        ) : (
                          <FaToggleOff className="text-gray-400" />
                        )}
                      </button>
                    </td>
                    <td className="p-2 flex gap-4 items-center">
                      <button
                        title="Edit"
                        className="text-blue-500 hover:text-blue-600"
                      >
                        <FaEdit />
                      </button>
                      <button
                        title="Delete"
                        onClick={() => handleDelete(offer.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantOffersManager;
