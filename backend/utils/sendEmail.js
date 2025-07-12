const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for others
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * @param {Object} options
 * @param {string} options.to - Email recipient
 * @param {string} options.subject - Email subject
 * @param {string} options.name - Recipient name
 * @param {string} options.body - Optional custom HTML body
 */
const sendEmail = async ({ to, subject, name = "User", body }) => {
  try {
    const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${subject}</title>
        <style>
          @media only screen and (max-width: 600px) {
            .container {
              width: 100% !important;
              padding: 1rem !important;
            }
          }
        </style>
      </head>
      <body style="margin: 0; padding: 0; background-color: #fceeea; font-family: 'Segoe UI', sans-serif;">

        <!-- Preheader -->
        <div style="display: none; max-height: 0; overflow: hidden;">
          Welcome to QuickBite! Your account is ready 🍔
        </div>

        <div class="container" style="max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; padding: 2rem;">
          
          <!-- Logo -->
        <div style="text-align: center; margin-bottom: 1rem;">
        <img 
            src="https://res.cloudinary.com/dqi8cb2gn/image/upload/v1752342525/Quickbite_i9bwmv.png" 
            alt="QuickBite Logo" 
            width="48" 
            height="48" 
            style="border-radius: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);" 
        />
        </div>
          <!-- Heading -->
          <h2 style="text-align: center; color: #FF5722;">Welcome to QuickBite, ${name}!</h2>

          <!-- Body -->
          <p style="font-size: 16px; color: #333;">
            ${
              body ||
              `We're excited to have you on board. Get ready to enjoy fast, fresh, and delicious food delivered to your door! 🎉`
            }
          </p>

          <!-- CTA -->
          <div style="text-align: center; margin: 2rem 0;">
            <a href="${
              process.env.CLIENT_URL || "http://localhost:5173/login"
            }" 
               style="background-color: #FF5722; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
              Login to Your Account
            </a>
          </div>

          <!-- Footer -->
          <p style="font-size: 12px; color: #999; text-align: center;">
            © ${new Date().getFullYear()} QuickBite. All rights reserved.
          </p>
        </div>
      </body>
    </html>
    `;

    const mailOptions = {
      from: `"QuickBite 🍔" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent to ${to}: ${info.messageId}`);
  } catch (error) {
    console.error("❌ Email send failed:", error.message);
    throw new Error("Email failed");
  }
};

module.exports = sendEmail;
