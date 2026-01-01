"use client";
import React, { useState } from "react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import TeacherDetailsDrawer from "./TeacherDetailsDrawer";
import { Teacher } from "../../lib/adminApi";

type Props = {
  teachers: Teacher[];
  loading: boolean;
  error: string | null;
  total?: number;
  page?: number;
  pageSize?: number;
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

  // Drawer has been extracted to a separate component using shadcn Drawer.
  // Table no longer controls drawer state; consumers should render TeacherDetailsDrawer.
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
  if (!teachers || teachers.length === 0) {
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
            {teachers.map((t) => (
              <tr key={t.id} className="border-t hover:bg-slate-50">
                <td className="py-3">
                  <div className="flex items-center gap-3">
                    <button
                      aria-label="View teacher details"
                      title="View details"
                      onClick={() => openDrawer(t.id)}
                      className="rounded p-1 hover:bg-slate-100"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-slate-600"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M18 10c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8zM9 8a1 1 0 112 0v5a1 1 0 11-2 0V8zm1-3a1.25 1.25 0 100 2.5A1.25 1.25 0 0010 5z" />
                      </svg>
                    </button>
                    <div className="truncate font-medium text-slate-900">
                      {t.name ?? "-"}
                    </div>
                  </div>
                </td>
                <td className="py-3">{t.email ?? "-"}</td>
                <td className="py-3">{t.phone ?? "-"}</td>
                <td className="py-3">
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

      <div className="mt-4 flex items-center justify-between">
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

      {/* Drawer has been moved to a separate component: TeacherDetailsDrawer.
          Consumers should import and control it externally. */}
      <TeacherDetailsDrawer
        isOpen={isDrawerOpen}
        teacher={selectedTeacher}
        onClose={closeDrawer}
        onEdit={(id: string) => onEdit?.(id)}
        onResendInvite={(id: string) => onResendInvite?.(id)}
      />
    </Card>
  );
}

// Drawer is rendered above and controlled via state in this component.
