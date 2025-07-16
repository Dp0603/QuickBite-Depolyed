import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { FaStar, FaClock, FaPlus, FaMinus } from "react-icons/fa";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";

const CustomerRestaurantMenu = () => {
  const { restaurantId } = useParams();
  const { user } = useContext(AuthContext);
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState({});

  // Fetch menu from backend
  useEffect(() => {
    if (restaurantId) {
      API.get(`/menu/restaurant/${restaurantId}`)
        .then((res) => setMenuItems(res.data.data))
        .catch((err) => console.error("❌ Error fetching menu:", err));
    }
  }, [restaurantId]);

  // ✅ Add item to backend cart
  const handleAdd = async (itemId) => {
    try {
      await API.post("/cart/add", {
        userId: user._id,
        foodId: itemId,
        quantity: 1,
      });

      setCart((prev) => ({
        ...prev,
        [itemId]: (prev[itemId] || 0) + 1,
      }));
    } catch (err) {
      console.error("❌ Error adding to cart:", err);
    }
  };

  // ✅ Remove or decrement from cart (backend logic optional for now)
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
      total + qty * (menuItems.find((item) => item._id === id)?.price || 0),
    0
  );

  return (
    <div className="p-6 text-gray-800 dark:text-white max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center gap-6 mb-10">
        <img
          src="/QuickBite.png"
          alt="Restaurant Logo"
          className="w-24 h-24 rounded-xl object-cover shadow"
        />
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold">Restaurant Menu</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Delicious dishes at your fingertips.
          </p>
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
        {menuItems.length > 0 ? (
          menuItems.map((item) => (
            <div
              key={item._id}
              className="p-4 bg-white dark:bg-secondary rounded-xl shadow border dark:border-gray-700 flex gap-4"
            >
              <img
                src={item.image || "/QuickBite.png"}
                alt={item.name}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="text-lg font-bold">{item.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {item.description || "No description"}
                </p>
                <div className="flex justify-between items-end mt-3">
                  <span className="text-primary font-semibold text-lg">
                    ₹{item.price}
                  </span>
                  {cart[item._id] ? (
                    <div className="flex items-center gap-2">
                      <button
                        className="w-8 h-8 flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white rounded-full"
                        onClick={() => handleRemove(item._id)}
                      >
                        <FaMinus />
                      </button>
                      <span className="font-medium">{cart[item._id]}</span>
                      <button
                        className="w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full"
                        onClick={() => handleAdd(item._id)}
                      >
                        <FaPlus />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleAdd(item._id)}
                      className="bg-primary hover:bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-medium transition"
                    >
                      Add
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400 col-span-full text-center mt-6">
            No menu items available.
          </p>
        )}
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
