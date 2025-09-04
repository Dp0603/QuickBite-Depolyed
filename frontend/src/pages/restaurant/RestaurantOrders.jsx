import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import API from "../../api/axios";
import RestaurantOrderCard from "./RestaurantOrderCard";

const RestaurantOrders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    if (!user?.restaurantId) return; // 👈 use restaurantId
    setLoading(true);
    try {
      console.log("🔎 Logged in user object:", user);
      const res = await API.get(
        `/orders/orders/restaurant/${user.restaurantId}`
      ); // 👈 fixed
      console.log("📦 Orders API response:", res.data);
      setOrders(res.data.orders);
    } catch (err) {
      console.error("❌ Error fetching restaurant orders:", err);
      alert("Failed to fetch orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const activeOrders = orders.filter(
    (o) => o.orderStatus !== "Delivered" && o.orderStatus !== "Cancelled"
  );
  const pastOrders = orders.filter(
    (o) => o.orderStatus === "Delivered" || o.orderStatus === "Cancelled"
  );

  if (loading)
    return <p className="p-6 text-center">⏳ Loading restaurant orders...</p>;

  return (
    <div className="px-4 md:px-10 py-8 text-gray-800 dark:text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">📦 Restaurant Orders</h1>
        <button
          onClick={fetchOrders}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          🔄 Refresh Orders
        </button>
      </div>

      {/* Active Orders */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">🟢 Active Orders</h2>
        {activeOrders.length === 0 ? (
          <p className="text-gray-500">No active orders currently.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {activeOrders.map((order) => (
              <RestaurantOrderCard
                key={order._id}
                order={order}
                setOrders={setOrders}
              />
            ))}
          </div>
        )}
      </section>

      {/* Past Orders */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">📦 Past Orders</h2>
        {pastOrders.length === 0 ? (
          <p className="text-gray-500">No past orders.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {pastOrders.map((order) => (
              <RestaurantOrderCard
                key={order._id}
                order={order}
                past
                setOrders={setOrders}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default RestaurantOrders;
