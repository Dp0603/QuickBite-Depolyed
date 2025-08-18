import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import API from "../../api/axios";

const RestaurantAddDish = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [restaurantId, setRestaurantId] = useState(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
  });

  // ✅ Fetch restaurantId for logged-in restaurant owner
  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        console.log("📡 Fetching restaurant profile...");
        const res = await API.get("/restaurants/restaurants/me");

        console.log("✅ Restaurant profile response:", res.data);

        if (res.data?.restaurant?._id) {
          setRestaurantId(res.data.restaurant._id);
          console.log("✅ Restaurant ID set:", res.data.restaurant._id);
        } else {
          console.warn("⚠️ No restaurant profile found in response:", res.data);
          alert("You must create a restaurant profile first!");
          navigate("/restaurant/create-profile");
        }
      } catch (err) {
        console.error("❌ Failed to fetch restaurant profile:", err);
        alert("You must create a restaurant profile first!");
        navigate("/restaurant/create-profile");
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === "restaurant") {
      fetchRestaurant();
    } else {
      console.warn(
        "⚠️ Unauthorized role trying to access add dish:",
        user?.role
      );
      alert("Only restaurant owners can add dishes!");
      navigate("/");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("📝 Submitting form with values:", form);

    if (!restaurantId) {
      console.error("❌ No restaurantId found, cannot add dish.");
      alert("No restaurant profile found. Please create one first.");
      return;
    }

    try {
      console.log(
        "📡 Sending request to create dish with restaurantId:",
        restaurantId
      );
      const res = await API.post("/menu/menu", { ...form, restaurantId });

      console.log("✅ Dish created successfully:", res.data);

      alert("Dish added successfully!");
      navigate("/restaurant/menu-manager");
    } catch (err) {
      console.error(
        "❌ Failed to add dish:",
        err.response?.data || err.message
      );
      alert("Failed to add dish");
    }
  };

  if (loading) return <p className="text-center">Loading...</p>;

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
          placeholder="Category (e.g., Starter, Main, Dessert)"
          className="w-full p-2 rounded border dark:bg-gray-800"
          required
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
