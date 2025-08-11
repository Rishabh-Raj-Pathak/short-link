import { verifyToken, extractToken } from "../utils/jwt.js";
import { User } from "../models/index.js";

// Middleware to require authentication
export const requireAuth = async (req, res, next) => {
  try {
    const token = extractToken(req);

    if (!token) {
      return res.status(401).json({
        ok: false,
        msg: "Session expired. Please log in.",
      });
    }

    // Verify token
    const decoded = verifyToken(token);

    // Check if user still exists
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        ok: false,
        msg: "Session expired. Please log in.",
      });
    }

    // Attach user info to request
    req.userId = decoded.userId;
    req.user = user;

    next();
  } catch (error) {
    // Auth middleware error occurred

    return res.status(401).json({
      ok: false,
      msg: "Session expired. Please log in.",
    });
  }
};

// Optional middleware - doesn't fail if no auth
export const optionalAuth = async (req, res, next) => {
  try {
    const token = extractToken(req);

    if (token) {
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.userId);

      if (user) {
        req.userId = decoded.userId;
        req.user = user;
      }
    }
  } catch (error) {
    // Silently fail for optional auth
    // Optional auth failed
  }

  next();
};
