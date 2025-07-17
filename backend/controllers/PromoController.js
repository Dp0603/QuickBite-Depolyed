// controllers/promoController.js

// Dummy promo code map – you can later fetch these from DB
const validCoupons = {
  SAVE5: 0.05,
  WELCOME10: 0.1,
};

const applyPromoCode = async (req, res) => {
  try {
    const { code, subtotal } = req.body;

    if (!code || !subtotal) {
      return res
        .status(400)
        .json({ message: "Code and subtotal are required" });
    }

    const discount = validCoupons[code.toUpperCase()];
    if (!discount) {
      return res.status(400).json({ message: "Invalid promo code" });
    }

    const discountAmount = Math.floor(subtotal * discount);
    return res.status(200).json({
      message: "Promo code applied",
      discountAmount,
    });
  } catch (err) {
    console.error("Promo apply error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { applyPromoCode };
