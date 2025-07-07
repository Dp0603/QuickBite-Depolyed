import React from "react";
import { useParams } from "react-router-dom";

const CustomerTrackOrder = () => {
  const { orderId } = useParams();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">📦 Track Order - {orderId}</h1>
      <p className="text-gray-600 dark:text-gray-300">
        View live updates for your ongoing order delivery.
      </p>
    </div>
  );
};

export default CustomerTrackOrder;
