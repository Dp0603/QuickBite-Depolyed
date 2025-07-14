import React, { useState, useEffect, useContext } from "react";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";

const RestaurantProfile = () => {
  const { user } = useContext(AuthContext);

  const [profile, setProfile] = useState({
    restaurantName: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      zip: "",
    },
    cuisine: "",
    logoUrl: "",
    bannerUrl: "",
  });

  const [logoPreview, setLogoPreview] = useState("/QuickBite.png");
  const [bannerPreview, setBannerPreview] = useState("/default-banner.jpg");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/restaurant/profile");
      const data = res.data.data;

      setProfile({
        restaurantName: data.restaurantName || "",
        email: data.email || "",
        phone: data.phone || "",
        address: {
          street: data.address?.street || "",
          city: data.address?.city || "",
          state: data.address?.state || "",
          zip: data.address?.zip || "",
        },
        cuisine: data.cuisine || "",
        logoUrl: data.logoUrl || "",
        bannerUrl: data.bannerUrl || "",
      });

      setLogoPreview(data.logoUrl || "/QuickBite.png");
      setBannerPreview(data.bannerUrl || "/default-banner.jpg");
    } catch (err) {
      console.error("Failed to load profile:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name in profile.address) {
      setProfile((prev) => ({
        ...prev,
        address: { ...prev.address, [name]: value },
      }));
    } else {
      setProfile((prev) => ({ ...prev, [name]: value }));

      if (name === "logoUrl") setLogoPreview(value);
      if (name === "bannerUrl") setBannerPreview(value);
    }
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    const fileUrl = URL.createObjectURL(file);
    setProfile((prev) => ({ ...prev, [field]: fileUrl }));

    if (field === "logoUrl") setLogoPreview(fileUrl);
    else setBannerPreview(fileUrl);

    // ⬆️ optionally: you can upload the file to cloudinary/s3 here and get real URL
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      await API.put("/restaurant/profile", profile);
      alert("✅ Profile updated successfully");
    } catch (err) {
      console.error("Update failed", err);
      alert("❌ Update failed. Check console.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <p className="p-6">Loading profile...</p>;

  return (
    <div className="px-6 py-8 min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-white">
      <div className="grid lg:grid-cols-2 gap-10 max-w-7xl mx-auto animate-fade-in">
        {/* 🔍 Preview */}
        <div className="bg-white dark:bg-secondary rounded-xl shadow p-6 border space-y-4">
          <div className="relative h-40 rounded-xl overflow-hidden bg-gray-200">
            <img
              src={bannerPreview}
              alt="Banner"
              className="w-full h-full object-cover"
              onError={(e) => (e.target.src = "/default-banner.jpg")}
            />
            <img
              src={logoPreview}
              alt="Logo"
              className="w-20 h-20 object-cover rounded-full border-4 border-white absolute -bottom-10 left-6 bg-white shadow"
              onError={(e) => (e.target.src = "/QuickBite.png")}
            />
          </div>
          <div className="pt-12 px-2 space-y-1">
            <h2 className="text-xl font-bold">{profile.restaurantName}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-300">
              {profile.cuisine}
            </p>
            <p className="text-sm">📞 {profile.phone}</p>
            <p className="text-sm">📧 {profile.email}</p>
            <p className="text-sm">
              📍 {profile.address.street}, {profile.address.city},{" "}
              {profile.address.state} - {profile.address.zip}
            </p>
          </div>
        </div>

        {/* 📝 Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-secondary p-6 rounded-xl shadow border space-y-6"
        >
          <h2 className="text-2xl font-bold">✏️ Edit Restaurant Profile</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Basic fields */}
            <Input
              label="Restaurant Name"
              name="restaurantName"
              value={profile.restaurantName}
              onChange={handleChange}
            />
            <Input
              label="Cuisine Type"
              name="cuisine"
              value={profile.cuisine}
              onChange={handleChange}
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={profile.email}
              onChange={handleChange}
            />
            <Input
              label="Phone"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
            />

            {/* Address fields */}
            <Input
              label="Street"
              name="street"
              value={profile.address.street}
              onChange={handleChange}
            />
            <Input
              label="City"
              name="city"
              value={profile.address.city}
              onChange={handleChange}
            />
            <Input
              label="State"
              name="state"
              value={profile.address.state}
              onChange={handleChange}
            />
            <Input
              label="ZIP"
              name="zip"
              value={profile.address.zip}
              onChange={handleChange}
            />

            {/* Image URLs */}
            <Input
              label="Logo URL"
              name="logoUrl"
              value={profile.logoUrl}
              onChange={handleChange}
            />
            <Input
              label="Banner URL"
              name="bannerUrl"
              value={profile.bannerUrl}
              onChange={handleChange}
            />

            {/* Uploads */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Upload Logo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "logoUrl")}
                className="input-style"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Upload Banner
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "bannerUrl")}
                className="input-style"
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={updating}
              className="bg-primary hover:bg-orange-600 text-white px-6 py-2 rounded-xl text-sm font-medium transition"
            >
              {updating ? "Updating..." : "Update Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Input = ({ label, name, value, onChange, type = "text" }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary outline-none"
    />
  </div>
);

export default RestaurantProfile;
