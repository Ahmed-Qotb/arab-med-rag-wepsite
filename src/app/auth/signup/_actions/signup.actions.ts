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
    await connectMongoClient();

    const result = await auth.api.signUpEmail({
      body: {
        name: values.name,
        email: values.email,
        password: values.password,
      },
      headers: await headers(),
    });

    return { data: result, error: null };
  } catch (error: any) {
    console.error("Sign up error:", error);
    const isEmailTaken = error?.message?.toLowerCase().includes("email");
    return {
      data: null,
      error: isEmailTaken
        ? "البريد الإلكتروني مستخدم بالفعل."
        : "حدث خطأ ما. يرجى المحاولة مرة أخرى.",
    };
  }
}


