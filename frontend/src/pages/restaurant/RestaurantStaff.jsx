import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUsers,
  FaUserPlus,
  FaUserCheck,
  FaUserTimes,
  FaEdit,
  FaTrash,
  FaSearch,
  FaFilter,
  FaChevronRight,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaUserTie,
  FaChartBar,
  FaSpinner,
  FaTimes,
  FaCrown,
  FaUtensils,
  FaCashRegister,
  FaTruck,
} from "react-icons/fa";
import API from "../../api/axios";
import dayjs from "dayjs";

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

/* ------------------------------- Role Badge ------------------------------- */
const RoleBadge = ({ role, subRole }) => {
  const roleConfig = {
    manager: {
      icon: <FaCrown />,
      bg: "bg-gradient-to-r from-purple-500 to-pink-500",
      text: "Manager",
    },
    chef: {
      icon: <FaUtensils />,
      bg: "bg-gradient-to-r from-orange-500 to-red-500",
      text: "Chef",
    },
    cashier: {
      icon: <FaCashRegister />,
      bg: "bg-gradient-to-r from-blue-500 to-cyan-500",
      text: "Cashier",
    },
    delivery: {
      icon: <FaTruck />,
      bg: "bg-gradient-to-r from-emerald-500 to-teal-500",
      text: "Delivery",
    },
  };

  const config = roleConfig[subRole?.toLowerCase()] || {
    icon: <FaUserTie />,
    bg: "bg-gradient-to-r from-gray-500 to-gray-600",
    text: subRole || role,
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-white text-xs font-bold ${config.bg}`}
    >
      {config.icon}
      {config.text}
    </span>
  );
};

/* ------------------------------- Status Badge ------------------------------- */
const StatusBadge = ({ active }) => (
  <span
    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
      active ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
    }`}
  >
    {active ? <FaCheckCircle /> : <FaTimesCircle />}
    {active ? "Active" : "Inactive"}
  </span>
);

/* ------------------------------- Add/Edit Modal ------------------------------- */
const StaffModal = ({ isOpen, onClose, editingStaff, onSubmit }) => {
  const roles = ["Manager", "Chef", "Cashier", "Delivery"];
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "restaurant",
    subRole: "",
    active: true,
  });

  useEffect(() => {
    if (editingStaff) {
      setFormData({
        name: editingStaff.name,
        email: editingStaff.email,
        phone: editingStaff.phone || "",
        role: editingStaff.role,
        subRole: editingStaff.subRole || "",
        active: editingStaff.isActive,
      });
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        role: "restaurant",
        subRole: "",
        active: true,
      });
    }
  }, [editingStaff, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black flex items-center gap-2">
              <FaUserPlus />
              {editingStaff ? "Edit Staff" : "Add New Staff"}
            </h3>
            <motion.button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaTimes />
            </motion.button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Full Name *
            </label>
            <div className="relative">
              <FaUserTie className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="name"
                placeholder="Enter full name"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-300 focus:border-indigo-500 focus:outline-none transition-colors font-medium"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Email Address *
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-300 focus:border-indigo-500 focus:outline-none transition-colors font-medium"
                required
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Phone Number
            </label>
            <div className="relative">
              <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="phone"
                placeholder="+91 XXXXX XXXXX"
                value={formData.phone}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-300 focus:border-indigo-500 focus:outline-none transition-colors font-medium"
              />
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Role *
            </label>
            <select
              name="subRole"
              value={formData.subRole}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-indigo-500 focus:outline-none transition-colors font-medium"
              required
            >
              <option value="">Select Role</option>
              {roles.map((r) => (
                <option key={r} value={r.toLowerCase()}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Active Status */}
          <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50">
            <input
              type="checkbox"
              name="active"
              id="active"
              checked={formData.active}
              onChange={handleChange}
              className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label
              htmlFor="active"
              className="font-bold text-gray-700 cursor-pointer"
            >
              Active Status
            </label>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <motion.button
              type="submit"
              disabled={!formData.name || !formData.email || !formData.subRole}
              className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {editingStaff ? "Update Staff" : "Add Staff"}
            </motion.button>
            <motion.button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl bg-gray-200 text-gray-700 font-bold hover:bg-gray-300 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

/* ------------------------------- Delete Confirmation Modal ------------------------------- */
const DeleteModal = ({ isOpen, onClose, onConfirm, staffName }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 bg-gradient-to-r from-red-500 to-pink-600 text-white">
          <h3 className="text-2xl font-black flex items-center gap-2">
            <FaExclamationTriangle />
            Confirm Deletion
          </h3>
        </div>

        <div className="p-6">
          <p className="text-gray-700 text-lg mb-6">
            Are you sure you want to remove{" "}
            <span className="font-black text-gray-900">{staffName}</span> from
            your staff?
          </p>

          <div className="flex gap-3">
            <motion.button
              onClick={onConfirm}
              className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Yes, Remove
            </motion.button>
            <motion.button
              onClick={onClose}
              className="px-6 py-3 rounded-xl bg-gray-200 text-gray-700 font-bold hover:bg-gray-300 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ------------------------------- Main Component ------------------------------- */
const RestaurantStaff = () => {
  const [staff, setStaff] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [deletingStaff, setDeletingStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [toasts, setToasts] = useState([]);

  /* --------------------- Toast System --------------------- */
  const pushToast = (payload) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, ...payload }]);
    setTimeout(() => removeToast(id), 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  /* --------------------- Fetch Staff --------------------- */
  useEffect(() => {
    const fetchStaff = async () => {
      setLoading(true);
      try {
        const res = await API.get("/admin/restaurants/staff");
        const normalized = (res.data.staff || []).map((s) => ({
          ...s,
          id: s.id || s._id,
          subRole: s.subRole || "",
          isActive: s.active,
        }));
        setStaff(normalized);
        setFilteredStaff(normalized);
      } catch (err) {
        console.error(err);
        pushToast({
          type: "error",
          title: "Failed to fetch staff",
          message: "Please try again later",
          icon: <FaExclamationTriangle />,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchStaff();
  }, []);

  /* --------------------- Filter Staff --------------------- */
  useEffect(() => {
    let filtered = staff;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.phone?.includes(searchQuery)
      );
    }

    // Role filter
    if (roleFilter !== "all") {
      filtered = filtered.filter((s) => s.subRole === roleFilter);
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((s) =>
        statusFilter === "active" ? s.isActive : !s.isActive
      );
    }

    setFilteredStaff(filtered);
  }, [searchQuery, roleFilter, statusFilter, staff]);

  /* --------------------- Form Submit --------------------- */
  const handleSubmit = async (formData) => {
    try {
      if (editingStaff) {
        const res = await API.put(
          `/admin/restaurants/staff/${editingStaff.id}`,
          formData
        );
        const updated = {
          ...res.data.staff,
          id: res.data.staff.id || res.data.staff._id,
          isActive: res.data.staff.active,
          subRole: res.data.staff.subRole || "",
        };
        setStaff((prev) =>
          prev.map((s) => (s.id === editingStaff.id ? updated : s))
        );
        pushToast({
          type: "success",
          title: "Staff Updated",
          message: `${formData.name} has been updated successfully`,
          icon: <FaCheckCircle />,
        });
      } else {
        const res = await API.post("/admin/restaurants/staff", formData);
        const added = {
          ...res.data.staff,
          id: res.data.staff.id || res.data.staff._id,
          isActive: res.data.staff.active,
          subRole: res.data.staff.subRole || "",
        };
        setStaff((prev) => [...prev, added]);
        pushToast({
          type: "success",
          title: "Staff Added",
          message: `${formData.name} has been added to your team`,
          icon: <FaCheckCircle />,
        });
      }
    } catch (err) {
      console.error(err);
      pushToast({
        type: "error",
        title: "Operation Failed",
        message: err?.response?.data?.message || "Failed to save staff",
        icon: <FaExclamationTriangle />,
      });
    } finally {
      setShowForm(false);
      setEditingStaff(null);
    }
  };

  /* --------------------- Edit Staff --------------------- */
  const handleEdit = (member) => {
    setEditingStaff(member);
    setShowForm(true);
  };

  /* --------------------- Delete Staff --------------------- */
  const handleDeleteClick = (member) => {
    setDeletingStaff(member);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await API.delete(`/admin/restaurants/staff/${deletingStaff.id}`);
      setStaff((prev) => prev.filter((s) => s.id !== deletingStaff.id));
      pushToast({
        type: "success",
        title: "Staff Removed",
        message: `${deletingStaff.name} has been removed from your team`,
        icon: <FaCheckCircle />,
      });
    } catch (err) {
      console.error(err);
      pushToast({
        type: "error",
        title: "Deletion Failed",
        message: "Failed to remove staff member",
        icon: <FaExclamationTriangle />,
      });
    } finally {
      setShowDeleteModal(false);
      setDeletingStaff(null);
    }
  };

  /* --------------------- Stats Calculation --------------------- */
  const totalStaff = staff.length;
  const activeStaff = staff.filter((s) => s.isActive).length;
  const inactiveStaff = totalStaff - activeStaff;
  const managers = staff.filter((s) => s.subRole === "manager").length;

  const statCards = [
    {
      icon: <FaUsers />,
      value: totalStaff.toString(),
      label: "Total Staff",
      gradient: "from-blue-500 to-cyan-600",
      emoji: "👥",
    },
    {
      icon: <FaUserCheck />,
      value: activeStaff.toString(),
      label: "Active Staff",
      gradient: "from-emerald-500 to-teal-600",
      emoji: "✅",
    },
    {
      icon: <FaUserTimes />,
      value: inactiveStaff.toString(),
      label: "Inactive Staff",
      gradient: "from-red-500 to-pink-600",
      emoji: "⏸️",
    },
    {
      icon: <FaCrown />,
      value: managers.toString(),
      label: "Managers",
      gradient: "from-purple-500 to-pink-600",
      emoji: "👑",
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
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
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
                    👥
                  </motion.div>
                  <div>
                    <h1 className="text-4xl font-black text-white drop-shadow-lg">
                      Staff Management
                    </h1>
                    <p className="text-white/90 text-sm font-medium mt-1">
                      Manage your restaurant team members
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.button
                onClick={() => setShowForm(true)}
                className="px-6 py-3 rounded-xl bg-white text-indigo-600 font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 w-fit"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaUserPlus />
                Add Staff
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, i) => (
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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white">
              <FaFilter />
            </div>
            <h3 className="text-xl font-black text-gray-900">Filter Staff</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors font-medium"
              />
            </div>

            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors font-medium"
            >
              <option value="all">All Roles</option>
              <option value="manager">Manager</option>
              <option value="chef">Chef</option>
              <option value="cashier">Cashier</option>
              <option value="delivery">Delivery</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors font-medium"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </motion.div>

        {/* Staff Table */}
        <motion.div
          className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="p-6 bg-gradient-to-r from-rose-500 to-pink-600 text-white">
            <h3 className="text-2xl font-black flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                <FaUsers />
              </div>
              Team Members ({filteredStaff.length})
            </h3>
          </div>

          <div className="overflow-x-auto">
            <AnimatePresence mode="wait">
              {loading ? (
                <LoadingState key="loading" />
              ) : filteredStaff.length === 0 ? (
                <EmptyState
                  key="empty"
                  searchQuery={searchQuery}
                  onReset={() => {
                    setSearchQuery("");
                    setRoleFilter("all");
                    setStatusFilter("all");
                  }}
                />
              ) : (
                <motion.table
                  key="table"
                  className="w-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <thead className="bg-gray-50 border-b-2 border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                        Staff Member
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-black text-gray-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-black text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <AnimatePresence>
                      {filteredStaff.map((member, index) => (
                        <motion.tr
                          key={member.id}
                          className="hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.7 + index * 0.05 }}
                          whileHover={{ x: 4 }}
                        >
                          {/* Staff Member */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                {member.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-bold text-gray-900">
                                  {member.name}
                                </div>
                                <div className="text-sm text-gray-500 flex items-center gap-1">
                                  <FaEnvelope className="text-xs" />
                                  {member.email}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Contact */}
                          <td className="px-6 py-4">
                            {member.phone ? (
                              <div className="flex items-center gap-2 text-gray-600">
                                <FaPhone className="text-sm" />
                                <span className="font-medium">
                                  {member.phone}
                                </span>
                              </div>
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </td>

                          {/* Role */}
                          <td className="px-6 py-4">
                            <RoleBadge
                              role={member.role}
                              subRole={member.subRole}
                            />
                          </td>

                          {/* Status */}
                          <td className="px-6 py-4 text-center">
                            <StatusBadge active={member.isActive} />
                          </td>

                          {/* Joined */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-gray-600">
                              <FaCalendarAlt className="text-sm" />
                              <span className="font-medium">
                                {dayjs(member.createdAt).format("DD MMM YYYY")}
                              </span>
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <motion.button
                                onClick={() => handleEdit(member)}
                                className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                title="Edit"
                              >
                                <FaEdit />
                              </motion.button>
                              <motion.button
                                onClick={() => handleDeleteClick(member)}
                                className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                title="Remove"
                              >
                                <FaTrash />
                              </motion.button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </motion.table>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>

      {/* Modals */}
      <AnimatePresence>
        {showForm && (
          <StaffModal
            isOpen={showForm}
            onClose={() => {
              setShowForm(false);
              setEditingStaff(null);
            }}
            editingStaff={editingStaff}
            onSubmit={handleSubmit}
          />
        )}

        {showDeleteModal && (
          <DeleteModal
            isOpen={showDeleteModal}
            onClose={() => {
              setShowDeleteModal(false);
              setDeletingStaff(null);
            }}
            onConfirm={handleDeleteConfirm}
            staffName={deletingStaff?.name}
          />
        )}
      </AnimatePresence>
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
    <p className="text-gray-600 font-semibold">Loading staff members...</p>
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
      👥
    </motion.div>
    <h4 className="text-2xl font-black text-gray-800 mb-2">
      {searchQuery ? "No Staff Found" : "No Staff Members"}
    </h4>
    <p className="text-gray-500 text-lg mb-6">
      {searchQuery
        ? "Try adjusting your search or filters"
        : "Start building your team by adding staff members"}
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

export default RestaurantStaff;


// // src/pages/restaurant/RestaurantStaff.jsx
// import React, { useState, useEffect } from "react";
// import API from "../../api/axios";
// import { useToast } from "../../context/ToastContext";
// import dayjs from "dayjs";

// const roles = ["Manager", "Chef", "Cashier", "Delivery"];

// const RestaurantStaff = () => {
//   const [staff, setStaff] = useState([]);
//   const [showForm, setShowForm] = useState(false);
//   const [editingStaff, setEditingStaff] = useState(null);
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     role: "restaurant", // ✅ always restaurant
//     subRole: "", // ✅ one role only
//     active: true,
//   });
//   const [loading, setLoading] = useState(false);

//   const toast = useToast();

//   // ---------------- Fetch staff from backend ----------------
//   useEffect(() => {
//     const fetchStaff = async () => {
//       setLoading(true);
//       try {
//         const res = await API.get("/admin/restaurants/staff");
//         const normalized = (res.data.staff || []).map((s) => ({
//           ...s,
//           id: s.id || s._id,
//           subRole: s.subRole || "",
//           isActive: s.active, // normalize active field 
//         }));
//         setStaff(normalized);
//       } catch (err) {
//         console.error(err);
//         toast.error("Failed to fetch staff");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchStaff();
//   }, []);

//   // ---------------- Form input change ----------------
//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   // ---------------- Submit add/edit staff ----------------
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       if (editingStaff) {
//         const res = await API.put(
//           `/admin/restaurants/staff/${editingStaff.id}`,
//           formData
//         );
//         const updated = {
//           ...res.data.staff,
//           id: res.data.staff.id || res.data.staff._id,
//           isActive: res.data.staff.active,
//           subRole: res.data.staff.subRole || "",
//         };
//         setStaff((prev) =>
//           prev.map((s) => (s.id === editingStaff.id ? updated : s))
//         );
//         toast.success("Staff updated successfully");
//       } else {
//         const res = await API.post("/admin/restaurants/staff", formData);
//         const added = {
//           ...res.data.staff,
//           id: res.data.staff.id || res.data.staff._id,
//           isActive: res.data.staff.active,
//           subRole: res.data.staff.subRole || "",
//         };
//         setStaff((prev) => [...prev, added]);
//         toast.success("Staff added successfully");
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error(err?.response?.data?.message || "Failed to save staff");
//     } finally {
//       resetForm();
//     }
//   };

//   const handleEdit = (member) => {
//     setEditingStaff(member);
//     setFormData({
//       name: member.name,
//       email: member.email,
//       phone: member.phone || "",
//       role: member.role,
//       subRole: member.subRole || "",
//       active: member.isActive,
//     });
//     setShowForm(true);
//   };

//   const handleRemove = async (id) => {
//     try {
//       await API.delete(`/admin/restaurants/staff/${id}`);
//       setStaff((prev) => prev.filter((s) => s.id !== id));
//       toast.success("Staff removed successfully");
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to remove staff");
//     }
//   };

//   const resetForm = () => {
//     setShowForm(false);
//     setEditingStaff(null);
//     setFormData({
//       name: "",
//       email: "",
//       phone: "",
//       role: "restaurant",
//       subRole: "",
//       active: true,
//     });
//   };

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-semibold mb-4">
//         Restaurant Staff Management
//       </h2>

//       {/* Staff Table */}
//       <div className="overflow-x-auto border rounded-md shadow-sm">
//         <table className="min-w-full border-collapse">
//           <thead className="bg-gray-100 dark:bg-gray-800">
//             <tr>
//               <th className="px-4 py-2 text-left">Name</th>
//               <th className="px-4 py-2 text-left">Email</th>
//               <th className="px-4 py-2 text-left">Phone</th>
//               <th className="px-4 py-2 text-left">Role</th>
//               <th className="px-4 py-2 text-left">Status</th>
//               <th className="px-4 py-2 text-left">Joined</th>
//               <th className="px-4 py-2 text-left">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {loading ? (
//               <tr>
//                 <td colSpan="7" className="px-4 py-4 text-center">
//                   Loading staff...
//                 </td>
//               </tr>
//             ) : staff.length === 0 ? (
//               <tr>
//                 <td colSpan="7" className="px-4 py-4 text-center text-gray-500">
//                   No staff found.
//                 </td>
//               </tr>
//             ) : (
//               staff.map((member) => (
//                 <tr
//                   key={member.id}
//                   className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
//                 >
//                   <td className="px-4 py-2 font-medium">{member.name}</td>
//                   <td className="px-4 py-2 text-sm text-gray-600">
//                     {member.email}
//                   </td>
//                   <td className="px-4 py-2 text-sm text-gray-600">
//                     {member.phone || "—"}
//                   </td>
//                   <td className="px-4 py-2">
//                     <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
//                       {member.role}
//                       {member.subRole ? ` (${member.subRole})` : ""}
//                     </span>
//                   </td>
//                   <td className="px-4 py-2">
//                     <span
//                       className={`px-2 py-1 rounded-full text-sm font-medium ${
//                         member.isActive
//                           ? "bg-green-100 text-green-800"
//                           : "bg-red-100 text-red-800"
//                       }`}
//                     >
//                       {member.isActive ? "Active" : "Inactive"}
//                     </span>
//                   </td>
//                   <td className="px-4 py-2 text-sm text-gray-500">
//                     {dayjs(member.createdAt).format("DD MMM YYYY")}
//                   </td>
//                   <td className="px-4 py-2 flex gap-2">
//                     <button
//                       onClick={() => handleEdit(member)}
//                       className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
//                     >
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => handleRemove(member.id)}
//                       className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
//                     >
//                       Remove
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Add Staff Button */}
//       <button
//         onClick={() => setShowForm(true)}
//         className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
//       >
//         + Add Staff
//       </button>

//       {/* Staff Form */}
//       {showForm && (
//         <div className="mt-6 p-6 border rounded-md shadow-md max-w-md bg-white dark:bg-gray-900">
//           <h3 className="text-xl font-semibold mb-4">
//             {editingStaff ? "Edit Staff" : "Add New Staff"}
//           </h3>

//           <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//             <input
//               type="text"
//               name="name"
//               placeholder="Full Name"
//               value={formData.name}
//               onChange={handleChange}
//               className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
//               required
//             />
//             <input
//               type="email"
//               name="email"
//               placeholder="Email Address"
//               value={formData.email}
//               onChange={handleChange}
//               className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
//               required
//             />
//             <input
//               type="text"
//               name="phone"
//               placeholder="Phone Number"
//               value={formData.phone || ""}
//               onChange={handleChange}
//               className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
//             />

//             {/* Dropdown for SubRole */}
//             <select
//               name="subRole"
//               value={formData.subRole}
//               onChange={handleChange}
//               className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
//               required
//             >
//               <option value="">Select Role</option>
//               {roles.map((r) => (
//                 <option key={r} value={r.toLowerCase()}>
//                   {r}
//                 </option>
//               ))}
//             </select>

//             <label className="flex items-center gap-2">
//               <input
//                 type="checkbox"
//                 name="active"
//                 checked={formData.active}
//                 onChange={handleChange}
//               />
//               Active
//             </label>

//             <div className="flex gap-3">
//               <button
//                 type="submit"
//                 disabled={
//                   !formData.name || !formData.email || !formData.subRole
//                 }
//                 className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 Save
//               </button>
//               <button
//                 type="button"
//                 onClick={resetForm}
//                 className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-400 dark:hover:bg-gray-600"
//               >
//                 Cancel
//               </button>
//             </div>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// };

// export default RestaurantStaff;
