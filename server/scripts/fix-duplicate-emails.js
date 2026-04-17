import mongoose from "mongoose";
import User from "../db/models/User.model.js";
import dotenv from "dotenv";

dotenv.config();

async function fixDuplicateEmails() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Find all duplicate emails
    const duplicates = await User.aggregate([
      {
        $group: {
          _id: { $toLower: "$email" },
          count: { $sum: 1 },
          ids: { $push: "$_id" },
        },
      },
      {
        $match: { count: { $gt: 1 } },
      },
    ]);

    if (duplicates.length === 0) {
      console.log("✅ No duplicate emails found");
      await mongoose.disconnect();
      return;
    }

    console.log(`\n⚠️ Found ${duplicates.length} duplicate email groups:\n`);

    for (const dup of duplicates) {
      console.log(`Email: ${dup._id}`);
      console.log(`Count: ${dup.count}`);

      // Get details of each duplicate
      const users = await User.find({ _id: { $in: dup.ids } }).select(
        "clerkId email firstName lastName createdAt",
      );

      users.forEach((user, index) => {
        console.log(
          `  [${index + 1}] ClerkID: ${user.clerkId} | Created: ${user.createdAt}`,
        );
      });
      console.log("");
    }

    console.log("\n📋 Recommended action:");
    console.log("1. Review the duplicate groups above");
    console.log(
      "2. Decide which user to keep (usually the one with the matching clerkId from Clerk)",
    );
    console.log("3. Manually delete duplicate records or contact support");

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

fixDuplicateEmails();
