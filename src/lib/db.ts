// lib/db.ts
import { MongoClient } from "mongodb";
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

// Global for mongo client to use once across the app and not re-create it on each request
const globalForMongo = global as any;

// Mongo client instance - singleton pattern
export const client =
  globalForMongo.mongoClient ?? new MongoClient(MONGODB_URI);

// Set global for mongo client
if (!globalForMongo.mongoClient) {
  globalForMongo.mongoClient = client;
}

// Connect to MongoDB if not already connected
let connectionPromise: Promise<MongoClient> | null = null;

export async function connectMongoClient() {
  // Check if already connected
  if (client.topology?.isConnected()) {
    return client;
  }

  // If connection is in progress, return the existing promise
  if (connectionPromise) {
    return connectionPromise;
  }

  // Start new connection
  connectionPromise = (async () => {
    try {
      await client.connect();
      console.log("MongoDB client connected successfully");
      return client;
    } catch (error) {
      connectionPromise = null; // Reset on error so we can retry
      console.error("Failed to connect to MongoDB:", error);
      throw error;
    }
  })();

  return connectionPromise;
}

// Initialize connection globally on module load
// This ensures MongoDB is connected when the app starts
if (process.env.NODE_ENV !== "test") {
  // Start connection immediately (non-blocking)
  connectMongoClient().catch((error) => {
    console.error("MongoDB connection initialization error:", error);
  });
}

// mongodb db instance
export const db = client.db("grad-app");

// connect to mongodb (for mongoose)
export async function connectDB() {
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  return mongoose.connect(MONGODB_URI);
}
