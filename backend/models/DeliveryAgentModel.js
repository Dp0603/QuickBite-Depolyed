const mongoose = require("mongoose");

const deliveryOrderSchema = new mongoose.Schema(
  {
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    restaurant_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    deliveryAgent_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // delivery agent is a user with role "deliveryAgent"
      default: null,
    },
    items: [
      {
        name: String,
        quantity: Number,
        price: Number,
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "Pending",
        "Preparing",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
      ],
      default: "Pending",
    },
    deliveryTime: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("DeliveryOrder", deliveryOrderSchema);
