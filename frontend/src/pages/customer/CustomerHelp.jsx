import React, { useEffect, useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSearch,
  FaPhoneAlt,
  FaWhatsapp,
  FaEnvelope,
  FaUser,
  FaTruck,
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
  FaTicketAlt,
  FaHeadset,
  FaLightbulb,
  FaRocket,
} from "react-icons/fa";

// ===== Icon Mapping =====
const iconMap = {
  FaUser: <FaUser />,
  FaTruck: <FaTruck />,
  FaCreditCard: <FaCreditCard />,
  FaGift: <FaGift />,
};

// ===== Status Badge =====
const StatusBadge = React.memo(({ status = "pending" }) => {
  const configs = {
    pending: {
      bg: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-600/30",
      icon: FaRegClock,
    },
    "in-progress": {
      bg: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-600/30",
      icon: FaRocket,
    },
    resolved: {
      bg: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-600/30",
      icon: FaCheckCircle,
    },
    closed: {
      bg: "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600",
      icon: FaTimes,
    },
  };

  const config = configs[status] || configs.pending;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${config.bg}`}
    >
      <Icon />
      {status.replace("-", " ").toUpperCase()}
    </span>
  );
});

// ===== FAQ Accordion =====
const FAQAccordion = React.memo(({ data = [], searchTerm = "" }) => {
  const [expanded, setExpanded] = useState({});
  const toggle = (cat) => setExpanded((p) => ({ ...p, [cat]: !p[cat] }));

  if (!data.length) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12 rounded-3xl bg-white dark:bg-slate-900 border border-orange-200 dark:border-white/10 shadow-md"
      >
        <div className="text-6xl mb-4">❓</div>
        <p className="text-gray-500 dark:text-gray-400">No FAQs available.</p>
      </motion.div>
    );
  }

  const highlight = (text) => {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, "gi");
    return text.split(regex).map((part, i) =>
      regex.test(part) ? (
        <span key={i} className="bg-yellow-200 dark:bg-yellow-600 font-bold">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="space-y-4">
      {data.map((cat, idx) => {
        const isExpanded = !!expanded[cat.category];
        return (
          <motion.div
            key={`${cat.category}-${idx}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="group relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="relative bg-white dark:bg-slate-900 rounded-3xl border border-orange-200 dark:border-white/10 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
              <motion.button
                onClick={() => toggle(cat.category)}
                className="flex justify-between items-center w-full p-6 text-left"
                whileHover={{ x: 5 }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center text-white text-xl shadow-md group-hover:scale-110 transition-transform">
                    {iconMap[cat.icon] || <FaQuestionCircle />}
                  </div>
                  <div>
                    <span className="font-bold text-lg text-gray-900 dark:text-white">
                      {highlight(cat.category)}
                    </span>
                    {cat.items?.length ? (
                      <span className="ml-2 px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-bold">
                        {cat.items.length}
                      </span>
                    ) : null}
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <FaChevronDown className="text-orange-500 text-xl" />
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-gray-200 dark:border-gray-700 overflow-hidden"
                  >
                    {cat.items?.map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="p-6 hover:bg-orange-50 dark:hover:bg-orange-500/10 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-1">
                            <FaLightbulb />
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-gray-900 dark:text-white mb-2">
                              {highlight(item.question)}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                              {highlight(item.answer)}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
});

// ===== Debounce Hook =====
function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

// ===== Customer Help Component =====
export default function CustomerHelp({ currentUser }) {
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const [faqLoading, setFaqLoading] = useState(true);
  const [faqError, setFaqError] = useState(null);
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
  const [submitStatus, setSubmitStatus] = useState(null);

  const [tickets, setTickets] = useState([]);
  const [ticketsLoading, setTicketsLoading] = useState(false);
  const [ticketsError, setTicketsError] = useState(null);

  const MAX_FILE_SIZE_MB = 5;

  // Auto-update form if localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const updatedUser = JSON.parse(localStorage.getItem("user") || "{}");
      setForm((prev) => ({
        ...prev,
        name: updatedUser.name || currentUser?.name || "",
        email: updatedUser.email || currentUser?.email || "",
      }));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [currentUser]);

  // Fetch FAQs
  useEffect(() => {
    let isMounted = true;
    setFaqLoading(true);
    setFaqError(null);

    fetch("/api/helpsupport/customer/faqs")
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then((data) => {
        if (!isMounted) return;
        setFaqs(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!isMounted) return;
        setFaqError("Failed to load FAQs.");
        setFaqs([]);
      })
      .finally(() => {
        if (!isMounted) return;
        setFaqLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter FAQs
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

  // File handler
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      alert(`File size should be less than ${MAX_FILE_SIZE_MB}MB`);
      setAttachment(null);
      setPreview(null);
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

  // Form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus(null);
    setSubmitLoading(true);

    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("email", form.email);
      fd.append("issue", form.issueType);
      fd.append("message", form.message);
      if (attachment) fd.append("attachment", attachment);

      const token = localStorage.getItem("token");

      const res = await fetch("/api/helpsupport/customer/submit", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: fd,
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setSubmitStatus({
          type: "success",
          text: data.message || "Request submitted successfully!",
        });
        setForm({
          name: storedUser.name || currentUser?.name || "",
          email: storedUser.email || currentUser?.email || "",
          issueType: "",
          message: "",
        });
        removeAttachment();
      } else {
        setSubmitStatus({
          type: "error",
          text: data.message || "Submission failed.",
        });
      }
    } catch (err) {
      setSubmitStatus({
        type: "error",
        text: "Network error. Please try again.",
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  // Load Tickets
  const loadTickets = useCallback(async () => {
    setTicketsLoading(true);
    setTicketsError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/helpsupport/customer/tickets", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setTickets(Array.isArray(data) ? data : []);
      } else {
        setTicketsError(data?.message || "Failed to load tickets.");
      }
    } catch (err) {
      setTicketsError("Network error loading tickets.");
    } finally {
      setTicketsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "tickets") loadTickets();
  }, [activeTab, loadTickets]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <motion.div
        className="px-4 sm:px-8 md:px-10 lg:px-12 py-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-8 overflow-hidden rounded-3xl shadow-2xl border border-orange-200 dark:border-white/10"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-pink-600 to-purple-600"></div>
          <div className="relative z-10 p-8 md:p-10 text-white">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center ring-4 ring-white/30">
                <FaHeadset className="text-3xl" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-black drop-shadow-lg">
                  Help & Support
                </h1>
                <p className="text-white/90 text-lg">
                  Find answers, track tickets, or contact our team
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-3 mb-8">
          {[
            { key: "faqs", label: "FAQs", icon: FaQuestionCircle },
            { key: "tickets", label: "My Tickets", icon: FaTicketAlt },
          ].map((t, i) => {
            const Icon = t.icon;
            const isActive = activeTab === t.key;
            return (
              <motion.button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`relative flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-orange-500 to-pink-600 text-white shadow-lg"
                    : "bg-white dark:bg-slate-900 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-700 hover:border-orange-500"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Icon />
                {t.label}
              </motion.button>
            );
          })}
        </div>

        {/* Search Bar */}
        {activeTab === "faqs" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative mb-8"
          >
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search help topics..."
                className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all shadow-lg"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500"
                >
                  <FaTimes />
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* FAQs */}
        {activeTab === "faqs" && (
          <section className="mb-10">
            {faqLoading ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">
                  Loading FAQs...
                </p>
              </div>
            ) : faqError ? (
              <div className="p-6 rounded-3xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 text-center">
                <FaExclamationCircle className="text-red-500 text-4xl mx-auto mb-3" />
                <p className="text-red-600 dark:text-red-400 font-semibold">
                  {faqError}
                </p>
              </div>
            ) : (
              <FAQAccordion data={filteredFaqs} searchTerm={debouncedSearch} />
            )}
          </section>
        )}

        {/* Tickets */}
        {activeTab === "tickets" && (
          <section className="mb-10">
            {ticketsLoading ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">
                  Loading tickets...
                </p>
              </div>
            ) : ticketsError ? (
              <div className="p-6 rounded-3xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 text-center">
                <p className="text-red-600 dark:text-red-400 font-semibold">
                  {ticketsError}
                </p>
              </div>
            ) : tickets.length ? (
              <div className="space-y-4">
                {tickets.map((ticket, i) => (
                  <motion.div
                    key={ticket.ticketId || ticket._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="group relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    <div className="relative p-6 rounded-3xl bg-white dark:bg-slate-900 border border-orange-200 dark:border-white/10 shadow-md hover:shadow-xl transition-all duration-300">
                      <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white font-bold">
                            <FaTicketAlt />
                          </div>
                          <div>
                            <span className="font-bold text-lg text-gray-900 dark:text-white">
                              #{ticket.ticketId || ticket._id}
                            </span>
                            <div className="mt-1">
                              <StatusBadge status={ticket.status} />
                            </div>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                          <FaRegClock />
                          {ticket.createdAt
                            ? new Intl.DateTimeFormat("en-US", {
                                dateStyle: "medium",
                                timeStyle: "short",
                              }).format(new Date(ticket.createdAt))
                            : ""}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <p className="font-bold text-gray-900 dark:text-white">
                          Issue:{" "}
                          <span className="text-orange-600 dark:text-orange-400">
                            {ticket.issue}
                          </span>
                        </p>
                        {ticket.message && (
                          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            {ticket.message}
                          </p>
                        )}
                      </div>

                      {ticket.attachmentUrl && (
                        <a
                          href={ticket.attachmentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 mt-4 text-sm text-orange-600 dark:text-orange-400 hover:underline font-semibold"
                        >
                          <FaPaperclip />
                          View attachment
                        </a>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 rounded-3xl bg-white dark:bg-slate-900 border border-orange-200 dark:border-white/10 shadow-md">
                <div className="text-6xl mb-4">🎫</div>
                <p className="text-gray-500 dark:text-gray-400">
                  No tickets yet.
                </p>
              </div>
            )}
          </section>
        )}

        {/* Support Form */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-10 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-50"></div>

          <div className="relative p-8 rounded-3xl bg-white dark:bg-slate-900 border border-orange-200 dark:border-white/10 shadow-xl">
            <h2 className="text-2xl font-black bg-gradient-to-r from-orange-600 to-pink-600 dark:from-orange-400 dark:to-pink-500 bg-clip-text text-transparent mb-6 flex items-center gap-3">
              <FaPaperPlane />
              Submit a Request
            </h2>

            {submitStatus && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className={`mb-6 p-4 rounded-2xl flex items-center gap-3 ${
                  submitStatus.type === "success"
                    ? "bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-500/30 text-green-700 dark:text-green-300"
                    : "bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-300"
                }`}
              >
                {submitStatus.type === "success" ? (
                  <FaCheckCircle className="text-2xl" />
                ) : (
                  <FaExclamationCircle className="text-2xl" />
                )}
                <span className="font-semibold">{submitStatus.text}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all"
                    required
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    Your Email
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all"
                    required
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Issue Type
                </label>
                <select
                  value={form.issueType}
                  onChange={(e) =>
                    setForm({ ...form, issueType: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all"
                  required
                >
                  <option value="">Select Issue Type</option>
                  <option value="account">Account</option>
                  <option value="general">General</option>
                  <option value="payment">Payment</option>
                  <option value="offers">Offers</option>
                  <option value="technical">Technical</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all resize-none"
                  rows="5"
                  required
                  placeholder="Describe your issue..."
                />
              </div>

              <div className="flex items-center gap-4">
                <label
                  htmlFor="fileInput"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition-all"
                >
                  <FaPaperclip />
                  <span className="text-sm font-semibold">Attach File</span>
                </label>
                <input
                  id="fileInput"
                  type="file"
                  className="hidden"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                />
                {attachment && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-300 text-sm">
                    <span className="truncate max-w-xs">{attachment.name}</span>
                    <button
                      type="button"
                      onClick={removeAttachment}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTimes />
                    </button>
                  </div>
                )}
              </div>

              {preview && (
                <motion.img
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  src={preview}
                  alt="Preview"
                  className="mt-4 max-h-48 rounded-2xl border-2 border-gray-200 dark:border-gray-700 shadow-lg"
                />
              )}

              <motion.button
                type="submit"
                disabled={submitLoading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                whileHover={{ scale: submitLoading ? 1 : 1.02 }}
                whileTap={{ scale: submitLoading ? 1 : 0.98 }}
              >
                {submitLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <FaPaperPlane />
                    Submit Request
                  </>
                )}
              </motion.button>
            </form>
          </div>
        </motion.section>

        {/* Contact Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-50"></div>

          <div className="relative p-8 rounded-3xl bg-white dark:bg-slate-900 border border-orange-200 dark:border-white/10 shadow-xl">
            <h2 className="text-2xl font-black bg-gradient-to-r from-orange-600 to-pink-600 dark:from-orange-400 dark:to-pink-500 bg-clip-text text-transparent mb-6 flex items-center gap-3">
              <FaHeadset />
              Contact Us Directly
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  icon: FaPhoneAlt,
                  label: "Call Us",
                  value: "+91 XXXXX-XXXXX",
                  href: "tel:+123456789",
                  gradient: "from-blue-500 to-cyan-600",
                },
                {
                  icon: FaWhatsapp,
                  label: "WhatsApp",
                  value: "Chat with us",
                  href: "https://wa.me/123456789",
                  gradient: "from-green-500 to-emerald-600",
                },
                {
                  icon: FaEnvelope,
                  label: "Email",
                  value: "support@quickbite.com",
                  href: "mailto:support@quickbite.com",
                  gradient: "from-purple-500 to-pink-600",
                },
              ].map((contact, i) => {
                const Icon = contact.icon;
                return (
                  <motion.a
                    key={i}
                    href={contact.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-600 hover:border-orange-300 dark:hover:border-orange-500 shadow-md hover:shadow-xl transition-all duration-300"
                    whileHover={{ scale: 1.05, y: -5 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${contact.gradient} flex items-center justify-center text-white text-xl shadow-lg mb-4 group-hover:scale-110 transition-transform`}
                    >
                      <Icon />
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      {contact.label}
                    </div>
                    <div className="font-bold text-gray-900 dark:text-white">
                      {contact.value}
                    </div>
                  </motion.a>
                );
              })}
            </div>
          </div>
        </motion.section>
      </motion.div>
    </div>
  );
}
