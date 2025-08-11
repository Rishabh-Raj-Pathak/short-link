import mongoose from "mongoose";
import { MONGO_URI, NODE_ENV } from "./env.js";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI, {
      // These options are good for production
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4, // Use IPv4, skip trying IPv6
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Log database name
    console.log(`📊 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);

    // In development, retry after 5 seconds
    if (NODE_ENV === "development") {
      console.log("🔄 Retrying connection in 5 seconds...");
      setTimeout(connectDB, 5000);
    } else {
      // In production, exit the process
      process.exit(1);
    }
  }
};

// Handle connection events
mongoose.connection.on("disconnected", () => {
  console.log("⚠️  MongoDB disconnected");
});

mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB error:", err);
});

// Function to disconnect from database (useful for testing)
const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    if (NODE_ENV !== "test") {
      console.log("✅ MongoDB disconnected");
    }
  } catch (error) {
    console.error("❌ MongoDB disconnect error:", error.message);
  }
};

export default connectDB;
export { connectDB, disconnectDB };
