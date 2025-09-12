// Load environment variables from .env in backend root
require("dotenv").config({ path: "../.env" });

const mongoose = require("mongoose");
const PremiumSubscription = require("../models/PremiumSubscriptionModel");

async function backfillUserId() {
  try {
    console.log("Connecting to MongoDB at:", process.env.MONGO_URI);

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Connected to MongoDB successfully.");

    // Find subscriptions missing userId
    const subscriptions = await PremiumSubscription.find({
      userId: { $exists: false },
    });

    console.log(`Found ${subscriptions.length} subscriptions without userId.`);

    for (const sub of subscriptions) {
      if (sub.subscriberType === "User") {
        sub.userId = sub.subscriberId;
        await sub.save();
        console.log(`✅ Updated subscription ${sub._id} with userId.`);
      }
    }

    console.log("✅ Backfill completed successfully.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Migration error:", err);
    process.exit(1);
  }
}

backfillUserId();
