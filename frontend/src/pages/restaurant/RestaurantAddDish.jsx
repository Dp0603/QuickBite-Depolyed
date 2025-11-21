import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../../context/AuthContext";
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

/* ----------------------------- Default Data ----------------------------- */

const defaultSchedule = {
  monday: { available: true, startTime: "00:00", endTime: "23:59" },
  tuesday: { available: true, startTime: "00:00", endTime: "23:59" },
  wednesday: { available: true, startTime: "00:00", endTime: "23:59" },
  thursday: { available: true, startTime: "00:00", endTime: "23:59" },
  friday: { available: true, startTime: "00:00", endTime: "23:59" },
  saturday: { available: true, startTime: "00:00", endTime: "23:59" },
  sunday: { available: true, startTime: "00:00", endTime: "23:59" },
};

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

/* ----------------------------- Main Component ----------------------------- */

const RestaurantAddDish = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [restaurantId, setRestaurantId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [scheduleOpen, setScheduleOpen] = useState(false); // COLLAPSIBLE SCHEDULE

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
    isAvailable: true,
    schedule: defaultSchedule,
  });

  const [errors, setErrors] = useState({});

  /* ---------------- Fetch Restaurant ID ---------------- */

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

    if (user?.role === "restaurant") fetchRestaurant();
    else {
      alert("Only restaurant owners can add dishes!");
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (form.image) setImagePreview(form.image);
  }, [form.image]);

  /* ---------------- Validation ---------------- */

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Dish name is required";
    if (!form.price || form.price <= 0)
      newErrors.price = "Valid price is required";
    if (!form.category) newErrors.category = "Category is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  /* ---------------- Schedule Controls ---------------- */

  const toggleMasterAvailability = () => {
    setForm((prev) => ({ ...prev, isAvailable: !prev.isAvailable }));
  };

  const handleScheduleChange = (day, field, value) => {
    setForm((prev) => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [day]: { ...prev.schedule[day], [field]: value },
      },
    }));
  };

  const toggleAllDays = (available) => {
    const newSchedule = {};
    Object.keys(form.schedule).forEach((day) => {
      newSchedule[day] = { ...form.schedule[day], available };
    });
    setForm({ ...form, schedule: newSchedule });
  };

  /* ---------------- Submit Form ---------------- */

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (!restaurantId) {
      alert("No restaurant profile found. Please create one first.");
      return;
    }

    setSubmitting(true);
    try {
      await API.post("/menu/menu", {
        ...form,
        restaurantId,
      });

      alert("Dish added successfully! 🎉");
      navigate("/restaurant/menu-manager");
    } catch (err) {
      console.error("❌ Failed:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to add dish");
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------------- Loader ---------------- */

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
          <p className="text-gray-700 text-lg font-bold">Loading...</p>
        </div>
      </div>
    );
  }

  /* ---------------- Render UI ---------------- */

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      <motion.div
        className="w-full max-w-7xl mx-auto px-2 sm:px-4 py-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* ---------------- Header ---------------- */}
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
                    Add New Dish
                  </h1>
                  <p className="text-white/90 text-sm mt-1">
                    Create a delicious addition to your menu
                  </p>
                </div>
              </div>
              <div className="hidden sm:block w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-4xl">
                🍽️
              </div>
            </div>
          </div>
        </motion.div>

        {/* ---------------- Form Grid ---------------- */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-10">
            {/* ---------------- LEFT COLUMN ---------------- */}
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
                  <FormField
                    label="Dish Name"
                    icon={<FaUtensils />}
                    error={errors.name}
                    required
                  >
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="e.g., Butter Chicken"
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
                    <FormField
                      label="Price"
                      icon={<FaRupeeSign />}
                      error={errors.price}
                      required
                    >
                      <div className="relative">
                        <FaRupeeSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="number"
                          name="price"
                          min="0"
                          step="0.01"
                          value={form.price}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200"
                        />
                      </div>
                    </FormField>

                    <FormField
                      label="Category"
                      icon={<FaTag />}
                      error={errors.category}
                      required
                    >
                      <select
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200"
                      >
                        <option value="">Select category...</option>
                        {categoryOptions.map((cat) => (
                          <option key={cat}>{cat}</option>
                        ))}
                      </select>
                    </FormField>
                  </div>

                  {/* Image URL */}
                  <FormField label="Image URL" icon={<FaImage />}>
                    <input
                      name="image"
                      value={form.image}
                      onChange={handleChange}
                      placeholder="https://example.com/dish.jpg"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200"
                    />
                  </FormField>
                </div>
              </motion.div>

              {/* ---------------- COLLAPSIBLE SCHEDULE ---------------- */}
              <motion.div
                className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
                layout
              >
                {/* Header */}
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

                {/* Body */}
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

            {/* ---------------- RIGHT COLUMN (Sticky, Not Exceed Height) ---------------- */}
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

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-black text-lg shadow-xl disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {submitting ? (
                  <>
                    <FaSpinner className="animate-spin" /> Adding Dish...
                  </>
                ) : (
                  <>
                    <FaSave /> Add Dish to Menu
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

/* ----------------------------- Components ----------------------------- */

const FormField = ({ label, icon, error, required, children }) => (
  <div>
    <label className="flex items-center gap-2 mb-2 font-bold text-gray-700">
      <span className="text-rose-500">{icon}</span>
      {label} {required && <span className="text-red-500">*</span>}
    </label>

    {children}

    <AnimatePresence>
      {error && (
        <motion.p
          className="mt-2 text-sm text-red-600 flex items-center gap-2 font-semibold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <FaTimesCircle />
          {error}
        </motion.p>
      )}
    </AnimatePresence>
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

export default RestaurantAddDish;

// // src/pages/restaurant/RestaurantAddDish.jsx
// import React, { useState, useContext, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { AuthContext } from "../../context/AuthContext";
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

// const RestaurantAddDish = () => {
//   const navigate = useNavigate();
//   const { user } = useContext(AuthContext);

//   const [restaurantId, setRestaurantId] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const [form, setForm] = useState({
//     name: "",
//     description: "",
//     price: "",
//     category: "",
//     image: "",
//     isAvailable: true,
//     schedule: defaultSchedule,
//   });

//   // ✅ Fetch restaurantId for logged-in restaurant owner
//   useEffect(() => {
//     const fetchRestaurant = async () => {
//       try {
//         const res = await API.get("/restaurants/restaurants/me");
//         if (res.data?.restaurant?._id) {
//           setRestaurantId(res.data.restaurant._id);
//         } else {
//           alert("You must create a restaurant profile first!");
//           navigate("/restaurant/create-profile");
//         }
//       } catch (err) {
//         alert("You must create a restaurant profile first!");
//         navigate("/restaurant/create-profile");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (user?.role === "restaurant") {
//       fetchRestaurant();
//     } else {
//       alert("Only restaurant owners can add dishes!");
//       navigate("/");
//     }
//   }, [user, navigate]);

//   // 📌 Form field change
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

//   // 📌 Submit form
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!restaurantId) {
//       alert("No restaurant profile found. Please create one first.");
//       return;
//     }

//     try {
//       const res = await API.post("/menu/menu", {
//         ...form,
//         restaurantId,
//       });

//       alert("Dish added successfully!");
//       navigate("/restaurant/menu-manager");
//     } catch (err) {
//       console.error(
//         "❌ Failed to add dish:",
//         err.response?.data || err.message
//       );
//       alert("Failed to add dish");
//     }
//   };

//   if (loading) return <p className="text-center">Loading...</p>;

//   return (
//     <div className="max-w-2xl mx-auto p-6 text-gray-800 dark:text-white">
//       <h2 className="text-2xl font-bold mb-4">➕ Add New Dish</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         {/* Dish Details */}
//         <input
//           name="name"
//           value={form.name}
//           onChange={handleChange}
//           placeholder="Dish Name"
//           className="w-full p-2 rounded border dark:bg-gray-800"
//           required
//         />
//         <textarea
//           name="description"
//           value={form.description}
//           onChange={handleChange}
//           placeholder="Description"
//           className="w-full p-2 rounded border dark:bg-gray-800"
//         />
//         <input
//           type="number"
//           name="price"
//           value={form.price}
//           onChange={handleChange}
//           placeholder="Price"
//           className="w-full p-2 rounded border dark:bg-gray-800"
//           required
//         />
//         <input
//           name="category"
//           value={form.category}
//           onChange={handleChange}
//           placeholder="Category (e.g., Starter, Main, Dessert)"
//           className="w-full p-2 rounded border dark:bg-gray-800"
//           required
//         />
//         <input
//           name="image"
//           value={form.image}
//           onChange={handleChange}
//           placeholder="Image URL"
//           className="w-full p-2 rounded border dark:bg-gray-800"
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
//           Add Dish
//         </button>
//       </form>
//     </div>
//   );
// };

// export default RestaurantAddDish;
