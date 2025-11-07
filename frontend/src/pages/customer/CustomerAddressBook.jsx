import React, { useEffect, useState, useContext } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { motion, AnimatePresence } from "framer-motion";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  FaMapMarkerAlt,
  FaEdit,
  FaTrash,
  FaPlus,
  FaHome,
  FaBriefcase,
  FaMapPin,
  FaStar,
  FaLocationArrow,
  FaSearch,
  FaTimes,
  FaCheck,
  FaRegStar,
} from "react-icons/fa";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";

const OPEN_CAGE_KEY = "1369baaed11e41118f822cae19b397ce";
const LOCATIONIQ_KEY = "pk.369f48e4fc8b7d556954429059dde3af";

const CustomerAddressBook = () => {
  const { token, user } = useContext(AuthContext);
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState({
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
    type: "home",
  });
  const [editId, setEditId] = useState(null);
  const [marker, setMarker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (user?._id) fetchAddresses();
  }, [user]);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/addresses/entity/User/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAddresses(res.data.addresses);
    } catch {
      alert("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const { addressLine, city, state, pincode } = form;
    if (!addressLine || !city || !state || !pincode) {
      return alert("Please fill all required fields.");
    }
    try {
      setSaving(true);
      const res = editId
        ? await API.put(`/addresses/${editId}`, form, {
            headers: { Authorization: `Bearer ${token}` },
          })
        : await API.post(
            "/addresses",
            { ...form, entityId: user._id, entityType: "User" },
            { headers: { Authorization: `Bearer ${token}` } }
          );

      setAddresses((prev) =>
        editId
          ? prev.map((a) => (a._id === editId ? res.data.address : a))
          : [res.data.address, ...prev]
      );
      alert(editId ? "Address updated!" : "Address added!");
      resetForm();
      setShowForm(false);
    } catch {
      alert("Failed to save address");
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setForm({
      addressLine: "",
      city: "",
      state: "",
      pincode: "",
      landmark: "",
      type: "home",
    });
    setMarker(null);
    setEditId(null);
  };

  const handleDelete = async () => {
    try {
      await API.delete(`/addresses/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAddresses((prev) => prev.filter((a) => a._id !== deleteId));
      setShowDeleteModal(false);
      setDeleteId(null);
    } catch {
      alert("Delete failed");
    }
  };

  const handleEdit = (addr) => {
    setForm({ ...addr });
    setEditId(addr._id);
    setMarker(addr.location ? [addr.location.lat, addr.location.lon] : null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const setAsDefault = async (id) => {
    try {
      await API.patch(
        `/addresses/default/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAddresses();
    } catch {
      alert("Failed to set default");
    }
  };

  const lookupPincode = async () => {
    const pin = form.pincode;
    if (!/^\d{6}$/.test(pin)) return alert("Enter valid 6-digit PIN");
    try {
      setLocationLoading(true);
      const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
      const data = await res.json();
      if (data[0]?.Status === "Success") {
        const office = data[0].PostOffice[0];
        setForm((f) => ({ ...f, city: office.District, state: office.State }));
      } else alert("PIN not found");
    } catch {
      alert("Lookup failed");
    } finally {
      setLocationLoading(false);
    }
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const lat = coords.latitude;
        const lon = coords.longitude;
        setMarker([lat, lon]);
        try {
          const oc = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${OPEN_CAGE_KEY}`
          );
          const ocJson = await oc.json();
          const c = ocJson.results[0]?.components;
          if (c) {
            setForm((f) => ({
              ...f,
              addressLine: c.road || c.neighbourhood || c.suburb || "",
              city: c.city || c.town || c.village || "",
              state: c.state || "",
              pincode: c.postcode || "",
              landmark: c.suburb || "",
            }));
          }
        } catch {
          alert("Location fetch failed");
        } finally {
          setLocationLoading(false);
        }
      },
      () => {
        alert("Permission denied or unavailable");
        setLocationLoading(false);
      }
    );
  };

  const reverseGeocode = async (lat, lon) => {
    try {
      const li = await fetch(
        `https://us1.locationiq.com/v1/reverse.php?key=${LOCATIONIQ_KEY}&lat=${lat}&lon=${lon}&format=json`
      );
      const d = await li.json();
      const addr = d.address;
      setForm((f) => ({
        ...f,
        addressLine: addr.road || addr.display_name || "",
        city: addr.city || addr.town || addr.village || "",
        state: addr.state || "",
        pincode: addr.postcode || "",
        landmark: addr.suburb || "",
      }));
    } catch {
      alert("Reverse geocode failed");
    }
  };

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setMarker([lat, lng]);
        reverseGeocode(lat, lng);
      },
    });
    return null;
  };

  const getAddressIcon = (type) => {
    switch (type) {
      case "home":
        return { icon: FaHome, color: "from-blue-500 to-cyan-600" };
      case "work":
        return { icon: FaBriefcase, color: "from-purple-500 to-pink-600" };
      default:
        return { icon: FaMapPin, color: "from-orange-500 to-pink-600" };
    }
  };

  const sortedAddresses = addresses
    .slice()
    .sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0));

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading addresses...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <motion.div
        className="px-4 sm:px-8 md:px-10 lg:px-12 py-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-orange-600 to-pink-600 dark:from-orange-400 dark:to-pink-500 bg-clip-text text-transparent mb-3 flex items-center gap-3">
              <FaMapMarkerAlt className="text-orange-500" />
              Address Book
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Manage your delivery addresses
            </p>
          </div>
          {!showForm && (
            <motion.button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-bold shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaPlus /> Add Address
            </motion.button>
          )}
        </div>

        {/* Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-50"></div>
                <div className="relative p-6 rounded-3xl bg-white dark:bg-slate-900 border border-orange-200 dark:border-white/10 shadow-xl">
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center text-white shadow-md">
                        {editId ? <FaEdit /> : <FaPlus />}
                      </div>
                      {editId ? "Edit Address" : "Add New Address"}
                    </h2>
                    <motion.button
                      onClick={() => {
                        resetForm();
                        setShowForm(false);
                      }}
                      className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FaTimes />
                    </motion.button>
                  </div>

                  {/* Location Button */}
                  <motion.button
                    onClick={useMyLocation}
                    disabled={locationLoading}
                    className="mb-6 flex items-center gap-2 px-4 py-3 rounded-xl bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-300 font-semibold hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all disabled:opacity-50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FaLocationArrow
                      className={locationLoading ? "animate-spin" : ""}
                    />
                    {locationLoading
                      ? "Getting location..."
                      : "Use My Current Location"}
                  </motion.button>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSave();
                    }}
                    className="space-y-5"
                  >
                    {/* Address Type */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                        Address Type
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { value: "home", icon: FaHome, label: "Home" },
                          { value: "work", icon: FaBriefcase, label: "Work" },
                          { value: "other", icon: FaMapPin, label: "Other" },
                        ].map((type) => {
                          const Icon = type.icon;
                          const isSelected = form.type === type.value;
                          return (
                            <motion.button
                              key={type.value}
                              type="button"
                              onClick={() =>
                                setForm({ ...form, type: type.value })
                              }
                              className={`p-4 rounded-xl border-2 font-semibold transition-all flex flex-col items-center gap-2 ${
                                isSelected
                                  ? "bg-gradient-to-r from-orange-500 to-pink-600 text-white border-transparent shadow-lg"
                                  : "bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-orange-500"
                              }`}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Icon className="text-xl" />
                              <span className="text-sm">{type.label}</span>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Pincode with Auto-fill */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                        Pincode
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Enter 6-digit PIN"
                          value={form.pincode}
                          onChange={(e) =>
                            setForm({ ...form, pincode: e.target.value })
                          }
                          className="flex-1 px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all"
                          maxLength={6}
                        />
                        <motion.button
                          type="button"
                          onClick={lookupPincode}
                          disabled={locationLoading}
                          className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FaSearch />
                          {locationLoading ? "..." : "Auto-fill"}
                        </motion.button>
                      </div>
                    </div>

                    {/* Address Line */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                        Address Line *
                      </label>
                      <input
                        type="text"
                        placeholder="House no, Building, Street"
                        value={form.addressLine}
                        onChange={(e) =>
                          setForm({ ...form, addressLine: e.target.value })
                        }
                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all"
                        required
                      />
                    </div>

                    {/* City & State */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          placeholder="City"
                          value={form.city}
                          onChange={(e) =>
                            setForm({ ...form, city: e.target.value })
                          }
                          className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                          State *
                        </label>
                        <input
                          type="text"
                          placeholder="State"
                          value={form.state}
                          onChange={(e) =>
                            setForm({ ...form, state: e.target.value })
                          }
                          className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all"
                          required
                        />
                      </div>
                    </div>

                    {/* Landmark */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                        Landmark (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="Nearby landmark"
                        value={form.landmark}
                        onChange={(e) =>
                          setForm({ ...form, landmark: e.target.value })
                        }
                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all"
                      />
                    </div>

                    {/* Map */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                        Select Location on Map (Optional)
                      </label>
                      <div className="h-72 rounded-2xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 shadow-lg">
                        <MapContainer
                          center={marker || [20.59, 78.96]}
                          zoom={marker ? 15 : 5}
                          className="h-full"
                        >
                          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                          <MapClickHandler />
                          {marker && (
                            <Marker
                              position={marker}
                              icon={L.icon({
                                iconUrl:
                                  "https://cdn-icons-png.flaticon.com/512/684/684908.png",
                                iconSize: [40, 40],
                              })}
                            />
                          )}
                        </MapContainer>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        Click on the map to select your location
                      </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                      <motion.button
                        type="button"
                        onClick={() => {
                          resetForm();
                          setShowForm(false);
                        }}
                        className="flex-1 px-6 py-4 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        type="submit"
                        disabled={saving}
                        className="flex-1 px-6 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        whileHover={{ scale: saving ? 1 : 1.02 }}
                        whileTap={{ scale: saving ? 1 : 0.98 }}
                      >
                        {saving ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <FaCheck />
                            {editId ? "Update Address" : "Save Address"}
                          </>
                        )}
                      </motion.button>
                    </div>
                  </form>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Addresses Grid */}
        {sortedAddresses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="text-8xl mb-6">📍</div>
            <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
              No addresses saved yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Add your first delivery address to get started
            </p>
            <motion.button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-bold shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaPlus /> Add Your First Address
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {sortedAddresses.map((addr, index) => {
                const { icon: Icon, color } = getAddressIcon(addr.type);
                return (
                  <motion.div
                    key={addr._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    className="group relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    <div
                      className={`relative p-6 rounded-3xl bg-white dark:bg-slate-900 border shadow-md hover:shadow-xl transition-all duration-300 ${
                        addr.isDefault
                          ? "border-orange-500 ring-2 ring-orange-500/30"
                          : "border-orange-200 dark:border-white/10"
                      }`}
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-md`}
                          >
                            <Icon className="text-xl" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white capitalize">
                              {addr.type}
                            </h3>
                            {addr.isDefault && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-bold">
                                <FaStar className="text-xs" /> Default
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Address */}
                      <div className="mb-4 text-sm text-gray-600 dark:text-gray-300 space-y-1">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {addr.addressLine}
                        </p>
                        {addr.landmark && (
                          <p className="text-gray-500 dark:text-gray-400">
                            Near {addr.landmark}
                          </p>
                        )}
                        <p>
                          {addr.city}, {addr.state} - {addr.pincode}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <motion.button
                          onClick={() => handleEdit(addr)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 font-semibold hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-all"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FaEdit /> Edit
                        </motion.button>
                        <motion.button
                          onClick={() => {
                            setDeleteId(addr._id);
                            setShowDeleteModal(true);
                          }}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 font-semibold hover:bg-red-200 dark:hover:bg-red-900/50 transition-all"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FaTrash /> Delete
                        </motion.button>
                      </div>

                      {!addr.isDefault && (
                        <motion.button
                          onClick={() => setAsDefault(addr._id)}
                          className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <FaRegStar /> Set as Default
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 max-w-md w-full border border-orange-200 dark:border-white/10"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center mx-auto mb-4">
                  <FaTrash className="text-white text-2xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Delete Address?
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  This action cannot be undone. Are you sure you want to delete
                  this address?
                </p>
              </div>

              <div className="flex gap-3">
                <motion.button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-6 py-3 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={handleDelete}
                  className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold shadow-lg hover:shadow-xl transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Delete
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomerAddressBook;

//old
//  import React, { useEffect, useState, useContext } from "react";
// import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";
// import { FaMapMarkerAlt, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
// import API from "../../api/axios";
// import { AuthContext } from "../../context/AuthContext";

// const OPEN_CAGE_KEY = "1369baaed11e41118f822cae19b397ce";
// const LOCATIONIQ_KEY = "pk.369f48e4fc8b7d556954429059dde3af";

// const CustomerAddressBook = () => {
//   const { token, user } = useContext(AuthContext);
//   const [addresses, setAddresses] = useState([]);
//   const [form, setForm] = useState({
//     addressLine: "",
//     city: "",
//     state: "",
//     pincode: "",
//     landmark: "",
//     type: "home",
//   });
//   const [editId, setEditId] = useState(null);
//   const [marker, setMarker] = useState(null);

//   useEffect(() => {
//     if (user?._id) fetchAddresses();
//   }, [user]);

//   const fetchAddresses = async () => {
//     try {
//       const res = await API.get(`/addresses/entity/User/${user._id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setAddresses(res.data.addresses);
//     } catch {
//       alert("Failed to load addresses");
//     }
//   };

//   const handleSave = async () => {
//     const { addressLine, city, state, pincode } = form;
//     if (!addressLine || !city || !state || !pincode) {
//       return alert("All fields are required except landmark.");
//     }
//     try {
//       const res = editId
//         ? await API.put(`/addresses/${editId}`, form, {
//             headers: { Authorization: `Bearer ${token}` },
//           })
//         : await API.post(
//             "/addresses",
//             { ...form, entityId: user._id, entityType: "User" },
//             { headers: { Authorization: `Bearer ${token}` } }
//           );

//       setAddresses((prev) =>
//         editId
//           ? prev.map((a) => (a._id === editId ? res.data.address : a))
//           : [res.data.address, ...prev]
//       );
//       alert(editId ? "Updated" : "Added");
//       resetForm();
//     } catch {
//       alert("Failed to save");
//     }
//   };

//   const resetForm = () => {
//     setForm({
//       addressLine: "",
//       city: "",
//       state: "",
//       pincode: "",
//       landmark: "",
//       type: "home",
//     });
//     setMarker(null);
//     setEditId(null);
//   };

//   const handleDelete = async (id) => {
//     if (!confirm("Delete this address?")) return;
//     try {
//       await API.delete(`/addresses/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setAddresses((prev) => prev.filter((a) => a._id !== id));
//     } catch {
//       alert("Delete failed");
//     }
//   };

//   const handleEdit = (addr) => {
//     setForm({ ...addr });
//     setEditId(addr._id);
//     setMarker(addr.location ? [addr.location.lat, addr.location.lon] : null);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   const setAsDefault = async (id) => {
//     try {
//       await API.patch(
//         `/addresses/default/${id}`,
//         {},
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       fetchAddresses();
//     } catch {
//       alert("Failed to set default");
//     }
//   };

//   const lookupPincode = async () => {
//     const pin = form.pincode;
//     if (!/^\d{6}$/.test(pin)) return alert("Enter valid 6-digit PIN");
//     try {
//       const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
//       const data = await res.json();
//       if (data[0]?.Status === "Success") {
//         const office = data[0].PostOffice[0];
//         setForm((f) => ({ ...f, city: office.District, state: office.State }));
//       } else alert("PIN not found");
//     } catch {
//       alert("Lookup failed");
//     }
//   };

//   const useMyLocation = () => {
//     if (!navigator.geolocation) return alert("Geolocation not supported");
//     navigator.geolocation.getCurrentPosition(
//       async ({ coords }) => {
//         const lat = coords.latitude;
//         const lon = coords.longitude;
//         setMarker([lat, lon]);
//         try {
//           const oc = await fetch(
//             `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${OPEN_CAGE_KEY}`
//           );
//           const ocJson = await oc.json();
//           const c = ocJson.results[0]?.components;
//           if (c) {
//             setForm((f) => ({
//               ...f,
//               addressLine: c.road || c.neighbourhood || c.suburb || "",
//               city: c.city || c.town || c.village || "",
//               state: c.state || "",
//               pincode: c.postcode || "",
//               landmark: c.suburb || "",
//             }));
//           }
//         } catch {
//           alert("Location fetch failed");
//         }
//       },
//       () => alert("Permission denied or unavailable")
//     );
//   };

//   const reverseGeocode = async (lat, lon) => {
//     try {
//       const li = await fetch(
//         `https://us1.locationiq.com/v1/reverse.php?key=${LOCATIONIQ_KEY}&lat=${lat}&lon=${lon}&format=json`
//       );
//       const d = await li.json();
//       const addr = d.address;
//       setForm((f) => ({
//         ...f,
//         addressLine: addr.road || addr.display_name || "",
//         city: addr.city || addr.town || addr.village || "",
//         state: addr.state || "",
//         pincode: addr.postcode || "",
//         landmark: addr.suburb || "",
//       }));
//     } catch {
//       alert("Reverse geocode failed");
//     }
//   };

//   const MapClickHandler = () => {
//     useMapEvents({
//       click(e) {
//         const { lat, lng } = e.latlng;
//         setMarker([lat, lng]);
//         reverseGeocode(lat, lng);
//       },
//     });
//     return null;
//   };

//   return (
//     <div className="p-6 max-w-4xl mx-auto">
//       <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
//         <FaMapMarkerAlt className="text-primary" /> Address Book
//       </h1>

//       {/* Addresses */}
//       <div className="grid md:grid-cols-2 gap-6 mb-10">
//         {addresses.length === 0 ? (
//           <p className="col-span-2 italic text-gray-500">
//             No addresses saved yet. Add one!
//           </p>
//         ) : (
//           addresses
//             .slice()
//             .sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0))
//             .map((a) => (
//               <div
//                 key={a._id}
//                 className={`bg-white dark:bg-secondary border rounded-lg p-5 shadow hover:shadow-md transition ${
//                   a.isDefault ? "ring-2 ring-primary" : ""
//                 }`}
//               >
//                 <h3 className="font-semibold capitalize mb-1 flex items-center gap-2">
//                   {a.type === "home"
//                     ? "🏠 Home"
//                     : a.type === "work"
//                     ? "🏢 Work"
//                     : "📍 Other"}
//                   {a.isDefault && (
//                     <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
//                       Default
//                     </span>
//                   )}
//                 </h3>
//                 <p className="text-sm text-gray-700 dark:text-gray-300">
//                   {a.addressLine}
//                   {a.landmark && `, ${a.landmark}`}
//                   <br />
//                   {a.city}, {a.state} - {a.pincode}
//                 </p>
//                 <div className="flex gap-4 mt-3 text-sm">
//                   <button
//                     onClick={() => handleEdit(a)}
//                     className="text-yellow-600 flex items-center gap-1"
//                   >
//                     <FaEdit /> Edit
//                   </button>
//                   <button
//                     onClick={() => handleDelete(a._id)}
//                     className="text-red-600 flex items-center gap-1"
//                   >
//                     <FaTrash /> Delete
//                   </button>
//                   {!a.isDefault && (
//                     <button
//                       onClick={() => setAsDefault(a._id)}
//                       className="text-blue-600"
//                     >
//                       ⭐ Set Default
//                     </button>
//                   )}
//                 </div>
//               </div>
//             ))
//         )}
//       </div>

//       {/* Form */}
//       <div className="bg-white dark:bg-secondary border rounded-lg p-6 shadow">
//         <h2 className="text-xl font-semibold mb-4">
//           {editId ? "Edit Address" : "Add New Address"}
//         </h2>

//         <button
//           onClick={useMyLocation}
//           className="text-sm text-blue-600 mb-3 hover:underline"
//         >
//           📍 Use My Current Location
//         </button>

//         <form
//           onSubmit={(e) => {
//             e.preventDefault();
//             handleSave();
//           }}
//           className="space-y-3"
//         >
//           <select
//             value={form.type}
//             onChange={(e) => setForm({ ...form, type: e.target.value })}
//             className="w-full border px-3 py-2 rounded-md"
//           >
//             <option value="home">Home</option>
//             <option value="work">Work</option>
//             <option value="other">Other</option>
//           </select>

//           <div className="flex gap-2">
//             <input
//               type="text"
//               placeholder="Pincode"
//               value={form.pincode}
//               onChange={(e) => setForm({ ...form, pincode: e.target.value })}
//               className="flex-1 border px-3 py-2 rounded-md"
//             />
//             <button
//               type="button"
//               onClick={lookupPincode}
//               className="bg-gray-100 px-3 rounded-md text-sm"
//             >
//               Auto-fill
//             </button>
//           </div>

//           <input
//             type="text"
//             placeholder="Address Line"
//             value={form.addressLine}
//             onChange={(e) => setForm({ ...form, addressLine: e.target.value })}
//             className="w-full border px-3 py-2 rounded-md"
//           />
//           <input
//             type="text"
//             placeholder="City"
//             value={form.city}
//             onChange={(e) => setForm({ ...form, city: e.target.value })}
//             className="w-full border px-3 py-2 rounded-md"
//           />
//           <input
//             type="text"
//             placeholder="State"
//             value={form.state}
//             onChange={(e) => setForm({ ...form, state: e.target.value })}
//             className="w-full border px-3 py-2 rounded-md"
//           />
//           <input
//             type="text"
//             placeholder="Landmark (optional)"
//             value={form.landmark}
//             onChange={(e) => setForm({ ...form, landmark: e.target.value })}
//             className="w-full border px-3 py-2 rounded-md"
//           />

//           {/* Map */}
//           <div className="h-64">
//             <MapContainer center={[20.59, 78.96]} zoom={5} className="h-full">
//               <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//               <MapClickHandler />
//               {marker && (
//                 <Marker
//                   position={marker}
//                   icon={L.icon({
//                     iconUrl:
//                       "https://cdn-icons-png.flaticon.com/512/684/684908.png",
//                     iconSize: [32, 32],
//                   })}
//                 />
//               )}
//             </MapContainer>
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-primary text-white py-2 rounded-md hover:bg-orange-600"
//           >
//             {editId ? "Update Address" : "Save Address"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CustomerAddressBook;
