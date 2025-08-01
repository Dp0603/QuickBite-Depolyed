import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import {
  FaCheckCircle,
  FaClock,
  FaMotorcycle,
  FaStore,
  FaComments,
  FaPhoneAlt,
  FaStar,
} from "react-icons/fa";
import API from "../../api/axios";
import { io } from "socket.io-client";
import { AuthContext } from "../../context/AuthContext";

// Full order lifecycle
const orderStatusSteps = [
  { label: "Order Placed", icon: <FaStore /> },
  { label: "Preparing", icon: <FaClock /> },
  { label: "Ready", icon: <FaCheckCircle /> },
  { label: "Out for Delivery", icon: <FaMotorcycle /> },
  { label: "Delivered", icon: <FaCheckCircle /> },
  { label: "Cancelled", icon: <FaCheckCircle /> },
];

const CustomerTrackOrder = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const { user } = useContext(AuthContext);

  // Feedback states
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await API.get(`/orders/orders/${orderId}`);
        setOrder(res.data.order);
      } catch (err) {
        console.error("❌ Error fetching order:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  useEffect(() => {
    const newSocket = io(
      import.meta.env.VITE_SOCKET_URL || "http://localhost:5000",
      {
        transports: ["websocket"],
      }
    );
    setSocket(newSocket);
    newSocket.emit("joinOrderRoom", orderId);

    newSocket.on("orderStatusUpdated", (updatedOrder) => {
      if (updatedOrder._id === orderId) {
        setOrder((prev) => ({
          ...prev,
          orderStatus: updatedOrder.orderStatus,
          eta: updatedOrder.eta,
        }));
      }
    });

    return () => {
      newSocket.emit("leaveOrderRoom", orderId);
      newSocket.disconnect();
    };
  }, [orderId]);

  useEffect(() => {
    if (order?.orderStatus === "Delivered") {
      checkIfFeedbackAlreadyGiven();
    }
  }, [order]);

  const checkIfFeedbackAlreadyGiven = async () => {
    try {
      const res = await API.get("/feedback/check", {
        params: { userId: user._id, orderId: order._id },
      });
      if (!res.data.alreadyGiven) {
        setShowFeedbackForm(true);
      }
    } catch (err) {
      console.error("Error checking feedback:", err);
    }
  };

  const handleFeedbackSubmit = async () => {
    if (!rating) return alert("Please select a rating!");

    try {
      await API.post("/feedback", {
        userId: user._id,
        orderId: order._id,
        restaurantId: order.restaurantId?._id,
        rating,
        comment,
        feedbackType: "order",
      });

      setFeedbackSubmitted(true);
      setShowFeedbackForm(false);
      alert("✅ Thanks for your feedback!");
    } catch (err) {
      console.error("Error submitting feedback:", err);
      alert("Something went wrong. Try again.");
    }
  };

  if (loading) return <p className="p-6 text-center">Loading order...</p>;
  if (!order)
    return <p className="p-6 text-center text-red-500">Order not found.</p>;

  const normalizeStatus = (status) =>
    status === "Pending" ? "Order Placed" : status;
  const normalizedStatus = normalizeStatus(order.orderStatus);
  const isCancelled = normalizedStatus === "Cancelled";

  const visibleSteps = isCancelled
    ? orderStatusSteps.slice(0, 1).concat(orderStatusSteps.slice(-1))
    : orderStatusSteps;

  const currentStepIndex = visibleSteps.findIndex(
    (step) => step.label === normalizedStatus
  );

  const deliveryAgent = order.deliveryDetails?.deliveryAgentId;

  return (
    <div className="p-6 text-gray-800 dark:text-white max-w-4xl mx-auto animate-fade-in">
      <h1 className="text-3xl font-bold mb-6 text-primary">
        📍 Track Your Order
      </h1>

      {/* Order Overview */}
      <div className="bg-white dark:bg-secondary border dark:border-gray-700 shadow rounded-xl p-6 mb-10">
        <div className="flex justify-between flex-wrap gap-6">
          <div>
            <h2 className="text-xl font-semibold">
              {order.restaurantId?.name || "Restaurant"}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              ETA:{" "}
              <span className="text-green-500 font-medium">
                {order.eta || "30 mins"}
              </span>
            </p>
            <p className="text-sm mt-1">
              <strong>Delivering To:</strong>{" "}
              {order.deliveryAddress?.fullAddress || "N/A"}
            </p>
          </div>
          <div className="text-sm">
            <p>
              <strong>Items:</strong>{" "}
              {order.items
                ?.map(
                  (item) =>
                    `${item.menuItemId?.name || "Item"} × ${item.quantity}`
                )
                .join(", ")}
            </p>
            <p className="mt-1 font-medium">
              <strong>Total:</strong> ₹{order.totalAmount?.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Progress Tracker */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Order Status</h2>
        <div className="flex justify-between items-center gap-3 relative">
          {visibleSteps.map((step, index) => {
            const isDone = index <= currentStepIndex;
            const stepColor =
              isCancelled && step.label === "Cancelled"
                ? "bg-rose-500 text-white"
                : isDone
                ? "bg-primary text-white"
                : "bg-gray-300 text-gray-600";

            const lineColor =
              index < currentStepIndex
                ? "bg-primary"
                : isCancelled && step.label === "Cancelled"
                ? "bg-rose-500"
                : "bg-gray-300";

            return (
              <div
                key={step.label}
                className="flex flex-col items-center flex-1 relative"
              >
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 ${stepColor}`}
                >
                  {step.icon}
                </div>
                <p
                  className={`mt-2 text-sm text-center ${
                    isDone ? "font-medium" : "text-gray-500"
                  } ${
                    isCancelled && step.label === "Cancelled"
                      ? "text-rose-500"
                      : "text-primary"
                  }`}
                >
                  {step.label}
                </p>
                {index < visibleSteps.length - 1 && (
                  <div
                    className={`absolute top-5 right-0 w-full h-1 z-[-1] ${lineColor}`}
                  ></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Delivery Partner Info */}
      {deliveryAgent && !isCancelled && (
        <div className="bg-white dark:bg-secondary border dark:border-gray-700 shadow rounded-xl p-6 mb-10">
          <h2 className="text-xl font-semibold mb-4">Your Delivery Partner</h2>
          <div className="flex items-center gap-4">
            <img
              src={deliveryAgent.avatar || "https://i.pravatar.cc/100?img=12"}
              alt={deliveryAgent.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-primary"
            />
            <div className="flex-1">
              <p className="font-medium text-lg">{deliveryAgent.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Vehicle: {deliveryAgent.vehicle || "Not specified"}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Phone: {deliveryAgent.phone || "N/A"}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => alert("Opening chat...")}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md text-sm hover:bg-orange-600 transition"
              >
                <FaComments /> Chat
              </button>
              <button
                onClick={() => alert("Calling...")}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-md text-sm hover:bg-gray-800 transition"
              >
                <FaPhoneAlt /> Call
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ⭐ Feedback Form */}
      {showFeedbackForm && !feedbackSubmitted && (
        <div className="bg-white dark:bg-secondary border dark:border-gray-700 shadow rounded-xl p-6 mb-10">
          <h2 className="text-xl font-semibold mb-4">How was your order?</h2>

          <div className="flex gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((s) => (
              <FaStar
                key={s}
                onClick={() => setRating(s)}
                className={`w-7 h-7 cursor-pointer ${
                  s <= rating ? "text-yellow-400" : "text-gray-300"
                }`}
              />
            ))}
          </div>

          <textarea
            placeholder="Write a short review (optional)..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-3 border rounded-md mb-4 dark:bg-gray-800 dark:border-gray-600"
          ></textarea>

          <button
            onClick={handleFeedbackSubmit}
            className="bg-primary text-white px-5 py-2 rounded hover:bg-orange-600 transition"
          >
            Submit Feedback
          </button>
        </div>
      )}

      {/* Help + Reorder */}
      <div className="flex justify-between flex-wrap gap-4 mt-6">
        <button
          onClick={() => alert("Opening support...")}
          className="w-full md:w-auto bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white px-5 py-3 rounded-lg shadow hover:bg-gray-200 dark:hover:bg-gray-700 transition text-sm font-medium"
        >
          Need Help?
        </button>
        <button
          onClick={() => alert("Reordering...")}
          className="w-full md:w-auto bg-primary text-white px-5 py-3 rounded-lg shadow hover:bg-orange-600 transition text-sm font-medium"
        >
          Reorder This Meal
        </button>
      </div>
    </div>
  );
};

export default CustomerTrackOrder;
