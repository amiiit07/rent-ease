import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

function getJwtSecret() {
  const value = process.env.JWT_SECRET;

  if (!value) {
    throw new Error("JWT_SECRET is required");
  }

  return new TextEncoder().encode(value);
}

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/admin/login") {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname === "/admin") {
    return NextResponse.next();
  }

  const token = request.cookies.get("rent-mojo-token")?.value;

  if (token) {
    try {
      const verified = await jwtVerify(token, getJwtSecret());
      if (verified.payload.role === "ADMIN") {
        return NextResponse.next();
      }
    } catch {
      // Invalid or expired token, fall through to redirect.
    }
  }

  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("next", request.nextUrl.pathname);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/dashboard/:path*"],
};