import cron from "node-cron";
import { fetchAndStoreTrending } from "../services/trending.service.js";

// runs everyday at midnight
cron.schedule("0 0 * * *", async () => {
  console.log("⏳ Running trending cron...");
  await fetchAndStoreTrending();
});