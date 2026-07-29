"use client";
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";
import {
  fetchTeachers,
  type Teacher,
  type TeachersQuery,
  TeachersFilterBar,
  type TeachersFilters,
  TeachersTable,
  CreateTeacherDialog,
  TeachersPageSkeleton,
} from "@/modules/teachers";
import { fetchSubjects, type Subject } from "@/modules/subjects";
import { fetchClasses, type ClassItem } from "@/modules/classes";
import Button from "@/components/ui/Button";
import StatCard from "@/components/admin/StatCard";
import { Users, BookOpen, ClipboardList } from "lucide-react";

export default function AdminTeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);

  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);

  const [creatingOpen, setCreatingOpen] = useState(false);
  const [filters, setFilters] = useState<TeachersFilters>({});

  const controllerRef = useRef<AbortController | null>(null);
  const lastFetchRef = useRef<number | null>(null);
  const fetchedRelatedRef = useRef<boolean>(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);

  const subjectOptions = useMemo(
    () => subjects.map((s) => ({ id: s.id, name: s.name })),
    [subjects],
  );

  const classOptions = useMemo(() => {
    return classes.map((c) => ({ id: c.id, name: c.name }));
  }, [classes]);

  const load = useCallback(
    async (q?: TeachersQuery) => {
      const now = Date.now();
      if (lastFetchRef.current && now - lastFetchRef.current < 300) return;
      lastFetchRef.current = now;
      setLoading(true);
      setError(null);
      try {
        if (controllerRef.current) {
          controllerRef.current.abort();
        }
        const ctrl = new AbortController();
        controllerRef.current = ctrl;

        const resp = await fetchTeachers(q ?? { page, pageSize }, {
          signal: ctrl.signal,
        });
        setTeachers(resp.teachers ?? []);
        setTotal(resp.total ?? resp.teachers.length ?? 0);
      } catch (err: unknown) {
        if (err instanceof Error) {
          const e = err as unknown as Record<string, unknown>;
          const name = typeof e.name === "string" ? e.name : undefined;
          const code = typeof e.code === "string" ? e.code : undefined;
          if (name === "CanceledError" || code === "ERR_CANCELED") return;
          setError(err.message);
        } else setError("Failed to load teachers");
      } finally {
        setLoading(false);
      }
    },
    [page, pageSize],
  );

  useEffect(() => {
    const q: TeachersQuery = { ...filters, page, pageSize };
    void load(q);
    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort();
        controllerRef.current = null;
      }
    };
  }, [filters, page, pageSize, load]);

  useEffect(() => {
    if (loading) return;
    if (!teachers || teachers.length === 0) return;
    if (fetchedRelatedRef.current) return;
    fetchedRelatedRef.current = true;

    let mounted = true;
    (async () => {
      try {
        const [clsResp, subjResp] = await Promise.all([
          fetchClasses({ pageSize: 1000 }),
          fetchSubjects({ pageSize: 1000 }),
        ]);
        if (!mounted) return;
        setClasses(clsResp.classes ?? []);
        setSubjects(subjResp.subjects ?? []);
      } catch {
        // ignore related load errors
      }
    })();
    return () => {
      mounted = false;
    };
  }, [loading, teachers]);

  const handleApply = useCallback((f: TeachersFilters) => {
    setFilters(f);
    setPage(1);
  }, []);

  const handleClear = useCallback(() => {
    setFilters({});
    setPage(1);
  }, []);

  const isInitialLoad = loading && teachers.length === 0 && !error;

  if (isInitialLoad) {
    return <TeachersPageSkeleton />;
  }

  return (
    <div className=" mx-auto px-4 py-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Teacher Management
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Manage, view and organize all faculty mambers
          </p>
        </div>

        <div>
          <Button variant="dark" onClick={() => setCreatingOpen(true)}>
            + Add Teacher
          </Button>
          <CreateTeacherDialog
            open={creatingOpen}
            onClose={() => setCreatingOpen(false)}
            onCreated={() => {
              void load({ ...filters, page, pageSize });
            }}
            subjectsProp={subjectOptions}
          />
        </div>
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-5">
        <StatCard
          label="Total Staff"
          value={teachers.length.toString()}
          icon={Users}
          className="bg-[#FFFFFF] border-[#D7E3FC]"
          iconBgColor="bg-[#BFDBFE]"
          progressLabel="+180 Last Month"
          progressLabelColor="text-slate-500"
        />
        <StatCard
          label="Present Today"
          value={"08"}
          icon={BookOpen}
          className="bg-[#FFFFFF] border-[#D7E3FC]"
          iconBgColor="bg-[#DDD6FE]"
          progressLabel="80% Attendance Rate"
          progressLabelColor="text-[#16A34A]"
        />
        <StatCard
          label="On Leave"
          value={"02"}
          icon={ClipboardList}
          className="bg-[#FFFFFF] border-[#D7E3FC]"
          iconBgColor="bg-[#FED7AA]"
          progressLabel="1 sick leave 1 casual leave"
          progressLabelColor="text-slate-500"
        />
        <StatCard
          label="Avg Faculty Load"
          value={"22h"}
          icon={BookOpen}
          className="bg-[#FFFFFF] border-[#D7E3FC]"
          iconBgColor="bg-[#DDD6FE]"
          progressLabel="Peer weak / Teacher"
          progressLabelColor="text-slate-500"
        />
      </section>

      <div className="mb-5">
        <TeachersFilterBar
          initial={filters}
          onApply={handleApply}
          onClear={handleClear}
          subjectOptions={subjectOptions}
          classOptions={classOptions}
        />
      </div>

      <TeachersTable
        teachers={teachers}
        loading={loading}
        error={error}
        total={total}
        page={page}
        pageSize={pageSize}
        onRetry={() => load({ ...filters, page, pageSize })}
        onPageChange={(p) => setPage(p)}
      />
    </div>
  );
}
