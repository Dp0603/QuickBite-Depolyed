import React, { createContext, useState, useEffect, useContext } from "react";
import API from "../api/axios";
import { AuthContext } from "./AuthContext";
import { useToast } from "./ToastContext";

// Create context
export const CartContext = createContext();

// Provider component
export default function CartProvider({ children }) {
  const { user } = useContext(AuthContext);
  const { success, error, warning } = useToast();
  const [cartItems, setCartItems] = useState([]);
  const [cartUpdated, setCartUpdated] = useState(false);
  const [restaurantId, setRestaurantId] = useState(null);
  const [restaurantName, setRestaurantName] = useState("");
  const [premiumSummary, setPremiumSummary] = useState({});
  const [loading, setLoading] = useState(false);

  // ✅ Fetch cart from backend
  const fetchCart = async () => {
    if (!user?._id) return;
    setLoading(true);
    try {
      const res = await API.get(`/cart/${user._id}`);
      const cart = res.data.cart || {};

      setCartItems(cart.items || []);
      setRestaurantId(cart.restaurantId?._id || null);
      setRestaurantName(cart.restaurantId?.name || "");
      setPremiumSummary(cart.premiumSummary || {});
    } catch (err) {
      console.error("❌ Error fetching cart:", err.response?.data || err);
      setCartItems([]);
      setRestaurantId(null);
      setRestaurantName("");
      setPremiumSummary({});
    } finally {
      setLoading(false);
    }
  };

  // 🧠 Add item to cart
  const addToCart = async (
    menuItemId,
    restaurantId,
    quantity = 1,
    note = ""
  ) => {
    if (!user?._id) return error("You must be logged in to add items.");

    try {
      await API.post(`/cart/${user._id}/${restaurantId}/item/${menuItemId}`, {
        quantity,
        note,
        applyPremium: true,
      });
      await fetchCart();
      success("Item added to cart!");
    } catch (err) {
      console.error("❌ Add to cart failed:", err.response?.data || err);
      error("Failed to add item to cart.");
    }
  };

  // ➕ Increment quantity
  const increment = async (
    menuItemId,
    currentQty,
    note = "",
    restId = restaurantId
  ) => {
    try {
      // ✅ update UI immediately
      setCartItems((prev) =>
        prev.map((item) =>
          item.menuItem._id === menuItemId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );

      // ✅ signal update for Navbar
      setCartUpdated((prev) => !prev);

      // 🔄 sync with backend
      await API.post(`/cart/${user._id}/${restId}/item/${menuItemId}`, {
        quantity: currentQty + 1,
        note,
        applyPremium: true,
      });

      fetchCart(); // optional re-sync for accuracy
    } catch (err) {
      console.error("Increment failed:", err);
    }
  };

  // ➖ Decrement quantity
  const decrement = async (
    menuItemId,
    currentQty,
    note = "",
    restId = restaurantId
  ) => {
    if (currentQty === 1) return;
    try {
      // ✅ update UI immediately
      setCartItems((prev) =>
        prev.map((item) =>
          item.menuItem._id === menuItemId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      );

      // ✅ signal update
      setCartUpdated((prev) => !prev);

      // 🔄 sync with backend
      await API.post(`/cart/${user._id}/${restId}/item/${menuItemId}`, {
        quantity: currentQty - 1,
        note,
        applyPremium: true,
      });

      fetchCart();
    } catch (err) {
      console.error("Decrement failed:", err);
    }
  };

  // ❌ Remove item (robust, with Undo + rollback)
  const removeItem = async (menuItemId, itemData = null) => {
    // Try to determine a reliable restaurant id to use in the API call:
    // 1) explicit context restaurantId (preferred)
    // 2) provided itemData (if it contains restaurant info)
    // 3) derive from current cartItems (first item's restaurant if present)
    const resolvedRestaurantId =
      restaurantId ||
      itemData?.restaurantId ||
      itemData?.menuItem?.restaurantId ||
      cartItems?.[0]?.restaurantId ||
      cartItems?.[0]?.menuItem?.restaurantId ||
      null;

    if (!resolvedRestaurantId) {
      // Can't safely call backend without a restaurant id.
      error("Unable to remove item: missing restaurant information.");
      return;
    }

    const removedItem =
      itemData || cartItems.find((i) => i.menuItem._id === menuItemId);
    if (!removedItem) {
      // If we don't find the removed item locally, attempt to re-sync
      await fetchCart();
      warning("Item not found locally. Cart refreshed.");
      return;
    }

    // Keep a snapshot to allow rollback if backend fails
    const snapshot = cartItems.slice();

    try {
      // 1) Remove locally immediately (gives instant UI feedback)
      setCartItems((prev) =>
        prev.filter((item) => item.menuItem._id !== menuItemId)
      );
      setCartUpdated((prev) => !prev);

      // 2) Call backend to delete
      await API.delete(
        `/cart/${user._id}/${resolvedRestaurantId}/item/${menuItemId}`
      );

      // 3) After successful delete, show Undo toast which can restore the item
      warning(`${removedItem.menuItem?.name || removedItem.name} removed`, {
        description: "Item removed from your cart.",
        // Undo action: re-add the same item with same note/quantity
        action: {
          label: "Undo",
          onClick: async () => {
            try {
              // Re-add the item (restore same quantity/note if available)
              await API.post(
                `/cart/${user._id}/${resolvedRestaurantId}/item/${menuItemId}`,
                {
                  quantity: removedItem.quantity || 1,
                  note: removedItem.note || "",
                  applyPremium: true,
                }
              );

              // Re-sync
              await fetchCart();
              setCartUpdated((prev) => !prev);
              success(
                `${
                  removedItem.menuItem?.name || removedItem.name
                } restored to cart.`
              );
            } catch (err) {
              console.error("❌ Undo failed:", err);
              error("Couldn't restore the item. Please try again.");
              // Re-fetch to get accurate state
              await fetchCart();
            }
          },
        },
      });

      // final sync (optional - ensures server canonical state)
      await fetchCart();
    } catch (err) {
      console.error("❌ Error removing item:", err);
      error("Failed to remove item. Cart refreshed.");

      // rollback UI to previous snapshot if backend failed
      setCartItems(snapshot);
      setCartUpdated((prev) => !prev);

      // re-sync with backend to get canonical state
      await fetchCart();
    }
  };

  // Clear cart (optional)
  const clearCart = async () => {
    try {
      await API.delete(`/cart/${user._id}`);
      setCartItems([]);
      setRestaurantId(null);
      setRestaurantName("");
      success("Cart cleared.");
    } catch (err) {
      console.error("Clear cart failed:", err);
    }
  };

  // Auto-fetch cart when user logs in
  useEffect(() => {
    if (user?._id) fetchCart();
  }, [user]);

  // Computed values
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.menuItem.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        totalItems,
        subtotal,
        restaurantId,
        restaurantName,
        premiumSummary,
        fetchCart,
        addToCart,
        increment,
        decrement,
        removeItem,
        clearCart,
        loading,
        cartUpdated,
        setCartUpdated, // ✅ new
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
