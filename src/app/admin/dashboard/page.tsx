"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../../../lib/axios";
import { ADMIN_API } from "../../../lib/api-routes";
import { Users, BookOpen, ClipboardList } from "lucide-react";
import StatCard from "../../../components/admin/StatCard";
import RecentStudents from "../../../components/admin/RecentStudents";

type DashboardResp = {
  schoolId: string;
  totalStudents: number;
  totalClasses: number;
  totalTeachers: number;
  recentStudents: { id: string; name: string; createdAt: string }[];
};

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardResp | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.get<DashboardResp>(ADMIN_API.DASHBOARD);
      setData(res.data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ?? err.message ?? "Failed to load"
        );
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to load");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const shortId = (id?: string) =>
    id ? `${id.slice(0, 8)}...${id.slice(-4)}` : "-";

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">
          Admin Dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-600">Overview of your school</p>
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          {loading ? (
            <div className="animate-pulse">
              <div className="h-20 rounded bg-slate-200" />
            </div>
          ) : (
            <StatCard
              label="Total Students"
              value={data?.totalStudents ?? "-"}
              icon={Users}
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
              label="Total Classes"
              value={data?.totalClasses ?? "-"}
              icon={BookOpen}
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
              label="Total Teachers"
              value={data?.totalTeachers ?? "-"}
              icon={ClipboardList}
            />
          )}
        </div>

        <div>
          {loading ? (
            <div className="animate-pulse">
              <div className="h-20 rounded bg-slate-200" />
            </div>
          ) : (
            <StatCard label="School ID" value={shortId(data?.schoolId)} />
          )}
        </div>
      </section>

      <div className="mt-6">
        <RecentStudents
          students={data?.recentStudents ?? null}
          loading={loading}
          error={error}
          onRetry={fetchData}
        />
      </div>
    </div>
  );
}
