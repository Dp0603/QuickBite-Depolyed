// src/pages/restaurant/RestaurantAddDish.jsx
import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import API from "../../api/axios";

const defaultSchedule = {
  monday: { available: true, startTime: "00:00", endTime: "23:59" },
  tuesday: { available: true, startTime: "00:00", endTime: "23:59" },
  wednesday: { available: true, startTime: "00:00", endTime: "23:59" },
  thursday: { available: true, startTime: "00:00", endTime: "23:59" },
  friday: { available: true, startTime: "00:00", endTime: "23:59" },
  saturday: { available: true, startTime: "00:00", endTime: "23:59" },
  sunday: { available: true, startTime: "00:00", endTime: "23:59" },
};

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
    isAvailable: true,
    schedule: defaultSchedule,
  });

  // ✅ Fetch restaurantId for logged-in restaurant owner
  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const res = await API.get("/restaurants/restaurants/me");
        if (res.data?.restaurant?._id) {
          setRestaurantId(res.data.restaurant._id);
        } else {
          alert("You must create a restaurant profile first!");
          navigate("/restaurant/create-profile");
        }
      } catch (err) {
        alert("You must create a restaurant profile first!");
        navigate("/restaurant/create-profile");
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === "restaurant") {
      fetchRestaurant();
    } else {
      alert("Only restaurant owners can add dishes!");
      navigate("/");
    }
  }, [user, navigate]);

  // 📌 Form field change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 📌 Master availability toggle
  const toggleMasterAvailability = () => {
    setForm((prev) => ({ ...prev, isAvailable: !prev.isAvailable }));
  };

  // 📌 Schedule change
  const handleScheduleChange = (day, field, value) => {
    setForm((prev) => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [day]: { ...prev.schedule[day], [field]: value },
      },
    }));
  };

  // 📌 Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!restaurantId) {
      alert("No restaurant profile found. Please create one first.");
      return;
    }

    try {
      const res = await API.post("/menu/menu", {
        ...form,
        restaurantId,
      });

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
    <div className="max-w-2xl mx-auto p-6 text-gray-800 dark:text-white">
      <h2 className="text-2xl font-bold mb-4">➕ Add New Dish</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Dish Details */}
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

        {/* Master Availability */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.isAvailable}
            onChange={toggleMasterAvailability}
          />
          <label>Available</label>
        </div>

        {/* Weekly Schedule */}
        <div className="mt-6">
          <h3 className="font-semibold text-lg mb-2">🗓️ Weekly Schedule</h3>
          <div className="space-y-2">
            {Object.keys(form.schedule).map((day) => (
              <div
                key={day}
                className="flex items-center gap-3 border p-2 rounded"
              >
                <input
                  type="checkbox"
                  checked={form.schedule[day].available}
                  onChange={(e) =>
                    handleScheduleChange(day, "available", e.target.checked)
                  }
                />
                <span className="capitalize w-24">{day}</span>
                <input
                  type="time"
                  value={form.schedule[day].startTime}
                  onChange={(e) =>
                    handleScheduleChange(day, "startTime", e.target.value)
                  }
                  className="p-1 rounded border dark:bg-gray-800"
                />
                <span>-</span>
                <input
                  type="time"
                  value={form.schedule[day].endTime}
                  onChange={(e) =>
                    handleScheduleChange(day, "endTime", e.target.value)
                  }
                  className="p-1 rounded border dark:bg-gray-800"
                />
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded hover:bg-orange-600 transition mt-4"
        >
          Add Dish
        </button>
      </form>
    </div>
  );
};

export default RestaurantAddDish;
