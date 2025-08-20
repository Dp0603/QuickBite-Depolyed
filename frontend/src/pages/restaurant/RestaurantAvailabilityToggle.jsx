// src/pages/restaurant/RestaurantAvailabilityToggle.jsx
import React, { useEffect, useState, useContext, useMemo } from "react";
import {
  FaClock,
  FaToggleOn,
  FaToggleOff,
  FaCalendarAlt,
  FaPlus,
  FaTrashAlt,
  FaSave,
  FaExclamationTriangle,
  FaSpinner,
} from "react-icons/fa";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";

/* ---------------------
   Helpers & Defaults
---------------------- */

const DAY_KEYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const defaultDay = () => ({
  open: true,
  slots: [{ start: "09:00", end: "22:00" }],
});

const defaultWeekly = () =>
  DAY_KEYS.reduce((acc, d) => ({ ...acc, [d]: defaultDay() }), {});

const defaultAvailability = {
  isOnline: true,
  autoAvailabilityEnabled: true, // auto open/close based on weekly schedule
  autoAcceptOrders: true,
  weekly: defaultWeekly(), // per-day schedule with multiple slots
  holidays: [], // recurring dates (YYYY-MM-DD)
  overrides: [], // one-time special dates: { date:"YYYY-MM-DD", open:bool, slots:[{start,end}] }
};

/* ---------------------
   Tiny Toast Component
---------------------- */

const Toast = ({ toasts, remove }) => (
  <div className="fixed z-[9999] top-4 right-4 space-y-2">
    {toasts.map((t) => (
      <div
        key={t.id}
        className={`px-4 py-3 rounded shadow text-white flex items-start gap-3 ${
          t.type === "error"
            ? "bg-red-600"
            : t.type === "warn"
            ? "bg-yellow-600"
            : "bg-green-600"
        }`}
      >
        <div className="pt-0.5">{t.icon}</div>
        <div className="flex-1">
          <div className="font-semibold">{t.title}</div>
          {t.message && <div className="text-sm opacity-90">{t.message}</div>}
        </div>
        <button
          onClick={() => remove(t.id)}
          className="opacity-80 hover:opacity-100"
        >
          ✕
        </button>
      </div>
    ))}
  </div>
);

/* ---------------------
   Simple Modal
---------------------- */

const Modal = ({
  open,
  title,
  children,
  onClose,
  onConfirm,
  confirmText = "Confirm",
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-900 text-gray-800 dark:text-white w-full max-w-lg rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold mb-2">{title}</h3>
        <div className="mb-6">{children}</div>
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 rounded border dark:border-gray-700"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded bg-primary text-white hover:bg-orange-600"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ---------------------
   Time Slot Row
---------------------- */

const TimeSlotRow = ({ slot, onChange, onRemove, disabled }) => {
  return (
    <div className="flex items-center gap-2">
      <input
        type="time"
        value={slot.start}
        disabled={disabled}
        onChange={(e) => onChange({ ...slot, start: e.target.value })}
        className="border rounded px-2 py-1 dark:bg-gray-800"
      />
      <span>-</span>
      <input
        type="time"
        value={slot.end}
        disabled={disabled}
        onChange={(e) => onChange({ ...slot, end: e.target.value })}
        className="border rounded px-2 py-1 dark:bg-gray-800"
      />
      <button
        type="button"
        disabled={disabled}
        onClick={onRemove}
        className="p-2 rounded hover:bg-red-50 dark:hover:bg-gray-800 text-red-600 disabled:opacity-50"
        title="Remove slot"
      >
        <FaTrashAlt />
      </button>
    </div>
  );
};

/* ---------------------
   Day Editor Row
---------------------- */

const DayRow = ({
  dayKey,
  data,
  onToggleDayOpen,
  onChangeSlot,
  onAddSlot,
  onRemoveSlot,
}) => {
  return (
    <div className="border rounded-lg p-3">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={data.open}
            onChange={(e) => onToggleDayOpen(dayKey, e.target.checked)}
          />
          <span className="capitalize font-medium">{dayKey}</span>
        </div>
        {!data.open && <span className="text-sm text-gray-500">Closed</span>}
      </div>

      {data.open && (
        <div className="space-y-2">
          {data.slots.map((slot, idx) => (
            <TimeSlotRow
              key={idx}
              slot={slot}
              onChange={(s) => onChangeSlot(dayKey, idx, s)}
              onRemove={() => onRemoveSlot(dayKey, idx)}
            />
          ))}
          <button
            type="button"
            onClick={() => onAddSlot(dayKey)}
            className="inline-flex items-center gap-2 px-3 py-1 rounded border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <FaPlus /> Add slot
          </button>
        </div>
      )}
    </div>
  );
};

/* ---------------------
   Main Component
---------------------- */

const RestaurantAvailabilityToggle = () => {
  const { user } = useContext(AuthContext);

  const [availability, setAvailability] = useState(defaultAvailability);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Local UI state
  const [pendingOffline, setPendingOffline] = useState(false);
  const [showOfflineModal, setShowOfflineModal] = useState(false);

  // Holidays & Overrides form bits
  const [newHoliday, setNewHoliday] = useState("");
  const [newOverrideDate, setNewOverrideDate] = useState("");
  const [newOverrideOpen, setNewOverrideOpen] = useState(true);
  const [newOverrideSlots, setNewOverrideSlots] = useState([
    { start: "09:00", end: "22:00" },
  ]);

  // Toast system
  const [toasts, setToasts] = useState([]);
  const pushToast = (payload) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, ...payload }]);
    setTimeout(() => removeToast(id), 4500);
  };
  const removeToast = (id) => setToasts((t) => t.filter((x) => x.id !== id));

  const validateSlots = (slots) => {
    // Ensure start < end and no overlaps
    const toMinutes = (t) => {
      const [h, m] = t.split(":").map(Number);
      return h * 60 + m;
    };
    const sorted = [...slots].sort(
      (a, b) => toMinutes(a.start) - toMinutes(b.start)
    );
    for (let i = 0; i < sorted.length; i++) {
      const s = sorted[i];
      if (toMinutes(s.start) >= toMinutes(s.end)) return false;
      if (i > 0) {
        const prev = sorted[i - 1];
        if (toMinutes(prev.end) > toMinutes(s.start)) return false;
      }
    }
    return true;
  };

  /* ---------------------
     Fetch Availability
  ---------------------- */
  const fetchAvailability = async () => {
    try {
      console.log("📡 Fetching availability...");

      // ✅ use API wrapper (no need for /api prefix, baseURL is already set)
      const response = await API.get("/restaurants/restaurants/availability/me");

      console.log("✅ API raw response:", response);

      // Expecting shape similar to defaultAvailability; fallback safely
      const data = response?.data?.data || {};
      console.log("📦 Parsed availability data:", data);

setAvailability({
  ...defaultAvailability,
  ...data,
  weeklyAvailability: Array.isArray(data.weeklyAvailability)
    ? data.weeklyAvailability
    : defaultWeekly(),  // fallback to defaults
  holidays: Array.isArray(data.holidays) ? data.holidays : [],
  overrides: Array.isArray(data.overrides) ? data.overrides : [],
});
    } catch (err) {
      console.error(
        "❌ Fetch availability error:",
        err.response?.data || err.message
      );

      pushToast({
        type: "error",
        title: "Failed to load availability",
        message: err?.response?.data?.message || "Please try again.",
        icon: <FaExclamationTriangle />,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "restaurant") fetchAvailability();
    else setLoading(false);
  }, [user]);

  /* ---------------------
     Save Availability
  ---------------------- */
  const saveAvailability = async () => {
    // Basic validation
    for (const day of DAY_KEYS) {
      const d = availability.weekly[day];
      if (d.open && !validateSlots(d.slots)) {
        pushToast({
          type: "error",
          title: `Invalid time slots on ${day}`,
          message: "Check ordering and overlaps; start must be before end.",
          icon: <FaExclamationTriangle />,
        });
        return;
      }
    }
    for (const ov of availability.overrides) {
      if (ov.open && !validateSlots(ov.slots || [])) {
        pushToast({
          type: "error",
          title: `Invalid override slots for ${ov.date}`,
          message: "Check ordering and overlaps.",
          icon: <FaExclamationTriangle />,
        });
        return;
      }
    }

    setSaving(true);
    try {
      await API.put("/restaurants/restaurants/availability", availability);
      pushToast({
        type: "success",
        title: "Availability saved",
        icon: <FaSave />,
      });
    } catch (err) {
      pushToast({
        type: "error",
        title: "Failed to save",
        message: err?.response?.data?.message || "Please try again.",
        icon: <FaExclamationTriangle />,
      });
    } finally {
      setSaving(false);
    }
  };

  /* ---------------------
     Online/Offline Toggle
  ---------------------- */
  const toggleOnline = () => {
    if (availability.isOnline) {
      // going offline → confirm
      setPendingOffline(true);
      setShowOfflineModal(true);
    } else {
      setAvailability((prev) => ({ ...prev, isOnline: true }));
      pushToast({
        type: "success",
        title: "You are now Online",
        icon: <FaToggleOn />,
      });
    }
  };

  const confirmGoOffline = () => {
    setAvailability((prev) => ({ ...prev, isOnline: false }));
    setShowOfflineModal(false);
    setPendingOffline(false);
    pushToast({
      type: "warn",
      title: "You are now Offline",
      message: "Pending orders must still be fulfilled.",
      icon: <FaToggleOff />,
    });
  };

  /* ---------------------
     Weekly Handlers
  ---------------------- */
  const toggleDayOpen = (day, open) => {
    setAvailability((prev) => ({
      ...prev,
      weekly: {
        ...prev.weekly,
        [day]: { ...prev.weekly[day], open },
      },
    }));
  };
  const changeDaySlot = (day, idx, slot) => {
    setAvailability((prev) => {
      const slots = [...prev.weekly[day].slots];
      slots[idx] = slot;
      return {
        ...prev,
        weekly: { ...prev.weekly, [day]: { ...prev.weekly[day], slots } },
      };
    });
  };
  const addDaySlot = (day) => {
    setAvailability((prev) => {
      const slots = [
        ...prev.weekly[day].slots,
        { start: "12:00", end: "15:00" },
      ];
      return {
        ...prev,
        weekly: { ...prev.weekly, [day]: { ...prev.weekly[day], slots } },
      };
    });
  };
  const removeDaySlot = (day, idx) => {
    setAvailability((prev) => {
      const slots = prev.weekly[day].slots.filter((_, i) => i !== idx);
      return {
        ...prev,
        weekly: { ...prev.weekly, [day]: { ...prev.weekly[day], slots } },
      };
    });
  };

  /* ---------------------
     Holidays (recurring)
  ---------------------- */
  const addHoliday = () => {
    if (!newHoliday) return;
    if (availability.holidays.includes(newHoliday)) {
      pushToast({
        type: "warn",
        title: "Holiday already added",
        icon: <FaExclamationTriangle />,
      });
      return;
    }
    setAvailability((prev) => ({
      ...prev,
      holidays: [...prev.holidays, newHoliday],
    }));
    setNewHoliday("");
  };
  const removeHoliday = (date) => {
    setAvailability((prev) => ({
      ...prev,
      holidays: prev.holidays.filter((d) => d !== date),
    }));
  };

  /* ---------------------
     Overrides (one-time)
  ---------------------- */
  const addOverrideSlot = () => {
    setNewOverrideSlots((s) => [...s, { start: "12:00", end: "15:00" }]);
  };
  const changeOverrideSlot = (idx, slot) => {
    setNewOverrideSlots((s) => s.map((x, i) => (i === idx ? slot : x)));
  };
  const removeOverrideSlot = (idx) => {
    setNewOverrideSlots((s) => s.filter((_, i) => i !== idx));
  };
  const addOverride = () => {
    if (!newOverrideDate) return;
    if (availability.overrides.some((o) => o.date === newOverrideDate)) {
      pushToast({
        type: "warn",
        title: "Override for that date already exists",
        icon: <FaExclamationTriangle />,
      });
      return;
    }
    if (newOverrideOpen && !validateSlots(newOverrideSlots)) {
      pushToast({
        type: "error",
        title: "Invalid override slots",
        icon: <FaExclamationTriangle />,
      });
      return;
    }
    const entry = {
      date: newOverrideDate,
      open: newOverrideOpen,
      slots: newOverrideOpen ? newOverrideSlots : [],
    };
    setAvailability((prev) => ({
      ...prev,
      overrides: [...prev.overrides, entry],
    }));
    setNewOverrideDate("");
    setNewOverrideOpen(true);
    setNewOverrideSlots([{ start: "09:00", end: "22:00" }]);
  };
  const removeOverride = (date) => {
    setAvailability((prev) => ({
      ...prev,
      overrides: prev.overrides.filter((o) => o.date !== date),
    }));
  };

  /* ---------------------
     Derived Preview
  ---------------------- */
  const weeklySummary = useMemo(() => {
    return DAY_KEYS.map((d) => {
      const day = availability.weekly[d];
      if (!day.open) return { day: d, label: "Closed" };
      return {
        day: d,
        label: day.slots.map((s) => `${s.start}–${s.end}`).join(", "),
      };
    });
  }, [availability.weekly]);

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-600 dark:text-gray-300">
        <FaSpinner className="inline animate-spin mr-2" />
        Loading availability...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 p-6 rounded-xl shadow text-gray-800 dark:text-white">
      <Toast toasts={toasts} remove={removeToast} />

      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <FaClock className="text-orange-500" />
        Restaurant Availability
      </h2>

      {/* Online Toggle */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="font-medium">Restaurant is currently:</span>
          <span
            className={`px-2 py-1 rounded text-white text-sm ${
              availability.isOnline ? "bg-green-600" : "bg-red-600"
            }`}
          >
            {availability.isOnline ? "Online" : "Offline"}
          </span>
        </div>
        <button
          onClick={toggleOnline}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white ${
            availability.isOnline ? "bg-red-500" : "bg-green-600"
          }`}
        >
          {availability.isOnline ? <FaToggleOff /> : <FaToggleOn />}
          {availability.isOnline ? "Go Offline" : "Go Online"}
        </button>
      </div>

      {/* Auto Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <label className="flex items-center gap-3 border rounded-lg p-3">
          <input
            type="checkbox"
            checked={availability.autoAvailabilityEnabled}
            onChange={(e) =>
              setAvailability((p) => ({
                ...p,
                autoAvailabilityEnabled: e.target.checked,
              }))
            }
          />
          <span>Auto open/close by weekly schedule</span>
        </label>
        <label className="flex items-center gap-3 border rounded-lg p-3">
          <input
            type="checkbox"
            checked={availability.autoAcceptOrders}
            onChange={(e) =>
              setAvailability((p) => ({
                ...p,
                autoAcceptOrders: e.target.checked,
              }))
            }
          />
          <span>Auto-accept orders</span>
        </label>
      </div>

      {/* Weekly Schedule */}
      <div className="mb-8">
        <h3 className="font-semibold text-lg mb-3">Weekly Schedule</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DAY_KEYS.map((day) => (
            <DayRow
              key={day}
              dayKey={day}
              data={availability.weekly[day]}
              onToggleDayOpen={toggleDayOpen}
              onChangeSlot={changeDaySlot}
              onAddSlot={addDaySlot}
              onRemoveSlot={removeDaySlot}
            />
          ))}
        </div>

        {/* Preview */}
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
          <div className="font-medium mb-1">Preview:</div>
          <ul className="list-disc ml-5 space-y-1">
            {weeklySummary.map((w) => (
              <li key={w.day} className="capitalize">
                {w.day}: {w.label}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Holidays (recurring) */}
      <div className="mb-8">
        <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
          <FaCalendarAlt />
          Holidays (recurring)
        </h3>
        <div className="flex items-center gap-3 mb-3">
          <input
            type="date"
            value={newHoliday}
            onChange={(e) => setNewHoliday(e.target.value)}
            className="input-style border rounded px-3 py-2 dark:bg-gray-800"
          />
          <button
            type="button"
            onClick={addHoliday}
            className="px-3 py-2 bg-primary text-white rounded hover:bg-orange-600 inline-flex items-center gap-2"
          >
            <FaPlus /> Add
          </button>
        </div>

        {availability.holidays.length === 0 ? (
          <p className="text-sm text-gray-500">No holidays added.</p>
        ) : (
          <ul className="text-sm space-y-2">
            {availability.holidays.map((date) => (
              <li
                key={date}
                className="flex justify-between items-center border rounded p-2"
              >
                <span>{new Date(date).toLocaleDateString()}</span>
                <button
                  onClick={() => removeHoliday(date)}
                  className="text-red-600 hover:underline text-xs flex items-center gap-1"
                >
                  <FaTrashAlt /> Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Overrides (one-time special dates) */}
      <div className="mb-8">
        <h3 className="font-semibold text-lg mb-3">
          Special Date Overrides (one-time)
        </h3>

        <div className="border rounded-lg p-3 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <label className="flex flex-col">
              <span className="text-sm mb-1">Date</span>
              <input
                type="date"
                value={newOverrideDate}
                onChange={(e) => setNewOverrideDate(e.target.value)}
                className="border rounded px-3 py-2 dark:bg-gray-800"
              />
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={newOverrideOpen}
                onChange={(e) => setNewOverrideOpen(e.target.checked)}
              />
              <span>Open on this date</span>
            </label>
          </div>

          {newOverrideOpen && (
            <div className="space-y-2">
              {newOverrideSlots.map((slot, i) => (
                <TimeSlotRow
                  key={i}
                  slot={slot}
                  onChange={(s) => changeOverrideSlot(i, s)}
                  onRemove={() => removeOverrideSlot(i)}
                />
              ))}
              <button
                type="button"
                onClick={addOverrideSlot}
                className="inline-flex items-center gap-2 px-3 py-1 rounded border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <FaPlus /> Add slot
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={addOverride}
            className="px-3 py-2 bg-primary text-white rounded hover:bg-orange-600 inline-flex items-center gap-2"
          >
            <FaPlus /> Add Override
          </button>
        </div>

        {/* Existing overrides */}
        <div className="mt-3 space-y-2">
          {availability.overrides.length === 0 ? (
            <p className="text-sm text-gray-500">No overrides added.</p>
          ) : (
            availability.overrides.map((ov) => (
              <div
                key={ov.date}
                className="border rounded p-3 flex items-center justify-between"
              >
                <div>
                  <div className="font-medium">
                    {new Date(ov.date).toLocaleDateString()} —{" "}
                    {ov.open ? "Open" : "Closed"}
                  </div>
                  {ov.open && ov.slots?.length > 0 && (
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {ov.slots.map((s, i) => (
                        <span key={i} className="mr-2">
                          {s.start}–{s.end}
                          {i < ov.slots.length - 1 ? "," : ""}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => removeOverride(ov.date)}
                  className="text-red-600 hover:underline text-xs flex items-center gap-1"
                >
                  <FaTrashAlt /> Remove
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Save */}
      <div className="text-center">
        <button
          disabled={saving}
          onClick={saveAvailability}
          className="bg-primary text-white px-6 py-2 rounded hover:bg-orange-600 transition inline-flex items-center gap-2 disabled:opacity-60"
        >
          {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>

      {/* Offline confirm modal */}
      <Modal
        open={showOfflineModal}
        title="Go Offline?"
        onClose={() => {
          setShowOfflineModal(false);
          setPendingOffline(false);
        }}
        onConfirm={confirmGoOffline}
        confirmText="Yes, go offline"
      >
        <div className="flex items-start gap-3">
          <FaExclamationTriangle className="text-yellow-500 mt-1" />
          <div className="text-sm">
            Going offline will stop new orders. <br />
            <span className="font-medium">
              Pending orders must still be fulfilled.
            </span>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RestaurantAvailabilityToggle;
