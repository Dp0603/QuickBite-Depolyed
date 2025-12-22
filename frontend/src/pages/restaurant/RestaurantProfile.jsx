import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUser,
  FaStore,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaUtensils,
  FaImage,
  FaUpload,
  FaSave,
  FaCheckCircle,
  FaExclamationTriangle,
  FaCamera,
  FaEdit,
  FaInfoCircle,
  FaCity,
  FaMapPin,
  FaGlobe,
  FaSpinner,
  FaStar,
  FaTimes,
} from "react-icons/fa";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";

/* ------------------------------- Toast Component ------------------------------- */
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
            t.type === "success"
              ? "bg-emerald-500/95 border-emerald-400"
              : t.type === "error"
              ? "bg-red-500/95 border-red-400"
              : "bg-blue-500/95 border-blue-400"
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

/* ------------------------------- Input Components ------------------------------- */
const Input = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  icon,
  placeholder,
  disabled,
}) => (
  <div className="space-y-2">
    <label className="block text-sm font-bold text-gray-700">{label}</label>
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </div>
      )}
      <input
        type={type}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full ${
          icon ? "pl-10" : "pl-4"
        } pr-4 py-3 rounded-xl border-2 ${
          disabled
            ? "border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
            : "border-gray-300 focus:border-indigo-500 bg-white"
        } focus:outline-none transition-colors font-medium`}
      />
    </div>
  </div>
);

const FileUpload = ({ label, currentImage, onChange, type = "logo" }) => {
  const [preview, setPreview] = useState(currentImage);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setPreview(currentImage);
  }, [currentImage]);

  const handleFileChange = (file) => {
    if (!file) return;
    const fileUrl = URL.createObjectURL(file);
    setPreview(fileUrl);
    onChange(file, fileUrl);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleFileChange(file);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-bold text-gray-700">{label}</label>

      <div
        className={`relative rounded-xl border-2 border-dashed overflow-hidden transition-all ${
          isDragging
            ? "border-indigo-500 bg-indigo-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        {preview ? (
          <div className="relative group">
            <img
              src={preview}
              alt={type}
              className={`w-full object-cover ${
                type === "logo" ? "h-40" : "h-48"
              }`}
              onError={(e) => {
                e.target.src =
                  type === "logo" ? "/QuickBite.png" : "/default-banner.jpg";
              }}
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <label className="cursor-pointer px-4 py-2 bg-white rounded-lg font-bold text-gray-900 flex items-center gap-2 hover:bg-gray-100 transition-colors">
                <FaCamera />
                Change Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e.target.files[0])}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        ) : (
          <label
            className={`flex flex-col items-center justify-center cursor-pointer ${
              type === "logo" ? "h-40" : "h-48"
            } hover:bg-gray-50 transition-colors`}
          >
            <FaUpload className="text-4xl text-gray-400 mb-2" />
            <p className="text-sm font-bold text-gray-600">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e.target.files[0])}
              className="hidden"
            />
          </label>
        )}
      </div>
    </div>
  );
};

/* ------------------------------- Profile Preview Card ------------------------------- */
const ProfilePreview = ({ profile, logoPreview, bannerPreview }) => (
  <motion.div
    className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden sticky top-8"
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5 }}
  >
    {/* Header */}
    <div className="p-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
      <h3 className="text-2xl font-black flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
          <FaStore />
        </div>
        Live Preview
      </h3>
    </div>

    {/* Banner & Logo */}
    <div className="relative">
      <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
        <img
          src={bannerPreview}
          alt="Banner"
          className="w-full h-full object-cover"
          onError={(e) => (e.target.src = "/default-banner.jpg")}
        />
      </div>

      <div className="absolute -bottom-16 left-6">
        <div className="relative">
          <img
            src={logoPreview}
            alt="Logo"
            className="w-32 h-32 object-cover rounded-2xl border-4 border-white bg-white shadow-xl"
            onError={(e) => (e.target.src = "/QuickBite.png")}
          />
          <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-emerald-500 border-4 border-white flex items-center justify-center">
            <FaCheckCircle className="text-white" />
          </div>
        </div>
      </div>
    </div>

    {/* Profile Info */}
    <div className="pt-20 p-6 space-y-4">
      <div>
        <h2 className="text-2xl font-black text-gray-900 mb-1">
          {profile.restaurantName || "Restaurant Name"}
        </h2>
        <div className="flex items-center gap-2 text-gray-600">
          <FaUtensils className="text-sm" />
          <span className="font-semibold">
            {profile.cuisine || "Cuisine Type"}
          </span>
        </div>
      </div>

      <div className="space-y-3 pt-4 border-t border-gray-200">
        <InfoRow
          icon={<FaPhone className="text-blue-500" />}
          label="Phone"
          value={profile.phone || "Not provided"}
        />
        <InfoRow
          icon={<FaEnvelope className="text-purple-500" />}
          label="Email"
          value={profile.email || "Not provided"}
        />
        <InfoRow
          icon={<FaMapMarkerAlt className="text-red-500" />}
          label="Address"
          value={
            profile.address.street
              ? `${profile.address.street}, ${profile.address.city}, ${profile.address.state} - ${profile.address.zip}`
              : "Not provided"
          }
        />
      </div>

      <div className="pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FaStar className="text-amber-500" />
            <span className="font-bold text-gray-900">4.5</span>
            <span className="text-sm text-gray-500">(250+ reviews)</span>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
            Active
          </span>
        </div>
      </div>
    </div>
  </motion.div>
);

const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs font-semibold text-gray-500 uppercase">{label}</p>
      <p className="text-sm font-bold text-gray-900 break-words">{value}</p>
    </div>
  </div>
);

/* ------------------------------- Main Component ------------------------------- */
const RestaurantProfile = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [toasts, setToasts] = useState([]);

  const [profile, setProfile] = useState({
    restaurantName: "",
    email: "",
    phone: "",
    address: { street: "", city: "", state: "", zip: "" },
    cuisine: "",
    logoUrl: "",
    bannerUrl: "",
  });

  const [logoPreview, setLogoPreview] = useState("/QuickBite.png");
  const [bannerPreview, setBannerPreview] = useState("/default-banner.jpg");
  const [logoFile, setLogoFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);

  /* --------------------- Toast System --------------------- */
  const pushToast = (payload) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, ...payload }]);
    setTimeout(() => removeToast(id), 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  /* --------------------- Fetch Profile --------------------- */
  const fetchProfile = async () => {
    setLoading(true);
    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const emailFromStorage = storedUser.email || "";

      const res = await API.get("/restaurants/restaurants/me");
      const data = res.data.restaurant;

      const parsedAddress = parseAddress(data.address);

      setProfile({
        restaurantName: data.name || "",
        email: emailFromStorage,
        phone: data.phoneNumber || "",
        address: parsedAddress,
        cuisine: data.cuisines?.[0] || "",
        logoUrl: data.logo || "",
        bannerUrl: data.coverImage || "",
      });

      setLogoPreview(data.logo || "/QuickBite.png");
      setBannerPreview(data.coverImage || "/default-banner.jpg");
    } catch (err) {
      console.error("Failed to load profile:", err);
      pushToast({
        type: "error",
        title: "Failed to load profile",
        message: "Please try again later",
        icon: <FaExclamationTriangle />,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  /* --------------------- Helpers --------------------- */
  const parseAddress = (addressStr = "") => {
    const [street = "", city = "", stateZip = ""] = addressStr.split(",");
    const [state = "", zip = ""] = stateZip.trim().split(" - ");
    return {
      street: street.trim(),
      city: city.trim(),
      state: state.trim(),
      zip: zip.trim(),
    };
  };

  const buildPayload = () => {
    return {
      name: profile.restaurantName,
      phoneNumber: profile.phone,
      address: `${profile.address.street}, ${profile.address.city}, ${profile.address.state} - ${profile.address.zip}`,
      cuisines: profile.cuisine ? [profile.cuisine] : [],
      logo: profile.logoUrl,
      coverImage: profile.bannerUrl,
    };
  };

  const uploadImage = async (file, type) => {
    const formData = new FormData();
    formData.append(type, file);

    const res = await API.post(`/upload/${type}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data.data.url; // Cloudinary URL
  };

  /* --------------------- Handlers --------------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name in profile.address) {
      setProfile((prev) => ({
        ...prev,
        address: { ...prev.address, [name]: value },
      }));
    } else {
      setProfile((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleLogoChange = (file, url) => {
    setLogoFile(file);
    setLogoPreview(url);
    setProfile((prev) => ({ ...prev, logoUrl: url }));
  };

  const handleBannerChange = (file, url) => {
    setBannerFile(file);
    setBannerPreview(url);
    setProfile((prev) => ({ ...prev, bannerUrl: url }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    // TODO: Upload images to cloud storage first if files exist
    // For now, using the preview URLs
    try {
      let logoUrl = profile.logoUrl;
      let bannerUrl = profile.bannerUrl;

      // ⬆️ Upload logo if changed
      if (logoFile) {
        logoUrl = await uploadImage(logoFile, "logo");
      }

      // ⬆️ Upload banner if changed
      if (bannerFile) {
        bannerUrl = await uploadImage(bannerFile, "banner");
      }

      const payload = {
        name: profile.restaurantName,
        phoneNumber: profile.phone,
        address: `${profile.address.street}, ${profile.address.city}, ${profile.address.state} - ${profile.address.zip}`,
        cuisines: profile.cuisine ? [profile.cuisine] : [],
        logo: logoUrl, // ✅ Cloudinary URL
        coverImage: bannerUrl, // ✅ Cloudinary URL
      };

      await API.put("/restaurants/restaurants/update", payload);

      pushToast({
        type: "success",
        title: "Profile Updated",
        message: "Your restaurant profile has been updated successfully",
        icon: <FaCheckCircle />,
      });

      await fetchProfile();
      setLogoFile(null);
      setBannerFile(null);
    } catch (err) {
      console.error("Update failed", err);
      pushToast({
        type: "error",
        title: "Update Failed",
        message: err.response?.data?.message || "Failed to update profile",
        icon: <FaExclamationTriangle />,
      });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
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
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600"></div>
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
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <motion.div
                  className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-3xl"
                  animate={{ rotate: [0, 360] }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  🏪
                </motion.div>
                <div>
                  <h1 className="text-4xl font-black text-white drop-shadow-lg">
                    Restaurant Profile
                  </h1>
                  <p className="text-white/90 text-sm font-medium mt-1">
                    Manage your restaurant information and branding
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Loading State */}
        {loading ? (
          <LoadingState />
        ) : (
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Preview - 2 columns */}
            <div className="lg:col-span-2">
              <ProfilePreview
                profile={profile}
                logoPreview={logoPreview}
                bannerPreview={bannerPreview}
              />
            </div>

            {/* Form - 3 columns */}
            <div className="lg:col-span-3">
              <motion.form
                onSubmit={handleSubmit}
                className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="p-6 bg-gradient-to-r from-rose-500 to-pink-600 text-white">
                  <h3 className="text-2xl font-black flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                      <FaEdit />
                    </div>
                    Edit Profile
                  </h3>
                </div>

                <div className="p-6 space-y-8">
                  {/* Basic Information */}
                  <div>
                    <h4 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                      <FaStore className="text-indigo-500" />
                      Basic Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Restaurant Name"
                        name="restaurantName"
                        value={profile.restaurantName}
                        onChange={handleChange}
                        icon={<FaStore />}
                        placeholder="Enter restaurant name"
                      />
                      <Input
                        label="Cuisine Type"
                        name="cuisine"
                        value={profile.cuisine}
                        onChange={handleChange}
                        icon={<FaUtensils />}
                        placeholder="e.g., Italian, Chinese"
                      />
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="pt-6 border-t border-gray-200">
                    <h4 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                      <FaPhone className="text-blue-500" />
                      Contact Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Email Address"
                        name="email"
                        value={profile.email}
                        onChange={handleChange}
                        icon={<FaEnvelope />}
                        disabled={true}
                      />
                      <Input
                        label="Phone Number"
                        name="phone"
                        value={profile.phone}
                        onChange={handleChange}
                        icon={<FaPhone />}
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>

                    <div className="mt-4 p-4 rounded-xl bg-blue-50 border-2 border-blue-200">
                      <div className="flex items-start gap-3">
                        <FaInfoCircle className="text-blue-500 text-xl mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-blue-700">
                          <span className="font-bold">Email is read-only.</span>{" "}
                          Contact support to change your email address.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="pt-6 border-t border-gray-200">
                    <h4 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                      <FaMapMarkerAlt className="text-red-500" />
                      Address
                    </h4>
                    <div className="grid grid-cols-1 gap-6">
                      <Input
                        label="Street Address"
                        name="street"
                        value={profile.address.street}
                        onChange={handleChange}
                        icon={<FaMapMarkerAlt />}
                        placeholder="123 Main Street"
                      />
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Input
                          label="City"
                          name="city"
                          value={profile.address.city}
                          onChange={handleChange}
                          icon={<FaCity />}
                          placeholder="Mumbai"
                        />
                        <Input
                          label="State"
                          name="state"
                          value={profile.address.state}
                          onChange={handleChange}
                          icon={<FaGlobe />}
                          placeholder="Maharashtra"
                        />
                        <Input
                          label="ZIP Code"
                          name="zip"
                          value={profile.address.zip}
                          onChange={handleChange}
                          icon={<FaMapPin />}
                          placeholder="400001"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Images */}
                  <div className="pt-6 border-t border-gray-200">
                    <h4 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                      <FaImage className="text-purple-500" />
                      Branding
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FileUpload
                        label="Restaurant Logo"
                        currentImage={logoPreview}
                        onChange={handleLogoChange}
                        type="logo"
                      />
                      <FileUpload
                        label="Cover Banner"
                        currentImage={bannerPreview}
                        onChange={handleBannerChange}
                        type="banner"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-6 border-t border-gray-200">
                    <motion.button
                      type="submit"
                      disabled={updating}
                      className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      whileHover={{ scale: updating ? 1 : 1.02 }}
                      whileTap={{ scale: updating ? 1 : 0.98 }}
                    >
                      {updating ? (
                        <>
                          <FaSpinner className="animate-spin" />
                          Updating Profile...
                        </>
                      ) : (
                        <>
                          <FaSave />
                          Save Changes
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.form>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

/* ------------------------------- Sub Components ------------------------------- */

const LoadingState = () => (
  <div className="flex flex-col items-center justify-center py-20">
    <motion.div
      className="relative w-16 h-16 mb-4"
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
    >
      <div className="absolute inset-0 border-4 border-indigo-200 rounded-full"></div>
      <div className="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
    </motion.div>
    <p className="text-gray-600 font-semibold">Loading profile...</p>
  </div>
);

export default RestaurantProfile;

// import React, { useState, useEffect, useContext } from "react";
// import API from "../../api/axios";
// import { AuthContext } from "../../context/AuthContext";

// // 🔧 Helpers
// const buildPayload = (profile) => {
//   return {
//     name: profile.restaurantName,
//     phoneNumber: profile.phone,
//     address: `${profile.address.street}, ${profile.address.city}, ${profile.address.state} - ${profile.address.zip}`,
//     cuisines: profile.cuisine ? [profile.cuisine] : [],
//     logo: profile.logoUrl,
//     coverImage: profile.bannerUrl,
//   };
// };

// const parseAddress = (addressStr = "") => {
//   const [street = "", city = "", stateZip = ""] = addressStr.split(",");
//   const [state = "", zip = ""] = stateZip.trim().split(" - ");
//   return {
//     street: street.trim(),
//     city: city.trim(),
//     state: state.trim(),
//     zip: zip.trim(),
//   };
// };

// const RestaurantProfile = () => {
//   const { user } = useContext(AuthContext);

//   const [profile, setProfile] = useState({
//     restaurantName: "",
//     email: "",
//     phone: "",
//     address: { street: "", city: "", state: "", zip: "" },
//     cuisine: "",
//     logoUrl: "",
//     bannerUrl: "",
//   });

//   const [logoPreview, setLogoPreview] = useState("/QuickBite.png");
//   const [bannerPreview, setBannerPreview] = useState("/default-banner.jpg");
//   const [loading, setLoading] = useState(true);
//   const [updating, setUpdating] = useState(false);

//   const fetchProfile = async () => {
//     try {
//       const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
//       const emailFromStorage = storedUser.email || "";

//       const res = await API.get("/restaurants/restaurants/me");
//       const data = res.data.restaurant;

//       setProfile({
//         restaurantName: data.name || "",
//         email: emailFromStorage, // read-only
//         phone: data.phoneNumber || "",
//         address: parseAddress(data.address),
//         cuisine: data.cuisines?.[0] || "",
//         logoUrl: data.logo || "",
//         bannerUrl: data.coverImage || "",
//       });

//       setLogoPreview(data.logo || "/QuickBite.png");
//       setBannerPreview(data.coverImage || "/default-banner.jpg");
//     } catch (err) {
//       console.error("Failed to load profile:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     if (name in profile.address) {
//       setProfile((prev) => ({
//         ...prev,
//         address: { ...prev.address, [name]: value },
//       }));
//     } else {
//       setProfile((prev) => ({ ...prev, [name]: value }));

//       if (name === "logoUrl") setLogoPreview(value);
//       if (name === "bannerUrl") setBannerPreview(value);
//     }
//   };

//   const handleFileChange = (e, field) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     const fileUrl = URL.createObjectURL(file);
//     setProfile((prev) => ({ ...prev, [field]: fileUrl }));

//     if (field === "logoUrl") setLogoPreview(fileUrl);
//     else setBannerPreview(fileUrl);

//     // TODO: replace with real upload (e.g., Cloudinary/S3)
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setUpdating(true);

//     try {
//       const payload = buildPayload(profile);
//       await API.put("/restaurants/restaurants/update", payload);
//       alert("✅ Profile updated successfully");
//     } catch (err) {
//       console.error("Update failed", err);
//       alert("❌ Update failed. Check console.");
//     } finally {
//       setUpdating(false);
//     }
//   };

//   if (loading) return <p className="p-6">Loading profile...</p>;

//   return (
//     <div className="px-6 py-8 min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-white">
//       <div className="grid lg:grid-cols-2 gap-10 max-w-7xl mx-auto animate-fade-in">
//         {/* 🔍 Preview */}
//         <div className="bg-white dark:bg-secondary rounded-xl shadow p-6 border space-y-4">
//           <div className="relative h-40 rounded-xl overflow-hidden bg-gray-200">
//             <img
//               src={bannerPreview}
//               alt="Banner"
//               className="w-full h-full object-cover"
//               onError={(e) => (e.target.src = "/default-banner.jpg")}
//             />
//             <img
//               src={logoPreview}
//               alt="Logo"
//               className="w-20 h-20 object-cover rounded-full border-4 border-white absolute -bottom-10 left-6 bg-white shadow"
//               onError={(e) => (e.target.src = "/QuickBite.png")}
//             />
//           </div>
//           <div className="pt-12 px-2 space-y-1">
//             <h2 className="text-xl font-bold">{profile.restaurantName}</h2>
//             <p className="text-sm text-gray-500 dark:text-gray-300">
//               {profile.cuisine}
//             </p>
//             <p className="text-sm">📞 {profile.phone}</p>
//             <p className="text-sm">📧 {profile.email}</p>
//             <p className="text-sm">
//               📍 {profile.address.street}, {profile.address.city},{" "}
//               {profile.address.state} - {profile.address.zip}
//             </p>
//           </div>
//         </div>

//         {/* 📝 Form */}
//         <form
//           onSubmit={handleSubmit}
//           className="bg-white dark:bg-secondary p-6 rounded-xl shadow border space-y-6"
//         >
//           <h2 className="text-2xl font-bold">✏️ Edit Restaurant Profile</h2>

//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//             <Input
//               label="Restaurant Name"
//               name="restaurantName"
//               value={profile.restaurantName}
//               onChange={handleChange}
//             />
//             <Input
//               label="Cuisine Type"
//               name="cuisine"
//               value={profile.cuisine}
//               onChange={handleChange}
//             />
//             {/* Read-only Email */}
//             <div>
//               <label className="block text-sm font-medium mb-1">Email</label>
//               <p className="text-gray-600 dark:text-gray-300">
//                 {profile.email}
//               </p>
//             </div>
//             <Input
//               label="Phone"
//               name="phone"
//               value={profile.phone}
//               onChange={handleChange}
//             />

//             <Input
//               label="Street"
//               name="street"
//               value={profile.address.street}
//               onChange={handleChange}
//             />
//             <Input
//               label="City"
//               name="city"
//               value={profile.address.city}
//               onChange={handleChange}
//             />
//             <Input
//               label="State"
//               name="state"
//               value={profile.address.state}
//               onChange={handleChange}
//             />
//             <Input
//               label="ZIP"
//               name="zip"
//               value={profile.address.zip}
//               onChange={handleChange}
//             />

//             <Input
//               label="Logo URL"
//               name="logoUrl"
//               value={profile.logoUrl}
//               onChange={handleChange}
//             />
//             <Input
//               label="Banner URL"
//               name="bannerUrl"
//               value={profile.bannerUrl}
//               onChange={handleChange}
//             />

//             <div>
//               <label className="block text-sm font-medium mb-1">
//                 Upload Logo
//               </label>
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={(e) => handleFileChange(e, "logoUrl")}
//                 className="input-style"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">
//                 Upload Banner
//               </label>
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={(e) => handleFileChange(e, "bannerUrl")}
//                 className="input-style"
//               />
//             </div>
//           </div>

//           <div className="pt-4">
//             <button
//               type="submit"
//               disabled={updating}
//               className="bg-primary hover:bg-orange-600 text-white px-6 py-2 rounded-xl text-sm font-medium transition"
//             >
//               {updating ? "Updating..." : "Update Profile"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// const Input = ({ label, name, value, onChange, type = "text" }) => (
//   <div>
//     <label className="block text-sm font-medium mb-1">{label}</label>
//     <input
//       type={type}
//       name={name}
//       value={value}
//       onChange={onChange}
//       className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary outline-none"
//     />
//   </div>
// );

// export default RestaurantProfile;
