import React from "react";
import { useParams } from "react-router-dom";
import {
  FaCheckCircle,
  FaClock,
  FaMotorcycle,
  FaStore,
  FaComments,
  FaPhoneAlt,
} from "react-icons/fa";

const orderStatusSteps = [
  { label: "Order Placed", icon: <FaStore /> },
  { label: "Preparing", icon: <FaClock /> },
  { label: "Out for Delivery", icon: <FaMotorcycle /> },
  { label: "Delivered", icon: <FaCheckCircle /> },
];

const dummyOrder = {
  id: "ORD12345",
  restaurant: "Pizza Palace",
  eta: "20 mins",
  currentStatus: "Out for Delivery",
  items: ["Margherita Pizza", "Garlic Bread"],
  address: "123, MG Road, Bangalore",
  total: 499,
  deliveryPerson: {
    name: "Rahul Kumar",
    phone: "+91 98765 43210",
    vehicle: "Scooter - KA03AB1234",
    avatar: "https://i.pravatar.cc/100?img=12", // Random avatar
  },
};

const CustomerTrackOrder = () => {
  const { orderId } = useParams();
  const currentStepIndex = orderStatusSteps.findIndex(
    (step) => step.label === dummyOrder.currentStatus
  );

  return (
    <div className="p-6 text-gray-800 dark:text-white max-w-4xl mx-auto animate-fade-in">
      <h1 className="text-3xl font-bold mb-6 text-primary">
        📍 Track Your Order
      </h1>

      {/* Order Overview */}
      <div className="bg-white dark:bg-secondary border dark:border-gray-700 shadow rounded-xl p-6 mb-10">
        <div className="flex justify-between flex-wrap gap-6">
          <div>
            <h2 className="text-xl font-semibold">{dummyOrder.restaurant}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              ETA:{" "}
              <span className="text-green-500 font-medium">
                {dummyOrder.eta}
              </span>
            </p>
            <p className="text-sm mt-1">
              <strong>Delivering To:</strong> {dummyOrder.address}
            </p>
          </div>
          <div className="text-sm">
            <p>
              <strong>Items:</strong> {dummyOrder.items.join(", ")}
            </p>
            <p className="mt-1 font-medium">
              <strong>Total:</strong> ₹{dummyOrder.total}
            </p>
          </div>
        </div>
      </div>

      {/* Progress Tracker */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Order Status</h2>
        <div className="flex justify-between items-center gap-3 relative">
          {orderStatusSteps.map((step, index) => {
            const isDone = index <= currentStepIndex;

            return (
              <div
                key={step.label}
                className="flex flex-col items-center flex-1 relative"
              >
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 ${
                    isDone
                      ? "bg-primary text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {step.icon}
                </div>
                <p
                  className={`mt-2 text-sm text-center ${
                    isDone ? "text-primary font-medium" : "text-gray-500"
                  }`}
                >
                  {step.label}
                </p>

                {/* Connector line */}
                {index < orderStatusSteps.length - 1 && (
                  <div
                    className={`absolute top-5 right-0 w-full h-1 z-[-1] ${
                      index < currentStepIndex ? "bg-primary" : "bg-gray-300"
                    }`}
                  ></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Delivery Partner Info with Avatar and Chat */}
      <div className="bg-white dark:bg-secondary border dark:border-gray-700 shadow rounded-xl p-6 mb-10">
        <h2 className="text-xl font-semibold mb-4">Your Delivery Partner</h2>
        <div className="flex items-center gap-4">
          <img
            src={dummyOrder.deliveryPerson.avatar}
            alt={dummyOrder.deliveryPerson.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-primary"
          />
          <div className="flex-1">
            <p className="font-medium text-lg">
              {dummyOrder.deliveryPerson.name}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Vehicle: {dummyOrder.deliveryPerson.vehicle}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Phone: {dummyOrder.deliveryPerson.phone}
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
