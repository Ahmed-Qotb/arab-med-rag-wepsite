"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { connectMongoClient } from "@/lib/db";

// Types
export type SignInInput = {
  email: string;
  password: string;
};

export async function signInWithEmail(values: SignInInput) {
  try {
    // Ensure MongoDB connection (idempotent - returns immediately if already connected)
    await connectMongoClient();

    // Request
    const result = await auth.api.signInEmail({
      body: {
        email: values.email,
        password: values.password,
      },
      headers: await headers(),
    });

    // Response
    return result;
  } catch (error: any) {
    // To handle error
    console.error("Sign in error:", error);
    const message =
      error?.message ?? "Failed to sign in. Please check your credentials.";
    throw new Error(message);
  }
}


