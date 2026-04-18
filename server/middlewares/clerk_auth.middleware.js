export default function requireClerkAuth(req, res, next) {
  try {
    const auth = req.auth();

    if (!auth || !auth.userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized - Clerk session required" });
    }

    req.user = {
      id: auth.userId,
      sessionId: auth.sessionId || null,
      status: auth.status || null,
      rawAuth: auth,
    };

    return next();
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Auth middleware error", detail: err.message });
  }
}
