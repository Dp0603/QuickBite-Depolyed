import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaTruck,
  FaUtensils,
  FaBox,
  FaEye,
} from "react-icons/fa";
import API from "../../api/axios";

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

const RestaurantOrderCard = ({ order, past = false, setOrders }) => {
  const navigate = useNavigate();
  const [updating, setUpdating] = useState(false);

  const updateStatus = async (status) => {
    setUpdating(true);
    try {
      const res = await API.put(`/orders/orders/status/${order._id}`, {
        orderStatus: status,
      });
      setOrders((prev) =>
        prev.map((o) => (o._id === order._id ? res.data.order : o))
      );
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Error updating order status");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div
      className={`rounded-xl border dark:border-gray-700 shadow-sm hover:shadow-md transition p-5 bg-white dark:bg-secondary ${
        !past ? "border-blue-400" : ""
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold">Order #{order._id.slice(-5)}</h3>
        <span className="text-sm text-gray-500">
          {new Date(order.createdAt).toLocaleString()}
        </span>
      </div>

      {/* Customer Info */}
      {!past && (
        <>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            👤 <strong>{order.customerId?.name || "Customer"}</strong>
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            📍 {order.deliveryAddress?.addressLine},{" "}
            {order.deliveryAddress?.city}
          </p>
        </>
      )}

      {/* Items */}
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
        <strong>Items:</strong>{" "}
        {order.items
          .map((i) => `${i.menuItemId?.name || i.name} × ${i.quantity}`)
          .join(", ")}
      </p>
      <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
        Total: ₹{order.totalAmount}
      </p>

      {/* Status */}
      <span
        className={`inline-block text-xs px-3 py-1 rounded-full font-medium mb-3 ${getStatusColor(
          order.orderStatus
        )}`}
      >
        {order.orderStatus}
      </span>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        {!past && order.orderStatus === "Pending" && (
          <>
            <button
              onClick={() => updateStatus("Preparing")}
              disabled={updating}
              className="flex items-center gap-2 text-sm font-medium bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition disabled:opacity-50"
            >
              <FaCheckCircle /> Accept
            </button>
            <button
              onClick={() => updateStatus("Cancelled")}
              disabled={updating}
              className="flex items-center gap-2 text-sm font-medium bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-md transition disabled:opacity-50"
            >
              <FaTimesCircle /> Reject
            </button>
          </>
        )}

        {order.orderStatus === "Preparing" && (
          <button
            onClick={() => updateStatus("Ready")}
            disabled={updating}
            className="flex items-center gap-2 text-sm font-medium bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md transition disabled:opacity-50"
          >
            <FaUtensils /> Mark Ready
          </button>
        )}

        {order.orderStatus === "Ready" && (
          <button
            onClick={() => updateStatus("Out for Delivery")}
            disabled={updating}
            className="flex items-center gap-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition disabled:opacity-50"
          >
            <FaTruck /> Out for Delivery
          </button>
        )}

        {order.orderStatus === "Out for Delivery" && (
          <button
            onClick={() => updateStatus("Delivered")}
            disabled={updating}
            className="flex items-center gap-2 text-sm font-medium bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md transition disabled:opacity-50"
          >
            <FaBox /> Mark Delivered
          </button>
        )}

        {/* View details button */}
        <button
          onClick={() => navigate(`/restaurant/orders/${order._id}`)}
          className="flex items-center gap-2 text-sm font-medium bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition"
        >
          <FaEye /> View
        </button>
      </div>
    </div>
  );
};

export default RestaurantOrderCard;
