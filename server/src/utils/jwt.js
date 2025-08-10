import jwt from "jsonwebtoken";
import { JWT_SECRET, COOKIE_NAME } from "../config/env.js";

// Generate JWT token
export const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "7d", // Token expires in 7 days
    issuer: "url-shortener",
    audience: "url-shortener-users",
  });
};

// Verify JWT token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET, {
      issuer: "url-shortener",
      audience: "url-shortener-users",
    });
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};

// Extract token from Authorization header or cookies
export const extractToken = (req) => {
  // First check Authorization header (for API calls)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    return req.headers.authorization.substring(7);
  }

  // Then check HTTP-only cookie (for web app)
  if (req.cookies && req.cookies[COOKIE_NAME]) {
    return req.cookies[COOKIE_NAME];
  }

  return null;
};
