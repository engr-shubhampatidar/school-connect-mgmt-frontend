"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin/exams", label: "Dashboard", exact: true },
  { href: "/admin/exams/list", label: "Exams" },
];

type Props = {
  examId?: string;
};

export function ExamSubnav({ examId }: Props) {
  const pathname = usePathname();

  const examLinks = examId
    ? [
        { href: `/admin/exams/${examId}/schedule`, label: "Schedule" },
        { href: `/admin/exams/${examId}/marks`, label: "Marks" },
        { href: `/admin/exams/${examId}/results`, label: "Results" },
        { href: `/admin/exams/${examId}/report-cards`, label: "Report cards" },
        { href: `/admin/exams/${examId}/class-report`, label: "Class report" },
      ]
    : [];

  const all = [...links, ...examLinks];

  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {all.map((link) => {
        const exact = "exact" in link && link.exact;
        const active = exact
          ? pathname === link.href
          : pathname === link.href || pathname.startsWith(`${link.href}/`);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-md px-3 py-1.5 text-sm font-medium ${
              active
                ? "bg-[#DBEAFE] text-[#021034]"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}
