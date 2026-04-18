import { getAuth } from "@clerk/express";

export default function requireClerkAuth(req, res, next) {
  try {
    const auth = getAuth(req);

    if (auth?.userId) {
      req.user = {
        id: auth.userId,
        sessionId: auth.sessionId || null,
      };
      return next();
    }

    return res.status(401).json({
      message: "Unauthorized - Clerk session required",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Auth middleware error",
      detail: error.message,
    });
  }
}
