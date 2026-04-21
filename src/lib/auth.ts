import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { client, db } from "@/lib/db";
import { nextCookies } from "better-auth/next-js";

// MongoDB connection is initialized globally in db.ts
// The connection is established on module load and is idempotent
export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),
  emailAndPassword: {
    enabled: true,
  },
  session: {
    cookieCache: {
      // Enables getSession in Next.js route handlers / server actions
      enabled: true,
    },
  },
  plugins: [nextCookies()],
  user: {
    deleteUser: {
      enabled: true,
    },
  },
});

