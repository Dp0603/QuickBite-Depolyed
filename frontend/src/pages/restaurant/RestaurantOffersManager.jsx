import React, { useEffect, useState, useContext } from "react";
import { FaEdit, FaTrash, FaToggleOn, FaToggleOff } from "react-icons/fa";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";

const OFFERS_PER_PAGE = 5;

const getOfferStatusTag = (offer) => {
  const today = new Date();
  const validityDate = new Date(offer.validity);
  if (validityDate < today) return { label: "Expired", color: "text-red-500" };
  if (!offer.status) return { label: "Inactive", color: "text-gray-400" };
  if (validityDate.toDateString() === today.toDateString())
    return { label: "Today Only", color: "text-yellow-500" };
  return { label: "Active", color: "text-green-500" };
};

const RestaurantOffersManager = () => {
  const { user } = useContext(AuthContext);
  const [offers, setOffers] = useState([]);
  const [newOffer, setNewOffer] = useState({
    title: "",
    discount: "",
    minOrder: "",
    validity: "",
  });
  const [editingOffer, setEditingOffer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchOffers = async () => {
    try {
      const res = await API.get("/offers");
      setOffers(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch offers:", err);
    }
  };

  const handleAddOffer = async () => {
    const { title, discount, minOrder, validity } = newOffer;
    if (!title || !discount || !minOrder || !validity) {
      alert("Please fill all fields.");
      return;
    }

    try {
      await API.post("/offers", {
        ...newOffer,
        restaurantId: user._id,
      });
      setNewOffer({ title: "", discount: "", minOrder: "", validity: "" });
      fetchOffers();
    } catch (err) {
      console.error("Failed to add offer:", err);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await API.put(`/offers/${id}`, { status: !currentStatus });
      fetchOffers();
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this offer?")) return;
    try {
      await API.delete(`/offers/${id}`);
      fetchOffers();
    } catch (err) {
      console.error("Failed to delete offer:", err);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  return (
    <div className="p-6 text-gray-800 dark:text-white">
      <h2 className="text-2xl font-bold mb-6">🎉 Manage Offers</h2>

      {/* Add Offer */}
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

      {/* Edit Modal */}
      {showModal && editingOffer && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
          <div className="bg-white dark:bg-secondary rounded-lg shadow-xl p-6 w-full max-w-md relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-3 text-gray-400 hover:text-gray-600 text-lg"
            >
              ×
            </button>
            <h3 className="text-lg font-bold mb-4">✏️ Edit Offer</h3>
            <input
              type="text"
              placeholder="Offer Title"
              value={editingOffer.title}
              onChange={(e) =>
                setEditingOffer({ ...editingOffer, title: e.target.value })
              }
              className="input-style mb-3"
            />
            <input
              type="text"
              placeholder="Discount"
              value={editingOffer.discount}
              onChange={(e) =>
                setEditingOffer({ ...editingOffer, discount: e.target.value })
              }
              className="input-style mb-3"
            />
            <input
              type="number"
              placeholder="Minimum Order"
              value={editingOffer.minOrder}
              onChange={(e) =>
                setEditingOffer({
                  ...editingOffer,
                  minOrder: e.target.value,
                })
              }
              className="input-style mb-3"
            />
            <input
              type="date"
              value={editingOffer.validity?.slice(0, 10)}
              onChange={(e) =>
                setEditingOffer({
                  ...editingOffer,
                  validity: e.target.value,
                })
              }
              className="input-style mb-4"
            />
            <button
              onClick={async () => {
                try {
                  await API.put(`/offers/${editingOffer._id}`, editingOffer);
                  setShowModal(false);
                  fetchOffers();
                } catch (err) {
                  console.error("Failed to update offer", err);
                }
              }}
              className="bg-primary text-white px-4 py-2 rounded hover:bg-orange-600 transition w-full"
            >
              Update Offer
            </button>
          </div>
        </div>
      )}

      {/* Offers Table */}
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
                {offers
                  .slice(
                    (currentPage - 1) * OFFERS_PER_PAGE,
                    currentPage * OFFERS_PER_PAGE
                  )
                  .map((offer) => (
                    <tr
                      key={offer._id}
                      className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td className="p-2">{offer.title}</td>
                      <td className="p-2">{offer.discount}</td>
                      <td className="p-2">₹{offer.minOrder}</td>
                      <td className="p-2">
                        {new Date(offer.validity).toLocaleDateString()}
                      </td>
                      <td className="p-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              handleToggleStatus(offer._id, offer.status)
                            }
                            className="text-xl"
                            title="Toggle Status"
                          >
                            {offer.status ? (
                              <FaToggleOn className="text-green-500" />
                            ) : (
                              <FaToggleOff className="text-gray-400" />
                            )}
                          </button>
                          <span
                            className={`text-xs font-semibold ${
                              getOfferStatusTag(offer).color
                            }`}
                          >
                            {getOfferStatusTag(offer).label}
                          </span>
                        </div>
                      </td>
                      <td className="p-2 flex gap-4 items-center">
                        <button
                          title="Delete"
                          onClick={() => handleDelete(offer._id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <FaTrash />
                        </button>
                        <button
                          title="Edit"
                          onClick={() => {
                            setEditingOffer(offer);
                            setShowModal(true);
                          }}
                          className="text-blue-500 hover:text-blue-600"
                        >
                          <FaEdit />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            {/* Pagination */}
            {offers.length > OFFERS_PER_PAGE && (
              <div className="flex justify-center mt-4 gap-2">
                {Array.from({
                  length: Math.ceil(offers.length / OFFERS_PER_PAGE),
                }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 rounded border ${
                      currentPage === i + 1
                        ? "bg-primary text-white"
                        : "bg-white dark:bg-gray-700 dark:text-white"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantOffersManager;
