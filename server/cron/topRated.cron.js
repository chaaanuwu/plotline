import cron from "node-cron";
import { fetchAndStoreTopRated } from "../services/topRated.service";

cron.schedule("0 0 * * *", async () => {
    console.log("⏳ Running top rated cron...");
    await fetchAndStoreTopRated();
});