import { COOKIE_NAME, NODE_ENV } from "../config/env.js";

// Set HTTP-only cookie with JWT
export const setAuthCookie = (res, token) => {
  const cookieOptions = {
    httpOnly: true, // Prevent XSS attacks
    secure: NODE_ENV === "production", // HTTPS only in production
    sameSite: NODE_ENV === "production" ? "none" : "lax", // 'none' for cross-origin in production
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    path: "/", // Cookie available for entire app
  };

  res.cookie(COOKIE_NAME, token, cookieOptions);
};

// Clear authentication cookie
export const clearAuthCookie = (res) => {
  const cookieOptions = {
    httpOnly: true,
    secure: NODE_ENV === "production",
    sameSite: NODE_ENV === "production" ? "none" : "lax", // 'none' for cross-origin in production
    path: "/",
  };

  res.clearCookie(COOKIE_NAME, cookieOptions);
};
