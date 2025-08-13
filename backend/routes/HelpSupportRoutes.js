const express = require("express");
const router = express.Router();
const {
  getFaqs,
  addFaq,
  submitTicket,
  getUserTickets,
} = require("../controllers/HelpSupportController");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload"); // <-- Cloudinary multer

// FAQs
router.get("/faqs", getFaqs);
router.post("/faqs", addFaq);

// Tickets
// Cloudinary handles attachment upload; the resulting URL is in req.file.path
router.post(
  "/submit",
  protect,
  (req, res, next) => {
    upload.single("attachment")(req, res, (err) => {
      if (err) {
        console.error("Upload error:", err);
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  },
  submitTicket
);
router.get("/tickets", protect, getUserTickets);

module.exports = router;
