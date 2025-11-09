const axios = require("axios");

const sendEmail = async ({ to, subject, html }) => {
  try {
    const res = await axios.post(
      "https://api.resend.com/emails",
      {
        from: "QuickBite 🍔 <onboarding@resend.dev>",
        to,
        subject,
        html,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(`📧 Email sent to ${to}: ${res.data.id}`);
  } catch (err) {
    console.error("❌ Email sending failed:", err.message);
  }
};

module.exports = sendEmail;
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
