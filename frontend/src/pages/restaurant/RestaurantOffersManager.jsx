import React, { useState, useEffect, useContext } from "react";
import { format } from "date-fns";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";

const RestaurantOffersManager = () => {
  const { user } = useContext(AuthContext);

  // ✅ Fallback to localStorage if context is empty
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const restaurantId = user?.restaurantId || storedUser?.restaurantId;

  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    discountType: "PERCENT",
    discountValue: "",
    maxDiscountAmount: "",
    minOrderAmount: "",
    validFrom: "",
    validTill: "",
    promoCode: "",
    isAutoApply: true,
    usageLimit: "",
    perUserLimit: "",
  });

  // Fetch offers for this restaurant
  const fetchOffers = async () => {
    if (!restaurantId) return setGeneralError("Restaurant ID not found.");
    try {
      setLoading(true);
      setGeneralError("");
      const res = await API.get(`/offers/offers/restaurant/${restaurantId}`);
      setOffers(res.data.offers || []);
    } catch (err) {
      console.error("Error fetching offers:", err);
      setGeneralError("Unable to load offers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, [restaurantId]);

  const handleChange = (e) => {
    let { name, value, type, checked } = e.target;

    // Auto-uppercase promo code
    if (name === "promoCode") {
      value = value.toUpperCase().trim();
    }

    // Clear maxDiscountAmount when switching discountType
    if (name === "discountType") {
      setFormData((prev) => ({
        ...prev,
        discountType: value,
        maxDiscountAmount: value === "UPTO" ? prev.maxDiscountAmount : "",
      }));
      setErrors({});
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setGeneralError("");

    if (!restaurantId) {
      setGeneralError("Restaurant ID missing. Please log in again.");
      return;
    }

    // 🛡️ Field-level validations
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";

    if (!formData.discountValue)
      newErrors.discountValue = "Discount value is required";

    if (!formData.minOrderAmount)
      newErrors.minOrderAmount = "Minimum order amount is required";

    const discountValueNum = Number(formData.discountValue);
    const minOrderAmountNum = Number(formData.minOrderAmount);
    const maxDiscountAmountNum = Number(formData.maxDiscountAmount);

    if (formData.discountType === "PERCENT") {
      if (discountValueNum < 1 || discountValueNum > 100) {
        newErrors.discountValue =
          "Percentage discount must be between 1 and 100";
      }
    }

    if (formData.discountType === "FLAT") {
      if (discountValueNum < 1) {
        newErrors.discountValue = "Flat discount must be at least ₹1";
      }
    }

    if (formData.discountType === "UPTO") {
      if (!formData.maxDiscountAmount) {
        newErrors.maxDiscountAmount =
          "Max discount amount is required for UPTO offers";
      } else if (maxDiscountAmountNum < 1) {
        newErrors.maxDiscountAmount = "Max discount amount must be at least ₹1";
      }
      if (discountValueNum < 1) {
        newErrors.discountValue = "Discount value must be at least ₹1";
      }
    }

    if (!formData.validFrom) newErrors.validFrom = "Start date is required";
    if (!formData.validTill) newErrors.validTill = "End date is required";

    if (formData.validFrom && formData.validTill) {
      if (new Date(formData.validFrom) > new Date(formData.validTill)) {
        newErrors.validFrom = "validFrom must be before validTill";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const payload = {
        ...formData,
        restaurantId,
        discountValue: discountValueNum,
        minOrderAmount: minOrderAmountNum,
        maxDiscountAmount:
          formData.discountType === "UPTO" ? maxDiscountAmountNum : undefined,
        usageLimit: formData.usageLimit
          ? Number(formData.usageLimit)
          : undefined,
        perUserLimit: formData.perUserLimit
          ? Number(formData.perUserLimit)
          : undefined,
        validFrom: new Date(formData.validFrom),
        validTill: new Date(formData.validTill),
      };

      if (editingOffer) {
        await API.put(`/offers/offers/${editingOffer._id}`, payload);
      } else {
        await API.post("/offers/offers", payload);
      }

      resetForm();
      fetchOffers();
    } catch (err) {
      console.error("Error saving offer:", err.response?.data || err);
      setGeneralError(
        err.response?.data?.message || "Failed to save offer. Please try again."
      );
    }
  };

  const handleEdit = (offer) => {
    setEditingOffer(offer);
    setFormData({
      title: offer.title,
      description: offer.description || "",
      discountType: offer.discountType,
      discountValue: offer.discountValue,
      maxDiscountAmount: offer.maxDiscountAmount || "",
      minOrderAmount: offer.minOrderAmount || "",
      validFrom: offer.validFrom.slice(0, 10),
      validTill: offer.validTill.slice(0, 10),
      promoCode: offer.promoCode || "",
      isAutoApply: offer.isAutoApply,
      usageLimit: offer.usageLimit || "",
      perUserLimit: offer.perUserLimit || "",
    });
    setErrors({});
    setGeneralError("");
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this offer?")) return;
    try {
      await API.delete(`/offers/offers/${id}`);
      fetchOffers();
    } catch (err) {
      console.error("Error deleting offer:", err);
      setGeneralError("Failed to delete offer. Please try again.");
    }
  };

  const handleToggle = async (id) => {
    try {
      await API.patch(`/offers/offers/toggle/${id}`);
      fetchOffers();
    } catch (err) {
      console.error("Error toggling offer:", err);
      setGeneralError("Failed to toggle offer status. Please try again.");
    }
  };

  const resetForm = () => {
    setEditingOffer(null);
    setFormData({
      title: "",
      description: "",
      discountType: "PERCENT",
      discountValue: "",
      maxDiscountAmount: "",
      minOrderAmount: "",
      validFrom: "",
      validTill: "",
      promoCode: "",
      isAutoApply: true,
      usageLimit: "",
      perUserLimit: "",
    });
    setErrors({});
    setGeneralError("");
    setShowForm(false);
  };

  return (
    <div className="p-10 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-800 dark:text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
        <h2 className="text-4xl font-extrabold mb-4 md:mb-0">
          🎁 Restaurant Offers
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-2xl shadow-lg hover:from-green-600 hover:to-green-700 transition"
        >
          + Create Offer
        </button>
      </div>

      {/* Error / Loading */}
      {loading ? (
        <p className="text-lg text-gray-500">Loading offers...</p>
      ) : generalError ? (
        <p className="text-red-500 mb-4">{generalError}</p>
      ) : null}

      {/* Offers Grid */}
      {offers.length === 0 && !loading && !generalError ? (
        <p className="text-gray-500 text-lg">
          No offers yet. Create your first offer!
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {offers.map((offer) => (
            <div
              key={offer._id}
              className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all"
            >
              <div className="mb-3">
                <h3 className="text-2xl font-semibold">{offer.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  {offer.description}
                </p>
              </div>
              <div className="text-gray-700 dark:text-gray-200 mb-2">
                <span className="font-medium">
                  {offer.discountType === "PERCENT"
                    ? `${offer.discountValue}% OFF`
                    : offer.discountType === "FLAT"
                    ? `₹${offer.discountValue} OFF`
                    : `UPTO ₹${offer.maxDiscountAmount} OFF`}
                </span>
                {offer.minOrderAmount &&
                  ` | Min Order: ₹${offer.minOrderAmount}`}
              </div>
              <p className="text-sm text-gray-500 mb-2">
                Valid: {format(new Date(offer.validFrom), "dd MMM")} -{" "}
                {format(new Date(offer.validTill), "dd MMM")}
              </p>

              {/* Status badge */}
              <span
                className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold ${
                  offer.isActive
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                } shadow`}
              >
                {offer.isActive ? "Active" : "Inactive"}
              </span>

              {/* Action buttons */}
              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => handleToggle(offer._id)}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition"
                >
                  {offer.isActive ? "Deactivate" : "Activate"}
                </button>
                <button
                  onClick={() => handleEdit(offer)}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(offer._id)}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto transform transition-all scale-95 animate-slide-up">
            <div className="p-6">
              <h3 className="text-3xl font-bold mb-6">
                {editingOffer ? "Edit Offer" : "Create Offer"}
              </h3>
              <form onSubmit={handleSubmit} className="grid gap-5">
                {/* Title */}
                <div className="flex flex-col gap-2">
                  <label className="font-medium">Offer Title *</label>
                  <input
                    type="text"
                    name="title"
                    placeholder="Enter offer title"
                    value={formData.title}
                    onChange={handleChange}
                    className="border p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                  {errors.title && (
                    <span className="text-red-500 text-sm">{errors.title}</span>
                  )}
                </div>

                {/* Description */}
                <div className="flex flex-col gap-2">
                  <label className="font-medium">Description</label>
                  <textarea
                    name="description"
                    placeholder="Enter offer description"
                    value={formData.description}
                    onChange={handleChange}
                    className="border p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                    rows={3}
                  />
                </div>

                {/* Discount */}
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="flex-1 flex flex-col gap-2">
                    <label className="font-medium">Discount Type *</label>
                    <select
                      name="discountType"
                      value={formData.discountType}
                      onChange={handleChange}
                      className="border p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                    >
                      <option value="PERCENT">Percentage</option>
                      <option value="FLAT">Flat Amount</option>
                      <option value="UPTO">Upto (with max cap)</option>
                    </select>
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                    <label className="font-medium">Discount Value *</label>
                    <input
                      type="number"
                      name="discountValue"
                      placeholder="Enter discount value"
                      value={formData.discountValue}
                      onChange={handleChange}
                      className="border p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                    />
                    {errors.discountValue && (
                      <span className="text-red-500 text-sm">
                        {errors.discountValue}
                      </span>
                    )}
                  </div>
                </div>

                {formData.discountType === "UPTO" && (
                  <div className="flex flex-col gap-2">
                    <label className="font-medium">Max Discount Amount *</label>
                    <input
                      type="number"
                      name="maxDiscountAmount"
                      placeholder="Enter max discount amount"
                      value={formData.maxDiscountAmount}
                      onChange={handleChange}
                      className="border p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                    />
                    {errors.maxDiscountAmount && (
                      <span className="text-red-500 text-sm">
                        {errors.maxDiscountAmount}
                      </span>
                    )}
                  </div>
                )}

                {/* Min Order Amount */}
                <div className="flex flex-col gap-2">
                  <label className="font-medium">Minimum Order Amount *</label>
                  <input
                    type="number"
                    name="minOrderAmount"
                    placeholder="Enter minimum order amount"
                    value={formData.minOrderAmount}
                    onChange={handleChange}
                    className="border p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                  {errors.minOrderAmount && (
                    <span className="text-red-500 text-sm">
                      {errors.minOrderAmount}
                    </span>
                  )}
                </div>

                {/* Dates */}
                <div className="flex gap-3">
                  <div className="flex-1 flex flex-col gap-2">
                    <label className="font-medium">Valid From *</label>
                    <input
                      type="date"
                      name="validFrom"
                      value={formData.validFrom}
                      onChange={handleChange}
                      className="border p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                    />
                    {errors.validFrom && (
                      <span className="text-red-500 text-sm">
                        {errors.validFrom}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                    <label className="font-medium">Valid Till *</label>
                    <input
                      type="date"
                      name="validTill"
                      value={formData.validTill}
                      onChange={handleChange}
                      className="border p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                    />
                    {errors.validTill && (
                      <span className="text-red-500 text-sm">
                        {errors.validTill}
                      </span>
                    )}
                  </div>
                </div>

                {/* Promo Code */}
                <div className="flex flex-col gap-2">
                  <label className="font-medium">Promo Code</label>
                  <input
                    type="text"
                    name="promoCode"
                    placeholder="Optional promo code"
                    value={formData.promoCode}
                    onChange={handleChange}
                    className="border p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                </div>

                {/* Auto Apply */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="isAutoApply"
                    checked={formData.isAutoApply}
                    onChange={handleChange}
                    className="h-5 w-5 rounded border-gray-300 text-green-500 focus:ring-green-400"
                  />
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    Auto Apply Offer
                  </span>
                </div>

                {/* Limits */}
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="flex-1 flex flex-col gap-2">
                    <label className="font-medium">Usage Limit</label>
                    <input
                      type="number"
                      name="usageLimit"
                      placeholder="Optional"
                      value={formData.usageLimit}
                      onChange={handleChange}
                      className="border p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                    />
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                    <label className="font-medium">Per User Limit</label>
                    <input
                      type="number"
                      name="perUserLimit"
                      placeholder="Optional"
                      value={formData.perUserLimit}
                      onChange={handleChange}
                      className="border p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-2 rounded-2xl border border-gray-300 hover:bg-gray-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-2xl bg-green-600 text-white hover:bg-green-700 transition"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantOffersManager;
