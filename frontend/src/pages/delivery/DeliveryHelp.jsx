import React from "react";
import { FaQuestionCircle, FaHeadset } from "react-icons/fa";

const faqs = [
  {
    question: "How do I mark an order as delivered?",
    answer:
      "Go to Assigned Orders, tap the order, and press 'Mark Delivered'. This notifies the customer and admin in real time.",
  },
  {
    question: "Can I switch to Offline temporarily?",
    answer:
      "Yes. Use the toggle in Settings to go Offline. You won’t receive new deliveries until you're Online again.",
  },
  {
    question: "Who do I contact if I face a delivery issue?",
    answer:
      "You can email support at delivery@quickbite.com or use the in-app chat (coming soon).",
  },
];

const DeliveryHelp = () => {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6 text-gray-800 dark:text-white">
      <div className="max-w-5xl mx-auto flex flex-col justify-between h-full space-y-10">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <FaQuestionCircle className="text-primary" />
            Help & Support
          </h2>

          {/* FAQs */}
          <div className="space-y-5">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-secondary p-5 rounded-xl shadow hover:shadow-md transition"
              >
                <h4 className="text-lg font-semibold mb-1">{faq.question}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <div className="mt-auto bg-orange-50 dark:bg-orange-600/20 border-l-4 border-primary p-6 rounded-xl shadow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-1">
              <FaHeadset className="text-primary" />
              Still need help?
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Our support team is here 24/7 to assist you.
            </p>
          </div>
          <a
            href="mailto:delivery@quickbite.com"
            className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition shadow-sm"
          >
            Contact Support
          </a>
        </div>
      </div>
    </main>
  );
};

export default DeliveryHelp;
