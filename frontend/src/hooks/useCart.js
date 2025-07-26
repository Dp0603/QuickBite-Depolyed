import { useEffect, useState, useContext } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";

const useCart = () => {
  const { user } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [restaurantId, setRestaurantId] = useState(null);

  useEffect(() => {
    if (user?._id) {
      API.get(`/cart/${user._id}`)
        .then((res) => {
          const items = res.data.cart?.items || [];
          setCartItems(items);
          setRestaurantId(res.data.cart?.restaurantId?._id || null);
        })
        .catch((err) => {
          if (err.response?.status === 404) setCartItems([]);
          else console.error("Error fetching cart:", err);
        });
    }
  }, [user]);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.menuItem.price * item.quantity,
    0
  );
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return {
    cartItems,
    subtotal,
    totalItems,
    restaurantId,
  };
};

export default useCart;
