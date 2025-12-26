"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../../../lib/axios";
import { ADMIN_API } from "../../../lib/api-routes";
import {
  BookOpen,
  ClipboardList,
  UserPlus,
  Users,
  CreditCard,
  FileText,
} from "lucide-react";
import StatCard from "../../../components/admin/StatCard";
import AttendanceOverviewCard from "./Components/AttendanceOverviewCard";
import QuickActionsCard from "./Components/QuickActionsCard";
import RecentStudents from "@/components/admin/RecentStudents";
import NoticeBoardCard from "./Components/NoticeBoardCard";

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
    <div className="container mx-auto px-4 py-6 ">
      <section>
        <h3 className="text-2xl font-semibold pl-4">Welcomeback, Acme Inc.</h3>
        <div className="text-sm text-slate-500">&nbsp;</div>
      </section>

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
              className="bg-[#EFF6FF] border-[#BFDBFE]"
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
              className="bg-[#FFF7ED] border-[#FED7AA]"
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
              className="bg-[#F5F3FF] border-[#DDD6FE]"
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
              label="School ID"
              className="bg-[#FEF2F2] border-[#FECACA]"
              value={shortId(data?.schoolId)}
            />
          )}
        </div>
      </section>
      <div className="flex flex-col">
        <section className="flex flex-row  gap-6 mt-6">
          <AttendanceOverviewCard
            data={[
              { month: "Jan", value: 80 },
              { month: "Feb", value: 60 },
              { month: "Mar", value: 75 },
              { month: "Apr", value: 40 },
              { month: "May", value: 65 },
              { month: "Jun", value: 55 },
            ]}
          />
          <QuickActionsCard
            actions={[
              {
                label: "Add Student",
                icon: <UserPlus size={16} />,
                active: true,
              },
              {
                label: "Add student",
                icon: <Users size={16} />,
              },
              {
                label: "Collect fees",
                icon: <CreditCard size={16} />,
              },
              {
                label: "Publish result",
                icon: <FileText size={16} />,
              },
            ]}
          />
        </section>
        <section className="flex flex-row gap-6 mt-6">
              <div className="w-full">
                <RecentStudents
                  students={data?.recentStudents ?? null}
                  loading={loading}
                  error={error}
                  onRetry={fetchData}
                />
              </div>
          <NoticeBoardCard
            notices={[
              {
                title: "Please check the marked fields",
                message:
                  "There was a problem, please check the indicated fields.",
                variant: "success",
              },
              {
                title: "Please check the marked fields",
                message: "There was a problem, please",
                variant: "info",
              },
              {
                title: "Please check the marked fields",
                message: "There was a problem, please",
                variant: "error",
              },
            ]}
          />
        </section>
      </div>
    </div>
  );
}
