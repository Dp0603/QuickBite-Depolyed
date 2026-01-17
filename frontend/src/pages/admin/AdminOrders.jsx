import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaShoppingCart,
  FaSearch,
  FaFilter,
  FaEye,
  FaCheckCircle,
  FaHourglassHalf,
  FaTruck,
  FaUtensils,
  FaUser,
  FaStore,
  FaRupeeSign,
  FaDownload,
  FaChevronLeft,
  FaChevronRight,
  FaMotorcycle,
  FaReceipt,
  FaTimes,
  FaSortAmountDown,
  FaSortAmountUp,
  FaChevronDown,
  FaCreditCard,
  FaMapMarkerAlt,
  FaClock,
  FaStar,
} from "react-icons/fa";
import API from "../../api/axios";
import AdminOrdersDrawer from "./AdminOrdersDrawer";

/* -------------------------------------------------------------- */
/* UTILITIES                                                       */
/* -------------------------------------------------------------- */

const useCountUp = (to = 0, duration = 0.8) => {
  const [val, setVal] = useState(0);

  useEffect(() => {
    let rafId;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      setVal(Math.floor(progress * to));

      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      }
    };

    rafId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(rafId);
  }, [to, duration]);

  return val;
};

const currency = (n) =>
  typeof n === "number"
    ? n.toLocaleString("en-IN", { maximumFractionDigits: 0 })
    : n;

const formatTime = (date) =>
  new Date(date).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
const getNestedValue = (obj, path) =>
  path.split(".").reduce((acc, key) => acc?.[key], obj);

/* -------------------------------------------------------------- */
/* MAIN COMPONENT                                                  */
/* -------------------------------------------------------------- */

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState("view"); // "view" | "assign"
  const [drawerOrder, setDrawerOrder] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  const ORDERS_PER_PAGE = 10;

  // Mock Agents (replace with API if needed)
  const deliveryAgents = [
    { id: 1, name: "Deepak Sharma", phone: "+91 98765 43210", rating: 4.8 },
    { id: 2, name: "Sunil Kumar", phone: "+91 98765 43211", rating: 4.6 },
    { id: 3, name: "Meena Rathi", phone: "+91 98765 43212", rating: 4.9 },
    { id: 4, name: "Raj Patel", phone: "+91 98765 43213", rating: 4.7 },
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await API.get("/admin/orders");
        const ordersData = res.data.data || [];
        setOrders(Array.isArray(ordersData) ? ordersData : []);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, sortBy, sortOrder]);

  // Stats
  const stats = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter((o) => o.orderStatus === "Pending").length;
    const preparing = orders.filter(
      (o) => o.orderStatus === "Preparing"
    ).length;
    const outForDelivery = orders.filter(
      (o) => o.orderStatus === "Out for Delivery"
    ).length;
    const delivered = orders.filter(
      (o) => o.orderStatus === "Delivered"
    ).length;
    const totalRevenue = orders
      .filter((o) => o.orderStatus === "Delivered")
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    return {
      total,
      pending,
      preparing,
      outForDelivery,
      delivered,
      totalRevenue,
    };
  }, [orders]);

  const totalCount = useCountUp(stats.total, 0.8);
  const pendingCount = useCountUp(stats.pending, 0.9);
  const deliveredCount = useCountUp(stats.delivered, 1);
  const revenueCount = useCountUp(stats.totalRevenue, 1.2);

  // Filter & Sort
  const filteredOrders = useMemo(() => {
    let result = orders.filter((o) => {
      const matchStatus = statusFilter ? o.orderStatus === statusFilter : true;
      const matchSearch =
        o.customerId?.name?.toLowerCase().includes(search.toLowerCase()) ||
        o.restaurantId?.name?.toLowerCase().includes(search.toLowerCase()) ||
        o._id?.toLowerCase().includes(search.toLowerCase());
      return matchStatus && matchSearch;
    });

    result.sort((a, b) => {
      let aVal = getNestedValue(a, sortBy);
      let bVal = getNestedValue(b, sortBy);

      if (sortBy === "totalAmount") {
        aVal = Number(aVal) || 0;
        bVal = Number(bVal) || 0;
      } else if (sortBy === "createdAt") {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      } else {
        aVal = aVal?.toString().toLowerCase() || "";
        bVal = bVal?.toString().toLowerCase() || "";
      }

      if (aVal === bVal) return a._id.localeCompare(b._id); // ✅ add this

      return sortOrder === "asc"
        ? aVal > bVal
          ? 1
          : -1
        : aVal < bVal
        ? 1
        : -1;
    });

    return result;
  }, [orders, search, statusFilter, sortBy, sortOrder]);

  const totalPages = Math.ceil(filteredOrders.length / ORDERS_PER_PAGE);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ORDERS_PER_PAGE,
    currentPage * ORDERS_PER_PAGE
  );

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const handleExport = () => {
    window.open("/api/admin/export/orders-csv", "_blank");
  };

  const handleAssignAgent = async (orderId, agentId) => {
    try {
      // 1️⃣ Optimistic UI update
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId
            ? {
                ...o,
                deliveryDetails: {
                  ...o.deliveryDetails,
                  deliveryAgentId: {
                    id: agentId,
                    name: deliveryAgents.find((a) => a.id === agentId)?.name,
                  },
                },
                orderStatus: "Out for Delivery",
              }
            : o
        )
      );

      // 2️⃣ API call
      await API.post(`/admin/orders/${orderId}/assign-agent`, {
        agentId,
      });

      // 3️⃣ Close drawer
      setDrawerOpen(false);
      setDrawerOrder(null);
      setDrawerMode("view");
    } catch (err) {
      console.error("Failed to assign agent:", err);

      // 4️⃣ Rollback on error (refetch is safest)
      try {
        const res = await API.get("/admin/orders");
        setOrders(res.data.data || []);
      } catch (e) {
        console.error("Failed to rollback orders:", e);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100">
      <div className="fixed inset-0 z-0 opacity-40 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100/40 via-transparent to-transparent dark:from-indigo-900/20"></div>

      <motion.div
        className="relative z-10 px-4 sm:px-8 md:px-10 lg:px-12 py-8 max-w-[1600px] mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <HeroHeader onExport={handleExport} />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <MiniStatCard
            icon={<FaShoppingCart />}
            value={totalCount}
            label="Total Orders"
            gradient="from-blue-500 to-cyan-600"
            delay={0.1}
          />
          <MiniStatCard
            icon={<FaHourglassHalf />}
            value={pendingCount}
            label="Pending"
            gradient="from-amber-500 to-orange-600"
            delay={0.15}
          />
          <MiniStatCard
            icon={<FaUtensils />}
            value={stats.preparing}
            label="Preparing"
            gradient="from-indigo-500 to-purple-600"
            delay={0.2}
          />
          <MiniStatCard
            icon={<FaTruck />}
            value={stats.outForDelivery}
            label="On The Way"
            gradient="from-blue-600 to-indigo-600"
            delay={0.25}
          />
          <MiniStatCard
            icon={<FaCheckCircle />}
            value={deliveredCount}
            label="Delivered"
            gradient="from-emerald-500 to-teal-600"
            delay={0.3}
          />
          <MiniStatCard
            icon={<FaRupeeSign />}
            value={`₹${currency(revenueCount)}`}
            label="Total Revenue"
            gradient="from-rose-500 to-pink-600"
            delay={0.35}
          />
        </div>

        <FiltersSection
          search={search}
          setSearch={setSearch}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          totalResults={filteredOrders.length}
        />

        <OrdersTable
          orders={paginatedOrders}
          loading={loading}
          onView={(order) => {
            setDrawerMode("view");
            setDrawerOrder(order);
            setDrawerOpen(true);
          }}
          onAssign={(order) => {
            setDrawerMode("assign");
            setDrawerOrder(order);
            setDrawerOpen(true);
          }}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={toggleSort}
        />

        {!loading && paginatedOrders.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredOrders.length}
            itemsPerPage={ORDERS_PER_PAGE}
            onPageChange={setCurrentPage}
          />
        )}

        {/* Drawers */}
        <AdminOrdersDrawer
          open={drawerOpen}
          mode={drawerMode}
          order={drawerOrder}
          agents={deliveryAgents}
          onAssign={handleAssignAgent}
          onClose={() => {
            setDrawerOpen(false);
            setDrawerOrder(null);
            setDrawerMode("view");
          }}
        />
      </motion.div>
    </div>
  );
};

/* -------------------------------------------------------------- */
/* SUB-COMPONENTS                                                  */
/* -------------------------------------------------------------- */

const HeroHeader = ({ onExport }) => (
  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-10">
    <div>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="inline-flex items-center gap-2 mb-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 rounded-full border border-indigo-100 dark:border-indigo-800"
      >
        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-300 uppercase tracking-wide">
          Logistics
        </span>
      </motion.div>

      <motion.h1
        className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        Order{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
          Management
        </span>
      </motion.h1>

      <motion.p
        className="text-lg text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Monitor live orders, assign delivery agents, and track revenue flow in
        real-time.
      </motion.p>
    </div>

    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
    >
      <button
        onClick={onExport}
        className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"
      >
        <FaDownload className="text-slate-400" /> Export CSV
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
  search,
  setSearch,
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
          placeholder="Search order ID, customer or restaurant..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border-none text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium placeholder:text-slate-400"
        />
      </div>

      <div className="flex gap-2">
        <div className="relative group min-w-[180px]">
          <FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-10 pr-8 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold focus:ring-2 focus:ring-indigo-500/20 outline-none appearance-none cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Preparing">Preparing</option>
            <option value="Ready">Ready</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none" />
        </div>

        <div className="hidden sm:flex items-center px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-bold text-xs whitespace-nowrap">
          {totalResults} Results
        </div>
      </div>
    </div>
  </motion.div>
);

const OrdersTable = ({
  orders,
  loading,
  onView,
  onAssign,
  sortBy,
  sortOrder,
  onSort,
}) => {
  const SortableHeader = ({ field, children, className = "" }) => (
    <th
      className={`px-6 py-4 text-left cursor-pointer group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${className}`}
      onClick={() => onSort(field)}
    >
      <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
        {children}
        <span
          className={`transition-opacity ${
            sortBy === field
              ? "opacity-100 text-indigo-500"
              : "opacity-0 group-hover:opacity-50"
          }`}
        >
          {sortOrder === "asc" ? <FaSortAmountUp /> : <FaSortAmountDown />}
        </span>
      </div>
    </th>
  );

  const StatusBadge = ({ status }) => {
    const config =
      {
        Pending: "bg-amber-50 text-amber-600 border-amber-200",
        Preparing: "bg-blue-50 text-blue-600 border-blue-200",
        Ready: "bg-purple-50 text-purple-600 border-purple-200",
        "Out for Delivery": "bg-indigo-50 text-indigo-600 border-indigo-200",
        Delivered: "bg-emerald-50 text-emerald-600 border-emerald-200",
        Cancelled: "bg-red-50 text-red-600 border-red-200",
      }[status] || "bg-slate-50 text-slate-600 border-slate-200";

    const darkMap = {
      "bg-amber-50": "dark:bg-amber-900/10",
      "text-amber-600": "dark:text-amber-400",
      "border-amber-200": "dark:border-amber-800",
      "bg-blue-50": "dark:bg-blue-900/10",
      "text-blue-600": "dark:text-blue-400",
      "border-blue-200": "dark:border-blue-800",
      "bg-purple-50": "dark:bg-purple-900/10",
      "text-purple-600": "dark:text-purple-400",
      "border-purple-200": "dark:border-purple-800",
      "bg-indigo-50": "dark:bg-indigo-900/10",
      "text-indigo-600": "dark:text-indigo-400",
      "border-indigo-200": "dark:border-indigo-800",
      "bg-emerald-50": "dark:bg-emerald-900/10",
      "text-emerald-600": "dark:text-emerald-400",
      "border-emerald-200": "dark:border-emerald-800",
      "bg-red-50": "dark:bg-red-900/10",
      "text-red-600": "dark:text-red-400",
      "border-red-200": "dark:border-red-800",
      "bg-slate-50": "dark:bg-slate-900/10",
      "text-slate-600": "dark:text-slate-300",
      "border-slate-200": "dark:border-slate-700",
    };

    const dotColor =
      {
        Pending: "bg-amber-500",
        Preparing: "bg-blue-500",
        Ready: "bg-purple-500",
        "Out for Delivery": "bg-indigo-500",
        Delivered: "bg-emerald-500",
        Cancelled: "bg-red-500",
      }[status] || "bg-slate-500";

    const base = config.split(" ");
    const cls = base.map((c) => `${c} ${darkMap[c] || ""}`).join(" ");

    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border ${cls}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
        {status}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-12 flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-medium">Loading orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-12 text-center min-h-[400px] flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
          <FaShoppingCart className="text-3xl text-slate-400" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
          No orders found
        </h3>
        <p className="text-slate-500">Try adjusting your filters.</p>
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
              <SortableHeader field="_id">Order ID</SortableHeader>
              <SortableHeader field="customerId.name">Customer</SortableHeader>
              <SortableHeader field="restaurantId.name">
                Restaurant
              </SortableHeader>
              <SortableHeader field="totalAmount">Amount</SortableHeader>
              <SortableHeader field="orderStatus">Status</SortableHeader>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Agent
              </th>
              <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            <AnimatePresence>
              {orders.map((order, index) => (
                <motion.tr
                  key={order._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-lg shadow-md">
                        <FaReceipt className="text-sm" />
                      </div>
                      <div>
                        <span className="block font-bold text-slate-900 dark:text-white text-sm">
                          #{order._id?.slice(-6).toUpperCase()}
                        </span>
                        <span className="text-xs text-slate-500">
                          {formatTime(order.createdAt)}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] text-slate-500">
                        <FaUser />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          {order.customerId?.name || "Unknown"}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {order.customerId?.phone || ""}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <FaStore className="text-slate-400 text-xs" />
                      {order.restaurantId?.name || "Unknown"}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className="font-bold text-slate-900 dark:text-white">
                      ₹{currency(order.totalAmount)}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <StatusBadge status={order.orderStatus} />
                  </td>

                  <td className="px-6 py-4">
                    {order.deliveryDetails?.deliveryAgentId?.name ? (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center text-xs">
                          <FaMotorcycle />
                        </div>
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                          {
                            order.deliveryDetails.deliveryAgentId.name.split(
                              " "
                            )[0]
                          }
                        </span>
                      </div>
                    ) : (
                      <button
                        onClick={() => onAssign(order)}
                        disabled={
                          order.orderStatus === "Delivered" ||
                          order.orderStatus === "Cancelled"
                        }
                        className="px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        + Assign
                      </button>
                    )}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => onView(order)}
                      className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all"
                      title="View Details"
                    >
                      <FaEye />
                    </button>
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
        orders
      </p>

      <div className="flex items-center gap-2">
        <button
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
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/30"
                    : "text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800"
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>

        <button
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

export default AdminOrders;

// old
// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { FaShoppingCart } from "react-icons/fa";
// import API from "../../api/axios";

// const AdminOrders = () => {
//   const [orders, setOrders] = useState([]);
//   const [statusFilter, setStatusFilter] = useState("");
//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(false);

//   const deliveryAgents = ["Deepak Sharma", "Sunil Kumar", "Meena Rathi"];

//   const statusColors = {
//     Pending:
//       "text-yellow-600 bg-yellow-100 dark:bg-yellow-800 dark:text-yellow-300",
//     Preparing: "text-blue-600 bg-blue-100 dark:bg-blue-800 dark:text-blue-300",
//     Ready: "text-blue-500 bg-blue-100 dark:bg-blue-800 dark:text-blue-300",
//     "Out for Delivery":
//       "text-indigo-600 bg-indigo-100 dark:bg-indigo-800 dark:text-indigo-300",
//     Delivered:
//       "text-green-600 bg-green-100 dark:bg-green-800 dark:text-green-300",
//     Cancelled: "text-red-600 bg-red-100 dark:bg-red-800 dark:text-red-300",
//   };

//   useEffect(() => {
//     const fetchOrders = async () => {
//       setLoading(true);
//       try {
//         const res = await API.get("/admin/orders");
//         const orders = res.data.data || []; // use 'data' instead of 'orders'
//         setOrders(orders);
//         if (!Array.isArray(orders)) {
//           console.error("❌ API response is not an array:", res.data);
//           setOrders([]);
//         } else {
//           setOrders(orders);
//         }
//       } catch (err) {
//         console.error("❌ Error fetching orders:", err);
//         setOrders([]);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchOrders();
//   }, []);

//   const filtered = (orders || []).filter((o) => {
//     const matchStatus = statusFilter ? o.orderStatus === statusFilter : true;
//     const matchSearch =
//       o.customerId?.name?.toLowerCase().includes(search.toLowerCase()) ||
//       o.restaurantId?.name?.toLowerCase().includes(search.toLowerCase());
//     return matchStatus && matchSearch;
//   });

//   return (
//     <motion.div
//       className="min-h-screen w-full bg-gray-50 dark:bg-gray-950 px-4 sm:px-8 md:px-10 lg:px-12 py-8 text-gray-800 dark:text-white"
//       initial={{ opacity: 0, y: 30 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.4 }}
//     >
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
//         <h2 className="text-2xl font-bold flex items-center gap-2">
//           <FaShoppingCart /> Manage Orders
//         </h2>
//         <div className="flex flex-wrap gap-2 sm:gap-4">
//           <input
//             type="text"
//             placeholder="Search customer or restaurant"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="px-3 py-2 w-full sm:w-64 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-secondary text-sm"
//           />
//           <select
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//             className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-secondary text-sm"
//           >
//             <option value="">All Statuses</option>
//             {Object.keys(statusColors).map((status) => (
//               <option key={status} value={status}>
//                 {status}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto bg-white dark:bg-secondary rounded-xl shadow">
//         <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
//           <thead>
//             <tr className="bg-gray-100 dark:bg-gray-800 text-sm">
//               <th className="px-4 py-3">Customer</th>
//               <th className="px-4 py-3">Restaurant</th>
//               <th className="px-4 py-3">Total</th>
//               <th className="px-4 py-3">Status</th>
//               <th className="px-4 py-3">Delivery Agent</th>
//               <th className="px-4 py-3 text-right">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {loading ? (
//               <tr>
//                 <td colSpan="6" className="px-4 py-6 text-center">
//                   Loading orders...
//                 </td>
//               </tr>
//             ) : filtered.length > 0 ? (
//               filtered.map((order) => (
//                 <tr
//                   key={order._id}
//                   className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 even:bg-gray-50 dark:even:bg-secondary transition"
//                 >
//                   <td className="px-4 py-3 font-medium">
//                     {order.customerId?.name || "Unknown"}
//                   </td>
//                   <td className="px-4 py-3">
//                     {order.restaurantId?.name || "Unknown"}
//                   </td>
//                   <td className="px-4 py-3 font-semibold">
//                     ₹{order.totalAmount}
//                   </td>
//                   <td className="px-4 py-3">
//                     <span
//                       className={`px-2 py-1 rounded-full text-xs font-medium ${
//                         statusColors[order.orderStatus] || ""
//                       }`}
//                     >
//                       {order.orderStatus}
//                     </span>
//                   </td>
//                   <td className="px-4 py-3">
//                     {order.deliveryDetails?.deliveryAgentId?.name ? (
//                       order.deliveryDetails.deliveryAgentId.name
//                     ) : (
//                       <select className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800">
//                         <option value="">Assign</option>
//                         {deliveryAgents.map((agent, i) => (
//                           <option key={i} value={agent}>
//                             {agent}
//                           </option>
//                         ))}
//                       </select>
//                     )}
//                   </td>
//                   <td className="px-4 py-3 text-right">
//                     <button className="px-3 py-1 text-xs font-medium bg-primary text-white rounded hover:bg-orange-600 transition">
//                       View
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td
//                   colSpan="6"
//                   className="px-4 py-6 text-center text-gray-500 dark:text-gray-400"
//                 >
//                   No orders found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </motion.div>
//   );
// };

// export default AdminOrders;
