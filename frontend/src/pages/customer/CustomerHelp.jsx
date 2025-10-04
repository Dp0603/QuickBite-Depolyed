import React, { useEffect, useMemo, useState, useCallback } from "react";
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
  const styling =
    {
      pending: "bg-yellow-100 text-yellow-800",
      "in-progress": "bg-blue-100 text-blue-800",
      resolved: "bg-green-100 text-green-800",
      closed: "bg-gray-100 text-gray-800",
    }[status] || "bg-gray-100 text-gray-800";

  const Icon =
    status === "resolved"
      ? FaCheckCircle
      : status === "pending"
      ? FaRegClock
      : FaExclamationCircle;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${styling}`}
    >
      <Icon /> {status.replace("-", " ")}
    </span>
  );
});

// ===== FAQ Accordion =====
const FAQAccordion = React.memo(({ data = [], searchTerm = "" }) => {
  const [expanded, setExpanded] = useState({});
  const toggle = (cat) => setExpanded((p) => ({ ...p, [cat]: !p[cat] }));

  if (!data.length) {
    return <p className="text-sm text-gray-500">No FAQs available.</p>;
  }

  const highlight = (text) => {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, "gi");
    return text.split(regex).map((part, i) =>
      regex.test(part) ? (
        <span key={i} className="bg-yellow-200">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="space-y-4">
      {data.map((cat, idx) => (
        <div
          key={`${cat.category}-${idx}`}
          className="bg-white dark:bg-secondary rounded-lg border dark:border-gray-700 shadow"
        >
          <button
            onClick={() => toggle(cat.category)}
            className="flex justify-between items-center w-full p-4 text-left"
            aria-expanded={!!expanded[cat.category]}
            aria-controls={`faq-${idx}`}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl text-primary">
                {iconMap[cat.icon] || <FaQuestionCircle />}
              </span>
              <span className="font-semibold">
                {highlight(cat.category)}
                {cat.items?.length ? (
                  <span className="ml-2 text-xs text-gray-400">
                    ({cat.items.length})
                  </span>
                ) : null}
              </span>
            </div>
            <FaChevronDown
              className={`transition-transform ${
                expanded[cat.category] ? "rotate-180" : ""
              }`}
            />
          </button>
          {expanded[cat.category] && (
            <div id={`faq-${idx}`} className="border-t dark:border-gray-600">
              {cat.items?.map((item, i) => (
                <div
                  key={i}
                  className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <p className="font-medium">{highlight(item.question)}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {highlight(item.answer)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
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

  // Filter FAQs with debounced search
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

  // ===== File attachment handler =====
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

  // ===== Form submission =====
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

  // ===== Load Tickets =====
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

  // ===== Render =====
  return (
    <div className="p-6 max-w-5xl mx-auto text-gray-800 dark:text-white">
      {/* Hero */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-6 rounded-lg mb-6 shadow-lg">
        <h1 className="text-3xl font-bold">Help & Support</h1>
        <p className="text-sm text-white/80">
          Find answers, track your tickets, or contact support
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { key: "faqs", label: "FAQs" },
          { key: "tickets", label: "My Tickets" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`px-4 py-2 rounded-full border text-sm ${
              activeTab === t.key
                ? "bg-primary text-white border-primary"
                : "bg-white dark:bg-secondary border-gray-300 dark:border-gray-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      {activeTab === "faqs" && (
        <div className="flex items-center bg-white dark:bg-secondary rounded-lg p-2 mb-6 border dark:border-gray-700 shadow">
          <FaSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search help topics..."
            className="flex-1 bg-transparent outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search help topics"
          />
        </div>
      )}

      {/* FAQs */}
      {activeTab === "faqs" && (
        <section className="mb-10">
          {faqLoading ? (
            <p className="text-sm text-gray-500">Loading FAQs…</p>
          ) : faqError ? (
            <p className="text-sm text-red-500">{faqError}</p>
          ) : (
            <FAQAccordion data={filteredFaqs} searchTerm={debouncedSearch} />
          )}
        </section>
      )}

      {/* Tickets */}
      {activeTab === "tickets" && (
        <section className="mb-10">
          {ticketsLoading ? (
            <p className="text-sm text-gray-500">Loading your tickets…</p>
          ) : ticketsError ? (
            <p className="text-sm text-red-500">{ticketsError}</p>
          ) : tickets.length ? (
            <div className="space-y-3">
              {tickets.map((t) => (
                <div
                  key={t.ticketId || t._id}
                  className="p-4 bg-white dark:bg-secondary rounded-lg border dark:border-gray-700 shadow"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">
                        #{t.ticketId || t._id}
                      </span>
                      <StatusBadge status={t.status} />
                    </div>
                    <span className="text-xs text-gray-500">
                      {t.createdAt
                        ? new Intl.DateTimeFormat("en-US", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          }).format(new Date(t.createdAt))
                        : ""}
                    </span>
                  </div>
                  <div className="mt-2 text-sm">
                    <p className="font-medium">Issue: {t.issue}</p>
                    {t.message && (
                      <p className="text-gray-600 dark:text-gray-300">
                        Message: {t.message}
                      </p>
                    )}
                  </div>
                  {t.attachmentUrl && (
                    <a
                      href={t.attachmentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary underline mt-2 inline-block"
                    >
                      View attachment
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No tickets yet.</p>
          )}
        </section>
      )}

      {/* Support Form */}
      <section className="mb-10">
        <div className="bg-white dark:bg-secondary p-4 rounded-lg border dark:border-gray-700 shadow">
          {submitStatus && (
            <div
              aria-live="polite"
              className={`mb-4 p-3 rounded text-sm ${
                submitStatus.type === "success"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {submitStatus.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Your Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
                required
              />
              <input
                type="email"
                placeholder="Your Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
                required
              />
            </div>

            <select
              value={form.issueType}
              onChange={(e) => setForm({ ...form, issueType: e.target.value })}
              className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
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

            <textarea
              placeholder="Your Message"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
              rows="4"
              required
            />

            <div className="flex items-center justify-between gap-4">
              <label
                htmlFor="fileInput"
                className="inline-flex items-center gap-2 cursor-pointer"
              >
                <FaPaperclip />
                <span className="text-sm">Attach file (image/pdf)</span>
              </label>
              <input
                id="fileInput"
                type="file"
                className="hidden"
                accept="image/*,.pdf"
                onChange={handleFileChange}
              />
              {attachment && (
                <span className="text-xs text-gray-500 truncate max-w-xs flex items-center gap-1">
                  {attachment.name}{" "}
                  <button
                    type="button"
                    onClick={removeAttachment}
                    className="text-red-500"
                  >
                    x
                  </button>
                </span>
              )}
            </div>

            {preview && (
              <img
                src={preview}
                alt="Attachment preview"
                className="mt-2 max-h-40 rounded border"
              />
            )}

            <button
              type="submit"
              disabled={submitLoading}
              className="bg-primary text-white px-4 py-2 rounded shadow disabled:opacity-50"
            >
              {submitLoading ? (
                "Submitting…"
              ) : (
                <>
                  <FaPaperPlane className="inline mr-2" /> Submit
                </>
              )}
            </button>
          </form>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-white dark:bg-secondary p-4 rounded-lg border dark:border-gray-700 shadow">
        <h2 className="font-semibold text-lg mb-2">Contact Us Directly</h2>
        <div className="flex flex-wrap gap-4">
          <a
            href="tel:+123456789"
            className="flex items-center gap-2 text-primary hover:underline"
          >
            <FaPhoneAlt /> +91XXXXX-XXXXX
          </a>
          <a
            href="https://wa.me/123456789"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-green-500 hover:underline"
          >
            <FaWhatsapp /> WhatsApp
          </a>
          <a
            href="mailto:support@example.com"
            className="flex items-center gap-2 text-blue-500 hover:underline"
          >
            <FaEnvelope /> support@quickbite.com
          </a>
        </div>
      </section>
    </div>
  );
}
