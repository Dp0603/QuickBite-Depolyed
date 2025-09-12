const Razorpay = require("razorpay");
const crypto = require("crypto");
const Cart = require("../models/CartModel");
const Order = require("../models/OrderModel");
const Menu = require("../models/MenuModel");
const Address = require("../models/AddressModel");
const PremiumSubscription = require("../models/PremiumSubscriptionModel");
const generateInvoice = require("../utils/generateInvoice");
const SubscriptionHistory = require("../models/SubscriptionHistorymodel");

// 🔐 Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ Create Razorpay Order
const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid amount" });
    }

    const options = {
      amount: amount * 100, // ₹ to paise
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      razorpayOrderId: order.id,
      amount: order.amount / 100,
      currency: order.currency,
    });
  } catch (err) {
    console.error("❌ Razorpay Order Error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to create Razorpay order" });
  }
};

// ✅ Verify Razorpay Signature & Create Order
const verifyRazorpaySignature = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body.paymentDetails;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: "❌ Invalid Razorpay signature" });
    }

    // Fetch menu item details
    const detailedItems = await Promise.all(
      req.body.items.map(async (item) => {
        const menu = await Menu.findById(item.menuItemId).lean();
        if (!menu) {
          throw new Error(`Menu item not found: ${item.menuItemId}`);
        }

        return {
          menuItemId: item.menuItemId,
          name: menu.name,
          price: menu.price,
          quantity: item.quantity || 1,
          note: item.note || "",
        };
      })
    );

    // Fetch address
    const address = await Address.findById(req.body.addressId).lean();
    if (!address) throw new Error("Address not found");

    // Create order object
    const orderData = {
      customerId: req.body.customerId,
      restaurantId: req.body.restaurantId,
      items: detailedItems,
      subtotal: req.body.subtotal,
      tax: req.body.tax,
      deliveryFee: req.body.deliveryFee,
      discount: req.body.discount,
      totalAmount: req.body.totalAmount,
      offerId: req.body.offerId || null,
      deliveryAddress: {
        addressLine: address.addressLine,
        landmark: address.landmark || "",
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        label: address.label || "",
      },
      paymentMethod: "Razorpay",
      paymentStatus: "Paid",
      orderStatus: "Pending",
      deliveryDetails: {
        deliveryAgentId: null,
        deliveryStatus: "Pending",
      },
      paymentDetails: {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      },
    };

    const createdOrder = await Order.create(orderData);

    // 🟢 Clear cart after successful payment
    await Cart.deleteOne({
      userId: req.body.customerId,
      restaurantId: req.body.restaurantId,
    });

    res.status(201).json({
      success: true,
      message: "✅ Payment verified, order created & cart cleared",
      order: createdOrder,
    });
  } catch (err) {
    console.error("💥 Payment Verification Error:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Server error during payment verification",
    });
  }
};

// 📄 Generate PDF Invoice
const getInvoicePDF = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    generateInvoice(order, res);
  } catch (err) {
    console.error("❌ Invoice Generation Error:", err);
    res.status(500).json({ message: "Failed to generate invoice" });
  }
};

// ✅ Create Razorpay Order for Premium
const createPremiumRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid amount" });
    }

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `premium_rcpt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      razorpayOrderId: order.id,
      amount: order.amount / 100,
      currency: order.currency,
    });
  } catch (err) {
    console.error("❌ Premium Razorpay Order Error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to create premium order" });
  }
};

// ✅ Verify Razorpay Signature for Premium & Save Subscription
const verifyPremiumPayment = async (req, res) => {
  try {
    console.log("verifyPremiumPayment received:", req.body);

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      subscriptionData,
    } = req.body;

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized: User ID missing" });
    }

    const userId = req.user._id;

    // Verify Razorpay signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Razorpay signature" });
    }

    // Check for existing subscription
    let subscription = await PremiumSubscription.findOne({
      subscriberId: subscriptionData.subscriberId,
    });

    const newStartDate = new Date();
    const newEndDate = subscriptionData.endDate;

    if (subscription) {
      subscription.planName = subscriptionData.planName;
      subscription.price = subscriptionData.price;
      subscription.durationInDays = subscriptionData.durationInDays;
      subscription.startDate = newStartDate;
      subscription.endDate = newEndDate;
      subscription.isActive = true;
      subscription.paymentStatus = "Paid";
      subscription.paymentId = razorpay_payment_id;
      await subscription.save();
    } else {
      subscription = await PremiumSubscription.create({
        userId, // ✅ Add this
        subscriberId: subscriptionData.subscriberId,
        subscriberType: subscriptionData.subscriberType || "User",
        planName: subscriptionData.planName,
        price: subscriptionData.price,
        durationInDays: subscriptionData.durationInDays,
        startDate: newStartDate,
        endDate: newEndDate,
        isActive: true,
        paymentStatus: "Paid",
        paymentId: razorpay_payment_id,
      });
    }

    await SubscriptionHistory.create({
      subscriberId: subscriptionData.subscriberId,
      subscriberType: subscriptionData.subscriberType || "User",
      planName: subscriptionData.planName,
      price: subscriptionData.price,
      durationInDays: subscriptionData.durationInDays,
      startDate: newStartDate,
      endDate: newEndDate,
      paymentId: razorpay_payment_id,
      paymentStatus: "Paid",
    });

    res.status(201).json({
      success: true,
      message:
        "✅ Premium payment verified, subscription updated, and history logged",
      subscription,
    });
  } catch (err) {
    console.error("💥 Premium Payment Verification Error:", err);
    res
      .status(500)
      .json({ success: false, message: "Payment verification failed" });
  }
};

module.exports = {
  // Orders
  createRazorpayOrder,
  verifyRazorpaySignature,
  getInvoicePDF,
  // Premium
  createPremiumRazorpayOrder,
  verifyPremiumPayment,
};
