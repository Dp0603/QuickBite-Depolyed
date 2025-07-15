import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { FaCommentDots } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AuthContext } from "../../context/AuthContext"; // ✅ Make sure path is correct

const RestaurantChatInbox = () => {
  const [msgs, setMsgs] = useState([]);
  const navigate = useNavigate();
  const { token } = useContext(AuthContext); // ✅ Access token from context

  const fetchInbox = async () => {
    try {
      const res = await axios.get("/api/chat/restaurant/inbox", {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Set auth header
        },
      });
      setMsgs(res.data.data);
    } catch (err) {
      console.error("Error fetching chat inbox:", err);
      toast.error("Failed to load inbox");
    }
  };

  useEffect(() => {
    fetchInbox();
    const interval = setInterval(fetchInbox, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-800 dark:text-white">
      <h2 className="text-3xl font-bold flex items-center gap-2 mb-4">
        <FaCommentDots className="text-primary" />
        Customer Chat Inbox
      </h2>

      <div className="bg-white dark:bg-secondary rounded-xl shadow divide-y">
        {msgs.map((m) => (
          <div
            key={m._id}
            className="p-5 flex justify-between items-start hover:bg-gray-100 dark:hover:bg-secondary/70 cursor-pointer"
            onClick={() => navigate(`/restaurant/chat/${m._id}`)}
          >
            <div>
              <p className="font-semibold">{m.customer}</p>
              <p className="text-sm">{m.message}</p>
              <span className="text-xs text-gray-400">{m.time}</span>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                m.replied
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {m.replied ? "Replied" : "Pending"}
            </span>
          </div>
        ))}

        {msgs.length === 0 && (
          <div className="p-6 text-center text-gray-400">No messages yet.</div>
        )}
      </div>
    </div>
  );
};

export default RestaurantChatInbox;
