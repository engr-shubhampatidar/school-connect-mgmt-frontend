"use client";

import { Search, ChevronDown, Users } from "lucide-react";

export type AssignedSubject = {
  className: string;
  section: string;
  subject: string;
  studentCount: number;
};

type AssignedSubjectsCardProps = {
  subjects: AssignedSubject[];
//   onSearch?: (value: string) => void;
//   onClassFilter?: () => void;
//   onSubjectFilter?: () => void;
//   onViewStudents?: (item: AssignedSubject) => void;
//   onEnterMarks?: (item: AssignedSubject) => void;
};

export default function AssignedSubjectsCard({
  subjects,
//   onClassFilter,
//   onSubjectFilter,
//   onViewStudents,
//   onEnterMarks,
}: AssignedSubjectsCardProps) {
  return (
    <div className="w-full rounded-lg border border-slate-200 bg-white shadow-sm">
      {/* Top Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6">
        {/* Search */}
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or email"
            onChange={(e) => (e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-slate-500"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-3">
          <button
            // onClick={onClassFilter}
            className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            All Class <ChevronDown className="h-4 w-4" />
          </button>

          <button
            // onClick={onSubjectFilter}
            className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            All Subjects <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="px-6 pb-4">
        <h2 className="text-lg font-semibold text-slate-900">
          Assigned Subjects
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Manage your teaching assignment and mark entry
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-t border-b border-slate-200 text-slate-700">
            <tr>
              <th className="px-6 py-3 text-left">Class & Section</th>
              <th className="px-6 py-3 text-left">Subject Name</th>
              <th className="px-6 py-3 text-left">Student Count</th>
              <th className="px-6 py-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {subjects.map((item, index) => (
              <tr
                key={index}
                className="border-b border-slate-100 hover:bg-slate-50"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-900">
                      {item.className}
                    </span>
                    <span className="rounded-full border border-slate-300 bg-slate-50 px-2 py-0.5 text-xs text-slate-700">
                      {item.section}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4 font-medium text-slate-900">
                  {item.subject}
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Users className="h-4 w-4 text-slate-400" />
                    {item.studentCount} Students
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-4">
                    <button
                    //   onClick={() => onViewStudents?.(item)}
                      className="text-sm text-slate-500 hover:text-slate-800"
                    >
                      View Students
                    </button>

                    <button
                    //   onClick={() => onEnterMarks?.(item)}
                      className="rounded-lg border border-slate-300 bg-slate-50 px-4 py-1.5 text-sm font-medium text-slate-900 hover:bg-slate-100"
                    >
                      Enter Marks
                    </button>
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
