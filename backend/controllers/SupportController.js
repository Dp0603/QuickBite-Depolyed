const Support = require("../models/SupportModal"); // Import the Support model

// 🆘 Submit Support Request
const submitSupportRequest = async (req, res) => {
  try {
    const { orderId, issue, message } = req.body;

    if (!orderId || !issue) {
      return res
        .status(400)
        .json({ message: "Order ID and issue are required" });
    }

    // Create a new support request
    const newRequest = new Support({
      orderId,
      issue,
      message,
    });

    // Save to database
    await newRequest.save();

    // Respond with success message
    res
      .status(201)
      .json({ message: "Support request submitted successfully!" });
  } catch (error) {
    console.error("Error submitting support request:", error);
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again." });
  }
};

module.exports = {
  submitSupportRequest,
};
