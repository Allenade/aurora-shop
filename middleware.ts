import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/bff/config";

function isPublicPath(pathname: string) {
  if (pathname === "/") return true;
  if (pathname.startsWith("/auth")) return true;
  if (pathname.startsWith("/api/auth/login")) return true;
  if (pathname.startsWith("/api/auth/logout")) return true;
  if (pathname.startsWith("/_next")) return true;
  if (pathname.startsWith("/images")) return true;
  if (pathname === "/favicon.ico") return true;
  return false;
}

/**
 * Edge-safe gate: require the httpOnly session cookie.
 * Signature/expiry are validated in Node (getCurrentUser / API routes).
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const signIn = new URL("/auth/signin", request.url);
    signIn.searchParams.set("next", pathname);
    return NextResponse.redirect(signIn);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
