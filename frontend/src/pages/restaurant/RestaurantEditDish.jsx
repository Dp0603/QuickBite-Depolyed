// src/pages/restaurant/RestaurantEditDish.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

const RestaurantEditDish = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
    isAvailable: true,
    schedule: defaultSchedule,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Fetch dish by ID
  useEffect(() => {
    const fetchDish = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await API.get(`/menu/menu/${id}`);
        if (res.data?.menuItem) {
          setForm({
            ...defaultSchedule,
            ...res.data.menuItem, // merge with default to avoid missing schedule
          });
        } else {
          setError("Dish not found.");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load dish.");
      } finally {
        setLoading(false);
      }
    };

    fetchDish();
  }, [id]);

  // 📌 Input change
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

  // 📌 Update dish
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/menu/menu/${id}`, form);
      alert("Dish updated successfully!");
      navigate("/restaurant/menu-manager");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update dish.");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading dish...</p>;

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
    <div className="max-w-2xl mx-auto p-6 text-gray-800 dark:text-white">
      <h2 className="text-2xl font-bold mb-4">✏️ Edit Dish</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Dish details */}
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
          Update Dish
        </button>
      </form>
    </div>
  );
};

export default RestaurantEditDish;
