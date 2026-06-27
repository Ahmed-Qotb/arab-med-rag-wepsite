import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";

const publicAuthPages = ["/auth/signin", "/auth/signup", "/auth/forget-password"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Let Better Auth handle its own routes
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  const session = await auth.api.getSession({
    headers: {
      cookie: request.headers.get("cookie") || "",
    },
  });

  const isAuthenticated = !!session?.user;

  // API routes: return 401 JSON instead of redirecting
  if (pathname.startsWith("/api/")) {
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  const isAuthPage = publicAuthPages.some((page) => pathname.startsWith(page));

  if (isAuthPage) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/chat", request.url));
    }
    return NextResponse.next();
  }

  if (!isAuthenticated) {
    const signInUrl = new URL("/auth/signin", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
