const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      unique: true,
      sparse: true, // prevents index errors when value is null
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["customer", "restaurant", "deliveryAgent", "admin"],
      default: "customer",
    },
    avatar: {
      type: String,
      default: "",
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },

    // Email verification
    emailToken: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },

    // OTP login
    otp: {
      type: String,
    },
    otpExpiresAt: {
      type: Date,
    },

    // Password reset
    resetToken: {
      type: String,
    },
    resetTokenExpires: {
      type: Date,
    },
  },
  { timestamps: true }
);

// 🔐 Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ✅ Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
