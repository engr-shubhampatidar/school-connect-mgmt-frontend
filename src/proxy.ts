import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = [ "/login", "/register-school"];

const ROLE_ROUTES: Record<string, string> = {
  admin: "/admin/dashboard",
  teacher: "/teacher/dashboard", 
  student: "/student/dashboard",
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ✅ Ignore Next.js internals & static files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/api")
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("role")?.value;

  const cleanPath =
  pathname === "/" ? "/" : pathname.replace(/\/$/, "");

  /* ---------------- NOT LOGGED IN ---------------- */
  if (!token) {
    const isPublic = PUBLIC_ROUTES.some(
      (route) =>
        cleanPath === route || cleanPath.startsWith(route + "/")
    );

    // 🚨 allow login/register WITHOUT redirect
    if (isPublic) {
      return NextResponse.next();
    }

    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }

  /* ---------------- LOGGED IN ---------------- */
  if (token && PUBLIC_ROUTES.includes(cleanPath)) {
    return NextResponse.redirect(
      new URL(ROLE_ROUTES[role ?? ""] ?? "/", request.url)
    );
  }

  /* ---------------- ROLE GUARD ---------------- */
  if (role && ROLE_ROUTES[role]) {
    const allowedBase = ROLE_ROUTES[role];

    const isOwnRoute =
      cleanPath === allowedBase ||
      cleanPath.startsWith(allowedBase + "/");

    const isOtherRoleRoute = Object.values(ROLE_ROUTES).some(
      (route) =>
        route !== allowedBase &&
        (cleanPath === route ||
          cleanPath.startsWith(route + "/"))
    );

    if (!isOwnRoute && isOtherRoleRoute) {
      return NextResponse.redirect(
        new URL("/unauthorized", request.url)
      );
    }
  }

  return NextResponse.next();
}

/* ✅ CRITICAL: matcher */
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
