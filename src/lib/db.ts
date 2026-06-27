import type { Db } from "mongodb";
import { MongoClient } from "mongodb";
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;
const globalForMongo = global as unknown as { mongoClient: MongoClient | undefined };

async function createAndConnect(): Promise<MongoClient> {
  const c = new MongoClient(MONGODB_URI, {
    serverSelectionTimeoutMS: 10_000,
    maxIdleTimeMS: 45_000,
  });
  await c.connect();
  globalForMongo.mongoClient = c;
  return c;
}

export async function connectMongoClient(): Promise<MongoClient> {
  const existing = globalForMongo.mongoClient;
  if ((existing as any)?.topology?.isConnected()) return existing;
  // Topology is closed or never opened — create a fresh client
  return createAndConnect();
}

// Live proxies: every property access always reads from the current active client.
// When connectMongoClient() replaces globalForMongo.mongoClient after a reconnect,
// auth.ts and all route handlers automatically use the new connection.
export const client: MongoClient = new Proxy({} as MongoClient, {
  get(_, prop) {
    const c = globalForMongo.mongoClient;
    if (!c) throw new Error("MongoDB not connected — call connectMongoClient() first");
    const val = (c as any)[prop];
    return typeof val === "function" ? val.bind(c) : val;
  },
});

export const db: Db = new Proxy({} as Db, {
  get(_, prop) {
    const c = globalForMongo.mongoClient;
    if (!c) throw new Error("MongoDB not connected — call connectMongoClient() first");
    const dbInstance = c.db("grad-app");
    const val = (dbInstance as any)[prop];
    return typeof val === "function" ? val.bind(dbInstance) : val;
  },
});

// Eagerly start connection on module load (non-blocking)
if (process.env.NODE_ENV !== "test") {
  createAndConnect().catch((e) => console.error("MongoDB initial connection error:", e));
}

export async function connectDB() {
  if (mongoose.connection.readyState >= 1) return mongoose.connection;
  return mongoose.connect(MONGODB_URI);
}
