const { FAQ, HelpTicket } = require("../models/HelpSupportModel");

// ====== FAQs ======
const getFaqs = (role) => async (req, res) => {
  try {
    const faqs = await FAQ.find({ isActive: true, role })
      .sort({ createdAt: -1 })
      .lean();

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

// Add FAQ
const addFaq = (role) => async (req, res) => {
  try {
    const { question, answer, category, icon } = req.body;
    if (!question || !answer) {
      return res
        .status(400)
        .json({ message: "Question and answer are required" });
    }

    const faq = new FAQ({ question, answer, category, icon, role });
    await faq.save();

    res.status(201).json({ message: "FAQ added successfully!", faq });
  } catch (error) {
    console.error("Error adding FAQ:", error);
    res.status(500).json({ message: "Failed to add FAQ" });
  }
};

// ====== Tickets ======
const generateTicketId = () =>
  `HELP-${Math.floor(100000 + Math.random() * 900000)}`;

// Submit ticket
const submitTicket = (role) => async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: "Unauthorized: user not found" });
    }

    const { name, email, issue, message } = req.body;
    if (!name || !email || !issue || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const attachmentUrl = req.file ? req.file.path : null;

    const ticket = new HelpTicket({
      userId: req.user?._id || null,
      name,
      email,
      issue,
      message,
      attachmentUrl,
      ticketId: generateTicketId(),
      role,
    });

    await ticket.save();

    res.status(201).json({
      message: "Request submitted successfully!",
      ticketId: ticket.ticketId,
      attachmentUrl,
    });
  } catch (error) {
    console.error("Error submitting ticket:", error);
    res.status(500).json({ message: "Failed to submit ticket" });
  }
};

// Get user's tickets
const getUserTickets = (role) => async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: "Unauthorized: user not found" });
    }

    const tickets = await HelpTicket.find({
      userId: req.user._id,
      role,
    }).sort({ createdAt: -1 });

    res.json(tickets);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({ message: "Failed to fetch tickets" });
  }
};

// ====== ADMIN ======

// Get all tickets
const getAllTickets = async (req, res) => {
  try {
    const tickets = await HelpTicket.find().sort({ createdAt: -1 });
    res.json(tickets);
  } catch (error) {
    console.error("Error fetching all tickets:", error);
    res.status(500).json({ message: "Failed to fetch tickets" });
  }
};

// Update ticket status
const updateTicketStatus = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { status } = req.body;

    if (!["pending", "in-progress", "resolved", "closed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const ticket = await HelpTicket.findOneAndUpdate(
      { ticketId },
      { status },
      { new: true }
    );

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.json({ message: "Ticket status updated successfully", ticket });
  } catch (error) {
    console.error("Error updating ticket status:", error);
    res.status(500).json({ message: "Failed to update ticket status" });
  }
};

module.exports = {
  getFaqs,
  addFaq,
  submitTicket,
  getUserTickets,
  getAllTickets,
  updateTicketStatus,
};
