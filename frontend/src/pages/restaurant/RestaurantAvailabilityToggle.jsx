import React, { useEffect, useState, useContext } from "react";
import {
  FaClock,
  FaToggleOn,
  FaToggleOff,
  FaCalendarAlt,
  FaSave,
} from "react-icons/fa";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";

const RestaurantAvailabilityToggle = () => {
  const { user } = useContext(AuthContext);
  const [availability, setAvailability] = useState({
    isOnline: true,
    autoAvailabilityEnabled: false,
    openTime: "09:00",
    closeTime: "22:00",
    breaks: [],
    holidays: [],
    autoAcceptOrders: true,
  });

  const [loading, setLoading] = useState(true);
  const [newHoliday, setNewHoliday] = useState("");

  const fetchAvailability = async () => {
    try {
      const res = await API.get("/restaurant/availability");
      setAvailability(res.data.data);
    } catch (err) {
      console.error("Error fetching availability:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateAvailability = async () => {
    try {
      await API.put("/restaurant/availability", availability);
      alert("Availability updated!");
    } catch (err) {
      console.error("Error updating availability:", err);
    }
  };

  const toggleOnline = () => {
    setAvailability((prev) => ({ ...prev, isOnline: !prev.isOnline }));
  };

  useEffect(() => {
    fetchAvailability();
  }, []);

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 p-6 rounded-xl shadow text-gray-800 dark:text-white">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <FaClock className="text-orange-500" />
        Restaurant Availability Settings
      </h2>

      {/* Online Toggle */}
      <div className="flex items-center justify-between mb-4">
        <span className="font-medium">Restaurant is Currently:</span>
        <button
          onClick={toggleOnline}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white ${
            availability.isOnline ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {availability.isOnline ? <FaToggleOn /> : <FaToggleOff />}
          {availability.isOnline ? "Online" : "Offline"}
        </button>
      </div>

      {/* Timings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <label className="flex flex-col">
          Open Time
          <input
            type="time"
            value={availability.openTime}
            onChange={(e) =>
              setAvailability({ ...availability, openTime: e.target.value })
            }
            className="input-style mt-1"
          />
        </label>
        <label className="flex flex-col">
          Close Time
          <input
            type="time"
            value={availability.closeTime}
            onChange={(e) =>
              setAvailability({ ...availability, closeTime: e.target.value })
            }
            className="input-style mt-1"
          />
        </label>
      </div>

      {/* Auto Toggle */}
      <div className="flex items-center gap-3 mb-4">
        <input
          type="checkbox"
          checked={availability.autoAvailabilityEnabled}
          onChange={(e) =>
            setAvailability({
              ...availability,
              autoAvailabilityEnabled: e.target.checked,
            })
          }
          id="auto-toggle"
        />
        <label htmlFor="auto-toggle">Auto open/close at defined time</label>
      </div>

      {/* Auto Accept Orders */}
      <div className="flex items-center gap-3 mb-4">
        <input
          type="checkbox"
          checked={availability.autoAcceptOrders}
          onChange={(e) =>
            setAvailability({
              ...availability,
              autoAcceptOrders: e.target.checked,
            })
          }
          id="auto-accept"
        />
        <label htmlFor="auto-accept">Auto accept orders</label>
      </div>

      {/* Holidays */}
      <div className="mb-4">
        <label className="block font-medium mb-2">Holiday Dates</label>
        <div className="flex items-center gap-3 mb-2">
          <input
            type="date"
            value={newHoliday}
            onChange={(e) => setNewHoliday(e.target.value)}
            className="input-style"
          />
          <button
            type="button"
            onClick={() => {
              if (newHoliday && !availability.holidays.includes(newHoliday)) {
                setAvailability((prev) => ({
                  ...prev,
                  holidays: [...prev.holidays, newHoliday],
                }));
                setNewHoliday("");
              }
            }}
            className="px-3 py-1 bg-primary text-white rounded hover:bg-orange-600"
          >
            Add
          </button>
        </div>

        <ul className="text-sm space-y-1">
          {availability.holidays.map((date, index) => (
            <li key={index} className="flex justify-between items-center">
              <span>
                <FaCalendarAlt className="inline mr-1" />
                {new Date(date).toLocaleDateString()}
              </span>
              <button
                onClick={() =>
                  setAvailability((prev) => ({
                    ...prev,
                    holidays: prev.holidays.filter((d) => d !== date),
                  }))
                }
                className="text-red-500 hover:underline text-xs"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Save Button */}
      <div className="text-center">
        <button
          onClick={updateAvailability}
          className="bg-primary text-white px-5 py-2 rounded hover:bg-orange-600 transition inline-flex items-center gap-2"
        >
          <FaSave />
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default RestaurantAvailabilityToggle;
