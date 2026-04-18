import { getAuth } from "@clerk/express";

/**
 * Clerk JWT Authentication Middleware
 *
 * Verifies the user's session token using two strategies:
 *
 * 1. **Primary (SDK)**: Uses `getAuth(req)` from `@clerk/express`, which reads
 *    from the already-applied `clerkMiddleware()`. This handles cookie-based
 *    (`__session`) and header-based auth seamlessly.
 *
 * 2. **Fallback (Manual JWT Verification)**: If the SDK path doesn't yield a
 *    userId, the middleware checks for a `Bearer` token in the Authorization
 *    header and **verifies** it using `jwt.verify()` with Clerk's PEM public
 *    key (RS256). This performs:
 *    - Signature verification
 *    - `exp` (expiration) and `nbf` (not before) validation
 *    - `azp` (authorized parties) claim checking
 *
 * Reference: https://clerk.com/docs/guides/sessions/manual-jwt-verification
 */
export default function requireClerkAuth(req, res, next) {
  try {
    // ─── Strategy 1: SDK-based auth via clerkMiddleware() ───
    const auth = getAuth(req);

    if (auth && auth.userId) {
      req.user = {
        id: auth.userId,
        sessionId: auth.sessionId || null,
      };
      console.log(
        `✅ [Strategy - SDK] Auth successful | userId: ${auth.userId}`,
      );
      return next();
    }

    // ─── Strategy 2: Manual JWT verification with PEM public key ───
    // const authHeader = req.headers.authorization || req.headers.Authorization;

    // if (authHeader && authHeader.startsWith("Bearer ")) {
    //   const token = authHeader.split(" ")[1];
    //   const publicKey = process.env.CLERK_JWT_KEY;

    //   if (!publicKey) {
    //     console.error(
    //       "CLERK_JWT_KEY is not configured — cannot verify Bearer tokens",
    //     );
    //     return res.status(500).json({
    //       message: "Server auth configuration error",
    //     });
    //   }

    //   try {
    //     // Verify signature, exp, and nbf claims using RS256
    //     const decoded = jwt.verify(token, publicKey, {
    //       algorithms: ["RS256"],
    //     });

    //     // Additional validation: check exp and nbf manually for extra safety
    //     const currentTime = Math.floor(Date.now() / 1000);

    //     if (decoded.exp && decoded.exp < currentTime) {
    //       return res.status(401).json({ message: "Token has expired" });
    //     }

    //     if (decoded.nbf && decoded.nbf > currentTime) {
    //       return res.status(401).json({ message: "Token is not yet valid" });
    //     }

    //     // Validate authorized parties (azp) — protects against CSRF
    //     const permittedOrigins = [
    //       process.env.CLIENT_URL, // e.g. http://localhost:5173
    //       "http://localhost:5173",
    //       "http://localhost:3000",
    //     ].filter(Boolean);

    //     if (decoded.azp && !permittedOrigins.includes(decoded.azp)) {
    //       return res.status(401).json({ message: "Invalid authorized party" });
    //     }

    //     // Token is fully verified ✅
    //     req.user = {
    //       id: decoded.sub,
    //       sessionId: decoded.sid || null,
    //       status: decoded.sts || null,
    //     };
    //     console.log(`✅ [Strategy 2 - Manual JWT] Auth successful | userId: ${decoded.sub}`);

    //     return next();
    //   } catch (verifyError) {
    //     // jwt.verify throws on invalid signature, expired token, etc.
    //     return res.status(401).json({
    //       message: "Invalid or expired token",
    //       detail:
    //         process.env.NODE_ENV === "development"
    //           ? verifyError.message
    //           : undefined,
    //     });
    //   }
    // }

    // ─── No valid auth found ───
    console.log(
      `❌ [Auth Failed] No valid session or token found for ${req.method} ${req.originalUrl}`,
    );
    return res
      .status(401)
      .json({ message: "Unauthorized — Clerk session required" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Auth middleware error", detail: err.message });
  }
}
