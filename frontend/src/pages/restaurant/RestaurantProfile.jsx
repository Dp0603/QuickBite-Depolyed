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
    <div className="p-6 max-w-2xl">
      <h2 className="text-2xl font-semibold mb-4">Restaurant Profile</h2>

      <div className="flex items-center mb-6 gap-4">
        <img
          src={profile.logo}
          alt="Logo"
          className="w-20 h-20 rounded object-cover border"
        />
        <input
          type="text"
          name="logo"
          value={profile.logo}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          placeholder="Logo Image URL"
        />
      </div>

      <div className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Restaurant Name</label>
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Phone</label>
          <input
            type="text"
            name="phone"
            value={profile.phone}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Address</label>
          <input
            type="text"
            name="address"
            value={profile.address}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Cuisine Type</label>
          <input
            type="text"
            name="cuisine"
            value={profile.cuisine}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <button className="bg-primary text-white px-5 py-2 rounded mt-4 hover:bg-orange-600">
          Update Profile
        </button>
      </div>
    </div>
  );
};

export default RestaurantProfile;
