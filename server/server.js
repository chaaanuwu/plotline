import app from "./app.js";
import { initializeBackgroundTasks } from "./app.js";
import connectToDatabase from "./database/mongodb.js";

const port = process.env.PORT || 5000;

async function bootstrap() {
  try {
    console.log("🚀 Bootstrapping server...");
    console.log("📊 Environment:", process.env.NODE_ENV);
    console.log("📊 Vercel:", !!process.env.VERCEL);

    // Connect to database
    console.log("📡 Connecting to DB...");
    await connectToDatabase();
    console.log("📡 DB connected");

    // Only run background tasks in development
    if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
      console.log("⚙️ Starting background tasks...");
      await initializeBackgroundTasks();
      console.log("⚙️ Background tasks ready");
    } else {
      console.log("⚠️ Skipping background tasks in production/serverless environment");
    }

    // Start server only in development
    if (process.env.NODE_ENV !== "production") {
      app.listen(port, () => {
        console.log(`✅ Server running on port ${port}`);
        console.log(`📍 Health check: http://localhost:${port}/health`);
      });
    } else {
      console.log("✅ Server ready for Vercel serverless environment");
    }
    
  } catch (error) {
    console.error("❌ Critical server boot failure:", error);
    console.error("Error details:", error.message);
    
    // Don't crash the process in production
    if (process.env.NODE_ENV !== "production") {
      process.exit(1);
    }
  }
}

// Run bootstrap in development
if (process.env.NODE_ENV !== "production") {
  bootstrap();
}

// Export for Vercel serverless
export default app;