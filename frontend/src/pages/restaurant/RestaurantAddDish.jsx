import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import API from "../../api/axios";

const RestaurantAddDish = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/menu", { ...form, restaurantId: user._id });
      alert("Dish added successfully!");
      navigate("/restaurant/menu-manager");
    } catch (err) {
      console.error("❌ Failed to add dish:", err);
      alert("Failed to add dish");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 text-gray-800 dark:text-white">
      <h2 className="text-2xl font-bold mb-4">➕ Add New Dish</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Dish Name"
          className="w-full p-2 rounded border dark:bg-gray-800"
          required
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full p-2 rounded border dark:bg-gray-800"
        />
        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          className="w-full p-2 rounded border dark:bg-gray-800"
          required
        />
        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Category"
          className="w-full p-2 rounded border dark:bg-gray-800"
        />
        <input
          name="image"
          value={form.image}
          onChange={handleChange}
          placeholder="Image URL"
          className="w-full p-2 rounded border dark:bg-gray-800"
        />
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded hover:bg-orange-600 transition"
        >
          Add Dish
        </button>
      </form>
    </div>
  );
};

export default RestaurantAddDish;
