import app from "./app.js";
import connectToDatabase from "./database/mongodb.js";
import { PORT } from "./config/env.js";

await connectToDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});