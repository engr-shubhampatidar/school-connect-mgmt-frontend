"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import {
  StudentsFilterBar,
  type StudentsFilters,
  StudentsTable,
  StudentsPageSkeleton,
  useStudentsQuery,
  useInvalidateStudents,
  STUDENTS_PAGE_SIZE,
} from "@/modules/students";
import Button from "@/components/ui/Button";
import { type ClassItem, fetchClasses } from "@/modules/classes";
import { useRouter } from "next/navigation";

const CreateStudentDialog = dynamic(
  () => import("@/modules/students/components/CreateStudentDialog"),
  { ssr: false },
);

const UpdateStudentDialog = dynamic(
  () => import("@/modules/students/components/UpdateStudentDialog"),
  { ssr: false },
);

export default function AdminStudentsPage() {
  const router = useRouter();
  const { invalidateLists, invalidateDetail } = useInvalidateStudents();

  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<StudentsFilters>({});
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [creatingOpen, setCreatingOpen] = useState(false);
  const [classes, setClasses] = useState<ClassItem[]>([]);

  const query = {
    ...filters,
    page,
    pageSize: STUDENTS_PAGE_SIZE,
  };

  const { data, isLoading, isFetching, error, refetch } =
    useStudentsQuery(query);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const resp = await fetchClasses({ pageSize: 1000 });
        if (!mounted) return;
        setClasses(resp.classes ?? []);
      } catch {
        // keep empty class list
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleApply = useCallback((f: StudentsFilters) => {
    setFilters(f);
    setPage(1);
  }, []);

  const students = data?.students ?? [];
  const total = data?.total ?? 0;
  const errorMessage =
    error instanceof Error ? error.message : error ? "Failed to load students" : null;

  const isInitialLoad = isLoading && students.length === 0 && !errorMessage;

  if (isInitialLoad) {
    return <StudentsPageSkeleton />;
  }

  return (
    <div className="mx-auto px-4 py-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-[600] text-[#021034]">
            Total Students
          </h1>
          <p className="mt-1 text-[14px] text-[#737373]">
            Manage, Student Profiles, status and Enrollment
          </p>
        </div>

        <div>
          <Button variant="dark" onClick={() => setCreatingOpen(true)}>
            + Add Student
          </Button>
          {creatingOpen ? (
            <CreateStudentDialog
              open={creatingOpen}
              classes={classes}
              onClose={() => setCreatingOpen(false)}
              onCreated={() => {
                void invalidateLists();
              }}
            />
          ) : null}
        </div>
      </div>

      <div className="mb-4">
        <StudentsFilterBar
          classes={classes}
          initial={filters}
          onApply={handleApply}
        />
      </div>

      <StudentsTable
        students={students}
        loading={isFetching}
        error={errorMessage}
        total={total}
        page={page}
        pageSize={STUDENTS_PAGE_SIZE}
        onRetry={() => {
          void refetch();
        }}
        onPageChange={setPage}
        onView={(id) => router.push(`/admin/students/profile/${id}`)}
        onEdit={setEditingStudentId}
      />

      {editingStudentId ? (
        <UpdateStudentDialog
          open={Boolean(editingStudentId)}
          studentId={editingStudentId}
          onClose={() => setEditingStudentId(null)}
          onUpdated={() => {
            void invalidateLists();
            if (editingStudentId) {
              void invalidateDetail(editingStudentId);
            }
          }}
        />
      ) : null}
    </div>
  );
}
