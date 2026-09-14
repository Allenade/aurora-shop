import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/bff/config";
import { unsealSessionEdge } from "@/lib/bff/session-edge";

function isPublicPath(pathname: string) {
  if (pathname === "/") return true;
  if (pathname.startsWith("/auth")) return true;
  if (pathname.startsWith("/api/auth/login")) return true;
  if (pathname.startsWith("/api/auth/register")) return true;
  if (pathname.startsWith("/api/auth/verify")) return true;
  if (pathname.startsWith("/api/auth/resend")) return true;
  if (pathname.startsWith("/api/auth/logout")) return true;
  if (pathname.startsWith("/_next")) return true;
  if (pathname.startsWith("/images")) return true;
  if (pathname === "/favicon.ico") return true;
  return false;
}

/**
 * Edge gate: require a valid sealed session (signature + expiry).
 * Admin routes additionally require typ=admin (Nest remains source of truth for data).
 */
export async function middleware(request: NextRequest) {
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

  const session = await unsealSessionEdge(token);
  if (!session) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const signIn = new URL("/auth/signin", request.url);
    signIn.searchParams.set("reason", "session_expired");
    if (pathname !== "/auth/signin") {
      signIn.searchParams.set("next", pathname);
    }
    const response = NextResponse.redirect(signIn);
    response.cookies.set(SESSION_COOKIE, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
    return response;
  }

  if (pathname.startsWith("/admin") && session.typ !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
