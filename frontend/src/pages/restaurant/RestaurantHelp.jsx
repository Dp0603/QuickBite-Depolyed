import React from "react";

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
  return (
    <div className="p-6 max-w-3xl">
      <h2 className="text-2xl font-bold mb-4">Help & Support</h2>

      <div className="space-y-5">
        {faqs.map((faq, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow">
            <h4 className="font-semibold text-lg mb-2">{faq.question}</h4>
            <p className="text-gray-700 dark:text-gray-300">{faq.answer}</p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-2">Still Need Help?</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Reach out to our restaurant support team.
        </p>
        <button className="bg-primary text-white px-4 py-2 rounded hover:bg-orange-600">
          Contact Support
        </button>
      </div>
    </div>
  );
};

export default RestaurantHelp;
