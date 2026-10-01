import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE_NAME = "ifelse_session";
const SECRET_KEY = new TextEncoder().encode(
  process.env.BETTER_AUTH_SECRET || "ifelse-lms-super-secret-key-32-chars-minimum-token"
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  // Paths requiring authentication
  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isStudioRoute = pathname.startsWith("/studio");
  const isAdminRoute = pathname.startsWith("/admin");
  const isAuthRoute = pathname.startsWith("/auth");

  let user: { id: string; email: string; role: string } | null = null;

  if (token) {
    try {
      const { payload } = await jwtVerify(token, SECRET_KEY);
      user = {
        id: payload.id as string,
        email: payload.email as string,
        role: payload.role as string,
      };
    } catch {
      // Token is invalid/expired
      user = null;
    }
  }

  // Redirect authenticated users away from /auth/signin to /dashboard
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Protect /dashboard
  if (isDashboardRoute && !user) {
    const signInUrl = new URL("/auth/signin", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Protect /studio (Instructors and Admins only)
  if (isStudioRoute) {
    if (!user) {
      const signInUrl = new URL("/auth/signin", request.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }
    if (user.role !== "INSTRUCTOR" && user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard?error=unauthorized_studio", request.url));
    }
  }

  // Protect /admin (Admins only)
  if (isAdminRoute) {
    if (!user) {
      const signInUrl = new URL("/auth/signin", request.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }
    if (user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard?error=unauthorized_admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/studio/:path*",
    "/admin/:path*",
    "/auth/:path*",
  ],
};
