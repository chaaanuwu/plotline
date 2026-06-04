import app from "./app.js";
import connectToDatabase from "./database/mongodb.js";
import { PORT } from "./config/env.js";

const port = process.env.PORT || PORT || 5000;

await connectToDatabase();

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});