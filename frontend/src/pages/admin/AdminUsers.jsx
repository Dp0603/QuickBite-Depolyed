import React, { useEffect, useState, useMemo, useRef } from "react";
import API from "../../api/axios";
import {
  FaBan,
  FaCheckCircle,
  FaUsers,
  FaSearch,
  FaFilter,
  FaUserShield,
  FaStore,
  FaUser,
  FaChevronLeft,
  FaChevronRight,
  FaUserPlus,
  FaEnvelope,
  FaEdit,
  FaTrash,
  FaEye,
  FaSortAmountDown,
  FaSortAmountUp,
  FaDownload,
  FaExclamationTriangle,
  FaTimes,
  FaChevronDown,
  FaLock,
  FaUnlock,
} from "react-icons/fa";
import { HiOutlineDotsVertical } from "react-icons/hi";
import AdminAddUserDrawer from "./AdminAddUserDrawer";
import { motion, AnimatePresence } from "framer-motion";

/* -------------------------------------------------------------- */
/* UTILITIES                                                       */
/* -------------------------------------------------------------- */
const useCountUp = (to = 0, duration = 0.8) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const increment = to / (duration * 60);
    const timer = setInterval(() => {
      start += increment;
      if (start >= to) {
        setVal(to);
        clearInterval(timer);
      } else {
        setVal(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [to, duration]);
  return val;
};

const sortUsers = (users, sortBy, sortOrder) => {
  const rolePriority = {
    admin: 1,
    restaurant: 2,
    customer: 3,
  };

  return [...users].sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];

    if (sortBy === "role") {
      aVal = rolePriority[aVal] || 99;
      bVal = rolePriority[bVal] || 99;
    } else if (sortBy === "createdAt") {
      aVal = new Date(aVal).getTime();
      bVal = new Date(bVal).getTime();
    } else if (typeof aVal === "boolean") {
      aVal = aVal ? 1 : 0;
      bVal = bVal ? 1 : 0;
    } else {
      aVal = aVal?.toString().toLowerCase() || "";
      bVal = bVal?.toString().toLowerCase() || "";
    }

    // ✅ STABLE SORT FALLBACK (ADD THIS)
    if (aVal === bVal) {
      return a._id.localeCompare(b._id);
    }

    if (sortOrder === "asc") return aVal > bVal ? 1 : -1;
    return aVal < bVal ? 1 : -1;
  });
};

/* -------------------------------------------------------------- */
/* PREMIUM COMPONENTS                                              */
/* -------------------------------------------------------------- */

const PremiumActionMenu = ({
  user,
  isOpen,
  onClose,
  onView,
  onEdit,
  onDelete,
  menuRef,
}) => {
  const menuItems = [
    {
      icon: FaEye,
      label: "View Details",
      sublabel: "See full profile",
      action: () => onView(user),
      gradient: "from-blue-500 to-cyan-500",
      bgHover: "hover:bg-blue-50 dark:hover:bg-blue-900/20",
    },
    {
      icon: FaEdit,
      label: "Edit User",
      sublabel: "Modify information",
      action: () => onEdit(user),
      gradient: "from-amber-500 to-orange-500",
      bgHover: "hover:bg-amber-50 dark:hover:bg-amber-900/20",
    },
    {
      icon: FaTrash,
      label: "Delete User",
      sublabel: "Remove permanently",
      action: () => onDelete(user),
      gradient: "from-red-500 to-rose-500",
      bgHover: "hover:bg-red-50 dark:hover:bg-red-900/20",
      danger: true,
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            ref={menuRef}
            className="absolute right-0 top-full mt-2 w-64 z-50"
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <div className="relative overflow-hidden rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 shadow-2xl shadow-black/10 dark:shadow-black/30">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none" />

              <div className="relative px-4 py-3 border-b border-gray-200/50 dark:border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 dark:text-white text-sm truncate">
                      {user?.name || "User"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {user?.email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative p-2">
                {menuItems.map((item, index) => (
                  <motion.button
                    key={item.label}
                    onClick={() => {
                      onClose();
                      item.action();
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${item.bgHover}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div
                      className={`w-9 h-9 rounded-lg bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow`}
                    >
                      <item.icon className="text-white text-xs" />
                    </div>
                    <div className="flex-1 text-left">
                      <p
                        className={`font-semibold text-sm ${
                          item.danger
                            ? "text-red-600 dark:text-red-400"
                            : "text-gray-900 dark:text-white"
                        }`}
                      >
                        {item.label}
                      </p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">
                        {item.sublabel}
                      </p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const PremiumDeleteModal = ({ user, onClose, onConfirm }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    await onConfirm();
    setIsDeleting(false);
  };

  if (!user) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        <motion.div
          className="relative w-full max-w-md"
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 20, opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-red-500/30 via-rose-500/30 to-pink-500/30 rounded-3xl blur-xl opacity-75" />

          <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-red-200/50 dark:border-red-500/20 shadow-2xl">
            {/* Header Content */}
            <div className="relative overflow-hidden bg-gradient-to-br from-red-500 to-rose-600 px-6 py-8 text-center">
              <motion.div
                className="mx-auto w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-4 border border-white/30"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
              >
                <FaExclamationTriangle className="text-3xl text-white" />
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-1">
                Delete User?
              </h3>
              <p className="text-white/80 text-sm">
                This action cannot be undone.
              </p>
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
              >
                <FaTimes />
              </button>
            </div>

            <div className="px-6 py-6 space-y-6">
              <div className="bg-gray-50 dark:bg-slate-800/50 rounded-xl p-4 border border-gray-100 dark:border-white/5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center text-gray-500 dark:text-gray-300 font-bold text-lg">
                  {user.name?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">
                    {user.name}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-3 rounded-xl font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-3 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all flex items-center justify-center gap-2"
                >
                  {isDeleting ? "Deleting..." : "Delete User"}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const PremiumDotsButton = ({ onClick, isActive, ariaLabel }) => (
  <motion.button
    onClick={onClick}
    aria-label={ariaLabel}
    aria-haspopup="menu"
    aria-expanded={isActive}
    title="User actions"
    className={`relative p-2 rounded-lg transition-all duration-200 ${
      isActive
        ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
        : "hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
    }`}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <HiOutlineDotsVertical className="text-xl" />
  </motion.button>
);

const RoleBadge = ({ role, showChevron = false, className = "" }) => {
  const map = {
    admin: {
      label: "Admin",
      icon: FaUserShield,
      className: "bg-purple-50 text-purple-600 border-purple-200",
    },
    restaurant: {
      label: "Restaurant",
      icon: FaStore,
      className: "bg-orange-50 text-orange-600 border-orange-200",
    },
    customer: {
      label: "Customer",
      icon: FaUser,
      className: "bg-blue-50 text-blue-600 border-blue-200",
    },
  };

  const cfg = map[role] || map.customer;
  const Icon = cfg.icon;

  return (
    <div
      className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-bold border ${cfg.className} ${className}`}
    >
      <div className="flex items-center gap-2">
        <Icon className="text-xs" />
        <span>{cfg.label}</span>
      </div>

      {showChevron && <FaChevronDown className="text-[10px] opacity-70" />}
    </div>
  );
};
const PremiumRoleMenu = ({ currentRole, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const role = currentRole || "customer";
  const roles = ["admin", "restaurant", "customer"];

  return (
    <div className="relative w-36" ref={ref}>
      {/* CLOSED BADGE */}
      <button onClick={() => setOpen((v) => !v)} className="w-full">
        <RoleBadge role={role} showChevron />
      </button>

      {/* DROPDOWN */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute z-50 mt-2 w-full flex flex-col gap-1 p-1 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700"
          >
            {roles.map((r) => (
              <button
                key={r}
                disabled={r === role}
                className={`w-full ${
                  r === role ? "opacity-60 cursor-not-allowed" : ""
                }`}
                onClick={() => {
                  if (r !== role) onChange(r);
                  setOpen(false);
                }}
              >
                <RoleBadge
                  role={r}
                  className={r === role ? "ring-2 ring-blue-300" : ""}
                />{" "}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* -------------------------------------------------------------- */
/* MAIN COMPONENT                                                  */
/* -------------------------------------------------------------- */

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showActionMenu, setShowActionMenu] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState("add");
  const [drawerUser, setDrawerUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);

  const USERS_PER_PAGE = 10;

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/users");

      setUsers(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, roleFilter, statusFilter]);

  const handleToggleStatus = async (id) => {
    try {
      await API.patch(`/admin/users/status/${id}`);
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, isActive: !u.isActive } : u))
      );
    } catch (err) {
      console.error("Failed to toggle status:", err);
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      await API.put(`/admin/users/role/${id}`, { role: newRole });
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      console.error("Failed to update role:", err);
    }
  };

  const handleExport = () => {
    window.open("/api/admin/export/users-xlsx", "_blank");
  };

  const handleDeleteUser = async () => {
    if (!deleteUser) return;
    try {
      await API.delete(`/admin/delete/user/${deleteUser._id}`);

      setDeleteUser(null);
      fetchUsers();
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  };

  const stats = useMemo(() => {
    const total = users.length;
    const active = users.filter((u) => u.isActive).length;
    const blocked = users.filter((u) => !u.isActive).length;
    const admins = users.filter((u) => u.role === "admin").length;
    const restaurants = users.filter((u) => u.role === "restaurant").length;
    const customers = users.filter((u) => u.role === "customer").length;
    return { total, active, blocked, admins, restaurants, customers };
  }, [users]);

  const totalCount = useCountUp(stats.total, 0.8);
  const activeCount = useCountUp(stats.active, 0.9);
  const blockedCount = useCountUp(stats.blocked, 1);

  const filteredUsers = useMemo(() => {
    let result = users.filter((user) => {
      const matchesSearch =
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter ? user.role === roleFilter : true;
      const matchesStatus =
        statusFilter === "active"
          ? !!user.isActive
          : statusFilter === "blocked"
          ? !user.isActive
          : true;
      return matchesSearch && matchesRole && matchesStatus;
    });
    result = sortUsers(result, sortBy, sortOrder);
    return result;
  }, [users, searchTerm, roleFilter, statusFilter, sortBy, sortOrder]);

  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE
  );

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100">
      {/* Subtle Background Pattern */}
      <div className="fixed inset-0 z-0 opacity-40 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent dark:from-blue-900/20"></div>

      <motion.div
        className="relative z-10 px-4 sm:px-8 md:px-10 lg:px-12 py-8 max-w-[1600px] mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <HeroHeader
          onExport={handleExport}
          onAddUser={() => {
            setDrawerMode("add");
            setDrawerUser(null);
            setDrawerOpen(true);
          }}
        />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <MiniStatCard
            icon={<FaUsers />}
            value={totalCount}
            label="Total Users"
            gradient="from-blue-500 to-cyan-600"
            delay={0.1}
          />
          <MiniStatCard
            icon={<FaCheckCircle />}
            value={activeCount}
            label="Active"
            gradient="from-emerald-500 to-teal-600"
            delay={0.15}
          />
          <MiniStatCard
            icon={<FaBan />}
            value={blockedCount}
            label="Blocked"
            gradient="from-red-500 to-rose-600"
            delay={0.2}
          />
          <MiniStatCard
            icon={<FaUserShield />}
            value={stats.admins}
            label="Admins"
            gradient="from-purple-500 to-indigo-600"
            delay={0.25}
          />
          <MiniStatCard
            icon={<FaStore />}
            value={stats.restaurants}
            label="Restaurants"
            gradient="from-orange-500 to-pink-600"
            delay={0.3}
          />
          <MiniStatCard
            icon={<FaUser />}
            value={stats.customers}
            label="Customers"
            gradient="from-amber-500 to-orange-600"
            delay={0.35}
          />
        </div>

        <FiltersSection
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          roleFilter={roleFilter}
          setRoleFilter={setRoleFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          totalResults={filteredUsers.length}
        />

        <UsersTable
          users={paginatedUsers}
          loading={loading}
          onToggleStatus={handleToggleStatus}
          onRoleChange={handleRoleChange}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={toggleSort}
          showActionMenu={showActionMenu}
          setShowActionMenu={setShowActionMenu}
          onView={(user) => {
            setDrawerMode("view");
            setDrawerUser(user);
            setDrawerOpen(true);
          }}
          onEdit={(user) => {
            setDrawerMode("edit");
            setDrawerUser(user);
            setDrawerOpen(true);
          }}
          onDelete={setDeleteUser}
          setSearchTerm={setSearchTerm}
          setRoleFilter={setRoleFilter}
          setStatusFilter={setStatusFilter}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredUsers.length}
          itemsPerPage={USERS_PER_PAGE}
          onPageChange={setCurrentPage}
        />

        <AdminAddUserDrawer
          open={drawerOpen}
          mode={drawerMode}
          user={drawerUser}
          onClose={() => {
            setDrawerOpen(false);
            setDrawerUser(null);
          }}
          onSuccess={fetchUsers}
        />
      </motion.div>

      <PremiumDeleteModal
        user={deleteUser}
        onClose={() => setDeleteUser(null)}
        onConfirm={handleDeleteUser}
      />
    </div>
  );
};

/* -------------------------------------------------------------- */
/* SUB-COMPONENTS                                                  */
/* -------------------------------------------------------------- */

const HeroHeader = ({ onExport, onAddUser }) => (
  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-10">
    <div>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="inline-flex items-center gap-2 mb-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 rounded-full border border-blue-100 dark:border-blue-800"
      >
        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
        <span className="text-xs font-bold text-blue-600 dark:text-blue-300 uppercase tracking-wide">
          Administration
        </span>
      </motion.div>

      <motion.h1
        className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        Manage{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
          Users
        </span>
      </motion.h1>

      <motion.p
        className="text-lg text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Oversee user accounts, assign roles, and monitor platform activity from
        a centralized dashboard.
      </motion.p>
    </div>

    <motion.div
      className="flex gap-3"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
    >
      <button
        onClick={onExport}
        className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"
      >
        <FaDownload className="text-slate-400" /> Export
      </button>
      <button
        onClick={onAddUser}
        className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30"
      >
        <FaUserPlus /> Add User
      </button>
    </motion.div>
  </div>
);

const MiniStatCard = ({ icon, value, label, gradient, delay }) => (
  <motion.div
    className="relative group"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    whileHover={{ y: -3 }}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

    <div className="relative p-4 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/10 shadow-md hover:shadow-lg transition-all">
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-md`}
        >
          {icon}
        </div>
        <div>
          <p className="text-xl font-black text-gray-900 dark:text-white">
            {value}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        </div>
      </div>
    </div>
  </motion.div>
);

const FiltersSection = ({
  searchTerm,
  setSearchTerm,
  roleFilter,
  setRoleFilter,
  statusFilter,
  setStatusFilter,
  totalResults,
}) => (
  <motion.div
    className="bg-white dark:bg-slate-900 rounded-2xl p-1 shadow-sm border border-slate-200 dark:border-slate-800 mb-8"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.4 }}
  >
    <div className="flex flex-col lg:flex-row gap-2 p-2">
      <div className="relative flex-1">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border-none text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 transition-all font-medium placeholder:text-slate-400"
        />
      </div>

      <div className="flex gap-2">
        <div className="relative group">
          <FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="pl-10 pr-8 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold focus:ring-2 focus:ring-blue-500/20 outline-none appearance-none cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <option value="">All Roles</option>
            <option value="customer">Customer</option>
            <option value="restaurant">Restaurant</option>
            <option value="admin">Admin</option>
          </select>
          <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none" />
        </div>

        <div className="relative group">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-4 pr-8 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold focus:ring-2 focus:ring-blue-500/20 outline-none appearance-none cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>
          <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none" />
        </div>
      </div>
    </div>
  </motion.div>
);

const UsersTable = ({
  users,
  loading,
  onToggleStatus,
  onRoleChange,
  sortBy,
  sortOrder,
  onSort,
  showActionMenu,
  setShowActionMenu,
  onView,
  onEdit,
  onDelete,
  setSearchTerm,
  setRoleFilter,
  setStatusFilter,
}) => {
  const actionMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        actionMenuRef.current &&
        !actionMenuRef.current.contains(event.target)
      ) {
        setShowActionMenu(null);
      }
    };
    if (showActionMenu !== null)
      document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showActionMenu]);

  // Updated badge logic: Dot + Text instead of full background
  const StatusBadge = ({ isActive }) => (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border ${
        isActive
          ? "bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400"
          : "bg-rose-50 dark:bg-rose-900/10 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          isActive ? "bg-emerald-500" : "bg-rose-500"
        }`}
      ></span>
      {isActive ? "Active" : "Blocked"}
    </div>
  );

  const SortableHeader = ({ field, children }) => (
    <th
      className="px-6 py-4 text-left cursor-pointer group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
      onClick={() => onSort(field)}
    >
      <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
        {children}
        <span
          className={`transition-opacity ${
            sortBy === field
              ? "opacity-100 text-blue-500"
              : "opacity-0 group-hover:opacity-50"
          }`}
        >
          {sortOrder === "asc" ? <FaSortAmountUp /> : <FaSortAmountDown />}
        </span>
      </div>
    </th>
  );

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-12 flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-medium">Loading user data...</p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-12 text-center min-h-[400px] flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
          <FaUsers className="text-3xl text-slate-400" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
          No users match your filters
        </h3>

        <p className="text-slate-500 mb-4">
          Try clearing filters or searching for a different role.
        </p>

        <button
          onClick={() => {
            setSearchTerm("");
            setRoleFilter("");
            setStatusFilter("");
          }}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
        >
          Reset Filters
        </button>
      </div>
    );
  }

  return (
    <motion.div
      className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-200 dark:border-slate-800">
              <SortableHeader field="name">User Profile</SortableHeader>
              <SortableHeader field="email">Contact</SortableHeader>
              <SortableHeader field="role">Role</SortableHeader>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            <AnimatePresence>
              {users.map((user, index) => (
                <motion.tr
                  key={user._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="px-4 lg:px-6 py-3 lg:py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                          {user.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                        <div
                          className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 ${
                            !user.isActive ? "bg-red-500" : "bg-emerald-500"
                          }`}
                        ></div>
                      </div>

                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white">
                          {user.name || "Unnamed User"}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          ID: {user._id?.slice(-8)}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 lg:px-6 py-3 lg:py-4">
                    <div className="hidden md:flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm font-medium">
                      <FaEnvelope className="text-slate-400 text-xs" />
                      {user.email}
                    </div>

                    {/* Mobile / compact view */}
                    <div className="md:hidden text-xs text-slate-500 dark:text-slate-400 truncate">
                      {user.email}
                    </div>
                  </td>

                  <td className="px-4 lg:px-6 py-3 lg:py-4">
                    <PremiumRoleMenu
                      currentRole={user.role}
                      onChange={(r) => onRoleChange(user._id, r)}
                    />
                  </td>

                  <td className="px-4 lg:px-6 py-3 lg:py-4">
                    <StatusBadge isActive={user.isActive} />
                  </td>

                  <td className="px-4 lg:px-6 py-3 lg:py-4">
                    <div className="flex items-center justify-end gap-3 opacity-60 hover:opacity-100 transition-opacity">
                      {/* Subtler Toggle Button */}
                      <button
                        aria-label={
                          user.isActive ? "Block user" : "Unblock user"
                        }
                        onClick={() => onToggleStatus(user._id)}
                        className={`p-2 rounded-lg transition-colors ${
                          user.isActive
                            ? "text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20"
                            : "text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100"
                        }`}
                        title={user.isActive ? "Block User" : "Unblock User"}
                      >
                        {user.isActive ? <FaBan /> : <FaCheckCircle />}
                      </button>

                      <div className="relative">
                        <PremiumDotsButton
                          onClick={() =>
                            setShowActionMenu(
                              showActionMenu === user._id ? null : user._id
                            )
                          }
                          isActive={showActionMenu === user._id}
                          ariaLabel="User actions"
                        />
                        <PremiumActionMenu
                          user={user}
                          isOpen={showActionMenu === user._id}
                          onClose={() => setShowActionMenu(null)}
                          onView={onView}
                          onEdit={onEdit}
                          onDelete={onDelete}
                          menuRef={actionMenuRef}
                        />
                      </div>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <motion.div
      className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6 }}
    >
      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
        Showing{" "}
        <span className="font-bold text-slate-900 dark:text-white">
          {startItem}-{endItem}
        </span>{" "}
        of{" "}
        <span className="font-bold text-slate-900 dark:text-white">
          {totalItems}
        </span>{" "}
        users
      </p>

      <div className="flex items-center gap-2">
        <button
          aria-label="Previous page"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-white dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <FaChevronLeft />
        </button>

        <div className="flex gap-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let page;

            if (totalPages <= 5) {
              page = i + 1;
            } else if (currentPage <= 3) {
              page = i + 1;
            } else if (currentPage >= totalPages - 2) {
              page = totalPages - 4 + i;
            } else {
              page = currentPage - 2 + i;
            }

            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`w-8 h-8 rounded-lg text-sm font-bold transition-all ${
                  currentPage === page
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                    : "text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800"
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>

        <button
          aria-label="Next page"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-white dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <FaChevronRight />
        </button>
      </div>
    </motion.div>
  );
};

export default AdminUsers;

/* outdated view edit delete dropdown */
// import React, { useEffect, useState, useMemo, useRef } from "react";
// import axios from "axios";
// import {
//   FaBan,
//   FaCheckCircle,
//   FaFileExport,
//   FaUsers,
//   FaSearch,
//   FaFilter,
//   FaUserShield,
//   FaStore,
//   FaUser,
//   FaChevronLeft,
//   FaChevronRight,
//   FaUserPlus,
//   FaUserMinus,
//   FaEnvelope,
//   FaCrown,
//   FaEllipsisV,
//   FaEdit,
//   FaTrash,
//   FaEye,
//   FaSortAmountDown,
//   FaSortAmountUp,
//   FaDownload,
// } from "react-icons/fa";
// import AdminAddUserDrawer from "./AdminAddUserDrawer";
// import { motion, AnimatePresence } from "framer-motion";

// /* -------------------------------------------------------------- */
// /* UTILITIES                                                       */
// /* -------------------------------------------------------------- */
// const useCountUp = (to = 0, duration = 0.8) => {
//   const [val, setVal] = useState(0);
//   useEffect(() => {
//     let start = 0;
//     const increment = to / (duration * 60);
//     const timer = setInterval(() => {
//       start += increment;
//       if (start >= to) {
//         setVal(to);
//         clearInterval(timer);
//       } else {
//         setVal(Math.floor(start));
//       }
//     }, 1000 / 60);
//     return () => clearInterval(timer);
//   }, [to, duration]);
//   return val;
// };
// const sortUsers = (users, sortBy, sortOrder) => {
//   const rolePriority = {
//     admin: 1,
//     restaurant: 2,
//     customer: 3,
//   };

//   return [...users].sort((a, b) => {
//     let aVal = a[sortBy];
//     let bVal = b[sortBy];

//     // Role sorting (custom priority)
//     if (sortBy === "role") {
//       aVal = rolePriority[aVal] || 99;
//       bVal = rolePriority[bVal] || 99;
//     }

//     // Date sorting (if used in future)
//     else if (sortBy === "createdAt") {
//       aVal = new Date(aVal).getTime();
//       bVal = new Date(bVal).getTime();
//     }

//     // Boolean sorting
//     else if (typeof aVal === "boolean") {
//       aVal = aVal ? 1 : 0;
//       bVal = bVal ? 1 : 0;
//     }

//     // String fallback
//     else {
//       aVal = aVal?.toString().toLowerCase() || "";
//       bVal = bVal?.toString().toLowerCase() || "";
//     }

//     if (sortOrder === "asc") return aVal > bVal ? 1 : -1;
//     return aVal < bVal ? 1 : -1;
//   });
// };

// /* -------------------------------------------------------------- */
// /* MAIN COMPONENT                                                  */
// /* -------------------------------------------------------------- */

// const AdminUsers = () => {
//   const [users, setUsers] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [roleFilter, setRoleFilter] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [sortBy, setSortBy] = useState("name");
//   const [sortOrder, setSortOrder] = useState("asc");
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [showActionMenu, setShowActionMenu] = useState(null);
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [drawerMode, setDrawerMode] = useState("add"); // add | view | edit
//   const [drawerUser, setDrawerUser] = useState(null);
//   const [deleteUser, setDeleteUser] = useState(null);

//   const USERS_PER_PAGE = 10;

//   // Fetch users
//   const fetchUsers = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get("/api/admin/users", {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });
//       setUsers(res.data.data || []);
//     } catch (err) {
//       console.error("Failed to fetch users:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [searchTerm, roleFilter, statusFilter]);
//   // Toggle user status
//   const handleToggleStatus = async (id) => {
//     try {
//       await axios.patch(
//         `/api/admin/users/status/${id}`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );
//       setUsers((prev) =>
//         prev.map((u) => (u._id === id ? { ...u, isActive: !u.isActive } : u))
//       );
//     } catch (err) {
//       console.error("Failed to toggle user status:", err);
//     }
//   };

//   // Update user role
//   const handleRoleChange = async (id, newRole) => {
//     try {
//       // TODO: show loading state for role dropdown
//       // TODO: show success toast (e.g. "Role updated successfully")
//       await axios.put(
//         `/api/admin/users/role/${id}`,
//         { role: newRole },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );
//       setUsers((prev) =>
//         prev.map((u) => (u._id === id ? { ...u, role: newRole } : u))
//       );
//       // TODO: trigger global success toast here
//     } catch (err) {
//       console.error("Failed to update user role:", err);
//     }
//   };

//   // Export
//   const handleExport = () => {
//     window.open("/api/admin/export/users-xlsx", "_blank");
//   };
//   const handleDeleteUser = async () => {
//     if (!deleteUser) return;

//     try {
//       await axios.delete(`/api/admin/delete/user/${deleteUser._id}`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });

//       setDeleteUser(null);
//       fetchUsers();
//     } catch (err) {
//       console.error("Failed to delete user:", err);
//       alert("Failed to delete user");
//     }
//   };

//   // Stats
//   const stats = useMemo(() => {
//     const total = users.length;
//     const active = users.filter((u) => u.isActive).length;
//     const blocked = users.filter((u) => !u.isActive).length;
//     const admins = users.filter((u) => u.role === "admin").length;
//     const restaurants = users.filter((u) => u.role === "restaurant").length;
//     const customers = users.filter((u) => u.role === "customer").length;

//     return { total, active, blocked, admins, restaurants, customers };
//   }, [users]);

//   // Animated counts
//   const totalCount = useCountUp(stats.total, 0.8);
//   const activeCount = useCountUp(stats.active, 0.9);
//   const blockedCount = useCountUp(stats.blocked, 1);

//   // Filter & Sort
//   const filteredUsers = useMemo(() => {
//     let result = users.filter((user) => {
//       const matchesSearch =
//         user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
//       const matchesRole = roleFilter ? user.role === roleFilter : true;
//       const matchesStatus =
//         statusFilter === "active"
//           ? !!user.isActive
//           : statusFilter === "blocked"
//           ? !user.isActive
//           : true;
//       return matchesSearch && matchesRole && matchesStatus;
//     });

//     // Sort
//     result = sortUsers(result, sortBy, sortOrder);

//     return result;
//   }, [users, searchTerm, roleFilter, statusFilter, sortBy, sortOrder]);

//   // Pagination
//   const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
//   const paginatedUsers = filteredUsers.slice(
//     (currentPage - 1) * USERS_PER_PAGE,
//     currentPage * USERS_PER_PAGE
//   );

//   const toggleSort = (field) => {
//     if (sortBy === field) {
//       setSortOrder(sortOrder === "asc" ? "desc" : "asc");
//     } else {
//       setSortBy(field);
//       setSortOrder("asc");
//     }
//   };
//   const DeleteUserModal = ({ user, onClose, onConfirm }) => {
//     if (!user) return null;

//     return (
//       <AnimatePresence>
//         <motion.div
//           className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//         >
//           <motion.div
//             className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-white/10 w-full max-w-md p-6"
//             initial={{ scale: 0.9, y: 20 }}
//             animate={{ scale: 1, y: 0 }}
//             exit={{ scale: 0.9, y: 20 }}
//           >
//             <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
//               Delete User
//             </h3>

//             <p className="text-gray-600 dark:text-gray-400 mb-6">
//               Are you sure you want to delete{" "}
//               <span className="font-bold text-red-600">{user.name}</span>? This
//               action cannot be undone.
//             </p>

//             <div className="flex gap-3 justify-end">
//               <button
//                 onClick={onClose}
//                 className="px-4 py-2 rounded-xl border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-slate-800"
//               >
//                 Cancel
//               </button>

//               <button
//                 onClick={onConfirm}
//                 className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg"
//               >
//                 Delete
//               </button>
//             </div>
//           </motion.div>
//         </motion.div>
//       </AnimatePresence>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
//       <motion.div
//         className="px-4 sm:px-8 md:px-10 lg:px-12 py-8"
//         initial={{ opacity: 0, y: 30 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//       >
//         {/* Hero Header */}
//         <HeroHeader
//           totalUsers={stats.total}
//           activeUsers={stats.active}
//           onExport={handleExport}
//           onAddUser={() => {
//             setDrawerMode("add");
//             setDrawerUser(null);
//             setDrawerOpen(true);
//           }}
//         />

//         {/* Stats Cards */}
//         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
//           <MiniStatCard
//             icon={<FaUsers />}
//             value={totalCount}
//             label="Total Users"
//             gradient="from-blue-500 to-cyan-600"
//             delay={0.1}
//           />
//           <MiniStatCard
//             icon={<FaCheckCircle />}
//             value={activeCount}
//             label="Active"
//             gradient="from-emerald-500 to-teal-600"
//             delay={0.15}
//           />
//           <MiniStatCard
//             icon={<FaBan />}
//             value={blockedCount}
//             label="Blocked"
//             gradient="from-red-500 to-rose-600"
//             delay={0.2}
//           />
//           <MiniStatCard
//             icon={<FaUserShield />}
//             value={stats.admins}
//             label="Admins"
//             gradient="from-purple-500 to-indigo-600"
//             delay={0.25}
//           />
//           <MiniStatCard
//             icon={<FaStore />}
//             value={stats.restaurants}
//             label="Restaurants"
//             gradient="from-orange-500 to-pink-600"
//             delay={0.3}
//           />
//           <MiniStatCard
//             icon={<FaUser />}
//             value={stats.customers}
//             label="Customers"
//             gradient="from-amber-500 to-orange-600"
//             delay={0.35}
//           />
//         </div>

//         {/* Filters Section */}
//         <FiltersSection
//           searchTerm={searchTerm}
//           setSearchTerm={setSearchTerm}
//           roleFilter={roleFilter}
//           setRoleFilter={setRoleFilter}
//           statusFilter={statusFilter}
//           setStatusFilter={setStatusFilter}
//           totalResults={filteredUsers.length}
//         />

//         {/* Users Table/Grid */}
//         <UsersTable
//           users={paginatedUsers}
//           loading={loading}
//           onToggleStatus={handleToggleStatus}
//           onRoleChange={handleRoleChange}
//           sortBy={sortBy}
//           sortOrder={sortOrder}
//           onSort={toggleSort}
//           showActionMenu={showActionMenu}
//           setShowActionMenu={setShowActionMenu}
//           onView={(user) => {
//             setDrawerMode("view");
//             setDrawerUser(user);
//             setDrawerOpen(true);
//           }}
//           onEdit={(user) => {
//             setDrawerMode("edit");
//             setDrawerUser(user);
//             setDrawerOpen(true);
//           }}
//           onDelete={setDeleteUser}
//         />

//         {/* Pagination */}
//         <Pagination
//           currentPage={currentPage}
//           totalPages={totalPages}
//           totalItems={filteredUsers.length}
//           itemsPerPage={USERS_PER_PAGE}
//           onPageChange={setCurrentPage}
//         />
//         <AdminAddUserDrawer
//           open={drawerOpen}
//           mode={drawerMode}
//           user={drawerUser}
//           onClose={() => {
//             setDrawerOpen(false);
//             setDrawerUser(null);
//           }}
//           onSuccess={fetchUsers}
//         />
//       </motion.div>
//       <DeleteUserModal
//         user={deleteUser}
//         onClose={() => setDeleteUser(null)}
//         onConfirm={handleDeleteUser}
//       />
//     </div>
//   );
// };

// /* -------------------------------------------------------------- */
// /* COMPONENTS                                                      */
// /* -------------------------------------------------------------- */

// /* Hero Header */
// const HeroHeader = ({ totalUsers, activeUsers, onExport, onAddUser }) => (
//   <motion.div
//     className="relative overflow-hidden rounded-3xl shadow-2xl mb-8 border border-blue-200 dark:border-white/10"
//     initial={{ opacity: 0, y: -20 }}
//     animate={{ opacity: 1, y: 0 }}
//   >
//     {/* Gradient Background */}
//     <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700"></div>

//     {/* Pattern Overlay */}
//     <div
//       className="absolute inset-0 opacity-10"
//       style={{
//         backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
//       }}
//     ></div>

//     <div className="relative z-10 p-8 md:p-10">
//       <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
//         {/* Left */}
//         <div>
//           <div className="inline-flex items-center gap-3 mb-4 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
//             <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
//               <FaUsers className="text-white" />
//             </div>
//             <span className="text-white/90 font-semibold">User Management</span>
//           </div>

//           <h1 className="text-3xl md:text-4xl font-black text-white drop-shadow-lg mb-2">
//             Manage Users 👥
//           </h1>
//           <p className="text-white/80 text-lg">
//             View, edit, and manage all platform users
//           </p>
//         </div>

//         {/* Right - Quick Actions */}
//         <div className="flex gap-3 flex-wrap">
//           <motion.button
//             onClick={onExport}
//             className="flex items-center gap-2 px-5 py-3 bg-white/95 backdrop-blur-xl text-indigo-700 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             <FaDownload /> Export Users
//           </motion.button>
//           <motion.button
//             onClick={onAddUser}
//             className="flex items-center gap-2 px-5 py-3 bg-white/20 backdrop-blur-xl text-white font-bold rounded-xl border border-white/30 hover:bg-white/30 transition-all"
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             <FaUserPlus /> Add User
//           </motion.button>
//         </div>
//       </div>
//     </div>
//   </motion.div>
// );

// /* Mini Stat Card */
// const MiniStatCard = ({ icon, value, label, gradient, delay }) => (
//   <motion.div
//     className="relative group"
//     initial={{ opacity: 0, y: 20 }}
//     animate={{ opacity: 1, y: 0 }}
//     transition={{ delay }}
//     whileHover={{ y: -3 }}
//   >
//     <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

//     <div className="relative p-4 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/10 shadow-md hover:shadow-lg transition-all">
//       <div className="flex items-center gap-3">
//         <div
//           className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-md`}
//         >
//           {icon}
//         </div>
//         <div>
//           <p className="text-xl font-black text-gray-900 dark:text-white">
//             {value}
//           </p>
//           <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
//         </div>
//       </div>
//     </div>
//   </motion.div>
// );

// /* Filters Section */
// const FiltersSection = ({
//   searchTerm,
//   setSearchTerm,
//   roleFilter,
//   setRoleFilter,
//   statusFilter,
//   setStatusFilter,
//   totalResults,
// }) => (
//   <motion.div
//     className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-lg border border-gray-200 dark:border-white/10 mb-6"
//     initial={{ opacity: 0, y: 20 }}
//     animate={{ opacity: 1, y: 0 }}
//     transition={{ delay: 0.4 }}
//   >
//     <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
//       {/* Search */}
//       <div className="relative flex-1 w-full lg:max-w-md">
//         <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
//         <input
//           type="text"
//           placeholder="Search by name or email..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//         />
//       </div>

//       {/* Filters */}
//       <div className="flex flex-wrap gap-3 items-center">
//         <div className="flex items-center gap-2">
//           <FaFilter className="text-gray-400" />
//           <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:inline">
//             Filters:
//           </span>
//         </div>

//         {/* Role Filter */}
//         <select
//           value={roleFilter}
//           onChange={(e) => setRoleFilter(e.target.value)}
//           className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-blue-500 transition-all"
//         >
//           <option value="">All Roles</option>
//           <option value="customer">👤 Customer</option>
//           <option value="restaurant">🍽️ Restaurant</option>
//           <option value="admin">🛡️ Admin</option>
//         </select>

//         {/* Status Filter */}
//         <select
//           value={statusFilter}
//           onChange={(e) => setStatusFilter(e.target.value)}
//           className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-blue-500 transition-all"
//         >
//           <option value="">All Status</option>
//           <option value="active">✅ Active</option>
//           <option value="blocked">🚫 Blocked</option>
//         </select>

//         {/* Results Count */}
//         <div className="px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-500/30">
//           <span className="text-sm font-bold text-blue-700 dark:text-blue-400">
//             {totalResults} results
//           </span>
//         </div>
//       </div>
//     </div>
//   </motion.div>
// );

// /* Users Table */
// const UsersTable = ({
//   users,
//   loading,
//   onToggleStatus,
//   onRoleChange,
//   sortBy,
//   sortOrder,
//   onSort,
//   showActionMenu,
//   setShowActionMenu,
//   onView,
//   onEdit,
//   onDelete,
// }) => {
//   const actionMenuRef = useRef(null);
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         actionMenuRef.current &&
//         !actionMenuRef.current.contains(event.target)
//       ) {
//         setShowActionMenu(null);
//       }
//     };

//     if (showActionMenu !== null) {
//       document.addEventListener("mousedown", handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [showActionMenu, setShowActionMenu]);

//   const getRoleConfig = (role) => {
//     switch (role) {
//       case "admin":
//         return {
//           icon: <FaUserShield />,
//           bg: "bg-purple-100 dark:bg-purple-900/30",
//           text: "text-purple-700 dark:text-purple-400",
//           border: "border-purple-200 dark:border-purple-500/30",
//         };
//       case "restaurant":
//         return {
//           icon: <FaStore />,
//           bg: "bg-orange-100 dark:bg-orange-900/30",
//           text: "text-orange-700 dark:text-orange-400",
//           border: "border-orange-200 dark:border-orange-500/30",
//         };
//       default:
//         return {
//           icon: <FaUser />,
//           bg: "bg-blue-100 dark:bg-blue-900/30",
//           text: "text-blue-700 dark:text-blue-400",
//           border: "border-blue-200 dark:border-blue-500/30",
//         };
//     }
//   };

//   const SortableHeader = ({ field, children }) => (
//     <th
//       className="px-6 py-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
//       onClick={() => onSort(field)}
//     >
//       <div className="flex items-center gap-2">
//         {children}
//         {sortBy === field && (
//           <span className="text-blue-500">
//             {sortOrder === "asc" ? <FaSortAmountUp /> : <FaSortAmountDown />}
//           </span>
//         )}
//       </div>
//     </th>
//   );

//   if (loading) {
//     return (
//       <motion.div
//         className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-200 dark:border-white/10 p-12"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//       >
//         <div className="flex flex-col items-center justify-center">
//           <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
//           <p className="text-gray-600 dark:text-gray-400">Loading users...</p>
//         </div>
//       </motion.div>
//     );
//   }

//   if (users.length === 0) {
//     return (
//       <motion.div
//         className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-200 dark:border-white/10 p-12 text-center"
//         initial={{ opacity: 0, scale: 0.95 }}
//         animate={{ opacity: 1, scale: 1 }}
//       >
//         <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
//           <FaUsers className="text-4xl text-gray-400" />
//         </div>
//         <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
//           No Users Found
//         </h3>
//         <p className="text-gray-500 dark:text-gray-400">
//           Try adjusting your search or filter criteria
//         </p>
//       </motion.div>
//     );
//   }

//   return (
//     <motion.div
//       className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-200 dark:border-white/10 overflow-hidden"
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ delay: 0.5 }}
//     >
//       <div className="overflow-x-auto">
//         <table className="w-full">
//           <thead>
//             <tr className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-800 border-b border-gray-200 dark:border-white/10">
//               <SortableHeader field="name">
//                 <span className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
//                   User
//                 </span>
//               </SortableHeader>
//               <SortableHeader field="email">
//                 <span className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
//                   Email
//                 </span>
//               </SortableHeader>
//               <SortableHeader field="role">
//                 <span className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
//                   Role
//                 </span>
//               </SortableHeader>
//               <th className="px-6 py-4 text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
//                 Status
//               </th>
//               <th className="px-6 py-4 text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider text-right">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             <AnimatePresence>
//               {users.map((user, index) => {
//                 const roleConfig = getRoleConfig(user.role);
//                 return (
//                   <motion.tr
//                     key={user._id}
//                     className="border-b border-gray-100 dark:border-white/5 hover:bg-blue-50/50 dark:hover:bg-slate-800/50 transition-colors"
//                     initial={{ opacity: 0, x: -20 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     exit={{ opacity: 0, x: 20 }}
//                     transition={{ delay: index * 0.05 }}
//                   >
//                     {/* User Info */}
//                     <td className="px-6 py-4">
//                       <div className="flex items-center gap-4">
//                         {/* Avatar */}
//                         <div className="relative">
//                           <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
//                             {user.name?.charAt(0)?.toUpperCase() || "U"}
//                           </div>
//                           {/* Status Dot */}
//                           <div
//                             className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 ${
//                               !user.isActive ? "bg-red-500" : "bg-emerald-500"
//                             }`}
//                           ></div>
//                         </div>

//                         <div>
//                           <h4 className="font-bold text-gray-900 dark:text-white">
//                             {user.name || "Unnamed User"}
//                           </h4>
//                           <p className="text-xs text-gray-500 dark:text-gray-400">
//                             ID: {user._id?.slice(-8)}
//                           </p>
//                         </div>
//                       </div>
//                     </td>

//                     {/* Email */}
//                     <td className="px-6 py-4">
//                       <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
//                         <FaEnvelope className="text-gray-400" />
//                         <span className="text-sm">{user.email}</span>
//                       </div>
//                     </td>

//                     {/* Role */}
//                     <td className="px-6 py-4">
//                       <select
//                         value={user.role}
//                         onChange={(e) => onRoleChange(user._id, e.target.value)}
//                         className={`px-3 py-2 rounded-xl ${roleConfig.bg} ${roleConfig.text} border ${roleConfig.border} font-semibold text-sm cursor-pointer focus:ring-2 focus:ring-blue-500 transition-all`}
//                       >
//                         <option value="customer">👤 Customer</option>
//                         <option value="restaurant">🍽️ Restaurant</option>
//                         <option value="admin">🛡️ Admin</option>
//                       </select>
//                     </td>

//                     {/* Status */}
//                     <td className="px-6 py-4">
//                       <span
//                         className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm ${
//                           !user.isActive
//                             ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/30"
//                             : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30"
//                         }`}
//                       >
//                         {!user.isActive ? (
//                           <>
//                             <FaBan /> Blocked
//                           </>
//                         ) : (
//                           <>
//                             <FaCheckCircle /> Active
//                           </>
//                         )}
//                       </span>
//                     </td>

//                     {/* Actions */}
//                     <td className="px-6 py-4">
//                       <div className="flex items-center justify-end gap-2">
//                         {/* Toggle Status Button */}
//                         <motion.button
//                           onClick={() => onToggleStatus(user._id)}
//                           className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
//                             !user.isActive
//                               ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/50"
//                               : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50"
//                           }`}
//                           whileHover={{ scale: 1.05 }}
//                           whileTap={{ scale: 0.95 }}
//                         >
//                           {!user.isActive ? (
//                             <>
//                               <FaCheckCircle /> Unblock
//                             </>
//                           ) : (
//                             <>
//                               <FaBan /> Block
//                             </>
//                           )}
//                         </motion.button>

//                         {/* More Actions */}
//                         <div className="relative">
//                           <motion.button
//                             onClick={() =>
//                               setShowActionMenu(
//                                 showActionMenu === user._id ? null : user._id
//                               )
//                             }
//                             className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
//                             whileHover={{ scale: 1.1 }}
//                             whileTap={{ scale: 0.9 }}
//                           >
//                             <FaEllipsisV className="text-gray-500" />
//                           </motion.button>

//                           <AnimatePresence>
//                             {showActionMenu === user._id && (
//                               <motion.div
//                                 ref={actionMenuRef}
//                                 className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-200 dark:border-white/10 py-2 z-50"
//                                 initial={{ opacity: 0, y: -10 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 exit={{ opacity: 0, y: -10 }}
//                               >
//                                 <button
//                                   onClick={() => {
//                                     setShowActionMenu(null);
//                                     onView(user);
//                                   }}
//                                   className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center gap-3 text-gray-700 dark:text-gray-300"
//                                 >
//                                   <FaEye className="text-blue-500" /> View
//                                   Details
//                                 </button>

//                                 <button
//                                   onClick={() => {
//                                     setShowActionMenu(null);
//                                     onEdit(user);
//                                   }}
//                                   className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center gap-3 text-gray-700 dark:text-gray-300"
//                                 >
//                                   <FaEdit className="text-amber-500" /> Edit
//                                   User
//                                 </button>
//                                 <button
//                                   onClick={() => {
//                                     setShowActionMenu(null);
//                                     onDelete(user);
//                                   }}
//                                   className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center gap-3 text-red-600"
//                                 >
//                                   <FaTrash className="text-red-500" /> Delete
//                                   User
//                                 </button>
//                               </motion.div>
//                             )}
//                           </AnimatePresence>
//                         </div>
//                       </div>
//                     </td>
//                   </motion.tr>
//                 );
//               })}
//             </AnimatePresence>
//           </tbody>
//         </table>
//       </div>
//     </motion.div>
//   );
// };

// /* Pagination */
// const Pagination = ({
//   currentPage,
//   totalPages,
//   totalItems,
//   itemsPerPage,
//   onPageChange,
// }) => {
//   const startItem = (currentPage - 1) * itemsPerPage + 1;
//   const endItem = Math.min(currentPage * itemsPerPage, totalItems);

//   return (
//     <motion.div
//       className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-200 dark:border-white/10"
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ delay: 0.6 }}
//     >
//       {/* Info */}
//       <p className="text-sm text-gray-600 dark:text-gray-400">
//         Showing{" "}
//         <span className="font-bold text-gray-900 dark:text-white">
//           {startItem}-{endItem}
//         </span>{" "}
//         of{" "}
//         <span className="font-bold text-gray-900 dark:text-white">
//           {totalItems}
//         </span>{" "}
//         users
//       </p>

//       {/* Pagination Controls */}
//       <div className="flex items-center gap-2">
//         <motion.button
//           onClick={() => onPageChange(currentPage - 1)}
//           disabled={currentPage === 1}
//           className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
//             currentPage === 1
//               ? "bg-gray-100 dark:bg-slate-800 text-gray-400 cursor-not-allowed"
//               : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50"
//           }`}
//           whileHover={currentPage !== 1 ? { scale: 1.05 } : {}}
//           whileTap={currentPage !== 1 ? { scale: 0.95 } : {}}
//         >
//           <FaChevronLeft /> Previous
//         </motion.button>

//         {/* Page Numbers */}
//         <div className="flex items-center gap-1">
//           {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//             let page;
//             if (totalPages <= 5) {
//               page = i + 1;
//             } else if (currentPage <= 3) {
//               page = i + 1;
//             } else if (currentPage >= totalPages - 2) {
//               page = totalPages - 4 + i;
//             } else {
//               page = currentPage - 2 + i;
//             }

//             return (
//               <motion.button
//                 key={page}
//                 onClick={() => onPageChange(page)}
//                 className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
//                   currentPage === page
//                     ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
//                     : "bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700"
//                 }`}
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.9 }}
//               >
//                 {page}
//               </motion.button>
//             );
//           })}
//         </div>

//         <motion.button
//           onClick={() => onPageChange(currentPage + 1)}
//           disabled={currentPage === totalPages}
//           className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
//             currentPage === totalPages
//               ? "bg-gray-100 dark:bg-slate-800 text-gray-400 cursor-not-allowed"
//               : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50"
//           }`}
//           whileHover={currentPage !== totalPages ? { scale: 1.05 } : {}}
//           whileTap={currentPage !== totalPages ? { scale: 0.95 } : {}}
//         >
//           Next <FaChevronRight />
//         </motion.button>
//       </div>
//     </motion.div>
//   );
// };

// export default AdminUsers;
