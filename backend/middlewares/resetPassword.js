//direct reset pass script if password is forgotten
// run using: node backend/middlewares/resetpassword.js and in terminal use this node resetPassword.js
// Make sure to replace the email and password at the bottom before running
// Ensure MongoDB is running and the UserModel path is correct


const mongoose = require("mongoose");
const User = require("../models/UserModel");

// MongoDB connection
mongoose
  .connect("mongodb://localhost:27017/quickbite")
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const resetUserPassword = async (email, newPassword) => {
  try {
    const user = await User.findOne({ email });
    if (!user) return console.log("❌ User not found");

    // ✅ Assign plain password and bypass pre-save hook
    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    console.log(`✅ Password reset successful for: ${email}`);
    process.exit();
  } catch (error) {
    console.error("❌ Error resetting password:", error);
    process.exit(1);
  }
};

// Change email and password here
resetUserPassword("passwordtester@yopmail.com", "QuickBite123");
