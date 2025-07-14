import React, { useEffect, useState, useContext } from "react";
import { FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";

const ITEMS_PER_PAGE = 6;

const RestaurantMenuManager = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchMenu = async () => {
    try {
      const res = await API.get(`/menu/restaurant/${user._id}`);
      setDishes(res.data.data || []);
    } catch (err) {
      console.error("Failed to load menu:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this dish?"
    );
    if (confirmed) {
      try {
        await API.delete(`/menu/${id}`);
        setDishes((prev) => prev.filter((dish) => dish._id !== id));
      } catch (err) {
        console.error("Failed to delete dish:", err);
      }
    }
  };

  useEffect(() => {
    if (user?._id) fetchMenu();
  }, [user]);

  // 🔍 Filter and search logic
  const filteredDishes = dishes.filter((dish) => {
    const matchCategory =
      categoryFilter === "All" || dish.category === categoryFilter;
    const matchSearch = dish.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  const totalPages = Math.ceil(filteredDishes.length / ITEMS_PER_PAGE);
  const displayedDishes = filteredDishes.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const categories = [
    "All",
    ...new Set(dishes.map((d) => d.category || "Uncategorized")),
  ];

  return (
    <div className="p-6 text-gray-800 dark:text-white">
      {/* Page Heading */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">🍽️ Menu Management</h2>
        <button
          onClick={() => navigate("/restaurant/menu/add")}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded hover:bg-orange-600 transition"
        >
          <FaPlus /> Add Dish
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by dish name"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2 rounded border border-gray-300 dark:bg-gray-800 dark:border-gray-600"
        />
        <select
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2 rounded border border-gray-300 dark:bg-gray-800 dark:border-gray-600"
        >
          {categories.map((cat, i) => (
            <option key={i} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Dish Cards */}
      {loading ? (
        <p>Loading...</p>
      ) : filteredDishes.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          No dishes found. Click <strong>Add Dish</strong> to get started!
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedDishes.map((dish) => (
              <div
                key={dish._id}
                className="bg-white dark:bg-secondary rounded-xl shadow hover:shadow-lg overflow-hidden transition"
              >
                <img
                  src={dish.image || "/QuickBite.png"}
                  onError={(e) => (e.target.src = "/QuickBite.png")}
                  alt={dish.name}
                  className="w-full h-32 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{dish.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-300">
                    {dish.category}
                  </p>
                  <p className="text-md font-medium mt-1">₹{dish.price}</p>

                  <div className="flex justify-end gap-3 mt-4">
                    <button
                      onClick={() =>
                        navigate(`/restaurant/menu/edit/${dish._id}`)
                      }
                      className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(dish._id)}
                      className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1"
                    >
                      <FaTrashAlt /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded border ${
                    currentPage === i + 1
                      ? "bg-primary text-white"
                      : "bg-white dark:bg-gray-700 dark:text-white"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RestaurantMenuManager;
