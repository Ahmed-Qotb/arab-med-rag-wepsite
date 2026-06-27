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
    await connectMongoClient();

    const result = await auth.api.signInEmail({
      body: {
        email: values.email,
        password: values.password,
      },
      headers: await headers(),
    });

    return { data: result, error: null };
  } catch (error: any) {
    console.error("Sign in error:", error);
    return { data: null, error: "البريد الإلكتروني أو كلمة المرور غير صحيحة." };
  }
}


