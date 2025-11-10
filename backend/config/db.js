const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Auto-select the correct MongoDB URI based on environment
    const mongoURI =
      process.env.NODE_ENV === "production"
        ? process.env.MONGO_URI_PROD
        : process.env.MONGO_URI_LOCAL;

    if (!mongoURI) {
      throw new Error("❌ MongoDB URI is missing in environment variables!");
    }

    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(
      `✅ MongoDB Connected: ${conn.connection.host} (${
        process.env.NODE_ENV === "production" ? "Atlas (Production)" : "Local"
      })`
    );
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;


// const mongoose = require("mongoose");

// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGO_URI);

//     console.log(
//       `✅ MongoDB connected successfully to: ${conn.connection.name}`
//     );
//   } catch (err) {
//     console.error("❌ DB connection error:", err.message);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;
