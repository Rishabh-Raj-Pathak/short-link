import { PORT, NODE_ENV } from "./config/env.js";
import connectDB from "./config/database.js";
import { app } from "./app.js";

// Connect to database
connectDB();

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${NODE_ENV}`);
});
