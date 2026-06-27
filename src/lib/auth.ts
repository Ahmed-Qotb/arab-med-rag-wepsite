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
      enabled: true,
      maxAge: 60,
    },
  },
  plugins: [nextCookies()],
  user: {
    deleteUser: {
      enabled: true,
    },
  },
});

