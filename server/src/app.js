import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import { CLIENT_URL, NODE_ENV } from "./config/env.js";
import authRoutes from "./routes/auth.js";
import linkRoutes from "./routes/links.js";
import redirectRoutes from "./routes/redirect.js";

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// Serve static files for demo
app.use(express.static("public"));

// CORS configuration
app.use(
  cors({
    origin: [
      process.env.CLIENT_URL,
      "https://short-link-mocha-five.vercel.app",
      "https://*.vercel.app",
    ],
    credentials: true,
  })
);

// Request logging middleware (only in non-test environment)
if (process.env.NODE_ENV !== "test") {
  app.use((req, res, next) => {
    // Request logged
    next();
  });
}

// Health check route (must be before redirect routes)
app.get("/health", async (req, res) => {
  try {
    // Check database connection
    const dbStatus =
      mongoose.connection.readyState === 1 ? "Connected" : "Disconnected";

    res.json({
      status: "OK",
      message: "URL Shortener API is running",
      timestamp: new Date().toISOString(),
      environment: NODE_ENV,
      database: {
        status: dbStatus,
        host: mongoose.connection.host || "N/A",
        name: mongoose.connection.name || "N/A",
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "ERROR",
      message: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// Routes
app.use("/auth", authRoutes);
app.use("/api", linkRoutes);
app.use("/", redirectRoutes); // Handle short code redirects at root level

// Basic 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  // Error occurred
  res.status(500).json({
    error: NODE_ENV === "production" ? "Internal server error" : err.message,
  });
});

export { app };
