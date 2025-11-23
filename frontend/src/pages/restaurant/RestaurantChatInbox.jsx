import React, { useEffect, useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCommentDots,
  FaSearch,
  FaFilter,
  FaCheckCircle,
  FaClock,
  FaUser,
  FaChevronRight,
  FaInbox,
  FaExclamationTriangle,
  FaReply,
  FaBell,
  FaEnvelope,
  FaEnvelopeOpen,
  FaSpinner,
  FaTimes,
} from "react-icons/fa";
import { FaChartBar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

/* ------------------------------- Toast Component ------------------------------- */
const Toast = ({ toasts, remove }) => (
  <div className="fixed z-[9999] top-6 right-6 flex flex-col gap-3 max-w-md">
    <AnimatePresence>
      {toasts.map((t) => (
        <motion.div
          key={t.id}
          initial={{ opacity: 0, x: 100, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 100, scale: 0.8 }}
          className={`flex items-start gap-3 p-4 rounded-xl shadow-2xl text-white backdrop-blur-md border ${
            t.type === "success"
              ? "bg-emerald-500/95 border-emerald-400"
              : t.type === "error"
              ? "bg-red-500/95 border-red-400"
              : "bg-blue-500/95 border-blue-400"
          }`}
        >
          <div className="pt-0.5 text-xl">{t.icon}</div>
          <div className="flex-1">
            <div className="font-bold text-sm">{t.title}</div>
            {t.message && (
              <div className="text-xs opacity-90 mt-1">{t.message}</div>
            )}
          </div>
          <motion.button
            onClick={() => remove(t.id)}
            className="opacity-80 hover:opacity-100 font-bold text-lg"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            ✕
          </motion.button>
        </motion.div>
      ))}
    </AnimatePresence>
  </div>
);

/* ------------------------------- Stat Card ------------------------------- */
const StatCard = ({ icon, value, label, gradient, delay, emoji }) => (
  <motion.div
    className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer"
    initial={{ opacity: 0, scale: 0.9, y: 20 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ delay, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
    whileHover={{ scale: 1.03, y: -5 }}
  >
    <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`}></div>

    <motion.div
      className="absolute inset-0 opacity-10"
      animate={{
        backgroundPosition: ["0% 0%", "100% 100%"],
      }}
      transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
      style={{
        backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
        backgroundSize: "30px 30px",
      }}
    />

    <div className="relative z-10 p-6">
      <div className="flex items-start justify-between mb-4">
        <motion.div
          className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-2xl shadow-lg border border-white/30"
          whileHover={{ rotate: 360, scale: 1.1 }}
          transition={{ duration: 0.6 }}
        >
          {icon}
        </motion.div>
        {emoji && <div className="text-3xl">{emoji}</div>}
      </div>

      <motion.h4
        className="text-4xl font-black text-white drop-shadow-lg mb-2"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: delay + 0.2, type: "spring" }}
      >
        {value}
      </motion.h4>
      <p className="text-white/80 font-semibold text-sm">{label}</p>
    </div>
  </motion.div>
);

/* ------------------------------- Status Badge ------------------------------- */
const StatusBadge = ({ replied, unread }) => {
  if (unread) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
        <FaBell className="animate-pulse" />
        New
      </span>
    );
  }

  if (replied) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
        <FaCheckCircle />
        Replied
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">
      <FaClock />
      Pending
    </span>
  );
};

/* ------------------------------- Message Card ------------------------------- */
const MessageCard = ({ message, onClick, index }) => {
  const isUnread = !message.read;
  const isPending = !message.replied;

  return (
    <motion.div
      className={`p-5 rounded-xl border-2 transition-all cursor-pointer ${
        isUnread
          ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 hover:border-blue-400"
          : "bg-white border-gray-200 hover:border-indigo-400"
      }`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.02, x: 4 }}
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
            {message.customer?.charAt(0).toUpperCase() || "U"}
          </div>
          {isUnread && (
            <motion.div
              className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <h4 className="font-bold text-gray-900 flex items-center gap-2">
                {message.customer || "Anonymous User"}
                {isUnread && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500 text-white text-xs font-bold">
                    <FaEnvelope className="text-[10px]" />
                    New
                  </span>
                )}
              </h4>
              <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                <FaClock className="text-xs" />
                {dayjs(message.time || message.createdAt).fromNow()}
              </p>
            </div>

            <StatusBadge replied={message.replied} unread={isUnread} />
          </div>

          <p
            className={`text-gray-700 line-clamp-2 mb-3 ${
              isUnread ? "font-semibold" : ""
            }`}
          >
            {message.message || message.text || "No message content"}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              {message.orderId && (
                <span className="px-2 py-1 rounded-lg bg-gray-100 text-gray-700 font-medium">
                  Order #{message.orderId.slice(-6)}
                </span>
              )}
            </div>

            <motion.div
              className="flex items-center gap-2 text-indigo-600 font-bold text-sm"
              whileHover={{ x: 5 }}
            >
              {isPending ? (
                <>
                  <FaReply />
                  Reply
                </>
              ) : (
                <>
                  <FaEnvelopeOpen />
                  View
                </>
              )}
              <FaChevronRight className="text-xs" />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ------------------------------- Main Component ------------------------------- */
const RestaurantChatInbox = () => {
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all, pending, replied
  const [toasts, setToasts] = useState([]);
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  /* --------------------- Toast System --------------------- */
  const pushToast = (payload) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, ...payload }]);
    setTimeout(() => removeToast(id), 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  /* --------------------- Fetch Messages --------------------- */
  const fetchInbox = async () => {
    try {
      const res = await axios.get("/api/chat/restaurant/inbox", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data.data || []);
      setFilteredMessages(res.data.data || []);
    } catch (err) {
      console.error("Error fetching chat inbox:", err);
      pushToast({
        type: "error",
        title: "Failed to load inbox",
        message: "Please try again later",
        icon: <FaExclamationTriangle />,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInbox();
    const interval = setInterval(fetchInbox, 5000);
    return () => clearInterval(interval);
  }, []);

  /* --------------------- Filter Messages --------------------- */
  useEffect(() => {
    let filtered = messages;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (m) =>
          m.customer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.message?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.text?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter === "pending") {
      filtered = filtered.filter((m) => !m.replied);
    } else if (statusFilter === "replied") {
      filtered = filtered.filter((m) => m.replied);
    }

    setFilteredMessages(filtered);
  }, [searchQuery, statusFilter, messages]);

  /* --------------------- Stats Calculation --------------------- */
  const totalMessages = messages.length;
  const pendingMessages = messages.filter((m) => !m.replied).length;
  const repliedMessages = messages.filter((m) => m.replied).length;
  const unreadMessages = messages.filter((m) => !m.read).length;

  const statCards = [
    {
      icon: <FaInbox />,
      value: totalMessages.toString(),
      label: "Total Messages",
      gradient: "from-blue-500 to-cyan-600",
      emoji: "📨",
    },
    {
      icon: <FaClock />,
      value: pendingMessages.toString(),
      label: "Pending Replies",
      gradient: "from-amber-500 to-orange-600",
      emoji: "⏳",
    },
    {
      icon: <FaCheckCircle />,
      value: repliedMessages.toString(),
      label: "Replied",
      gradient: "from-emerald-500 to-teal-600",
      emoji: "✅",
    },
    {
      icon: <FaBell />,
      value: unreadMessages.toString(),
      label: "Unread",
      gradient: "from-red-500 to-pink-600",
      emoji: "🔔",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      <Toast toasts={toasts} remove={removeToast} />

      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-8 py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Premium Header */}
        <motion.div
          className="relative overflow-hidden rounded-3xl mb-8 shadow-2xl border border-rose-200"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600"></div>
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          />

          <motion.div
            className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], x: [0, 20, 0] }}
            transition={{ duration: 8, repeat: Infinity }}
          />

          <div className="relative z-10 p-8 md:p-10">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <motion.div
                  className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-3xl"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  💬
                </motion.div>
                <div>
                  <h1 className="text-4xl font-black text-white drop-shadow-lg">
                    Customer Chat Inbox
                  </h1>
                  <p className="text-white/90 text-sm font-medium mt-1 flex items-center gap-2">
                    <FaCommentDots />
                    Manage customer conversations and support
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="h-40 rounded-2xl bg-white shadow-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.4, 0.6, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              ))
            : statCards.map((stat, i) => (
                <StatCard
                  key={i}
                  icon={stat.icon}
                  value={stat.value}
                  label={stat.label}
                  gradient={stat.gradient}
                  delay={i * 0.1}
                  emoji={stat.emoji}
                />
              ))}
        </div>

        {/* Filters */}
        <motion.div
          className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white">
              <FaFilter />
            </div>
            <h3 className="text-xl font-black text-gray-900">
              Filter Messages
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by customer name or message..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-300 focus:border-purple-500 focus:outline-none transition-colors font-medium"
              />
              {searchQuery && (
                <motion.button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaTimes />
                </motion.button>
              )}
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-purple-500 focus:outline-none transition-colors font-medium"
            >
              <option value="all">All Messages</option>
              <option value="pending">Pending Replies</option>
              <option value="replied">Replied</option>
            </select>
          </div>
        </motion.div>

        {/* Messages List */}
        <motion.div
          className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="p-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
            <h3 className="text-2xl font-black flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                <FaCommentDots />
              </div>
              Messages ({filteredMessages.length})
            </h3>
          </div>

          <div className="p-6">
            <AnimatePresence mode="wait">
              {loading ? (
                <LoadingState key="loading" />
              ) : filteredMessages.length === 0 ? (
                <EmptyState
                  key="empty"
                  searchQuery={searchQuery}
                  onReset={() => {
                    setSearchQuery("");
                    setStatusFilter("all");
                  }}
                />
              ) : (
                <motion.div
                  key="messages"
                  className="space-y-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {filteredMessages.map((message, index) => (
                    <MessageCard
                      key={message._id}
                      message={message}
                      index={index}
                      onClick={() =>
                        navigate(`/restaurant/chat/${message._id}`)
                      }
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Quick Stats Footer */}
        {!loading && filteredMessages.length > 0 && (
          <motion.div
            className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white shadow-2xl relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
          >
            <motion.div
              className="absolute inset-0 opacity-20"
              animate={{
                background: [
                  "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.8) 0%, transparent 50%)",
                  "radial-gradient(circle at 80% 50%, rgba(255,255,255,0.8) 0%, transparent 50%)",
                  "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.8) 0%, transparent 50%)",
                ],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />

            <div className="relative z-10">
              <h3 className="text-2xl font-black mb-4 flex items-center gap-2">
                <FaChartBar />
                Quick Insights
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                  <p className="text-white/80 text-sm font-semibold mb-1">
                    Response Rate
                  </p>
                  <p className="text-3xl font-black">
                    {totalMessages > 0
                      ? Math.round((repliedMessages / totalMessages) * 100)
                      : 0}
                    %
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                  <p className="text-white/80 text-sm font-semibold mb-1">
                    Avg Response Time
                  </p>
                  <p className="text-3xl font-black">~15 min</p>
                </div>
                <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                  <p className="text-white/80 text-sm font-semibold mb-1">
                    Satisfaction Score
                  </p>
                  <p className="text-3xl font-black">4.8 ⭐</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

/* ------------------------------- Sub Components ------------------------------- */

const LoadingState = () => (
  <div className="flex flex-col items-center justify-center py-20">
    <motion.div
      className="relative w-16 h-16 mb-4"
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
    >
      <div className="absolute inset-0 border-4 border-indigo-200 rounded-full"></div>
      <div className="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
    </motion.div>
    <p className="text-gray-600 font-semibold">Loading messages...</p>
  </div>
);

const EmptyState = ({ searchQuery, onReset }) => (
  <motion.div
    className="flex flex-col items-center justify-center py-20 text-center"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
  >
    <motion.div
      className="text-8xl mb-4"
      animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      💬
    </motion.div>
    <h4 className="text-2xl font-black text-gray-800 mb-2">
      {searchQuery ? "No Messages Found" : "No Messages Yet"}
    </h4>
    <p className="text-gray-500 text-lg mb-6">
      {searchQuery
        ? "Try adjusting your search or filters"
        : "Customer messages will appear here"}
    </p>
    {searchQuery && (
      <motion.button
        onClick={onReset}
        className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold shadow-lg hover:shadow-xl transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Clear Filters
      </motion.button>
    )}
  </motion.div>
);

export default RestaurantChatInbox;

// import React, { useEffect, useState, useContext } from "react";
// import axios from "axios";
// import { FaCommentDots } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
// import { AuthContext } from "../../context/AuthContext"; // ✅ Make sure path is correct

// const RestaurantChatInbox = () => {
//   const [msgs, setMsgs] = useState([]);
//   const navigate = useNavigate();
//   const { token } = useContext(AuthContext); // ✅ Access token from context

//   const fetchInbox = async () => {
//     try {
//       const res = await axios.get("/api/chat/restaurant/inbox", {
//         headers: {
//           Authorization: `Bearer ${token}`, // ✅ Set auth header
//         },
//       });
//       setMsgs(res.data.data);
//     } catch (err) {
//       console.error("Error fetching chat inbox:", err);
//       toast.error("Failed to load inbox");
//     }
//   };

//   useEffect(() => {
//     fetchInbox();
//     const interval = setInterval(fetchInbox, 5000);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-800 dark:text-white">
//       <h2 className="text-3xl font-bold flex items-center gap-2 mb-4">
//         <FaCommentDots className="text-primary" />
//         Customer Chat Inbox
//       </h2>

//       <div className="bg-white dark:bg-secondary rounded-xl shadow divide-y">
//         {msgs.map((m) => (
//           <div
//             key={m._id}
//             className="p-5 flex justify-between items-start hover:bg-gray-100 dark:hover:bg-secondary/70 cursor-pointer"
//             onClick={() => navigate(`/restaurant/chat/${m._id}`)}
//           >
//             <div>
//               <p className="font-semibold">{m.customer}</p>
//               <p className="text-sm">{m.message}</p>
//               <span className="text-xs text-gray-400">{m.time}</span>
//             </div>
//             <span
//               className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                 m.replied
//                   ? "bg-green-100 text-green-700"
//                   : "bg-yellow-100 text-yellow-700"
//               }`}
//             >
//               {m.replied ? "Replied" : "Pending"}
//             </span>
//           </div>
//         ))}

//         {msgs.length === 0 && (
//           <div className="p-6 text-center text-gray-400">No messages yet.</div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default RestaurantChatInbox;
