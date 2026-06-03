import app from "./app.js";
import connectToDatabase from "./database/mongodb.js";

const port = process.env.PORT;

await connectToDatabase();

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});