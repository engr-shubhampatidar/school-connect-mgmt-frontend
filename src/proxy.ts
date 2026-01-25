import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/login", "/register-school"];
const ROLE_ROUTES: Record<string, string> = {
  admin: "/admin/dashboard",
  teacher: "/teacher/dashboard",
  student: "/student/dashboard",
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("role")?.value;

  const cleanPath = pathname.replace(/\/$/, "");

  // 1️⃣ Not logged in → allow only public pages
  if (!token) {
    const isPublic = PUBLIC_ROUTES.some(
      (route) => cleanPath === route || cleanPath.startsWith(route + "/")
    );

    if (!isPublic) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
  }

  // 2️⃣ Logged in → block login & register
  if (token && ["/login", "/register-school"].includes(cleanPath)) {
    return NextResponse.redirect(
      new URL(ROLE_ROUTES[role || ""] || "/", request.url)
    );
  }

  // 3️⃣ Role-based access control
  if (role) {
    const allowedBase = ROLE_ROUTES[role || ""];

    const accessingOwn =
      cleanPath === allowedBase ||
      cleanPath.startsWith(allowedBase + "/");

    const accessingOtherRole = Object.values(ROLE_ROUTES).some(
      (route) =>
        route !== allowedBase &&
        (cleanPath === route || cleanPath.startsWith(route + "/"))
    );

    if (!accessingOwn && accessingOtherRole) {
      return NextResponse.redirect(
        new URL("/unauthorized", request.url)
      );
    }
  }
  return NextResponse.next();
}
