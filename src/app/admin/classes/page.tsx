"use client";
import React, { useCallback, useEffect, useState } from "react";
import { fetchClasses, ClassItem, ClassesQuery } from "../../../lib/adminApi";
import ClassesTable from "../../../components/admin/ClassesTable";
import Button from "../../../components/ui/Button";
import CreateClassDialog from "../../../components/admin/CreateClassDialog";

export default function AdminClassesPage() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);

  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);

  const load = useCallback(
    async (q?: ClassesQuery) => {
      setLoading(true);
      setError(null);
      try {
        const resp = await fetchClasses(q ?? { page, pageSize });
        setClasses(resp.classes ?? []);
        setTotal(resp.total ?? resp.classes.length ?? 0);
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError("Failed to load classes");
      } finally {
        setLoading(false);
      }
    },
    [page, pageSize]
  );

  useEffect(() => {
    void load({ page, pageSize });
  }, [load, page, pageSize]);

  const [creatingOpen, setCreatingOpen] = useState(false);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Classes</h1>
          <p className="mt-1 text-sm text-slate-600">
            Manage school classes and sections.
          </p>
        </div>

        <div>
          <Button onClick={() => setCreatingOpen(true)}>Add Class</Button>
          <CreateClassDialog
            open={creatingOpen}
            onClose={() => setCreatingOpen(false)}
            onCreated={() => {
              void load({ page, pageSize });
            }}
          />
        </div>
      </div>

      <ClassesTable
        classes={classes}
        loading={loading}
        error={error}
        total={total}
        page={page}
        pageSize={pageSize}
        onRetry={() => void load({ page, pageSize })}
        onPageChange={(p) => setPage(p)}
        onEdit={(id) => console.log("edit class", id)}
        onAssignTeacher={() => void load({ page, pageSize })}
        onChangeTeacher={() => void load({ page, pageSize })}
      />
    </div>
  );
}
