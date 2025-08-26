const express = require("express");
const router = express.Router();
const {
  getFaqs,
  addFaq,
  submitTicket,
  getUserTickets,
} = require("../controllers/HelpSupportController");
const { protect, adminProtect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");

// ========================
// CUSTOMER HELP ROUTES
// ========================
router.get("/customer/faqs", getFaqs("customer"));
router.post("/customer/faqs", addFaq("customer"));

router.post(
  "/customer/submit",
  protect,
  (req, res, next) => {
    upload.single("attachment")(req, res, (err) => {
      if (err) return res.status(400).json({ message: err.message });
      next();
    });
  },
  submitTicket("customer")
);

router.get("/customer/tickets", protect, getUserTickets("customer"));

// ========================
// RESTAURANT HELP ROUTES
// ========================
router.get("/restaurant/faqs", getFaqs("restaurant"));
router.post("/restaurant/faqs", addFaq("restaurant"));

router.post(
  "/restaurant/submit",
  protect,
  (req, res, next) => {
    upload.single("attachment")(req, res, (err) => {
      if (err) return res.status(400).json({ message: err.message });
      next();
    });
  },
  submitTicket("restaurant")
);

router.get("/restaurant/tickets", protect, getUserTickets("restaurant"));

module.exports = router;
