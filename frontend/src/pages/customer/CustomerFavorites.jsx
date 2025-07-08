import React, { useState } from "react";
import { FaHeartBroken } from "react-icons/fa";

const initialFavorites = [
  {
    id: 1,
    name: "Pizza Palace",
    image: "/QuickBite.png",
    cuisine: "Italian",
    description: "Classic cheesy pizzas & garlic bread",
    rating: 4.5,
  },
  {
    id: 2,
    name: "Sushi World",
    image: "/QuickBite.png",
    cuisine: "Japanese",
    description: "Fresh sushi rolls & miso soup",
    rating: 4.7,
  },
  {
    id: 3,
    name: "Burger Barn",
    image: "/QuickBite.png",
    cuisine: "American",
    description: "Juicy burgers with loaded fries",
    rating: 4.2,
  },
];

const CustomerFavorites = () => {
  const [favorites, setFavorites] = useState(initialFavorites);

  const handleRemove = (id) => {
    setFavorites((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="p-6 text-gray-800 dark:text-white">
      <h1 className="text-3xl font-bold mb-6">❤️ Your Favorites</h1>

      {favorites.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          No favorites saved yet.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((fav) => (
            <div
              key={fav.id}
              className="bg-white dark:bg-secondary rounded-xl shadow border dark:border-gray-700 overflow-hidden flex flex-col"
            >
              <img
                src={fav.image}
                alt={fav.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-semibold mb-1">{fav.name}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    {fav.cuisine}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    {fav.description}
                  </p>
                  <p className="text-sm text-yellow-500 font-medium mb-4">
                    ⭐ {fav.rating.toFixed(1)} / 5
                  </p>
                </div>

                <button
                  onClick={() => handleRemove(fav.id)}
                  className="mt-auto bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-md flex items-center gap-2 transition"
                >
                  <FaHeartBroken />
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerFavorites;
