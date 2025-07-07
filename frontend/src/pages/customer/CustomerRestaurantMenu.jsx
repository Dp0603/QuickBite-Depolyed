import React from "react";
import { useParams } from "react-router-dom";

const CustomerRestaurantMenu = () => {
  const { restaurantId } = useParams();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">📜 Menu - {restaurantId}</h1>
      <p className="text-gray-600 dark:text-gray-300">
        View the menu for this restaurant and add items to your cart.
      </p>
    </div>
  );
};

export default CustomerRestaurantMenu;
