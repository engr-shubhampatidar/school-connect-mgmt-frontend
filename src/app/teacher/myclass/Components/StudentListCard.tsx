"use client";

import { Search, Filter } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";

/**
 * StudentListCard
 * - Displays a searchable, filterable list of students for the teacher's class
 * - `Student` type is intentionally small and only contains fields the UI needs
 */
export type Student = {
  rollNo: string;
  name: string;
  email: string;
  gender: string;
  status: "Active" | "Inactive";
  /** optional unique id used for routing */
  id?: string;
};

type StudentListCardProps = {
  students: Student[];
  onSearch?: (value: string) => void;
  onFilterClick?: () => void;
  onViewProfile?: (student: Student) => void;
};

export default function StudentListCard({
  students,
  onSearch,
  onFilterClick,
  onViewProfile,
}: StudentListCardProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStudents = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return students;
    return students.filter((s) => {
      const name = (s.name ?? "").toString().toLowerCase();
      const roll = (s.rollNo ?? "").toString().toLowerCase();
      return name.includes(q) || roll.includes(q);
    });
  }, [students, searchTerm]);

  // Navigate to student detail — prefer explicit `onViewProfile` if provided
  const handleView = (student: Student) => {
    if (onViewProfile) {
      onViewProfile(student);
      return;
    }
    const id = student.id ?? student.rollNo;
    if (!id) return;
    router.push(`/teacher/attendance/${id}`);
  };
  return (
    <div className="w-full rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Student List</h2>
          <p className="mt-1 text-sm text-slate-500">
            Manage Student Profile and status
          </p>
        </div>

        <div className="flex gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or email"
              value={searchTerm}
              onChange={(e) => {
                const v = e.target.value;
                setSearchTerm(v);
                onSearch?.(v);
              }}
              className="rounded-lg border border-slate-300 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-slate-500"
            />
          </div>

          {/* Filter */}
          <button
            onClick={onFilterClick}
            className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <Filter className="h-4 w-4" />
            Filters Status
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-t border-b border-slate-200 bg-white">
            <tr className="text-slate-700">
              <th className="px-6 py-3">Roll No.</th>
              <th className="px-6 py-3">Student Name</th>
              <th className="px-6 py-3">Gender</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredStudents.map((student, index) => (
              <tr
                key={index}
                className="border-b border-slate-100 hover:bg-slate-50"
              >
                <td className="px-6 py-4 font-medium">{student.rollNo}</td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-slate-200 flex items-center justify-center text-sm font-medium text-slate-600">
                      NA
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={() => handleView(student)}
                        className="text-left"
                      >
                        <p className="font-medium text-slate-900 cursor-pointer">
                          {student.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {student.email}
                        </p>
                      </button>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 capitalize">
                  {student.gender ?? "Not Sure"}
                </td>

                <td className="px-6 py-4">
                  <span className="rounded-full border border-slate-300 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">
                    {student.status ?? "Not Sure"}
                  </span>
                </td>

                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleView(student)}
                    className="text-sm font-medium text-slate-500 hover:text-slate-800 cursor-pointer"
                    type="button"
                  >
                    View Profile
                  </button>
                </td>
              </tr>
            ))}

            {filteredStudents.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-10 text-center text-slate-500"
                >
                  No students found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
