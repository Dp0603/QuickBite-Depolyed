import React, {
  useEffect,
  useState,
  useContext,
  useMemo,
  useCallback,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  FaCheckCircle,
  FaTimesCircle,
  FaCalendarDay,
  FaCalendarCheck,
  FaBell,
  FaRobot,
  FaStore,
  FaStoreSlash,
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

const DAY_INFO = {
  monday: { emoji: "📅", color: "from-blue-500 to-cyan-600" },
  tuesday: { emoji: "📅", color: "from-indigo-500 to-purple-600" },
  wednesday: { emoji: "📅", color: "from-teal-500 to-emerald-600" },
  thursday: { emoji: "📅", color: "from-orange-500 to-red-600" },
  friday: { emoji: "🎉", color: "from-pink-500 to-rose-600" },
  saturday: { emoji: "🎉", color: "from-purple-500 to-pink-600" },
  sunday: { emoji: "🎉", color: "from-amber-500 to-orange-600" },
};

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

/* --------------------- Toast Component --------------------- */
const Toast = ({ toasts, remove }) => (
  <div className="fixed z-[9999] top-24 right-6 flex flex-col gap-3 max-w-md">
    <AnimatePresence>
      {toasts.map((t) => (
        <motion.div
          key={t.id}
          initial={{ opacity: 0, x: 100, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 100, scale: 0.8 }}
          className={`flex items-start gap-3 p-4 rounded-xl shadow-2xl text-white backdrop-blur-md border ${
            t.type === "error"
              ? "bg-red-500/95 border-red-400"
              : t.type === "warn"
              ? "bg-amber-500/95 border-amber-400"
              : "bg-emerald-500/95 border-emerald-400"
          }`}
        >
          <div className="pt-0.5 text-xl">{t.icon}</div>
          <div className="flex-1">
            <div className="font-bold text-sm">{t.title}</div>
            {t.message && (
              <div className="text-xs opacity-90 mt-1">{t.message}</div>
            )}
          </div>
          <motion.button
            onClick={() => remove(t.id)}
            className="opacity-80 hover:opacity-100 font-bold text-lg"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            ✕
          </motion.button>
        </motion.div>
      ))}
    </AnimatePresence>
  </div>
);

/* --------------------- Modal Component --------------------- */
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
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="relative bg-white dark:bg-slate-900 text-gray-800 dark:text-white w-full max-w-lg rounded-2xl shadow-2xl border-2 border-gray-200 dark:border-slate-700 overflow-hidden"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
          >
            <div className="p-6">
              <h3 className="text-2xl font-black mb-4 flex items-center gap-2">
                <FaExclamationTriangle className="text-amber-500" />
                {title}
              </h3>
              <div className="mb-6">{children}</div>
              <div className="flex justify-end gap-3">
                <motion.button
                  className="px-6 py-3 rounded-xl border-2 border-gray-300 dark:border-slate-700 font-bold hover:bg-gray-50 dark:hover:bg-slate-800 transition-all"
                  onClick={onClose}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold shadow-lg hover:shadow-xl transition-all"
                  onClick={onConfirm}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {confirmText}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

/* --------------------- TimeSlotRow Component --------------------- */
const TimeSlotRow = React.memo(
  ({ slot, onChange, onRemove, disabled, invalid, index }) => (
    <motion.div
      className="flex items-center gap-3"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <div className="flex-1">
        <label className="text-xs text-gray-600 font-semibold mb-1 block">
          Start
        </label>
        <input
          type="time"
          value={slot.start}
          disabled={disabled}
          onChange={(e) => onChange({ ...slot, start: e.target.value })}
          className={`w-full px-3 py-2 rounded-lg border-2 ${
            invalid
              ? "border-red-300 focus:border-red-500"
              : "border-gray-200 focus:border-indigo-400"
          } focus:outline-none transition-all font-medium disabled:bg-gray-100 disabled:cursor-not-allowed`}
        />
      </div>
      <div className="self-end pb-2">
        <span className="text-gray-400 font-bold text-xl">→</span>
      </div>
      <div className="flex-1">
        <label className="text-xs text-gray-600 font-semibold mb-1 block">
          End
        </label>
        <input
          type="time"
          value={slot.end}
          disabled={disabled}
          onChange={(e) => onChange({ ...slot, end: e.target.value })}
          className={`w-full px-3 py-2 rounded-lg border-2 ${
            invalid
              ? "border-red-300 focus:border-red-500"
              : "border-gray-200 focus:border-indigo-400"
          } focus:outline-none transition-all font-medium disabled:bg-gray-100 disabled:cursor-not-allowed`}
        />
      </div>
      <motion.button
        type="button"
        disabled={disabled}
        onClick={onRemove}
        className="self-end mb-2 p-2.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        title="Remove slot"
        whileHover={{ scale: disabled ? 1 : 1.1 }}
        whileTap={{ scale: disabled ? 1 : 0.9 }}
      >
        <FaTrashAlt />
      </motion.button>
    </motion.div>
  )
);

/* --------------------- DayRow Component --------------------- */
const DayRow = React.memo(
  ({
    dayKey,
    data,
    onToggleDayOpen,
    onChangeSlot,
    onAddSlot,
    onRemoveSlot,
    slotErrors,
    index,
  }) => {
    const dayInfo = DAY_INFO[dayKey];
    const isOpen = data.open;

    return (
      <motion.div
        className={`rounded-2xl overflow-hidden shadow-lg border-2 transition-all ${
          isOpen
            ? "border-emerald-200 bg-white"
            : "border-gray-200 bg-gray-50 opacity-60"
        }`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        whileHover={{ scale: 1.01, y: -2 }}
      >
        <div
          className={`p-4 bg-gradient-to-r ${
            isOpen ? dayInfo.color : "from-gray-300 to-gray-400"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.button
                type="button"
                onClick={() => onToggleDayOpen(dayKey, !isOpen)}
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all shadow-md ${
                  isOpen
                    ? "bg-white/20 backdrop-blur-sm border border-white/30"
                    : "bg-gray-600"
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {isOpen ? (
                  <FaCheckCircle className="text-white text-xl" />
                ) : (
                  <FaTimesCircle className="text-white text-xl" />
                )}
              </motion.button>
              <div>
                <div className="flex items-center gap-2 text-white">
                  <span className="text-2xl">{dayInfo.emoji}</span>
                  <span className="capitalize font-black text-lg">
                    {dayKey}
                  </span>
                </div>
                <p className="text-xs text-white/80 font-medium">
                  {isOpen
                    ? `${data.slots.length} time slot(s)`
                    : "Closed all day"}
                </p>
              </div>
            </div>
            {isOpen && (
              <div className="px-3 py-1.5 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs font-bold">
                Open
              </div>
            )}
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="p-5 space-y-4"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              {data.slots.map((slot, idx) => (
                <TimeSlotRow
                  key={idx}
                  index={idx}
                  slot={slot}
                  onChange={(s) => onChangeSlot(dayKey, idx, s)}
                  onRemove={() => onRemoveSlot(dayKey, idx)}
                  invalid={slotErrors?.[idx]}
                />
              ))}
              <motion.button
                type="button"
                onClick={() => onAddSlot(dayKey)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-gray-300 hover:border-indigo-400 hover:bg-indigo-50 transition-all font-bold text-gray-600 hover:text-indigo-700"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaPlus className="text-indigo-500" /> Add Time Slot
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }
);

/* --------------------- Main Component --------------------- */
const RestaurantAvailabilityToggle = () => {
  const { user } = useContext(AuthContext);
  const [availability, setAvailability] = useState(defaultAvailability);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showOfflineModal, setShowOfflineModal] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [slotErrors, setSlotErrors] = useState({});

  /* --------------------- Toast Handlers --------------------- */
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

  /* --------------------- Fetch Availability --------------------- */
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

  /* --------------------- Save Availability --------------------- */
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
          title: `Invalid time slots on ${day}`,
          message: "Check for overlapping or invalid times",
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
        title: "Availability saved successfully!",
        icon: <FaSave />,
      });
    } catch (err) {
      pushToast({
        type: "error",
        title: "Failed to save availability",
        message: err?.response?.data?.message || "Please try again.",
        icon: <FaExclamationTriangle />,
      });
    } finally {
      setSaving(false);
    }
  };

  /* --------------------- Online/Offline Toggle --------------------- */
  const toggleOnline = () => {
    if (availability.isOnline) {
      setShowOfflineModal(true);
    } else {
      setAvailability((prev) => ({ ...prev, isOnline: true }));
      pushToast({
        type: "success",
        title: "You are now Online!",
        message: "Ready to accept new orders",
        icon: <FaStore />,
      });
    }
  };

  const confirmGoOffline = () => {
    setAvailability((prev) => ({ ...prev, isOnline: false }));
    setShowOfflineModal(false);
    pushToast({
      type: "warn",
      title: "You are now Offline",
      message: "New orders are paused. Fulfill pending orders.",
      icon: <FaStoreSlash />,
    });
  };

  /* --------------------- Weekly Schedule Handlers --------------------- */
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
  const weeklySummary = useMemo(() => {
    const openDays = DAY_KEYS.filter((d) => availability.weekly[d].open).length;
    const closedDays = DAY_KEYS.length - openDays;
    const totalSlots = DAY_KEYS.reduce(
      (sum, d) =>
        sum +
        (availability.weekly[d].open ? availability.weekly[d].slots.length : 0),
      0
    );
    return { openDays, closedDays, totalSlots };
  }, [availability.weekly]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.div
            className="relative w-24 h-24 mx-auto mb-6"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute inset-0 border-4 border-rose-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-rose-600 border-t-transparent rounded-full"></div>
          </motion.div>
          <motion.p
            className="text-gray-700 text-lg font-bold"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Loading availability settings...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      <Toast toasts={toasts} remove={removeToast} />

      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-8 py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Premium Header */}
        <motion.div
          className="relative overflow-hidden rounded-3xl mb-8 shadow-2xl border border-rose-200"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600"></div>
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          />

          <motion.div
            className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], x: [0, 20, 0] }}
            transition={{ duration: 8, repeat: Infinity }}
          />

          <div className="relative z-10 p-8 md:p-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <motion.div
                    className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-3xl"
                    animate={{ rotate: [0, 360] }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    ⏰
                  </motion.div>
                  <div>
                    <h1 className="text-4xl font-black text-white drop-shadow-lg">
                      Availability Settings
                    </h1>
                    <p className="text-white/90 text-sm font-medium mt-1">
                      Manage your restaurant's operating hours
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Online/Offline Toggle */}
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <motion.button
                  onClick={toggleOnline}
                  className={`px-8 py-4 rounded-xl backdrop-blur-xl shadow-2xl font-black text-lg border-2 transition-all flex items-center gap-3 ${
                    availability.isOnline
                      ? "bg-emerald-500/95 border-emerald-300 text-white hover:bg-emerald-600"
                      : "bg-red-500/95 border-red-300 text-white hover:bg-red-600"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {availability.isOnline ? (
                    <>
                      <FaStore className="text-2xl" />
                      <div className="text-left">
                        <div className="text-sm font-semibold">Currently</div>
                        <div>ONLINE</div>
                      </div>
                      <FaToggleOn className="text-3xl" />
                    </>
                  ) : (
                    <>
                      <FaStoreSlash className="text-2xl" />
                      <div className="text-left">
                        <div className="text-sm font-semibold">Currently</div>
                        <div>OFFLINE</div>
                      </div>
                      <FaToggleOff className="text-3xl" />
                    </>
                  )}
                </motion.button>
              </motion.div>
            </div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-3 gap-4 mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <StatCard
                icon={<FaCalendarCheck />}
                value={weeklySummary.openDays}
                label="Days Open"
                gradient="from-emerald-500 to-teal-600"
              />
              <StatCard
                icon={<FaCalendarDay />}
                value={weeklySummary.closedDays}
                label="Days Closed"
                gradient="from-red-500 to-rose-600"
              />
              <StatCard
                icon={<FaClock />}
                value={weeklySummary.totalSlots}
                label="Total Time Slots"
                gradient="from-indigo-500 to-purple-600"
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Auto Settings */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <SettingCard
            icon={<FaRobot />}
            title="Auto Availability"
            description="Automatically open/close based on weekly schedule"
            checked={availability.autoAvailabilityEnabled}
            onChange={(checked) =>
              setAvailability((p) => ({
                ...p,
                autoAvailabilityEnabled: checked,
              }))
            }
            gradient="from-teal-500 to-emerald-600"
          />
          <SettingCard
            icon={<FaBell />}
            title="Auto Accept Orders"
            description="Automatically accept incoming orders"
            checked={availability.autoAcceptOrders}
            onChange={(checked) =>
              setAvailability((p) => ({
                ...p,
                autoAcceptOrders: checked,
              }))
            }
            gradient="from-amber-500 to-orange-600"
          />
        </motion.div>

        {/* Weekly Schedule */}
        <motion.div
          className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="p-6 bg-gradient-to-r from-rose-500 to-pink-600 text-white">
            <h3 className="font-black text-2xl flex items-center gap-2">
              <FaCalendarAlt />
              Weekly Schedule
            </h3>
            <p className="text-white/80 text-sm mt-1">
              Set your operating hours for each day of the week
            </p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {DAY_KEYS.map((day, index) => (
                <DayRow
                  key={day}
                  dayKey={day}
                  index={index}
                  data={availability.weekly[day]}
                  onToggleDayOpen={toggleDayOpen}
                  onChangeSlot={changeDaySlot}
                  onAddSlot={addDaySlot}
                  onRemoveSlot={removeDaySlot}
                  slotErrors={slotErrors[day]}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Save Button */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <motion.button
            disabled={saving}
            onClick={saveAvailability}
            className="px-12 py-5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-black text-xl shadow-2xl hover:shadow-3xl transition-all inline-flex items-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: saving ? 1 : 1.05, y: saving ? 0 : -2 }}
            whileTap={{ scale: saving ? 1 : 0.98 }}
          >
            {saving ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <FaSpinner className="text-2xl" />
                </motion.div>
                Saving Settings...
              </>
            ) : (
              <>
                <FaSave className="text-2xl" /> Save All Settings
              </>
            )}
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Offline Confirmation Modal */}
      <Modal
        open={showOfflineModal}
        title="Go Offline?"
        onClose={() => setShowOfflineModal(false)}
        onConfirm={confirmGoOffline}
        confirmText="Yes, Go Offline"
      >
        <div className="space-y-3 text-gray-700 dark:text-gray-300">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700">
            <FaExclamationTriangle className="text-amber-600 text-xl mt-0.5" />
            <div className="text-sm">
              <p className="font-bold mb-1">This will stop new orders</p>
              <p>
                Your restaurant will no longer accept new orders. However,{" "}
                <span className="font-semibold">
                  you must still fulfill any pending orders.
                </span>
              </p>
            </div>
          </div>
          <p className="text-sm text-center">
            You can go back online anytime from this page.
          </p>
        </div>
      </Modal>
    </div>
  );
};

/* ------------------------------- Sub Components ------------------------------- */

const StatCard = ({ icon, value, label, gradient }) => (
  <motion.div
    className="px-5 py-4 rounded-xl bg-white/90 backdrop-blur-md shadow-lg border border-white/50"
    whileHover={{ scale: 1.05, y: -2 }}
  >
    <div className="flex items-center gap-3">
      <div
        className={`w-10 h-10 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-md`}
      >
        {icon}
      </div>
      <div>
        <p className="text-2xl font-black text-gray-800">{value}</p>
        <p className="text-xs text-gray-600 font-semibold">{label}</p>
      </div>
    </div>
  </motion.div>
);

const SettingCard = ({
  icon,
  title,
  description,
  checked,
  onChange,
  gradient,
}) => (
  <motion.div
    className={`p-6 rounded-2xl border-2 transition-all cursor-pointer ${
      checked
        ? "bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-300"
        : "bg-white border-gray-200"
    }`}
    onClick={() => onChange(!checked)}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <div className="flex items-start gap-4">
      <div
        className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-2xl shadow-lg flex-shrink-0`}
      >
        {icon}
      </div>
      <div className="flex-1">
        <h4 className="font-black text-lg text-gray-900 mb-1">{title}</h4>
        <p className="text-sm text-gray-600 mb-3">{description}</p>
        <div className="flex items-center gap-2">
          <motion.div
            className={`w-12 h-6 rounded-full transition-all ${
              checked ? "bg-emerald-500" : "bg-gray-300"
            }`}
            animate={{ backgroundColor: checked ? "#10b981" : "#d1d5db" }}
          >
            <motion.div
              className="w-5 h-5 bg-white rounded-full shadow-md m-0.5"
              animate={{ x: checked ? 24 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </motion.div>
          <span className="text-sm font-bold text-gray-700">
            {checked ? "Enabled" : "Disabled"}
          </span>
        </div>
      </div>
    </div>
  </motion.div>
);

export default RestaurantAvailabilityToggle;

// // src/pages/restaurant/RestaurantAvailabilityToggle.jsx
// import React, {
//   useEffect,
//   useState,
//   useContext,
//   useMemo,
//   useCallback,
// } from "react";
// import {
//   FaClock,
//   FaToggleOn,
//   FaToggleOff,
//   FaCalendarAlt,
//   FaPlus,
//   FaTrashAlt,
//   FaSave,
//   FaExclamationTriangle,
//   FaSpinner,
// } from "react-icons/fa";
// import API from "../../api/axios";
// import { AuthContext } from "../../context/AuthContext";

// const DAY_KEYS = [
//   "monday",
//   "tuesday",
//   "wednesday",
//   "thursday",
//   "friday",
//   "saturday",
//   "sunday",
// ];

// const defaultDay = () => ({
//   open: true,
//   slots: [{ start: "09:00", end: "22:00" }],
// });
// const defaultWeekly = () =>
//   DAY_KEYS.reduce((acc, d) => ({ ...acc, [d]: defaultDay() }), {});
// const defaultAvailability = {
//   isOnline: true,
//   autoAvailabilityEnabled: true,
//   autoAcceptOrders: true,
//   weekly: defaultWeekly(),
//   holidays: [],
//   overrides: [],
// };

// /* --------------------- Toast --------------------- */
// const Toast = ({ toasts, remove }) => (
//   <div className="fixed z-[9999] top-6 right-6 flex flex-col gap-3">
//     {toasts.map((t) => (
//       <div
//         key={t.id}
//         className={`flex items-start gap-3 p-4 rounded-xl shadow-lg text-white transition transform hover:scale-[1.02] ${
//           t.type === "error"
//             ? "bg-red-600"
//             : t.type === "warn"
//             ? "bg-yellow-600"
//             : "bg-green-600"
//         }`}
//       >
//         <div className="pt-0.5">{t.icon}</div>
//         <div className="flex-1">
//           <div className="font-semibold">{t.title}</div>
//           {t.message && (
//             <div className="text-sm opacity-90 mt-0.5">{t.message}</div>
//           )}
//         </div>
//         <button
//           onClick={() => remove(t.id)}
//           className="opacity-80 hover:opacity-100 font-bold"
//         >
//           ✕
//         </button>
//       </div>
//     ))}
//   </div>
// );

// /* --------------------- Modal --------------------- */
// const Modal = ({
//   open,
//   title,
//   children,
//   onClose,
//   onConfirm,
//   confirmText = "Confirm",
// }) => {
//   if (!open) return null;
//   return (
//     <div className="fixed inset-0 z-[9998] flex items-center justify-center">
//       <div
//         className="absolute inset-0 bg-black/50 backdrop-blur-sm"
//         onClick={onClose}
//       />
//       <div className="relative bg-white dark:bg-gray-900 text-gray-800 dark:text-white w-full max-w-lg rounded-2xl shadow-2xl p-6">
//         <h3 className="text-xl font-bold mb-4">{title}</h3>
//         <div className="mb-6">{children}</div>
//         <div className="flex justify-end gap-4">
//           <button
//             className="px-5 py-2 rounded-lg border dark:border-gray-700 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition"
//             onClick={onClose}
//           >
//             Cancel
//           </button>
//           <button
//             className="px-5 py-2 rounded-lg bg-primary text-white font-medium hover:bg-orange-600 transition"
//             onClick={onConfirm}
//           >
//             {confirmText}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// /* --------------------- TimeSlotRow --------------------- */
// const TimeSlotRow = React.memo(
//   ({ slot, onChange, onRemove, disabled, invalid }) => (
//     <div className="flex items-center gap-3">
//       <input
//         type="time"
//         value={slot.start}
//         disabled={disabled}
//         onChange={(e) => onChange({ ...slot, start: e.target.value })}
//         className={`border rounded-lg px-3 py-1 dark:bg-gray-800 shadow-sm ${
//           invalid ? "border-red-500" : "border-gray-300 dark:border-gray-700"
//         } focus:ring-2 focus:ring-orange-400`}
//       />
//       <span className="font-medium">–</span>
//       <input
//         type="time"
//         value={slot.end}
//         disabled={disabled}
//         onChange={(e) => onChange({ ...slot, end: e.target.value })}
//         className={`border rounded-lg px-3 py-1 dark:bg-gray-800 shadow-sm ${
//           invalid ? "border-red-500" : "border-gray-300 dark:border-gray-700"
//         } focus:ring-2 focus:ring-orange-400`}
//       />
//       <button
//         type="button"
//         disabled={disabled}
//         onClick={onRemove}
//         className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-gray-800 text-red-600 transition shadow-sm"
//         title="Remove slot"
//       >
//         <FaTrashAlt />
//       </button>
//     </div>
//   )
// );

// /* --------------------- DayRow --------------------- */
// const DayRow = React.memo(
//   ({
//     dayKey,
//     data,
//     onToggleDayOpen,
//     onChangeSlot,
//     onAddSlot,
//     onRemoveSlot,
//     slotErrors,
//   }) => (
//     <div className="border rounded-2xl p-4 shadow-sm hover:shadow-md transition bg-white dark:bg-gray-800">
//       <div className="flex items-center justify-between mb-3">
//         <div className="flex items-center gap-3">
//           <input
//             type="checkbox"
//             checked={data.open}
//             onChange={(e) => onToggleDayOpen(dayKey, e.target.checked)}
//             className="w-5 h-5 accent-orange-500"
//           />
//           <span className="capitalize font-semibold text-gray-700 dark:text-gray-200">
//             {dayKey}
//           </span>
//         </div>
//         {!data.open && (
//           <span className="text-sm text-gray-400 dark:text-gray-300">
//             Closed
//           </span>
//         )}
//       </div>
//       {data.open && (
//         <div className="space-y-3">
//           {data.slots.map((slot, idx) => (
//             <TimeSlotRow
//               key={idx}
//               slot={slot}
//               onChange={(s) => onChangeSlot(dayKey, idx, s)}
//               onRemove={() => onRemoveSlot(dayKey, idx)}
//               invalid={slotErrors?.[idx]}
//             />
//           ))}
//           <button
//             type="button"
//             onClick={() => onAddSlot(dayKey)}
//             className="inline-flex items-center gap-2 px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 hover:bg-orange-50 dark:hover:bg-orange-600 transition shadow-sm"
//           >
//             <FaPlus className="text-orange-500" /> Add slot
//           </button>
//         </div>
//       )}
//     </div>
//   )
// );

// /* --------------------- Main Component --------------------- */
// const RestaurantAvailabilityToggle = () => {
//   const { user } = useContext(AuthContext);
//   const [availability, setAvailability] = useState(defaultAvailability);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [showOfflineModal, setShowOfflineModal] = useState(false);
//   const [toasts, setToasts] = useState([]);

//   const [newHoliday, setNewHoliday] = useState("");
//   const [newOverrideDate, setNewOverrideDate] = useState("");
//   const [newOverrideOpen, setNewOverrideOpen] = useState(true);
//   const [newOverrideSlots, setNewOverrideSlots] = useState([
//     { start: "09:00", end: "22:00" },
//   ]);
//   const [slotErrors, setSlotErrors] = useState({}); // per-day validation

//   /* --------------------- Toast --------------------- */
//   const pushToast = useCallback((payload) => {
//     const id = `${Date.now()}_${Math.random().toString(36).slice(2)}`;
//     setToasts((t) => [...t, { id, ...payload }]);
//     setTimeout(() => removeToast(id), 4500);
//   }, []);
//   const removeToast = useCallback(
//     (id) => setToasts((t) => t.filter((x) => x.id !== id)),
//     []
//   );

//   /* --------------------- Validation --------------------- */
//   const validateSlots = useCallback((slots) => {
//     const toMinutes = (t) => {
//       const [h, m] = t.split(":").map(Number);
//       return h * 60 + m;
//     };
//     const sorted = [...slots].sort(
//       (a, b) => toMinutes(a.start) - toMinutes(b.start)
//     );
//     for (let i = 0; i < sorted.length; i++) {
//       const s = sorted[i];
//       if (toMinutes(s.start) >= toMinutes(s.end)) return false;
//       if (i > 0 && toMinutes(sorted[i - 1].end) > toMinutes(s.start))
//         return false;
//     }
//     return true;
//   }, []);

//   /* --------------------- Fetch --------------------- */
//   const fetchAvailability = useCallback(async () => {
//     try {
//       const response = await API.get(
//         "/restaurants/restaurants/availability/me"
//       );
//       const data = response?.data?.data || {};
//       setAvailability({
//         ...defaultAvailability,
//         ...data,
//         weekly:
//           data.weekly && typeof data.weekly === "object"
//             ? data.weekly
//             : defaultWeekly(),
//         holidays: Array.isArray(data.holidays) ? data.holidays : [],
//         overrides: Array.isArray(data.overrides) ? data.overrides : [],
//       });
//     } catch (err) {
//       pushToast({
//         type: "error",
//         title: "Failed to load availability",
//         message: err?.response?.data?.message || "Please try again.",
//         icon: <FaExclamationTriangle />,
//       });
//     } finally {
//       setLoading(false);
//     }
//   }, [pushToast]);

//   useEffect(() => {
//     if (user?.role === "restaurant") fetchAvailability();
//     else setLoading(false);
//   }, [user, fetchAvailability]);

//   /* --------------------- Save --------------------- */
//   const saveAvailability = async () => {
//     const errors = {};
//     let hasError = false;
//     for (const day of DAY_KEYS) {
//       const d = availability.weekly[day];
//       if (d.open && !validateSlots(d.slots)) {
//         errors[day] = d.slots.map(() => true);
//         hasError = true;
//         pushToast({
//           type: "error",
//           title: `Invalid slots on ${day}`,
//           icon: <FaExclamationTriangle />,
//         });
//       }
//     }
//     setSlotErrors(errors);
//     if (hasError) return;

//     setSaving(true);
//     try {
//       await API.put("/restaurants/restaurants/availability", availability);
//       pushToast({
//         type: "success",
//         title: "Availability saved",
//         icon: <FaSave />,
//       });
//     } catch (err) {
//       pushToast({
//         type: "error",
//         title: "Failed to save",
//         message: err?.response?.data?.message || "Please try again.",
//         icon: <FaExclamationTriangle />,
//       });
//     } finally {
//       setSaving(false);
//     }
//   };

//   /* --------------------- Online/Offline --------------------- */
//   const toggleOnline = () => {
//     if (availability.isOnline) setShowOfflineModal(true);
//     else {
//       setAvailability((prev) => ({ ...prev, isOnline: true }));
//       pushToast({
//         type: "success",
//         title: "You are now Online",
//         icon: <FaToggleOn />,
//       });
//     }
//   };
//   const confirmGoOffline = () => {
//     setAvailability((prev) => ({ ...prev, isOnline: false }));
//     setShowOfflineModal(false);
//     pushToast({
//       type: "warn",
//       title: "You are now Offline",
//       message: "Pending orders must still be fulfilled.",
//       icon: <FaToggleOff />,
//     });
//   };

//   /* --------------------- Weekly Handlers --------------------- */
//   const toggleDayOpen = useCallback((day, open) => {
//     setAvailability((prev) => ({
//       ...prev,
//       weekly: { ...prev.weekly, [day]: { ...prev.weekly[day], open } },
//     }));
//   }, []);
//   const changeDaySlot = useCallback((day, idx, slot) => {
//     setAvailability((prev) => {
//       const slots = [...prev.weekly[day].slots];
//       slots[idx] = slot;
//       return {
//         ...prev,
//         weekly: { ...prev.weekly, [day]: { ...prev.weekly[day], slots } },
//       };
//     });
//   }, []);
//   const addDaySlot = useCallback((day) => {
//     setAvailability((prev) => {
//       const slots = [
//         ...prev.weekly[day].slots,
//         { start: "12:00", end: "15:00" },
//       ];
//       return {
//         ...prev,
//         weekly: { ...prev.weekly, [day]: { ...prev.weekly[day], slots } },
//       };
//     });
//   }, []);
//   const removeDaySlot = useCallback((day, idx) => {
//     setAvailability((prev) => {
//       const slots = prev.weekly[day].slots.filter((_, i) => i !== idx);
//       return {
//         ...prev,
//         weekly: { ...prev.weekly, [day]: { ...prev.weekly[day], slots } },
//       };
//     });
//   }, []);

//   /* --------------------- Weekly Summary --------------------- */
//   const weeklySummary = useMemo(
//     () =>
//       DAY_KEYS.map((d) => {
//         const day = availability.weekly[d];
//         if (!day.open) return { day: d, label: "Closed" };
//         return {
//           day: d,
//           label: day.slots.map((s) => `${s.start}–${s.end}`).join(", "),
//         };
//       }),
//     [availability.weekly]
//   );

//   if (loading)
//     return (
//       <div className="text-center py-10 text-gray-500 dark:text-gray-300 text-lg">
//         <FaSpinner className="inline animate-spin mr-2" />
//         Loading availability...
//       </div>
//     );

//   return (
//     <div className="max-w-6xl mx-auto bg-gray-50 dark:bg-gray-900 p-8 rounded-3xl shadow-2xl text-gray-800 dark:text-white space-y-10">
//       <Toast toasts={toasts} remove={removeToast} />
//       <h2 className="text-3xl font-bold flex items-center gap-3">
//         <FaClock className="text-orange-500" />
//         Restaurant Availability
//       </h2>

//       {/* Online Toggle */}
//       <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-2xl p-4 shadow hover:shadow-lg transition">
//         <div className="flex items-center gap-3">
//           <span className="font-semibold text-gray-700 dark:text-gray-300">
//             Restaurant is currently:
//           </span>
//           <span
//             className={`px-3 py-1 rounded-full text-white font-medium ${
//               availability.isOnline ? "bg-green-600" : "bg-red-600"
//             }`}
//           >
//             {availability.isOnline ? "Online" : "Offline"}
//           </span>
//         </div>
//         <button
//           onClick={toggleOnline}
//           className={`flex items-center gap-2 px-5 py-2 rounded-2xl text-white font-medium transition shadow hover:scale-105 ${
//             availability.isOnline
//               ? "bg-red-500 hover:bg-red-600"
//               : "bg-green-600 hover:bg-green-700"
//           }`}
//         >
//           {availability.isOnline ? <FaToggleOff /> : <FaToggleOn />}{" "}
//           {availability.isOnline ? "Go Offline" : "Go Online"}
//         </button>
//       </div>

//       {/* Auto Settings */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <label className="flex items-center gap-3 border rounded-2xl p-4 bg-white dark:bg-gray-800 shadow hover:shadow-md transition">
//           <input
//             type="checkbox"
//             checked={availability.autoAvailabilityEnabled}
//             onChange={(e) =>
//               setAvailability((p) => ({
//                 ...p,
//                 autoAvailabilityEnabled: e.target.checked,
//               }))
//             }
//             className="w-5 h-5 accent-orange-500"
//           />
//           <span className="font-medium">
//             Auto open/close by weekly schedule
//           </span>
//         </label>
//         <label className="flex items-center gap-3 border rounded-2xl p-4 bg-white dark:bg-gray-800 shadow hover:shadow-md transition">
//           <input
//             type="checkbox"
//             checked={availability.autoAcceptOrders}
//             onChange={(e) =>
//               setAvailability((p) => ({
//                 ...p,
//                 autoAcceptOrders: e.target.checked,
//               }))
//             }
//             className="w-5 h-5 accent-orange-500"
//           />
//           <span className="font-medium">Auto-accept orders</span>
//         </label>
//       </div>

//       {/* Weekly Schedule */}
//       <div className="space-y-6">
//         <h3 className="font-bold text-xl">Weekly Schedule</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {DAY_KEYS.map((day) => (
//             <DayRow
//               key={day}
//               dayKey={day}
//               data={availability.weekly[day]}
//               onToggleDayOpen={toggleDayOpen}
//               onChangeSlot={changeDaySlot}
//               onAddSlot={addDaySlot}
//               onRemoveSlot={removeDaySlot}
//               slotErrors={slotErrors[day]}
//             />
//           ))}
//         </div>
//         <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
//           <div className="font-medium mb-1">Preview:</div>
//           <ul className="list-disc ml-5 space-y-1">
//             {weeklySummary.map((w) => (
//               <li key={w.day} className="capitalize">
//                 {w.day}: {w.label}
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>

//       {/* Holidays & Overrides would follow same card-style */}
//       {/* Save Button */}
//       <div className="text-center">
//         <button
//           disabled={saving}
//           onClick={saveAvailability}
//           className="bg-primary text-white px-8 py-3 rounded-2xl hover:bg-orange-600 transition shadow-lg inline-flex items-center gap-3 disabled:opacity-50"
//         >
//           {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}{" "}
//           {saving ? "Saving..." : "Save Settings"}
//         </button>
//       </div>

//       <Modal
//         open={showOfflineModal}
//         title="Go Offline?"
//         onClose={() => setShowOfflineModal(false)}
//         onConfirm={confirmGoOffline}
//         confirmText="Yes, go offline"
//       >
//         <div className="flex items-start gap-3">
//           <FaExclamationTriangle className="text-yellow-500 mt-1" />
//           <div className="text-sm">
//             Going offline will stop new orders.
//             <br />
//             <span className="font-medium">
//               Pending orders must still be fulfilled.
//             </span>
//           </div>
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default RestaurantAvailabilityToggle;
