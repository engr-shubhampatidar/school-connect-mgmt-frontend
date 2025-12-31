"use client";
import React, { useCallback, useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  fetchStudents,
  fetchClasses,
  Student,
  StudentsQuery,
  ClassItem,
} from "../../../lib/adminApi";
import StudentsFilterBar, {
  StudentsFilters,
} from "../../../components/admin/StudentsFilterBar";
import StudentsTable from "../../../components/admin/StudentsTable";
import Button from "../../../components/ui/Button";
import CreateStudentDialog from "../../../components/admin/CreateStudentDialog";

export default function AdminStudentsPage() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);

  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);

  const [filters, setFilters] = useState<StudentsFilters>({});
  const initialMountRef = useRef(true);

  const load = useCallback(async (q: StudentsQuery) => {
    setLoading(true);
    setError(null);
    try {
      const resp = await fetchStudents(q);
      setStudents(resp.students ?? []);
      setTotal(resp.total ?? resp.students.length ?? 0);
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
    [setFilters, setPage]
  );

  const handleClear = useCallback(() => {
    setFilters({});
    setPage(1);
  }, [setFilters, setPage]);

  const [creatingOpen, setCreatingOpen] = useState(false);
  const [classes, setClasses] = useState<ClassItem[]>([]);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Students</h1>
          <p className="mt-1 text-sm text-slate-600">
            Manage student records, search, and filter.
          </p>
        </div>

        <div>
          <Button onClick={() => setCreatingOpen(true)}>Add Student</Button>
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
        onView={(id) => console.log("view", id)}
        onEdit={(id) => router.push(`/admin/students/${id}/edit`)}
      />
    </div>
  );
}
