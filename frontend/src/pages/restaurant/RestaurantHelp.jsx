import React, { useEffect, useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSearch,
  FaPhoneAlt,
  FaWhatsapp,
  FaEnvelope,
  FaUtensils,
  FaConciergeBell,
  FaCreditCard,
  FaGift,
  FaQuestionCircle,
  FaChevronDown,
  FaPaperclip,
  FaPaperPlane,
  FaExclamationCircle,
  FaRegClock,
  FaCheckCircle,
  FaTimes,
  FaSpinner,
  FaTicketAlt,
  FaLifeRing,
  FaHeadset,
  FaCheckDouble,
  FaImage,
} from "react-icons/fa";

/* ===== Icon Mapping ===== */
const iconMap = {
  FaUtensils: <FaUtensils />,
  FaConciergeBell: <FaConciergeBell />,
  FaCreditCard: <FaCreditCard />,
  FaGift: <FaGift />,
};

/* ===== Toast Component ===== */
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
            t.type === "error"
              ? "bg-red-500/95 border-red-400"
              : "bg-emerald-500/95 border-emerald-400"
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

/* ===== Status Badge ===== */
const StatusBadge = React.memo(({ status = "pending" }) => {
  const configs = {
    pending: {
      bg: "bg-amber-100 text-amber-800 border-amber-200",
      icon: <FaRegClock />,
    },
    "in-progress": {
      bg: "bg-blue-100 text-blue-800 border-blue-200",
      icon: <FaSpinner />,
    },
    resolved: {
      bg: "bg-emerald-100 text-emerald-800 border-emerald-200",
      icon: <FaCheckCircle />,
    },
    closed: {
      bg: "bg-gray-100 text-gray-800 border-gray-200",
      icon: <FaCheckDouble />,
    },
  };

  const config = configs[status] || configs.pending;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${config.bg}`}
    >
      {config.icon}
      <span className="capitalize">{status.replace("-", " ")}</span>
    </span>
  );
});

/* ===== FAQ Accordion ===== */
const FAQAccordion = React.memo(({ data = [], searchTerm = "" }) => {
  const [expanded, setExpanded] = useState({});
  const toggle = (cat) => setExpanded((p) => ({ ...p, [cat]: !p[cat] }));

  const highlight = useCallback(
    (text) => {
      if (!searchTerm) return text;
      const regex = new RegExp(`(${searchTerm})`, "gi");
      return text.split(regex).map((part, i) =>
        regex.test(part) ? (
          <span key={i} className="bg-yellow-200 px-1 rounded">
            {part}
          </span>
        ) : (
          part
        )
      );
    },
    [searchTerm]
  );

  if (!data.length) {
    return (
      <motion.div
        className="text-center py-12 bg-white rounded-2xl shadow-lg border border-gray-200"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <FaQuestionCircle className="text-6xl text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 font-semibold">
          {searchTerm ? "No matching FAQs found" : "No FAQs available"}
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {data.map((cat, idx) => (
        <motion.div
          key={`${cat.category}-${idx}`}
          className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg hover:shadow-xl overflow-hidden transition-all"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          whileHover={{ y: -2 }}
        >
          <motion.button
            onClick={() => toggle(cat.category)}
            className="flex justify-between items-center w-full p-5 text-left hover:bg-gray-50 transition-all"
            whileHover={{ backgroundColor: "rgb(249 250 251)" }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white text-lg shadow-md">
                {iconMap[cat.icon] || <FaQuestionCircle />}
              </div>
              <div>
                <span className="font-black text-gray-900 text-lg">
                  {highlight(cat.category)}
                </span>
                {cat.items?.length && (
                  <span className="ml-2 text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 font-bold">
                    {cat.items.length} questions
                  </span>
                )}
              </div>
            </div>
            <motion.div
              animate={{ rotate: expanded[cat.category] ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <FaChevronDown className="text-gray-400" />
            </motion.div>
          </motion.button>

          <AnimatePresence>
            {expanded[cat.category] && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="border-t-2 border-gray-200 overflow-hidden"
              >
                <div className="divide-y divide-gray-200">
                  {cat.items?.map((item, i) => (
                    <motion.div
                      key={i}
                      className="p-5 hover:bg-gradient-to-r hover:from-rose-50 hover:to-pink-50 transition-all"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <p className="font-bold text-gray-900 mb-2 flex items-start gap-2">
                        <FaQuestionCircle className="text-rose-500 mt-1 flex-shrink-0" />
                        <span>{highlight(item.question)}</span>
                      </p>
                      <p className="text-sm text-gray-600 leading-relaxed ml-7">
                        {highlight(item.answer)}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
});

/* ===== Debounce Hook ===== */
function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

/* ===== Main Component ===== */
export default function RestaurantHelp({ currentUser }) {
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const [faqLoading, setFaqLoading] = useState(true);
  const [faqs, setFaqs] = useState([]);
  const [activeTab, setActiveTab] = useState("faqs");

  const [form, setForm] = useState({
    name: storedUser.name || currentUser?.name || "",
    email: storedUser.email || currentUser?.email || "",
    issueType: "",
    message: "",
  });

  const [attachment, setAttachment] = useState(null);
  const [preview, setPreview] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [toasts, setToasts] = useState([]);

  const [tickets, setTickets] = useState([]);
  const [ticketsLoading, setTicketsLoading] = useState(false);

  const MAX_FILE_SIZE_MB = 5;

  /* --------------------- Toast System --------------------- */
  const pushToast = (payload) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, ...payload }]);
    setTimeout(() => removeToast(id), 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  /* --------------------- Fetch FAQs --------------------- */
  useEffect(() => {
    let isMounted = true;
    setFaqLoading(true);
    fetch("/api/helpsupport/restaurant/faqs")
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then((data) => {
        if (isMounted) setFaqs(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (isMounted) {
          pushToast({
            type: "error",
            title: "Failed to load FAQs",
            icon: <FaExclamationCircle />,
          });
          setFaqs([]);
        }
      })
      .finally(() => isMounted && setFaqLoading(false));
    return () => {
      isMounted = false;
    };
  }, []);

  /* --------------------- Filter FAQs --------------------- */
  const filteredFaqs = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();
    if (!q) return faqs;
    return faqs
      .map((cat) => {
        const matchesCat = cat.category?.toLowerCase().includes(q);
        const items = (cat.items || []).filter((i) =>
          i.question?.toLowerCase().includes(q)
        );
        if (matchesCat || items.length) {
          return { ...cat, items: matchesCat ? cat.items : items };
        }
        return null;
      })
      .filter(Boolean);
  }, [faqs, debouncedSearch]);

  /* --------------------- File Handler --------------------- */
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      pushToast({
        type: "error",
        title: `File size must be under ${MAX_FILE_SIZE_MB}MB`,
        icon: <FaExclamationCircle />,
      });
      return;
    }
    setAttachment(file);
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (ev) => setPreview(ev.target.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const removeAttachment = () => {
    setAttachment(null);
    setPreview(null);
  };

  /* --------------------- Submit Form --------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("email", form.email);
      fd.append("issue", form.issueType);
      fd.append("message", form.message);
      if (attachment) fd.append("attachment", attachment);

      const token = localStorage.getItem("token");
      const res = await fetch("/api/helpsupport/restaurant/submit", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        pushToast({
          type: "success",
          title: "Request submitted successfully!",
          message: data.message,
          icon: <FaCheckCircle />,
        });
        setForm({ ...form, issueType: "", message: "" });
        removeAttachment();
      } else {
        pushToast({
          type: "error",
          title: "Submission failed",
          message: data.message,
          icon: <FaExclamationCircle />,
        });
      }
    } catch {
      pushToast({
        type: "error",
        title: "Network error",
        message: "Please check your connection",
        icon: <FaExclamationCircle />,
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  /* --------------------- Load Tickets --------------------- */
  const loadTickets = useCallback(async () => {
    setTicketsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/helpsupport/restaurant/tickets", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setTickets(Array.isArray(data) ? data : []);
      else {
        pushToast({
          type: "error",
          title: "Failed to load tickets",
          icon: <FaExclamationCircle />,
        });
      }
    } catch {
      pushToast({
        type: "error",
        title: "Network error",
        icon: <FaExclamationCircle />,
      });
    } finally {
      setTicketsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "tickets") loadTickets();
  }, [activeTab, loadTickets]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      <Toast toasts={toasts} remove={removeToast} />

      <motion.div
        className="max-w-6xl mx-auto px-4 sm:px-8 py-8"
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
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600"></div>
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
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  💬
                </motion.div>
                <div>
                  <h1 className="text-4xl font-black text-white drop-shadow-lg">
                    Help & Support
                  </h1>
                  <p className="text-white/90 text-sm font-medium mt-1">
                    Get assistance with orders, reservations, or feedback
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-3 gap-4 mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <StatCard
                icon={<FaLifeRing />}
                label="24/7 Support"
                gradient="from-teal-500 to-emerald-600"
              />
              <StatCard
                icon={<FaHeadset />}
                label="Live Chat"
                gradient="from-blue-500 to-cyan-600"
              />
              <StatCard
                icon={<FaTicketAlt />}
                label="Ticket System"
                gradient="from-rose-500 to-pink-600"
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          className="flex gap-3 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {[
            { key: "faqs", label: "FAQs", icon: <FaQuestionCircle /> },
            { key: "tickets", label: "My Requests", icon: <FaTicketAlt /> },
          ].map((t) => (
            <motion.button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm shadow-lg transition-all ${
                activeTab === t.key
                  ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              {t.icon}
              {t.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Search Bar */}
        {activeTab === "faqs" && (
          <motion.div
            className="relative mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="text"
              placeholder="Search help topics..."
              className="w-full pl-14 pr-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-indigo-400 focus:outline-none transition-all font-medium shadow-lg"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </motion.div>
        )}

        {/* FAQs Tab */}
        {activeTab === "faqs" && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            {faqLoading ? (
              <LoadingState message="Loading FAQs..." />
            ) : (
              <FAQAccordion data={filteredFaqs} searchTerm={debouncedSearch} />
            )}
          </motion.section>
        )}

        {/* Tickets Tab */}
        {activeTab === "tickets" && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            {ticketsLoading ? (
              <LoadingState message="Loading your requests..." />
            ) : tickets.length ? (
              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {tickets.map((t, index) => (
                    <TicketCard
                      key={t.ticketId || t._id}
                      ticket={t}
                      index={index}
                    />
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <EmptyState
                icon="🎫"
                title="No Support Requests"
                message="You haven't submitted any support requests yet"
              />
            )}
          </motion.section>
        )}

        {/* Support Form */}
        <motion.section
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-rose-500 to-pink-600 text-white">
              <h2 className="text-2xl font-black flex items-center gap-2">
                <FaPaperPlane />
                Submit a Support Request
              </h2>
              <p className="text-white/80 text-sm mt-1">
                Can't find what you're looking for? Send us a message
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField label="Your Name" required>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-400 focus:outline-none transition-all font-medium"
                    required
                  />
                </FormField>

                <FormField label="Your Email" required>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-400 focus:outline-none transition-all font-medium"
                    required
                  />
                </FormField>
              </div>

              <FormField label="Issue Type" required>
                <select
                  value={form.issueType}
                  onChange={(e) =>
                    setForm({ ...form, issueType: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-400 focus:outline-none transition-all font-medium appearance-none cursor-pointer"
                  required
                >
                  <option value="">Select an issue type...</option>
                  <option value="reservation">Reservation Issues</option>
                  <option value="order">Order Problems</option>
                  <option value="payment">Payment & Billing</option>
                  <option value="menu">Menu Questions</option>
                  <option value="service">Service Feedback</option>
                  <option value="other">Other</option>
                </select>
              </FormField>

              <FormField label="Message" required>
                <textarea
                  placeholder="Describe your issue in detail..."
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-400 focus:outline-none transition-all font-medium resize-none"
                  rows="5"
                  required
                />
              </FormField>

              {/* File Upload */}
              <div className="space-y-3">
                <label className="block font-bold text-gray-700 text-sm">
                  Attachment (Optional)
                </label>
                <div className="flex items-center gap-3">
                  <label
                    htmlFor="fileInput"
                    className="flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-dashed border-gray-300 hover:border-indigo-400 cursor-pointer transition-all font-medium hover:bg-indigo-50"
                  >
                    <FaPaperclip className="text-indigo-500" />
                    <span className="text-sm">
                      Attach file (max {MAX_FILE_SIZE_MB}MB)
                    </span>
                  </label>
                  <input
                    id="fileInput"
                    type="file"
                    className="hidden"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                  />
                  {attachment && (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-50 border border-indigo-200">
                      <FaImage className="text-indigo-500" />
                      <span className="text-sm font-medium text-indigo-700 truncate max-w-xs">
                        {attachment.name}
                      </span>
                      <motion.button
                        type="button"
                        onClick={removeAttachment}
                        className="text-red-500 hover:text-red-700"
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FaTimes />
                      </motion.button>
                    </div>
                  )}
                </div>

                {preview && (
                  <motion.img
                    src={preview}
                    alt="Preview"
                    className="mt-3 max-h-40 rounded-xl border-2 border-gray-200 shadow-md"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  />
                )}
              </div>

              <motion.button
                type="submit"
                disabled={submitLoading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-black text-lg shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                whileHover={{
                  scale: submitLoading ? 1 : 1.02,
                  y: submitLoading ? 0 : -2,
                }}
                whileTap={{ scale: submitLoading ? 1 : 0.98 }}
              >
                {submitLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <FaSpinner />
                    </motion.div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <FaPaperPlane /> Submit Request
                  </>
                )}
              </motion.button>
            </form>
          </div>
        </motion.section>

        {/* Contact Section */}
        <motion.section
          className="mt-8 bg-white rounded-2xl shadow-xl border border-gray-200 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <h2 className="text-xl font-black text-gray-800 mb-4 flex items-center gap-2">
            <FaHeadset className="text-indigo-500" />
            Contact Us Directly
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ContactLink
              href="tel:+91XXXXXXXXXX"
              icon={<FaPhoneAlt />}
              label="Call Us"
              value="+91 XXXXX-XXXXX"
              gradient="from-blue-500 to-cyan-600"
            />
            <ContactLink
              href="https://wa.me/15550001111"
              icon={<FaWhatsapp />}
              label="WhatsApp"
              value="Chat Now"
              gradient="from-green-500 to-emerald-600"
            />
            <ContactLink
              href="mailto:restaurant.support@quickbite.com"
              icon={<FaEnvelope />}
              label="Email"
              value="support@quickbite.com"
              gradient="from-rose-500 to-pink-600"
            />
          </div>
        </motion.section>
      </motion.div>
    </div>
  );
}

/* ------------------------------- Sub Components ------------------------------- */

const StatCard = ({ icon, label, gradient }) => (
  <motion.div
    className="px-4 py-3 rounded-xl bg-white/90 backdrop-blur-md shadow-lg border border-white/50"
    whileHover={{ scale: 1.05, y: -2 }}
  >
    <div className="flex items-center gap-2">
      <div
        className={`w-8 h-8 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-md text-sm`}
      >
        {icon}
      </div>
      <p className="text-xs text-gray-900 font-bold">{label}</p>
    </div>
  </motion.div>
);

const FormField = ({ label, required, children }) => (
  <div>
    <label className="block font-bold text-gray-700 mb-2 text-sm">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    {children}
  </div>
);

const TicketCard = ({ ticket, index }) => (
  <motion.div
    className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 hover:border-indigo-300 hover:shadow-xl overflow-hidden transition-all"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ delay: index * 0.1 }}
    whileHover={{ y: -4 }}
    layout
  >
    <div className="p-5">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
            #
          </div>
          <div>
            <p className="font-black text-gray-900">
              Ticket #{ticket.ticketId || ticket._id?.slice(-6)}
            </p>
            <p className="text-xs text-gray-500 font-semibold">
              {ticket.createdAt
                ? new Intl.DateTimeFormat("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(new Date(ticket.createdAt))
                : ""}
            </p>
          </div>
        </div>
        <StatusBadge status={ticket.status} />
      </div>

      <div className="space-y-2">
        <div className="flex items-start gap-2">
          <FaQuestionCircle className="text-gray-400 mt-1 flex-shrink-0" />
          <div>
            <p className="text-sm font-bold text-gray-700">Issue Type</p>
            <p className="text-sm text-gray-900 capitalize">{ticket.issue}</p>
          </div>
        </div>

        {ticket.message && (
          <div className="flex items-start gap-2">
            <FaEnvelope className="text-gray-400 mt-1 flex-shrink-0" />
            <div>
              <p className="text-sm font-bold text-gray-700">Message</p>
              <p className="text-sm text-gray-600 leading-relaxed">
                {ticket.message}
              </p>
            </div>
          </div>
        )}
      </div>

      {ticket.attachmentUrl && (
        <motion.a
          href={ticket.attachmentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-sm transition-all"
          whileHover={{ scale: 1.05, x: 5 }}
        >
          <FaPaperclip />
          View Attachment
        </motion.a>
      )}
    </div>
  </motion.div>
);

const ContactLink = ({ href, icon, label, value, gradient }) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-gray-50 to-slate-50 border-2 border-gray-200 hover:border-indigo-300 transition-all"
    whileHover={{ scale: 1.03, y: -2 }}
    whileTap={{ scale: 0.98 }}
  >
    <div
      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-xl shadow-md`}
    >
      {icon}
    </div>
    <div>
      <p className="text-xs text-gray-600 font-semibold">{label}</p>
      <p className="font-bold text-gray-900">{value}</p>
    </div>
  </motion.a>
);

const LoadingState = ({ message }) => (
  <div className="flex items-center justify-center py-20">
    <motion.div
      className="text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="relative w-20 h-20 mx-auto mb-6"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute inset-0 border-4 border-indigo-200 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
      </motion.div>
      <p className="text-gray-700 font-bold">{message}</p>
    </motion.div>
  </div>
);

const EmptyState = ({ icon, title, message }) => (
  <motion.div
    className="text-center py-20 bg-white rounded-2xl shadow-xl border border-gray-200"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
  >
    <motion.div
      className="text-8xl mb-4"
      animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      {icon}
    </motion.div>
    <h3 className="text-2xl font-black text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600">{message}</p>
  </motion.div>
);


// import React, { useEffect, useMemo, useState, useCallback } from "react";
// import {
//   FaSearch,
//   FaPhoneAlt,
//   FaWhatsapp,
//   FaEnvelope,
//   FaUtensils,
//   FaConciergeBell,
//   FaCreditCard,
//   FaGift,
//   FaQuestionCircle,
//   FaChevronDown,
//   FaPaperclip,
//   FaPaperPlane,
//   FaExclamationCircle,
//   FaRegClock,
//   FaCheckCircle,
// } from "react-icons/fa";

// // ===== Icon Mapping =====
// const iconMap = {
//   FaUtensils: <FaUtensils />,
//   FaConciergeBell: <FaConciergeBell />,
//   FaCreditCard: <FaCreditCard />,
//   FaGift: <FaGift />,
// };

// // ===== Status Badge =====
// const StatusBadge = React.memo(({ status = "pending" }) => {
//   const styling =
//     {
//       pending: "bg-yellow-100 text-yellow-800",
//       "in-progress": "bg-blue-100 text-blue-800",
//       resolved: "bg-green-100 text-green-800",
//       closed: "bg-gray-100 text-gray-800",
//     }[status] || "bg-gray-100 text-gray-800";

//   const Icon =
//     status === "resolved"
//       ? FaCheckCircle
//       : status === "pending"
//       ? FaRegClock
//       : FaExclamationCircle;

//   return (
//     <span
//       className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${styling}`}
//     >
//       <Icon /> {status.replace("-", " ")}
//     </span>
//   );
// });

// // ===== FAQ Accordion =====
// const FAQAccordion = React.memo(({ data = [], searchTerm = "" }) => {
//   const [expanded, setExpanded] = useState({});
//   const toggle = (cat) => setExpanded((p) => ({ ...p, [cat]: !p[cat] }));

//   if (!data.length) {
//     return <p className="text-sm text-gray-500">No FAQs available.</p>;
//   }

//   const highlight = useCallback(
//     (text) => {
//       if (!searchTerm) return text;
//       const regex = new RegExp(`(${searchTerm})`, "gi");
//       return text.split(regex).map((part, i) =>
//         regex.test(part) ? (
//           <span key={i} className="bg-yellow-200">
//             {part}
//           </span>
//         ) : (
//           part
//         )
//       );
//     },
//     [searchTerm]
//   );

//   return (
//     <div className="space-y-4">
//       {data.map((cat, idx) => (
//         <div
//           key={`${cat.category}-${idx}`}
//           className="bg-white dark:bg-secondary rounded-lg border dark:border-gray-700 shadow"
//         >
//           <button
//             onClick={() => toggle(cat.category)}
//             className="flex justify-between items-center w-full p-4 text-left"
//             aria-expanded={!!expanded[cat.category]}
//             aria-controls={`faq-${idx}`}
//           >
//             <div className="flex items-center gap-3">
//               <span className="text-xl text-primary">
//                 {iconMap[cat.icon] || <FaQuestionCircle />}
//               </span>
//               <span className="font-semibold">
//                 {highlight(cat.category)}
//                 {cat.items?.length ? (
//                   <span className="ml-2 text-xs text-gray-400">
//                     ({cat.items.length})
//                   </span>
//                 ) : null}
//               </span>
//             </div>
//             <FaChevronDown
//               className={`transition-transform ${
//                 expanded[cat.category] ? "rotate-180" : ""
//               }`}
//             />
//           </button>
//           {expanded[cat.category] && (
//             <div id={`faq-${idx}`} className="border-t dark:border-gray-600">
//               {cat.items?.map((item, i) => (
//                 <div
//                   key={i}
//                   className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800"
//                 >
//                   <p className="font-medium">{highlight(item.question)}</p>
//                   <p className="text-sm text-gray-600 dark:text-gray-300">
//                     {highlight(item.answer)}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// });

// // ===== Debounce Hook =====
// function useDebounce(value, delay = 300) {
//   const [debounced, setDebounced] = useState(value);
//   useEffect(() => {
//     const timer = setTimeout(() => setDebounced(value), delay);
//     return () => clearTimeout(timer);
//   }, [value, delay]);
//   return debounced;
// }

// // ===== Restaurant Help Component =====
// export default function RestaurantHelp({ currentUser }) {
//   const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

//   const [search, setSearch] = useState("");
//   const debouncedSearch = useDebounce(search, 300);

//   const [faqLoading, setFaqLoading] = useState(true);
//   const [faqError, setFaqError] = useState(null);
//   const [faqs, setFaqs] = useState([]);
//   const [activeTab, setActiveTab] = useState("faqs");

//   const [form, setForm] = useState({
//     name: storedUser.name || currentUser?.name || "",
//     email: storedUser.email || currentUser?.email || "",
//     issueType: "",
//     message: "",
//   });

//   const [attachment, setAttachment] = useState(null);
//   const [preview, setPreview] = useState(null);
//   const [submitLoading, setSubmitLoading] = useState(false);
//   const [submitStatus, setSubmitStatus] = useState(null);

//   const [tickets, setTickets] = useState([]);
//   const [ticketsLoading, setTicketsLoading] = useState(false);
//   const [ticketsError, setTicketsError] = useState(null);

//   const MAX_FILE_SIZE_MB = 5;

//   // Fetch FAQs (restaurant-specific)
//   useEffect(() => {
//     let isMounted = true;
//     setFaqLoading(true);
//     fetch("/api/helpsupport/restaurant/faqs")
//       .then((r) => (r.ok ? r.json() : Promise.reject(r)))
//       .then((data) => {
//         if (isMounted) setFaqs(Array.isArray(data) ? data : []);
//       })
//       .catch(() => {
//         if (isMounted) {
//           setFaqError("Failed to load FAQs.");
//           setFaqs([]);
//         }
//       })
//       .finally(() => isMounted && setFaqLoading(false));
//     return () => {
//       isMounted = false;
//     };
//   }, []);

//   // Filter FAQs
//   const filteredFaqs = useMemo(() => {
//     const q = debouncedSearch.trim().toLowerCase();
//     if (!q) return faqs;
//     return faqs
//       .map((cat) => {
//         const matchesCat = cat.category?.toLowerCase().includes(q);
//         const items = (cat.items || []).filter((i) =>
//           i.question?.toLowerCase().includes(q)
//         );
//         if (matchesCat || items.length) {
//           return { ...cat, items: matchesCat ? cat.items : items };
//         }
//         return null;
//       })
//       .filter(Boolean);
//   }, [faqs, debouncedSearch]);

//   // File handler
//   const handleFileChange = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
//       setSubmitStatus({
//         type: "error",
//         text: `File size must be under ${MAX_FILE_SIZE_MB}MB.`,
//       });
//       return;
//     }
//     setAttachment(file);
//     if (file.type.startsWith("image/")) {
//       const reader = new FileReader();
//       reader.onload = (ev) => setPreview(ev.target.result);
//       reader.readAsDataURL(file);
//     } else {
//       setPreview(null);
//     }
//   };

//   const removeAttachment = () => {
//     setAttachment(null);
//     setPreview(null);
//   };

//   // Submit
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitStatus(null);
//     setSubmitLoading(true);
//     try {
//       const fd = new FormData();
//       fd.append("name", form.name);
//       fd.append("email", form.email);
//       fd.append("issue", form.issueType);
//       fd.append("message", form.message);
//       if (attachment) fd.append("attachment", attachment);

//       const token = localStorage.getItem("token");
//       const res = await fetch("/api/helpsupport/restaurant/submit", {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}` },
//         body: fd,
//       });
//       const data = await res.json().catch(() => ({}));
//       if (res.ok) {
//         setSubmitStatus({
//           type: "success",
//           text: data.message || "Submitted!",
//         });
//         setForm({ ...form, issueType: "", message: "" });
//         removeAttachment();
//       } else {
//         setSubmitStatus({
//           type: "error",
//           text: data.message || "Submission failed.",
//         });
//       }
//     } catch {
//       setSubmitStatus({ type: "error", text: "Network error." });
//     } finally {
//       setSubmitLoading(false);
//     }
//   };

//   // Tickets
//   const loadTickets = useCallback(async () => {
//     setTicketsLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       const res = await fetch("/api/helpsupport/restaurant/tickets", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       if (res.ok) setTickets(Array.isArray(data) ? data : []);
//       else setTicketsError(data?.message || "Failed to load tickets.");
//     } catch {
//       setTicketsError("Network error.");
//     } finally {
//       setTicketsLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     if (activeTab === "tickets") loadTickets();
//   }, [activeTab, loadTickets]);

//   return (
//     <div className="p-6 max-w-5xl mx-auto text-gray-800 dark:text-white">
//       <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-6 rounded-lg mb-6 shadow-lg">
//         <h1 className="text-3xl font-bold">Restaurant Help & Support</h1>
//         <p className="text-sm text-white/80">
//           Get assistance with orders, reservations, or feedback
//         </p>
//       </div>

//       {/* Tabs */}
//       <div className="flex gap-2 mb-6">
//         {[
//           { key: "faqs", label: "FAQs" },
//           { key: "tickets", label: "My Requests" },
//         ].map((t) => (
//           <button
//             key={t.key}
//             onClick={() => setActiveTab(t.key)}
//             className={`px-4 py-2 rounded-full border text-sm ${
//               activeTab === t.key
//                 ? "bg-primary text-white border-primary"
//                 : "bg-white dark:bg-secondary border-gray-300 dark:border-gray-700"
//             }`}
//           >
//             {t.label}
//           </button>
//         ))}
//       </div>

//       {/* Search Bar */}
//       {activeTab === "faqs" && (
//         <div className="flex items-center bg-white dark:bg-secondary rounded-lg p-2 mb-6 border dark:border-gray-700 shadow">
//           <FaSearch className="text-gray-400 mr-2" />
//           <input
//             type="text"
//             placeholder="Search help topics..."
//             className="flex-1 bg-transparent outline-none"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             aria-label="Search help topics"
//           />
//         </div>
//       )}

//       {/* FAQs */}
//       {activeTab === "faqs" && (
//         <section className="mb-10">
//           {faqLoading ? (
//             <p className="text-sm text-gray-500">Loading FAQs…</p>
//           ) : faqError ? (
//             <p className="text-sm text-red-500">{faqError}</p>
//           ) : (
//             <FAQAccordion data={filteredFaqs} searchTerm={debouncedSearch} />
//           )}
//         </section>
//       )}

//       {/* Tickets */}
//       {activeTab === "tickets" && (
//         <section className="mb-10">
//           {ticketsLoading ? (
//             <p className="text-sm text-gray-500">Loading your requests…</p>
//           ) : ticketsError ? (
//             <p className="text-sm text-red-500">{ticketsError}</p>
//           ) : tickets.length ? (
//             <div className="space-y-3">
//               {tickets.map((t) => (
//                 <div
//                   key={t.ticketId || t._id}
//                   className="p-4 bg-white dark:bg-secondary rounded-lg border dark:border-gray-700 shadow"
//                 >
//                   <div className="flex items-center justify-between flex-wrap gap-2">
//                     <div className="flex items-center gap-3">
//                       <span className="font-semibold">
//                         #{t.ticketId || t._id}
//                       </span>
//                       <StatusBadge status={t.status} />
//                     </div>
//                     <span className="text-xs text-gray-500">
//                       {t.createdAt
//                         ? new Intl.DateTimeFormat("en-US", {
//                             dateStyle: "medium",
//                             timeStyle: "short",
//                           }).format(new Date(t.createdAt))
//                         : ""}
//                     </span>
//                   </div>
//                   <div className="mt-2 text-sm">
//                     <p className="font-medium">Issue: {t.issue}</p>
//                     {t.message && (
//                       <p className="text-gray-600 dark:text-gray-300">
//                         Message: {t.message}
//                       </p>
//                     )}
//                   </div>
//                   {t.attachmentUrl && (
//                     <a
//                       href={t.attachmentUrl}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-xs text-primary underline mt-2 inline-block"
//                     >
//                       View attachment
//                     </a>
//                   )}
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <p className="text-sm text-gray-500">No requests yet.</p>
//           )}
//         </section>
//       )}

//       {/* Support Form */}
//       <section className="mb-10">
//         <div className="bg-white dark:bg-secondary p-4 rounded-lg border dark:border-gray-700 shadow">
//           {submitStatus && (
//             <div
//               aria-live="polite"
//               className={`mb-4 p-3 rounded text-sm ${
//                 submitStatus.type === "success"
//                   ? "bg-green-100 text-green-700"
//                   : "bg-red-100 text-red-700"
//               }`}
//             >
//               {submitStatus.text}
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <input
//                 type="text"
//                 placeholder="Your Name"
//                 value={form.name}
//                 onChange={(e) => setForm({ ...form, name: e.target.value })}
//                 className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
//                 required
//               />
//               <input
//                 type="email"
//                 placeholder="Your Email"
//                 value={form.email}
//                 onChange={(e) => setForm({ ...form, email: e.target.value })}
//                 className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
//                 required
//               />
//             </div>

//             <select
//               value={form.issueType}
//               onChange={(e) => setForm({ ...form, issueType: e.target.value })}
//               className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
//               required
//             >
//               <option value="">Select Issue Type</option>
//               <option value="reservation">Reservation</option>
//               <option value="order">Order</option>
//               <option value="payment">Payment</option>
//               <option value="menu">Menu</option>
//               <option value="service">Service</option>
//               <option value="other">Other</option>
//             </select>

//             <textarea
//               placeholder="Your Message"
//               value={form.message}
//               onChange={(e) => setForm({ ...form, message: e.target.value })}
//               className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
//               rows="4"
//               required
//             />

//             <div className="flex items-center justify-between gap-4">
//               <label
//                 htmlFor="fileInput"
//                 className="inline-flex items-center gap-2 cursor-pointer"
//               >
//                 <FaPaperclip />
//                 <span className="text-sm">Attach file (image/pdf)</span>
//               </label>
//               <input
//                 id="fileInput"
//                 type="file"
//                 className="hidden"
//                 accept="image/*,.pdf"
//                 onChange={handleFileChange}
//               />
//               {attachment && (
//                 <span className="text-xs text-gray-500 truncate max-w-xs flex items-center gap-1">
//                   {attachment.name}
//                   <button
//                     type="button"
//                     onClick={removeAttachment}
//                     className="text-red-500"
//                   >
//                     x
//                   </button>
//                 </span>
//               )}
//             </div>

//             {preview && (
//               <img
//                 src={preview}
//                 alt="Attachment preview"
//                 className="mt-2 max-h-40 rounded border"
//               />
//             )}

//             <button
//               type="submit"
//               disabled={submitLoading}
//               className="bg-primary text-white px-4 py-2 rounded shadow disabled:opacity-50"
//             >
//               {submitLoading ? (
//                 "Submitting…"
//               ) : (
//                 <>
//                   <FaPaperPlane className="inline mr-2" /> Submit
//                 </>
//               )}
//             </button>
//           </form>
//         </div>
//       </section>

//       {/* Contact */}
//       <section className="bg-white dark:bg-secondary p-4 rounded-lg border dark:border-gray-700 shadow">
//         <h2 className="font-semibold text-lg mb-2">Contact Us Directly</h2>
//         <div className="flex flex-wrap gap-4">
//           <a
//             href="tel:+15550001111"
//             className="flex items-center gap-2 text-primary hover:underline"
//           >
//             <FaPhoneAlt /> +91XXXXX-XXXXX
//           </a>
//           <a
//             href="https://wa.me/15550001111"
//             target="_blank"
//             rel="noopener noreferrer"
//             className="flex items-center gap-2 text-green-500 hover:underline"
//           >
//             <FaWhatsapp /> WhatsApp
//           </a>
//           <a
//             href="mailto:restaurant.support@example.com"
//             className="flex items-center gap-2 text-blue-500 hover:underline"
//           >
//             <FaEnvelope /> restaurant.support@quickbite.com
//           </a>
//         </div>
//       </section>
//     </div>
//   );
// }
