import { Webhook } from "svix";
import * as webhookRepo from "../repositories/clerk.repository.js";

const syncUserToDatabase = async (clerkUser) => {
  try {
    if (!clerkUser?.id) {
      throw new Error("Invalid Clerk user data - missing id");
    }

    const userData = {
      clerkId: clerkUser.id,
      email: clerkUser.email_addresses[0].email_address || "",
      firstName: clerkUser.first_name || "",
      lastName: clerkUser.last_name || "",
      fullName: `${clerkUser.first_name || ""} ${
        clerkUser.last_name || ""
      }`.trim(),
      profileImage: clerkUser.profile_image_url || "",
    };
    const user = await webhookRepo.upsertUser(clerkUser.id, userData);
    return user;
  } catch (error) {
    console.error("❌ Error syncing user to database:", error.message);
    throw error;
  }
};

const syncUpdatedUserToDatabase = async (clerkUser) => {
  try {
    if (!clerkUser?.id) {
      throw new Error("Invalid Clerk user data - missing id");
    }

    const updateData = {
      email: clerkUser.email_addresses?.[0]?.email_address || "",
      firstName: clerkUser.first_name || "",
      lastName: clerkUser.last_name || "",
      fullName: `${clerkUser.first_name || ""} ${
        clerkUser.last_name || ""
      }`.trim(),
      profileImage: clerkUser.profile_image_url || "",
    };

    const user = await webhookRepo.updateUserByClerkId(
      clerkUser.id,
      updateData,
    );

    if (!user) {
      throw new Error("User not found for update");
    }

    return user;
  } catch (error) {
    console.error("❌ Error syncing updated user to database:", error.message);
    throw error;
  }
};

const deleteUser = async (clerkId) => {
  try {
    if (!clerkId) {
      throw new Error("clerkId is required to delete user");
    }
    await webhookRepo.deleteUserByClerkId(clerkId);
  } catch (error) {
    console.error("❌ Error deleting user from database:", error.message);
    throw error;
  }
};

export const clerkUserManagement = async (req, res) => {
  const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!CLERK_WEBHOOK_SECRET) {
    return res.status(500).json({
      error: "CLERK_WEBHOOK_SECRET is not configured",
    });
  }

  try {
    // Get the request body - should be raw when using express.raw()
    let body;
    if (Buffer.isBuffer(req.body)) {
      body = req.body.toString("utf8");
    } else if (typeof req.body === "string") {
      body = req.body;
    } else {
      body = JSON.stringify(req.body);
    }

    // Get headers
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    // Verify the webhook signature
    const wh = new Webhook(CLERK_WEBHOOK_SECRET);
    let evt;

    try {
      evt = wh.verify(body, headers);
    } catch (err) {
      return res.status(400).json({ error: "Webhook verification failed" });
    }

    // Handle different Clerk events
    const eventType = evt.type;

    switch (eventType) {
      case "user.created":
        await syncUserToDatabase(evt.data);
        break;

      case "user.updated":
        await syncUpdatedUserToDatabase(evt.data);
        break;

      case "user.deleted":
        await deleteUser(evt.data.id);
        break;

      default:
    }

    res.status(200).json({ success: true, message: "Event processed" });
  } catch (error) {
    res.status(500).json({
      error: "Error processing webhook",
      details: error.message,
    });
  }
};
