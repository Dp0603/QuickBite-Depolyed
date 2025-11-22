import React, { useState, useEffect, useContext } from "react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import {
  FaGift,
  FaPlus,
  FaEdit,
  FaTrashAlt,
  FaToggleOn,
  FaToggleOff,
  FaPercentage,
  FaRupeeSign,
  FaCalendarAlt,
  FaTag,
  FaUsers,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaTimes,
  FaExclamationTriangle,
  FaTicketAlt,
  FaChartLine,
  FaBolt,
  FaSave,
} from "react-icons/fa";

const RestaurantOffersManager = () => {
  const { user } = useContext(AuthContext);

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const restaurantId = user?.restaurantId || storedUser?.restaurantId;

  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [toasts, setToasts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [submitting, setSubmitting] = useState(false);

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

  /* --------------------- Toast System --------------------- */
  const pushToast = (payload) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, ...payload }]);
    setTimeout(() => removeToast(id), 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  /* --------------------- Fetch Offers --------------------- */
  const fetchOffers = async () => {
    if (!restaurantId) {
      pushToast({
        type: "error",
        title: "Restaurant ID not found",
        icon: <FaExclamationTriangle />,
      });
      return;
    }

    try {
      setLoading(true);
      const res = await API.get(`/offers/offers/restaurant/${restaurantId}`);
      setOffers(res.data.offers || []);
    } catch (err) {
      console.error("Error fetching offers:", err);
      pushToast({
        type: "error",
        title: "Failed to load offers",
        icon: <FaExclamationTriangle />,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, [restaurantId]);

  /* --------------------- Form Handlers --------------------- */
  const handleChange = (e) => {
    let { name, value, type, checked } = e.target;

    if (name === "promoCode") {
      value = value.toUpperCase().trim();
    }

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

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!restaurantId) {
      pushToast({
        type: "error",
        title: "Restaurant ID missing",
        message: "Please log in again",
        icon: <FaExclamationTriangle />,
      });
      return;
    }

    // Validation
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
        newErrors.discountValue = "Percentage must be between 1 and 100";
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
        newErrors.validFrom = "Start date must be before end date";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);

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
        pushToast({
          type: "success",
          title: "Offer updated successfully!",
          icon: <FaCheckCircle />,
        });
      } else {
        await API.post("/offers/offers", payload);
        pushToast({
          type: "success",
          title: "Offer created successfully!",
          icon: <FaCheckCircle />,
        });
      }

      resetForm();
      fetchOffers();
    } catch (err) {
      console.error("Error saving offer:", err.response?.data || err);
      pushToast({
        type: "error",
        title: "Failed to save offer",
        message: err.response?.data?.message,
        icon: <FaExclamationTriangle />,
      });
    } finally {
      setSubmitting(false);
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
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this offer?")) return;
    try {
      await API.delete(`/offers/offers/${id}`);
      pushToast({
        type: "success",
        title: "Offer deleted",
        icon: <FaCheckCircle />,
      });
      fetchOffers();
    } catch (err) {
      console.error("Error deleting offer:", err);
      pushToast({
        type: "error",
        title: "Failed to delete offer",
        icon: <FaExclamationTriangle />,
      });
    }
  };

  const handleToggle = async (id) => {
    try {
      await API.patch(`/offers/offers/toggle/${id}`);
      pushToast({
        type: "success",
        title: "Offer status updated",
        icon: <FaCheckCircle />,
      });
      fetchOffers();
    } catch (err) {
      console.error("Error toggling offer:", err);
      pushToast({
        type: "error",
        title: "Failed to toggle offer",
        icon: <FaExclamationTriangle />,
      });
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
    setShowForm(false);
  };

  const activeOffers = offers.filter((o) => o.isActive).length;
  const inactiveOffers = offers.length - activeOffers;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      {/* Toast Notifications */}
      <Toast toasts={toasts} remove={removeToast} />

      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-8 py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Premium Header */}
        <motion.div
          className="relative overflow-hidden rounded-3xl mb-8 shadow-2xl border border-rose-200"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-rose-600 via-pink-600 to-purple-600"></div>
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          />

          <motion.div
            className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], x: [0, 20, 0] }}
            transition={{ duration: 8, repeat: Infinity }}
          />

          <div className="relative z-10 p-8 md:p-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <motion.div
                    className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-3xl"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    🎁
                  </motion.div>
                  <div>
                    <h1 className="text-4xl font-black text-white drop-shadow-lg">
                      Offers & Promotions
                    </h1>
                    <p className="text-white/90 text-sm font-medium mt-1">
                      Create and manage special offers for your customers
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.button
                onClick={() => setShowForm(true)}
                className="px-8 py-4 rounded-xl bg-white/95 backdrop-blur-xl shadow-2xl font-bold text-rose-600 hover:bg-white transition-all flex items-center gap-2 border border-white/50"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <FaPlus /> Create New Offer
              </motion.button>
            </div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-3 gap-4 mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <StatCard
                icon={<FaGift />}
                value={offers.length}
                label="Total Offers"
                gradient="from-teal-500 to-emerald-600"
              />
              <StatCard
                icon={<FaBolt />}
                value={activeOffers}
                label="Active Offers"
                gradient="from-emerald-500 to-green-600"
              />
              <StatCard
                icon={<FaTimesCircle />}
                value={inactiveOffers}
                label="Inactive"
                gradient="from-amber-500 to-orange-600"
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Offers Grid */}
        {loading ? (
          <LoadingState />
        ) : offers.length === 0 ? (
          <EmptyState onCreateOffer={() => setShowForm(true)} />
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <AnimatePresence mode="popLayout">
              {offers.map((offer, index) => (
                <OfferCard
                  key={offer._id}
                  offer={offer}
                  index={index}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggle={handleToggle}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </motion.div>

      {/* Modal Form */}
      <AnimatePresence>
        {showForm && (
          <OfferFormModal
            editingOffer={editingOffer}
            formData={formData}
            errors={errors}
            submitting={submitting}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onClose={resetForm}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

/* ------------------------------- Components ------------------------------- */

const Toast = ({ toasts, remove }) => (
  <div className="fixed z-[9999] top-6 right-6 flex flex-col gap-3 max-w-md">
    <AnimatePresence>
      {toasts.map((t) => (
        <motion.div
          key={t.id}
          initial={{ opacity: 0, x: 100, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 100, scale: 0.8 }}
          className={`flex items-start gap-3 p-4 rounded-xl shadow-2xl text-white backdrop-blur-md border ${
            t.type === "error"
              ? "bg-red-500/95 border-red-400"
              : "bg-emerald-500/95 border-emerald-400"
          }`}
        >
          <div className="pt-0.5 text-xl">{t.icon}</div>
          <div className="flex-1">
            <div className="font-bold text-sm">{t.title}</div>
            {t.message && (
              <div className="text-xs opacity-90 mt-1">{t.message}</div>
            )}
          </div>
          <motion.button
            onClick={() => remove(t.id)}
            className="opacity-80 hover:opacity-100 font-bold text-lg"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            ✕
          </motion.button>
        </motion.div>
      ))}
    </AnimatePresence>
  </div>
);

const StatCard = ({ icon, value, label, gradient }) => (
  <motion.div
    className="px-5 py-4 rounded-xl bg-white/90 backdrop-blur-md shadow-lg border border-white/50"
    whileHover={{ scale: 1.05, y: -2 }}
  >
    <div className="flex items-center gap-3">
      <div
        className={`w-10 h-10 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-md`}
      >
        {icon}
      </div>
      <div>
        <p className="text-2xl font-black text-gray-800">{value}</p>
        <p className="text-xs text-gray-600 font-semibold">{label}</p>
      </div>
    </div>
  </motion.div>
);

const OfferCard = ({ offer, index, onEdit, onDelete, onToggle }) => {
  const getDiscountDisplay = () => {
    if (offer.discountType === "PERCENT") {
      return (
        <div className="flex items-center gap-2">
          <FaPercentage className="text-rose-500" />
          <span className="text-3xl font-black text-rose-700">
            {offer.discountValue}%
          </span>
          <span className="text-sm text-gray-600">OFF</span>
        </div>
      );
    } else if (offer.discountType === "FLAT") {
      return (
        <div className="flex items-center gap-2">
          <FaRupeeSign className="text-rose-500" />
          <span className="text-3xl font-black text-rose-700">
            {offer.discountValue}
          </span>
          <span className="text-sm text-gray-600">OFF</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">UPTO</span>
          <FaRupeeSign className="text-rose-500" />
          <span className="text-3xl font-black text-rose-700">
            {offer.maxDiscountAmount}
          </span>
          <span className="text-sm text-gray-600">OFF</span>
        </div>
      );
    }
  };

  return (
    <motion.div
      className="group relative bg-white rounded-2xl shadow-lg border-2 border-gray-200 hover:border-rose-300 hover:shadow-2xl overflow-hidden transition-all"
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -20 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -6 }}
      layout
    >
      {/* Status Badge */}
      <motion.div
        className={`absolute top-4 right-4 px-3 py-1.5 rounded-full font-bold text-sm shadow-lg z-10 flex items-center gap-1.5 ${
          offer.isActive ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
        }`}
        whileHover={{ scale: 1.1 }}
      >
        {offer.isActive ? <FaCheckCircle /> : <FaTimesCircle />}
        {offer.isActive ? "Active" : "Inactive"}
      </motion.div>

      {/* Gradient Header */}
      <div className="p-6 bg-gradient-to-r from-rose-50 to-pink-50 border-b-2 border-gray-200">
        <h3 className="font-black text-xl text-gray-900 mb-2 pr-24">
          {offer.title}
        </h3>
        {offer.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {offer.description}
          </p>
        )}
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Discount Display */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-rose-50 to-pink-50 border-2 border-rose-200">
          {getDiscountDisplay()}
        </div>

        {/* Details */}
        <div className="space-y-2 text-sm">
          {offer.minOrderAmount && (
            <div className="flex items-center gap-2 text-gray-700">
              <FaRupeeSign className="text-teal-500" />
              <span className="font-semibold">Min Order:</span>
              <span className="font-bold">₹{offer.minOrderAmount}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-gray-700">
            <FaCalendarAlt className="text-indigo-500" />
            <span className="font-semibold">Valid:</span>
            <span className="font-bold">
              {format(new Date(offer.validFrom), "dd MMM")} -{" "}
              {format(new Date(offer.validTill), "dd MMM")}
            </span>
          </div>

          {offer.promoCode && (
            <div className="flex items-center gap-2 text-gray-700">
              <FaTag className="text-amber-500" />
              <span className="font-semibold">Code:</span>
              <span className="px-2 py-1 rounded-md bg-amber-50 border border-amber-200 font-mono font-bold text-amber-700">
                {offer.promoCode}
              </span>
            </div>
          )}

          {(offer.usageLimit || offer.perUserLimit) && (
            <div className="flex items-center gap-2 text-gray-700">
              <FaUsers className="text-purple-500" />
              <span className="font-semibold">Limits:</span>
              {offer.usageLimit && <span>Total: {offer.usageLimit}</span>}
              {offer.usageLimit && offer.perUserLimit && <span>•</span>}
              {offer.perUserLimit && (
                <span>Per User: {offer.perUserLimit}</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 bg-gray-50 border-t border-gray-200 flex gap-2">
        <motion.button
          onClick={() => onToggle(offer._id)}
          className={`flex-1 px-4 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
            offer.isActive
              ? "bg-amber-500 text-white hover:bg-amber-600"
              : "bg-emerald-500 text-white hover:bg-emerald-600"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {offer.isActive ? <FaToggleOff /> : <FaToggleOn />}
          {offer.isActive ? "Deactivate" : "Activate"}
        </motion.button>

        <motion.button
          onClick={() => onEdit(offer)}
          className="px-4 py-2.5 rounded-xl bg-blue-500 text-white font-bold text-sm shadow-md hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaEdit />
        </motion.button>

        <motion.button
          onClick={() => onDelete(offer._id)}
          className="px-4 py-2.5 rounded-xl bg-red-500 text-white font-bold text-sm shadow-md hover:bg-red-600 transition-all flex items-center justify-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaTrashAlt />
        </motion.button>
      </div>
    </motion.div>
  );
};

const LoadingState = () => (
  <div className="flex items-center justify-center py-20">
    <motion.div
      className="text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="relative w-24 h-24 mx-auto mb-6"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute inset-0 border-4 border-rose-200 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-rose-600 border-t-transparent rounded-full"></div>
      </motion.div>
      <motion.p
        className="text-gray-700 text-lg font-bold"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        Loading offers...
      </motion.p>
    </motion.div>
  </div>
);

const EmptyState = ({ onCreateOffer }) => (
  <motion.div
    className="text-center py-20 bg-white rounded-3xl shadow-xl border border-gray-200"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
  >
    <motion.div
      className="text-9xl mb-6"
      animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      🎁
    </motion.div>
    <h3 className="text-3xl font-black text-gray-800 mb-3">No Offers Yet</h3>
    <p className="text-gray-600 mb-8 text-lg">
      Create your first offer to attract more customers!
    </p>
    <motion.button
      onClick={onCreateOffer}
      className="px-8 py-4 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold shadow-xl hover:shadow-2xl transition-all flex items-center gap-2 mx-auto"
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <FaPlus /> Create Your First Offer
    </motion.button>
  </motion.div>
);

const OfferFormModal = ({
  editingOffer,
  formData,
  errors,
  submitting,
  onChange,
  onSubmit,
  onClose,
}) => (
  <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
    <motion.div
      className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    />

    <motion.div
      className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border-2 border-gray-200"
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
    >
      {/* Header */}
      <div className="sticky top-0 z-10 p-6 bg-gradient-to-r from-rose-500 to-pink-600 text-white border-b-2 border-rose-400">
        <div className="flex items-center justify-between">
          <h3 className="text-3xl font-black flex items-center gap-3">
            <FaGift />
            {editingOffer ? "Edit Offer" : "Create New Offer"}
          </h3>
          <motion.button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center hover:bg-white/30 transition-all"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaTimes />
          </motion.button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} className="p-6 space-y-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <h4 className="font-black text-lg text-gray-800 flex items-center gap-2">
            <FaTicketAlt className="text-rose-500" />
            Basic Information
          </h4>

          <FormField label="Offer Title" error={errors.title} required>
            <input
              type="text"
              name="title"
              placeholder="e.g., Weekend Special Discount"
              value={formData.title}
              onChange={onChange}
              className={`w-full px-4 py-3 rounded-xl border-2 ${
                errors.title
                  ? "border-red-300 focus:border-red-500"
                  : "border-gray-200 focus:border-rose-400"
              } focus:outline-none transition-all font-medium`}
            />
          </FormField>

          <FormField label="Description (Optional)">
            <textarea
              name="description"
              placeholder="Describe your offer..."
              value={formData.description}
              onChange={onChange}
              rows="3"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-rose-400 focus:outline-none transition-all font-medium resize-none"
            />
          </FormField>
        </div>

        {/* Discount Details */}
        <div className="space-y-4">
          <h4 className="font-black text-lg text-gray-800 flex items-center gap-2">
            <FaPercentage className="text-rose-500" />
            Discount Details
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Discount Type" required>
              <select
                name="discountType"
                value={formData.discountType}
                onChange={onChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-rose-400 focus:outline-none transition-all font-medium appearance-none cursor-pointer"
              >
                <option value="PERCENT">Percentage (%)</option>
                <option value="FLAT">Flat Amount (₹)</option>
                <option value="UPTO">Up to Amount (₹)</option>
              </select>
            </FormField>

            <FormField
              label="Discount Value"
              error={errors.discountValue}
              required
            >
              <div className="relative">
                {formData.discountType === "PERCENT" ? (
                  <FaPercentage className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                ) : (
                  <FaRupeeSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                )}
                <input
                  type="number"
                  name="discountValue"
                  placeholder="Enter value"
                  value={formData.discountValue}
                  onChange={onChange}
                  min="1"
                  className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 ${
                    errors.discountValue
                      ? "border-red-300 focus:border-red-500"
                      : "border-gray-200 focus:border-rose-400"
                  } focus:outline-none transition-all font-medium`}
                />
              </div>
            </FormField>
          </div>

          {formData.discountType === "UPTO" && (
            <FormField
              label="Maximum Discount Amount"
              error={errors.maxDiscountAmount}
              required
            >
              <div className="relative">
                <FaRupeeSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  name="maxDiscountAmount"
                  placeholder="Enter max discount cap"
                  value={formData.maxDiscountAmount}
                  onChange={onChange}
                  min="1"
                  className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 ${
                    errors.maxDiscountAmount
                      ? "border-red-300 focus:border-red-500"
                      : "border-gray-200 focus:border-rose-400"
                  } focus:outline-none transition-all font-medium`}
                />
              </div>
            </FormField>
          )}

          <FormField
            label="Minimum Order Amount"
            error={errors.minOrderAmount}
            required
          >
            <div className="relative">
              <FaRupeeSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="number"
                name="minOrderAmount"
                placeholder="Enter minimum order amount"
                value={formData.minOrderAmount}
                onChange={onChange}
                min="1"
                className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 ${
                  errors.minOrderAmount
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-200 focus:border-rose-400"
                } focus:outline-none transition-all font-medium`}
              />
            </div>
          </FormField>
        </div>

        {/* Validity Period */}
        <div className="space-y-4">
          <h4 className="font-black text-lg text-gray-800 flex items-center gap-2">
            <FaCalendarAlt className="text-rose-500" />
            Validity Period
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Valid From" error={errors.validFrom} required>
              <input
                type="date"
                name="validFrom"
                value={formData.validFrom}
                onChange={onChange}
                className={`w-full px-4 py-3 rounded-xl border-2 ${
                  errors.validFrom
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-200 focus:border-rose-400"
                } focus:outline-none transition-all font-medium`}
              />
            </FormField>

            <FormField label="Valid Till" error={errors.validTill} required>
              <input
                type="date"
                name="validTill"
                value={formData.validTill}
                onChange={onChange}
                className={`w-full px-4 py-3 rounded-xl border-2 ${
                  errors.validTill
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-200 focus:border-rose-400"
                } focus:outline-none transition-all font-medium`}
              />
            </FormField>
          </div>
        </div>

        {/* Additional Settings */}
        <div className="space-y-4">
          <h4 className="font-black text-lg text-gray-800 flex items-center gap-2">
            <FaUsers className="text-rose-500" />
            Additional Settings
          </h4>

          <FormField label="Promo Code (Optional)">
            <div className="relative">
              <FaTag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="promoCode"
                placeholder="e.g., WEEKEND50"
                value={formData.promoCode}
                onChange={onChange}
                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-rose-400 focus:outline-none transition-all font-medium uppercase"
              />
            </div>
          </FormField>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Usage Limit (Optional)">
              <input
                type="number"
                name="usageLimit"
                placeholder="Total uses allowed"
                value={formData.usageLimit}
                onChange={onChange}
                min="1"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-rose-400 focus:outline-none transition-all font-medium"
              />
            </FormField>

            <FormField label="Per User Limit (Optional)">
              <input
                type="number"
                name="perUserLimit"
                placeholder="Uses per customer"
                value={formData.perUserLimit}
                onChange={onChange}
                min="1"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-rose-400 focus:outline-none transition-all font-medium"
              />
            </FormField>
          </div>

          <motion.div
            className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 cursor-pointer"
            onClick={() =>
              onChange({
                target: {
                  name: "isAutoApply",
                  type: "checkbox",
                  checked: !formData.isAutoApply,
                },
              })
            }
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <motion.div
              className={`w-12 h-6 rounded-full transition-all ${
                formData.isAutoApply ? "bg-emerald-500" : "bg-gray-300"
              }`}
            >
              <motion.div
                className="w-5 h-5 bg-white rounded-full shadow-md m-0.5"
                animate={{ x: formData.isAutoApply ? 24 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </motion.div>
            <span className="font-bold text-gray-800">
              Auto-apply this offer (no code needed)
            </span>
          </motion.div>
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={submitting}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-black text-lg shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          whileHover={{ scale: submitting ? 1 : 1.02, y: submitting ? 0 : -2 }}
          whileTap={{ scale: submitting ? 1 : 0.98 }}
        >
          {submitting ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <FaSpinner />
              </motion.div>
              {editingOffer ? "Updating Offer..." : "Creating Offer..."}
            </>
          ) : (
            <>
              <FaSave />
              {editingOffer ? "Update Offer" : "Create Offer"}
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  </div>
);

const FormField = ({ label, error, required, children }) => (
  <div>
    <label className="flex items-center gap-2 mb-2 font-bold text-gray-700">
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    <AnimatePresence>
      {error && (
        <motion.p
          className="mt-2 text-sm text-red-600 flex items-center gap-2 font-semibold"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <FaTimesCircle />
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  </div>
);

export default RestaurantOffersManager;


// import React, { useState, useEffect, useContext } from "react";
// import { format } from "date-fns";
// import API from "../../api/axios";
// import { AuthContext } from "../../context/AuthContext";

// const RestaurantOffersManager = () => {
//   const { user } = useContext(AuthContext);

//   // ✅ Fallback to localStorage if context is empty
//   const storedUser = JSON.parse(localStorage.getItem("user"));
//   const restaurantId = user?.restaurantId || storedUser?.restaurantId;

//   const [offers, setOffers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [errors, setErrors] = useState({});
//   const [generalError, setGeneralError] = useState("");
//   const [showForm, setShowForm] = useState(false);
//   const [editingOffer, setEditingOffer] = useState(null);
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     discountType: "PERCENT",
//     discountValue: "",
//     maxDiscountAmount: "",
//     minOrderAmount: "",
//     validFrom: "",
//     validTill: "",
//     promoCode: "",
//     isAutoApply: true,
//     usageLimit: "",
//     perUserLimit: "",
//   });

//   // Fetch offers for this restaurant
//   const fetchOffers = async () => {
//     if (!restaurantId) return setGeneralError("Restaurant ID not found.");
//     try {
//       setLoading(true);
//       setGeneralError("");
//       const res = await API.get(`/offers/offers/restaurant/${restaurantId}`);
//       setOffers(res.data.offers || []);
//     } catch (err) {
//       console.error("Error fetching offers:", err);
//       setGeneralError("Unable to load offers. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOffers();
//   }, [restaurantId]);

//   const handleChange = (e) => {
//     let { name, value, type, checked } = e.target;

//     // Auto-uppercase promo code
//     if (name === "promoCode") {
//       value = value.toUpperCase().trim();
//     }

//     // Clear maxDiscountAmount when switching discountType
//     if (name === "discountType") {
//       setFormData((prev) => ({
//         ...prev,
//         discountType: value,
//         maxDiscountAmount: value === "UPTO" ? prev.maxDiscountAmount : "",
//       }));
//       setErrors({});
//       return;
//     }

//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setErrors({});
//     setGeneralError("");

//     if (!restaurantId) {
//       setGeneralError("Restaurant ID missing. Please log in again.");
//       return;
//     }

//     // 🛡️ Field-level validations
//     const newErrors = {};

//     if (!formData.title.trim()) newErrors.title = "Title is required";

//     if (!formData.discountValue)
//       newErrors.discountValue = "Discount value is required";

//     if (!formData.minOrderAmount)
//       newErrors.minOrderAmount = "Minimum order amount is required";

//     const discountValueNum = Number(formData.discountValue);
//     const minOrderAmountNum = Number(formData.minOrderAmount);
//     const maxDiscountAmountNum = Number(formData.maxDiscountAmount);

//     if (formData.discountType === "PERCENT") {
//       if (discountValueNum < 1 || discountValueNum > 100) {
//         newErrors.discountValue =
//           "Percentage discount must be between 1 and 100";
//       }
//     }

//     if (formData.discountType === "FLAT") {
//       if (discountValueNum < 1) {
//         newErrors.discountValue = "Flat discount must be at least ₹1";
//       }
//     }

//     if (formData.discountType === "UPTO") {
//       if (!formData.maxDiscountAmount) {
//         newErrors.maxDiscountAmount =
//           "Max discount amount is required for UPTO offers";
//       } else if (maxDiscountAmountNum < 1) {
//         newErrors.maxDiscountAmount = "Max discount amount must be at least ₹1";
//       }
//       if (discountValueNum < 1) {
//         newErrors.discountValue = "Discount value must be at least ₹1";
//       }
//     }

//     if (!formData.validFrom) newErrors.validFrom = "Start date is required";
//     if (!formData.validTill) newErrors.validTill = "End date is required";

//     if (formData.validFrom && formData.validTill) {
//       if (new Date(formData.validFrom) > new Date(formData.validTill)) {
//         newErrors.validFrom = "validFrom must be before validTill";
//       }
//     }

//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//       return;
//     }

//     try {
//       const payload = {
//         ...formData,
//         restaurantId,
//         discountValue: discountValueNum,
//         minOrderAmount: minOrderAmountNum,
//         maxDiscountAmount:
//           formData.discountType === "UPTO" ? maxDiscountAmountNum : undefined,
//         usageLimit: formData.usageLimit
//           ? Number(formData.usageLimit)
//           : undefined,
//         perUserLimit: formData.perUserLimit
//           ? Number(formData.perUserLimit)
//           : undefined,
//         validFrom: new Date(formData.validFrom),
//         validTill: new Date(formData.validTill),
//       };

//       if (editingOffer) {
//         await API.put(`/offers/offers/${editingOffer._id}`, payload);
//       } else {
//         await API.post("/offers/offers", payload);
//       }

//       resetForm();
//       fetchOffers();
//     } catch (err) {
//       console.error("Error saving offer:", err.response?.data || err);
//       setGeneralError(
//         err.response?.data?.message || "Failed to save offer. Please try again."
//       );
//     }
//   };

//   const handleEdit = (offer) => {
//     setEditingOffer(offer);
//     setFormData({
//       title: offer.title,
//       description: offer.description || "",
//       discountType: offer.discountType,
//       discountValue: offer.discountValue,
//       maxDiscountAmount: offer.maxDiscountAmount || "",
//       minOrderAmount: offer.minOrderAmount || "",
//       validFrom: offer.validFrom.slice(0, 10),
//       validTill: offer.validTill.slice(0, 10),
//       promoCode: offer.promoCode || "",
//       isAutoApply: offer.isAutoApply,
//       usageLimit: offer.usageLimit || "",
//       perUserLimit: offer.perUserLimit || "",
//     });
//     setErrors({});
//     setGeneralError("");
//     setShowForm(true);
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this offer?")) return;
//     try {
//       await API.delete(`/offers/offers/${id}`);
//       fetchOffers();
//     } catch (err) {
//       console.error("Error deleting offer:", err);
//       setGeneralError("Failed to delete offer. Please try again.");
//     }
//   };

//   const handleToggle = async (id) => {
//     try {
//       await API.patch(`/offers/offers/toggle/${id}`);
//       fetchOffers();
//     } catch (err) {
//       console.error("Error toggling offer:", err);
//       setGeneralError("Failed to toggle offer status. Please try again.");
//     }
//   };

//   const resetForm = () => {
//     setEditingOffer(null);
//     setFormData({
//       title: "",
//       description: "",
//       discountType: "PERCENT",
//       discountValue: "",
//       maxDiscountAmount: "",
//       minOrderAmount: "",
//       validFrom: "",
//       validTill: "",
//       promoCode: "",
//       isAutoApply: true,
//       usageLimit: "",
//       perUserLimit: "",
//     });
//     setErrors({});
//     setGeneralError("");
//     setShowForm(false);
//   };

//   return (
//     <div className="p-10 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-800 dark:text-white">
//       {/* Header */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
//         <h2 className="text-4xl font-extrabold mb-4 md:mb-0">
//           🎁 Restaurant Offers
//         </h2>
//         <button
//           onClick={() => setShowForm(true)}
//           className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-2xl shadow-lg hover:from-green-600 hover:to-green-700 transition"
//         >
//           + Create Offer
//         </button>
//       </div>

//       {/* Error / Loading */}
//       {loading ? (
//         <p className="text-lg text-gray-500">Loading offers...</p>
//       ) : generalError ? (
//         <p className="text-red-500 mb-4">{generalError}</p>
//       ) : null}

//       {/* Offers Grid */}
//       {offers.length === 0 && !loading && !generalError ? (
//         <p className="text-gray-500 text-lg">
//           No offers yet. Create your first offer!
//         </p>
//       ) : (
//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {offers.map((offer) => (
//             <div
//               key={offer._id}
//               className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all"
//             >
//               <div className="mb-3">
//                 <h3 className="text-2xl font-semibold">{offer.title}</h3>
//                 <p className="text-gray-600 dark:text-gray-300 mt-1">
//                   {offer.description}
//                 </p>
//               </div>
//               <div className="text-gray-700 dark:text-gray-200 mb-2">
//                 <span className="font-medium">
//                   {offer.discountType === "PERCENT"
//                     ? `${offer.discountValue}% OFF`
//                     : offer.discountType === "FLAT"
//                     ? `₹${offer.discountValue} OFF`
//                     : `UPTO ₹${offer.maxDiscountAmount} OFF`}
//                 </span>
//                 {offer.minOrderAmount &&
//                   ` | Min Order: ₹${offer.minOrderAmount}`}
//               </div>
//               <p className="text-sm text-gray-500 mb-2">
//                 Valid: {format(new Date(offer.validFrom), "dd MMM")} -{" "}
//                 {format(new Date(offer.validTill), "dd MMM")}
//               </p>

//               {/* Status badge */}
//               <span
//                 className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold ${
//                   offer.isActive
//                     ? "bg-green-100 text-green-800"
//                     : "bg-red-100 text-red-800"
//                 } shadow`}
//               >
//                 {offer.isActive ? "Active" : "Inactive"}
//               </span>

//               {/* Action buttons */}
//               <div className="flex justify-end gap-3 mt-4">
//                 <button
//                   onClick={() => handleToggle(offer._id)}
//                   className="px-4 py-2 rounded-lg text-sm font-medium bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition"
//                 >
//                   {offer.isActive ? "Deactivate" : "Activate"}
//                 </button>
//                 <button
//                   onClick={() => handleEdit(offer)}
//                   className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 transition"
//                 >
//                   Edit
//                 </button>
//                 <button
//                   onClick={() => handleDelete(offer._id)}
//                   className="px-4 py-2 rounded-lg text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Modal Form */}
//       {showForm && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
//           <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto transform transition-all scale-95 animate-slide-up">
//             <div className="p-6">
//               <h3 className="text-3xl font-bold mb-6">
//                 {editingOffer ? "Edit Offer" : "Create Offer"}
//               </h3>
//               <form onSubmit={handleSubmit} className="grid gap-5">
//                 {/* Title */}
//                 <div className="flex flex-col gap-2">
//                   <label className="font-medium">Offer Title *</label>
//                   <input
//                     type="text"
//                     name="title"
//                     placeholder="Enter offer title"
//                     value={formData.title}
//                     onChange={handleChange}
//                     className="border p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
//                   />
//                   {errors.title && (
//                     <span className="text-red-500 text-sm">{errors.title}</span>
//                   )}
//                 </div>

//                 {/* Description */}
//                 <div className="flex flex-col gap-2">
//                   <label className="font-medium">Description</label>
//                   <textarea
//                     name="description"
//                     placeholder="Enter offer description"
//                     value={formData.description}
//                     onChange={handleChange}
//                     className="border p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
//                     rows={3}
//                   />
//                 </div>

//                 {/* Discount */}
//                 <div className="flex flex-col md:flex-row gap-3">
//                   <div className="flex-1 flex flex-col gap-2">
//                     <label className="font-medium">Discount Type *</label>
//                     <select
//                       name="discountType"
//                       value={formData.discountType}
//                       onChange={handleChange}
//                       className="border p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
//                     >
//                       <option value="PERCENT">Percentage</option>
//                       <option value="FLAT">Flat Amount</option>
//                       <option value="UPTO">Upto (with max cap)</option>
//                     </select>
//                   </div>
//                   <div className="flex-1 flex flex-col gap-2">
//                     <label className="font-medium">Discount Value *</label>
//                     <input
//                       type="number"
//                       name="discountValue"
//                       placeholder="Enter discount value"
//                       value={formData.discountValue}
//                       onChange={handleChange}
//                       className="border p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
//                     />
//                     {errors.discountValue && (
//                       <span className="text-red-500 text-sm">
//                         {errors.discountValue}
//                       </span>
//                     )}
//                   </div>
//                 </div>

//                 {formData.discountType === "UPTO" && (
//                   <div className="flex flex-col gap-2">
//                     <label className="font-medium">Max Discount Amount *</label>
//                     <input
//                       type="number"
//                       name="maxDiscountAmount"
//                       placeholder="Enter max discount amount"
//                       value={formData.maxDiscountAmount}
//                       onChange={handleChange}
//                       className="border p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
//                     />
//                     {errors.maxDiscountAmount && (
//                       <span className="text-red-500 text-sm">
//                         {errors.maxDiscountAmount}
//                       </span>
//                     )}
//                   </div>
//                 )}

//                 {/* Min Order Amount */}
//                 <div className="flex flex-col gap-2">
//                   <label className="font-medium">Minimum Order Amount *</label>
//                   <input
//                     type="number"
//                     name="minOrderAmount"
//                     placeholder="Enter minimum order amount"
//                     value={formData.minOrderAmount}
//                     onChange={handleChange}
//                     className="border p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
//                   />
//                   {errors.minOrderAmount && (
//                     <span className="text-red-500 text-sm">
//                       {errors.minOrderAmount}
//                     </span>
//                   )}
//                 </div>

//                 {/* Dates */}
//                 <div className="flex gap-3">
//                   <div className="flex-1 flex flex-col gap-2">
//                     <label className="font-medium">Valid From *</label>
//                     <input
//                       type="date"
//                       name="validFrom"
//                       value={formData.validFrom}
//                       onChange={handleChange}
//                       className="border p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
//                     />
//                     {errors.validFrom && (
//                       <span className="text-red-500 text-sm">
//                         {errors.validFrom}
//                       </span>
//                     )}
//                   </div>
//                   <div className="flex-1 flex flex-col gap-2">
//                     <label className="font-medium">Valid Till *</label>
//                     <input
//                       type="date"
//                       name="validTill"
//                       value={formData.validTill}
//                       onChange={handleChange}
//                       className="border p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
//                     />
//                     {errors.validTill && (
//                       <span className="text-red-500 text-sm">
//                         {errors.validTill}
//                       </span>
//                     )}
//                   </div>
//                 </div>

//                 {/* Promo Code */}
//                 <div className="flex flex-col gap-2">
//                   <label className="font-medium">Promo Code</label>
//                   <input
//                     type="text"
//                     name="promoCode"
//                     placeholder="Optional promo code"
//                     value={formData.promoCode}
//                     onChange={handleChange}
//                     className="border p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
//                   />
//                 </div>

//                 {/* Auto Apply */}
//                 <div className="flex items-center gap-3">
//                   <input
//                     type="checkbox"
//                     name="isAutoApply"
//                     checked={formData.isAutoApply}
//                     onChange={handleChange}
//                     className="h-5 w-5 rounded border-gray-300 text-green-500 focus:ring-green-400"
//                   />
//                   <span className="text-gray-700 dark:text-gray-300 font-medium">
//                     Auto Apply Offer
//                   </span>
//                 </div>

//                 {/* Limits */}
//                 <div className="flex flex-col md:flex-row gap-3">
//                   <div className="flex-1 flex flex-col gap-2">
//                     <label className="font-medium">Usage Limit</label>
//                     <input
//                       type="number"
//                       name="usageLimit"
//                       placeholder="Optional"
//                       value={formData.usageLimit}
//                       onChange={handleChange}
//                       className="border p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
//                     />
//                   </div>
//                   <div className="flex-1 flex flex-col gap-2">
//                     <label className="font-medium">Per User Limit</label>
//                     <input
//                       type="number"
//                       name="perUserLimit"
//                       placeholder="Optional"
//                       value={formData.perUserLimit}
//                       onChange={handleChange}
//                       className="border p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
//                     />
//                   </div>
//                 </div>

//                 {/* Actions */}
//                 <div className="flex justify-end gap-4 mt-6">
//                   <button
//                     type="button"
//                     onClick={resetForm}
//                     className="px-6 py-2 rounded-2xl border border-gray-300 hover:bg-gray-100 transition"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="px-6 py-2 rounded-2xl bg-green-600 text-white hover:bg-green-700 transition"
//                   >
//                     Save
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default RestaurantOffersManager;
