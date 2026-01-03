"use client";
import React, { useState } from "react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import TeacherDetailsDrawer from "./TeacherDetailsDrawer";
import { Teacher } from "../../lib/adminApi";
import Image from "next/image";

// TeachersTable
// - Renders the teachers list with loading skeleton and empty state
// - Handles pagination controls and delegates edit/resend actions via callbacks
// - Shows a details drawer when a teacher row is opened

type Props = {
  teachers: Teacher[];
  loading: boolean;
  error: string | null;
  total?: number;
  page?: number;
  pageSize?: number;
  onRetry?: () => void;
  onPageChange: (page: number) => void;
  onEdit?: (id: string) => void;
  onResendInvite?: (id: string) => void;
};

export default function TeachersTable({
  teachers,
  loading,
  total = 0,
  page = 1,
  pageSize = 10,
  onPageChange,
  onEdit,
  onResendInvite,
}: Props) {
  const totalPages = Math.max(
    1,
    Math.ceil((total || teachers.length) / pageSize)
  );

  // Drawer state is local: open a teacher's details from the table row.
  // The actual drawer component is a separate file (`TeacherDetailsDrawer`).
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  function openDrawer(id: string) {
    const t = teachers.find((x) => x.id === id) ?? null;
    setSelectedTeacher(t);
    setIsDrawerOpen(true);
  }

  function closeDrawer() {
    setIsDrawerOpen(false);
    setSelectedTeacher(null);
  }

  if (loading) {
    return (
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="sticky top-0 bg-white">
              <tr>
                <th className="text-left py-2">Name</th>
                <th className="text-left py-2">Email</th>
                <th className="text-left py-2">Phone</th>
                <th className="text-left py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: pageSize }).map((_, i) => (
                <tr key={i} className="border-t">
                  <td className="py-3">
                    <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
                  </td>
                  <td className="py-3">
                    <div className="h-4 w-48 animate-pulse rounded bg-slate-200" />
                  </td>
                  <td className="py-3">
                    <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />
                  </td>
                  <td className="py-3">
                    <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
                  </td>
                  <td className="py-3">
                    <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
                  </td>
                  <td className="py-3">
                    <div className="h-8 w-24 animate-pulse rounded bg-slate-200" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    );
  }
  // Empty state when there are no teachers to show
  if (!teachers || teachers.length === 0) {
    // Main table rendering
    return (
      <Card>
        <div className="text-center">
          <h3 className="text-lg font-medium text-slate-900">
            No teachers found
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            Try adjusting filters or add a new teacher.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="rounded-lg bg-white border border-[#D7E3FC] ">
      <div className="overflow-x-auto ">
        <table className="w-full table-auto ">
          <thead className="sticky top-0  ">
            <tr>
              <th className="text-left py-4 pl-6 w-48 hidden lg:table-cell">
                Id No.
              </th>
              <th className="text-left py-4 ">Teacher Name</th>
              <th className="text-left py-4 hidden lg:table-cell">
                Assigned Class
              </th>
              <th className="text-left py-4 hidden lg:table-cell">Subject</th>
              <th className="text-right py-4 pr-10">Actions</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((t) => (
              <tr
                key={t.id}
                className="border-t border-[#D7E3FC] text-[#021034] text-[14px] font-[500] hover:bg-slate-50"
              >
                <td className="py-3 hidden lg:table-cell p-6">{"ad-01234"}</td>
                <td className="py-3">
                  <div className="flex items-center gap-3">
                    <button
                      aria-label="View teacher details"
                      title="View details"
                      onClick={() => openDrawer(t.id)}
                    >
                      <div className="font-medium text-slate-900 flex items-center gap-3 cursor-pointer">
                        <div className="w-12 h-12">
                          <Image
                            src={
                              "https://i.pinimg.com/736x/2a/bd/c4/2abdc427589317e312e55100ac612ace.jpg"
                            }
                            alt="Avatar"
                            width={72}
                            height={72}
                            className="rounded-full h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex flex-col text-left">
                          <div className="text-[14px]">
                            {t.user?.fullName ?? t.name ?? "-"}
                          </div>
                          <div className="text-[12px] text-[#737373]">
                            {t.user?.email ?? t.email ?? "-"}
                          </div>
                        </div>
                      </div>
                    </button>
                  </div>
                </td>
                <td className="py-3 hidden lg:table-cell">
                  {t.classTeacher?.name
                    ? `${t.classTeacher.name}${
                        t.classTeacher.section
                          ? " - " + t.classTeacher.section
                          : ""
                      }`
                    : t.classes && t.classes.length
                    ? `${t.classes[0].className}${
                        t.classes[0].classSection
                          ? " - " + t.classes[0].classSection
                          : ""
                      }`
                    : "-"}
                </td>
                <td className="py-3 hidden lg:table-cell">
                  {t.subjects ?? "-"}
                </td>
                <td className="py-3 flex justify-end pr-6">
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        const name = t.name ?? "-";
                        window.alert(`Edit clicked for ${name}`);
                        onEdit?.(t.id);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        const name = t.name ?? "-";
                        window.alert(`Resend Invite clicked for ${name}`);
                        onResendInvite?.(t.id);
                      }}
                    >
                      Resend Invite
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination and summary */}
      <div className="mt-4 flex items-center justify-between px-6 pb-4">
        <div className="text-sm text-slate-600">
          Showing {teachers.length} of {total ?? teachers.length}
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => onPageChange(Math.max(1, (page || 1) - 1))}
            disabled={(page || 1) <= 1}
          >
            Previous
          </Button>
          <div className="text-sm text-slate-700">
            Page {page} / {totalPages}
          </div>
          <Button
            onClick={() => onPageChange(Math.min(totalPages, (page || 1) + 1))}
            disabled={(page || 1) >= totalPages}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Details drawer: displays the selected teacher and exposes edit/resend callbacks */}
      <TeacherDetailsDrawer
        isOpen={isDrawerOpen}
        teacher={selectedTeacher}
        onClose={closeDrawer}
        onEdit={(id: string) => onEdit?.(id)}
        onResendInvite={(id: string) => onResendInvite?.(id)}
      />
    </div>
  );
}

// Drawer is rendered above and controlled via state in this component.
