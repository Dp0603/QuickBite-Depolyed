const Razorpay = require("razorpay");
const crypto = require("crypto");
const Cart = require("../models/CartModel");
const Order = require("../models/OrderModel");
const Menu = require("../models/MenuModel");
const Address = require("../models/AddressModel");
const PremiumSubscription = require("../models/PremiumSubscriptionModel");
const generateInvoice = require("../utils/generateInvoice");
const SubscriptionHistory = require("../models/SubscriptionHistorymodel");

// 🔹 Normalize perks so it always matches schema
const normalizePerks = (perks = {}) => {
  const typeMap = {
    0: "FLAT",
    1: "PERCENT",
    FLAT: "FLAT",
    PERCENT: "PERCENT",
  };

  return {
    freeDelivery: perks.freeDelivery ?? true,
    extraDiscount: {
      type: typeMap[perks.extraDiscount?.type] || "FLAT",
      value: perks.extraDiscount?.value ?? 0,
    },
    cashback: {
      type: typeMap[perks.cashback?.type] || "FLAT",
      value: perks.cashback?.value ?? 0,
    },
  };
};

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

    // 1. Verify Razorpay signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: "❌ Invalid Razorpay signature" });
    }

    // 2. Fetch menu item details
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

    // 3. Fetch address
    const address = await Address.findById(req.body.addressId).lean();
    if (!address) throw new Error("Address not found");

    // 4. PREMIUM LOGIC: calculate premium savings if user is premium
    let premiumApplied = false;
    let savings = 0;
    let premiumBreakdown = {
      freeDelivery: 0,
      extraDiscount: 0,
      cashback: 0,
    };

    // Fetch active premium subscription
    const subscription = await PremiumSubscription.findOne({
      subscriberId: req.body.customerId,
      subscriberType: "User",
      isActive: true,
      endDate: { $gte: new Date() },
    });

    // Use original delivery fee instead of client’s fee
    // (fetch from restaurant config or set default)
    const originalDeliveryFee = req.body.originalDeliveryFee || 40;
    let deliveryFee = originalDeliveryFee;
    let discount = req.body.discount;

    if (subscription) {
      premiumApplied = true;

      // Free Delivery
      const deliverySavings = subscription.perks.freeDelivery
        ? originalDeliveryFee
        : 0;
      deliveryFee = subscription.perks.freeDelivery ? 0 : originalDeliveryFee;

      // Extra Discount
      const extraDiscountRate = subscription.perks.extraDiscount || 0;
      const discountSavings = (req.body.subtotal * extraDiscountRate) / 100;
      discount = discount + discountSavings;

      // Cashback (if any)
      const cashback = subscription.perks.cashback
        ? (req.body.subtotal * subscription.perks.cashback) / 100
        : 0;

      premiumBreakdown = {
        freeDelivery: deliverySavings,
        extraDiscount: discountSavings,
        cashback,
      };

      savings = deliverySavings + discountSavings + cashback;

      // Update subscription’s total savings
      subscription.totalSavings = (subscription.totalSavings || 0) + savings;
      await subscription.save();
    }

    // Compute totalAmount with updated deliveryFee & discount
    const totalAmount =
      req.body.subtotal + req.body.tax + deliveryFee - discount;

    // 6. Prepare order object (add premium fields)
    const orderData = {
      customerId: req.body.customerId,
      restaurantId: req.body.restaurantId,
      items: detailedItems,
      subtotal: req.body.subtotal,
      tax: req.body.tax,
      deliveryFee, // already updated above
      discount, // already updated above
      totalAmount, // already computed above
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
      // Premium fields
      premiumApplied,
      savings,
      premiumBreakdown,
    };

    // 7. Create the order
    const createdOrder = await Order.create(orderData);

    // 8. Clear cart after successful payment
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

    // 1️⃣ Verify Razorpay signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Razorpay signature" });
    }

    // 2️⃣ Normalize perks before saving
    const normalizedPerks = normalizePerks(subscriptionData.perks);

    // 3️⃣ Check if subscription exists
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
      subscription.perks = normalizedPerks;
      await subscription.save();
    } else {
      subscription = await PremiumSubscription.create({
        userId,
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
        perks: normalizedPerks,
      });
    }

    // 4️⃣ Log subscription history
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
