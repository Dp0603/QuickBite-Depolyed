// Brevo API Email Sender
const axios = require("axios");
require("dotenv").config();

/**
 * Send Email via Brevo API
 * @param {Object} options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - Email HTML content
 */
const sendEmail = async ({ to, subject, html }) => {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "QuickBite 🍔",
          email: "pateldevam100@gmail.com", // ✅ you can replace with your verified sender
        },
        to: [{ email: to }],
        subject,
        htmlContent: html,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY, // ✅ your Brevo API key here
          "Content-Type": "application/json",
        },
      }
    );

    console.log(`📧 Email sent successfully to ${to}`);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Email sending failed:",
      error.response?.data || error.message
    );
    throw new Error("Failed to send email");
  }
};

module.exports = sendEmail;

//Resend
// const axios = require("axios");

// const sendEmail = async ({ to, subject, html }) => {
//   try {
//     // Log to confirm the API key is actually being loaded
//     console.log(
//       "🔑 Resend key loaded:",
//       process.env.RESEND_API_KEY ? "✅ Yes" : "❌ No"
//     );

//     // Fallback HTML in case none is provided
//     const emailHTML =
//       html ||
//       `
//       <h2 style="color:#FF5722;">Welcome to QuickBite!</h2>
//       <p>We're excited to have you on board. 🎉</p>
//       <a href="${process.env.CLIENT_URL || "http://localhost:5173/login"}"
//       style="background-color:#FF5722;color:white;padding:10px 20px;
//       border-radius:5px;text-decoration:none;">Login to QuickBite</a>
//     `;

//     // Send the email using Resend API
//     const res = await axios.post(
//       "https://api.resend.com/emails",
//       {
//         from: "QuickBite 🍔 <onboarding@resend.dev>",
//         to,
//         subject,
//         html: emailHTML,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     console.log(`📧 Email sent to ${to}: ${res.data.id}`);
//   } catch (err) {
//     // Improved error logging
//     console.error(
//       "❌ Email sending failed:",
//       err.response?.data || err.message || err
//     );
//   }
// };

// module.exports = sendEmail;

//Nodemailer
// const nodemailer = require("nodemailer");
// const dotenv = require("dotenv");

// dotenv.config();

// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST,
//   port: process.env.SMTP_PORT,
//   secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS,
//   },
// });

// const sendEmail = async ({ to, subject, html }) => {
//   try {
//     const mailOptions = {
//       from: `"QuickBite" <${process.env.SMTP_USER}>`,
//       to,
//       subject,
//       html,
//     };

//     const info = await transporter.sendMail(mailOptions);
//     console.log(`📧 Email sent to ${to}: ${info.messageId}`);
//   } catch (err) {
//     console.error("❌ Email sending failed:", err.message);
//     throw new Error("Failed to send email");
//   }
// };

// module.exports = sendEmail;
