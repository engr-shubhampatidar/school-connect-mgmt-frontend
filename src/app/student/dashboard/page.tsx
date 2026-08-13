"use client";

import React from "react";
import Link from "next/link";
import {
  CalendarDays,
  ChevronRight,
  FileText,
  Megaphone,
  Clock,
} from "lucide-react";
import {
  getStudentDashboard,
  StudentDashboardSkeleton,
  type StudentDashboard,
} from "@/modules/students";
import { useToast } from "@/components/ui/use-toast";
import { AttendanceSummary } from "@/modules/dashboard";
import DocumentsGrid from "@/modules/documents/components/DocumentsGrid";
import { ensureSessionReady } from "@/modules/auth";
import Button from "@/components/ui/Button";
import { DOCUMENT_TYPES } from "@/modules/documents/constants";

function formatClassLabel(
  cls?: { name: string; section?: string | null } | null,
): string {
  if (!cls?.name) return "Not assigned";
  return cls.section ? `${cls.name} - ${cls.section}` : cls.name;
}

function docTypeLabel(value: string): string {
  return DOCUMENT_TYPES.find((t) => t.value === value)?.label ?? value;
}

export default function StudentDashboardPage() {
  const [dashboard, setDashboard] = React.useState<StudentDashboard | null>(
    null,
  );
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const { toast } = useToast();
  const toastRef = React.useRef(toast);

  React.useEffect(() => {
    toastRef.current = toast;
  }, [toast]);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await ensureSessionReady();
      const data = await getStudentDashboard();
      setDashboard(data);
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "message" in err
          ? String((err as { message?: unknown }).message ?? "Failed to load")
          : "Failed to load dashboard";
      setError(message);
      toastRef.current?.({
        title: "Error",
        description: message,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void load();
  }, [load]);

  if (loading) {
    return <StudentDashboardSkeleton />;
  }

  if (error && !dashboard) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-[#D7E3FC] bg-white p-8 text-center">
          <p className="text-sm text-slate-700 mb-4">{error}</p>
          <Button variant="dark" onClick={() => void load()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const displayName = dashboard?.profile?.fullName ?? "Student";
  const presentDays = dashboard?.presentDays ?? 0;
  const absentDays = dashboard?.absentDays ?? 0;
  const monthlyPercentage = dashboard?.attendancePercentage ?? 0;
  const timetable = dashboard?.timetable ?? [];
  const announcements = dashboard?.recentAnnouncements ?? [];
  const documents = dashboard?.documents?.items ?? [];
  const currentClass = dashboard?.currentClass ?? dashboard?.profile?.class;

  const documentItems = documents.map((doc) => ({
    id: doc.id,
    title: doc.originalName || doc.fileName || docTypeLabel(doc.documentType),
    type: docTypeLabel(doc.documentType),
    href: doc.url,
  }));

  return (
    <div className="p-6 bg-[#F5F9FF] min-h-full">
      <section className="pl-2 mb-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-[20px] lg:text-[24px] text-[#021034] font-[600]">
              Welcome, {displayName}
            </h1>
            <p className="mt-1 text-[12px] lg:text-sm text-[#737373]">
              {formatClassLabel(currentClass)}
              {dashboard?.profile?.studentCode
                ? ` · ${dashboard.profile.studentCode}`
                : ""}
            </p>
          </div>
          <Link
            href="/student/profile"
            className="inline-flex items-center gap-1 text-sm text-[#737373] hover:text-blue-600 transition"
          >
            View profile
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
        <div className="col-span-2 space-y-6">
          <div className="rounded-xl border border-[#D7E3FC] bg-white overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#D7E3FC]">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#021034]" />
                <h2 className="text-lg font-semibold text-[#021034]">
                  Timetable preview
                </h2>
              </div>
              <Link
                href="/student/timetable"
                className="text-sm text-[#737373] hover:text-blue-600 transition inline-flex items-center gap-1"
              >
                Full timetable
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            {timetable.length === 0 ? (
              <div className="px-6 py-10 text-sm text-slate-500 text-center">
                No timetable available yet.
              </div>
            ) : (
              timetable.slice(0, 6).map((item, index) => (
                <div
                  key={`${item.subject}-${item.startTime}-${index}`}
                  className="flex items-center justify-between px-[8px] py-[16px] lg:px-6 lg:py-4 border-b border-[#D7E3FC] last:border-b-0"
                >
                  <div className="space-y-1">
                    <p className="font-medium text-[#021034]">
                      {item.subject ?? "Class"}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 lg:gap-4 text-sm text-[#737373]">
                      <span>
                        {item.startTime ?? "-"}
                        {item.endTime ? `–${item.endTime}` : ""}
                      </span>
                      {(item.subjectTeacher ||
                        item.teacher ||
                        item.teacherName) && (
                        <span>
                          {item.subjectTeacher ??
                            item.teacher ??
                            item.teacherName}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="rounded-full border border-[#D7E3FC] bg-blue-50 px-4 py-1 text-xs font-semibold text-[#021034]">
                    {item.room ?? "—"}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="rounded-xl border border-[#D7E3FC] bg-white overflow-hidden">
            <div className="flex items-start justify-between px-6 py-4">
              <div className="flex items-start gap-2">
                <Megaphone className="h-4 w-4 mt-1 text-[#021034]" />
                <div>
                  <h2 className="text-lg font-semibold text-[#021034]">
                    Recent announcements
                  </h2>
                  <p className="text-sm text-[#737373]">
                    Latest updates from your school and class.
                  </p>
                </div>
              </div>
              <Link
                href="/student/announcements"
                className="text-sm text-[#737373] hover:text-blue-600 transition inline-flex items-center gap-1"
              >
                View all
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="border-t border-[#D7E3FC]" />
            {announcements.length === 0 ? (
              <div className="px-6 py-8 text-sm text-slate-500 text-center">
                No announcements yet.
              </div>
            ) : (
              <ul className="divide-y divide-[#D7E3FC]">
                {announcements.map((a) => (
                  <li key={a.id} className="px-6 py-4">
                    <p className="font-medium text-[#021034]">{a.title}</p>
                    <p className="mt-1 text-sm text-[#737373] line-clamp-2">
                      {a.body}
                    </p>
                    <p className="mt-2 text-xs text-slate-400">
                      {a.publishedAt
                        ? new Date(a.publishedAt).toLocaleString()
                        : ""}
                      {a.authorName ? ` · ${a.authorName}` : ""}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="w-full space-y-6">
          <AttendanceSummary
            presentDays={presentDays}
            absentDays={absentDays}
            monthlyPercentage={monthlyPercentage}
          />

          <div className="rounded-xl border border-[#D7E3FC] bg-white p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-[#021034]" />
                <h2 className="font-semibold text-[#021034]">Quick links</h2>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { href: "/student/fees", label: "Fees" },
                { href: "/student/exams", label: "Exams" },
                { href: "/student/homework", label: "Homework" },
                { href: "/student/documents", label: "Documents" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-lg border border-[#D7E3FC] bg-[#F5F9FF] px-3 py-3 text-center text-sm font-medium text-[#021034] hover:bg-blue-50 transition"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-2">
        <div className="flex items-center justify-between mt-6 mb-[-8px] px-1 relative z-10">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-[#021034]" />
            <span className="text-sm text-[#737373]">
              {dashboard?.documents?.count ?? documentItems.length} document
              {(dashboard?.documents?.count ?? documentItems.length) === 1
                ? ""
                : "s"}
            </span>
          </div>
          <Link
            href="/student/documents"
            className="text-sm text-[#737373] hover:text-blue-600 transition inline-flex items-center gap-1"
          >
            All documents
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        {documentItems.length === 0 ? (
          <div className="w-full rounded-xl border border-[#D7E3FC] bg-white p-8 mt-6 text-center text-sm text-slate-500">
            No documents uploaded yet.
          </div>
        ) : (
          <DocumentsGrid title="Recent documents" documents={documentItems} />
        )}
      </div>
    </div>
  );
}
