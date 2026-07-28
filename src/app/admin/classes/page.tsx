"use client";
import React, { useCallback, useEffect, useState, useRef } from "react";
import { fetchClasses, ClassItem, ClassesQuery } from "../../../lib/adminApi";
import ClassesTable from "../../../components/admin/ClassesTable";
import Button from "../../../components/ui/Button";
import CreateClassDialog from "../../../components/admin/CreateClassDialog";
import API from "../../../lib/axios";
import { UsersIcon, BookOpen, ClipboardList } from "lucide-react";
import ClassesFilterBar from "../../../components/admin/ClassesFilterBar";
import CreateNewClass from "@/components/admin/CreateNewClass";
import { ADMIN_API } from "@/lib/api-routes";

export default function AdminClassesPage() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [groups, setGroups] = useState<any[] | undefined>(undefined);
  const [stats, setStats] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [open, setOpen] = useState(false);
  const mountedRef = useRef(false);
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);

  const load = useCallback(
    async (q?: ClassesQuery) => {
      setLoading(true);
      setError(null);
      try {
        const resp = await fetchClasses(q ?? { page, pageSize });
        setClasses(resp.classes ?? []);
        setGroups((resp as any).groups ?? undefined);
        setTotal(resp.total ?? resp.classes.length ?? 0);
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError("Failed to load classes");
      } finally {
        setLoading(false);
      }
    },
    [page, pageSize],
  );

  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const res = await API.get(ADMIN_API.CLASS_DASHBOARD);
      setStats(res.data ?? null);
    } catch (err) {
      setStats(null);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    void load({ page, pageSize });
    if (!mountedRef.current) {
      mountedRef.current = true;
      void fetchStats();
    }
  }, [load, page, pageSize]);

  const [creatingOpen, setCreatingOpen] = useState(false);

  return (
    <div className="mx-auto px-4 py-6">
      <section>
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-[24px] text-[#021034] font-[600]">
              Classes & Sections
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Manage, view and organize all classes and sections
            </p>
          </div>

          <div>
            <Button variant="dark" onClick={() => setOpen(true)}>
              + Add New Class
            </Button>
            <CreateNewClass
              isOpen={open}
              onClose={() => setOpen(false)}
            ></CreateNewClass>
            <CreateClassDialog
              open={creatingOpen}
              onClose={() => setCreatingOpen(false)}
              onCreated={() => {
                void load({ page, pageSize });
              }}
            />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 my-4 ">
        <div className={` rounded-lg border border-[#D7E3FC] bg-white p-6`}>
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-500">Total Classes</div>
            <div className="rounded bg-[#BFDBFE] p-1.5">
              <BookOpen className="h-4 w-4 text-slate-700" />
            </div>
          </div>
          <div className="mt-4 text-3xl font-bold">
            {stats?.totalClasses ?? "0"}
          </div>
        </div>
        <div className={` rounded-lg border border-[#D7E3FC] bg-white p-6`}>
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-500">Total Sections</div>
            <div className="rounded bg-[#BFDBFE] p-1.5">
              <ClipboardList className="h-4 w-4 text-slate-700" />
            </div>
          </div>
          <div className="mt-4 text-3xl font-bold">
            {stats?.totalSections ?? "0"}
          </div>
        </div>
        <div className={` rounded-lg border border-[#D7E3FC] bg-white p-6`}>
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-500">Total Students</div>
            <div className="rounded bg-[#BFDBFE] p-1.5">
              <UsersIcon className="h-4 w-4 text-slate-700" />
            </div>
          </div>
          <div className="mt-4 text-3xl font-bold">
            {stats?.totalStudents ?? "0"}
          </div>
        </div>
      </section>

      <div className="mb-6">
        <ClassesFilterBar />
      </div>

      <ClassesTable
        classes={groups ?? classes}
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
