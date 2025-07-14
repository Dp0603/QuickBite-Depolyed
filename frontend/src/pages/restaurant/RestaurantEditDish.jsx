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

  useEffect(() => {
    const fetchDish = async () => {
      try {
        const res = await API.get(`/menu/${id}`);
        setForm(res.data.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load dish");
      }
    };
    fetchDish();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/menu/${id}`, form);
      alert("Dish updated successfully!");
      navigate("/restaurant/menu-manager");
    } catch (err) {
      console.error(err);
      alert("Failed to update dish");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 text-gray-800 dark:text-white">
      <h2 className="text-2xl font-bold mb-4">✏️ Edit Dish</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-2 rounded border dark:bg-gray-800"
          required
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full p-2 rounded border dark:bg-gray-800"
        />
        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          className="w-full p-2 rounded border dark:bg-gray-800"
          required
        />
        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full p-2 rounded border dark:bg-gray-800"
        />
        <input
          name="image"
          value={form.image}
          onChange={handleChange}
          className="w-full p-2 rounded border dark:bg-gray-800"
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
