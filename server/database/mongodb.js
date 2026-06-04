import * as mongoose from "mongoose";
import { DB_URI, NODE_ENV } from "../config/env.js";

if (!DB_URI) {
    throw new Error("Database URI is not defined in environment variables");
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

const connectToDatabase = async () => {
    if (cached.conn) {
        console.log("Using cached database connection pool");
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false, 
        };

        console.log(`Initializing new MongoDB connection pool in ${NODE_ENV || 'production'} environment...`);
        
        cached.promise = mongoose.connect(DB_URI, opts).then((mongooseInstance) => {
            console.log("Database connected successfully");
            return mongooseInstance;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (error) {
        cached.promise = null;
        console.error("DB connection error:", error);
        throw error; 
    }

    return cached.conn;
};

export default connectToDatabase;