import { Router } from "express";
import requireClerkAuth from "../middlewares/clerk_auth.middleware.js";
import User from "../db/models/User.model.js";

const router = Router();

router.get("/me", requireClerkAuth, async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(200).json({ auth: req.user, user: null });
    }

    const localUser = await User.findOne({ clerkId: userId }).lean();

    if (!localUser) {
      return res.status(200).json({ auth: req.user, user: null });
    }

    const safeUser = {
      clerkId: localUser.clerkId,
      email: localUser.email,
      firstName: localUser.firstName,
      lastName: localUser.lastName,
      fullName: localUser.fullName,
      profileImage: localUser.profileImage,
      role: localUser.role || null,
    };

    // return res.status(200).json({ auth: req.user, user: safeUser });
    return res.status(200).json({ user: safeUser });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to get user", detail: err.message });
  }
});

export default router;
