import React, { useEffect, useState } from "react";
import { FaClock } from "react-icons/fa";
import API from "../../api/axios";

const daysOfWeek = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const RestaurantMenuScheduler = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch owner's restaurant menu
  const fetchMenu = async () => {
    try {
      const res = await API.get(`/menu/restaurant/menu/full`);
      setMenuItems(res.data.menu || []);
    } catch (err) {
      console.error("Failed to load menu:", err.response || err);
      alert("Failed to load menu items.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  // Toggle availability for a day of an item
  const toggleDay = (itemId, day) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item._id === itemId
          ? {
              ...item,
              schedule: {
                ...item.schedule,
                [day]: {
                  ...item.schedule[day],
                  available: !item.schedule[day]?.available,
                },
              },
            }
          : item
      )
    );
  };

  // Update time for a day of an item
  const updateTime = (itemId, day, field, value) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item._id === itemId
          ? {
              ...item,
              schedule: {
                ...item.schedule,
                [day]: {
                  ...item.schedule[day],
                  [field]: value,
                },
              },
            }
          : item
      )
    );
  };

  // Save schedule for one item
  const saveItemSchedule = async (item) => {
    try {
      await API.put(`/menu/menu/schedule/${item._id}`, { schedule: item.schedule });
      alert(`✅ Saved schedule for "${item.name}"`);
    } catch (err) {
      console.error("Failed to save:", err.response || err);
      alert(`❌ Failed to save schedule for "${item.name}"`);
    }
  };

  if (loading) return <p className="p-6 text-center">Loading menu...</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white dark:bg-gray-900 shadow-lg rounded-xl text-gray-800 dark:text-white">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <FaClock /> Menu Scheduler
      </h2>

      {menuItems.length === 0 && (
        <p className="text-center text-gray-500 dark:text-gray-400">
          No menu items available.
        </p>
      )}

      {menuItems.map((item) => (
        <div key={item._id} className="mb-6 border p-4 rounded-lg shadow-sm">
          <h3 className="font-semibold mb-2">{item.name}</h3>
          <div className="space-y-2">
            {daysOfWeek.map((day) => (
              <div key={day} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={item.schedule?.[day]?.available || false}
                  onChange={() => toggleDay(item._id, day)}
                  className="w-5 h-5 accent-orange-500"
                />
                <label className="capitalize w-20">{day}</label>
                <input
                  type="time"
                  value={item.schedule?.[day]?.startTime || "09:00"}
                  disabled={!item.schedule?.[day]?.available}
                  onChange={(e) =>
                    updateTime(item._id, day, "startTime", e.target.value)
                  }
                  className="border px-2 py-1 rounded disabled:opacity-50"
                />
                <span>to</span>
                <input
                  type="time"
                  value={item.schedule?.[day]?.endTime || "21:00"}
                  disabled={!item.schedule?.[day]?.available}
                  onChange={(e) =>
                    updateTime(item._id, day, "endTime", e.target.value)
                  }
                  className="border px-2 py-1 rounded disabled:opacity-50"
                />
              </div>
            ))}
          </div>

          <button
            onClick={() => saveItemSchedule(item)}
            className="mt-2 py-2 px-4 bg-primary text-white rounded hover:bg-orange-600 transition"
          >
            Save Schedule
          </button>
        </div>
      ))}
    </div>
  );
};

export default RestaurantMenuScheduler;
