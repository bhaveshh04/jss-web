import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySession } from "./lib/jwt";

// Route prefixes that only the OWNER role may reach. Every /portal/* route
// still requires a valid session at minimum; this list narrows it further.
const OWNER_ONLY_PREFIXES = [
  "/portal/employees",
  "/portal/settings/office",
  "/portal/attendance/export",
  "/portal/website",
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySession(token) : null;

  if (!session) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const isOwnerOnly = OWNER_ONLY_PREFIXES.some((p) => pathname.startsWith(p));
  if (isOwnerOnly && session.role !== "OWNER") {
    return NextResponse.redirect(new URL("/portal", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/portal/:path*"],
};
