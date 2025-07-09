import React, { useState } from "react";
import { FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const RestaurantMenuManager = () => {
  const navigate = useNavigate();

  const [dishes, setDishes] = useState([
    {
      id: 1,
      name: "Paneer Butter Masala",
      price: 250,
      category: "Main Course",
      image: "/QuickBite.png",
    },
    {
      id: 2,
      name: "Veg Biryani",
      price: 200,
      category: "Rice",
      image: "/QuickBite.png",
    },
    {
      id: 3,
      name: "Chole Bhature",
      price: 150,
      category: "Snacks",
      image: "/QuickBite.png",
    },
  ]);

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this dish?"
    );
    if (confirmed) {
      setDishes((prev) => prev.filter((dish) => dish.id !== id));
    }
  };

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

      {/* Dish Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dishes.map((dish) => (
          <div
            key={dish.id}
            className="bg-white dark:bg-secondary rounded-xl shadow hover:shadow-lg overflow-hidden transition"
          >
            <img
              src={dish.image}
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
                  onClick={() => navigate(`/restaurant/menu/edit/${dish.id}`)}
                  className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                >
                  <FaEdit /> Edit
                </button>
                <button
                  onClick={() => handleDelete(dish.id)}
                  className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1"
                >
                  <FaTrashAlt /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {dishes.length === 0 && (
        <div className="text-center text-gray-500 mt-10">
          No dishes available. Click <strong>Add Dish</strong> to get started!
        </div>
      )}
    </div>
  );
};

export default RestaurantMenuManager;
