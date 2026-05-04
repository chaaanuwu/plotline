import * as mongoose from "mongoose";
import { DB_URI, NODE_ENV } from "../config/env.js";

if (!DB_URI) {
    throw new Error("Database URI is not defined in environment variables");
}

const connectToDatabase = async () => {
    try {
        await mongoose.connect(DB_URI);
        console.log("Database connected successfully in " + NODE_ENV + " environment");
    } catch (error) {
        console.log("DB connection error:", error);
        process.exit(1);
    }
}

export default connectToDatabase;