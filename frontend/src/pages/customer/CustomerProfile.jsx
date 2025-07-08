import React from "react";

const CustomerProfile = () => {
  return (
    <div className="p-6 text-gray-800 dark:text-white max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🙋‍♂️ My Profile</h1>

      <div className="bg-white dark:bg-secondary p-5 rounded-xl shadow border dark:border-gray-700 space-y-4">
        <div className="flex items-center gap-4">
          <img
            src="https://i.pravatar.cc/100"
            alt="User"
            className="w-20 h-20 rounded-full object-cover"
          />
          <div>
            <h2 className="text-xl font-semibold">Rahul Sharma</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              rahul.sharma@example.com
            </p>
          </div>
        </div>

        <div>
          <p className="text-sm mb-1 text-gray-600 dark:text-gray-400">Phone</p>
          <p className="text-base font-medium">+91 98765 43210</p>
        </div>

        <div>
          <p className="text-sm mb-1 text-gray-600 dark:text-gray-400">
            Primary Address
          </p>
          <p className="text-base font-medium">123, MG Road, Bengaluru</p>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;
