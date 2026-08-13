"use client";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  ClipboardList,
  UserPlus,
  Users,
  CreditCard,
  FileText,
} from "lucide-react";
import StatCard from "@/components/admin/StatCard";
import {
  AttendanceOverviewCard,
  QuickActionsCard,
  RecentStudents,
  NoticeBoardCard,
  AdminDashboardSkeleton,
  getAdminDashboard,
  type AdminDashboardResponse,
} from "@/modules/dashboard";
import { getUser } from "@/modules/auth";
import { fetchFeeDashboard, formatInr } from "@/modules/fees";

export default function AdminDashboardPage() {
  const [data, setData] = useState<AdminDashboardResponse | null>(null);
  const [pendingFees, setPendingFees] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(false);
  const router = useRouter();

  const [user, setUser] = useState<{
    name?: string;
    email?: string;
    role?: string;
  } | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [dashboardData, feeStats] = await Promise.all([
        getAdminDashboard(),
        fetchFeeDashboard().catch(() => null),
      ]);
      setData(dashboardData);
      setPendingFees(feeStats?.totalOutstanding ?? null);
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
    if (mountedRef.current) return;
    mountedRef.current = true;
    fetchData();
  }, []);

  useEffect(() => {
    try {
      const u = getUser("admin");
      setUser(u);
    } catch {
      setUser(null);
    }
  }, []);

  if (loading) {
    return <AdminDashboardSkeleton />;
  }

  return (
    <div className=" px-6 py-6 ">
      <section>
        <h3 className="text-[20px] text-[#021034] font-semibold pl-4">
          Welcomeback, {user?.name ?? "Admin"}
        </h3>
        <div className="text-sm text-slate-500">&nbsp;</div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Students"
          value={data?.totalStudents ?? "-"}
          icon={Users}
          className="bg-[#FFFFFF] border-[#BFDBFE]"
          iconBgColor="bg-[#BFDBFE]"
          progressLabel="+180 Last Month"
          progressLabelColor="text-[#16A34A]"
        />
        <StatCard
          label="Total Staff"
          value={data?.totalTeachers ?? "-"}
          icon={BookOpen}
          className="bg-[#FFFFFF] border-[#FED7AA]"
          iconBgColor="bg-[#DDD6FE]"
          progressLabel="+2 new Hire"
          progressLabelColor="text-[#16A34A]"
        />
        <StatCard
          label="Today’s Attendance"
          value={"95.60%"}
          icon={ClipboardList}
          className="bg-[#FFFFFF] border-[#DDD6FE]"
          iconBgColor="bg-[#FED7AA]"
          progressLabel="+1.2% from yesterday"
          progressLabelColor="text-[#16A34A]"
        />
        <StatCard
          label="Pending Fees"
          className="bg-[#FFFFFF] border-[#FECACA]"
          value={
            pendingFees === null ? "—" : formatInr(pendingFees)
          }
          iconBgColor="bg-[#FECACA]"
          icon={CreditCard}
          progressLabel="Outstanding balance"
          progressLabelColor="text-[#FF3838]"
        />
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
                onClick: () => router.push("/admin/students"),
              },
              {
                label: "Add Teacher",
                icon: <Users size={16} />,
                onClick: () => router.push("/admin/teachers"),
              },
              {
                label: "Collect fees",
                icon: <CreditCard size={16} />,
                onClick: () => router.push("/admin/fees"),
              },
              {
                label: "Publish result",
                icon: <FileText size={16} />,
                onClick: () => router.push("/admin/results"),
              },
            ]}
          />
        </section>
        <section className="flex flex-row gap-6 mt-6">
          <div className="w-full">
            <RecentStudents
              students={data?.recentStudents ?? null}
              loading={false}
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
