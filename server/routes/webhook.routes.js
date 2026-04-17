import { Router } from "express";
import { Webhook } from "svix";
import * as clerkService from "../services/clerk.service.js";

const router = Router();

router.post("/clerk", async (req, res) => {
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
        await clerkService.syncUserToDatabase(evt.data);
        break;

      case "user.updated":
        await clerkService.syncUserToDatabase(evt.data);
        break;

      case "user.deleted":
        await clerkService.deleteUser(evt.data.id);
        break;

      default:
        console.log(`⚠️ Unhandled event type: ${eventType}`);
    }

    res.status(200).json({ success: true, message: "Event processed" });
  } catch (error) {
    console.error("❌ Error processing webhook:", error);
    res.status(500).json({
      error: "Error processing webhook",
      details: error.message,
    });
  }
});

export default router;
