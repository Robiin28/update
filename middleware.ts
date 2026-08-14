import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, verifySessionToken } from "./app/lib/adminAuth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthed = await verifySessionToken(request.cookies.get(ADMIN_COOKIE)?.value);

  if (pathname.startsWith("/api/admin")) {
    if (pathname === "/api/admin/login" || isAuthed) return NextResponse.next();
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login" || isAuthed) return NextResponse.next();
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
