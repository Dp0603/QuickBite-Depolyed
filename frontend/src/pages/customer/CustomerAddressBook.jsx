import React, { useEffect, useState, useContext } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { FaMapMarkerAlt, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
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

  useEffect(() => {
    if (user?._id) fetchAddresses();
  }, [user]);

  const fetchAddresses = async () => {
    try {
      const res = await API.get(`/addresses/entity/User/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAddresses(res.data.addresses);
    } catch {
      alert("Failed to load addresses");
    }
  };

  const handleSave = async () => {
    const { addressLine, city, state, pincode } = form;
    if (!addressLine || !city || !state || !pincode) {
      return alert("All fields are required except landmark.");
    }
    try {
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
      alert(editId ? "Updated" : "Added");
      resetForm();
    } catch {
      alert("Failed to save");
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

  const handleDelete = async (id) => {
    if (!confirm("Delete this address?")) return;
    try {
      await API.delete(`/addresses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAddresses((prev) => prev.filter((a) => a._id !== id));
    } catch {
      alert("Delete failed");
    }
  };

  const handleEdit = (addr) => {
    setForm({ ...addr });
    setEditId(addr._id);
    setMarker(addr.location ? [addr.location.lat, addr.location.lon] : null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const setAsDefault = async (id) => {
    try {
      await API.patch(
        `/addresses/default/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
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
      const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
      const data = await res.json();
      if (data[0]?.Status === "Success") {
        const office = data[0].PostOffice[0];
        setForm((f) => ({ ...f, city: office.District, state: office.State }));
      } else alert("PIN not found");
    } catch {
      alert("Lookup failed");
    }
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");
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
        }
      },
      () => alert("Permission denied or unavailable")
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

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <FaMapMarkerAlt className="text-primary" /> Address Book
      </h1>

      {/* Addresses */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        {addresses.length === 0 ? (
          <p className="col-span-2 italic text-gray-500">
            No addresses saved yet. Add one!
          </p>
        ) : (
          addresses
            .slice()
            .sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0))
            .map((a) => (
              <div
                key={a._id}
                className={`bg-white dark:bg-secondary border rounded-lg p-5 shadow hover:shadow-md transition ${
                  a.isDefault ? "ring-2 ring-primary" : ""
                }`}
              >
                <h3 className="font-semibold capitalize mb-1 flex items-center gap-2">
                  {a.type === "home"
                    ? "🏠 Home"
                    : a.type === "work"
                    ? "🏢 Work"
                    : "📍 Other"}
                  {a.isDefault && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                      Default
                    </span>
                  )}
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {a.addressLine}
                  {a.landmark && `, ${a.landmark}`}
                  <br />
                  {a.city}, {a.state} - {a.pincode}
                </p>
                <div className="flex gap-4 mt-3 text-sm">
                  <button
                    onClick={() => handleEdit(a)}
                    className="text-yellow-600 flex items-center gap-1"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(a._id)}
                    className="text-red-600 flex items-center gap-1"
                  >
                    <FaTrash /> Delete
                  </button>
                  {!a.isDefault && (
                    <button
                      onClick={() => setAsDefault(a._id)}
                      className="text-blue-600"
                    >
                      ⭐ Set Default
                    </button>
                  )}
                </div>
              </div>
            ))
        )}
      </div>

      {/* Form */}
      <div className="bg-white dark:bg-secondary border rounded-lg p-6 shadow">
        <h2 className="text-xl font-semibold mb-4">
          {editId ? "Edit Address" : "Add New Address"}
        </h2>

        <button
          onClick={useMyLocation}
          className="text-sm text-blue-600 mb-3 hover:underline"
        >
          📍 Use My Current Location
        </button>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="space-y-3"
        >
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="w-full border px-3 py-2 rounded-md"
          >
            <option value="home">Home</option>
            <option value="work">Work</option>
            <option value="other">Other</option>
          </select>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Pincode"
              value={form.pincode}
              onChange={(e) => setForm({ ...form, pincode: e.target.value })}
              className="flex-1 border px-3 py-2 rounded-md"
            />
            <button
              type="button"
              onClick={lookupPincode}
              className="bg-gray-100 px-3 rounded-md text-sm"
            >
              Auto-fill
            </button>
          </div>

          <input
            type="text"
            placeholder="Address Line"
            value={form.addressLine}
            onChange={(e) => setForm({ ...form, addressLine: e.target.value })}
            className="w-full border px-3 py-2 rounded-md"
          />
          <input
            type="text"
            placeholder="City"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            className="w-full border px-3 py-2 rounded-md"
          />
          <input
            type="text"
            placeholder="State"
            value={form.state}
            onChange={(e) => setForm({ ...form, state: e.target.value })}
            className="w-full border px-3 py-2 rounded-md"
          />
          <input
            type="text"
            placeholder="Landmark (optional)"
            value={form.landmark}
            onChange={(e) => setForm({ ...form, landmark: e.target.value })}
            className="w-full border px-3 py-2 rounded-md"
          />

          {/* Map */}
          <div className="h-64">
            <MapContainer center={[20.59, 78.96]} zoom={5} className="h-full">
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <MapClickHandler />
              {marker && (
                <Marker
                  position={marker}
                  icon={L.icon({
                    iconUrl:
                      "https://cdn-icons-png.flaticon.com/512/684/684908.png",
                    iconSize: [32, 32],
                  })}
                />
              )}
            </MapContainer>
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-md hover:bg-orange-600"
          >
            {editId ? "Update Address" : "Save Address"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CustomerAddressBook;
