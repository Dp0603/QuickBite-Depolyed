// controllers/paymentController.js
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/OrderModel");

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
      return res.status(400).json({
        success: false,
        message: "❌ Invalid Razorpay signature",
      });
    }

    // ✅ Signature valid — Create order in DB
    const orderData = {
      customerId: req.body.customerId,
      restaurantId: req.body.restaurantId,
      items: req.body.items,
      subtotal: req.body.subtotal,
      tax: req.body.tax,
      deliveryFee: req.body.deliveryFee,
      discount: req.body.discount,
      totalAmount: req.body.totalAmount,
      offerId: req.body.offerId || null,
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

    res.status(201).json({
      success: true,
      message: "✅ Payment verified and order created",
      order: createdOrder,
    });
  } catch (err) {
    console.error("💥 Payment Verification Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error during payment verification",
    });
  }
};

module.exports = {
  createRazorpayOrder,
  verifyRazorpaySignature,
};
