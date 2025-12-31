"use client";
import React from "react";
import StudentAuthGuard from "../../../components/student/AuthGuard";
import studentApi from "../../../lib/studentApi";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { useToast } from "../../../components/ui/use-toast";
import { useRouter } from "next/navigation";

export default function Page() {
  return (
    <StudentAuthGuard>
      <Inner />
    </StudentAuthGuard>
  );
}

function Inner() {
  const [me, setMe] = React.useState<any>(null);
  const [summary, setSummary] = React.useState<any>(null);
  const { toast } = useToast();
  const toastRef = React.useRef(toast);
  const router = useRouter();

  React.useEffect(() => {
    toastRef.current = toast;
  }, [toast]);

  React.useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const [r1, r2] = await Promise.all([
          studentApi.get("/api/student/me"),
          studentApi.get("/api/student/attendance"),
        ]);
        if (!mounted) return;
        setMe(r1.data);
        setSummary(r2.data);
      } catch (err: any) {
        toastRef.current?.({
          title: "Error",
          description: err?.message ?? "Failed to load",
          type: "error",
        });
      }
    }
    load();
    return () => {
      mounted = false;
    };
    // run once on mount — toast is referenced via ref to avoid re-running when its identity changes
  }, []);

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="flex items-center gap-6">
          <div>
            <img
              src={me?.profilePhoto ?? "/avatar.png"}
              alt="avatar"
              className="h-20 w-20 rounded-full object-cover"
            />
          </div>
          <div className="flex-1">
            <div className="text-lg font-semibold">{me?.name ?? "Student"}</div>
            <div className="text-sm text-slate-600">
              {me?.className ?? "Class"} • {me?.section ?? "Section"} • Roll{" "}
              {me?.rollNumber ?? "-"}
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={() => router.push("/student/attendance")}
            >
              View Attendance
            </Button>
            <Button
              variant="pill"
              onClick={() => router.push("/student/profile")}
            >
              My Profile
            </Button>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <Card>
            <div className="text-sm text-slate-500">Present %</div>
            <div className="text-2xl font-semibold mt-2">
              {summary?.presentPercent ?? "-"}%
            </div>
          </Card>
          <Card>
            <div className="text-sm text-slate-500">Total Days</div>
            <div className="text-2xl font-semibold mt-2">
              {summary?.totalDays ?? "-"}
            </div>
          </Card>
          <Card>
            <div className="text-sm text-slate-500">Absent Days</div>
            <div className="text-2xl font-semibold mt-2">
              {summary?.absentDays ?? "-"}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
