"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useParentChildrenQuery } from "@/modules/parent-portal/hooks/useParentPortal";
import {
  formatClassLabel,
  RELATIONSHIP_LABELS,
} from "@/modules/parent-portal/components/PortalState";

const CHILD_SECTIONS = [
  "profile",
  "attendance",
  "timetable",
  "homework",
  "fees",
  "exams",
  "announcements",
  "documents",
] as const;

function pathForChild(pathname: string, fromId: string, toId: string): string {
  const base = `/parent/children/${fromId}`;
  if (!pathname.startsWith(base)) {
    return `/parent/children/${toId}`;
  }
  const rest = pathname.slice(base.length);
  const segment = rest.split("/").filter(Boolean)[0];
  if (segment && (CHILD_SECTIONS as readonly string[]).includes(segment)) {
    return `/parent/children/${toId}/${segment}`;
  }
  return `/parent/children/${toId}`;
}

export default function ChildSwitcher({
  studentId,
}: {
  studentId: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: children = [], isLoading } = useParentChildrenQuery();

  if (isLoading) {
    return (
      <div className="h-10 w-full max-w-sm animate-pulse rounded-md bg-slate-100" />
    );
  }

  if (children.length === 0) {
    return (
      <p className="text-sm text-slate-600">
        No children linked.{" "}
        <Link href="/parent/children" className="text-blue-700 hover:underline">
          View children
        </Link>
      </p>
    );
  }

  const current = children.find((c) => c.id === studentId);

  return (
    <div className="flex flex-wrap items-end gap-3">
      <label className="flex min-w-[220px] flex-1 flex-col gap-1 text-sm">
        <span className="font-medium text-slate-600">Viewing child</span>
        <select
          className="rounded-md border border-[#D7E3FC] bg-white px-3 py-2 text-sm text-[#021034]"
          value={studentId}
          onChange={(e) => {
            const nextId = e.target.value;
            if (!nextId || nextId === studentId) return;
            router.push(pathForChild(pathname, studentId, nextId));
          }}
        >
          {children.map((child) => (
            <option key={child.id} value={child.id}>
              {child.fullName}
              {child.studentCode ? ` (${child.studentCode})` : ""}
            </option>
          ))}
        </select>
      </label>
      {current ? (
        <div className="pb-2 text-sm text-slate-500">
          {formatClassLabel(current.className, current.section)}
          {" · "}
          {RELATIONSHIP_LABELS[current.relationship] ?? current.relationship}
        </div>
      ) : (
        <div className="pb-2 text-sm text-amber-700">
          This student is not linked to your account.
        </div>
      )}
    </div>
  );
}
