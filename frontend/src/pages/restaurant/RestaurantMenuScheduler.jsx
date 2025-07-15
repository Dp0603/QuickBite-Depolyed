import React, { useState, useEffect } from "react";
import { FaClock } from "react-icons/fa";
import API from "../../api/axios";

const RestaurantMenuScheduler = () => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 🔃 Load schedule from backend
  const fetchSchedule = async () => {
    try {
      const res = await API.get("/restaurant/menu-schedule");
      const data = res.data.data;

      if (Array.isArray(data) && data.length > 0) {
        setSchedule(data);
      } else {
        // fallback to default schedule
        setSchedule([
          { name: "Breakfast", start: "08:00", end: "11:00", enabled: true },
          { name: "Lunch", start: "12:00", end: "15:00", enabled: true },
          { name: "Dinner", start: "18:00", end: "22:00", enabled: true },
        ]);
      }
    } catch (err) {
      console.error("Failed to load schedule:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  // ✅ Update values
  const toggle = (i) =>
    setSchedule((prev) =>
      prev.map((slot, idx) =>
        idx === i ? { ...slot, enabled: !slot.enabled } : slot
      )
    );

  const updateTime = (i, field, value) =>
    setSchedule((prev) =>
      prev.map((slot, idx) => (idx === i ? { ...slot, [field]: value } : slot))
    );

  const handleSave = async () => {
    setSaving(true);
    try {
      await API.put("/restaurant/menu-schedule", { schedule });
      alert("✅ Schedule saved successfully!");
    } catch (err) {
      console.error("Save failed:", err);
      alert("❌ Failed to save schedule.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-6">Loading schedule...</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white dark:bg-gray-900 shadow-lg rounded-xl text-gray-800 dark:text-white">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <FaClock /> Menu Scheduling
      </h2>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        Define when your menus are available to customers. Toggle and update
        time slots based on your restaurant’s schedule.
      </p>

      <div className="space-y-6">
        {schedule.map((item, i) => (
          <div
            key={i}
            className="flex items-center justify-between border rounded-md p-4 shadow-sm hover:shadow transition duration-200 dark:border-gray-700"
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={item.enabled}
                onChange={() => toggle(i)}
                className="w-5 h-5 accent-orange-500"
              />
              <label className="font-medium text-lg">{item.name}</label>
            </div>

            <div className="flex gap-2 items-center text-sm">
              <input
                type="time"
                value={item.start}
                disabled={!item.enabled}
                onChange={(e) => updateTime(i, "start", e.target.value)}
                className="border px-2 py-1 rounded disabled:opacity-50"
              />
              <span>to</span>
              <input
                type="time"
                value={item.end}
                disabled={!item.enabled}
                onChange={(e) => updateTime(i, "end", e.target.value)}
                className="border px-2 py-1 rounded disabled:opacity-50"
              />
            </div>
          </div>
        ))}
      </div>

      <button
        className="mt-8 w-full py-3 rounded bg-primary text-white text-center text-sm font-semibold hover:bg-orange-600 transition"
        onClick={handleSave}
        disabled={saving}
      >
        {saving ? "Saving..." : "Save Schedule"}
      </button>
    </div>
  );
};

export default RestaurantMenuScheduler;
