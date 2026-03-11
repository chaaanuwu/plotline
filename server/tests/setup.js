import mongoose from "mongoose";
import { DB_URI } from "../config/env.js";

beforeAll(async () => {
  // Connect to test DB
  await mongoose.connect(DB_URI);
});

afterAll(async () => {
  // Clear all collections before each test
  for (const collection in mongoose.connection.collections) {
    await mongoose.connection.collections[collection].deleteMany({});
  }
  // Close connection after all tests
  await mongoose.connection.close();
});