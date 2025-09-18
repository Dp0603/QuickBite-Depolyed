const Order = require("../models/OrderModel");
const Cart = require("../models/CartModel");
const PremiumSubscription = require("../models/PremiumSubscriptionModel");
const Offer = require("../models/OfferModel");

// 🧾 Create a new order
const createOrder = async (req, res) => {
  try {
    const {
      customerId,
      restaurantId,
      items,
      subtotal,
      tax,
      deliveryFee,
      discount = 0,
      offerId = null,
      paymentMethod,
    } = req.body;

    let premiumApplied = false;
    let savings = 0;
    let finalDeliveryFee = deliveryFee;
    let finalDiscount = discount;
    let premiumBreakdown = {
      freeDelivery: 0,
      extraDiscount: 0,
      cashback: 0,
    };

    // 🔍 Check active Premium subscription
    const subscription = await PremiumSubscription.findOne({
      subscriberId: customerId,
      subscriberType: "User",
      isActive: true,
      endDate: { $gte: new Date() },
    });

    // 🔹 Apply Premium benefits
    if (subscription) {
      premiumApplied = true;

      // Free Delivery
      const originalDeliveryFee = deliveryFee || 40;
      const deliverySavings = subscription.perks.freeDelivery
        ? originalDeliveryFee
        : 0;
      finalDeliveryFee = subscription.perks.freeDelivery
        ? 0
        : originalDeliveryFee;

      // Extra Discount
      const extraDiscountRate = subscription.perks.extraDiscount || 0;
      const discountSavings = Math.floor((subtotal * extraDiscountRate) / 100);
      finalDiscount += discountSavings;

      // Cashback
      const cashback = subscription.perks.cashback || 0;

      premiumBreakdown = {
        freeDelivery: deliverySavings,
        extraDiscount: discountSavings,
        cashback,
      };

      savings = deliverySavings + discountSavings + cashback;

      // ✅ Update totalSavings
      subscription.totalSavings = (subscription.totalSavings || 0) + savings;
      await subscription.save();
    }

    // 🔹 Apply Offer if exists
    if (offerId) {
      const offer = await Offer.findById(offerId);
      if (offer && offer.isActive) {
        if (subtotal >= offer.minOrderAmount) {
          let offerDiscount = 0;
          switch (offer.discountType.toUpperCase()) {
            case "FLAT":
              offerDiscount = offer.discountValue;
              break;
            case "PERCENT":
            case "UPTO": {
              const percentDiscount = Math.floor(
                (subtotal * offer.discountValue) / 100
              );
              offerDiscount = offer.maxDiscountAmount
                ? Math.min(percentDiscount, offer.maxDiscountAmount)
                : percentDiscount;
              break;
            }
            default:
              offerDiscount = 0;
          }
          finalDiscount += offerDiscount;
        }
      }
    }

    // 🔹 Calculate totalAmount
    const totalAmount = Math.max(
      subtotal + tax + finalDeliveryFee - finalDiscount,
      0
    );

    // ✅ Create order
    const order = await Order.create({
      customerId,
      restaurantId,
      items,
      subtotal,
      tax,
      deliveryFee: finalDeliveryFee,
      discount: finalDiscount,
      totalAmount,
      offerId,
      paymentMethod,
      premiumApplied,
      savings,
      premiumBreakdown,
    });

    // 🟢 Clear cart on COD
    if (paymentMethod === "COD") {
      await Cart.deleteOne({ userId: customerId, restaurantId });
    }

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (err) {
    console.error("❌ createOrder error:", err);
    res.status(500).json({ message: err.message });
  }
};

// 🔁 Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { orderStatus },
      { new: true }
    );

    if (!updatedOrder)
      return res.status(404).json({ message: "Order not found" });

    const io = req.app.get("io");
    io.to(orderId).emit("orderStatusUpdated", {
      orderId,
      orderStatus,
      updatedAt: new Date(),
    });

    res
      .status(200)
      .json({ message: "Order status updated", order: updatedOrder });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🚚 Update delivery info
const updateDeliveryStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { deliveryAgentId, deliveryTime, deliveryStatus } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        $set: {
          "deliveryDetails.deliveryAgentId": deliveryAgentId,
          "deliveryDetails.deliveryTime": deliveryTime,
          "deliveryDetails.deliveryStatus": deliveryStatus,
        },
      },
      { new: true }
    );

    if (!updatedOrder)
      return res.status(404).json({ message: "Order not found" });

    const io = req.app.get("io");
    io.to(orderId).emit("deliveryStatusUpdated", {
      orderId,
      deliveryStatus,
      deliveryAgentId,
      deliveryTime,
      updatedAt: new Date(),
    });

    res
      .status(200)
      .json({ message: "Delivery details updated", order: updatedOrder });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 👤 Get customer orders
const getCustomerOrders = async (req, res) => {
  try {
    const { customerId } = req.params;

    const orders = await Order.find({ customerId })
      .populate("restaurantId", "name")
      .populate("items.menuItemId", "name price")
      .sort({ createdAt: -1 })
      .lean();

    const formattedOrders = orders.map((order) => ({
      ...order,
      premiumSummary: order.premiumApplied
        ? `You saved ₹${order.savings} (Delivery: ₹${order.premiumBreakdown.freeDelivery}, Discount: ₹${order.premiumBreakdown.extraDiscount}, Cashback: ₹${order.premiumBreakdown.cashback}) with Premium`
        : null,
    }));

    res
      .status(200)
      .json({ message: "Customer orders fetched", orders: formattedOrders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🍽️ Get restaurant orders
const getRestaurantOrders = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const orders = await Order.find({ restaurantId })
      .populate("customerId", "name")
      .populate("items.menuItemId", "name price")
      .lean();

    const formattedOrders = orders.map((order) => ({
      ...order,
      premiumSummary: order.premiumApplied
        ? `Customer saved ₹${order.savings} (Delivery: ₹${order.premiumBreakdown.freeDelivery}, Discount: ₹${order.premiumBreakdown.extraDiscount}, Cashback: ₹${order.premiumBreakdown.cashback}) with Premium`
        : null,
    }));

    res
      .status(200)
      .json({ message: "Restaurant orders fetched", orders: formattedOrders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔍 Get single order
const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate("restaurantId", "name")
      .populate("customerId", "name")
      .populate("items.menuItemId", "name price")
      .populate("deliveryDetails.deliveryAgentId", "name")
      .lean();

    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.premiumApplied) {
      order.premiumSummary = `You saved ₹${order.savings} (Delivery: ₹${order.premiumBreakdown.freeDelivery}, Discount: ₹${order.premiumBreakdown.extraDiscount}, Cashback: ₹${order.premiumBreakdown.cashback}) with Premium`;
    }

    res.status(200).json({ message: "Order fetched", order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ⭐ Mark order as rated
const markOrderAsRated = async (req, res) => {
  try {
    const { orderId } = req.params;

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { isRated: true },
      { new: true }
    );

    if (!updatedOrder)
      return res.status(404).json({ message: "Order not found" });

    res
      .status(200)
      .json({ message: "Order marked as rated", order: updatedOrder });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createOrder,
  updateOrderStatus,
  updateDeliveryStatus,
  getCustomerOrders,
  getRestaurantOrders,
  getOrderById,
  markOrderAsRated,
};
