import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  // Allow access to sign-in, sign-up, and root pages without token
  if (!token && (url.pathname === "/" || url.pathname.startsWith("/sign-in") || url.pathname.startsWith("/sign-up"))) {
    return NextResponse.next();
  }

  // Redirect to dashboard if token exists and trying to access sign-in, sign-up, or verify pages
  if (
    token &&
    (url.pathname.startsWith("/sign-in") ||
      url.pathname.startsWith("/sign-up") ||
      url.pathname.startsWith("/verify"))
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Allow access to home page without token
  if (!token && url.pathname.startsWith("/home")) {
    return NextResponse.next();
  }

  // Redirect to sign-in if no token is found for other pages
  if (!token) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Allow access to other pages with token
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/sign-in",
    "/sign-up",
    "/",
    "/home",
    "/dashboard/:path*",
    "/verify/:path*",
    "/verify", // Ensure the `/verify` path is matched
  ],
};