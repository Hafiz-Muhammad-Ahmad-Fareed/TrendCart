import { createClerkClient } from "@clerk/express";
import User from "../db/models/User.model.js";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

export default async function seedAdmin() {
  try {
    const adminEmail = "heden25187@ryzid.com";
    const adminPassword = "SuperSecurePassword123!";

    // 1. Check Clerk
    const existingClerkUsers = await clerkClient.users.getUserList({
      emailAddress: [adminEmail],
    });

    let clerkUser;
    if (existingClerkUsers.data.length > 0) {
      clerkUser = existingClerkUsers.data[0];
    } else {
      clerkUser = await clerkClient.users.createUser({
        emailAddress: [adminEmail],
        password: adminPassword,
        firstName: "System",
        lastName: "Admin",
      });
    }

    // 2. Upsert in MongoDB
    const updatedUser = await User.findOneAndUpdate(
      { clerkId: clerkUser.id },
      {
        clerkId: clerkUser.id,
        email: adminEmail,
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        fullName: `${clerkUser.firstName} ${clerkUser.lastName}`,
        profileImage: clerkUser.imageUrl,
        role: "admin",
      },
      { upsert: true, returnDocument: "after" },
    );
  } catch (error) {}
}
