import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Unauthenticated-accessible routes (exact or prefix). */
const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/register-school",
  "/contact",
  "/unauthorized",
];

/** Dashboard redirect targets after login when hitting a public auth page. */
const ROLE_DASHBOARDS: Record<string, string> = {
  admin: "/admin/dashboard",
  teacher: "/teacher/dashboard",
  student: "/student/dashboard",
};

/** Role → allowed path prefix (not just dashboard). */
const ROLE_PREFIXES: Record<string, string> = {
  admin: "/admin",
  teacher: "/teacher",
  student: "/student",
};

function isPublicPath(cleanPath: string): boolean {
  return PUBLIC_ROUTES.some(
    (route) => cleanPath === route || cleanPath.startsWith(route + "/"),
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignore Next.js internals & static files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/api")
  ) {
    return NextResponse.next();
  }

  // Session flag cookie (not the JWT) — set by client auth on login/refresh
  const hasSession =
    request.cookies.get("sc_session")?.value === "1" ||
    // legacy fallback during rollout
    Boolean(request.cookies.get("token")?.value);
  const role = request.cookies.get("role")?.value;

  const cleanPath = pathname === "/" ? "/" : pathname.replace(/\/$/, "");

  /* ---------------- NOT LOGGED IN ---------------- */
  if (!hasSession) {
    if (isPublicPath(cleanPath)) {
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL("/login", request.url));
  }

  /* ---------------- LOGGED IN on auth/landing pages ---------------- */
  const authLandingExact = ["/", "/login", "/register-school"];
  if (hasSession && authLandingExact.includes(cleanPath)) {
    return NextResponse.redirect(
      new URL(ROLE_DASHBOARDS[role ?? ""] ?? "/", request.url),
    );
  }

  /* ---------------- ROLE GUARD (prefix-based) ---------------- */
  if (role && ROLE_PREFIXES[role]) {
    const allowedPrefix = ROLE_PREFIXES[role];

    const isOwnRoute =
      cleanPath === allowedPrefix ||
      cleanPath.startsWith(allowedPrefix + "/");

    const isOtherRoleRoute = Object.values(ROLE_PREFIXES).some(
      (prefix) =>
        prefix !== allowedPrefix &&
        (cleanPath === prefix || cleanPath.startsWith(prefix + "/")),
    );

    if (!isOwnRoute && isOtherRoleRoute) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  return NextResponse.next();
}

/* CRITICAL: matcher */
export const config = {
  matcher: ["/((?!_next/static|_next/images|favicon.ico).*)"],
};
