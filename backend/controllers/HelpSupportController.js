const path = require("path");
const { FAQ, HelpTicket } = require("../models/HelpSupportModel");

// ====== FAQs ======

// Get all FAQs (grouped by category)
const getFaqs = async (req, res) => {
  try {
    const faqs = await FAQ.find({ isActive: true })
      .sort({ createdAt: -1 })
      .lean();

    // Group by category
    const grouped = faqs.reduce((acc, faq) => {
      let group = acc.find((g) => g.category === faq.category);
      if (!group) {
        group = { category: faq.category, icon: faq.icon, items: [] };
        acc.push(group);
      }
      group.items.push({ question: faq.question, answer: faq.answer });
      return acc;
    }, []);

    res.json(grouped);
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    res.status(500).json({ message: "Failed to fetch FAQs" });
  }
};

// Add FAQ (Admin use)
const addFaq = async (req, res) => {
  try {
    const { question, answer, category, icon } = req.body;
    if (!question || !answer) {
      return res
        .status(400)
        .json({ message: "Question and answer are required" });
    }

    const faq = new FAQ({ question, answer, category, icon });
    await faq.save();

    res.status(201).json({ message: "FAQ added successfully!", faq });
  } catch (error) {
    console.error("Error adding FAQ:", error);
    res.status(500).json({ message: "Failed to add FAQ" });
  }
};

// ====== Tickets ======

// Generate Ticket ID
const generateTicketId = () =>
  `HELP-${Math.floor(100000 + Math.random() * 900000)}`;

// Submit ticket
// Submit ticket
const submitTicket = async (req, res) => {
  try {
    const { name, email, issue, message } = req.body;

    if (!name || !email || !issue || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Cloudinary URL (if attachment was uploaded)
    const attachmentUrl = req.file ? req.file.path : null;

    const ticket = new HelpTicket({
      userId: req.user?.userId || null,
      name,
      email,
      issue,
      message,
      attachmentUrl,
      ticketId: generateTicketId(),
    });

    await ticket.save();

    res.status(201).json({
      message: "Request submitted successfully!",
      ticketId: ticket.ticketId,
      attachmentUrl, // return URL to frontend
    });
  } catch (error) {
    console.error("Error submitting ticket:", error);
    res.status(500).json({ message: "Failed to submit ticket" });
  }
};

// Get logged-in user's tickets
const getUserTickets = async (req, res) => {
  try {
    const tickets = await HelpTicket.find({ userId: req.user.userId }).sort({
      createdAt: -1,
    });
    res.json(tickets);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({ message: "Failed to fetch tickets" });
  }
};

module.exports = { getFaqs, addFaq, submitTicket, getUserTickets };
