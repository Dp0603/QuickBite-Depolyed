import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTimes,
  FaCheckCircle,
  FaClock,
  FaUser,
  FaStore,
  FaMapMarkerAlt,
  FaCreditCard,
} from "react-icons/fa";

/* ---------------- helpers ---------------- */

const formatTime = (date) =>
  date
    ? new Date(date).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "--";

const currency = (n) =>
  typeof n === "number"
    ? n.toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      })
    : "₹0";

const drawerVariants = {
  hidden: { x: "100%" },
  visible: { x: 0 },
};

const STATUS_INDEX_MAP = {
  Pending: 0,
  Preparing: 1,
  Ready: 2,
  "Out for Delivery": 3,
  Delivered: 4,
};
/* ---------------- component ---------------- */

const AdminOrdersDrawer = ({
  open,
  mode,
  order,
  agents = [],
  onAssign,
  onClose,
}) => {
  const closeBtnRef = useRef(null);
  const [showBreakdown, setShowBreakdown] = useState(false);

  /* -------- ESC key close -------- */
  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);
  useEffect(() => {
    setShowBreakdown(false);
  }, [order?._id]);

  /* -------- focus on open -------- */
  useEffect(() => {
    if (open) closeBtnRef.current?.focus();
  }, [open]);

  if (!open || !order) return null;

  const isCancelled = order.orderStatus === "Cancelled";

  const currentIndex = isCancelled
    ? -1
    : (STATUS_INDEX_MAP[order.orderStatus] ?? 0);

  const timeline = [
    {
      label: "Order Placed",
      done: !isCancelled && currentIndex >= 0,
      current: currentIndex === 0,
      time: order.createdAt,
    },
    {
      label: "Preparing",
      done: !isCancelled && currentIndex >= 1,
      current: currentIndex === 1,
    },
    {
      label: "Ready",
      done: !isCancelled && currentIndex >= 2,
      current: currentIndex === 2,
    },
    {
      label: "Out for Delivery",
      done: !isCancelled && currentIndex >= 3,
      current: currentIndex === 3,
    },
    {
      label: "Delivered",
      done: !isCancelled && currentIndex >= 4,
      current: currentIndex === 4,
    },
  ];

  const paymentStatusColor =
    order.paymentStatus === "Paid"
      ? "text-emerald-600"
      : order.paymentStatus === "Failed"
        ? "text-red-600"
        : "text-yellow-600";

  return (
    <AnimatePresence>
      {/* backdrop */}
      <motion.div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* drawer */}
      <motion.div
        role="dialog"
        aria-modal="true"
        className="fixed right-0 top-0 h-full w-full sm:w-[480px] lg:w-[520px] bg-white z-[70] flex flex-col outline-none"
        variants={drawerVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        transition={{ type: "tween", duration: 0.25 }}
      >
        {/* accent */}
        <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600" />

        {/* header */}
        <div className="p-6 border-b flex justify-between items-start">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold mb-2">
              Order #{order._id?.slice(-6)?.toUpperCase()}
            </span>
            <h2 className="text-2xl font-black">
              {mode === "assign" ? "Assign Agent" : "Order Details"}
            </h2>
          </div>
          <button
            ref={closeBtnRef}
            onClick={onClose}
            aria-label="Close order drawer"
            className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center focus:ring-2 ring-indigo-500"
          >
            <FaTimes />
          </button>
        </div>

        {/* body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {mode === "view" && (
            <>
              {/* EXISTING ORDER DETAILS UI — leave everything as-is */}

              {isCancelled && (
                <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-semibold text-center">
                  Order Cancelled
                </div>
              )}

              {/* timeline */}
              <div>
                <div className="relative flex justify-between">
                  <div
                    className={`absolute top-4 left-0 right-0 h-0.5 ${
                      isCancelled ? "bg-slate-300" : "bg-slate-200"
                    }`}
                  />
                  {timeline.map((t, i) => (
                    <div key={t.label} className="relative z-10 text-center">
                      <div
                        className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center border-2 ${
                          isCancelled
                            ? "bg-slate-100 border-slate-300 text-slate-300"
                            : t.done
                              ? "bg-emerald-500 border-emerald-500 text-white"
                              : t.current
                                ? "bg-white border-indigo-500 text-indigo-500"
                                : "bg-white border-slate-300 text-slate-300"
                        }`}
                      >
                        {t.done ? (
                          <FaCheckCircle />
                        ) : t.current ? (
                          <FaClock />
                        ) : null}
                      </div>
                      <p
                        className="mt-2 text-xs font-bold"
                        title={
                          t.label === "Ready"
                            ? "Order prepared and waiting for pickup"
                            : undefined
                        }
                      >
                        {t.label}
                      </p>
                      {t.time && (
                        <p className="text-[10px] text-slate-500">
                          {formatTime(t.time)}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* customer & restaurant */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border bg-slate-50">
                  <div className="flex items-center gap-2 mb-2 font-bold text-indigo-600">
                    <FaUser /> Customer
                  </div>
                  <p className="font-semibold">
                    {order.customerId?.name || "--"}
                  </p>
                  <p
                    className="text-sm text-slate-600 break-all"
                    title={order.customerId?.email}
                  >
                    {order.customerId?.email || "--"}
                  </p>
                </div>

                <div className="p-4 rounded-xl border bg-slate-50">
                  <div className="flex items-center gap-2 mb-2 font-bold text-orange-600">
                    <FaStore /> Restaurant
                  </div>
                  <p className="font-semibold">
                    {order.restaurantId?.name || "--"}
                  </p>
                  <p className="text-sm text-slate-500">
                    {order.restaurantId?.phoneNumber || "--"}
                  </p>
                </div>
              </div>

              {/* address */}
              <div className="p-4 rounded-xl border bg-slate-50">
                <div className="flex items-center gap-2 mb-2 font-bold text-purple-600">
                  <FaMapMarkerAlt /> Delivery Address
                </div>
                <p className="text-sm text-slate-600">
                  {order.deliveryAddress?.addressLine || "--"}
                </p>
              </div>

              {/* items */}
              <div>
                <h4 className="text-xs font-bold uppercase mb-2">
                  Order Items
                </h4>
                <div className="border rounded-xl overflow-hidden">
                  {order.items?.length ? (
                    <table className="w-full text-sm">
                      <tbody>
                        {order.items.map((item) => (
                          <tr key={item.menuItemId?._id} className="border-b">
                            <td className="px-4 py-3">
                              {item.name || item.menuItemId?.name || "--"}
                            </td>
                            <td className="px-4 py-3 text-center">
                              x{item.quantity}
                            </td>
                            <td className="px-4 py-3 text-right">
                              {currency(item.price)}
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-slate-50">
                          <td
                            colSpan="2"
                            className="px-4 py-2 text-right text-sm font-medium"
                          >
                            Subtotal
                          </td>
                          <td className="px-4 py-2 text-right text-sm">
                            {currency(order.subtotal)}
                          </td>
                        </tr>

                        {showBreakdown && (
                          <>
                            <tr className="bg-slate-50">
                              <td
                                colSpan="2"
                                className="px-4 py-2 text-right text-sm font-medium"
                              >
                                Tax
                              </td>
                              <td className="px-4 py-2 text-right text-sm">
                                {currency(order.tax)}
                              </td>
                            </tr>

                            <tr className="bg-slate-50">
                              <td
                                colSpan="2"
                                className="px-4 py-2 text-right text-sm font-medium"
                              >
                                Delivery Fee
                              </td>
                              <td className="px-4 py-2 text-right text-sm">
                                {currency(order.deliveryFee)}
                              </td>
                            </tr>

                            {order.discount > 0 && (
                              <tr className="bg-slate-50 text-slate-600 italic">
                                <td
                                  colSpan="2"
                                  className="px-4 py-2 text-right text-sm font-medium"
                                >
                                  Discount
                                </td>
                                <td className="px-4 py-2 text-right text-sm">
                                  − {currency(order.discount)}
                                </td>
                              </tr>
                            )}
                          </>
                        )}

                        <tr
                          role="button"
                          tabIndex={0}
                          className="cursor-pointer text-indigo-600 hover:bg-indigo-50 focus:outline-none focus:bg-indigo-50"
                          onClick={() => setShowBreakdown((v) => !v)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              setShowBreakdown((v) => !v);
                            }
                          }}
                        >
                          <td
                            colSpan="3"
                            className="px-4 py-2 text-center text-xs font-semibold"
                          >
                            {showBreakdown
                              ? "Hide price breakdown ▲"
                              : "Show price breakdown ▼"}
                          </td>
                        </tr>

                        <tr className="font-bold bg-slate-100 border-t">
                          <td colSpan="2" className="px-4 py-3 text-right">
                            Total
                          </td>
                          <td className="px-4 py-3 text-right">
                            {currency(order.totalAmount)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  ) : (
                    <p className="p-4 text-sm text-slate-500">No items found</p>
                  )}
                </div>
              </div>

              {/* payment */}
              <div className="p-4 rounded-xl border bg-slate-50">
                <div className="flex items-center gap-2 mb-2 font-bold text-blue-600">
                  <FaCreditCard /> Payment
                </div>
                <div className="flex justify-between text-sm">
                  <span>Method</span>
                  <span className="font-semibold">
                    {order.paymentMethod || "--"}
                  </span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span>Status</span>
                  <span className={`font-semibold ${paymentStatusColor}`}>
                    {order.paymentStatus || "--"}
                  </span>
                </div>
              </div>
            </>
          )}
          {mode === "assign" && (
            <div className="space-y-4">
              <h3 className="text-lg font-black">Assign Delivery Agent</h3>
              {order.deliveryDetails?.deliveryAgentId && (
                <div className="p-3 rounded-lg bg-emerald-50 text-emerald-700 text-sm font-bold">
                  Assigned to: {order.deliveryDetails.deliveryAgentId.name}
                </div>
              )}

              {agents.length === 0 ? (
                <p className="text-sm text-slate-500">
                  No delivery agents available
                </p>
              ) : (
                agents.map((agent) => (
                  <div
                    key={agent.id}
                    className="flex items-center justify-between p-4 rounded-xl border bg-slate-50"
                  >
                    <div>
                      <p className="font-bold">{agent.name}</p>
                      <p className="text-xs text-slate-500">{agent.phone}</p>
                    </div>

                    <button
                      onClick={() => onAssign(order._id, agent.id)}
                      disabled={!!order.deliveryDetails?.deliveryAgentId}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition
    ${
      order.deliveryDetails?.deliveryAgentId
        ? "bg-slate-300 text-slate-500 cursor-not-allowed"
        : "bg-indigo-600 text-white hover:bg-indigo-700"
    }`}
                    >
                      Assign
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AdminOrdersDrawer;
