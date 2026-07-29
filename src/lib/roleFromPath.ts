import type { Role } from "@/types/auth";

/** Derive portal role from the current pathname. */
export function roleFromPath(pathname: string | null | undefined): Role | null {
  if (!pathname) return null;
  if (pathname.startsWith("/admin")) return "admin";
  if (pathname.startsWith("/teacher")) return "teacher";
  if (pathname.startsWith("/student")) return "student";
  return null;
}
