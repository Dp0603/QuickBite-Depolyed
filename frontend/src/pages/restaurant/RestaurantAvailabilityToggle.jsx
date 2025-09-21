// src/pages/restaurant/RestaurantAvailabilityToggle.jsx
import React, {
  useEffect,
  useState,
  useContext,
  useMemo,
  useCallback,
} from "react";
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
  autoAvailabilityEnabled: true,
  autoAcceptOrders: true,
  weekly: defaultWeekly(),
  holidays: [],
  overrides: [],
};

/* --------------------- Toast --------------------- */
const Toast = ({ toasts, remove }) => (
  <div className="fixed z-[9999] top-6 right-6 flex flex-col gap-3">
    {toasts.map((t) => (
      <div
        key={t.id}
        className={`flex items-start gap-3 p-4 rounded-xl shadow-lg text-white transition transform hover:scale-[1.02] ${
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
          {t.message && (
            <div className="text-sm opacity-90 mt-0.5">{t.message}</div>
          )}
        </div>
        <button
          onClick={() => remove(t.id)}
          className="opacity-80 hover:opacity-100 font-bold"
        >
          ✕
        </button>
      </div>
    ))}
  </div>
);

/* --------------------- Modal --------------------- */
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
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-gray-900 text-gray-800 dark:text-white w-full max-w-lg rounded-2xl shadow-2xl p-6">
        <h3 className="text-xl font-bold mb-4">{title}</h3>
        <div className="mb-6">{children}</div>
        <div className="flex justify-end gap-4">
          <button
            className="px-5 py-2 rounded-lg border dark:border-gray-700 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-5 py-2 rounded-lg bg-primary text-white font-medium hover:bg-orange-600 transition"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

/* --------------------- TimeSlotRow --------------------- */
const TimeSlotRow = React.memo(
  ({ slot, onChange, onRemove, disabled, invalid }) => (
    <div className="flex items-center gap-3">
      <input
        type="time"
        value={slot.start}
        disabled={disabled}
        onChange={(e) => onChange({ ...slot, start: e.target.value })}
        className={`border rounded-lg px-3 py-1 dark:bg-gray-800 shadow-sm ${
          invalid ? "border-red-500" : "border-gray-300 dark:border-gray-700"
        } focus:ring-2 focus:ring-orange-400`}
      />
      <span className="font-medium">–</span>
      <input
        type="time"
        value={slot.end}
        disabled={disabled}
        onChange={(e) => onChange({ ...slot, end: e.target.value })}
        className={`border rounded-lg px-3 py-1 dark:bg-gray-800 shadow-sm ${
          invalid ? "border-red-500" : "border-gray-300 dark:border-gray-700"
        } focus:ring-2 focus:ring-orange-400`}
      />
      <button
        type="button"
        disabled={disabled}
        onClick={onRemove}
        className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-gray-800 text-red-600 transition shadow-sm"
        title="Remove slot"
      >
        <FaTrashAlt />
      </button>
    </div>
  )
);

/* --------------------- DayRow --------------------- */
const DayRow = React.memo(
  ({
    dayKey,
    data,
    onToggleDayOpen,
    onChangeSlot,
    onAddSlot,
    onRemoveSlot,
    slotErrors,
  }) => (
    <div className="border rounded-2xl p-4 shadow-sm hover:shadow-md transition bg-white dark:bg-gray-800">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={data.open}
            onChange={(e) => onToggleDayOpen(dayKey, e.target.checked)}
            className="w-5 h-5 accent-orange-500"
          />
          <span className="capitalize font-semibold text-gray-700 dark:text-gray-200">
            {dayKey}
          </span>
        </div>
        {!data.open && (
          <span className="text-sm text-gray-400 dark:text-gray-300">
            Closed
          </span>
        )}
      </div>
      {data.open && (
        <div className="space-y-3">
          {data.slots.map((slot, idx) => (
            <TimeSlotRow
              key={idx}
              slot={slot}
              onChange={(s) => onChangeSlot(dayKey, idx, s)}
              onRemove={() => onRemoveSlot(dayKey, idx)}
              invalid={slotErrors?.[idx]}
            />
          ))}
          <button
            type="button"
            onClick={() => onAddSlot(dayKey)}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 hover:bg-orange-50 dark:hover:bg-orange-600 transition shadow-sm"
          >
            <FaPlus className="text-orange-500" /> Add slot
          </button>
        </div>
      )}
    </div>
  )
);

/* --------------------- Main Component --------------------- */
const RestaurantAvailabilityToggle = () => {
  const { user } = useContext(AuthContext);
  const [availability, setAvailability] = useState(defaultAvailability);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showOfflineModal, setShowOfflineModal] = useState(false);
  const [toasts, setToasts] = useState([]);

  const [newHoliday, setNewHoliday] = useState("");
  const [newOverrideDate, setNewOverrideDate] = useState("");
  const [newOverrideOpen, setNewOverrideOpen] = useState(true);
  const [newOverrideSlots, setNewOverrideSlots] = useState([
    { start: "09:00", end: "22:00" },
  ]);
  const [slotErrors, setSlotErrors] = useState({}); // per-day validation

  /* --------------------- Toast --------------------- */
  const pushToast = useCallback((payload) => {
    const id = `${Date.now()}_${Math.random().toString(36).slice(2)}`;
    setToasts((t) => [...t, { id, ...payload }]);
    setTimeout(() => removeToast(id), 4500);
  }, []);
  const removeToast = useCallback(
    (id) => setToasts((t) => t.filter((x) => x.id !== id)),
    []
  );

  /* --------------------- Validation --------------------- */
  const validateSlots = useCallback((slots) => {
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
      if (i > 0 && toMinutes(sorted[i - 1].end) > toMinutes(s.start))
        return false;
    }
    return true;
  }, []);

  /* --------------------- Fetch --------------------- */
  const fetchAvailability = useCallback(async () => {
    try {
      const response = await API.get(
        "/restaurants/restaurants/availability/me"
      );
      const data = response?.data?.data || {};
      setAvailability({
        ...defaultAvailability,
        ...data,
        weekly:
          data.weekly && typeof data.weekly === "object"
            ? data.weekly
            : defaultWeekly(),
        holidays: Array.isArray(data.holidays) ? data.holidays : [],
        overrides: Array.isArray(data.overrides) ? data.overrides : [],
      });
    } catch (err) {
      pushToast({
        type: "error",
        title: "Failed to load availability",
        message: err?.response?.data?.message || "Please try again.",
        icon: <FaExclamationTriangle />,
      });
    } finally {
      setLoading(false);
    }
  }, [pushToast]);

  useEffect(() => {
    if (user?.role === "restaurant") fetchAvailability();
    else setLoading(false);
  }, [user, fetchAvailability]);

  /* --------------------- Save --------------------- */
  const saveAvailability = async () => {
    const errors = {};
    let hasError = false;
    for (const day of DAY_KEYS) {
      const d = availability.weekly[day];
      if (d.open && !validateSlots(d.slots)) {
        errors[day] = d.slots.map(() => true);
        hasError = true;
        pushToast({
          type: "error",
          title: `Invalid slots on ${day}`,
          icon: <FaExclamationTriangle />,
        });
      }
    }
    setSlotErrors(errors);
    if (hasError) return;

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

  /* --------------------- Online/Offline --------------------- */
  const toggleOnline = () => {
    if (availability.isOnline) setShowOfflineModal(true);
    else {
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
    pushToast({
      type: "warn",
      title: "You are now Offline",
      message: "Pending orders must still be fulfilled.",
      icon: <FaToggleOff />,
    });
  };

  /* --------------------- Weekly Handlers --------------------- */
  const toggleDayOpen = useCallback((day, open) => {
    setAvailability((prev) => ({
      ...prev,
      weekly: { ...prev.weekly, [day]: { ...prev.weekly[day], open } },
    }));
  }, []);
  const changeDaySlot = useCallback((day, idx, slot) => {
    setAvailability((prev) => {
      const slots = [...prev.weekly[day].slots];
      slots[idx] = slot;
      return {
        ...prev,
        weekly: { ...prev.weekly, [day]: { ...prev.weekly[day], slots } },
      };
    });
  }, []);
  const addDaySlot = useCallback((day) => {
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
  }, []);
  const removeDaySlot = useCallback((day, idx) => {
    setAvailability((prev) => {
      const slots = prev.weekly[day].slots.filter((_, i) => i !== idx);
      return {
        ...prev,
        weekly: { ...prev.weekly, [day]: { ...prev.weekly[day], slots } },
      };
    });
  }, []);

  /* --------------------- Weekly Summary --------------------- */
  const weeklySummary = useMemo(
    () =>
      DAY_KEYS.map((d) => {
        const day = availability.weekly[d];
        if (!day.open) return { day: d, label: "Closed" };
        return {
          day: d,
          label: day.slots.map((s) => `${s.start}–${s.end}`).join(", "),
        };
      }),
    [availability.weekly]
  );

  if (loading)
    return (
      <div className="text-center py-10 text-gray-500 dark:text-gray-300 text-lg">
        <FaSpinner className="inline animate-spin mr-2" />
        Loading availability...
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto bg-gray-50 dark:bg-gray-900 p-8 rounded-3xl shadow-2xl text-gray-800 dark:text-white space-y-10">
      <Toast toasts={toasts} remove={removeToast} />
      <h2 className="text-3xl font-bold flex items-center gap-3">
        <FaClock className="text-orange-500" />
        Restaurant Availability
      </h2>

      {/* Online Toggle */}
      <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-2xl p-4 shadow hover:shadow-lg transition">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-gray-700 dark:text-gray-300">
            Restaurant is currently:
          </span>
          <span
            className={`px-3 py-1 rounded-full text-white font-medium ${
              availability.isOnline ? "bg-green-600" : "bg-red-600"
            }`}
          >
            {availability.isOnline ? "Online" : "Offline"}
          </span>
        </div>
        <button
          onClick={toggleOnline}
          className={`flex items-center gap-2 px-5 py-2 rounded-2xl text-white font-medium transition shadow hover:scale-105 ${
            availability.isOnline
              ? "bg-red-500 hover:bg-red-600"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {availability.isOnline ? <FaToggleOff /> : <FaToggleOn />}{" "}
          {availability.isOnline ? "Go Offline" : "Go Online"}
        </button>
      </div>

      {/* Auto Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <label className="flex items-center gap-3 border rounded-2xl p-4 bg-white dark:bg-gray-800 shadow hover:shadow-md transition">
          <input
            type="checkbox"
            checked={availability.autoAvailabilityEnabled}
            onChange={(e) =>
              setAvailability((p) => ({
                ...p,
                autoAvailabilityEnabled: e.target.checked,
              }))
            }
            className="w-5 h-5 accent-orange-500"
          />
          <span className="font-medium">
            Auto open/close by weekly schedule
          </span>
        </label>
        <label className="flex items-center gap-3 border rounded-2xl p-4 bg-white dark:bg-gray-800 shadow hover:shadow-md transition">
          <input
            type="checkbox"
            checked={availability.autoAcceptOrders}
            onChange={(e) =>
              setAvailability((p) => ({
                ...p,
                autoAcceptOrders: e.target.checked,
              }))
            }
            className="w-5 h-5 accent-orange-500"
          />
          <span className="font-medium">Auto-accept orders</span>
        </label>
      </div>

      {/* Weekly Schedule */}
      <div className="space-y-6">
        <h3 className="font-bold text-xl">Weekly Schedule</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {DAY_KEYS.map((day) => (
            <DayRow
              key={day}
              dayKey={day}
              data={availability.weekly[day]}
              onToggleDayOpen={toggleDayOpen}
              onChangeSlot={changeDaySlot}
              onAddSlot={addDaySlot}
              onRemoveSlot={removeDaySlot}
              slotErrors={slotErrors[day]}
            />
          ))}
        </div>
        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
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

      {/* Holidays & Overrides would follow same card-style */}
      {/* Save Button */}
      <div className="text-center">
        <button
          disabled={saving}
          onClick={saveAvailability}
          className="bg-primary text-white px-8 py-3 rounded-2xl hover:bg-orange-600 transition shadow-lg inline-flex items-center gap-3 disabled:opacity-50"
        >
          {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}{" "}
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>

      <Modal
        open={showOfflineModal}
        title="Go Offline?"
        onClose={() => setShowOfflineModal(false)}
        onConfirm={confirmGoOffline}
        confirmText="Yes, go offline"
      >
        <div className="flex items-start gap-3">
          <FaExclamationTriangle className="text-yellow-500 mt-1" />
          <div className="text-sm">
            Going offline will stop new orders.
            <br />
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
