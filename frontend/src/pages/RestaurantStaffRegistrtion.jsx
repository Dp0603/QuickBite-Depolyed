// src/pages/restaurant/RestaurantStaffRegistration.jsx
import React, { useState } from "react";
import axios from "axios"; // for API calls

const RestaurantStaffRegistration = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // API call to register user
      const response = await axios.post("/api/users/users/register", {
        ...formData,
        role: "restaurantStaff", // main role
        staffRoles: [], // child roles empty initially
      });

      setSuccessMsg("Registration successful! Please wait for admin approval.");
      setErrorMsg("");
      setFormData({ name: "", email: "", phone: "", password: "" });
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Registration failed");
      setSuccessMsg("");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">
        Restaurant Staff Registration
      </h2>

      {successMsg && <p className="text-green-600 mb-4">{successMsg}</p>}
      {errorMsg && <p className="text-red-600 mb-4">{errorMsg}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
        />

        <button
          type="submit"
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default RestaurantStaffRegistration;
