import {
  FaCheckCircle,
  FaTimesCircle,
  FaTruck,
  FaUtensils,
  FaBox,
} from "react-icons/fa";

export const getStatusColor = (status) => {
  switch (status) {
    case "Pending":
      return "bg-slate-200 text-slate-800 border border-slate-300";
    case "Preparing":
      return "bg-yellow-100 text-yellow-800 border border-yellow-300";
    case "Ready":
      return "bg-orange-100 text-orange-800 border border-orange-300";
    case "Out for Delivery":
      return "bg-sky-100 text-sky-800 border border-sky-300";
    case "Delivered":
      return "bg-green-100 text-green-800 border border-green-300";
    case "Cancelled":
      return "bg-rose-100 text-rose-800 border border-rose-300";
    default:
      return "bg-gray-100 text-gray-700 border border-gray-300";
  }
};

export const statusActions = {
  Pending: [
    {
      next: "Preparing",
      label: "Accept",
      icon: FaCheckCircle,
      color: "bg-green-600 hover:bg-green-700",
    },
    {
      next: "Cancelled",
      label: "Reject",
      icon: FaTimesCircle,
      color: "bg-rose-600 hover:bg-rose-700",
    },
  ],
  Preparing: [
    {
      next: "Ready",
      label: "Mark Ready",
      icon: FaUtensils,
      color: "bg-yellow-500 hover:bg-yellow-600",
    },
  ],
  Ready: [
    {
      next: "Out for Delivery",
      label: "Out for Delivery",
      icon: FaTruck,
      color: "bg-blue-600 hover:bg-blue-700",
    },
  ],
  "Out for Delivery": [
    {
      next: "Delivered",
      label: "Mark Delivered",
      icon: FaBox,
      color: "bg-green-700 hover:bg-green-800",
    },
  ],
};
