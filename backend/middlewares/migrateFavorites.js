require("dotenv").config(); // Must be at the top
const mongoose = require("mongoose");

const migrateFavorites = async () => {
  try {
    // Debug: check if MONGO_URI is loaded
    console.log("Using MONGO_URI:", process.env.MONGO_URI);
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI is undefined!");

    // Connect to MongoDB
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ Connected to database: ${conn.connection.name}`);

    const collection = mongoose.connection.db.collection("favorites");

    // Step 1: Drop old index if it exists
    const indexes = await collection.indexes();
    const oldIndex = indexes.find(
      (idx) => idx.name === "customerId_1_itemId_1_itemType_1"
    );

    if (oldIndex) {
      await collection.dropIndex("customerId_1_itemId_1_itemType_1");
      console.log("✅ Dropped old index: customerId_1_itemId_1_itemType_1");
    } else {
      console.log("ℹ️ Old index not found, skipping drop");
    }

    // Step 2: Create new unique index for userId
    const userIndex = indexes.find((idx) => idx.key.userId === 1);
    if (!userIndex) {
      await collection.createIndex({ userId: 1 }, { unique: true });
      console.log("✅ Created new unique index on userId");
    } else {
      console.log("ℹ️ Index on userId already exists, skipping creation");
    }

    // Step 3: List current indexes
    const updatedIndexes = await collection.indexes();
    console.log("📋 Current indexes:", updatedIndexes);

    // Close connection
    await mongoose.disconnect();
    console.log("✅ Migration complete, MongoDB connection closed");
  } catch (err) {
    console.error("❌ Migration failed:", err);
    process.exit(1);
  }
};

migrateFavorites();
