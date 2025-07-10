import React, { useState } from "react";
import { FaCommentDots } from "react-icons/fa";

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
    <div className="px-6 py-8 min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-white">
      <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
        {/* Heading */}
        <h2 className="text-3xl font-bold flex items-center gap-2">
          <FaCommentDots className="text-primary" />
          Customer Messages
        </h2>

        {/* Message List */}
        <div className="bg-white dark:bg-secondary rounded-xl shadow divide-y divide-gray-100 dark:divide-gray-700">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="p-5 flex justify-between items-start hover:bg-accent dark:hover:bg-secondary/70 transition"
            >
              {/* Left side */}
              <div className="space-y-1">
                <p className="font-semibold text-base">{msg.customer}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {msg.message}
                </p>
                <span className="text-xs text-gray-400">{msg.time}</span>
              </div>

              {/* Right side - badge */}
              <div className="flex items-center gap-3">
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    msg.replied
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {msg.replied ? "Replied" : "Pending"}
                </span>

                {/* Optional future reply button */}
                <button
                  className="text-sm text-primary font-medium hover:underline hidden sm:inline"
                  disabled={msg.replied}
                >
                  {msg.replied ? "" : "Reply"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RestaurantChatInbox;
