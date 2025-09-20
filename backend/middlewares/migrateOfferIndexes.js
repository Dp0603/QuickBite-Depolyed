require("dotenv").config(); // Load MONGO_URI
const mongoose = require("mongoose");

const migrateOfferIndexes = async () => {
  try {
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI is undefined!");
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ Connected to database: ${conn.connection.name}`);

    const collection = mongoose.connection.db.collection("offers");

    // 1️⃣ Drop old promoCode unique index if it exists
    const indexes = await collection.indexes();
    const oldIndex = indexes.find((idx) => idx.key.promoCode === 1);
    if (oldIndex) {
      await collection.dropIndex(oldIndex.name);
      console.log(`✅ Dropped old index: ${oldIndex.name}`);
    } else {
      console.log("ℹ️ Old promoCode index not found, skipping drop");
    }

    // 2️⃣ Create new compound unique index: restaurantId + promoCode
    await collection.createIndex(
      { restaurantId: 1, promoCode: 1 },
      { unique: true, sparse: true }
    );
    console.log(
      "✅ Created new compound unique index: { restaurantId + promoCode }"
    );

    // 3️⃣ Show current indexes
    const updatedIndexes = await collection.indexes();
    console.log("📋 Current indexes:", updatedIndexes);

    await mongoose.disconnect();
    console.log("✅ Migration complete, MongoDB connection closed");
  } catch (err) {
    console.error("❌ Migration failed:", err);
    process.exit(1);
  }
};

migrateOfferIndexes();
