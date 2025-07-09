import React, { useState } from "react";

const dummyMessages = [
  {
    id: 1,
    customer: "Anjali Sharma",
    message: "Is Jain food available?",
    time: "2 mins ago",
    replied: false,
  },
  {
    id: 2,
    customer: "Ravi Kumar",
    message: "Order taking too long...",
    time: "10 mins ago",
    replied: true,
  },
];

const RestaurantChatInbox = () => {
  const [messages] = useState(dummyMessages);

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow max-w-3xl mx-auto my-6">
      <h2 className="text-xl font-semibold mb-4">Customer Messages</h2>
      <ul className="divide-y dark:divide-gray-700">
        {messages.map((msg) => (
          <li key={msg.id} className="py-4 flex justify-between items-start">
            <div>
              <p className="font-medium">{msg.customer}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {msg.message}
              </p>
              <span className="text-xs text-gray-400">{msg.time}</span>
            </div>
            <span
              className={`text-xs px-3 py-1 rounded-full ${
                msg.replied
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {msg.replied ? "Replied" : "Pending"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RestaurantChatInbox;
