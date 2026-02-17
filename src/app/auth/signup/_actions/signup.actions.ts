"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { connectMongoClient } from "@/lib/db";

// Types
export type SignUpInput = {
  name: string;
  email: string;
  password: string;
};

export async function signUpWithEmail(values: SignUpInput) {
  try {
    // Ensure MongoDB connection (idempotent - returns immediately if already connected)
    await connectMongoClient();

    // Request
    const result = await auth.api.signUpEmail({
      body: {
        name: values.name,
        email: values.email,
        password: values.password,
      },
      headers: await headers(),
    });

    // Response
    return result;
  } catch (error: any) {
    // To handle error
    console.error("Sign up error:", error);
    const message =
      error?.message ?? "Failed to sign up. Please try again later.";
    throw new Error(message);
  }
}


