import React, { useState } from "react";
import { FaChevronDown, FaChevronUp, FaLifeRing } from "react-icons/fa";

const faqs = [
  {
    question: "How do I update my restaurant hours?",
    answer:
      "Go to the Settings page, and toggle your opening hours under 'Restaurant is Open'.",
  },
  {
    question: "Why is my dish not visible to customers?",
    answer:
      "Make sure the dish is marked as 'Available' in the Menu Manager. Also check for approval status.",
  },
  {
    question: "How do I contact support?",
    answer: "You can email us at support@quickbite.com or use the in-app chat.",
  },
];

const RestaurantHelp = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="px-6 py-8 min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-white">
      <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
        {/* Heading */}
        <h2 className="text-3xl font-bold flex items-center gap-2">
          <FaLifeRing className="text-primary" />
          Help & Support
        </h2>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white dark:bg-secondary border border-gray-200 dark:border-gray-700 rounded-xl shadow"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full text-left px-5 py-4 flex justify-between items-center focus:outline-none"
              >
                <span className="text-base font-medium">{faq.question}</span>
                {openIndex === index ? (
                  <FaChevronUp className="text-gray-500" />
                ) : (
                  <FaChevronDown className="text-gray-500" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-5 pb-4 text-sm text-gray-700 dark:text-gray-300">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Support Section */}
        <div className="bg-accent dark:bg-secondary p-6 rounded-xl shadow space-y-3 mt-8">
          <h3 className="text-lg font-semibold">Still Need Help?</h3>
          <p className="text-sm text-gray-700 dark:text-gray-400">
            Reach out to our restaurant support team via chat or email.
          </p>
          <button className="bg-primary text-white px-5 py-2 rounded-xl text-sm hover:bg-orange-600 transition">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestaurantHelp;
