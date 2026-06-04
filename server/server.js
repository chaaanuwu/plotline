import app from "./app.js";
import { initializeBackgroundTasks } from "./app.js";
import connectToDatabase from "./database/mongodb.js";
import { PORT } from "./config/env.js";

const port = process.env.PORT || PORT || 5000;

async function bootstrap() {
  try {
    console.log("🚀 Bootstrapping server...");

    console.log("📡 Connecting to DB...");
    await connectToDatabase();
    console.log("📡 DB connected");

    console.log("⚙️ Starting background tasks...");
    await initializeBackgroundTasks();
    console.log("⚙️ Background tasks ready");

    if (process.env.NODE_ENV !== "production") {
      app.listen(port, () => {
        console.log(`Server running on port ${port}`);
      });
    }
  } catch (error) {
    console.error("❌ Critical server boot failure:", error);
  }
}

bootstrap();