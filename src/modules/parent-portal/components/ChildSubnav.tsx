"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { label: "Overview", href: "" },
  { label: "Profile", href: "/profile" },
  { label: "Attendance", href: "/attendance" },
  { label: "Timetable", href: "/timetable" },
  { label: "Homework", href: "/homework" },
  { label: "Fees", href: "/fees" },
  { label: "Exams", href: "/exams" },
  { label: "Announcements", href: "/announcements" },
  { label: "Documents", href: "/documents" },
] as const;

export default function ChildSubnav({ studentId }: { studentId: string }) {
  const pathname = usePathname();
  const base = `/parent/children/${studentId}`;

  return (
    <nav className="mb-6 flex flex-wrap gap-2 border-b border-[#D7E3FC] pb-3">
      {LINKS.map((link) => {
        const href = `${base}${link.href}`;
        const isOverview = link.href === "";
        const active = isOverview
          ? pathname === base || pathname === `${base}/`
          : pathname === href || pathname.startsWith(`${href}/`);

        return (
          <Link
            key={link.label}
            href={href}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
              active
                ? "bg-[#DBEAFE] text-[#021034]"
                : "border border-transparent text-slate-600 hover:bg-slate-50"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
