import { redirect } from "next/navigation";

/** Legacy URL — redirects to canonical class attendance history. */
export default function LegacyAttendanceHistoryRedirect() {
  redirect("/teacher/class/attendance-history");
}
