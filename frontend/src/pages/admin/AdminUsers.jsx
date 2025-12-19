import React, { useEffect, useState, useMemo, useRef } from "react";
import axios from "axios";
import {
  FaBan,
  FaCheckCircle,
  FaFileExport,
  FaUsers,
  FaSearch,
  FaFilter,
  FaUserShield,
  FaStore,
  FaUser,
  FaChevronLeft,
  FaChevronRight,
  FaUserPlus,
  FaUserMinus,
  FaEnvelope,
  FaCrown,
  FaEllipsisV,
  FaEdit,
  FaTrash,
  FaEye,
  FaSortAmountDown,
  FaSortAmountUp,
  FaDownload,
} from "react-icons/fa";
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

    // Role sorting (custom priority)
    if (sortBy === "role") {
      aVal = rolePriority[aVal] || 99;
      bVal = rolePriority[bVal] || 99;
    }

    // Date sorting (if used in future)
    else if (sortBy === "createdAt") {
      aVal = new Date(aVal).getTime();
      bVal = new Date(bVal).getTime();
    }

    // Boolean sorting
    else if (typeof aVal === "boolean") {
      aVal = aVal ? 1 : 0;
      bVal = bVal ? 1 : 0;
    }

    // String fallback
    else {
      aVal = aVal?.toString().toLowerCase() || "";
      bVal = bVal?.toString().toLowerCase() || "";
    }

    if (sortOrder === "asc") return aVal > bVal ? 1 : -1;
    return aVal < bVal ? 1 : -1;
  });
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
  const [selectedUser, setSelectedUser] = useState(null);
  const [showActionMenu, setShowActionMenu] = useState(null);

  const USERS_PER_PAGE = 10;

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/admin/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
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
  // Toggle user status
  const handleToggleStatus = async (id) => {
    try {
      await axios.patch(
        `/api/admin/users/status/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, isActive: !u.isActive } : u))
      );
    } catch (err) {
      console.error("Failed to toggle user status:", err);
    }
  };

  // Update user role
  const handleRoleChange = async (id, newRole) => {
    try {
      // TODO: show loading state for role dropdown
      // TODO: show success toast (e.g. "Role updated successfully")
      await axios.put(
        `/api/admin/users/role/${id}`,
        { role: newRole },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, role: newRole } : u))
      );
      // TODO: trigger global success toast here
    } catch (err) {
      console.error("Failed to update user role:", err);
    }
  };

  // Export
  const handleExport = () => {
    window.open("/api/admin/export/users-xlsx", "_blank");
  };

  // Stats
  const stats = useMemo(() => {
    const total = users.length;
    const active = users.filter((u) => u.isActive).length;
    const blocked = users.filter((u) => !u.isActive).length;
    const admins = users.filter((u) => u.role === "admin").length;
    const restaurants = users.filter((u) => u.role === "restaurant").length;
    const customers = users.filter((u) => u.role === "customer").length;

    return { total, active, blocked, admins, restaurants, customers };
  }, [users]);

  // Animated counts
  const totalCount = useCountUp(stats.total, 0.8);
  const activeCount = useCountUp(stats.active, 0.9);
  const blockedCount = useCountUp(stats.blocked, 1);

  // Filter & Sort
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

    // Sort
    result = sortUsers(result, sortBy, sortOrder);

    return result;
  }, [users, searchTerm, roleFilter, statusFilter, sortBy, sortOrder]);

  // Pagination
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <motion.div
        className="px-4 sm:px-8 md:px-10 lg:px-12 py-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Hero Header */}
        <HeroHeader
          totalUsers={stats.total}
          activeUsers={stats.active}
          onExport={handleExport}
        />

        {/* Stats Cards */}
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

        {/* Filters Section */}
        <FiltersSection
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          roleFilter={roleFilter}
          setRoleFilter={setRoleFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          totalResults={filteredUsers.length}
        />

        {/* Users Table/Grid */}
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
        />

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredUsers.length}
          itemsPerPage={USERS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      </motion.div>
    </div>
  );
};

/* -------------------------------------------------------------- */
/* COMPONENTS                                                      */
/* -------------------------------------------------------------- */

/* Hero Header */
const HeroHeader = ({ totalUsers, activeUsers, onExport }) => (
  <motion.div
    className="relative overflow-hidden rounded-3xl shadow-2xl mb-8 border border-blue-200 dark:border-white/10"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
  >
    {/* Gradient Background */}
    <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700"></div>

    {/* Pattern Overlay */}
    <div
      className="absolute inset-0 opacity-10"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}
    ></div>

    <div className="relative z-10 p-8 md:p-10">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        {/* Left */}
        <div>
          <div className="inline-flex items-center gap-3 mb-4 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <FaUsers className="text-white" />
            </div>
            <span className="text-white/90 font-semibold">User Management</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-black text-white drop-shadow-lg mb-2">
            Manage Users 👥
          </h1>
          <p className="text-white/80 text-lg">
            View, edit, and manage all platform users
          </p>
        </div>

        {/* Right - Quick Actions */}
        <div className="flex gap-3 flex-wrap">
          <motion.button
            onClick={onExport}
            className="flex items-center gap-2 px-5 py-3 bg-white/95 backdrop-blur-xl text-indigo-700 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaDownload /> Export Users
          </motion.button>
          <motion.button
            className="flex items-center gap-2 px-5 py-3 bg-white/20 backdrop-blur-xl text-white font-bold rounded-xl border border-white/30 hover:bg-white/30 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaUserPlus /> Add User
          </motion.button>
        </div>
      </div>
    </div>
  </motion.div>
);

/* Mini Stat Card */
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

/* Filters Section */
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
    className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-lg border border-gray-200 dark:border-white/10 mb-6"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.4 }}
  >
    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
      {/* Search */}
      <div className="relative flex-1 w-full lg:max-w-md">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2">
          <FaFilter className="text-gray-400" />
          <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:inline">
            Filters:
          </span>
        </div>

        {/* Role Filter */}
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-blue-500 transition-all"
        >
          <option value="">All Roles</option>
          <option value="customer">👤 Customer</option>
          <option value="restaurant">🍽️ Restaurant</option>
          <option value="admin">🛡️ Admin</option>
        </select>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-blue-500 transition-all"
        >
          <option value="">All Status</option>
          <option value="active">✅ Active</option>
          <option value="blocked">🚫 Blocked</option>
        </select>

        {/* Results Count */}
        <div className="px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-500/30">
          <span className="text-sm font-bold text-blue-700 dark:text-blue-400">
            {totalResults} results
          </span>
        </div>
      </div>
    </div>
  </motion.div>
);

/* Users Table */
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

    if (showActionMenu !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showActionMenu, setShowActionMenu]);

  const getRoleConfig = (role) => {
    switch (role) {
      case "admin":
        return {
          icon: <FaUserShield />,
          bg: "bg-purple-100 dark:bg-purple-900/30",
          text: "text-purple-700 dark:text-purple-400",
          border: "border-purple-200 dark:border-purple-500/30",
        };
      case "restaurant":
        return {
          icon: <FaStore />,
          bg: "bg-orange-100 dark:bg-orange-900/30",
          text: "text-orange-700 dark:text-orange-400",
          border: "border-orange-200 dark:border-orange-500/30",
        };
      default:
        return {
          icon: <FaUser />,
          bg: "bg-blue-100 dark:bg-blue-900/30",
          text: "text-blue-700 dark:text-blue-400",
          border: "border-blue-200 dark:border-blue-500/30",
        };
    }
  };

  const SortableHeader = ({ field, children }) => (
    <th
      className="px-6 py-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
      onClick={() => onSort(field)}
    >
      <div className="flex items-center gap-2">
        {children}
        {sortBy === field && (
          <span className="text-blue-500">
            {sortOrder === "asc" ? <FaSortAmountUp /> : <FaSortAmountDown />}
          </span>
        )}
      </div>
    </th>
  );

  if (loading) {
    return (
      <motion.div
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-200 dark:border-white/10 p-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="flex flex-col items-center justify-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading users...</p>
        </div>
      </motion.div>
    );
  }

  if (users.length === 0) {
    return (
      <motion.div
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-200 dark:border-white/10 p-12 text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
          <FaUsers className="text-4xl text-gray-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          No Users Found
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Try adjusting your search or filter criteria
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-200 dark:border-white/10 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-800 border-b border-gray-200 dark:border-white/10">
              <SortableHeader field="name">
                <span className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  User
                </span>
              </SortableHeader>
              <SortableHeader field="email">
                <span className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Email
                </span>
              </SortableHeader>
              <SortableHeader field="role">
                <span className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Role
                </span>
              </SortableHeader>
              <th className="px-6 py-4 text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {users.map((user, index) => {
                const roleConfig = getRoleConfig(user.role);
                return (
                  <motion.tr
                    key={user._id}
                    className="border-b border-gray-100 dark:border-white/5 hover:bg-blue-50/50 dark:hover:bg-slate-800/50 transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {/* User Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <div className="relative">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                            {user.name?.charAt(0)?.toUpperCase() || "U"}
                          </div>
                          {/* Status Dot */}
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

                    {/* Email */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                        <FaEnvelope className="text-gray-400" />
                        <span className="text-sm">{user.email}</span>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-6 py-4">
                      <select
                        value={user.role}
                        onChange={(e) => onRoleChange(user._id, e.target.value)}
                        className={`px-3 py-2 rounded-xl ${roleConfig.bg} ${roleConfig.text} border ${roleConfig.border} font-semibold text-sm cursor-pointer focus:ring-2 focus:ring-blue-500 transition-all`}
                      >
                        <option value="customer">👤 Customer</option>
                        <option value="restaurant">🍽️ Restaurant</option>
                        <option value="admin">🛡️ Admin</option>
                      </select>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm ${
                          !user.isActive
                            ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/30"
                            : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30"
                        }`}
                      >
                        {!user.isActive ? (
                          <>
                            <FaBan /> Blocked
                          </>
                        ) : (
                          <>
                            <FaCheckCircle /> Active
                          </>
                        )}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {/* Toggle Status Button */}
                        <motion.button
                          onClick={() => onToggleStatus(user._id)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                            !user.isActive
                              ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/50"
                              : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50"
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {!user.isActive ? (
                            <>
                              <FaCheckCircle /> Unblock
                            </>
                          ) : (
                            <>
                              <FaBan /> Block
                            </>
                          )}
                        </motion.button>

                        {/* More Actions */}
                        <div className="relative">
                          <motion.button
                            onClick={() =>
                              setShowActionMenu(
                                showActionMenu === user._id ? null : user._id
                              )
                            }
                            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <FaEllipsisV className="text-gray-500" />
                          </motion.button>

                          <AnimatePresence>
                            {showActionMenu === user._id && (
                              <motion.div
                                ref={actionMenuRef}
                                className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-200 dark:border-white/10 py-2 z-50"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                              >
                                <button
                                  onClick={() => setShowActionMenu(null)}
                                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center gap-3 text-gray-700 dark:text-gray-300"
                                >
                                  <FaEye className="text-blue-500" /> View
                                  Details
                                </button>
                                <button
                                  onClick={() => setShowActionMenu(null)}
                                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center gap-3 text-gray-700 dark:text-gray-300"
                                >
                                  <FaEdit className="text-amber-500" /> Edit
                                  User
                                </button>
                                <button
                                  onClick={() => setShowActionMenu(null)}
                                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center gap-3 text-red-600"
                                >
                                  <FaTrash className="text-red-500" /> Delete
                                  User
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

/* Pagination */
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
      className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-200 dark:border-white/10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      {/* Info */}
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Showing{" "}
        <span className="font-bold text-gray-900 dark:text-white">
          {startItem}-{endItem}
        </span>{" "}
        of{" "}
        <span className="font-bold text-gray-900 dark:text-white">
          {totalItems}
        </span>{" "}
        users
      </p>

      {/* Pagination Controls */}
      <div className="flex items-center gap-2">
        <motion.button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
            currentPage === 1
              ? "bg-gray-100 dark:bg-slate-800 text-gray-400 cursor-not-allowed"
              : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50"
          }`}
          whileHover={currentPage !== 1 ? { scale: 1.05 } : {}}
          whileTap={currentPage !== 1 ? { scale: 0.95 } : {}}
        >
          <FaChevronLeft /> Previous
        </motion.button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
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
              <motion.button
                key={page}
                onClick={() => onPageChange(page)}
                className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
                  currentPage === page
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                    : "bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700"
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {page}
              </motion.button>
            );
          })}
        </div>

        <motion.button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
            currentPage === totalPages
              ? "bg-gray-100 dark:bg-slate-800 text-gray-400 cursor-not-allowed"
              : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50"
          }`}
          whileHover={currentPage !== totalPages ? { scale: 1.05 } : {}}
          whileTap={currentPage !== totalPages ? { scale: 0.95 } : {}}
        >
          Next <FaChevronRight />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default AdminUsers;

//old
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { FaBan, FaCheckCircle, FaFileExport } from "react-icons/fa";
// import { motion } from "framer-motion";

// const AdminUsers = () => {
//   const [users, setUsers] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [roleFilter, setRoleFilter] = useState("");
//   const [loading, setLoading] = useState(false);

//   // 🧩 Fetch all users from backend
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

//   // 🔄 Toggle user block/unblock
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
//         prev.map((u) => (u._id === id ? { ...u, isBlocked: !u.isBlocked } : u))
//       );
//     } catch (err) {
//       console.error("Failed to toggle user status:", err);
//     }
//   };

//   // 🧾 Update user role
//   const handleRoleChange = async (id, newRole) => {
//     try {
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
//     } catch (err) {
//       console.error("Failed to update user role:", err);
//     }
//   };

//   // 📤 Export XLSX
//   const handleExport = () => {
//     window.open("/api/admin/export/users-xlsx", "_blank");
//   };

//   // 🔍 Filter users
//   const filteredUsers = users.filter((user) => {
//     const matchesSearch =
//       user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       user.email?.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesRole = roleFilter ? user.role === roleFilter : true;
//     return matchesSearch && matchesRole;
//   });

//   const getStatusColor = (isBlocked) =>
//     isBlocked ? "text-red-500" : "text-green-600";

//   return (
//     <motion.div
//       className="min-h-screen w-full bg-gray-50 dark:bg-gray-950 px-4 sm:px-8 md:px-10 lg:px-12 py-8 text-gray-800 dark:text-white"
//       initial={{ opacity: 0, y: 30 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.4 }}
//     >
//       {/* Header + Filters */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
//         <h2 className="text-2xl font-bold">👥 Manage Users</h2>
//         <div className="flex flex-wrap gap-2 sm:gap-4">
//           <input
//             type="text"
//             placeholder="Search users..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="px-3 py-2 w-full sm:w-56 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-secondary text-sm"
//           />
//           <select
//             value={roleFilter}
//             onChange={(e) => setRoleFilter(e.target.value)}
//             className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-secondary text-sm"
//           >
//             <option value="">All Roles</option>
//             <option value="user">User</option>
//             <option value="restaurant">Restaurant</option>
//             <option value="admin">Admin</option>
//           </select>
//           <button
//             onClick={handleExport}
//             className="px-4 py-2 bg-primary text-white rounded hover:bg-orange-600 text-sm flex items-center gap-2"
//           >
//             <FaFileExport /> Export XLSX
//           </button>
//         </div>
//       </div>

//       {/* User Table */}
//       <div className="overflow-x-auto bg-white dark:bg-secondary rounded-xl shadow">
//         <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
//           <thead>
//             <tr className="bg-gray-100 dark:bg-gray-800 text-sm">
//               <th className="px-4 py-3">Name</th>
//               <th className="px-4 py-3">Email</th>
//               <th className="px-4 py-3">Role</th>
//               <th className="px-4 py-3">Status</th>
//               <th className="px-4 py-3 text-right">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {loading ? (
//               <tr>
//                 <td
//                   colSpan="5"
//                   className="px-4 py-6 text-center text-gray-500 dark:text-gray-400"
//                 >
//                   Loading users...
//                 </td>
//               </tr>
//             ) : filteredUsers.length > 0 ? (
//               filteredUsers.map((user) => (
//                 <tr
//                   key={user._id}
//                   className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 even:bg-gray-50 dark:even:bg-secondary transition"
//                 >
//                   <td className="px-4 py-3 font-medium flex items-center gap-2">
//                     <span
//                       className={`inline-block w-2 h-2 rounded-full ${
//                         user.isBlocked ? "bg-red-500" : "bg-green-500"
//                       }`}
//                     ></span>
//                     {user.name || "Unnamed"}
//                   </td>
//                   <td className="px-4 py-3">{user.email}</td>
//                   <td className="px-4 py-3 capitalize">
//                     <select
//                       value={user.role}
//                       onChange={(e) =>
//                         handleRoleChange(user._id, e.target.value)
//                       }
//                       className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm"
//                     >
//                       <option value="user">User</option>
//                       <option value="restaurant">Restaurant</option>
//                       <option value="admin">Admin</option>
//                     </select>
//                   </td>
//                   <td
//                     className={`px-4 py-3 font-semibold ${getStatusColor(
//                       user.isBlocked
//                     )}`}
//                   >
//                     {user.isBlocked ? "Blocked" : "Active"}
//                   </td>
//                   <td className="px-4 py-3 text-right">
//                     <button
//                       onClick={() => handleToggleStatus(user._id)}
//                       className={`px-3 py-1 text-xs font-semibold rounded-md flex items-center gap-1 transition-all duration-200 ease-in-out cursor-pointer ${
//                         user.isBlocked
//                           ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800"
//                           : "bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800"
//                       }`}
//                     >
//                       {user.isBlocked ? <FaCheckCircle /> : <FaBan />}
//                       {user.isBlocked ? "Unban" : "Ban"}
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td
//                   colSpan="5"
//                   className="px-4 py-6 text-center text-gray-500 dark:text-gray-400"
//                 >
//                   No users found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Footer / Pagination */}
//       <div className="mt-6 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
//         <p>
//           Showing {filteredUsers.length} of {users.length} users
//         </p>
//         <div className="flex gap-2">
//           <button className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600">
//             Prev
//           </button>
//           <button className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600">
//             Next
//           </button>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// export default AdminUsers;
