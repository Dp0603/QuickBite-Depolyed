import React, { useEffect, useState } from "react";
import {
  FaEdit,
  FaTrashAlt,
  FaPlus,
  FaToggleOn,
  FaToggleOff,
  FaSearch,
  FaFilter,
  FaUtensils,
  FaFire,
  FaLeaf,
  FaClock,
  FaChevronLeft,
  FaChevronRight,
  FaImage,
  FaStar,
  FaEye,
  FaEyeSlash,
  FaRupeeSign,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import API from "../../api/axios";

const ITEMS_PER_PAGE = 6;

const RestaurantMenuManager = () => {
  const navigate = useNavigate();

  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  // 🔥 DELETE MODAL STATES
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState(null);

  // Fetch restaurant → then menu
  const fetchMenu = async () => {
    try {
      const profileRes = await API.get("/restaurants/restaurants/me");
      const restaurantId = profileRes.data.restaurant._id;

      const res = await API.get(`/menu/restaurant/${restaurantId}/menu`);
      setDishes(res.data.menu || []);
    } catch (error) {
      console.error("❌ Failed to load menu:", error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  // 🗑️ Delete dish (CONFIRMED)
  const handleDelete = async () => {
    if (!selectedDish) return;

    try {
      await API.delete(`/menu/menu/${selectedDish._id}`);
      setDishes((prev) => prev.filter((dish) => dish._id !== selectedDish._id));
      setDeleteModalOpen(false);
      setSelectedDish(null);
    } catch (err) {
      console.error("❌ Failed to delete dish:", err.response?.data || err);
    }
  };

  // 🚦 Toggle availability
  const handleToggleAvailability = async (id) => {
    try {
      const res = await API.patch(`/menu/menu/toggle/${id}`);
      const updatedDish = res.data.menuItem;

      setDishes((prev) =>
        prev.map((dish) => (dish._id === id ? updatedDish : dish))
      );
    } catch (err) {
      console.error(
        "❌ Failed to toggle availability:",
        err.response?.data || err
      );
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  // 🔍 Filter + Search
  const filteredDishes = dishes.filter((dish) => {
    const matchCategory =
      categoryFilter === "All" || dish.category === categoryFilter;
    const matchSearch = dish.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  // 📑 Pagination
  const totalPages = Math.ceil(filteredDishes.length / ITEMS_PER_PAGE);

  const displayedDishes = filteredDishes.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const categories = [
    "All",
    ...new Set(dishes.map((d) => d.category || "Uncategorized")),
  ];

  const availableCount = dishes.filter((d) => d.isAvailable).length;
  const unavailableCount = dishes.length - availableCount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      <motion.div
        className="px-4 sm:px-8 md:px-10 lg:px-12 py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Premium Header */}
        <motion.div
          className="relative overflow-hidden rounded-3xl mb-8 shadow-2xl border border-rose-200"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-rose-600 via-pink-600 to-purple-600"></div>

          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
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
              >
                <div className="flex items-center gap-3 mb-3">
                  <motion.div
                    className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-3xl"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    🍽️
                  </motion.div>
                  <div>
                    <h1 className="text-4xl font-black text-white">
                      Menu Management
                    </h1>
                    <p className="text-white/90 text-sm font-medium mt-1">
                      Manage your culinary offerings
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.button
                onClick={() => navigate("/restaurant/menu/add")}
                className="px-8 py-4 rounded-xl bg-white/95 backdrop-blur-xl shadow-2xl font-bold text-rose-600 hover:bg-white transition-all flex items-center gap-2 border border-white/50"
                whileHover={{ scale: 1.05 }}
              >
                <FaPlus /> Add New Dish
              </motion.button>
            </div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <StatCard
                icon={<FaUtensils />}
                value={dishes.length}
                label="Total Dishes"
                gradient="from-teal-500 to-emerald-600"
              />
              <StatCard
                icon={<FaFire />}
                value={availableCount}
                label="Available"
                gradient="from-emerald-500 to-green-600"
              />
              <StatCard
                icon={<FaEyeSlash />}
                value={unavailableCount}
                label="Unavailable"
                gradient="from-amber-500 to-orange-600"
              />
              <StatCard
                icon={<FaFilter />}
                value={categories.length - 1}
                label="Categories"
                gradient="from-indigo-500 to-purple-600"
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <FaSearch className="text-rose-500" />
            <h3 className="text-lg font-black text-gray-800">
              Search & Filter
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by dish name..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 font-medium focus:border-rose-400"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 font-medium focus:border-rose-400 cursor-pointer"
              >
                {categories.map((cat, i) => (
                  <option key={i} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {(searchTerm || categoryFilter !== "All") && (
            <motion.div
              className="mt-4 flex flex-wrap gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {searchTerm && (
                <span className="px-4 py-2 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-sm font-semibold flex items-center gap-2">
                  Search: "{searchTerm}"
                  <button onClick={() => setSearchTerm("")}>×</button>
                </span>
              )}
              {categoryFilter !== "All" && (
                <span className="px-4 py-2 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-sm font-semibold flex items-center gap-2">
                  Category: {categoryFilter}
                  <button onClick={() => setCategoryFilter("All")}>×</button>
                </span>
              )}
            </motion.div>
          )}
        </motion.div>
        {/* Dish Grid */}
        {loading ? (
          <LoadingState />
        ) : filteredDishes.length === 0 ? (
          <EmptyState onAddDish={() => navigate("/restaurant/menu/add")} />
        ) : (
          <>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <AnimatePresence mode="popLayout">
                {displayedDishes.map((dish, index) => (
                  <DishCard
                    key={dish._id}
                    dish={dish}
                    index={index}
                    onToggle={handleToggleAvailability}
                    onEdit={() => navigate(`/restaurant/menu/edit/${dish._id}`)}
                    onDelete={() => {
                      setSelectedDish(dish);
                      setDeleteModalOpen(true);
                    }}
                  />
                ))}
              </AnimatePresence>
            </motion.div>

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </motion.div>

      {/* ---------------- DELETE CONFIRM MODAL ---------------- */}
      <AnimatePresence>
        {deleteModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Modal Box */}
            <motion.div
              className="bg-white rounded-3xl shadow-2xl border border-gray-200 w-full max-w-md overflow-hidden"
              initial={{ scale: 0.8, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 40 }}
              transition={{ duration: 0.25 }}
            >
              {/* Gradient Header */}
              <div className="p-6 bg-gradient-to-r from-rose-600 to-pink-600 text-white">
                <h2 className="text-xl font-black flex items-center gap-2">
                  <FaTrashAlt /> Delete Dish
                </h2>
                <p className="text-white/90 text-sm mt-1">
                  This action cannot be undone.
                </p>
              </div>

              {/* Body */}
              <div className="p-6">
                <p className="text-gray-700 font-medium mb-4">
                  Are you sure you want to delete{" "}
                  <span className="font-bold text-rose-600">
                    {selectedDish?.name}
                  </span>
                  ?
                </p>

                {/* Actions */}
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setSelectedDish(null);
                      setDeleteModalOpen(false);
                    }}
                    className="px-5 py-2 rounded-xl bg-gray-100 border border-gray-300 text-gray-700 font-semibold hover:bg-gray-200 transition"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleDelete}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold shadow-md hover:shadow-lg transition flex items-center gap-2"
                  >
                    <FaTrashAlt />
                    Delete Dish
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ------------------------------- Components ------------------------------- */

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

const DishCard = ({ dish, index, onToggle, onEdit, onDelete }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      className="group bg-white rounded-2xl shadow-lg border-2 border-gray-200 hover:border-rose-300 hover:shadow-2xl overflow-hidden transition-all"
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -20 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      whileHover={{ y: -8 }}
      layout
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        {!imageError && dish.image ? (
          <motion.img
            src={dish.image}
            onError={() => setImageError(true)}
            alt={dish.name}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.5 }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <FaUtensils className="text-gray-400 text-6xl" />
            </motion.div>
          </div>
        )}

        {/* Availability Badge */}
        <motion.div
          className={`absolute top-3 right-3 px-3 py-1.5 rounded-full backdrop-blur-md shadow-lg border flex items-center gap-1.5 font-bold text-sm ${
            dish.isAvailable
              ? "bg-emerald-500/90 border-emerald-300 text-white"
              : "bg-red-500/90 border-red-300 text-white"
          }`}
          whileHover={{ scale: 1.1 }}
        >
          {dish.isAvailable ? <FaEye /> : <FaEyeSlash />}
          {dish.isAvailable ? "Available" : "Unavailable"}
        </motion.div>

        {/* Category Badge */}
        <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-full bg-black/60 text-white text-xs font-bold shadow-lg border border-white/20">
          {dish.category || "Uncategorized"}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-black text-xl text-gray-900 mb-2 truncate">
          {dish.name}
        </h3>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FaRupeeSign className="text-rose-600" />
            <span className="text-2xl font-black text-rose-700">
              {dish.price}
            </span>
          </div>

          {dish.rating && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-50 border border-amber-200">
              <FaStar className="text-amber-500 text-sm" />
              <span className="text-sm font-bold text-amber-700">
                {dish.rating}
              </span>
            </div>
          )}
        </div>

        {dish.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {dish.description}
          </p>
        )}

        {dish.schedule && (
          <div className="mb-4 p-3 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200">
            <div className="flex items-center gap-2 mb-2">
              <FaClock className="text-indigo-600 text-sm" />
              <p className="text-xs font-bold text-indigo-700">
                Availability Schedule
              </p>
            </div>

            <div className="space-y-1">
              {Object.entries(dish.schedule)
                .slice(0, 2)
                .map(([day, data]) => (
                  <div key={day} className="text-xs text-gray-700">
                    {data.available ? (
                      <>
                        <span className="capitalize font-semibold">{day}:</span>{" "}
                        {data.startTime} - {data.endTime}
                      </>
                    ) : (
                      <span className="line-through opacity-60 capitalize">
                        {day}: Closed
                      </span>
                    )}
                  </div>
                ))}

              {Object.keys(dish.schedule).length > 2 && (
                <p className="text-xs text-indigo-600 font-semibold">
                  +{Object.keys(dish.schedule).length - 2} more days
                </p>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <motion.button
            onClick={() => onToggle(dish._id)}
            className={`flex-1 px-4 py-3 rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 ${
              dish.isAvailable
                ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white"
                : "bg-gradient-to-r from-emerald-500 to-teal-600 text-white"
            }`}
            whileHover={{ scale: 1.05 }}
          >
            {dish.isAvailable ? <FaToggleOn /> : <FaToggleOff />} Toggle
          </motion.button>

          <motion.button
            onClick={onEdit}
            className="px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <FaEdit />
          </motion.button>

          <motion.button
            onClick={onDelete}
            className="px-4 py-3 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <FaTrashAlt />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

/* ---------------- EMPTY STATE ---------------- */
const EmptyState = ({ onAddDish }) => (
  <motion.div
    className="text-center py-20 bg-white rounded-3xl shadow-xl border border-gray-200"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
  >
    <motion.div
      className="text-9xl mb-6"
      animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      🍽️
    </motion.div>
    <h3 className="text-3xl font-black text-gray-800 mb-3">No Dishes Found</h3>
    <p className="text-gray-600 mb-8 text-lg">
      Start building your menu by adding your first dish!
    </p>

    <motion.button
      onClick={onAddDish}
      className="px-8 py-4 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold shadow-xl flex items-center gap-2 mx-auto"
      whileHover={{ scale: 1.05, y: -2 }}
    >
      <FaPlus /> Add Your First Dish
    </motion.button>
  </motion.div>
);

/* ---------------- LOADING STATE ---------------- */
const LoadingState = () => (
  <div className="flex items-center justify-center py-20">
    <motion.div className="text-center">
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
        Loading your delicious menu...
      </motion.p>
    </motion.div>
  </div>
);

/* ---------------- PAGINATION ---------------- */
const Pagination = ({ currentPage, totalPages, onPageChange }) => (
  <motion.div
    className="flex items-center justify-center gap-2"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    <motion.button
      onClick={() => onPageChange(Math.max(1, currentPage - 1))}
      disabled={currentPage === 1}
      className="w-10 h-10 rounded-xl bg-white shadow-md border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 disabled:opacity-50"
      whileHover={{ scale: currentPage === 1 ? 1 : 1.1 }}
    >
      <FaChevronLeft />
    </motion.button>

    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
      <motion.button
        key={page}
        onClick={() => onPageChange(page)}
        className={`w-10 h-10 rounded-xl font-bold shadow-md ${
          currentPage === page
            ? "bg-gradient-to-r from-rose-500 to-pink-600 text-white"
            : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
        }`}
        whileHover={{ scale: 1.1 }}
      >
        {page}
      </motion.button>
    ))}

    <motion.button
      onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
      disabled={currentPage === totalPages}
      className="w-10 h-10 rounded-xl bg-white shadow-md border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 disabled:opacity-50"
      whileHover={{ scale: currentPage === totalPages ? 1 : 1.1 }}
    >
      <FaChevronRight />
    </motion.button>
  </motion.div>
);

export default RestaurantMenuManager;

// // src/pages/restaurant/RestaurantMenuManager.jsx
// import React, { useEffect, useState } from "react";
// import {
//   FaEdit,
//   FaTrashAlt,
//   FaPlus,
//   FaToggleOn,
//   FaToggleOff,
// } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import API from "../../api/axios";

// const ITEMS_PER_PAGE = 6;

// const RestaurantMenuManager = () => {
//   const navigate = useNavigate();

//   const [dishes, setDishes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [categoryFilter, setCategoryFilter] = useState("All");
//   const [currentPage, setCurrentPage] = useState(1);

//   // ✅ Fetch restaurant → then fetch menu
//   const fetchMenu = async () => {
//     try {
//       console.log("📡 Fetching restaurant profile...");
//       const profileRes = await API.get("/restaurants/restaurants/me");
//       const restaurantId = profileRes.data.restaurant._id;
//       console.log("✅ Restaurant profile:", profileRes.data);

//       console.log("📡 Fetching menu for restaurant:", restaurantId);
//       const res = await API.get(`/menu/restaurant/${restaurantId}/menu`);
//       console.log("✅ Menu loaded:", res.data);

//       setDishes(res.data.menu || []);
//     } catch (error) {
//       console.error("❌ Failed to load menu:", error.response?.data || error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🗑️ Delete dish
//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this dish?")) return;

//     try {
//       await API.delete(`/menu/menu/${id}`);
//       setDishes((prev) => prev.filter((dish) => dish._id !== id));
//       console.log(`🗑️ Dish ${id} deleted successfully`);
//     } catch (err) {
//       console.error("❌ Failed to delete dish:", err.response?.data || err);
//     }
//   };

//   // 🚦 Toggle availability
//   const handleToggleAvailability = async (id) => {
//     try {
//       const res = await API.patch(`/menu/menu/toggle/${id}`);
//       const updatedDish = res.data.menuItem;
//       setDishes((prev) =>
//         prev.map((dish) => (dish._id === id ? updatedDish : dish))
//       );
//       console.log("✅ Availability toggled:", updatedDish);
//     } catch (err) {
//       console.error(
//         "❌ Failed to toggle availability:",
//         err.response?.data || err
//       );
//     }
//   };

//   useEffect(() => {
//     fetchMenu();
//   }, []);

//   // 🔍 Filter + Search
//   const filteredDishes = dishes.filter((dish) => {
//     const matchCategory =
//       categoryFilter === "All" || dish.category === categoryFilter;
//     const matchSearch = dish.name
//       .toLowerCase()
//       .includes(searchTerm.toLowerCase());
//     return matchCategory && matchSearch;
//   });

//   // 📑 Pagination
//   const totalPages = Math.ceil(filteredDishes.length / ITEMS_PER_PAGE);
//   const displayedDishes = filteredDishes.slice(
//     (currentPage - 1) * ITEMS_PER_PAGE,
//     currentPage * ITEMS_PER_PAGE
//   );

//   const categories = [
//     "All",
//     ...new Set(dishes.map((d) => d.category || "Uncategorized")),
//   ];

//   // 🗓️ Small schedule preview (for owner awareness)
//   const renderSchedulePreview = (schedule) => {
//     if (!schedule) return null;
//     return (
//       <div className="mt-2 text-xs text-gray-500 dark:text-gray-300">
//         {Object.entries(schedule).map(([day, data]) =>
//           data.available ? (
//             <div key={day}>
//               <span className="capitalize">{day}:</span> {data.startTime} -{" "}
//               {data.endTime}
//             </div>
//           ) : (
//             <div key={day} className="capitalize line-through opacity-60">
//               {day}: Closed
//             </div>
//           )
//         )}
//       </div>
//     );
//   };

//   return (
//     <div className="p-6 text-gray-800 dark:text-white">
//       {/* Page Heading */}
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold">🍽️ Menu Management</h2>
//         <button
//           onClick={() => navigate("/restaurant/menu/add")}
//           className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded hover:bg-orange-600 transition"
//         >
//           <FaPlus /> Add Dish
//         </button>
//       </div>

//       {/* Filters */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
//         <input
//           type="text"
//           placeholder="Search by dish name"
//           value={searchTerm}
//           onChange={(e) => {
//             setSearchTerm(e.target.value);
//             setCurrentPage(1);
//           }}
//           className="px-4 py-2 rounded border border-gray-300 dark:bg-gray-800 dark:border-gray-600"
//         />
//         <select
//           value={categoryFilter}
//           onChange={(e) => {
//             setCategoryFilter(e.target.value);
//             setCurrentPage(1);
//           }}
//           className="px-4 py-2 rounded border border-gray-300 dark:bg-gray-800 dark:border-gray-600"
//         >
//           {categories.map((cat, i) => (
//             <option key={i} value={cat}>
//               {cat}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Dish Cards */}
//       {loading ? (
//         <p>Loading...</p>
//       ) : filteredDishes.length === 0 ? (
//         <div className="text-center text-gray-500 mt-10">
//           No dishes found. Click <strong>Add Dish</strong> to get started!
//         </div>
//       ) : (
//         <>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {displayedDishes.map((dish) => (
//               <div
//                 key={dish._id}
//                 className="bg-white dark:bg-secondary rounded-xl shadow hover:shadow-lg overflow-hidden transition"
//               >
//                 <img
//                   src={dish.image || "/QuickBite.png"}
//                   onError={(e) => (e.target.src = "/QuickBite.png")}
//                   alt={dish.name}
//                   className="w-full h-32 object-cover"
//                 />
//                 <div className="p-4">
//                   <h3 className="font-semibold text-lg">{dish.name}</h3>
//                   <p className="text-sm text-gray-500 dark:text-gray-300">
//                     {dish.category}
//                   </p>
//                   <p className="text-md font-medium mt-1">₹{dish.price}</p>

//                   {/* Availability + Schedule */}
//                   <div className="mt-2 flex items-center gap-2">
//                     {dish.isAvailable ? (
//                       <span className="text-green-600 font-semibold text-sm flex items-center gap-1">
//                         <FaToggleOn /> Available
//                       </span>
//                     ) : (
//                       <span className="text-red-600 font-semibold text-sm flex items-center gap-1">
//                         <FaToggleOff /> Unavailable
//                       </span>
//                     )}
//                   </div>
//                   {renderSchedulePreview(dish.schedule)}

//                   {/* Actions */}
//                   <div className="flex justify-end gap-3 mt-4">
//                     <button
//                       onClick={() => handleToggleAvailability(dish._id)}
//                       className="text-yellow-600 hover:text-yellow-800 text-sm flex items-center gap-1"
//                     >
//                       Toggle
//                     </button>
//                     <button
//                       onClick={() =>
//                         navigate(`/restaurant/menu/edit/${dish._id}`)
//                       }
//                       className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
//                     >
//                       <FaEdit /> Edit
//                     </button>
//                     <button
//                       onClick={() => handleDelete(dish._id)}
//                       className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1"
//                     >
//                       <FaTrashAlt /> Delete
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Pagination */}
//           {totalPages > 1 && (
//             <div className="mt-6 flex justify-center gap-2">
//               {Array.from({ length: totalPages }, (_, i) => (
//                 <button
//                   key={i}
//                   onClick={() => setCurrentPage(i + 1)}
//                   className={`px-3 py-1 rounded border ${
//                     currentPage === i + 1
//                       ? "bg-primary text-white"
//                       : "bg-white dark:bg-gray-700 dark:text-white"
//                   }`}
//                 >
//                   {i + 1}
//                 </button>
//               ))}
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default RestaurantMenuManager;
