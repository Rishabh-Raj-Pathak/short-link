import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ["MONGO_URI", "JWT_SECRET", "BASE_URL", "COOKIE_NAME"];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    process.stderr.write(`Missing required environment variable: ${envVar}\n`);
    process.exit(1);
  }
}

export const PORT = process.env.PORT || 3000;
export const NODE_ENV = process.env.NODE_ENV || "development";
export const MONGO_URI = process.env.MONGO_URI;
export const JWT_SECRET = process.env.JWT_SECRET;
export const BASE_URL = process.env.BASE_URL;
export const COOKIE_NAME = process.env.COOKIE_NAME;
export const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
