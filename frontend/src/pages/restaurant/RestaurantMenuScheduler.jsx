import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaClock,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaSave,
  FaUtensils,
  FaToggleOn,
  FaToggleOff,
  FaSpinner,
  FaChevronDown,
  FaChevronUp,
  FaCheckDouble,
} from "react-icons/fa";
import API from "../../api/axios";

const daysOfWeek = [
  { key: "monday", label: "Monday", emoji: "📅" },
  { key: "tuesday", label: "Tuesday", emoji: "📅" },
  { key: "wednesday", label: "Wednesday", emoji: "📅" },
  { key: "thursday", label: "Thursday", emoji: "📅" },
  { key: "friday", label: "Friday", emoji: "📅" },
  { key: "saturday", label: "Saturday", emoji: "🎉" },
  { key: "sunday", label: "Sunday", emoji: "🎉" },
];

const RestaurantMenuScheduler = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingItems, setSavingItems] = useState({});
  const [expandedItems, setExpandedItems] = useState({});

  // Fetch owner restaurant menu
  const fetchMenu = async () => {
    try {
      const res = await API.get(`/menu/restaurant/menu/full`);
      setMenuItems(res.data.menu || []);
      if (res.data.menu?.length > 0) {
        setExpandedItems({ [res.data.menu[0]._id]: true });
      }
    } catch (err) {
      alert("Failed to load menu items.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const toggleExpanded = (itemId) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const toggleAllExpanded = (expand) => {
    const newState = {};
    menuItems.forEach((item) => (newState[item._id] = expand));
    setExpandedItems(newState);
  };

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

  const updateTime = (itemId, day, field, value) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item._id === itemId
          ? {
              ...item,
              schedule: {
                ...item.schedule,
                [day]: { ...item.schedule[day], [field]: value },
              },
            }
          : item
      )
    );
  };

  const toggleAllDaysForItem = (itemId, available) => {
    setMenuItems((prev) =>
      prev.map((item) => {
        if (item._id === itemId) {
          const newSchedule = {};
          daysOfWeek.forEach(({ key }) => {
            newSchedule[key] = {
              ...item.schedule?.[key],
              available,
              startTime: item.schedule?.[key]?.startTime || "09:00",
              endTime: item.schedule?.[key]?.endTime || "21:00",
            };
          });
          return { ...item, schedule: newSchedule };
        }
        return item;
      })
    );
  };

  const saveItemSchedule = async (item) => {
    setSavingItems((prev) => ({ ...prev, [item._id]: true }));
    try {
      await API.put(`/menu/menu/schedule/${item._id}`, {
        schedule: item.schedule,
      });
      alert(`Saved schedule for "${item.name}"`);
    } catch (err) {
      alert("Failed to save schedule.");
    } finally {
      setSavingItems((prev) => ({ ...prev, [item._id]: false }));
    }
  };

  const saveAllSchedules = async () => {
    setSavingItems({ all: true });
    try {
      await Promise.all(
        menuItems.map((item) =>
          API.put(`/menu/menu/schedule/${item._id}`, {
            schedule: item.schedule,
          })
        )
      );
      alert("All schedules saved!");
    } catch (err) {
      alert("Some items failed to save.");
    } finally {
      setSavingItems({});
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
        <motion.div animate={{ opacity: [0.5, 1, 0.5] }}>
          <p className="text-xl font-bold text-gray-700">
            Loading menu schedules...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      <motion.div
        className="px-4 sm:px-8 md:px-10 lg:px-12 py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* HEADER */}
        <motion.div
          className="relative overflow-hidden rounded-3xl mb-8 shadow-2xl border border-rose-200"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600"></div>
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />

          <div className="relative z-10 p-8 md:p-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 border border-white/30 backdrop-blur-md flex items-center justify-center text-3xl">
                    📅
                  </div>
                  <div>
                    <h1 className="text-4xl font-black text-white">
                      Menu Scheduler
                    </h1>
                    <p className="text-white/90 text-sm mt-1">
                      Manage availability for each dish
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={() => toggleAllExpanded(true)}
                  className="px-6 py-3 rounded-xl bg-white/20 border border-white/30 text-white font-bold shadow-xl"
                >
                  Expand All
                </button>

                <button
                  onClick={() => toggleAllExpanded(false)}
                  className="px-6 py-3 rounded-xl bg-white/20 border border-white/30 text-white font-bold shadow-xl"
                >
                  Collapse All
                </button>

                {menuItems.length > 0 && (
                  <button
                    onClick={saveAllSchedules}
                    disabled={savingItems.all}
                    className="px-8 py-3 rounded-xl bg-white/95 text-indigo-600 border border-white/50 font-bold shadow-xl disabled:opacity-50"
                  >
                    {savingItems.all ? "Saving..." : "Save All"}
                  </button>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
              <StatCard
                icon={<FaUtensils />}
                value={menuItems.length}
                label="Total Dishes"
                gradient="from-teal-500 to-emerald-600"
              />
              <StatCard
                icon={<FaCalendarAlt />}
                value={daysOfWeek.length}
                label="Days"
                gradient="from-indigo-500 to-purple-600"
              />
              <StatCard
                icon={<FaClock />}
                value={
                  Object.keys(expandedItems).filter((k) => expandedItems[k])
                    .length
                }
                label="Expanded"
                gradient="from-rose-500 to-pink-600"
              />
            </div>
          </div>
        </motion.div>

        {/* ---------------------- MENU ITEMS ---------------------- */}
        {menuItems.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-6 mb-8">
            <AnimatePresence>
              {menuItems.map((item, index) => (
                <MenuItemCard
                  key={item._id}
                  item={item}
                  index={index}
                  expanded={expandedItems[item._id]}
                  onToggleExpand={() => toggleExpanded(item._id)}
                  onToggleDay={toggleDay}
                  onUpdateTime={updateTime}
                  onToggleAllDays={toggleAllDaysForItem}
                  onSave={saveItemSchedule}
                  saving={savingItems[item._id]}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </div>
  );
};

/* ---------------- COMPONENTS ---------------- */

const StatCard = ({ icon, value, label, gradient }) => (
  <div className="px-5 py-4 rounded-xl bg-white/90 border border-white/50 shadow-lg">
    <div className="flex items-center gap-3">
      <div
        className={`w-10 h-10 rounded-lg bg-gradient-to-br ${gradient} text-white flex items-center justify-center`}
      >
        {icon}
      </div>
      <div>
        <p className="text-2xl font-black text-gray-800">{value}</p>
        <p className="text-xs text-gray-600 font-semibold">{label}</p>
      </div>
    </div>
  </div>
);
const MenuItemCard = ({
  item,
  index,
  expanded,
  onToggleExpand,
  onToggleDay,
  onUpdateTime,
  onToggleAllDays,
  onSave,
  saving,
}) => {
  const availableDaysCount = daysOfWeek.filter(
    ({ key }) => item.schedule?.[key]?.available
  ).length;

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 hover:border-rose-300 overflow-hidden transition-all"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.1 }}
      layout
    >
      {/* Header */}
      <motion.div
        className="p-5 bg-gradient-to-r from-rose-50 to-pink-50 border-b-2 border-gray-200 cursor-pointer"
        onClick={onToggleExpand}
        whileHover={{ backgroundColor: "rgb(254 242 242)" }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white text-2xl shadow-lg">
              🍽️
            </div>
            <div className="flex-1">
              <h3 className="font-black text-xl text-gray-900 mb-1">
                {item.name}
              </h3>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="px-3 py-1 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-700 text-xs font-bold">
                  {item.category || "Uncategorized"}
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-1">
                  <FaCheckCircle />
                  {availableDaysCount} / {daysOfWeek.length} days active
                </span>
              </div>
            </div>
          </div>

          <motion.div
            className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600"
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <FaChevronDown />
          </motion.div>
        </div>
      </motion.div>

      {/* Expanded Section */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-6 md:p-8">
              {/* Quick Actions */}
              <div className="flex gap-3 mb-6">
                <motion.button
                  onClick={() => onToggleAllDays(item._id, true)}
                  className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                >
                  <FaToggleOn /> Enable All Days
                </motion.button>

                <motion.button
                  onClick={() => onToggleAllDays(item._id, false)}
                  className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                >
                  <FaToggleOff /> Disable All Days
                </motion.button>
              </div>

              {/* Daily Rows */}
              <div className="space-y-3 mb-6">
                {daysOfWeek.map(({ key, label, emoji }, i) => (
                  <ScheduleRow
                    key={key}
                    day={key}
                    label={label}
                    emoji={emoji}
                    schedule={item.schedule?.[key]}
                    onToggle={() => onToggleDay(item._id, key)}
                    onUpdateTime={(field, value) =>
                      onUpdateTime(item._id, key, field, value)
                    }
                    index={i}
                  />
                ))}
              </div>

              {/* Save */}
              <motion.button
                onClick={() => onSave(item)}
                disabled={saving}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-black text-lg shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                whileHover={{ scale: saving ? 1 : 1.02 }}
              >
                {saving ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <FaSpinner />
                    </motion.div>
                    Saving...
                  </>
                ) : (
                  <>
                    <FaSave /> Save Schedule
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const ScheduleRow = ({
  label,
  emoji,
  schedule,
  onToggle,
  onUpdateTime,
  index,
}) => {
  const isAvailable = schedule?.available;

  return (
    <motion.div
      className={`flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl border-2 transition-all ${
        isAvailable
          ? "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200"
          : "bg-gray-50 border-gray-200 opacity-60"
      }`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <div className="flex items-center gap-3 sm:w-40">
        <button
          onClick={onToggle}
          className={`w-11 h-11 rounded-lg flex items-center justify-center shadow-md ${
            isAvailable
              ? "bg-emerald-500 text-white"
              : "bg-gray-300 text-gray-600"
          }`}
        >
          {isAvailable ? (
            <FaCheckCircle className="text-xl" />
          ) : (
            <FaTimesCircle className="text-xl" />
          )}
        </button>

        <div>
          <p className="font-bold text-gray-800 flex gap-2 items-center">
            <span>{emoji}</span> {label}
          </p>
          <p className="text-xs text-gray-500">
            {isAvailable ? "Active" : "Inactive"}
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center gap-3">
        {/* Start */}
        <div className="flex-1">
          <label className="text-xs text-gray-600 font-semibold">
            Start Time
          </label>
          <input
            type="time"
            value={schedule?.startTime || "09:00"}
            onChange={(e) => onUpdateTime("startTime", e.target.value)}
            disabled={!isAvailable}
            className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 font-medium disabled:bg-gray-100"
          />
        </div>

        <span className="text-gray-400 font-bold pb-2">→</span>

        {/* End */}
        <div className="flex-1">
          <label className="text-xs text-gray-600 font-semibold">
            End Time
          </label>
          <input
            type="time"
            value={schedule?.endTime || "21:00"}
            onChange={(e) => onUpdateTime("endTime", e.target.value)}
            disabled={!isAvailable}
            className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 font-medium disabled:bg-gray-100"
          />
        </div>
      </div>
    </motion.div>
  );
};

const EmptyState = () => (
  <motion.div
    className="text-center py-20 bg-white rounded-3xl shadow-xl border border-gray-200 mb-8"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    <div className="text-9xl mb-6">📅</div>
    <h3 className="text-3xl font-black text-gray-800 mb-3">No Menu Items</h3>
    <p className="text-gray-600 text-lg">
      Add dishes to your menu to manage schedules
    </p>
  </motion.div>
);

export default RestaurantMenuScheduler;

// import React, { useEffect, useState } from "react";
// import { FaClock } from "react-icons/fa";
// import API from "../../api/axios";

// const daysOfWeek = [
//   "monday",
//   "tuesday",
//   "wednesday",
//   "thursday",
//   "friday",
//   "saturday",
//   "sunday",
// ];

// const RestaurantMenuScheduler = () => {
//   const [menuItems, setMenuItems] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Fetch owner's restaurant menu
//   const fetchMenu = async () => {
//     try {
//       const res = await API.get(`/menu/restaurant/menu/full`);
//       setMenuItems(res.data.menu || []);
//     } catch (err) {
//       console.error("Failed to load menu:", err.response || err);
//       alert("Failed to load menu items.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchMenu();
//   }, []);

//   // Toggle availability for a day of an item
//   const toggleDay = (itemId, day) => {
//     setMenuItems((prev) =>
//       prev.map((item) =>
//         item._id === itemId
//           ? {
//               ...item,
//               schedule: {
//                 ...item.schedule,
//                 [day]: {
//                   ...item.schedule[day],
//                   available: !item.schedule[day]?.available,
//                 },
//               },
//             }
//           : item
//       )
//     );
//   };

//   // Update time for a day of an item
//   const updateTime = (itemId, day, field, value) => {
//     setMenuItems((prev) =>
//       prev.map((item) =>
//         item._id === itemId
//           ? {
//               ...item,
//               schedule: {
//                 ...item.schedule,
//                 [day]: {
//                   ...item.schedule[day],
//                   [field]: value,
//                 },
//               },
//             }
//           : item
//       )
//     );
//   };

//   // Save schedule for one item
//   const saveItemSchedule = async (item) => {
//     try {
//       await API.put(`/menu/menu/schedule/${item._id}`, { schedule: item.schedule });
//       alert(`✅ Saved schedule for "${item.name}"`);
//     } catch (err) {
//       console.error("Failed to save:", err.response || err);
//       alert(`❌ Failed to save schedule for "${item.name}"`);
//     }
//   };

//   if (loading) return <p className="p-6 text-center">Loading menu...</p>;

//   return (
//     <div className="p-6 max-w-5xl mx-auto bg-white dark:bg-gray-900 shadow-lg rounded-xl text-gray-800 dark:text-white">
//       <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
//         <FaClock /> Menu Scheduler
//       </h2>

//       {menuItems.length === 0 && (
//         <p className="text-center text-gray-500 dark:text-gray-400">
//           No menu items available.
//         </p>
//       )}

//       {menuItems.map((item) => (
//         <div key={item._id} className="mb-6 border p-4 rounded-lg shadow-sm">
//           <h3 className="font-semibold mb-2">{item.name}</h3>
//           <div className="space-y-2">
//             {daysOfWeek.map((day) => (
//               <div key={day} className="flex items-center gap-2">
//                 <input
//                   type="checkbox"
//                   checked={item.schedule?.[day]?.available || false}
//                   onChange={() => toggleDay(item._id, day)}
//                   className="w-5 h-5 accent-orange-500"
//                 />
//                 <label className="capitalize w-20">{day}</label>
//                 <input
//                   type="time"
//                   value={item.schedule?.[day]?.startTime || "09:00"}
//                   disabled={!item.schedule?.[day]?.available}
//                   onChange={(e) =>
//                     updateTime(item._id, day, "startTime", e.target.value)
//                   }
//                   className="border px-2 py-1 rounded disabled:opacity-50"
//                 />
//                 <span>to</span>
//                 <input
//                   type="time"
//                   value={item.schedule?.[day]?.endTime || "21:00"}
//                   disabled={!item.schedule?.[day]?.available}
//                   onChange={(e) =>
//                     updateTime(item._id, day, "endTime", e.target.value)
//                   }
//                   className="border px-2 py-1 rounded disabled:opacity-50"
//                 />
//               </div>
//             ))}
//           </div>

//           <button
//             onClick={() => saveItemSchedule(item)}
//             className="mt-2 py-2 px-4 bg-primary text-white rounded hover:bg-orange-600 transition"
//           >
//             Save Schedule
//           </button>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default RestaurantMenuScheduler;
