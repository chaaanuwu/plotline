import mongoose from "mongoose";
import { DB_URI } from "../config/env.js";

if (!DB_URI) {
  throw new Error("DB_URI is missing in environment variables");
}

// Prevent multiple connections in serverless
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export default async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    console.log("🚀 Creating new MongoDB connection...");

    cached.promise = mongoose.connect(DB_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log("✅ MongoDB connected successfully");

    return cached.conn;
  } catch (err) {
    cached.promise = null;
    console.error("❌ MongoDB connection failed:", err);
    throw err;
  }
}