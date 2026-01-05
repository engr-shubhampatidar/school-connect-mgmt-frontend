"use client";
import React, { useCallback, useEffect, useState, useRef } from "react";
import { fetchClasses, ClassItem, ClassesQuery } from "../../../lib/adminApi";
import ClassesTable from "../../../components/admin/ClassesTable";
import Button from "../../../components/ui/Button";
import Timetable from "../../../components/admin/Timetable";
import ClassSubjectsManager from "../../../components/admin/ClassSubjectsManager";
import CreateClassDialog from "../../../components/admin/CreateClassDialog";
import StatCard from "@/components/admin/StatCard";
import API from "../../../lib/axios";
import {
  Users,
  BookOpen,
  ClipboardList,
  Users as UsersIcon,
} from "lucide-react";

export default function AdminClassesPage() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [groups, setGroups] = useState<any[] | undefined>(undefined);
  const [stats, setStats] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);
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
    [page, pageSize]
  );

  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const res = await API.get("/api/admin/classes/dashboard");
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
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);

  return (
    <div className="mx-auto px-4 py-6">
      <section>
        <h1 className="text-2xl font-semibold text-slate-900">Classes</h1>
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="mt-1 text-sm text-slate-600">
              Manage school classes and sections.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button onClick={() => setCreatingOpen(true)}>Add Class</Button>
            <select
              value={selectedClassId ?? ""}
              onChange={(e) => setSelectedClassId(e.target.value || null)}
              className="ml-2 p-2 border rounded"
            >
              <option value="">Select class to view timetable</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                  {c.section ? ` - ${c.section}` : ""}
                </option>
              ))}
            </select>
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

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 my-4">
        <div>
          {statsLoading ? (
            <div className="animate-pulse">
              <div className="h-20 rounded bg-slate-200" />
            </div>
          ) : (
            <StatCard
              label="Total Classes"
              value={stats?.totalClasses ?? stats?.total ?? "-"}
              icon={BookOpen}
              className="bg-[#FFFFFF] border-[#BFDBFE]"
              iconBgColor="bg-[#BFDBFE]"
              progressLabel={"Updated"}
            />
          )}
        </div>

        <div>
          {statsLoading ? (
            <div className="animate-pulse">
              <div className="h-20 rounded bg-slate-200" />
            </div>
          ) : (
            <StatCard
              label="Total Sections"
              value={stats?.totalSections ?? "-"}
              icon={Users}
              className="bg-[#FFFFFF] border-[#FED7AA]"
              iconBgColor="bg-[#DDD6FE]"
              progressLabel={"Updated"}
            />
          )}
        </div>

        <div>
          {statsLoading ? (
            <div className="animate-pulse">
              <div className="h-20 rounded bg-slate-200" />
            </div>
          ) : (
            <StatCard
              label="Total Students"
              value={stats?.totalStudents ?? "-"}
              icon={ClipboardList}
              className="bg-[#FFFFFF] border-[#DDD6FE]"
              iconBgColor="bg-[#FED7AA]"
              progressLabel={"Updated"}
            />
          )}
        </div>

      </section>

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
      {selectedClassId && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Timetable classId={selectedClassId} />
          </div>
          <div>
            <ClassSubjectsManager classId={selectedClassId} />
          </div>
        </div>
      )}
    </div>
  );
}
