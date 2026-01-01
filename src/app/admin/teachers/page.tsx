"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { fetchTeachers, Teacher, TeachersQuery } from "../../../lib/adminApi";
import TeachersFilterBar, {
  TeachersFilters,
} from "../../../components/admin/TeachersFilterBar";
import TeachersTable from "../../../components/admin/TeachersTable";
import Button from "../../../components/ui/Button";
import CreateTeacherDialog from "../../../components/admin/CreateTeacherDialog";
import StatCard from "../../../components/admin/StatCard";
import { Users, BookOpen, ClipboardList } from "lucide-react";

export default function AdminTeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);

  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);

  const [filters, setFilters] = useState<TeachersFilters>({});

  const [creatingOpen, setCreatingOpen] = useState(false);

  const controllerRef = useRef<AbortController | null>(null);
  const lastFetchRef = useRef<number | null>(null);

  const load = useCallback(
    async (q?: TeachersQuery) => {
      const now = Date.now();
      if (lastFetchRef.current && now - lastFetchRef.current < 300) return;
      lastFetchRef.current = now;
      setLoading(true);
      setError(null);
      try {
        // Cancel previous pending request to avoid duplicate fetches
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
        // ignore abort errors
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
    [page, pageSize]
  );

  useEffect(() => {
    const q: TeachersQuery = { ...filters, page, pageSize };
    void load(q);
    return () => {
      // cancel any pending request when effect cleans up
      if (controllerRef.current) {
        controllerRef.current.abort();
        controllerRef.current = null;
      }
    };
  }, [filters, page, pageSize, load]);

  const handleApply = useCallback((f: TeachersFilters) => {
    setFilters(f);
    setPage(1);
  }, []);

  const handleClear = useCallback(() => {
    setFilters({});
    setPage(1);
  }, []);

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
          />
        </div>
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-5">
        <div>
          {loading ? (
            <div className="animate-pulse">
              <div className="h-20 rounded bg-slate-200" />
            </div>
          ) : (
            <StatCard
              label="Total Staff"
              value={teachers.length.toString()}
              icon={Users}
              className="bg-[#FFFFFF] border-[#D7E3FC]"
              iconBgColor="bg-[#BFDBFE]"
              progressLabel="+180 Last Month"
              progressLabelColor="text-slate-500"
            />
          )}
        </div>

        <div>
          {loading ? (
            <div className="animate-pulse">
              <div className="h-20 rounded bg-slate-200" />
            </div>
          ) : (
            <StatCard
              label="Present Today"
              value={"08"}
              icon={BookOpen}
              className="bg-[#FFFFFF] border-[#D7E3FC]"
              iconBgColor="bg-[#DDD6FE]"
              progressLabel="80% Attendance Rate"
              progressLabelColor="text-[#16A34A]"
            />
          )}
        </div>
        <div>
          {loading ? (
            <div className="animate-pulse">
              <div className="h-20 rounded bg-slate-200" />
            </div>
          ) : (
            <StatCard
              label="On Leave"
              value={"02"}
              icon={ClipboardList}
              className="bg-[#FFFFFF] border-[#D7E3FC]"
              iconBgColor="bg-[#FED7AA]"
              progressLabel="1 sick leave 1 casual leave"
              progressLabelColor="text-slate-500"
            />
          )}
        </div>
        <div>
          {loading ? (
            <div className="animate-pulse">
              <div className="h-20 rounded bg-slate-200" />
            </div>
          ) : (
            <StatCard
              label="Avg Faculty Load"
              value={"22h"}
              icon={BookOpen}
              className="bg-[#FFFFFF] border-[#D7E3FC]"
              iconBgColor="bg-[#DDD6FE]"
              progressLabel="Peer weak / Teacher"
              progressLabelColor="text-slate-500"
            />
          )}
        </div>
      </section>

      <div className="mb-5">
        <TeachersFilterBar
          initial={filters}
          onApply={handleApply}
          onClear={handleClear}
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
        onEdit={(id) => console.log("edit", id)}
        onResendInvite={(id) => console.log("resend invite", id)}
      />
    </div>
  );
}
