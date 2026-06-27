import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { connectMongoClient } from "@/lib/db";

export async function requireAuth() {
  await connectMongoClient();

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new AuthError("Unauthorized");
  }

  return session.user;
}

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

export function handleApiError(error: unknown): NextResponse {
  console.error("API Error:", error);

  if (error instanceof AuthError) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}
