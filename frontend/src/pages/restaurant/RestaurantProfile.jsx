import React, { useState } from "react";

const RestaurantProfile = () => {
  const [profile, setProfile] = useState({
    name: "Tandoori Junction",
    email: "tandoori@quickbite.com",
    phone: "+91 9876543210",
    address: "12B, MG Road, Delhi",
    cuisine: "North Indian",
    logo: "https://via.placeholder.com/100",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="px-6 py-8 min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-white">
      <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
        <h2 className="text-3xl font-bold">🏷️ Restaurant Profile</h2>

        <div className="bg-white dark:bg-secondary p-6 rounded-xl shadow space-y-6">
          {/* Logo Section */}
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <img
              src={profile.logo}
              alt="Restaurant Logo"
              className="w-24 h-24 object-cover border rounded-xl shadow"
              onError={(e) =>
                (e.target.src = "https://via.placeholder.com/100")
              }
            />
            <div className="w-full">
              <label className="block text-sm font-medium mb-1">
                Logo Image URL
              </label>
              <input
                type="text"
                name="logo"
                value={profile.logo}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">
                Restaurant Name
              </label>
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Cuisine Type
              </label>
              <input
                type="text"
                name="cuisine"
                value={profile.cuisine}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="text"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-1">Address</label>
              <input
                type="text"
                name="address"
                value={profile.address}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
          </div>

          <div className="pt-4">
            <button className="bg-primary hover:bg-orange-600 text-white px-6 py-2 rounded-xl text-sm font-medium transition">
              Update Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantProfile;
