// src/pages/restaurant/RestaurantEditDish.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/axios";

const RestaurantEditDish = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Fetch dish by ID
  useEffect(() => {
    const fetchDish = async () => {
      console.log("📡 Fetching dish with ID:", id);
      setLoading(true);
      setError(null);
      try {
        const res = await API.get(`/menu/menu/${id}`);
        console.log("✅ Fetch response:", res.data);

        if (res.data?.menuItem) {
          setForm(res.data.menuItem);
          console.log("🍽️ Dish data loaded:", res.data.menuItem);
        } else {
          setError("Dish not found.");
          console.warn("⚠️ Dish not found in response");
        }
      } catch (err) {
        console.error("❌ Failed to load dish:", err.response?.data || err);
        setError(err.response?.data?.message || "Failed to load dish.");
      } finally {
        setLoading(false);
        console.log("⏳ Loading finished");
      }
    };

    fetchDish();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("📤 Updating dish with data:", form); // <-- Add this
    try {
      await API.put(`/menu/menu/${id}`, form); // ✅ correct path
      console.log("✅ Dish updated successfully:", form);
      alert("Dish updated successfully!");
      navigate("/restaurant/menu-manager");
    } catch (err) {
      console.error("❌ Failed to update dish:", err.response?.data || err);
      alert(err.response?.data?.message || "Failed to update dish.");
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading dish...</p>;
  }

  if (error) {
    return (
      <div className="text-center mt-10 text-red-600">
        <p>{error}</p>
        <button
          onClick={() => navigate("/restaurant/menu-manager")}
          className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-orange-600 transition"
        >
          Back to Menu
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6 text-gray-800 dark:text-white">
      <h2 className="text-2xl font-bold mb-4">✏️ Edit Dish</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-2 rounded border dark:bg-gray-800"
          placeholder="Dish Name"
          required
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full p-2 rounded border dark:bg-gray-800"
          placeholder="Description"
        />
        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          className="w-full p-2 rounded border dark:bg-gray-800"
          placeholder="Price"
          required
        />
        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full p-2 rounded border dark:bg-gray-800"
          placeholder="Category"
        />
        <input
          name="image"
          value={form.image}
          onChange={handleChange}
          className="w-full p-2 rounded border dark:bg-gray-800"
          placeholder="Image URL"
        />
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded hover:bg-orange-600 transition"
        >
          Update Dish
        </button>
      </form>
    </div>
  );
};

export default RestaurantEditDish;
