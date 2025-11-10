// Brevo API Email Sender - Premium Version
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

/**
 * Send Email via Brevo API
 * @param {Object} options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} [options.name] - Recipient name
 * @param {string} [options.body] - Optional message body
 * @param {string} [options.type] - Email type: 'welcome', 'verification', 'order', 'password-reset', 'notification'
 * @param {string} [options.buttonText] - Custom button text
 * @param {string} [options.buttonLink] - Custom button link
 * @param {Object} [options.data] - Additional data for specific email types
 */
const sendEmail = async ({
  to,
  subject,
  name = "User",
  body,
  type = "welcome",
  buttonText,
  buttonLink,
  data = {},
}) => {
  try {
    // Generate email content based on type
    const emailContent = generateEmailContent({
      name,
      body,
      type,
      buttonText,
      buttonLink,
      data,
    });

    const html = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <title>${subject}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
              line-height: 1.6;
              color: #333;
              background: linear-gradient(135deg, #fff5f0 0%, #ffe4e1 100%);
            }
            .email-wrapper {
              width: 100%;
              padding: 40px 20px;
              background: linear-gradient(135deg, #fff5f0 0%, #ffe4e1 100%);
            }
            .email-container {
              max-width: 600px;
              margin: 0 auto;
              background: #ffffff;
              border-radius: 24px;
              overflow: hidden;
              box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
            }
            .header {
              background: linear-gradient(135deg, #ff6b35 0%, #f7931e 50%, #ec4899 100%);
              padding: 40px 30px;
              text-align: center;
              position: relative;
            }
            .header::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: url('data:image/svg+xml,<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40" fill="rgba(255,255,255,0.1)"/></svg>');
              opacity: 0.3;
            }
            .logo-container {
              position: relative;
              z-index: 1;
              margin-bottom: 20px;
            }
            .logo {
              width: 80px;
              height: 80px;
              border-radius: 20px;
              box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
              background: white;
              padding: 12px;
            }
            .header-title {
              color: white;
              font-size: 32px;
              font-weight: 700;
              margin: 0;
              text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              position: relative;
              z-index: 1;
            }
            .content {
              padding: 40px 30px;
            }
            .greeting {
              font-size: 24px;
              font-weight: 600;
              color: #1f2937;
              margin-bottom: 20px;
            }
            .message {
              font-size: 16px;
              color: #4b5563;
              line-height: 1.8;
              margin-bottom: 30px;
            }
            .highlight-box {
              background: linear-gradient(135deg, #fff5f0 0%, #ffe4e1 100%);
              border-left: 4px solid #ff6b35;
              padding: 20px;
              border-radius: 12px;
              margin: 30px 0;
            }
            .button-container {
              text-align: center;
              margin: 40px 0;
            }
            .button {
              display: inline-block;
              background: linear-gradient(135deg, #ff6b35 0%, #f7931e 50%, #ec4899 100%);
              color: white !important;
              padding: 16px 40px;
              text-decoration: none;
              border-radius: 12px;
              font-weight: 600;
              font-size: 16px;
              box-shadow: 0 8px 24px rgba(255, 107, 53, 0.3);
              transition: all 0.3s ease;
            }
            .button:hover {
              box-shadow: 0 12px 32px rgba(255, 107, 53, 0.4);
              transform: translateY(-2px);
            }
            .features {
              display: table;
              width: 100%;
              margin: 30px 0;
            }
            .feature-item {
              display: table-row;
            }
            .feature-icon {
              display: table-cell;
              padding: 12px 16px 12px 0;
              vertical-align: top;
              font-size: 24px;
            }
            .feature-text {
              display: table-cell;
              padding: 12px 0;
              vertical-align: top;
            }
            .feature-title {
              font-weight: 600;
              color: #1f2937;
              margin-bottom: 4px;
            }
            .feature-desc {
              color: #6b7280;
              font-size: 14px;
            }
            .divider {
              height: 1px;
              background: linear-gradient(90deg, transparent, #e5e7eb, transparent);
              margin: 30px 0;
            }
            .footer {
              background: #f9fafb;
              padding: 30px;
              text-align: center;
              border-top: 1px solid #e5e7eb;
            }
            .footer-text {
              color: #6b7280;
              font-size: 14px;
              margin-bottom: 15px;
            }
            .social-links {
              margin: 20px 0;
            }
            .social-link {
              display: inline-block;
              margin: 0 10px;
              color: #6b7280;
              text-decoration: none;
              font-size: 14px;
            }
            .copyright {
              color: #9ca3af;
              font-size: 12px;
              margin-top: 20px;
            }
            @media only screen and (max-width: 600px) {
              .email-wrapper {
                padding: 20px 10px;
              }
              .header {
                padding: 30px 20px;
              }
              .header-title {
                font-size: 24px;
              }
              .content {
                padding: 30px 20px;
              }
              .greeting {
                font-size: 20px;
              }
              .message {
                font-size: 15px;
              }
              .button {
                padding: 14px 30px;
                font-size: 15px;
              }
              .logo {
                width: 60px;
                height: 60px;
              }
            }
          </style>
        </head>
        <body>
          <div class="email-wrapper">
            <div class="email-container">
              <!-- Header -->
              <div class="header">
                <div class="logo-container">
                  <img
                    src="https://res.cloudinary.com/dqi8cb2gn/image/upload/v1752342525/Quickbite_i9bwmv.png"
                    alt="QuickBite Logo"
                    class="logo"
                  />
                </div>
                <h1 class="header-title">${emailContent.headerTitle}</h1>
              </div>

              <!-- Content -->
              <div class="content">
                <div class="greeting">${emailContent.greeting}</div>
                <div class="message">${emailContent.message}</div>

                ${emailContent.highlightBox || ""}
                ${emailContent.features || ""}
                
                <!-- CTA Button -->
                ${
                  emailContent.button
                    ? `
                  <div class="button-container">
                    <a href="${emailContent.buttonLink}" class="button">
                      ${emailContent.buttonText}
                    </a>
                  </div>
                `
                    : ""
                }

                ${emailContent.additionalInfo || ""}
              </div>

              <!-- Footer -->
              <div class="footer">
                <div class="footer-text">
                  <strong>QuickBite</strong> - Fast, Fresh, Delicious 🍔
                </div>
                <div class="footer-text">
                  Need help? Contact us at 
                  <a href="mailto:support@quickbite.com" style="color: #ff6b35; text-decoration: none;">
                    support@quickbite.com
                  </a>
                </div>
                <div class="social-links">
                  <a href="#" class="social-link">Instagram</a>
                  <a href="#" class="social-link">Twitter</a>
                  <a href="#" class="social-link">Facebook</a>
                </div>
                <div class="divider"></div>
                <div class="copyright">
                  © ${new Date().getFullYear()} QuickBite. All rights reserved.
                  <br />
                  <a href="${
                    process.env.FRONTEND_URL
                  }/privacy" style="color: #9ca3af; text-decoration: none; margin: 0 8px;">Privacy Policy</a>
                  <a href="${
                    process.env.FRONTEND_URL
                  }/terms" style="color: #9ca3af; text-decoration: none; margin: 0 8px;">Terms of Service</a>
                </div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: { name: "QuickBite 🍔", email: "pateldevam100@gmail.com" },
        to: [{ email: to, name }],
        subject,
        htmlContent: html,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(`📧 Email sent successfully to ${to}`);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Email send failed:",
      error.response?.data || error.message
    );
    throw new Error("Email failed to send");
  }
};

/**
 * Generate email content based on type
 */
function generateEmailContent({
  name,
  body,
  type,
  buttonText,
  buttonLink,
  data,
}) {
  const baseUrl = process.env.FRONTEND_URL || "http://localhost:5173";

  const templates = {
    welcome: {
      headerTitle: "Welcome to QuickBite! 🎉",
      greeting: `Hey ${name}! 👋`,
      message:
        body ||
        `We're absolutely thrilled to have you join the QuickBite family! Get ready to experience the fastest, freshest, and most delicious food delivery service in town. Your culinary adventure starts now!`,
      features: `
        <div class="features">
          <div class="feature-item">
            <div class="feature-icon">🚀</div>
            <div class="feature-text">
              <div class="feature-title">Lightning Fast Delivery</div>
              <div class="feature-desc">Get your food delivered in under 30 minutes</div>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">🎁</div>
            <div class="feature-text">
              <div class="feature-title">Exclusive Offers</div>
              <div class="feature-desc">Enjoy special discounts and cashback rewards</div>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">⭐</div>
            <div class="feature-text">
              <div class="feature-title">Premium Quality</div>
              <div class="feature-desc">Top-rated restaurants at your fingertips</div>
            </div>
          </div>
        </div>
      `,
      buttonText: buttonText || "Start Ordering Now",
      buttonLink: buttonLink || `${baseUrl}/customer/restaurants`,
    },

    verification: {
      headerTitle: "Verify Your Email 📧",
      greeting: `Hi ${name}!`,
      message:
        body ||
        `Thank you for signing up with QuickBite! We need to verify your email address to activate your account. Click the button below to complete your registration.`,
      highlightBox: `
        <div class="highlight-box">
          <strong>⚡ Quick Tip:</strong> This verification link will expire in 24 hours. 
          Make sure to verify soon to start enjoying delicious meals!
        </div>
      `,
      buttonText: buttonText || "Verify Email Address",
      buttonLink: buttonLink || `${baseUrl}/verify-email`,
      additionalInfo: `
        <div class="message" style="font-size: 14px; color: #6b7280; margin-top: 30px;">
          If you didn't create this account, please ignore this email.
        </div>
      `,
    },

    order: {
      headerTitle: "Order Confirmed! 🎊",
      greeting: `Great news, ${name}!`,
      message:
        body ||
        `Your order has been confirmed and our restaurant partner is preparing your delicious meal right now. We'll notify you once your order is out for delivery!`,
      highlightBox: data.orderDetails
        ? `
        <div class="highlight-box">
          <strong>Order #${data.orderDetails.orderId}</strong><br />
          <span style="color: #6b7280; font-size: 14px;">
            Total: ₹${data.orderDetails.total}<br />
            Estimated Delivery: ${
              data.orderDetails.estimatedTime || "30-40 mins"
            }
          </span>
        </div>
      `
        : "",
      buttonText: buttonText || "Track Your Order",
      buttonLink: buttonLink || `${baseUrl}/customer/orders`,
    },

    "password-reset": {
      headerTitle: "Reset Your Password 🔐",
      greeting: `Hi ${name}!`,
      message:
        body ||
        `We received a request to reset your password. Click the button below to create a new password. If you didn't request this, you can safely ignore this email.`,
      highlightBox: `
        <div class="highlight-box">
          <strong>🔒 Security Notice:</strong> This password reset link will expire in 1 hour. 
          For your security, never share this link with anyone.
        </div>
      `,
      buttonText: buttonText || "Reset Password",
      buttonLink: buttonLink || `${baseUrl}/reset-password`,
    },

    notification: {
      headerTitle: "You've Got News! 🔔",
      greeting: `Hey ${name}!`,
      message:
        body ||
        `We have an update for you from QuickBite. Check out what's new!`,
      buttonText: buttonText || "View Details",
      buttonLink: buttonLink || `${baseUrl}/customer/dashboard`,
    },
  };

  return templates[type] || templates.welcome;
}

module.exports = sendEmail;

//Resned
// const axios = require("axios");

// const sendEmail = async ({ to, subject, name = "User", body }) => {
//   try {
//     console.log(
//       "🔑 Resend key loaded:",
//       process.env.RESEND_API_KEY ? "✅ Yes" : "❌ No"
//     );

//     const html = `
//       <h2 style="color:#FF5722;">Welcome to QuickBite, ${name}!</h2>
//       <p>${
//         body ||
//         "We're excited to have you on board. Get ready to enjoy fast, fresh, and delicious food delivered to your door! 🎉"
//       }</p>
//       <a href="${
//         process.env.CLIENT_URL || "http://localhost:5173/login"
//       }" style="background-color:#FF5722;color:white;padding:10px 20px;border-radius:5px;text-decoration:none;">Login</a>
//     `;

//     const res = await axios.post(
//       "https://api.resend.com/emails",
//       {
//         from: "QuickBite 🍔 <onboarding@resend.dev>",
//         to,
//         subject,
//         html,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     console.log(`📧 Email sent to ${to}: ${res.data.id}`);
//   } catch (error) {
//     console.error(
//       "❌ Email send failed:",
//       error.response?.data || error.message
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
//   secure: process.env.SMTP_SECURE === "true", // true for 465, false for others
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS,
//   },
// });

// /**
//  * @param {Object} options
//  * @param {string} options.to - Email recipient
//  * @param {string} options.subject - Email subject
//  * @param {string} options.name - Recipient name
//  * @param {string} options.body - Optional custom HTML body
//  */
// const sendEmail = async ({ to, subject, name = "User", body }) => {
//   try {
//     const html = `
//     <!DOCTYPE html>
//     <html>
//       <head>
//         <meta charset="UTF-8" />
//         <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//         <title>${subject}</title>
//         <style>
//           @media only screen and (max-width: 600px) {
//             .container {
//               width: 100% !important;
//               padding: 1rem !important;
//             }
//           }
//         </style>
//       </head>
//       <body style="margin: 0; padding: 0; background-color: #fceeea; font-family: 'Segoe UI', sans-serif;">

//         <!-- Preheader -->
//         <div style="display: none; max-height: 0; overflow: hidden;">
//           Welcome to QuickBite! Your account is ready 🍔
//         </div>

//         <div class="container" style="max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; padding: 2rem;">

//           <!-- Logo -->
//         <div style="text-align: center; margin-bottom: 1rem;">
//         <img
//             src="https://res.cloudinary.com/dqi8cb2gn/image/upload/v1752342525/Quickbite_i9bwmv.png"
//             alt="QuickBite Logo"
//             width="48"
//             height="48"
//             style="border-radius: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);"
//         />
//         </div>
//           <!-- Heading -->
//           <h2 style="text-align: center; color: #FF5722;">Welcome to QuickBite, ${name}!</h2>

//           <!-- Body -->
//           <p style="font-size: 16px; color: #333;">
//             ${
//               body ||
//               `We're excited to have you on board. Get ready to enjoy fast, fresh, and delicious food delivered to your door! 🎉`
//             }
//           </p>

//           <!-- CTA -->
//           <div style="text-align: center; margin: 2rem 0;">
//             <a href="${
//               process.env.CLIENT_URL || "http://localhost:5173/login"
//             }"
//                style="background-color: #FF5722; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
//               Login to Your Account
//             </a>
//           </div>

//           <!-- Footer -->
//           <p style="font-size: 12px; color: #999; text-align: center;">
//             © ${new Date().getFullYear()} QuickBite. All rights reserved.
//           </p>
//         </div>
//       </body>
//     </html>
//     `;

//     const mailOptions = {
//       from: `"QuickBite 🍔" <${process.env.SMTP_USER}>`,
//       to,
//       subject,
//       html,
//     };

//     const info = await transporter.sendMail(mailOptions);
//     console.log(`📧 Email sent to ${to}: ${info.messageId}`);
//   } catch (error) {
//     console.error("❌ Email send failed:", error.message);
//     throw new Error("Email failed");
//   }
// };

// module.exports = sendEmail;
