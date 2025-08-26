import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/axios";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaTimesCircle,
  FaTruck,
  FaUtensils,
  FaBox,
  FaRedo,
} from "react-icons/fa";

const getStatusColor = (status) => {
  switch (status) {
    case "Pending":
      return "bg-slate-200 text-slate-800 border border-slate-300";
    case "Preparing":
      return "bg-yellow-100 text-yellow-800 border border-yellow-300";
    case "Ready":
      return "bg-orange-100 text-orange-800 border border-orange-300";
    case "Out for Delivery":
      return "bg-sky-100 text-sky-800 border border-sky-300";
    case "Delivered":
      return "bg-green-100 text-green-800 border border-green-300";
    case "Cancelled":
      return "bg-rose-100 text-rose-800 border border-rose-300";
    default:
      return "bg-gray-100 text-gray-700 border border-gray-300";
  }
};

const RestaurantOrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    if (!orderId) return;
    setLoading(true);
    try {
      const res = await API.get(`/orders/orders/${orderId}`);
      setOrder(res.data.order);
    } catch (err) {
      console.error("Error fetching order details:", err);
      alert("Failed to fetch order details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const updateStatus = async (status) => {
    if (!order) return;
    try {
      const res = await API.put(`/orders/orders/status/${order._id}`, {
        orderStatus: status,
      });
      setOrder(res.data.order);
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Error updating order status");
    }
  };

  if (loading || !order)
    return <p className="p-6 text-center">Loading order details...</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 text-gray-800 dark:text-white">
      <h1 className="text-3xl font-bold mb-6">📄 Order Details</h1>

      {/* Customer Info */}
      <div className="bg-white dark:bg-secondary shadow rounded-lg p-6 mb-6">
        <p>
          <strong>Customer:</strong> {order.customerId?.name}
        </p>
        <p>
          <strong>Address:</strong> {order.deliveryAddress?.fullAddress}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          <span
            className={`inline-block px-3 py-1 rounded-full ${getStatusColor(
              order.orderStatus
            )}`}
          >
            {order.orderStatus}
          </span>
        </p>
        {order.customerNote && (
          <p className="text-sm italic text-gray-500 dark:text-gray-400 mt-2">
            Note: {order.customerNote}
          </p>
        )}
        {order.paymentStatus && (
          <p className="mt-2">
            <strong>Payment:</strong> {order.paymentStatus} (
            {order.paymentMethod})
          </p>
        )}
      </div>

      {/* Items Ordered */}
      <div className="bg-white dark:bg-secondary shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">🍽 Items Ordered</h2>
        <ul className="divide-y divide-gray-200 dark:divide-gray-600">
          {order.items.map((item) => (
            <li key={item._id} className="py-2 flex justify-between">
              <span>
                {item.menuItemId?.name || item.name} × {item.quantity}
              </span>
              <span>₹{(item.price || item.menuItemId?.price).toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Total */}
      <div className="bg-white dark:bg-secondary shadow rounded-lg p-6 mb-6 flex justify-between font-bold text-lg">
        <span>Total:</span>
        <span>₹{Number(order.totalAmount).toFixed(2)}</span>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 mb-6">
        {/* Status update buttons */}
        {order.orderStatus === "Pending" && (
          <>
            <button
              onClick={() => updateStatus("Preparing")}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
            >
              <FaCheckCircle /> Accept
            </button>
            <button
              onClick={() => updateStatus("Cancelled")}
              className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-md"
            >
              <FaTimesCircle /> Reject
            </button>
          </>
        )}

        {order.orderStatus === "Preparing" && (
          <button
            onClick={() => updateStatus("Ready")}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md"
          >
            <FaUtensils /> Mark Ready
          </button>
        )}

        {order.orderStatus === "Ready" && (
          <button
            onClick={() => updateStatus("Out for Delivery")}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
          >
            <FaTruck /> Out for Delivery
          </button>
        )}

        {order.orderStatus === "Out for Delivery" && (
          <button
            onClick={() => updateStatus("Delivered")}
            className="flex items-center gap-2 px-4 py-2 bg-green-700 hover:bg-green-800 text-white rounded-md"
          >
            <FaBox /> Mark Delivered
          </button>
        )}

        {/* Refresh */}
        <button
          onClick={fetchOrder}
          className="flex items-center gap-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md"
        >
          <FaRedo /> Refresh
        </button>

        {/* Back */}
        <button
          onClick={() => navigate("/restaurant/orders")}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          <FaArrowLeft /> Back
        </button>
      </div>
    </div>
  );
};

export default RestaurantOrderDetails;
