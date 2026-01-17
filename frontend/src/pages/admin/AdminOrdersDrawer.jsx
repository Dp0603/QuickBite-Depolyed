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
  new Date(date).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

const currency = (n) =>
  typeof n === "number"
    ? n.toLocaleString("en-IN", { maximumFractionDigits: 0 })
    : n;

const drawerVariants = {
  hidden: { x: "100%" },
  visible: { x: 0 },
};

/* ---------------- component ---------------- */

const AdminOrdersDrawer = ({ open, order, onClose }) => {
  if (!order) return null;

  const timeline = [
    { label: "Order Placed", time: order.createdAt, done: true },
    {
      label: "Preparing",
      done: ["Preparing", "Ready", "Out for Delivery", "Delivered"].includes(
        order.orderStatus
      ),
    },
    {
      label: "Out for Delivery",
      done: ["Out for Delivery", "Delivered"].includes(order.orderStatus),
    },
    { label: "Delivered", done: order.orderStatus === "Delivered" },
  ];

  return (
    <AnimatePresence>
      {open && (
        <>
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
            className="fixed right-0 top-0 h-full w-full sm:w-[480px] bg-white z-[70] flex flex-col"
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ type: "tween", duration: 0.25 }}
          >
            {/* accent */}
            <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600" />

            {/* header */}
            <div className="p-6 border-b">
              <div className="flex justify-between items-start">
                <div>
                  <span className="inline-block px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold mb-2">
                    Order #{order._id.slice(-6).toUpperCase()}
                  </span>
                  <h2 className="text-2xl font-black">Order Details</h2>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center"
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            {/* body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* timeline */}
              <div>
                <div className="relative flex justify-between">
                  <div className="absolute top-4 left-0 right-0 h-0.5 bg-slate-200" />
                  {timeline.map((t, i) => (
                    <div key={i} className="relative z-10 text-center">
                      <div
                        className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center border-2 ${
                          t.done
                            ? "bg-emerald-500 border-emerald-500 text-white"
                            : "bg-white border-slate-300 text-slate-300"
                        }`}
                      >
                        {t.done ? <FaCheckCircle /> : <FaClock />}
                      </div>
                      <p className="mt-2 text-xs font-bold">{t.label}</p>
                      {i === 0 && (
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
                  <p className="font-semibold">{order.customerId?.name}</p>
                  <p
                    className="text-sm text-slate-500 truncate"
                    title={order.customerId?.email}
                  >
                    {order.customerId?.email}
                  </p>
                </div>

                <div className="p-4 rounded-xl border bg-slate-50">
                  <div className="flex items-center gap-2 mb-2 font-bold text-orange-600">
                    <FaStore /> Restaurant
                  </div>
                  <p className="font-semibold">{order.restaurantId?.name}</p>
                  <p className="text-sm text-slate-500">
                    {order.restaurantId?.phoneNumber}
                  </p>
                </div>
              </div>

              {/* address */}
              <div className="p-4 rounded-xl border bg-slate-50">
                <div className="flex items-center gap-2 mb-2 font-bold text-purple-600">
                  <FaMapMarkerAlt /> Delivery Address
                </div>
                <p className="text-sm text-slate-600">
                  {order.deliveryAddress?.addressLine}
                </p>
              </div>

              {/* items */}
              <div>
                <h4 className="text-xs font-bold uppercase mb-2">
                  Order Items
                </h4>
                <div className="border rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <tbody>
                      {order.items.map((item, i) => (
                        <tr key={i} className="border-b">
                          <td className="px-4 py-3">{item.menuItemId?.name}</td>
                          <td className="px-4 py-3 text-center">
                            x{item.quantity}
                          </td>
                          <td className="px-4 py-3 text-right">
                            ₹{currency(item.price)}
                          </td>
                        </tr>
                      ))}
                      <tr className="font-bold bg-slate-50">
                        <td colSpan="2" className="px-4 py-3 text-right">
                          Total
                        </td>
                        <td className="px-4 py-3 text-right">
                          ₹{currency(order.totalAmount)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* payment */}
              <div className="p-4 rounded-xl border bg-slate-50">
                <div className="flex items-center gap-2 mb-2 font-bold text-blue-600">
                  <FaCreditCard /> Payment
                </div>
                <div className="flex justify-between text-sm">
                  <span>Method</span>
                  <span className="font-semibold">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span>Status</span>
                  <span className="font-semibold text-emerald-600">
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AdminOrdersDrawer;
