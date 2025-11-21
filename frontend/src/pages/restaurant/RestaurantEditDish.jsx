// src/pages/restaurant/RestaurantEditDish.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import API from "../../api/axios";

import {
  FaUtensils,
  FaRupeeSign,
  FaImage,
  FaTag,
  FaToggleOn,
  FaToggleOff,
  FaClock,
  FaArrowLeft,
  FaSave,
  FaCheckCircle,
  FaTimesCircle,
  FaCalendarAlt,
  FaAlignLeft,
  FaEye,
  FaSpinner,
} from "react-icons/fa";

const categoryOptions = [
  "Starter",
  "Main Course",
  "Dessert",
  "Beverage",
  "Appetizer",
  "Snack",
  "Salad",
  "Soup",
  "Other",
];

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

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false); // collapsed initially
  const [imagePreview, setImagePreview] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
    isAvailable: true,
    schedule: defaultSchedule,
  });

  const [error, setError] = useState(null);

  /* ------------------- Fetch Dish ------------------- */
  useEffect(() => {
    const fetchDish = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/menu/menu/${id}`);

        if (res.data?.menuItem) {
          const item = res.data.menuItem;

          setForm({
            name: item.name || "",
            description: item.description || "",
            price: item.price || "",
            category: item.category || "",
            image: item.image || "",
            isAvailable: item.isAvailable ?? true,
            schedule: item.schedule || defaultSchedule,
          });

          if (item.image) setImagePreview(item.image);
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

  /* ------------------- Handlers ------------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const toggleMasterAvailability = () => {
    setForm((p) => ({ ...p, isAvailable: !p.isAvailable }));
  };

  const handleScheduleChange = (day, field, value) => {
    setForm((p) => ({
      ...p,
      schedule: {
        ...p.schedule,
        [day]: { ...p.schedule[day], [field]: value },
      },
    }));
  };

  const toggleAllDays = (value) => {
    const updated = {};
    Object.keys(form.schedule).forEach((day) => {
      updated[day] = { ...form.schedule[day], available: value };
    });
    setForm((p) => ({ ...p, schedule: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await API.put(`/menu/menu/${id}`, form);

      alert("Dish updated successfully!");

      setTimeout(() => {
        navigate("/restaurant/menu-manager");
      }, 900);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update dish.");
    } finally {
      setSubmitting(false);
    }
  };

  /* ------------------- Loading UI ------------------- */
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            className="relative w-24 h-24 mx-auto mb-6"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="absolute inset-0 border-4 border-rose-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-rose-600 border-t-transparent rounded-full"></div>
          </motion.div>
          <p className="text-gray-700 text-lg font-bold">Loading dish...</p>
        </div>
      </div>
    );
  }

  /* ------------------- Error UI ------------------- */
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-red-600">
        <p className="text-xl font-bold">{error}</p>
        <button
          onClick={() => navigate("/restaurant/menu-manager")}
          className="mt-6 px-6 py-3 rounded-xl bg-rose-600 text-white shadow-lg"
        >
          Back to Menu
        </button>
      </div>
    );
  }

  /* ------------------- MAIN UI ------------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      <motion.div
        className="w-full max-w-7xl mx-auto px-2 sm:px-4 py-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* HEADER */}
        <motion.div className="relative overflow-hidden rounded-3xl mb-8 shadow-2xl border border-rose-200">
          <div className="absolute inset-0 bg-gradient-to-br from-rose-600 via-pink-600 to-purple-600"></div>

          <div className="relative z-10 p-6 md:p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate("/restaurant/menu-manager")}
                  className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white"
                >
                  <FaArrowLeft />
                </button>

                <div>
                  <h1 className="text-3xl md:text-4xl font-black text-white">
                    Edit Dish
                  </h1>
                  <p className="text-white/90 text-sm mt-1">
                    Modify and update your dish details
                  </p>
                </div>
              </div>

              <div className="hidden sm:block w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-4xl">
                ✏️
              </div>
            </div>
          </div>
        </motion.div>

        {/* ------------------- GRID ------------------- */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-10">
            {/* LEFT COLUMN */}
            <div className="space-y-6">
              {/* BASIC INFO */}
              <motion.div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="p-5 bg-gradient-to-r from-rose-500 to-pink-600 text-white">
                  <h3 className="font-black text-lg flex items-center gap-2">
                    <FaUtensils /> Basic Information
                  </h3>
                </div>

                <div className="p-6 space-y-5">
                  {/* Name */}
                  <FormField label="Dish Name" icon={<FaUtensils />} required>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Dish name"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200"
                    />
                  </FormField>

                  {/* Description */}
                  <FormField label="Description" icon={<FaAlignLeft />}>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      rows="4"
                      placeholder="Describe your dish..."
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 resize-none"
                    />
                  </FormField>

                  {/* Price + Category */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField label="Price" icon={<FaRupeeSign />} required>
                      <div className="relative">
                        <FaRupeeSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="number"
                          name="price"
                          value={form.price}
                          min="0"
                          step="0.01"
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200"
                        />
                      </div>
                    </FormField>

                    <FormField label="Category" icon={<FaTag />} required>
                      <select
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200"
                      >
                        <option value="">Select category...</option>
                        {categoryOptions.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </FormField>
                  </div>

                  {/* Image URL */}
                  <FormField label="Image URL" icon={<FaImage />}>
                    <input
                      name="image"
                      value={form.image}
                      onChange={(e) => {
                        handleChange(e);
                        setImagePreview(e.target.value);
                      }}
                      placeholder="https://example.com/dish.jpg"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200"
                    />
                  </FormField>
                </div>
              </motion.div>

              {/* SCHEDULE (COLLAPSIBLE) */}
              <motion.div
                className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
                layout
              >
                <button
                  type="button"
                  onClick={() => setScheduleOpen(!scheduleOpen)}
                  className="w-full text-left"
                >
                  <div className="p-5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex justify-between items-center">
                    <h3 className="font-black text-lg flex items-center gap-2">
                      <FaCalendarAlt /> Weekly Schedule
                    </h3>
                    <motion.span
                      animate={{ rotate: scheduleOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-2xl"
                    >
                      ▼
                    </motion.span>
                  </div>
                </button>

                <AnimatePresence>
                  {scheduleOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 pt-4 flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => toggleAllDays(true)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-bold"
                        >
                          Enable All
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleAllDays(false)}
                          className="px-3 py-1.5 rounded-lg bg-red-100 text-red-700 text-xs font-bold"
                        >
                          Disable All
                        </button>
                      </div>

                      <div className="p-6 pt-0 space-y-3">
                        {Object.keys(form.schedule).map((day) => (
                          <ScheduleRow
                            key={day}
                            day={day}
                            schedule={form.schedule[day]}
                            onChange={handleScheduleChange}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-6 lg:sticky lg:top-6 self-start h-fit">
              {/* Preview */}
              <motion.div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="p-5 bg-gradient-to-r from-teal-500 to-emerald-600 text-white">
                  <h3 className="font-black text-lg flex items-center gap-2">
                    <FaEye /> Preview
                  </h3>
                </div>

                <div className="p-6">
                  <div className="relative h-48 rounded-xl overflow-hidden bg-gray-100 border-2 border-gray-200">
                    {imagePreview ? (
                      <motion.img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FaImage className="text-gray-400 text-5xl" />
                      </div>
                    )}
                  </div>

                  {form.name && (
                    <div className="mt-4">
                      <h4 className="font-black text-xl text-gray-900">
                        {form.name}
                      </h4>

                      {form.category && (
                        <span className="inline-block px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-sm font-bold mb-2">
                          {form.category}
                        </span>
                      )}

                      {form.price && (
                        <p className="text-2xl font-black text-rose-700 flex items-center gap-1">
                          <FaRupeeSign />
                          {form.price}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Availability */}
              <motion.div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="p-5 bg-gradient-to-r from-amber-500 to-orange-600 text-white">
                  <h3 className="font-black text-lg flex items-center gap-2">
                    <FaClock /> Availability
                  </h3>
                </div>

                <div className="p-6">
                  <button
                    type="button"
                    onClick={toggleMasterAvailability}
                    className={`w-full p-4 rounded-xl border-2 flex items-center justify-between ${
                      form.isAvailable
                        ? "bg-emerald-50 border-emerald-300"
                        : "bg-red-50 border-red-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          form.isAvailable ? "bg-emerald-500" : "bg-red-500"
                        } text-white`}
                      >
                        {form.isAvailable ? <FaToggleOn /> : <FaToggleOff />}
                      </div>

                      <div>
                        <p className="font-black text-lg">
                          {form.isAvailable ? "Available" : "Unavailable"}
                        </p>
                        <p className="text-sm text-gray-600">
                          {form.isAvailable
                            ? "Dish is ready to serve"
                            : "Dish is not available"}
                        </p>
                      </div>
                    </div>

                    {form.isAvailable ? (
                      <FaCheckCircle className="text-emerald-500 text-2xl" />
                    ) : (
                      <FaTimesCircle className="text-red-500 text-2xl" />
                    )}
                  </button>
                </div>
              </motion.div>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-black text-lg shadow-xl disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {submitting ? (
                  <>
                    <FaSpinner className="animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <FaSave /> Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

/* ------------------- Components ------------------- */

const FormField = ({ label, icon, required, children }) => (
  <div>
    <label className="flex items-center gap-2 mb-2 font-bold text-gray-700">
      <span className="text-rose-500">{icon}</span>
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
  </div>
);

const ScheduleRow = ({ day, schedule, onChange }) => (
  <div
    className={`flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl border-2 ${
      schedule.available
        ? "bg-emerald-50 border-emerald-200"
        : "bg-gray-50 border-gray-200 opacity-60"
    }`}
  >
    <div className="flex items-center gap-3 sm:w-32">
      <button
        type="button"
        onClick={() => onChange(day, "available", !schedule.available)}
        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          schedule.available
            ? "bg-emerald-500 text-white"
            : "bg-gray-300 text-gray-500"
        }`}
      >
        {schedule.available ? <FaCheckCircle /> : <FaTimesCircle />}
      </button>

      <span className="capitalize font-bold text-gray-700">{day}</span>
    </div>

    <div className="flex-1 flex items-center gap-2">
      <input
        type="time"
        value={schedule.startTime}
        onChange={(e) => onChange(day, "startTime", e.target.value)}
        disabled={!schedule.available}
        className="flex-1 px-3 py-2 rounded-lg border-2 border-gray-200"
      />

      <span className="text-gray-400 font-bold">→</span>

      <input
        type="time"
        value={schedule.endTime}
        onChange={(e) => onChange(day, "endTime", e.target.value)}
        disabled={!schedule.available}
        className="flex-1 px-3 py-2 rounded-lg border-2 border-gray-200"
      />
    </div>
  </div>
);

export default RestaurantEditDish;


// // src/pages/restaurant/RestaurantEditDish.jsx
// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import API from "../../api/axios";

// const defaultSchedule = {
//   monday: { available: true, startTime: "00:00", endTime: "23:59" },
//   tuesday: { available: true, startTime: "00:00", endTime: "23:59" },
//   wednesday: { available: true, startTime: "00:00", endTime: "23:59" },
//   thursday: { available: true, startTime: "00:00", endTime: "23:59" },
//   friday: { available: true, startTime: "00:00", endTime: "23:59" },
//   saturday: { available: true, startTime: "00:00", endTime: "23:59" },
//   sunday: { available: true, startTime: "00:00", endTime: "23:59" },
// };

// const RestaurantEditDish = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     name: "",
//     description: "",
//     price: "",
//     category: "",
//     image: "",
//     isAvailable: true,
//     schedule: defaultSchedule,
//   });

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // ✅ Fetch dish by ID
//   useEffect(() => {
//     const fetchDish = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const res = await API.get(`/menu/menu/${id}`);
//         if (res.data?.menuItem) {
//           setForm({
//             ...defaultSchedule,
//             ...res.data.menuItem, // merge with default to avoid missing schedule
//           });
//         } else {
//           setError("Dish not found.");
//         }
//       } catch (err) {
//         setError(err.response?.data?.message || "Failed to load dish.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDish();
//   }, [id]);

//   // 📌 Input change
//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   // 📌 Master availability toggle
//   const toggleMasterAvailability = () => {
//     setForm((prev) => ({ ...prev, isAvailable: !prev.isAvailable }));
//   };

//   // 📌 Schedule change
//   const handleScheduleChange = (day, field, value) => {
//     setForm((prev) => ({
//       ...prev,
//       schedule: {
//         ...prev.schedule,
//         [day]: { ...prev.schedule[day], [field]: value },
//       },
//     }));
//   };

//   // 📌 Update dish
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await API.put(`/menu/menu/${id}`, form);
//       alert("Dish updated successfully!");
//       navigate("/restaurant/menu-manager");
//     } catch (err) {
//       alert(err.response?.data?.message || "Failed to update dish.");
//     }
//   };

//   if (loading) return <p className="text-center mt-10">Loading dish...</p>;

//   if (error) {
//     return (
//       <div className="text-center mt-10 text-red-600">
//         <p>{error}</p>
//         <button
//           onClick={() => navigate("/restaurant/menu-manager")}
//           className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-orange-600 transition"
//         >
//           Back to Menu
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-2xl mx-auto p-6 text-gray-800 dark:text-white">
//       <h2 className="text-2xl font-bold mb-4">✏️ Edit Dish</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         {/* Dish details */}
//         <input
//           name="name"
//           value={form.name}
//           onChange={handleChange}
//           className="w-full p-2 rounded border dark:bg-gray-800"
//           placeholder="Dish Name"
//           required
//         />
//         <textarea
//           name="description"
//           value={form.description}
//           onChange={handleChange}
//           className="w-full p-2 rounded border dark:bg-gray-800"
//           placeholder="Description"
//         />
//         <input
//           type="number"
//           name="price"
//           value={form.price}
//           onChange={handleChange}
//           className="w-full p-2 rounded border dark:bg-gray-800"
//           placeholder="Price"
//           required
//         />
//         <input
//           name="category"
//           value={form.category}
//           onChange={handleChange}
//           className="w-full p-2 rounded border dark:bg-gray-800"
//           placeholder="Category"
//         />
//         <input
//           name="image"
//           value={form.image}
//           onChange={handleChange}
//           className="w-full p-2 rounded border dark:bg-gray-800"
//           placeholder="Image URL"
//         />

//         {/* Master Availability */}
//         <div className="flex items-center gap-2">
//           <input
//             type="checkbox"
//             checked={form.isAvailable}
//             onChange={toggleMasterAvailability}
//           />
//           <label>Available</label>
//         </div>

//         {/* Weekly Schedule */}
//         <div className="mt-6">
//           <h3 className="font-semibold text-lg mb-2">🗓️ Weekly Schedule</h3>
//           <div className="space-y-2">
//             {Object.keys(form.schedule).map((day) => (
//               <div
//                 key={day}
//                 className="flex items-center gap-3 border p-2 rounded"
//               >
//                 <input
//                   type="checkbox"
//                   checked={form.schedule[day].available}
//                   onChange={(e) =>
//                     handleScheduleChange(day, "available", e.target.checked)
//                   }
//                 />
//                 <span className="capitalize w-24">{day}</span>
//                 <input
//                   type="time"
//                   value={form.schedule[day].startTime}
//                   onChange={(e) =>
//                     handleScheduleChange(day, "startTime", e.target.value)
//                   }
//                   className="p-1 rounded border dark:bg-gray-800"
//                 />
//                 <span>-</span>
//                 <input
//                   type="time"
//                   value={form.schedule[day].endTime}
//                   onChange={(e) =>
//                     handleScheduleChange(day, "endTime", e.target.value)
//                   }
//                   className="p-1 rounded border dark:bg-gray-800"
//                 />
//               </div>
//             ))}
//           </div>
//         </div>

//         <button
//           type="submit"
//           className="bg-primary text-white px-4 py-2 rounded hover:bg-orange-600 transition mt-4"
//         >
//           Update Dish
//         </button>
//       </form>
//     </div>
//   );
// };

// export default RestaurantEditDish;
