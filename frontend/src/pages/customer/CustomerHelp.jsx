import React from "react";
import {
  FaQuestionCircle,
  FaEnvelope,
  FaPhoneAlt,
  FaWhatsapp,
} from "react-icons/fa";

const faqs = [
  {
    question: "How do I track my order?",
    answer:
      "Go to the 'Orders' page and click on 'Track Order' next to your active order.",
  },
  {
    question: "Can I cancel an order?",
    answer:
      "Yes, if it's not yet out for delivery. Use the 'Orders' page to manage orders.",
  },
  {
    question: "How do I change my address?",
    answer:
      "Visit the 'Address Book' section in your profile to edit or add addresses.",
  },
];

const CustomerHelp = () => {
  return (
    <div className="p-6 text-gray-800 dark:text-white max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <FaQuestionCircle className="text-primary" /> Help & Support
      </h1>

      {/* FAQ Section */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">
          ❓ Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-secondary p-4 rounded-xl border dark:border-gray-700 shadow"
            >
              <p className="font-medium mb-2">{faq.question}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Info */}
      <section>
        <h2 className="text-xl font-semibold mb-4">📞 Contact Us</h2>
        <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
          <p className="flex items-center gap-2">
            <FaEnvelope className="text-primary" /> support@quickbite.com
          </p>
          <p className="flex items-center gap-2">
            <FaPhoneAlt className="text-primary" /> +91 98765 43210
          </p>
          <p className="flex items-center gap-2">
            <FaWhatsapp className="text-primary" /> Chat with us on WhatsApp
          </p>
        </div>
      </section>
    </div>
  );
};

export default CustomerHelp;
