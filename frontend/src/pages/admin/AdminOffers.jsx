// src/pages/Admin/AdminOffers.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaGift,
  FaPlus,
  FaEdit,
  FaTrash,
  FaPause,
  FaPlay,
  FaClock,
  FaChartLine,
  FaTag,
  FaCheckCircle,
} from "react-icons/fa";
import API from "../../api/axios";
import toast from "react-hot-toast";

const AdminOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // ✅ Fetch offers (from working API)
  const fetchOffers = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/offers");
      setOffers(res.data.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load offers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  // ✅ Toggle offer status
  const handleToggle = async (id) => {
    try {
      await API.patch(`/admin/offers/toggle/${id}`);
      toast.success("Offer status updated");
      fetchOffers();
    } catch (err) {
      toast.error("Failed to update offer status");
    }
  };

  // ✅ Delete offer
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this offer?")) return;
    try {
      await API.delete(`/admin/offers/${id}`);
      toast.success("Offer deleted");
      fetchOffers();
    } catch (err) {
      toast.error("Failed to delete offer");
    }
  };

  // 🧮 Filtering
  const filtered = offers.filter((o) => {
    const matchSearch =
      o.title?.toLowerCase().includes(search.toLowerCase()) ||
      (o.promoCode || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter
      ? (o.isActive ? "active" : "inactive") === statusFilter
      : true;
    return matchSearch && matchStatus;
  });

  // 🟢 Status colors
  const statusColors = {
    active: "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-300",
    expired: "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-300",
    inactive:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-300",
  };

  return (
    <motion.div
      className="min-h-screen w-full bg-gray-50 dark:bg-gray-950 px-6 py-8 text-gray-800 dark:text-white"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <FaGift className="text-orange-500" /> Manage Offers
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            View, toggle, and manage all promotional offers.
          </p>
        </div>
        <button className="bg-primary text-white px-4 py-2 rounded hover:bg-orange-600 flex items-center gap-2">
          <FaPlus /> New Offer
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white dark:bg-secondary p-5 rounded-xl shadow text-center">
          <FaCheckCircle className="text-green-500 text-2xl mx-auto mb-2" />
          <p className="text-lg font-semibold">
            {offers.filter((o) => o.isActive).length}
          </p>
          <p className="text-sm text-gray-500">Active Offers</p>
        </div>
        <div className="bg-white dark:bg-secondary p-5 rounded-xl shadow text-center">
          <FaClock className="text-red-500 text-2xl mx-auto mb-2" />
          <p className="text-lg font-semibold">
            {offers.filter((o) => new Date(o.validTill) < new Date()).length}
          </p>
          <p className="text-sm text-gray-500">Expired Offers</p>
        </div>
        <div className="bg-white dark:bg-secondary p-5 rounded-xl shadow text-center">
          <FaChartLine className="text-blue-500 text-2xl mx-auto mb-2" />
          <p className="text-lg font-semibold">{offers.length}</p>
          <p className="text-sm text-gray-500">Total Offers</p>
        </div>
        <div className="bg-white dark:bg-secondary p-5 rounded-xl shadow text-center">
          <FaTag className="text-orange-500 text-2xl mx-auto mb-2" />
          <p className="text-lg font-semibold">
            {offers.filter((o) => !o.isActive).length}
          </p>
          <p className="text-sm text-gray-500">Inactive</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap justify-between gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by title or code"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 w-full sm:w-80 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-secondary text-sm"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-secondary text-sm"
        >
          <option value="">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white dark:bg-secondary rounded-xl shadow">
        <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800 text-sm">
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Restaurant</th>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Discount</th>
              <th className="px-4 py-3">Validity</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="8"
                  className="text-center py-6 text-gray-500 dark:text-gray-400"
                >
                  Loading offers...
                </td>
              </tr>
            ) : filtered.length > 0 ? (
              filtered.map((offer) => {
                const isExpired = new Date(offer.validTill) < new Date();
                const status = isExpired
                  ? "expired"
                  : offer.isActive
                  ? "active"
                  : "inactive";

                return (
                  <tr
                    key={offer._id}
                    className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    <td className="px-4 py-3 font-medium">{offer.title}</td>
                    <td className="px-4 py-3 text-sm italic text-gray-600 dark:text-gray-400">
                      {offer.restaurantId?.name || "—"}
                    </td>
                    <td className="px-4 py-3 text-sm font-mono">
                      {offer.promoCode || "—"}
                    </td>
                    <td className="px-4 py-3">{offer.discountType}</td>
                    <td className="px-4 py-3">
                      {offer.discountType === "FLAT"
                        ? `₹${offer.discountValue}`
                        : `${offer.discountValue}%`}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                      {new Date(offer.validFrom).toLocaleDateString()} →{" "}
                      {new Date(offer.validTill).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusColors[status]}`}
                      >
                        {status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right flex justify-end gap-2">
                      <button
                        onClick={() => handleToggle(offer._id)}
                        className={`px-3 py-1 text-xs rounded flex items-center gap-1 ${
                          offer.isActive
                            ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                            : "bg-green-100 text-green-700 hover:bg-green-200"
                        }`}
                      >
                        {offer.isActive ? <FaPause /> : <FaPlay />}
                        {offer.isActive ? "Pause" : "Activate"}
                      </button>

                      <button className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded flex items-center gap-1 hover:bg-blue-200">
                        <FaEdit /> Edit
                      </button>

                      <button
                        onClick={() => handleDelete(offer._id)}
                        className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded flex items-center gap-1 hover:bg-red-200"
                      >
                        <FaTrash /> Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="8"
                  className="px-4 py-6 text-center text-gray-500 dark:text-gray-400"
                >
                  No offers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default AdminOffers;

// new but not tested
// import React, { useEffect, useState  } from "react";
// import { motion } from "framer-motion";
// import {
//   FaGift,
//   FaPlus,
//   FaEdit,
//   FaTrash,
//   FaPause,
//   FaPlay,
//   FaClock,
//   FaChartLine,
//   FaTag,
//   FaCheckCircle,
// } from "react-icons/fa";
// import API from "../../api/axios";
// import toast from "react-hot-toast";

// const AdminOffers = () => {
//   const [offers, setOffers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");

//   // ✅ Fetch offers (from working API)
//   const fetchOffers = async () => {
//     try {
//       setLoading(true);
//       const res = await API.get("/admin/offers");
//       setOffers(res.data.data || []);
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to load offers");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOffers();
//   }, []);

//   // ✅ Toggle offer status
//   const handleToggle = async (id) => {
//     try {
//       await API.patch(`/admin/offers/toggle/${id}`);
//       toast.success("Offer status updated");
//       fetchOffers();
//     } catch (err) {
//       toast.error("Failed to update offer status");
//     }
//   };

//   // ✅ Delete offer
//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this offer?")) return;
//     try {
//       await API.delete(`/admin/offers/${id}`);
//       toast.success("Offer deleted");
//       fetchOffers();
//     } catch (err) {
//       toast.error("Failed to delete offer");
//     }
//   };

//   // 🧮 Filtering
//   const filtered = offers.filter((o) => {
//     const matchSearch =
//       o.title?.toLowerCase().includes(search.toLowerCase()) ||
//       (o.promoCode || "").toLowerCase().includes(search.toLowerCase());
//     const matchStatus = statusFilter
//       ? (o.isActive ? "active" : "inactive") === statusFilter
//       : true;
//     return matchSearch && matchStatus;
//   });

//   // 🟢 Status colors
//   const statusColors = {
//     active: "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-300",
//     expired: "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-300",
//     inactive:
//       "bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-300",
//   };

//   return (
//     <motion.div
//       className="min-h-screen w-full bg-gray-50 dark:bg-gray-950 px-6 py-8 text-gray-800 dark:text-white"
//       initial={{ opacity: 0, y: 30 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.4 }}
//     >
//       {/* HEADER */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
//         <div>
//           <h2 className="text-3xl font-bold flex items-center gap-2">
//             <FaGift className="text-orange-500" /> Manage Offers
//           </h2>
//           <p className="text-gray-600 dark:text-gray-400 text-sm">
//             View, toggle, and manage all promotional offers.
//           </p>
//         </div>
//         <button className="bg-primary text-white px-4 py-2 rounded hover:bg-orange-600 flex items-center gap-2">
//           <FaPlus /> New Offer
//         </button>
//       </div>

//       {/* Summary cards */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
//         <div className="bg-white dark:bg-secondary p-5 rounded-xl shadow text-center">
//           <FaCheckCircle className="text-green-500 text-2xl mx-auto mb-2" />
//           <p className="text-lg font-semibold">
//             {offers.filter((o) => o.isActive).length}
//           </p>
//           <p className="text-sm text-gray-500">Active Offers</p>
//         </div>
//         <div className="bg-white dark:bg-secondary p-5 rounded-xl shadow text-center">
//           <FaClock className="text-red-500 text-2xl mx-auto mb-2" />
//           <p className="text-lg font-semibold">
//             {offers.filter((o) => new Date(o.validTill) < new Date()).length}
//           </p>
//           <p className="text-sm text-gray-500">Expired Offers</p>
//         </div>
//         <div className="bg-white dark:bg-secondary p-5 rounded-xl shadow text-center">
//           <FaChartLine className="text-blue-500 text-2xl mx-auto mb-2" />
//           <p className="text-lg font-semibold">{offers.length}</p>
//           <p className="text-sm text-gray-500">Total Offers</p>
//         </div>
//         <div className="bg-white dark:bg-secondary p-5 rounded-xl shadow text-center">
//           <FaTag className="text-orange-500 text-2xl mx-auto mb-2" />
//           <p className="text-lg font-semibold">
//             {offers.filter((o) => !o.isActive).length}
//           </p>
//           <p className="text-sm text-gray-500">Inactive</p>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="flex flex-wrap justify-between gap-4 mb-6">
//         <input
//           type="text"
//           placeholder="Search by title or code"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="px-3 py-2 w-full sm:w-80 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-secondary text-sm"
//         />
//         <select
//           value={statusFilter}
//           onChange={(e) => setStatusFilter(e.target.value)}
//           className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-secondary text-sm"
//         >
//           <option value="">All</option>
//           <option value="active">Active</option>
//           <option value="inactive">Inactive</option>
//         </select>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto bg-white dark:bg-secondary rounded-xl shadow">
//         <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
//           <thead>
//             <tr className="bg-gray-100 dark:bg-gray-800 text-sm">
//               <th className="px-4 py-3">Title</th>
//               <th className="px-4 py-3">Restaurant</th>
//               <th className="px-4 py-3">Code</th>
//               <th className="px-4 py-3">Type</th>
//               <th className="px-4 py-3">Discount</th>
//               <th className="px-4 py-3">Validity</th>
//               <th className="px-4 py-3">Status</th>
//               <th className="px-4 py-3 text-right">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {loading ? (
//               <tr>
//                 <td
//                   colSpan="8"
//                   className="text-center py-6 text-gray-500 dark:text-gray-400"
//                 >
//                   Loading offers...
//                 </td>
//               </tr>
//             ) : filtered.length > 0 ? (
//               filtered.map((offer) => {
//                 const isExpired = new Date(offer.validTill) < new Date();
//                 const status = isExpired
//                   ? "expired"
//                   : offer.isActive
//                   ? "active"
//                   : "inactive";

//                 return (
//                   <tr
//                     key={offer._id}
//                     className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
//                   >
//                     <td className="px-4 py-3 font-medium">{offer.title}</td>
//                     <td className="px-4 py-3 text-sm italic text-gray-600 dark:text-gray-400">
//                       {offer.restaurantId?.name || "—"}
//                     </td>
//                     <td className="px-4 py-3 text-sm font-mono">
//                       {offer.promoCode || "—"}
//                     </td>
//                     <td className="px-4 py-3">{offer.discountType}</td>
//                     <td className="px-4 py-3">
//                       {offer.discountType === "FLAT"
//                         ? `₹${offer.discountValue}`
//                         : `${offer.discountValue}%`}
//                     </td>
//                     <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
//                       {new Date(offer.validFrom).toLocaleDateString()} →{" "}
//                       {new Date(offer.validTill).toLocaleDateString()}
//                     </td>
//                     <td className="px-4 py-3">
//                       <span
//                         className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusColors[status]}`}
//                       >
//                         {status}
//                       </span>
//                     </td>
//                     <td className="px-4 py-3 text-right flex justify-end gap-2">
//                       <button
//                         onClick={() => handleToggle(offer._id)}
//                         className={`px-3 py-1 text-xs rounded flex items-center gap-1 ${
//                           offer.isActive
//                             ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
//                             : "bg-green-100 text-green-700 hover:bg-green-200"
//                         }`}
//                       >
//                         {offer.isActive ? <FaPause /> : <FaPlay />}
//                         {offer.isActive ? "Pause" : "Activate"}
//                       </button>

//                       <button className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded flex items-center gap-1 hover:bg-blue-200">
//                         <FaEdit /> Edit
//                       </button>

//                       <button
//                         onClick={() => handleDelete(offer._id)}
//                         className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded flex items-center gap-1 hover:bg-red-200"
//                       >
//                         <FaTrash /> Delete
//                       </button>
//                     </td>
//                   </tr>
//                 );
//               })
//             ) : (
//               <tr>
//                 <td
//                   colSpan="8"
//                   className="px-4 py-6 text-center text-gray-500 dark:text-gray-400"
//                 >
//                   No offers found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </motion.div>
//   );
// };

// export default AdminOffers;
