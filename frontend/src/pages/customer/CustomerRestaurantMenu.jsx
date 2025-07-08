import React, { useState } from "react";
import { FaStar, FaClock, FaPlus, FaMinus } from "react-icons/fa";

const menuItems = [
  {
    id: 1,
    name: "Margherita Pizza",
    description: "Classic cheese and tomato pizza with fresh basil.",
    price: 299,
    image: "/QuickBite.png",
  },
  {
    id: 2,
    name: "Pasta Alfredo",
    description: "Creamy white sauce pasta with mushrooms and herbs.",
    price: 349,
    image: "/QuickBite.png",
  },
  {
    id: 3,
    name: "Garlic Bread",
    description: "Toasted bread with garlic butter and herbs.",
    price: 149,
    image: "/QuickBite.png",
  },
];

const CustomerRestaurantMenu = () => {
  const [cart, setCart] = useState({});

  const handleAdd = (itemId) => {
    setCart((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));
  };

  const handleRemove = (itemId) => {
    setCart((prev) => {
      const newCart = { ...prev };
      if (newCart[itemId] > 1) {
        newCart[itemId] -= 1;
      } else {
        delete newCart[itemId];
      }
      return newCart;
    });
  };

  const totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  const totalPrice = Object.entries(cart).reduce(
    (total, [id, qty]) =>
      total + qty * (menuItems.find((item) => item.id === Number(id))?.price || 0),
    0
  );

  return (
    <div className="p-6 text-gray-800 dark:text-white max-w-5xl mx-auto">
      {/* Restaurant Header */}
      <div className="flex flex-col md:flex-row items-center gap-6 mb-10">
        <img
          src="/QuickBite.png"
          alt="Restaurant Logo"
          className="w-24 h-24 rounded-xl object-cover shadow"
        />
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold">Pizza Palace</h1>
          <p className="text-gray-500 dark:text-gray-400">Italian • Pizza • Fast Food</p>
          <div className="flex items-center gap-4 text-sm mt-2">
            <span className="flex items-center gap-1 text-green-600">
              <FaStar /> 4.5
            </span>
            <span className="flex items-center gap-1 text-yellow-600">
              <FaClock /> 30 mins
            </span>
            <span className="text-gray-400">₹40 Delivery Fee</span>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="grid md:grid-cols-2 gap-6 animate-fade-in">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className="p-4 bg-white dark:bg-secondary rounded-xl shadow border dark:border-gray-700 flex gap-4"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-24 h-24 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="text-lg font-bold">{item.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {item.description}
              </p>
              <div className="flex justify-between items-end mt-3">
                <span className="text-primary font-semibold text-lg">₹{item.price}</span>
                {cart[item.id] ? (
                  <div className="flex items-center gap-2">
                    <button
                      className="w-8 h-8 flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white rounded-full"
                      onClick={() => handleRemove(item.id)}
                    >
                      <FaMinus />
                    </button>
                    <span className="font-medium">{cart[item.id]}</span>
                    <button
                      className="w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full"
                      onClick={() => handleAdd(item.id)}
                    >
                      <FaPlus />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleAdd(item.id)}
                    className="bg-primary hover:bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-medium transition"
                  >
                    Add
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Cart Summary */}
      {totalItems > 0 && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-primary text-white shadow-lg px-6 py-3 rounded-full flex items-center gap-6 z-50 animate-fade-in">
          <span>
            🛒 {totalItems} item{totalItems > 1 ? "s" : ""} | ₹{totalPrice}
          </span>
          <button
            onClick={() => alert("Proceeding to cart...")}
            className="bg-white text-primary px-4 py-2 rounded-full text-sm font-semibold hover:bg-gray-100 transition"
          >
            View Cart
          </button>
        </div>
      )}
    </div>
  );
};

export default CustomerRestaurantMenu;
