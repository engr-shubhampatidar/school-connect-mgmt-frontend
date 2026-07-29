"use client";

import { Users, Search, ChevronDown } from "lucide-react";
import type { AssignedSubject as ApiAssignedSubject } from "@/modules/teachers/api/portal";

/** UI view-model for the assigned subjects table. */
export type AssignedSubjectView = {
  classSection: string;
  subjectName: string;
  studentCount: number;
  className?: string;
  section?: string;
};

export function mapAssignedSubjects(
  subjects: ApiAssignedSubject[],
): AssignedSubjectView[] {
  return subjects.map((s) => ({
    classSection: `${s.class}-${s.section}`,
    className: s.class,
    section: s.section,
    subjectName: s.subject,
    studentCount: s.totalStudents,
  }));
}

type AssignedSubjectsCardProps = {
  title?: string;
  subtitle?: string;
  subjects: AssignedSubjectView[];
  /** Show search + filter controls (subject page). */
  showFilters?: boolean;
  onExport?: () => void;
  onViewStudents?: (item: AssignedSubjectView) => void;
  onEnterMarks?: (item: AssignedSubjectView) => void;
  onSearch?: (value: string) => void;
};

export default function AssignedSubjectsCard({
  title = "Assigned Subjects",
  subtitle = "Manage your teaching assignment and mark entry",
  subjects,
  showFilters = false,
  onExport,
  onViewStudents,
  onEnterMarks,
  onSearch,
}: AssignedSubjectsCardProps) {
  return (
    <div className="w-full rounded-[8px] border border-[#D7E3FC] bg-white">
      {showFilters && (
        <div className="flex flex-wrap items-center justify-between gap-4 p-6 border-b border-[#D7E3FC]">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or email"
              onChange={(e) => onSearch?.(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-slate-500"
            />
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              All Class <ChevronDown className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              All Subjects <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <div className="flex items-start justify-between border-b p-6">
        <div>
          <h2 className="text-[24px] font-[600] text-[#021034]">{title}</h2>
          <p className="text-[14px] font-[400] text-[#737373]">{subtitle}</p>
        </div>

        {onExport && (
          <button
            type="button"
            onClick={onExport}
            className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            + Export Report
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b text-slate-600">
            <tr>
              <th className="px-6 py-3 font-[500] text-[14px] text-[#021034]">
                Class & Section
              </th>
              <th className="px-6 py-3 font-[500] text-[14px] text-[#021034]">
                Subject Name
              </th>
              <th className="px-6 py-3 font-[500] text-[14px] text-[#021034]">
                Student Count
              </th>
              <th className="px-6 py-3 font-[500] text-[14px] text-[#021034] text-right">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {subjects.map((item, index) => (
              <tr key={index} className="border-b last:border-none">
                <td className="px-6 py-4">
                  {item.className && item.section ? (
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900">
                        {item.className}
                      </span>
                      <span className="rounded-full border border-[#D7E3FC] px-[8px] py-[2px] text-[12px] font-[500] text-[#020617]">
                        {item.section}
                      </span>
                    </div>
                  ) : (
                    <span className="rounded-full border border-[#D7E3FC] px-[8px] py-[2px] text-[12px] font-[500] text-[#020617]">
                      {item.classSection}
                    </span>
                  )}
                </td>

                <td className="px-6 py-4 font-[500] text-[14px] text-[#020617]">
                  {item.subjectName}
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-[14px] text-[#737373]">
                    <Users size={16} />
                    <span className="text-[#020617] font-[500]">
                      {item.studentCount}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => onViewStudents?.(item)}
                      className="text-sm font-medium text-[#737373] hover:text-slate-700"
                    >
                      View Students
                    </button>

                    {onEnterMarks && (
                      <button
                        type="button"
                        onClick={() => onEnterMarks(item)}
                        className="rounded-lg border border-slate-200 px-4 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
                      >
                        Enter Marks
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}

            {subjects.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-10 text-center text-slate-500"
                >
                  No assigned subjects found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
