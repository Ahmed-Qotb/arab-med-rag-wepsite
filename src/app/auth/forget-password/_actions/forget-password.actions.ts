"use server";

import { auth } from "@/lib/auth";

// Types
export type ForgetPasswordInput = {
  email: string;
};

export async function requestPasswordResetAction(values: ForgetPasswordInput) {
  try {
    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    // Request
    const result = await auth.api.requestPasswordReset({
      body: {
        email: values.email,
        redirectTo: `${appUrl}/auth/reset-password`,
      },
    });

    // Response
    return result;
  } catch (error: any) {
    // To handle error
    const message =
      error?.message ??
      "Failed to request password reset. Please try again later.";
    throw new Error(message);
  }
}


