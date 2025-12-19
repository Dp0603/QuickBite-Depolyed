import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaShoppingCart } from "react-icons/fa";
import API from "../../api/axios";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const deliveryAgents = ["Deepak Sharma", "Sunil Kumar", "Meena Rathi"];

  const statusColors = {
    Pending:
      "text-yellow-600 bg-yellow-100 dark:bg-yellow-800 dark:text-yellow-300",
    Preparing: "text-blue-600 bg-blue-100 dark:bg-blue-800 dark:text-blue-300",
    Ready: "text-blue-500 bg-blue-100 dark:bg-blue-800 dark:text-blue-300",
    "Out for Delivery":
      "text-indigo-600 bg-indigo-100 dark:bg-indigo-800 dark:text-indigo-300",
    Delivered:
      "text-green-600 bg-green-100 dark:bg-green-800 dark:text-green-300",
    Cancelled: "text-red-600 bg-red-100 dark:bg-red-800 dark:text-red-300",
  };

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await API.get("/admin/orders");
        const orders = res.data.data || []; // use 'data' instead of 'orders'
        setOrders(orders);
        if (!Array.isArray(orders)) {
          console.error("❌ API response is not an array:", res.data);
          setOrders([]);
        } else {
          setOrders(orders);
        }
      } catch (err) {
        console.error("❌ Error fetching orders:", err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filtered = (orders || []).filter((o) => {
    const matchStatus = statusFilter ? o.orderStatus === statusFilter : true;
    const matchSearch =
      o.customerId?.name?.toLowerCase().includes(search.toLowerCase()) ||
      o.restaurantId?.name?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <motion.div
      className="min-h-screen w-full bg-gray-50 dark:bg-gray-950 px-4 sm:px-8 md:px-10 lg:px-12 py-8 text-gray-800 dark:text-white"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FaShoppingCart /> Manage Orders
        </h2>
        <div className="flex flex-wrap gap-2 sm:gap-4">
          <input
            type="text"
            placeholder="Search customer or restaurant"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 w-full sm:w-64 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-secondary text-sm"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-secondary text-sm"
          >
            <option value="">All Statuses</option>
            {Object.keys(statusColors).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white dark:bg-secondary rounded-xl shadow">
        <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800 text-sm">
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Restaurant</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Delivery Agent</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="px-4 py-6 text-center">
                  Loading orders...
                </td>
              </tr>
            ) : filtered.length > 0 ? (
              filtered.map((order) => (
                <tr
                  key={order._id}
                  className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 even:bg-gray-50 dark:even:bg-secondary transition"
                >
                  <td className="px-4 py-3 font-medium">
                    {order.customerId?.name || "Unknown"}
                  </td>
                  <td className="px-4 py-3">
                    {order.restaurantId?.name || "Unknown"}
                  </td>
                  <td className="px-4 py-3 font-semibold">
                    ₹{order.totalAmount}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        statusColors[order.orderStatus] || ""
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {order.deliveryDetails?.deliveryAgentId?.name ? (
                      order.deliveryDetails.deliveryAgentId.name
                    ) : (
                      <select className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800">
                        <option value="">Assign</option>
                        {deliveryAgents.map((agent, i) => (
                          <option key={i} value={agent}>
                            {agent}
                          </option>
                        ))}
                      </select>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="px-3 py-1 text-xs font-medium bg-primary text-white rounded hover:bg-orange-600 transition">
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="px-4 py-6 text-center text-gray-500 dark:text-gray-400"
                >
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default AdminOrders;

// new but not tested
// import React, { useState, useEffect, useMemo } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   FaShoppingCart,
//   FaSearch,
//   FaFilter,
//   FaEye,
//   FaCheckCircle,
//   FaHourglassHalf,
//   FaTimesCircle,
//   FaTruck,
//   FaUtensils,
//   FaClipboardList,
//   FaUser,
//   FaStore,
//   FaRupeeSign,
//   FaCalendarAlt,
//   FaMapMarkerAlt,
//   FaPhone,
//   FaClock,
//   FaDownload,
//   FaChevronLeft,
//   FaChevronRight,
//   FaMotorcycle,
//   FaBoxOpen,
//   FaReceipt,
//   FaExclamationTriangle,
//   FaTimes,
//   FaUserPlus,
//   FaRoute,
//   FaCreditCard,
//   FaHistory,
//   FaSortAmountDown,
//   FaSortAmountUp,
//   FaFileExport,
// } from "react-icons/fa";
// import API from "../../api/axios";

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

// const currency = (n) =>
//   typeof n === "number"
//     ? n.toLocaleString("en-IN", { maximumFractionDigits: 0 })
//     : n;

// const formatDate = (date) => {
//   return new Date(date).toLocaleDateString("en-IN", {
//     day: "numeric",
//     month: "short",
//     year: "numeric",
//   });
// };

// const formatTime = (date) => {
//   return new Date(date).toLocaleTimeString("en-IN", {
//     hour: "2-digit",
//     minute: "2-digit",
//   });
// };

// /* -------------------------------------------------------------- */
// /* MAIN COMPONENT                                                  */
// /* -------------------------------------------------------------- */

// const AdminOrders = () => {
//   const [orders, setOrders] = useState([]);
//   const [statusFilter, setStatusFilter] = useState("");
//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [sortBy, setSortBy] = useState("createdAt");
//   const [sortOrder, setSortOrder] = useState("desc");
//   const [assigningAgent, setAssigningAgent] = useState(null);

//   const ORDERS_PER_PAGE = 10;

//   const deliveryAgents = [
//     { id: 1, name: "Deepak Sharma", phone: "+91 98765 43210", rating: 4.8 },
//     { id: 2, name: "Sunil Kumar", phone: "+91 98765 43211", rating: 4.6 },
//     { id: 3, name: "Meena Rathi", phone: "+91 98765 43212", rating: 4.9 },
//     { id: 4, name: "Raj Patel", phone: "+91 98765 43213", rating: 4.7 },
//   ];

//   const statusConfig = {
//     Pending: {
//       icon: <FaHourglassHalf />,
//       bg: "bg-amber-100 dark:bg-amber-900/30",
//       text: "text-amber-700 dark:text-amber-400",
//       border: "border-amber-200 dark:border-amber-500/30",
//       gradient: "from-amber-500 to-orange-600",
//     },
//     Preparing: {
//       icon: <FaUtensils />,
//       bg: "bg-blue-100 dark:bg-blue-900/30",
//       text: "text-blue-700 dark:text-blue-400",
//       border: "border-blue-200 dark:border-blue-500/30",
//       gradient: "from-blue-500 to-cyan-600",
//     },
//     Ready: {
//       icon: <FaBoxOpen />,
//       bg: "bg-purple-100 dark:bg-purple-900/30",
//       text: "text-purple-700 dark:text-purple-400",
//       border: "border-purple-200 dark:border-purple-500/30",
//       gradient: "from-purple-500 to-indigo-600",
//     },
//     "Out for Delivery": {
//       icon: <FaTruck />,
//       bg: "bg-indigo-100 dark:bg-indigo-900/30",
//       text: "text-indigo-700 dark:text-indigo-400",
//       border: "border-indigo-200 dark:border-indigo-500/30",
//       gradient: "from-indigo-500 to-purple-600",
//     },
//     Delivered: {
//       icon: <FaCheckCircle />,
//       bg: "bg-emerald-100 dark:bg-emerald-900/30",
//       text: "text-emerald-700 dark:text-emerald-400",
//       border: "border-emerald-200 dark:border-emerald-500/30",
//       gradient: "from-emerald-500 to-teal-600",
//     },
//     Cancelled: {
//       icon: <FaTimesCircle />,
//       bg: "bg-red-100 dark:bg-red-900/30",
//       text: "text-red-700 dark:text-red-400",
//       border: "border-red-200 dark:border-red-500/30",
//       gradient: "from-red-500 to-rose-600",
//     },
//   };

//   // Fetch orders
//   useEffect(() => {
//     const fetchOrders = async () => {
//       setLoading(true);
//       try {
//         const res = await API.get("/admin/orders");
//         const ordersData = res.data.data || [];
//         if (!Array.isArray(ordersData)) {
//           console.error("❌ API response is not an array:", res.data);
//           setOrders([]);
//         } else {
//           setOrders(ordersData);
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

//   // Stats
//   const stats = useMemo(() => {
//     const total = orders.length;
//     const pending = orders.filter((o) => o.orderStatus === "Pending").length;
//     const preparing = orders.filter(
//       (o) => o.orderStatus === "Preparing"
//     ).length;
//     const outForDelivery = orders.filter(
//       (o) => o.orderStatus === "Out for Delivery"
//     ).length;
//     const delivered = orders.filter(
//       (o) => o.orderStatus === "Delivered"
//     ).length;
//     const cancelled = orders.filter(
//       (o) => o.orderStatus === "Cancelled"
//     ).length;
//     const totalRevenue = orders
//       .filter((o) => o.orderStatus === "Delivered")
//       .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

//     return {
//       total,
//       pending,
//       preparing,
//       outForDelivery,
//       delivered,
//       cancelled,
//       totalRevenue,
//     };
//   }, [orders]);

//   // Animated counts
//   const totalCount = useCountUp(stats.total, 0.8);
//   const pendingCount = useCountUp(stats.pending, 0.9);
//   const deliveredCount = useCountUp(stats.delivered, 1);
//   const revenueCount = useCountUp(stats.totalRevenue, 1.2);

//   // Filter & Sort
//   const filteredOrders = useMemo(() => {
//     let result = orders.filter((o) => {
//       const matchStatus = statusFilter ? o.orderStatus === statusFilter : true;
//       const matchSearch =
//         o.customerId?.name?.toLowerCase().includes(search.toLowerCase()) ||
//         o.restaurantId?.name?.toLowerCase().includes(search.toLowerCase()) ||
//         o._id?.toLowerCase().includes(search.toLowerCase());
//       return matchStatus && matchSearch;
//     });

//     // Sort
//     result.sort((a, b) => {
//       let aVal = a[sortBy];
//       let bVal = b[sortBy];

//       if (sortBy === "totalAmount") {
//         aVal = Number(aVal) || 0;
//         bVal = Number(bVal) || 0;
//       } else if (sortBy === "createdAt") {
//         aVal = new Date(aVal).getTime();
//         bVal = new Date(bVal).getTime();
//       }

//       if (sortOrder === "asc") return aVal > bVal ? 1 : -1;
//       return aVal < bVal ? 1 : -1;
//     });

//     return result;
//   }, [orders, search, statusFilter, sortBy, sortOrder]);

//   // Pagination
//   const totalPages = Math.ceil(filteredOrders.length / ORDERS_PER_PAGE);
//   const paginatedOrders = filteredOrders.slice(
//     (currentPage - 1) * ORDERS_PER_PAGE,
//     currentPage * ORDERS_PER_PAGE
//   );

//   const toggleSort = (field) => {
//     if (sortBy === field) {
//       setSortOrder(sortOrder === "asc" ? "desc" : "asc");
//     } else {
//       setSortBy(field);
//       setSortOrder("desc");
//     }
//   };

//   // Assign delivery agent
//   const handleAssignAgent = async (orderId, agentId) => {
//     try {
//       // API call to assign agent
//       // await API.put(`/admin/orders/${orderId}/assign`, { agentId });
//       console.log(`Assigned agent ${agentId} to order ${orderId}`);
//       setAssigningAgent(null);
//     } catch (err) {
//       console.error("Failed to assign agent:", err);
//     }
//   };

//   // Export orders
//   const handleExport = () => {
//     window.open("/api/admin/export/orders-csv", "_blank");
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
//       <motion.div
//         className="px-4 sm:px-8 md:px-10 lg:px-12 py-8"
//         initial={{ opacity: 0, y: 30 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//       >
//         {/* Hero Header */}
//         <HeroHeader
//           pendingOrders={stats.pending + stats.preparing}
//           todayRevenue={stats.totalRevenue}
//           onExport={handleExport}
//         />

//         {/* Stats Cards */}
//         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
//           <StatsCard
//             icon={<FaShoppingCart />}
//             value={totalCount}
//             label="Total Orders"
//             gradient="from-blue-500 to-cyan-600"
//             delay={0.1}
//           />
//           <StatsCard
//             icon={<FaHourglassHalf />}
//             value={pendingCount}
//             label="Pending"
//             gradient="from-amber-500 to-orange-600"
//             delay={0.15}
//             pulse={stats.pending > 0}
//           />
//           <StatsCard
//             icon={<FaUtensils />}
//             value={stats.preparing}
//             label="Preparing"
//             gradient="from-blue-500 to-indigo-600"
//             delay={0.2}
//           />
//           <StatsCard
//             icon={<FaTruck />}
//             value={stats.outForDelivery}
//             label="Out for Delivery"
//             gradient="from-indigo-500 to-purple-600"
//             delay={0.25}
//           />
//           <StatsCard
//             icon={<FaCheckCircle />}
//             value={deliveredCount}
//             label="Delivered"
//             gradient="from-emerald-500 to-teal-600"
//             delay={0.3}
//           />
//           <StatsCard
//             icon={<FaRupeeSign />}
//             value={`₹${currency(revenueCount)}`}
//             label="Revenue"
//             gradient="from-rose-500 to-pink-600"
//             delay={0.35}
//           />
//         </div>

//         {/* Filters Section */}
//         <FiltersSection
//           search={search}
//           setSearch={setSearch}
//           statusFilter={statusFilter}
//           setStatusFilter={setStatusFilter}
//           statusConfig={statusConfig}
//           totalResults={filteredOrders.length}
//         />

//         {/* Orders Table */}
//         {loading ? (
//           <LoadingState />
//         ) : paginatedOrders.length === 0 ? (
//           <EmptyState />
//         ) : (
//           <OrdersTable
//             orders={paginatedOrders}
//             statusConfig={statusConfig}
//             onView={setSelectedOrder}
//             onAssign={setAssigningAgent}
//             sortBy={sortBy}
//             sortOrder={sortOrder}
//             onSort={toggleSort}
//           />
//         )}

//         {/* Pagination */}
//         {!loading && paginatedOrders.length > 0 && (
//           <Pagination
//             currentPage={currentPage}
//             totalPages={totalPages}
//             totalItems={filteredOrders.length}
//             itemsPerPage={ORDERS_PER_PAGE}
//             onPageChange={setCurrentPage}
//           />
//         )}

//         {/* Order Detail Modal */}
//         <AnimatePresence>
//           {selectedOrder && (
//             <OrderDetailModal
//               order={selectedOrder}
//               statusConfig={statusConfig}
//               onClose={() => setSelectedOrder(null)}
//             />
//           )}
//         </AnimatePresence>

//         {/* Assign Agent Modal */}
//         <AnimatePresence>
//           {assigningAgent && (
//             <AssignAgentModal
//               order={assigningAgent}
//               agents={deliveryAgents}
//               onAssign={handleAssignAgent}
//               onClose={() => setAssigningAgent(null)}
//             />
//           )}
//         </AnimatePresence>
//       </motion.div>
//     </div>
//   );
// };

// /* -------------------------------------------------------------- */
// /* COMPONENTS                                                      */
// /* -------------------------------------------------------------- */

// /* Hero Header */
// const HeroHeader = ({ pendingOrders, todayRevenue, onExport }) => (
//   <motion.div
//     className="relative overflow-hidden rounded-3xl shadow-2xl mb-8 border border-indigo-200 dark:border-white/10"
//     initial={{ opacity: 0, y: -20 }}
//     animate={{ opacity: 1, y: 0 }}
//   >
//     {/* Gradient Background */}
//     <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600"></div>

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
//         <motion.div
//           initial={{ opacity: 0, x: -20 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ delay: 0.2 }}
//         >
//           <div className="inline-flex items-center gap-3 mb-4 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
//             <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
//               <FaShoppingCart className="text-white" />
//             </div>
//             <span className="text-white/90 font-semibold">
//               Order Management
//             </span>
//           </div>

//           <h1 className="text-3xl md:text-4xl font-black text-white drop-shadow-lg mb-2">
//             Manage Orders 📦
//           </h1>
//           <p className="text-white/80 text-lg">
//             Track, manage, and fulfill customer orders
//           </p>
//         </motion.div>

//         {/* Right - Quick Stats & Actions */}
//         <motion.div
//           className="flex gap-4 flex-wrap"
//           initial={{ opacity: 0, x: 20 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ delay: 0.3 }}
//         >
//           {pendingOrders > 0 && (
//             <div className="px-5 py-4 rounded-2xl bg-white/95 backdrop-blur-xl shadow-xl border border-white/50 animate-pulse">
//               <div className="flex items-center gap-2 mb-1">
//                 <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-sm">
//                   <FaClock />
//                 </div>
//                 <span className="text-xs text-gray-600 font-bold uppercase tracking-wide">
//                   Active
//                 </span>
//               </div>
//               <p className="text-2xl font-black text-gray-800">
//                 {pendingOrders}
//               </p>
//             </div>
//           )}

//           <div className="px-5 py-4 rounded-2xl bg-white/95 backdrop-blur-xl shadow-xl border border-white/50">
//             <div className="flex items-center gap-2 mb-1">
//               <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-sm">
//                 <FaRupeeSign />
//               </div>
//               <span className="text-xs text-gray-600 font-bold uppercase tracking-wide">
//                 Revenue
//               </span>
//             </div>
//             <p className="text-2xl font-black text-gray-800">
//               ₹{currency(todayRevenue)}
//             </p>
//           </div>

//           <motion.button
//             onClick={onExport}
//             className="flex items-center gap-2 px-5 py-4 bg-white/95 backdrop-blur-xl text-indigo-700 font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all"
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             <FaFileExport /> Export
//           </motion.button>
//         </motion.div>
//       </div>
//     </div>
//   </motion.div>
// );

// /* Stats Card */
// const StatsCard = ({ icon, value, label, gradient, delay, pulse }) => (
//   <motion.div
//     className={`relative group ${pulse ? "animate-pulse" : ""}`}
//     initial={{ opacity: 0, y: 20 }}
//     animate={{ opacity: 1, y: 0 }}
//     transition={{ delay }}
//     whileHover={{ y: -3 }}
//   >
//     <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

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
//   search,
//   setSearch,
//   statusFilter,
//   setStatusFilter,
//   statusConfig,
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
//           placeholder="Search by customer, restaurant, or order ID..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
//         />
//       </div>

//       {/* Status Filter Pills */}
//       <div className="flex flex-wrap gap-2 items-center">
//         <FaFilter className="text-gray-400 mr-1" />

//         <StatusPill
//           active={statusFilter === ""}
//           onClick={() => setStatusFilter("")}
//           label="All"
//         />

//         {Object.entries(statusConfig).map(([status, config]) => (
//           <StatusPill
//             key={status}
//             active={statusFilter === status}
//             onClick={() => setStatusFilter(status)}
//             label={status}
//             icon={config.icon}
//             color={config}
//           />
//         ))}

//         <div className="ml-2 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-500/30">
//           <span className="text-sm font-bold text-indigo-700 dark:text-indigo-400">
//             {totalResults} orders
//           </span>
//         </div>
//       </div>
//     </div>
//   </motion.div>
// );

// const StatusPill = ({ active, onClick, label, icon, color }) => (
//   <motion.button
//     onClick={onClick}
//     className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold text-xs border transition-all ${
//       active
//         ? color
//           ? `${color.bg} ${color.text} ${color.border}`
//           : "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/30"
//         : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-slate-700"
//     }`}
//     whileHover={{ scale: 1.05 }}
//     whileTap={{ scale: 0.95 }}
//   >
//     {icon}
//     <span className="hidden sm:inline">{label}</span>
//   </motion.button>
// );

// /* Loading State */
// const LoadingState = () => (
//   <motion.div
//     className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-200 dark:border-white/10 p-12"
//     initial={{ opacity: 0 }}
//     animate={{ opacity: 1 }}
//   >
//     <div className="flex flex-col items-center justify-center">
//       <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
//       <p className="text-gray-600 dark:text-gray-400 font-medium">
//         Loading orders...
//       </p>
//     </div>
//   </motion.div>
// );

// /* Empty State */
// const EmptyState = () => (
//   <motion.div
//     className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-200 dark:border-white/10 p-12 text-center"
//     initial={{ opacity: 0, scale: 0.95 }}
//     animate={{ opacity: 1, scale: 1 }}
//   >
//     <div className="w-24 h-24 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mx-auto mb-6">
//       <FaShoppingCart className="text-5xl text-indigo-500" />
//     </div>
//     <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
//       No Orders Found
//     </h3>
//     <p className="text-gray-500 dark:text-gray-400">
//       Try adjusting your search or filter criteria
//     </p>
//   </motion.div>
// );

// /* Orders Table */
// const OrdersTable = ({
//   orders,
//   statusConfig,
//   onView,
//   onAssign,
//   sortBy,
//   sortOrder,
//   onSort,
// }) => {
//   const SortableHeader = ({ field, children, className }) => (
//     <th
//       className={`px-4 py-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors ${className}`}
//       onClick={() => onSort(field)}
//     >
//       <div className="flex items-center gap-2">
//         {children}
//         {sortBy === field && (
//           <span className="text-indigo-500">
//             {sortOrder === "asc" ? (
//               <FaSortAmountUp className="text-xs" />
//             ) : (
//               <FaSortAmountDown className="text-xs" />
//             )}
//           </span>
//         )}
//       </div>
//     </th>
//   );

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
//               <th className="px-4 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
//                 Order
//               </th>
//               <SortableHeader field="customerId.name">
//                 <span className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
//                   Customer
//                 </span>
//               </SortableHeader>
//               <th className="px-4 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
//                 Restaurant
//               </th>
//               <SortableHeader field="totalAmount">
//                 <span className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
//                   Amount
//                 </span>
//               </SortableHeader>
//               <th className="px-4 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
//                 Status
//               </th>
//               <th className="px-4 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
//                 Delivery Agent
//               </th>
//               <SortableHeader field="createdAt" className="text-right">
//                 <span className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
//                   Date
//                 </span>
//               </SortableHeader>
//               <th className="px-4 py-4 text-right text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             <AnimatePresence>
//               {orders.map((order, index) => (
//                 <OrderRow
//                   key={order._id}
//                   order={order}
//                   statusConfig={statusConfig}
//                   onView={() => onView(order)}
//                   onAssign={() => onAssign(order)}
//                   delay={index * 0.03}
//                 />
//               ))}
//             </AnimatePresence>
//           </tbody>
//         </table>
//       </div>
//     </motion.div>
//   );
// };

// /* Order Row */
// const OrderRow = ({ order, statusConfig, onView, onAssign, delay }) => {
//   const config = statusConfig[order.orderStatus] || statusConfig.Pending;

//   return (
//     <motion.tr
//       className="border-b border-gray-100 dark:border-white/5 hover:bg-indigo-50/50 dark:hover:bg-slate-800/50 transition-colors"
//       initial={{ opacity: 0, x: -20 }}
//       animate={{ opacity: 1, x: 0 }}
//       exit={{ opacity: 0, x: 20 }}
//       transition={{ delay }}
//     >
//       {/* Order ID */}
//       <td className="px-4 py-4">
//         <div className="flex items-center gap-3">
//           <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md">
//             <FaReceipt />
//           </div>
//           <div>
//             <p className="font-bold text-gray-900 dark:text-white text-sm">
//               #{order._id?.slice(-6).toUpperCase()}
//             </p>
//             <p className="text-xs text-gray-500">
//               {formatTime(order.createdAt)}
//             </p>
//           </div>
//         </div>
//       </td>

//       {/* Customer */}
//       <td className="px-4 py-4">
//         <div className="flex items-center gap-2">
//           <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
//             <FaUser className="text-sm" />
//           </div>
//           <span className="font-medium text-gray-900 dark:text-white text-sm">
//             {order.customerId?.name || "Unknown"}
//           </span>
//         </div>
//       </td>

//       {/* Restaurant */}
//       <td className="px-4 py-4">
//         <div className="flex items-center gap-2">
//           <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
//             <FaStore className="text-sm" />
//           </div>
//           <span className="font-medium text-gray-700 dark:text-gray-300 text-sm truncate max-w-[120px]">
//             {order.restaurantId?.name || "Unknown"}
//           </span>
//         </div>
//       </td>

//       {/* Amount */}
//       <td className="px-4 py-4">
//         <span className="font-black text-gray-900 dark:text-white">
//           ₹{currency(order.totalAmount)}
//         </span>
//       </td>

//       {/* Status */}
//       <td className="px-4 py-4">
//         <span
//           className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl ${config.bg} ${config.text} border ${config.border} font-bold text-xs`}
//         >
//           {config.icon}
//           {order.orderStatus}
//         </span>
//       </td>

//       {/* Delivery Agent */}
//       <td className="px-4 py-4">
//         {order.deliveryDetails?.deliveryAgentId?.name ? (
//           <div className="flex items-center gap-2">
//             <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
//               <FaMotorcycle className="text-sm" />
//             </div>
//             <span className="font-medium text-gray-700 dark:text-gray-300 text-sm">
//               {order.deliveryDetails.deliveryAgentId.name}
//             </span>
//           </div>
//         ) : (
//           <motion.button
//             onClick={onAssign}
//             className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 font-semibold text-xs hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-all"
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             <FaUserPlus /> Assign
//           </motion.button>
//         )}
//       </td>

//       {/* Date */}
//       <td className="px-4 py-4 text-right">
//         <span className="text-sm text-gray-600 dark:text-gray-400">
//           {formatDate(order.createdAt)}
//         </span>
//       </td>

//       {/* Actions */}
//       <td className="px-4 py-4 text-right">
//         <motion.button
//           onClick={onView}
//           className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 font-semibold text-sm hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-all ml-auto"
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//         >
//           <FaEye /> View
//         </motion.button>
//       </td>
//     </motion.tr>
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
//       <p className="text-sm text-gray-600 dark:text-gray-400">
//         Showing{" "}
//         <span className="font-bold text-gray-900 dark:text-white">
//           {startItem}-{endItem}
//         </span>{" "}
//         of{" "}
//         <span className="font-bold text-gray-900 dark:text-white">
//           {totalItems}
//         </span>{" "}
//         orders
//       </p>

//       <div className="flex items-center gap-2">
//         <motion.button
//           onClick={() => onPageChange(currentPage - 1)}
//           disabled={currentPage === 1}
//           className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
//             currentPage === 1
//               ? "bg-gray-100 dark:bg-slate-800 text-gray-400 cursor-not-allowed"
//               : "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-900/50"
//           }`}
//           whileHover={currentPage !== 1 ? { scale: 1.05 } : {}}
//           whileTap={currentPage !== 1 ? { scale: 0.95 } : {}}
//         >
//           <FaChevronLeft /> Prev
//         </motion.button>

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
//                     ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg"
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
//               : "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-900/50"
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

// /* Order Detail Modal */
// const OrderDetailModal = ({ order, statusConfig, onClose }) => {
//   const config = statusConfig[order.orderStatus] || statusConfig.Pending;

//   const orderTimeline = [
//     { status: "Order Placed", time: order.createdAt, completed: true },
//     {
//       status: "Confirmed",
//       time: order.confirmedAt,
//       completed: [
//         "Preparing",
//         "Ready",
//         "Out for Delivery",
//         "Delivered",
//       ].includes(order.orderStatus),
//     },
//     {
//       status: "Preparing",
//       time: order.preparingAt,
//       completed: ["Ready", "Out for Delivery", "Delivered"].includes(
//         order.orderStatus
//       ),
//     },
//     {
//       status: "Out for Delivery",
//       time: order.outForDeliveryAt,
//       completed: ["Out for Delivery", "Delivered"].includes(order.orderStatus),
//     },
//     {
//       status: "Delivered",
//       time: order.deliveredAt,
//       completed: order.orderStatus === "Delivered",
//     },
//   ];

//   return (
//     <motion.div
//       className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       onClick={onClose}
//     >
//       <motion.div
//         className="bg-white dark:bg-slate-900 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl border border-gray-200 dark:border-white/10"
//         initial={{ scale: 0.9, y: 20 }}
//         animate={{ scale: 1, y: 0 }}
//         exit={{ scale: 0.9, y: 20 }}
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* Header */}
//         <div className="relative h-32 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
//           <div
//             className="absolute inset-0 opacity-20"
//             style={{
//               backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
//             }}
//           ></div>

//           {/* Close Button */}
//           <motion.button
//             onClick={onClose}
//             className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-all"
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.9 }}
//           >
//             <FaTimes />
//           </motion.button>

//           <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
//             <div>
//               <h2 className="text-2xl font-black text-white">
//                 Order #{order._id?.slice(-6).toUpperCase()}
//               </h2>
//               <p className="text-white/80">
//                 {formatDate(order.createdAt)} at {formatTime(order.createdAt)}
//               </p>
//             </div>
//             <span
//               className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl ${config.bg} ${config.text} border ${config.border} font-bold text-sm shadow-lg`}
//             >
//               {config.icon}
//               {order.orderStatus}
//             </span>
//           </div>
//         </div>

//         {/* Content */}
//         <div className="p-6">
//           {/* Customer & Restaurant */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//             <InfoCard
//               icon={<FaUser />}
//               title="Customer"
//               items={[
//                 { label: "Name", value: order.customerId?.name || "Unknown" },
//                 { label: "Phone", value: order.customerId?.phone || "N/A" },
//                 { label: "Email", value: order.customerId?.email || "N/A" },
//               ]}
//               color="blue"
//             />
//             <InfoCard
//               icon={<FaStore />}
//               title="Restaurant"
//               items={[
//                 { label: "Name", value: order.restaurantId?.name || "Unknown" },
//                 { label: "Phone", value: order.restaurantId?.phone || "N/A" },
//               ]}
//               color="orange"
//             />
//           </div>

//           {/* Delivery Info */}
//           {order.deliveryDetails && (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//               <InfoCard
//                 icon={<FaMapMarkerAlt />}
//                 title="Delivery Address"
//                 items={[
//                   {
//                     label: "Address",
//                     value: order.deliveryDetails?.address || "N/A",
//                   },
//                 ]}
//                 color="purple"
//               />
//               <InfoCard
//                 icon={<FaMotorcycle />}
//                 title="Delivery Agent"
//                 items={[
//                   {
//                     label: "Name",
//                     value:
//                       order.deliveryDetails?.deliveryAgentId?.name ||
//                       "Not Assigned",
//                   },
//                   {
//                     label: "Phone",
//                     value:
//                       order.deliveryDetails?.deliveryAgentId?.phone || "N/A",
//                   },
//                 ]}
//                 color="emerald"
//               />
//             </div>
//           )}

//           {/* Order Items */}
//           <div className="mb-6">
//             <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
//               <FaClipboardList className="text-indigo-500" /> Order Items
//             </h4>
//             <div className="bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
//               {order.items?.map((item, index) => (
//                 <div
//                   key={index}
//                   className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-white/10 last:border-0"
//                 >
//                   <div className="flex items-center gap-3">
//                     <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center text-white">
//                       <FaUtensils />
//                     </div>
//                     <div>
//                       <p className="font-semibold text-gray-900 dark:text-white">
//                         {item.menuItemId?.name || "Item"}
//                       </p>
//                       <p className="text-sm text-gray-500">
//                         Qty: {item.quantity}
//                       </p>
//                     </div>
//                   </div>
//                   <p className="font-bold text-gray-900 dark:text-white">
//                     ₹{currency(item.price * item.quantity)}
//                   </p>
//                 </div>
//               ))}

//               {/* Total */}
//               <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
//                 <span className="font-bold">Total Amount</span>
//                 <span className="text-2xl font-black">
//                   ₹{currency(order.totalAmount)}
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Order Timeline */}
//           <div>
//             <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
//               <FaHistory className="text-indigo-500" /> Order Timeline
//             </h4>
//             <div className="relative">
//               {orderTimeline.map((step, index) => (
//                 <div
//                   key={index}
//                   className="flex items-start gap-4 mb-4 last:mb-0"
//                 >
//                   <div className="relative">
//                     <div
//                       className={`w-10 h-10 rounded-full flex items-center justify-center ${
//                         step.completed
//                           ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white"
//                           : "bg-gray-200 dark:bg-slate-700 text-gray-400"
//                       }`}
//                     >
//                       {step.completed ? <FaCheckCircle /> : <FaClock />}
//                     </div>
//                     {index < orderTimeline.length - 1 && (
//                       <div
//                         className={`absolute top-10 left-1/2 -translate-x-1/2 w-0.5 h-8 ${
//                           step.completed
//                             ? "bg-emerald-500"
//                             : "bg-gray-200 dark:bg-slate-700"
//                         }`}
//                       ></div>
//                     )}
//                   </div>
//                   <div className="flex-1 pt-2">
//                     <p
//                       className={`font-semibold ${
//                         step.completed
//                           ? "text-gray-900 dark:text-white"
//                           : "text-gray-400"
//                       }`}
//                     >
//                       {step.status}
//                     </p>
//                     {step.time && step.completed && (
//                       <p className="text-sm text-gray-500">
//                         {formatDate(step.time)} at {formatTime(step.time)}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// };

// const InfoCard = ({ icon, title, items, color }) => {
//   const colors = {
//     blue: "from-blue-500 to-cyan-600",
//     orange: "from-orange-500 to-rose-600",
//     purple: "from-purple-500 to-indigo-600",
//     emerald: "from-emerald-500 to-teal-600",
//   };

//   return (
//     <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-white/10">
//       <div className="flex items-center gap-3 mb-3">
//         <div
//           className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors[color]} flex items-center justify-center text-white shadow-md`}
//         >
//           {icon}
//         </div>
//         <h5 className="font-bold text-gray-900 dark:text-white">{title}</h5>
//       </div>
//       <div className="space-y-2">
//         {items.map((item, index) => (
//           <div key={index} className="flex justify-between">
//             <span className="text-sm text-gray-500">{item.label}</span>
//             <span className="text-sm font-medium text-gray-900 dark:text-white">
//               {item.value}
//             </span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// /* Assign Agent Modal */
// const AssignAgentModal = ({ order, agents, onAssign, onClose }) => (
//   <motion.div
//     className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
//     initial={{ opacity: 0 }}
//     animate={{ opacity: 1 }}
//     exit={{ opacity: 0 }}
//     onClick={onClose}
//   >
//     <motion.div
//       className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-gray-200 dark:border-white/10 overflow-hidden"
//       initial={{ scale: 0.9, y: 20 }}
//       animate={{ scale: 1, y: 0 }}
//       exit={{ scale: 0.9, y: 20 }}
//       onClick={(e) => e.stopPropagation()}
//     >
//       {/* Header */}
//       <div className="p-6 bg-gradient-to-r from-amber-500 to-orange-600">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white">
//               <FaMotorcycle className="text-xl" />
//             </div>
//             <div>
//               <h3 className="text-xl font-bold text-white">Assign Agent</h3>
//               <p className="text-white/80 text-sm">
//                 Order #{order._id?.slice(-6).toUpperCase()}
//               </p>
//             </div>
//           </div>
//           <motion.button
//             onClick={onClose}
//             className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30"
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.9 }}
//           >
//             <FaTimes />
//           </motion.button>
//         </div>
//       </div>

//       {/* Agent List */}
//       <div className="p-6">
//         <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
//           Select a delivery agent for this order
//         </p>

//         <div className="space-y-3">
//           {agents.map((agent) => (
//             <motion.div
//               key={agent.id}
//               className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-white/10 hover:border-orange-300 dark:hover:border-orange-500/50 cursor-pointer transition-all"
//               whileHover={{ scale: 1.02 }}
//               onClick={() => onAssign(order._id, agent.id)}
//             >
//               <div className="flex items-center gap-3">
//                 <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-rose-600 flex items-center justify-center text-white font-bold">
//                   {agent.name.charAt(0)}
//                 </div>
//                 <div>
//                   <p className="font-semibold text-gray-900 dark:text-white">
//                     {agent.name}
//                   </p>
//                   <p className="text-sm text-gray-500">{agent.phone}</p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-1 px-3 py-1 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-500/30">
//                 <FaStar className="text-amber-500 text-sm" />
//                 <span className="font-bold text-amber-700 dark:text-amber-400">
//                   {agent.rating}
//                 </span>
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </motion.div>
//   </motion.div>
// );

// export default AdminOrders;
