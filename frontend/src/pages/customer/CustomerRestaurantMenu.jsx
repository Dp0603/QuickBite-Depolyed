import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { FaStar, FaClock, FaPlus, FaMinus } from "react-icons/fa";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";

const CustomerRestaurantMenu = () => {
  const { id: restaurantId } = useParams();
  const { user } = useContext(AuthContext);

  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurantAndMenu = async () => {
      try {
        const [resRestaurant, resMenu] = await Promise.all([
          API.get(`/restaurants/restaurant/public/${restaurantId}`),
          API.get(`/menu/restaurant/${restaurantId}`),
        ]);
        setRestaurant(resRestaurant.data.restaurant);
        setMenuItems(resMenu.data.menu || []);
      } catch (err) {
        console.error("❌ Failed to fetch menu or restaurant:", err);
      } finally {
        setLoading(false);
      }
    };

    if (restaurantId) fetchRestaurantAndMenu();
  }, [restaurantId]);

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

  const handleRemove = (itemId) => {
    setCart((prev) => {
      const updated = { ...prev };
      if (updated[itemId] > 1) updated[itemId] -= 1;
      else delete updated[itemId];
      return updated;
    });
  };

  const totalItems = Object.values(cart).reduce((sum, q) => sum + q, 0);
  const totalPrice = Object.entries(cart).reduce(
    (total, [id, qty]) =>
      total + qty * (menuItems.find((item) => item._id === id)?.price || 0),
    0
  );

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="p-6 text-gray-800 dark:text-white max-w-6xl mx-auto">
      {/* 🍽️ Restaurant Info */}
      {restaurant && (
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-10">
          <img
            src={restaurant.logo || "/QuickBite.png"}
            alt="Logo"
            className="w-28 h-28 rounded-xl object-cover shadow-md"
          />
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold mb-1">{restaurant.name}</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
              {restaurant.description || "Delicious dishes available."}
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3 text-sm">
              <span className="flex items-center gap-1 text-green-600 font-medium">
                <FaStar /> {restaurant.averageRating || "4.2"}
              </span>
              <span className="flex items-center gap-1 text-yellow-600 font-medium">
                <FaClock /> {restaurant.deliveryTimeEstimate || "30 mins"}
              </span>
              <span className="text-gray-400">₹40 Delivery Fee</span>
            </div>
          </div>
        </div>
      )}

      {/* 🧾 Menu Items */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.length ? (
          menuItems.map((item) => (
            <div
              key={item._id}
              className="p-4 bg-white dark:bg-secondary rounded-xl shadow-sm hover:shadow-md transition border dark:border-gray-700 flex flex-col"
            >
              <img
                src={item.image || "/QuickBite.png"}
                alt={item.name}
                className="w-full h-36 object-cover rounded-md mb-3"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                  {item.description || "No description available."}
                </p>
              </div>
              <div className="flex justify-between items-center mt-4">
                <span className="text-primary text-lg font-bold">
                  ₹{item.price}
                </span>
                {cart[item._id] ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRemove(item._id)}
                      className="w-8 h-8 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-white rounded-full hover:bg-gray-300 dark:hover:bg-gray-500"
                    >
                      <FaMinus />
                    </button>
                    <span className="font-medium">{cart[item._id]}</span>
                    <button
                      onClick={() => handleAdd(item._id)}
                      className="w-8 h-8 bg-primary text-white rounded-full hover:bg-orange-600"
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
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500 dark:text-gray-400 mt-4">
            No menu items available.
          </p>
        )}
      </div>

      {/* 🛒 Floating Cart Summary */}
      {totalItems > 0 && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-primary text-white shadow-lg px-6 py-3 rounded-full flex items-center gap-6 z-50">
          <span>
            🛒 {totalItems} item{totalItems > 1 ? "s" : ""} | ₹
            {totalPrice.toFixed(2)}
          </span>
          <button
            onClick={() => alert("🛒 Redirect to cart page")}
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
