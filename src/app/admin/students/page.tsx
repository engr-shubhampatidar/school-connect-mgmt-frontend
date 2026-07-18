"use client";
import UpdateStudentDialog from "@/components/admin/UpdateStudentDialog";
// import StudentDetailsDrawer from "@/components/admin/StudentDetailsDrawer";
import { useCallback, useEffect, useRef, useState } from "react";
import CreateStudentDialog from "../../../components/admin/CreateStudentDialog";
import StudentsFilterBar, {
  StudentsFilters,
} from "../../../components/admin/StudentsFilterBar";
import StudentsTable from "../../../components/admin/StudentsTable";
import Button from "../../../components/ui/Button";
import {
  ClassItem,
  fetchClasses,
  fetchStudents,
  Student,
  StudentsQuery,
} from "../../../lib/adminApi";
import { useRouter } from "next/navigation";

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);
  // const [open, setOpen] = useState(false);

  const router = useRouter();

  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);

  const [filters, setFilters] = useState<StudentsFilters>({});
  const initialMountRef = useRef(true);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);

  const load = useCallback(async (q: StudentsQuery) => {
    setLoading(true);
    setError(null);
    try {
      const resp = await fetchStudents(q);
      setStudents(resp.students);
      setTotal(resp.total ?? 0);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Failed to load students");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    const q: StudentsQuery = { ...filters, page, pageSize };
    (async () => {
      try {
        await load(q);
        if (!mounted) return;
        if (initialMountRef.current) {
          initialMountRef.current = false;
          try {
            const resp = await fetchClasses({ pageSize: 1000 });
            if (!mounted) return;
            setClasses(resp.classes ?? []);
          } catch {
            // ignore — keep empty
          }
        }
      } catch {
        // load already handles errors
      }
    })();
    return () => {
      mounted = false;
    };
  }, [filters, page, pageSize, load]);

  const handleApply = useCallback(
    (f: StudentsFilters) => {
      setFilters(f);
      setPage(1);
    },
    [setFilters, setPage],
  );

  const handleClear = useCallback(() => {
    setFilters({});
    setPage(1);
  }, [setFilters, setPage]);

  const [creatingOpen, setCreatingOpen] = useState(false);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  // const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
  //   null,
  // );

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
          <CreateStudentDialog
            open={creatingOpen}
            classes={classes}
            onClose={() => setCreatingOpen(false)}
            onCreated={() => {
              // refresh list after creation
              void load({ ...filters, page, pageSize });
            }}
          />
        </div>
      </div>

      <div className="mb-4">
        <StudentsFilterBar
          classes={classes}
          initial={filters}
          onApply={handleApply}
          onClear={handleClear}
        />
      </div>

      <StudentsTable
        students={students}
        loading={loading}
        error={error}
        total={total}
        page={page}
        pageSize={pageSize}
        onRetry={() => load({ ...filters, page, pageSize })}
        onPageChange={(p) => setPage(p)}
        onView={(id) => router.push(`/admin/students/profile/${id}`)}
        onEdit={(id) => setEditingStudentId(id)}
      />

      <UpdateStudentDialog
        open={Boolean(editingStudentId)}
        studentId={editingStudentId}
        onClose={() => setEditingStudentId(null)}
        onUpdated={() => {
          void load({ ...filters, page, pageSize });
        }}
      />
    </div>
  );
}
